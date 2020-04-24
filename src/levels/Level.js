import { arrayObject } from '../utils/proxy'
import { LevelMenu, renderLevel } from '../levels/levels'

export default class Level {
    constructor(canvases, render) {
        this.canvases = canvases
        this.render = render

        this.objects = new Proxy({}, arrayObject)
    }

    addObject(object, opts) {
        render.addObject(object, opts)
        this.objects[object.type] = this.objects[object.type].concat(object)
    }

    onNumPress(key) {
        for (let slider of this.objects['slider']) {
            if (event.charCode === 48) {
                slider.setValue(1)
            } else {
                slider.setValue((event.charCode - 48) * 0.1)
            }
        }
    }

    getPlanets() {
        return this.objects.planet.concat(this.objects.teleporter)
    }

    getWinner() {
        const allPlanets = this.getPlanets()
        let winner = window.config.owners[0]
        if (allPlanets.length != 0) {
            winner = allPlanets[0].owner.id
            planet_loop:
            for (let i = 0; i < allPlanets.length; i++) {
                if (allPlanets[i].owner.id != winner) {
                    winner = window.config.owners[0].id
                    break planet_loop;
                }

                for (let stationaryShip of allPlanets[i].ships) {
                    if (stationaryShip.owner.id != winner) {
                        winner = window.config.owners[0].id
                        break planet_loop;
                    }
                }
            }

            for (let travellingShip of Object.values(this.render.lightObjects)) {
                if (travellingShip.owner.id != winner) {
                    winner = window.config.owners[0].id
                    break;
                }
            }
        }

        return winner
    }

    shouldEnd() {
        return this.getWinner() != window.config.owners[0].id
    }

    tick(tickCount) {
        if (tickCount % 20 == 0) {
            if (this.shouldEnd()) {
                console.log('The user won the level')
                renderLevel(LevelMenu, this.canvases)
            }
        }
    }
}