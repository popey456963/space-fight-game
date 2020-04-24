import LevelMenu from './LevelMenu'
import LevelOne from './LevelOne'
import LevelTwo from './LevelTwo'
import LevelThree from './LevelThree'
import LevelFour from './LevelFour'
import LevelNine from './LevelNine'

import Render from '../modules/Render'
import Canvas from '../modules/Canvas'

export const levels = [LevelOne, LevelTwo, LevelThree, LevelFour, undefined, undefined, undefined, undefined, LevelNine]
export { LevelMenu }

export function renderLevel(Level, canvases) {
    window.state.shipTransferenceRatioSliderValue = 1
    window.render.destroy()
    window.render = new Render(canvases.background, canvases.foreground)

    const levelInstance = new Level(canvases, window.render)

    Canvas.drawBackground(canvases.background.context, canvases.background.images)

    window.render.addLevel(levelInstance)
    window.requestAnimationFrame(window.render.tick.bind(window.render))
}