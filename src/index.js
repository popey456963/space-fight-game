import "regenerator-runtime/runtime.js";
import Canvas from './modules/Canvas'
import Render from './modules/Render'
import { loadImages } from './utils/images'
import { levels, LevelMenu, renderLevel } from './levels/levels'

window.config = require('./config.json')

require('normalize.css/normalize.css');
require('./styles/index.scss');
window.state = {
    inSelection: { ours: {}, target: undefined }
}
window.user = window.config.owners[1]

document.addEventListener("DOMContentLoaded", async () => {
    console.log('content loaded')

    const images = await loadImages()

    const background = Canvas.init('background-canvas', images, canvas => {
        Canvas.drawBackground(canvas.context, images)
    })
    const foreground = Canvas.init('foreground-canvas', images)

    window.render = new Render(background, foreground)

    foreground.canvas.addEventListener('mousedown', (event) => window.render.mouseDown(event), false)
    foreground.canvas.addEventListener('mousemove', (event) => window.render.mouseMove(event), false)
    foreground.canvas.addEventListener('mouseup', (event) => window.render.mouseUp(event), false)

    document.addEventListener('keypress', event => window.render.onKeyPress(event))

    const canvases = { background, foreground }

    console.log('creating menu')

    renderLevel(levels[8], canvases)
});
