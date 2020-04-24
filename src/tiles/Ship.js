import Entity from './Entity'
import Loc from '../modules/Loc'

export default class Ship extends Entity {
    constructor(opts) {
        const defaults = {
            owner: window.config.owners[0],
            size: new Loc(2, 2),
            speed: 0.15,
            type: 'ship'
        }

        super(opts)
        Object.assign(this, defaults, opts)
    }

    setPosition(pos) {
        this.startTravel()
        this.pos = pos
    }

    startTravel(pos) {
        this.startingPos = pos.clone()
        this.travelling = true
        this.holdFire = Math.random() * 60
    }

    moveTo(planet, pos) {
        this.aimPlanet = planet
        this.aim = pos
    }

    tick(t) {
        if (this.travelling) {
            this.pos = this.pos.move(this.aim, this.speed)

            if (this.pos.distanceTo(this.aim) < 0.1) {
                // console.log('reached destination', this)
                this.pos = this.aim
                this.travelling = false
                this.aimPlanet.addShip(this)
                this.renderer.lightRemove(this)
            }
        }
    }

    render(t) {
        // ignore every other tick
        if (this.travelling) {
            this.foreground.drawShip(this.pos, this.startingPos, this.owner.colour)
        }
    }

    firstRender() {}
}