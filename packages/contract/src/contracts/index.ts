import { initContract } from '@ts-rest/core'

import { commentsContract } from './comments'
import { postsContract } from './posts'
import { usersContract } from './users'
import { filesContract } from './files'

const { router } = initContract()

export const contract = router(
	{
		users: usersContract,
		posts: postsContract,
		comments: commentsContract,
		files: filesContract,
	},
	{
		pathPrefix: '/api/v1',
	}
)
