# mcanimationviewer

A simple tool for viewing Minecraft animations (.png + .mcmeta).

## Usage

1. Clone/download repo + run `npm install` (first time only).
2. Copy animation files to `./workspace` (e.g. `mcanimationvier/workspace/energised_acacia.png`, `mcanimationvier/workspace/energised_acacia.png.mcmeta`).
3. Run `npm start` (you will need to restart if you add new files to the workspace).
4. Open http://localhost:1234/index.html?file=filename (e.g. `?file=energised_acacia`).
5. As you save changes to the image or meta the viewer will automatically reload.
6. Click on a frame in the table to jump there in the animation.
