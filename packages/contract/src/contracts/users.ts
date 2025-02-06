import { UserCreateInputSchema, UserSchema, UserUpdateInputSchema } from '@procrastin/prisma'
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
				404: c.type<string>()
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
			contentType: 'multipart/form-data',
			summary: 'Create a user',
			body: UserCreateInputSchema,
			responses: {
				201: UserSchema,
			},
		},
		updateUser: {
			method: 'PATCH',
			path: '/:id',
			contentType: 'multipart/form-data',
			summary: 'Update a user by id',
			body: UserUpdateInputSchema,
			responses: {
				200: UserSchema,
			},
		},
		deleteUser: {
			method: 'DELETE',
			path: '/:id',
			summary: 'Delete a user by id',
			responses: {
				200: UserSchema,
			},
		},

		me: {
			method: 'GET',
			path: '/me',
			summary: 'Get current user',
			responses: {
				200: UserSchema,
				404: c.type<string>()
			},
		},
	},
	{
		pathPrefix: '/users',
	}
)
