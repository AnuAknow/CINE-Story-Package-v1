# CINE · The Last Crossing
A browser-based React and TypeScript scaffold for reader-paced cinematic fiction. The sample is an original standalone short with two endings.

## Run
Use Node 22.18 or newer. From this directory:
```sh
npm install
npm run dev
```
Open the local address Vite prints. Run `npm test` for the engine checks or `npm run build` to type-check and generate a deployable dist directory.

## Author a story
Edit stories/last-crossing.json. The reader loads it through src/story.ts and validates it against schemas/story-v1.json. Keep schemaVersion at 1 and preserve existing story and choice IDs for save compatibility. Each scene has a title, prose, and choices. A choice has an id unique within the scene, a player-facing label, and a target scene key in to. An empty choices array marks an ending. Keep at least one available choice in every nonterminal scene. Use grants to remember a decision and requires to unlock a later choice. The engine survives branch convergence by carrying flags between scenes.

For a cinematic, place your own clip at public/media/crossing.mp4 and add video: '/media/crossing.mp4' to a scene. Native playback controls let readers watch or choose immediately. Supply prose that conveys the essential action. No clips are bundled.

## Save and replay
src/main.tsx stores the sequence of choice IDs in the current browser. src/engine.ts replays those choices to rebuild progress, including flags. Use a distinct package id for each new story. Bump the save key version for incompatible edits. Start over resets the current run.

## Try both paths
Step aboard and cast off for the open-water ending. Restart, wait for the third bell, join the child, and answer the bell for the rescue. Refresh on deck to check that the extra option survives.
