import Entity from './Entity'
import Ship from './Ship'
import Loc from '../modules/Loc'
import Planet from './Planet'

export default class Teleporter extends Planet {
    constructor(opts) {
        const defaults = {
            spawnFrequency: Infinity,
            type: 'teleporter',
            size: new Loc(7, 7),
            displaySize: new Loc(13, 13)
        }

        super(Object.assign({}, defaults, opts))
       
    }

    firstRender() {
        this.background.drawImage(this.pos, 'blackholeIcon', this.displaySize)
    }

    sendShip(ship, from, to) {
        if (this.owner === ship.owner) {
            to.addShip(ship)

            const angle = Math.random() * 2 * Math.PI
            const curOrbitalRadius = to.orbitalRadius + (Math.random() - 0.5) 
            ship.pos = to.pos.add(new Loc(Math.cos(angle) * curOrbitalRadius,
                Math.sin(angle) * curOrbitalRadius * this.orbitalTilt))
        } else {
            super.sendShip(ship, from, to)
        }
    }
}