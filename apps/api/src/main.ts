import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { contract } from '@procrastin/contract'
import { initServer } from '@ts-rest/fastify'
import { generateOpenApi } from '@ts-rest/open-api'
import Fastify from 'fastify'

import { commentsRouter } from './routes/comments'
import { postsRouter } from './routes/posts'
import { usersRouter } from './routes/users'

const host = process.env.HOST ?? 'localhost'
const port = process.env.PORT ? Number(process.env.PORT) : 3000

const server = Fastify({
	logger: true,
})

const s = initServer()
const router = s.router(contract, {
	users: usersRouter,
	comments: commentsRouter,
	posts: postsRouter,
})

const openApiDocument = generateOpenApi(contract, {
	info: {
		title: 'Procrastin API',
		version: '1.0.0',
	},
})

server
	.register(s.plugin(router))
	.register(fastifySwagger, {
		transformObject: () => openApiDocument,
	})
	.register(fastifySwaggerUi, {
		routePrefix: '/docs',
	})

server
	.listen({ port, host }, (err) => {
		if (err) {
			server.log.error(err)
			process.exit(1)
		} else {
			console.log(`[ ready ] http://${host}:${port}`)
		}
	})
