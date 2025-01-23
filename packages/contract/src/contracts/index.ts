import { initContract } from '@ts-rest/core'

import { usersContract } from './users'
import { postsContract } from './posts'
import { commentsContract } from './comments'

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
