import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE, {
    auth: {
       persistSession: false,
       autoRefreshToken: false,
       detectSessionInUrl: false,
    }
  }
);

class documentsService extends BaseService {
  constructor() {
    super(prisma);
  }

  async uploadDocument(file, documentId) {
  if (!file) return null;

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
    throw new Error(
      "Supabase not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE env vars"
    );
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  if (file.size > MAX_SIZE) {
    throw new Error("Document too large");
  }

  const base = `${process.env.SUPABASE_URL}/storages/files/buckets/document_file`;

  const allowedMime = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedMime.includes(file.mimetype)) {
    throw new Error("Invalid document type");
  }

  const bucket = "document_file"; // use existing bucket from Supabase storage
  const path = `${documentId}-${Date.now()}-${file.originalname}`; // upload to bucket root

  // Try upload. If bucket missing or permissions error occurs, provide clear instruction
  const uploadRes = await supabase.storage.from(bucket).upload(path, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });

  if (uploadRes.error) {
    const lower = String(uploadRes.error.message || "").toLowerCase();
    if (lower.includes("bucket not found") || lower.includes("not found")) {
      throw new Error(
        `Bucket "${bucket}" not found in Supabase Storage. Create the bucket manually in Supabase Dashboard -> Storage and set it public (or provide a valid service role key with permission to create buckets).`
      );
    }
    if (lower.includes("row-level") || lower.includes("row-level security") || lower.includes("insufficient")) {
      throw new Error(
        'Supabase permission error while uploading: ensure you are using the project Service Role key (SUPABASE_SERVICE_ROLE) server-side, or create the bucket manually and grant proper permissions.'
      );
    }
    throw new Error(uploadRes.error.message || 'Upload failed');
  }

  const { data: publicData, error: publicErr } = await supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  if (publicErr) throw new Error(publicErr.message);

  return publicData.publicUrl;
}

async generateDocumentNumber() {
  const last = await this.db.documents.findFirst({
    where: { is_deleted: false },
    orderBy: { id: "desc" },
    select: { number: true },
  });

  if (!last || !last.number) return "DOC-001";

  const match = last.number.match(/DOC-(\d+)/);
  const next = match ? Number(match[1]) + 1 : 1;

  return `DOC-${String(next).padStart(3, "0")}`;
}

  async deleteDocumentFile(publicUrl) {
    if (!publicUrl) return;

    const bucket = "document_file";
    const path = publicUrl.split(`${bucket}/`)[1];
    if (!path) return;

    await supabase.storage.from(bucket).remove([path]);
  }


  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    q.where = {
    ...q.where,
    is_deleted: false
  };
    const data = await this.db.documents.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.documents.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.documents.findUnique({ where: { id: Number(id) } });
    return data;
  };

create = async (payload) => {
  const project = await this.db.projects.findUnique({
    where: { id: Number(payload.project_id) },
    include: { client_pics: true },
  });

  if (!project) throw new Error("Project tidak ditemukan");

  const number = await this.generateDocumentNumber();

  const document = await this.db.documents.create({
    data: {
      number,
      document_types: payload.document_types,
      date_signed: payload.date_signed
        ? new Date(payload.date_signed)
        : null,
      document_url: payload.document_url,

      projects: { connect: { id: project.id } },
      clients: { connect: { id: project.client_id } },

      ...(project.client_pics && {
        client_pics: { connect: { id: project.client_pics.id } },
      }),
    },
  });

  return document;
};





updateWithFile = async (id, payload, documentFile) => {
  return await this.db.$transaction(async (tx) => {
    const existing = await tx.documents.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      throw new Error("Document not found");
    }

    // update data non-file dulu
    const updated = await tx.documents.update({
      where: { id: Number(id) },
      data: {
        number: payload.number,
        date_signed: payload.date_signed,
        project_id: payload.project_id,
        client_id: payload.client_id,
        client_pic_id: payload.client_pic_id,
        document_types: payload.document_types_id
          ? { connect: { id: payload.document_types_id } }
          : undefined,
      },
    });

    // kalau tidak upload file → selesai
    if (!documentFile) return updated;

    // upload file baru
    const newUrl = await this.uploadDocument(documentFile, updated.id);

    await tx.documents.update({
      where: { id: updated.id },
      data: { document_url: newUrl },
    });

    try {
      await this.deleteDocumentFile(existing.document_url);
    } catch (err) {
      console.warn("Failed deleting old document:", err.message);
    }

    updated.document_url = newUrl;
    return updated;
  });
};

  delete = async (id) => {
    const data = await this.db.documents.update({  where: { id:  Number(id), }, data: { is_deleted: true }});
    return data;
  };
}

export default documentsService;  
