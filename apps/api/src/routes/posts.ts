import { contract } from '@procrastin/contract'
import { prisma } from '@procrastin/prisma'
import { initServer } from '@ts-rest/fastify'

const s = initServer()
export const postsRouter = s.router(contract.posts, {
	getPost: async ({ params: { id } }) => {
		const post = await prisma.post.findUnique({
			where: {
				id: Number(id),
			},
			include: {
				author: true
			}
		})

		if (!post) return { status: 404, body: 'Post not found' }

		return {
			status: 200,
			body: post,
		}
	},
	getPosts: async () => {
		const posts = await prisma.post.findMany({
			include: {
				author: true
			}
		})

		return {
			status: 200,
			body: posts,
		}
	},
	createPost: async ({ body, request }) => {
		const email = (request.user.valueOf() as JwtPayload['user_metadata']).email
		const user = await prisma.user.findFirst({
			where: {
				email,
			},
		})

		if (!user) return {status: 404, body: 'User not found'}

		const post = await prisma.post.create({
			data: {
				...body,
				author: {
					connect: {
						id: user.id
					}
				}
			},
		})

		return {
			status: 201,
			body: post,
		}
	},
	updatePost: async ({ params: { id }, body }) => {
		const post = await prisma.post.update({
			where: {
				id: Number(id),
			},
			data: body,
		})

		return {
			status: 200,
			body: post,
		}
	},
	deletePost: async ({ params: { id } }) => {
		const post = await prisma.post.delete({
			where: {
				id: Number(id),
			},
		})

		return {
			status: 200,
			body: post,
		}
	},
})
