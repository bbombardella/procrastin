import { contract } from '@procrastin/contract'
import { prisma } from '@procrastin/prisma'
import { initServer } from '@ts-rest/fastify'
import Fastify from 'fastify'

const app = Fastify()

const s = initServer()

const router = s.router(contract, {
	users: {
		getUser: async ({ params: { id } }) => {
			const user = await prisma.user.findUnique({
				where: {
					id: Number(id),
				},
			})

			if (!user) return { status: 404, body: 'User not found' }

			return {
				status: 200,
				body: user,
			}
		},
		getUsers: async () => {
			const users = await prisma.user.findMany()

			return {
				status: 200,
				body: users,
			}
		},
		createUser: async ({ body }) => {
			const user = await prisma.user.create({
				data: body,
			})

			return {
				status: 200,
				body: user,
			}
		},
	},
})

app.register(s.plugin(router))

async function start() {
	try {
		await app.listen({ port: 3000 })
	} catch (err) {
		app.log.error(err)
		process.exit(1)
	}
}

start()

// import Fastify from 'fastify';
// import { app } from './app/app';

// const host = process.env.HOST ?? 'localhost';
// const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// // Instantiate Fastify with some config
// const server = Fastify({
//   logger: true,
// });

// // Register your application as a normal plugin.
// server.register(app);

// // Start listening.
// server.listen({ port, host }, (err) => {
//   if (err) {
//     server.log.error(err);
//     process.exit(1);
//   } else {
//     console.log(`[ ready ] http://${host}:${port}`);
//   }
// });
