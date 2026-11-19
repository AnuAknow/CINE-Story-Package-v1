export interface Choice {
  id: string
  label: string
  to: string
  grants?: string
  requires?: string
}
export interface Scene {
  title: string
  prose: string
  video?: string
  choices: Choice[]
}
export interface Story {
  start: string
  scenes: Record<string, Scene>
}
export interface Run {
  scene: string
  flags: Set<string>
  history: string[]
}
export function begin(story: Story): Run {
  if (!Object.hasOwn(story.scenes, story.start)) throw Error('Unknown opening scene')
  for (const scene of Object.values(story.scenes)) {
    const ids = new Set<string>()
    for (const choice of scene.choices) {
      if (ids.has(choice.id) || !Object.hasOwn(story.scenes, choice.to)) {
        throw Error('Invalid choice in ' + scene.title + ': ' + choice.id)
      }
      ids.add(choice.id)
    }
  }
  return { scene: story.start, flags: new Set(), history: [] }
}
export function options(story: Story, run: Run) {
  return story.scenes[run.scene].choices.filter(c => !c.requires || run.flags.has(c.requires))
}
export function advance(story: Story, run: Run, id: string): Run {
  const choice = options(story, run).find(c => c.id === id)
  if (!choice) throw Error('Choice unavailable')
  const flags = new Set(run.flags)
  if (choice.grants) flags.add(choice.grants)
  return { scene: choice.to, flags, history: [...run.history, id] }
}
export function restore(story: Story, saved: string | null): Run {
  const opening = begin(story)
  try {
    const path: unknown = JSON.parse(saved ?? '[]')
    if (!Array.isArray(path)) return opening
    return path.reduce<Run>((run, id) => advance(story, run, id), opening)
  } catch {
    return opening
  }
}
