import 'dotenv/config'

import process from 'node:process'

import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySensible from '@fastify/sensible'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { contract } from '@procrastin/contract'
import { initServer } from '@ts-rest/fastify'
import { generateOpenApi } from '@ts-rest/open-api'
import Fastify from 'fastify'

import { commentsRouter } from './routes/comments'
import { postsRouter } from './routes/posts'
import { usersRouter } from './routes/users'
import { env } from './utils/environment'

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
	.register(fastifyCors, {
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
	.register(fastifyJwt, {
		secret: env.SUPABASE_JWT_SECRET,
		sign: {
			algorithm: 'HS256',
		},
	})
	.register(s.plugin(router))
	.register(fastifySwagger, {
		transformObject: () => openApiDocument,
	})
	.register(fastifySensible)
	.register(fastifySwaggerUi, {
		routePrefix: '/docs',
	})
	.addHook('onRequest', async (request, reply) => {
		// unprotected routes
		if (request.url.startsWith('/docs')) return

		// super token
		if (request.headers.authorization === `Bearer ${env.SUPER_TOKEN}`) return

		// jwt token
		try {
			await request.jwtVerify()
		} catch {
			reply.code(401).send({ message: 'Unauthorized' })
		}
	})

server
	.listen({ port: env.PORT, host: env.HOST }, (err) => {
		if (err) {
			server.log.error(err)
			process.exit(1)
		} else {
			console.log(`[ ready ] http://${env.HOST}:${env.PORT}`)
		}
	})
