import { PrismaClient } from '@prisma/client';
<<<<<<< HEAD

import { seedForum } from './seedForum.js';
import { seedThreads } from './seedThreads.js';
import { seedHashtags } from './seedHashtags.js';
import { seedComments } from './seedComments.js';
import { seedLikes } from './seedLikes.js';
import { seedBookmarks } from './seedBookmarks.js';
import { seedFollow } from './seedFollow.js';
import { seedUsers} from './userSeeder.js';
const prisma = new PrismaClient();

async function seedAll() {
  const user = await prisma.users.findFirst();
  if (!user) throw new Error("User belum ada. Jalankan seed user dulu!");

  console.log("🚀 Mulai seeding...");

  await seedUsers();
  const forum = await seedForum(user);
  const threads = await seedThreads(user, forum);
  const hashtag = await seedHashtags(threads);
  await seedComments(user, threads);
  await seedLikes(user, threads);
  await seedBookmarks(user, threads);
  await seedFollow(user, forum);

  console.log("✅ Semua seeder selesai!");
}

seedAll().catch((e) => {
  console.error("❌ Seed gagal:", e);
  process.exit(1);
});

main()
  .then(async () => {
    await prisma.$disconnect();   // WAJIB
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();   // WAJIB
    process.exit(1);
  });

=======
const prisma = new PrismaClient();


import { seedUsers } from './userSeeder.js';


async function seedAll() {
  await seedUsers(prisma);

  console.log('✅ Semua seed berhasil.');
}

seedAll()
  .catch((e) => {
    console.error('❌ Seed gagal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
>>>>>>> 602636c1cb4d5c46af670cbab215fbaa78faaa92
