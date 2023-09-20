import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// async function main() {
//   await prisma.group.create({
//     data: {
//       telegramChatId: "123",
//       googleTablePublicLink: "123",
//     },
//   });
//   const allUsers = await prisma.group.findMany();
//   console.log(allUsers);
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
