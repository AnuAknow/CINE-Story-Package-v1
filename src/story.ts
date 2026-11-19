import data from '../stories/last-crossing.json' with { type: 'json' }
import { loadPackage } from './package.ts'

export const story = loadPackage(data)
