import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

class employeesService extends BaseService {
  constructor() {
    super(prisma);
  }

findAll = async (query) => {
  const q = this.transformBrowseQuery(query);

  const data = await this.db.employees.findMany({
    ...q,
    select: {
      id: true,
      nik: true,
      nip: true,
      name: true,
      email: true,
      phone: true,
      address: true,

      position: {
        select: {
          id: true,
          position_name: true,
        },
      },

      status: {
        select: {
          id: true,
          status_name: true,
        },
      },

      department: {
        select: {
          id: true,
          department_name: true,
        },
      },
    },
  });

  const totalItems = await this.db.employees.count({ where: q.where });

  return {
    employees: data,
    meta: {
      total_items: totalItems,
      total_pages: Math.ceil(totalItems / q.take),
      current_page: q.page,
      limit: q.take,
    },
  };
};

  findById = async (id) => {
    const data = await this.db.employees.findUnique({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.employees.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.employees.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.employees.delete({ where: { id } });
    return data;
  };
}

export default employeesService;  
