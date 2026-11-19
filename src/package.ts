import { Ajv } from 'ajv'
import schema from '../schemas/story-v1.json' with { type: 'json' }
import { begin, type Story } from './engine.ts'

interface StoryPackage extends Story {
  schemaVersion: 1
  id: string
  title: string
}
const validator = new Ajv()
const validate = validator.compile<StoryPackage>(schema)

export function loadPackage(input: unknown): StoryPackage {
  if (!validate(input)) {
    throw new Error(validator.errorsText(validate.errors, { dataVar: 'Story package' }))
  }
  begin(input)
  return input
}
