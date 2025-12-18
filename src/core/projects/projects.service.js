import BaseService from "../../base/service.base.js";
import prisma from "../../config/prisma.db.js";


class ProjectsService extends BaseService {
  constructor() {
    super(prisma);
  }

  generateProjectCode = async () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  while (true) {
    const randomLetters =
      letters[Math.floor(Math.random() * 26)] +
      letters[Math.floor(Math.random() * 26)];

    const randomNumbers = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");

    const code = `${randomLetters}-${randomNumbers}`;

    const exists = await this.db.projects.findUnique({
      where: { project_code: code },
      select: { id: true }
    });

    if (!exists) return code;
  }
};

  // ================================================
  // HITUNG NILAI KONTRAK PROJECT DARI SEMUA TEAM + MEMBER
  // ================================================
  calculateContractValue = async (projectId) => {
    const teams = await this.db.project_teams.findMany({
      where: { project_id: projectId },
      include: {
        project_team_members: {
          include: { role_levels: true }
        }
      }
    });

    let total = 0;

    for (const team of teams) {
      for (const member of team.project_team_members) {
        const price = Number(member.role_levels?.role_price || 0);
        total += price;
      }
    }

    return total;
  };

  recalcAndUpdateContractValue = async (projectId) => {
    const newValue = await this.calculateContractValue(projectId);

    return await this.db.projects.update({
      where: { id: projectId },
      data: { contract_value: newValue }
    });
  };

  findAll = async (query) => {
  const q = this.transformBrowseQuery(query);

  q.where = {
    ...q.where,
    is_deleted: false
  };

  const data = await this.db.projects.findMany(q);

  if (query.paginate) {
    const countData = await this.db.projects.count({ where: q.where });
    return this.paginate(data, countData, q);
  }

  return data;
};


  findById = async (id) => {
  const projectId = Number(id);
  if (isNaN(projectId)) {
    throw new Error("project_id harus berupa angka");
  }

  return await this.db.projects.findFirst({
    where: {
      id: projectId,
      is_deleted: false
    },
    include: {
      project_teams: {
        include: {
          project_team_members: {
            include: {
              role_levels: true
            }
          }
        }
      }
    }
  });
};



  create = async (payload) => {
    const projectCode = await this.generateProjectCode();

    const project = await this.db.projects.create({
      data: {
        ...payload,
        project_code: projectCode,
        is_deleted: false,
        contract_value: 0 // default
      }
    });

    // Hitung ulang
    return this.recalcAndUpdateContractValue(project.id);
  };

  update = async (project_id, payload) => {
  const filteredPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => {
      if (value === undefined) return false;
      if (value === null) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    })
  );

  const id = Number(project_id);
  if (isNaN(id)) {
    throw new Error("project_id harus berupa angka");
  }

  const project = await this.findById(id);
  if (!project) {
    throw new Error("project tidak ditemukan atau sudah dihapus");
  }

  if (Object.keys(filteredPayload).length === 0) {
    return this.findById(id);
  }

  await this.db.projects.update({
    where: { id },
    data: filteredPayload,
  });

  return this.recalcAndUpdateContractValue(id);
};



  delete = async (id) => {
  const projectId = Number(id);
  if (isNaN(projectId)) {
    throw new Error("project_id harus berupa angka");
  }

  return await this.db.projects.update({
    where: { id: projectId },
    data: {
      is_deleted: true,
      deleted_at: new Date()
    }
  });
};

}

export default ProjectsService;
