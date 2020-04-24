import Level from './Level'
import Loc from '../modules/Loc'
import AI from '../modules/AI'

import { createPlanet, createSlider, createBackButton } from '../utils/level'

export default class LevelTwo extends Level {
    constructor(canvases, render) {
        super(canvases, render)

        createBackButton({ level: this })

        createSlider({ level: this })

        createPlanet({
            level: this,
            pos: new Loc(50, 30),
            owner: 1,
            ships: 60,
            size: 'large'
        })

        createPlanet({
            level: this,
            pos: new Loc(70, 70)
        })

        createPlanet({
            level: this,
            pos: new Loc(30, 70),
            owner: 2,
            ships: 30
        })

        AI.init(this, 2)
    }
}