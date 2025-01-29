import process from 'node:process'

import { cleanEnv, num, str } from 'envalid'

export const env = cleanEnv(process.env, {
	NODE_ENV: str({ choices: ['development', 'production'], default: 'development' }),

	DATABASE_URL: str({ default: 'file:db.sqlite' }),

	HOST: str({ default: 'localhost' }),
	PORT: num({ default: 3000 }),
})