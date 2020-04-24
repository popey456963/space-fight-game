import Entity from './Entity'
import Loc from '../modules/Loc'

export default class Ship extends Entity {
    constructor(opts) {
        const defaults = {
            owner: window.config.owners[0],
            size: new Loc(2, 2),
            speed: 1,
            type: 'ship'
        }

        super(opts)
        Object.assign(this, defaults, opts)
    }

    setPosition(pos) {
        this.travelling = true
        this.pos = pos
    }

    moveTo(planet, pos) {
        this.aimPlanet = planet
        this.aim = pos
    }

    tick(t) {
        if (this.travelling) {
            this.pos = this.pos.move(this.aim, this.speed)

            if (this.pos.distanceTo(this.aim) < 0.5) {
                // console.log('reached destination', this)
                this.travelling = false
                this.aimPlanet.addShip(this)
                this.renderer.lightRemove(this)
            }
        }
    }

    render(t) {
        // ignore every other tick
        if (this.travelling) {
            this.foreground.drawImage(this.pos, `${this.owner.colour}ShipIcon`, this.size, Math.atan2(this.aim.x - this.pos.x, this.pos.y - this.aim.y))
        }
    }

    firstRender() {}
}