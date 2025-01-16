import { UserModel } from '@procrastin/prisma'
import { initContract } from '@ts-rest/core'

const { router } = initContract()

export const usersContract = router(
	{
		// CRUD
		getUsers: {
			method: 'GET',
			path: '',
			summary: 'Get all users',
			responses: {
				200: UserModel.array(),
			},
		},
		getUser: {
			method: 'GET',
			path: '/:id',
			summary: 'Get a user by id',
			responses: {
				200: UserModel,
			},
		},
	},
	{
		pathPrefix: '/users',
	}
)