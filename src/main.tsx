import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { advance, begin, options, restore } from './engine.ts'
import { story } from './story.ts'
import './style.css'

const saveKey = `cine:${story.id}:v1`
function Game() {
  const [run, setRun] = useState(() => {
    try { return restore(story, localStorage.getItem(saveKey)) }
    catch { return begin(story) }
  })
  const [canSave, setCanSave] = useState(true)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    heading.current?.focus()
    try {
      localStorage.setItem(saveKey, JSON.stringify(run.history))
      setCanSave(true)
    } catch { setCanSave(false) }
  }, [run])
  const scene = story.scenes[run.scene]
  return <main>
    <header>CINE <span>Cinematic Interactive Narrative Engine</span></header>
    <article key={run.scene}>
      <small>{scene.choices.length ? story.title.toUpperCase() : 'ENDING'}</small>
      <h1 ref={heading} tabIndex={-1}>{scene.title}</h1>
      {scene.video && <video controls playsInline preload="metadata" src={scene.video} aria-label={scene.title} />}
      <p>{scene.prose}</p>
      <section aria-label="Story choices">{options(story, run).map((c, i) =>
        <button key={c.id} onClick={() => setRun(advance(story, run, c.id))}><b>{String.fromCharCode(65 + i)}</b>{c.label}</button>
      )}</section>
    </article>
    <footer>{run.history.length > 0 && <button onClick={() => setRun(begin(story))}>Start over</button>}
      {!canSave && <span role="status">Progress is available for this session only.</span>}
    </footer>
  </main>
}
createRoot(document.getElementById('root')!).render(<Game />)
