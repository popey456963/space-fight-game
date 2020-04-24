import Level from './Level'
import MenuOption from '../tiles/MenuOption'
import Loc from '../modules/Loc'
import Button from '../tiles/Button'

export default class LevelMenu extends Level {
    constructor(canvases, render) {
        console.log(canvases, render)

        super(canvases, render)

        for (let i = 0; i < 9; i++) {
            this.addObject(new MenuOption({
                canvases,
                pos: new Loc(20 + 30*(i%3), 20 + 30*(Math.floor(i/3))),
                size: new Loc(12, 12),
                owner: window.config.owners[1],
                initialShips: i,
                spawnFrequency: Infinity
            }))
        }
    }

    tick() {}
}
