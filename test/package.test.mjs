import test from 'node:test'
import assert from 'node:assert/strict'
import { loadPackage } from '../src/package.ts'
import data from '../stories/last-crossing.json' with {type:'json'}
import { restore } from '../src/engine.ts'

test('v1 package replays existing saves for both endings', () => {
  const story = loadPackage(data)
  assert.equal(restore(story, '["board","cast"]').scene, 'dawn')
  assert.equal(restore(story, '["listen","follow","ring"]').scene, 'raft')
})
test('rejects unsupported versions, malformed scenes and broken links', () => {
  assert.throws(() => loadPackage({...data,schemaVersion:2}), /schemaVersion/)
  assert.throws(() => loadPackage({...data,scenes:{pier:{}}}), /pier/)
  assert.throws(() => loadPackage({...data,start:'missing'}), /opening/)
})
