import { contract } from '@procrastin/contract'
import { prisma } from '@procrastin/prisma'
import { initServer } from '@ts-rest/fastify'

const s = initServer()
export const commentsRouter = s.router(contract.comments, {
	getComment: async ({ params: { id } }) => {
		const comment = await prisma.comment.findUnique({
			where: {
				id: Number(id),
			},
		})

		if (!comment) return { status: 404, body: 'Comment not found' }

		return {
			status: 200,
			body: comment,
		}
	},
	getComments: async () => {
		const comments = await prisma.comment.findMany()

		return {
			status: 200,
			body: comments,
		}
	},
	createComment: async ({ body }) => {
		const comment = await prisma.comment.create({
			data: body,
		})

		return {
			status: 200,
			body: comment,
		}
	},
	updateComment: async ({ params: { id }, body }) => {
		const comment = await prisma.comment.update({
			where: {
				id: Number(id),
			},
			data: body,
		})

		return {
			status: 200,
			body: comment,
		}
	},
	deleteComment: async ({ params: { id } }) => {
		const comment = await prisma.comment.delete({
			where: {
				id: Number(id),
			},
		})

		return {
			status: 200,
			body: comment
		}
	},
})