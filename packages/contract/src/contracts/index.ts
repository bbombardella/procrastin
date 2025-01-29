import { initContract } from '@ts-rest/core'

import { commentsContract } from './comments'
import { postsContract } from './posts'
import { usersContract } from './users'

const { router } = initContract()

export const contract = router(
	{
		users: usersContract,
		posts: postsContract,
		comments: commentsContract,
	},
	{
		pathPrefix: '/api/v1',
	}
)
