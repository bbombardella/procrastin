import {PostCreateWithoutAuthorInputSchema, PostSchema, PostWithAuthorSchema} from '@procrastin/prisma'
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
				200: PostWithAuthorSchema.array(),
				404: c.type<string>()
			},
		},
		getPost: {
			method: 'GET',
			path: '/:id',
			summary: 'Get a post by id',
			responses: {
				200: PostWithAuthorSchema,
			},
		},
		createPost: {
			method: 'POST',
			path: '',
			summary: 'Create a post',
			body: PostCreateWithoutAuthorInputSchema,
			responses: {
				201: PostSchema,
			},
		},
		updatePost: {
			method: 'PUT',
			path: '/:id',
			summary: 'Update a post by id',
			body: PostCreateWithoutAuthorInputSchema,
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
