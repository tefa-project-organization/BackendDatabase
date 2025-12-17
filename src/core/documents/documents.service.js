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


  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.documents.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.documents.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.documents.findUnique({ where: { id } });
    return data;
  };

create = async (payload, documentFile) => {
  return await this.db.$transaction(async (tx) => {
    const document = await tx.documents.create({
      data: {
        number: payload.number,
        date_created: new Date(),
        date_signed: payload.date_signed,
        project_id: payload.project_id,
        client_id: payload.client_id,
        client_pic_id: payload.client_pic_id,
        document_types: payload.document_types_id
          ? { connect: { id: payload.document_types_id } }
          : undefined,
      },
    });

    if (documentFile) {
      const documentUrl = await this.uploadDocument(documentFile, document.id);

      await tx.documents.update({
        where: { id: document.id },
        data: { document_url: documentUrl },
      });

      document.document_url = documentUrl;
    }

    return document;
  });
};


  update = async (id, payload) => {
    const data = await this.db.documents.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.documents.delete({ where: { id } });
    return data;
  };
}

export default documentsService;  
