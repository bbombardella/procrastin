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