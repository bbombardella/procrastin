import { initContract } from '@ts-rest/core'

import { usersContract } from './users'

const { router } = initContract()

export const contract = router(
	{
		users: usersContract,
	},
	{
		pathPrefix: '/api/v1',
	}
)
