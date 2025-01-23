import { CommentCreateInputSchema, CommentSchema } from '@procrastin/prisma'
import { initContract } from '@ts-rest/core'

const c = initContract()

export const commentsContract = c.router(
	{
		// CRUD
		getComments: {
			method: 'GET',
			path: '',
			summary: 'Get all comments',
			responses: {
				200: CommentSchema.array(),
			},
		},
		getComment: {
			method: 'GET',
			path: '/:id',
			summary: 'Get a comment by id',
			responses: {
				200: CommentSchema,
			},
		},
		createComment: {
			method: 'POST',
			path: '',
			summary: 'Create a comment',
			body: CommentCreateInputSchema,
			responses: {
				201: CommentSchema,
			},
		},
		updateComment: {
			method: 'PUT',
			path: '/:id',
			summary: 'Update a comment by id',
			body: CommentCreateInputSchema,
			responses: {
				200: CommentSchema,
			},
		},
		deleteComment: {
			method: 'DELETE',
			path: '/:id',
			summary: 'Delete a comment by id',
			responses: {
				200: CommentSchema,
			},
		},
	},
	{
		pathPrefix: '/comments',
	}
)