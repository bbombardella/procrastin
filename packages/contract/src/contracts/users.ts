import { UserCreateInputSchema, UserSchema } from '@procrastin/prisma'
import { initContract } from '@ts-rest/core'

const c = initContract()

export const usersContract = c.router(
	{
		// CRUD
		getUsers: {
			method: 'GET',
			path: '',
			summary: 'Get all users',
			responses: {
				200: UserSchema.array(),
			},
		},
		getUser: {
			method: 'GET',
			path: '/:id',
			summary: 'Get a user by id',
			responses: {
				200: UserSchema,
			},
		},
		createUser: {
			method: 'POST',
			path: '',
			summary: 'Create a user',
			body: UserCreateInputSchema,
			responses: {
				200: UserSchema,
			},
		},
	},
	{
		pathPrefix: '/users',
	}
)