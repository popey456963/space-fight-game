import Planet from '../tiles/Planet'
import Loc from '../modules/Loc'
import Slider from '../tiles/Slider'
import Button from '../tiles/Button'
import Teleporter from '../tiles/Teleporter'
import Turret from '../tiles/Turret'
import { levels, LevelMenu, renderLevel } from '../levels/levels'

export function createPlanet(opts) {
    let { level, pos, size, ships, owner, spawnFrequency } = opts

    if (size === undefined) size = 'medium'
    if (ships === undefined) ships = 5
    if (owner === undefined) owner = 0
    owner = window.config.owners[owner]

    if (spawnFrequency === undefined) {
        if (size === 'small') spawnFrequency = 120
        else if (size === 'medium') spawnFrequency = 60
        else if (size === 'large') spawnFrequency = 30
        else { throw new Error('invalid size (spawnFrequency)') }
    }

    if (size === 'small') size = new Loc(6, 6)
    else if (size === 'medium') size = new Loc(8, 8)
    else if (size === 'large') size = new Loc(12, 12)
    else { throw new Error('invalid size') }

    level.addObject(new Planet({
        canvases: level.canvases,
        pos,
        size,
        owner,
        initialShips: ships,
        spawnFrequency
    }))
}

export function createTeleporter(opts) {
    const { level, pos } = opts

    level.addObject(new Teleporter({
        canvases: level.canvases,
        pos
    }))
}

export function createSlider(opt) {
    let { level } = opt

    level.addObject(new Slider({
        canvases: level.canvases,
        startingPos: new Loc(35, 90.14),
        size: new Loc(2.5, 2.5),
        posBackground: new Loc(50, 90),
        sizeBackground: new Loc(40, 5)
    }), { globalEvents: true })
}

export function createBackButton(opt) {
    let { level } = opt

    level.addObject(new Button({
        canvases: level.canvases,
        pos: new Loc(5, 5),
        size: new Loc(16, 5),
        owner: window.config.owners[0],
        text: "back",
        callback: () => { renderLevel(LevelMenu, level.canvases) }
    }))
}

export function createTurret(opt) {
    let { level, pos, ships } = opt

    if (ships === undefined) ships = 5

    level.addObject(new Turret({
        canvases: level.canvases,
        pos,
        initialShips: 5,
        size: new Loc(5, 5),
        owner: window.config.owners[0]
    }))
}

