import BaseService from "../../base/service.base.js";
import prisma from "../../config/prisma.db.js";

class project_team_membersService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);

    const data = await this.db.project_team_members.findMany({
      ...q,
      include: {
        employees: true,
        project_teams: true,
        role_levels: true
      }
    });

    if (query.paginate) {
      const countData = await this.db.project_team_members.count({
        where: q.where
      });

      return this.paginate(data, countData, q);
    }

    return data;
  };

  findById = async (id) => {
    return this.db.project_team_members.findUnique({
      where: { id: Number(id) },
      include: {
        employees: true,
        project_teams: true,
        role_levels: true
      }
    });
  };

  create = async (payload) => {
    return this.db.project_team_members.create({
      data: payload
    });
  };

  update = async (id, payload) => {
    return this.db.project_team_members.update({
      where: { id: Number(id) },
      data: payload
    });
  };

  delete = async (id) => {
    return this.db.project_team_members.delete({
      where: { id: Number(id) }
    });
  };
}

export default project_team_membersService;
