import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync('123123', salt);

  await prisma.$connect();
  await prisma.user.create({
    data: {
      name: 'admin',
      password: hashPassword,
      gender: true,
      role: 'admin',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
