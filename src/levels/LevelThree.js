import Level from './Level'
import Loc from '../modules/Loc'
import AI from '../modules/AI'

import { createPlanet, createSlider, createBackButton } from '../utils/level'

export default class LevelThree extends Level {
    constructor(canvases, render) {
        super(canvases, render)

        createSlider({ level: this })

        createPlanet({
            level: this,
            pos: new Loc(30, 40),
            owner: 1,
            ships: 60,
            size: 'large'
        })

        createPlanet({
            level: this,
            pos: new Loc(40, 60)
        })

        createPlanet({
            level: this,
            pos: new Loc(60, 40)
        })

        createPlanet({
            level: this,
            pos: new Loc(70, 60),
            owner: 2,
            ships: 30
        })

        AI.init(this, 2)
    }
}