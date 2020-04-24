import "regenerator-runtime/runtime.js";
import LevelOne from './levels/LevelOne'
import Canvas from './modules/Canvas'
import Render from './modules/Render'
import AI from './modules/AI'
import { loadImages } from './utils/images'

window.config = require('./config.json')

require('normalize.css/normalize.css');
require('./styles/index.scss');
window.state = {
    inSelection: { ours: {}, target: undefined }
}
window.user = window.config.owners[1]

document.addEventListener("DOMContentLoaded", async () => {
    const images = await loadImages()

    const background = Canvas.init('background-canvas', images, canvas => {
        Canvas.drawBackground(canvas.context, images)
    })
    const foreground = Canvas.init('foreground-canvas', images)

    window.render = new Render(background, foreground)

    foreground.canvas.addEventListener('mousedown', (event) => window.render.mouseDown(event), false)
    foreground.canvas.addEventListener('mousemove', (event) => window.render.mouseMove(event), false)
    foreground.canvas.addEventListener('mouseup', (event) => window.render.mouseUp(event), false)

    const canvases = { background, foreground }
    const levelOneInstance = new LevelOne(canvases, window.render)

    function createAI(user) {
        const ai = new AI(levelOneInstance, user)
        ai.start()
    }

    createAI(window.config.owners[2])
    // createAI(window.config.owners[2])
    // createAI(window.config.owners[3])
    // createAI(window.config.owners[4])

    window.requestAnimationFrame(window.render.tick.bind(window.render))
});
