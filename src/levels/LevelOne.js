import Level from './Level'
import Loc from '../modules/Loc'

import { createPlanet, createSlider, createBackButton } from '../utils/level'

export default class LevelOne extends Level {
    constructor(canvases, render) {
        super(canvases, render)

        createBackButton({ level: this })

        createSlider({ level: this })

        createPlanet({
            level: this,
            pos: new Loc(30, 40),
            ships: 60,
            owner: 1,
            size: 'large'
        })

        createPlanet({
            level: this,
            pos: new Loc(70, 60)
        })
    }
}