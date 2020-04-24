import Level from './Level'
import Loc from '../modules/Loc'
import AI from '../modules/AI'

import { createPlanet, createSlider, createBackButton, createTeleporter, createTurret } from '../utils/level'

export default class LevelNine extends Level {
    constructor(canvases, render) {
        super(canvases, render)

        createBackButton({ level: this })
        createSlider({ level: this })

        // x - 6
        // y - 15

        createPlanet({ level: this, pos: new Loc(20, 20), owner: 1, ships: 30, size: 'small' })
        createPlanet({ level: this, pos: new Loc(26, 35), owner: 1, ships: 30, size: 'small' })
        createPlanet({ level: this, pos: new Loc(32, 20), owner: 1, ships: 30, size: 'small' })
        createPlanet({ level: this, pos: new Loc(20, 50), owner: 1, ships: 30, size: 'small' })

        createTurret({ level: this, pos: new Loc(32, 50) })

        createPlanet({ level: this, pos: new Loc(32, 80), owner: 2, ships: 30, size: 'small' })
        createPlanet({ level: this, pos: new Loc(38, 65), owner: 2, ships: 30, size: 'small' })
        createPlanet({ level: this, pos: new Loc(44, 80), owner: 2, ships: 30, size: 'small' })
        createPlanet({ level: this, pos: new Loc(44, 50), owner: 2, ships: 30, size: 'small' })
        createPlanet({ level: this, pos: new Loc(50, 65), owner: 2, ships: 30, size: 'small' })

        createPlanet({ level: this, pos: new Loc(50, 35), owner: 3, ships: 30, size: 'small' })
        createPlanet({ level: this, pos: new Loc(56, 50), owner: 3, ships: 30, size: 'small' })
        createPlanet({ level: this, pos: new Loc(56, 20), owner: 3, ships: 30, size: 'small' })
        createPlanet({ level: this, pos: new Loc(62, 35), owner: 3, ships: 30, size: 'small' })
        createPlanet({ level: this, pos: new Loc(68, 20), owner: 3, ships: 30, size: 'small' })

        createTurret({ level: this, pos: new Loc(68, 50) })

        createPlanet({ level: this, pos: new Loc(80, 50), owner: 4, ships: 30, size: 'small' })
        createPlanet({ level: this, pos: new Loc(68, 80), owner: 4, ships: 30, size: 'small' })
        createPlanet({ level: this, pos: new Loc(74, 65), owner: 4, ships: 30, size: 'small' })
        createPlanet({ level: this, pos: new Loc(80, 80), owner: 4, ships: 30, size: 'small' })

        createTeleporter({ level: this, pos: new Loc(20, 80) })
        createTeleporter({ level: this, pos: new Loc(80, 20) })

        AI.init(this, 2)
        AI.init(this, 3)
        AI.init(this, 4)
    }
}