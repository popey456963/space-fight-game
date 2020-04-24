import Entity from './Entity'
import Ship from './Ship'
import Loc from '../modules/Loc'
import Planet from './Planet'

export default class Teleporter extends Planet {
    constructor(opts) {
        const defaults = {
            spawnFrequency: 99999999,
            type: 'teleporter'
        }

        super(Object.assign({}, defaults, opts))
       
    }

    firstRender() {
        this.background.drawImage(this.pos, 'blackholeIcon', this.size)
    }

    sendShip(ship, from, to) {
        to.addShip(ship)
    }

    tick(t) {
        const totalShips = this.totalShips

        if (this.shipCount[this.owner.id] === 0 && totalShips !== 0) {
            // the owner has no ships
            const competingPlayers = this.competingPlayers

            if (competingPlayers === 1) {
                this.health -= totalShips * 0.01
            }
        }

        if (this.shipCount[this.owner.id] === totalShips && this.health < 100) {
            // only we are on the planet, regenerate
            // console.log('increasing planet health', this)
            this.health += totalShips * 0.01
            // limit it at 100 health
            this.health = Math.min(this.health, 100)
        }

        if (this.health < 0) {
            const ownerId = Object.entries(this.shipCount).find(([index, value]) => value === totalShips)[0]
            const owner = window.config.owners.find(searchOwner => searchOwner.id === ownerId)

            this.owner = owner
            this.health = 1
        }

        if (t % this.spawnFrequency === 0 && this.owner.id !== 'system' && (this.shipCount[this.owner.id] !== 0 || totalShips === 0)) {
            this.spawnNewShip()
        }

        if (t % 15 === 0) {
            this.localShipFight()
        }
    }
}