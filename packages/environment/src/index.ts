import process from 'node:process'

import { environment as devEnvironment } from './environment.dev'
import { environment as prodEnvironment } from './environment.prod'

export const environment = process.env?.NODE_ENV === 'production' ? prodEnvironment : devEnvironment
