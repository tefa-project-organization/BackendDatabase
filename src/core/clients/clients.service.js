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
    const data = await this.db.clients.findUnique({ where: { id: Number(id) } });
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

    const filteredPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => {
      if (value === undefined) return false;
      if (value === null) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    })
  );

    const clients_Id = Number(id);
    const updated = await this.db.clients.update({
      where: { id: clients_Id },
      data: filteredPayload
    });

    return updated;
  };

  delete = async (id) => {
    const team = await this.db.clients.findUnique({ where: { id: Number(id) } });
      if (!team) {
        throw new Error("Clients tidak ditemukan");
      } 
    const deleted = await this.db.clients.delete({ where: { id: Number(id) } });

    if (team?.project_id) await this.recalc(team.project_id);

    return deleted;
  };
}

export default clientsService;  
