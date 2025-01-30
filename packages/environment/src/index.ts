import { environment as devEnvironment } from './environment.dev'
import { environment as prodEnvironment } from './environment.prod'
import { EnvironmentConfig } from './type'

let environment: EnvironmentConfig

switch (process.env.NODE_ENV) {
	case 'production':
		environment = prodEnvironment
		break
	case 'development':
	default:
		environment = devEnvironment
		break
}

export { environment }
