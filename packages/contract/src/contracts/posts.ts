import { PostCreateInputSchema, PostSchema } from '@procrastin/prisma'
import { initContract } from '@ts-rest/core'

const c = initContract()

export const postsContract = c.router(
	{
		// CRUD
		getPosts: {
			method: 'GET',
			path: '',
			summary: 'Get all posts',
			responses: {
				200: PostSchema.array(),
			},
		},
		getPost: {
			method: 'GET',
			path: '/:id',
			summary: 'Get a post by id',
			responses: {
				200: PostSchema,
			},
		},
		createPost: {
			method: 'POST',
			path: '',
			summary: 'Create a post',
			body: PostCreateInputSchema,
			responses: {
				201: PostSchema,
			},
		},
		updatePost: {
			method: 'PUT',
			path: '/:id',
			summary: 'Update a post by id',
			body: PostCreateInputSchema,
			responses: {
				200: PostSchema,
			},
		},
		deletePost: {
			method: 'DELETE',
			path: '/:id',
			summary: 'Delete a post by id',
			responses: {
				200: PostSchema,
			},
		},
	},
	{
		pathPrefix: '/posts',
	}
)