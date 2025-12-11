import { PrismaClient } from '@prisma/client';
import { hash } from '../../src/helpers/bcrypt.helper.js';

const prisma = new PrismaClient();

export async function seedUsers() {
<<<<<<< HEAD
  const password = await hash('Admin123');

  return await prisma.users.upsert({
    where: { email: "kontol@example.com" },
    update: {},
    create: {
      username: "elganteng",
      email: "kontol@example.com",
      password: password,
      profile_image: "https://example.com/profiles/admin1.jpg",
      bio: "el kontol ajg",
      status: true,
    },
  });
}


main()
  .then(async () => {
    await prisma.$disconnect();   // WAJIB
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();   // WAJIB
    process.exit(1);
=======
  console.log('Seeding Users...');

  const password = await hash('Admin123'); // compute once

  const user1 = await prisma.users.upsert({
    where: { email: "admin1@example.com" },
    update: {       
    },
    create: {
      fullName: "Admin1",
      email: "admin1@example.com",
      password,
      duration: new Date(),
      status: true,
      is_shadow_banned: false
    }
  });

  return { user1 };
}

seedUsers()
  .catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
>>>>>>> 602636c1cb4d5c46af670cbab215fbaa78faaa92
  });
