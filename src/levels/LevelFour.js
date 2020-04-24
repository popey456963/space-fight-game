import Level from './Level'
import Loc from '../modules/Loc'
import AI from '../modules/AI'

import { createPlanet, createSlider, createBackButton } from '../utils/level'

export default class LevelFour extends Level {
    constructor(canvases, render) {
        super(canvases, render)

        createSlider({ level: this })

        createPlanet({
            level: this,
            pos: new Loc(30, 70),
            owner: 1,
            ships: 50,
            size: 'large'
        })

        createPlanet({
            level: this,
            pos: new Loc(40, 40)
        })

        createPlanet({
            level: this,
            pos: new Loc(50, 50),
            ships: 10,
            size: 'large'
        })

        createPlanet({
            level: this,
            pos: new Loc(60, 60)
        })

        createPlanet({
            level: this,
            pos: new Loc(70, 30),
            owner: 2,
            ships: 30
        })

        AI.init(this, 2)
    }
}