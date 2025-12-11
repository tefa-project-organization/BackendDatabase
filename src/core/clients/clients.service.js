import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

class clientsService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.clients.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.clients.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.clients.findUnique({ where: { id } });
    return data;
  };

 create = async (payload) => {
  console.log("PAYLOAD MASUK:", payload);

  // Sanitasi field terlarang
  const {
    id,              // Hapus id agar tidak mengganggu autoincrement
    created_at,
    updated_at,
    ...clean         // Sisanya aman
  } = payload;

  const clients = await this.db.clients.create({
    data: clean,
  });

  return { data: clients };
};


  update = async (id, payload) => {
    const data = await this.db.clients.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.clients.delete({ where: { id } });
    return data;
  };
}

export default clientsService;  
