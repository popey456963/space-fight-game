import Entity from './Entity'
import Ship from './Ship'
import Loc from '../modules/Loc'
import Planet from './Planet'

export default class Teleporter extends Planet {
    constructor(opts) {
        const defaults = {
            spawnFrequency: 99999999
        }

        super(Object.assign({}, defaults, opts))
       
    }

    firstRender() {
        this.background.drawImage(this.pos, 'blackholeIcon', this.size)
    }

    sendShip(ship, from, to) {
        to.addShip(ship)
    }
}