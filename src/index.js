window.config = require('./config.json')

import "regenerator-runtime/runtime.js";
import LevelOne from './levels/LevelOne'
import Canvas from './modules/Canvas'
import Render from './modules/Render'

require('normalize.css/normalize.css');
require('./styles/index.scss');
window.state = {
    selectedPlanets: {},
    user: window.config.owners[1]
}

function initCanvas(id, images, resize) {
    const canvasDom = document.getElementById(id)

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    const canvas = new Canvas(canvasDom, images)

    function resizeCanvas() {
        canvasDom.width = window.innerWidth;
        canvasDom.height = window.innerHeight;

        canvas.size = {
            y: window.innerHeight,
            x: window.innerWidth
        }

        canvas.edge = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight
        canvas.xOffset = window.innerWidth > window.innerHeight ? (window.innerWidth - window.innerHeight) / 2 : 0

        resize(canvasDom.getContext('2d'))
    }

    resizeCanvas()

    return canvas
}

function drawBackground(context) {
    console.log('drawing background')

    const gradient = context.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "white");

    context.fillStyle = gradient
    context.fillRect(0, 0, window.innerWidth, window.innerHeight)
}

document.addEventListener("DOMContentLoaded", async () => {
    const images = {}

    console.log(config)

    function addImage(name, source) {
        return new Promise(resolve => {
            const img = new Image()
            img.src = source
            img.onload = () => {
               resolve()
            }

            images[name] = img
        })
    }

    await Promise.all([
        addImage('unknownIcon', require('./assets/unknown_icon.jpg')),
        addImage('planetIcon', require('./assets/planet_green.svg')),
        addImage('sliderBackgroundIcon', require('./assets/slider_background_icon.svg')),
        addImage('sliderIcon', require('./assets/slider_icon.svg')),
        addImage('blackholeIcon', require('./assets/blackhole.png')),
        addImage('shipIcon', require('./assets/ship.svg'))
    ])

    const background = initCanvas('background-canvas', images, (context) => {
        drawBackground(context)

        if ('render' in window) {
            console.log('rerendering')
            window.render.firstRender()
        }
    })
    const foreground = initCanvas('foreground-canvas', images, () => {})

    window.render = new Render(background, foreground)

    foreground.canvas.addEventListener('mousedown', event => render.mouseDown(event), false)
    foreground.canvas.addEventListener('mousemove', event => render.mouseMove(event), false)
    foreground.canvas.addEventListener('mouseup', event => render.mouseUp(event), false)

    const canvases = { background, foreground }
    const LevelOneInstance = new LevelOne(canvases, render)

    window.requestAnimationFrame(window.render.tick.bind(render))
});
