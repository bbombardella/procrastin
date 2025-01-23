import { contract } from '@procrastin/contract'
import { prisma } from '@procrastin/prisma'
import { initServer } from '@ts-rest/fastify'

const s = initServer()
export const usersRouter = s.router(contract.users, {
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
	updateUser: async ({ params: { id }, body }) => {
		const user = await prisma.user.update({
			where: {
				id: Number(id),
			},
			data: body,
		})

		return {
			status: 200,
			body: user,
		}
	},
	deleteUser: async ({ params: { id } }) => {
		const user = await prisma.user.delete({
			where: {
				id: Number(id),
			},
		})

		return {
			status: 200,
			body: user
		}
	},
})