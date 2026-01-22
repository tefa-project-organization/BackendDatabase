import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

class Client_PICService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.client_pics.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.client_pics.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.client_pics.findUnique({ where: { id: Number(id) } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.client_pics.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.client_pics.update({  where: { id: Number(id) }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.client_pics.delete({ where: { id: Number(id) }});
    return data;
  };
}

export default Client_PICService;  
