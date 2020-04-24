import Level from './Level'
import Planet from '../tiles/Planet'
import Loc from '../modules/Loc'
import Slider from '../tiles/Slider'
import Teleporter from '../tiles/Teleporter'


export default class LevelOne extends Level {
    constructor(canvases, render) {
        super(canvases, render)

        this.addObject(new Planet({
            canvases,
            pos: new Loc(10, 30),
            size: new Loc(8, 8),
            owner: window.config.owners[1],
            initialShips: 25
        }))
        this.addObject(new Planet({
            canvases,
            pos: new Loc(90, 70),
            size: new Loc(8, 8),
            owner: window.config.owners[2],
            initialShips: 25
        }))
        this.addObject(new Planet({
            canvases,
            pos: new Loc(30, 50),
            size: new Loc(8, 8),
            initialShips: 5
        }))
        this.addObject(new Planet({
            canvases,
            pos: new Loc(70, 50),
            size: new Loc(8, 8),
            initialShips: 5
        }))
        this.addObject(new Planet({
            canvases,
            pos: new Loc(70, 30),
            size: new Loc(8, 8),
            initialShips: 5
        }))
        this.addObject(new Planet({
            canvases,
            pos: new Loc(70, 70),
            size: new Loc(8, 8),
            initialShips: 5
        }))
        this.addObject(new Planet({
            canvases,
            pos: new Loc(30, 30),
            size: new Loc(8, 8),
            initialShips: 5
        }))
        this.addObject(new Planet({
            canvases,
            pos: new Loc(30, 70),
            size: new Loc(8, 8),
            initialShips: 5
        }))
        this.addObject(new Teleporter({
            canvases,
            pos: new Loc(50, 50),
            size: new Loc(10, 10)
        }))
        this.addObject(new Slider({
            canvases,
            startingPos: new Loc(35, 90.14),
            size: new Loc(2, 2),
            posBackground: new Loc(50, 90),
            sizeBackground: new Loc(30, 5)
        }), { globalEvents: true })
    }
}