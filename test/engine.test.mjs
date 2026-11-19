import test from 'node:test'
import assert from 'node:assert/strict'
import { begin, advance, options, restore } from '../src/engine.ts'
import { story } from '../src/story.ts'

test('earlier observation unlocks the rescue after paths converge', () => {
  const opening = begin(story)
  const direct = advance(story, opening, 'board')
  assert.throws(() => advance(story, direct, 'ring'))
  assert.equal(advance(story, direct, 'cast').scene, 'dawn')
  const observed = advance(story, advance(story, opening, 'listen'), 'follow')
  const ending = advance(story, observed, 'ring')
  assert.equal(ending.scene, 'raft')
  assert.deepEqual(options(story, ending), [])
  assert.deepEqual(restore(story, JSON.stringify(ending.history)), ending)
  assert.equal(opening.flags.size, 0)
})
test('broken saves reset and broken story links fail early', () => {
  for (const saved of ['{', '["board","ring"]', '{}']) {
    assert.deepEqual(restore(story, saved), begin(story))
  }
  assert.throws(() => begin({start:'x', scenes:{x:{choices:[{id:'go',to:'missing'}]}}}))
})
