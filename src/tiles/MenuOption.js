import Planet from './Planet'
import Loc from '../modules/Loc'

import { levels, LevelMenu, renderLevel } from '../levels/levels'

export default class MenuOption extends Planet {
    constructor(opts) {
        // console.log(opts)

        const defaults = {
            location: new Loc(50, 50),
            text: '',
            //size: new Loc(3, 3),
            type: 'menuOption',
        }

        super(opts)
        Object.assign(this, defaults, opts)
    }

    onClick() {
        const Level = this.totalShips && this.totalShips - 1 < levels.length ?
            levels[this.totalShips - 1] :
            LevelMenu
        
        renderLevel(Level, { background: window.render.background, foreground: window.render.foreground })
    }
}