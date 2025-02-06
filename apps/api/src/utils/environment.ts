import process from 'node:process'

import { cleanEnv, num, str } from 'envalid'

export const env = cleanEnv(process.env, {
	NODE_ENV: str({ choices: ['development', 'production'], default: 'development' }),

	// database
	DATABASE_URL: str({ default: 'file:../../../data/db.sqlite' }),

	// server
	HOST: str({ default: 'localhost' }),
	PORT: num({ default: 3000 }),

	// auth
	SUPABASE_JWT_SECRET: str(),
	SUPER_TOKEN: str(),

	// s3
	S3_ENDPOINT: str(),
	S3_BUCKET_NAME: str({ default: 'procrastin' }),
	S3_ACCESS_KEY_ID: str(),
	S3_SECRET_ACCESS_KEY: str(),
})