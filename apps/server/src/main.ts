import Fastify from 'fastify'
import { initServer } from '@ts-rest/fastify'
import { contract } from '@procrastin/contract'
import { prisma } from '@procrastin/prisma'

const app = Fastify();

const s = initServer();

const router = s.router(contract, {
  users: {
    getUser: async ({ params: { id } }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id)
        }
      });

      return {
        status: 200,
        body: user
      }
    },
    getUsers: async () => {
      const users = await prisma.user.findMany();

      return {
        status: 200,
        body: users
      }
    }
  }
});

app.register(s.plugin(router));

const start = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();