  import BaseService from "../../base/service.base.js";
  import prisma from "../../config/prisma.db.js";
  import ProjectsService from "../projects/projects.service.js";

  class ProjectTeamMembersService extends BaseService {
    constructor() {
      super(prisma);
      this.projectsService = new ProjectsService(); // FIXED: buat instance
    }

    async recalc(teamId) {
      const team = await this.db.project_teams.findUnique({
        where: { id: teamId }
      });

      if (team?.project_id) {
        await this.projectsService.recalcAndUpdateContractValue(team.project_id);
      }
    }

    findAll = async (query) => {
  const q = this.transformBrowseQuery(query);

  q.where = {
    ...q.where,
  };

  const data = await this.db.project_team_members.findMany(q);

  if (query.paginate) {
    const countData = await this.db.project_team_members.count({ where: q.where });
    return this.paginate(data, countData, q);
  }

  return data;
};

    findById = async (id) => {
    const project_team_members_Id = Number(id);

    return await this.db.project_team_members.findFirst({
      where: {
        id: project_team_members_Id,
      },
      include: {
        role_levels: true
      }
    });
  };

    create = async (payload) => {
    const team_member = await this.db.project_team_members.findFirst({
      where: {
        project_teams_id: payload.project_teams_id,
        employee_id: payload.employee_id
      }
    });

    if (team_member) {
      throw new Error("Staff member udh di team");
    }

    const created = await this.db.project_team_members.create({
      data: payload
    });

    await this.recalc(payload.project_teams_id);
    return created;
  };


    update = async (id, payload) => {
  const memberId = Number(id);
  if (isNaN(memberId)) {
    throw new Error("project_team_members_id harus berupa angka");
  }

  // Ambil data lama
  const existing = await this.db.project_team_members.findUnique({
    where: { id: memberId }
  });

  if (!existing) {
    throw new Error("Project team member tidak ditemukan");
  }

  // Payload bersih
  const filteredPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => {
      if (value === undefined) return false;
      if (value === null) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    })
  );

  // Tentukan nilai final yang akan dipakai untuk cek duplikasi
  const finalProjectTeamId =
    filteredPayload.project_teams_id ?? existing.project_teams_id;

  const finalEmployeeId =
    filteredPayload.employee_id ?? existing.employee_id;

  // CEK DUPLIKASI 
  const duplicate = await this.db.project_team_members.findFirst({
    where: {
      project_teams_id: finalProjectTeamId,
      employee_id: finalEmployeeId,
      NOT: {
        id: memberId
      }
    }
  });

  if (duplicate) {
    throw new Error("Staff member udah ada di team tersebut");
  }

  // Update
  const updated = await this.db.project_team_members.update({
    where: { id: memberId },
    data: filteredPayload
  });

  // Recalc pakai project team lama (aman)
  await this.recalc(existing.project_teams_id);

  // Kalau team pindah, recalc team baru juga
  if (
    filteredPayload.project_teams_id &&
    filteredPayload.project_teams_id !== existing.project_teams_id
  ) {
    await this.recalc(filteredPayload.project_teams_id);
  }

  return updated;
};


    delete = async (id) => {
      const existing = await this.db.project_team_members.findUnique({ where: { id: Number(id) } });
      if (!existing) {
        throw new Error("project_team_members tidak ditemukan");
      }
      const deleted = await this.db.project_team_members.delete({ where: { id: Number(id) } });

      await this.recalc(existing.project_teams_id);
      return deleted;
    };
  }

  export default ProjectTeamMembersService;
