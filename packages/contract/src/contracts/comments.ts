import {
	CommentCreateInputSchema,
	CommentCreateWithoutAuthorInputSchema,
	CommentSchema,
	CommentWithAuthorSchema
} from '@procrastin/prisma'
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
				200: CommentWithAuthorSchema.array(),
				404: c.type<string>()
			},
		},
		getComment: {
			method: 'GET',
			path: '/:id',
			summary: 'Get a comment by id',
			responses: {
				200: CommentWithAuthorSchema,
			},
		},
		createComment: {
			method: 'POST',
			path: '',
			summary: 'Create a comment',
			body: CommentCreateWithoutAuthorInputSchema,
			responses: {
				201: CommentWithAuthorSchema,
				404: c.type<string>()
			},
		},
		updateComment: {
			method: 'PUT',
			path: '/:id',
			summary: 'Update a comment by id',
			body: CommentCreateInputSchema,
			responses: {
				200: CommentWithAuthorSchema,
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
