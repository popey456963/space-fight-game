import Entity from './Entity'
import Ship from './Ship'
import Loc from '../modules/Loc'

import { zeroObject } from '../utils/proxy'

export default class Planet extends Entity {
    constructor(opts) {
        const defaults = {
            size: new Loc(3, 3),
            ships: [],
            health: 100,
            shipCount: new Proxy({}, zeroObject),
            spawnFrequency: 60,
            type: 'planet',
        }

        super(opts)
        Object.assign(this, defaults, opts)

        for (let i = 0; i < this.initialShips; i++) {
            this.spawnNewShip();
        }
    }

    get totalShips() {
        return Object.values(this.shipCount).reduce((prev, sum) => prev + sum, 0)
    }

    get competingPlayers() {
        return Object.values(this.shipCount).filter(count => count !== 0).length
    }

    spawnNewShip() {
        this.addShip(new Ship({
            canvases: { foreground: this.foreground, background: this.background },
            pos: this.pos,
            size: new Loc(1, 1),
            owner: this.owner
        }))
    }

    removeShip(index) {
        this.shipCount[this.ships[index].owner.id] -= 1
        this.ships.splice(index, 1)
    }

    ownedBy(user) {
        return user.id === this.owner.id
    }

    localShipFight() {
        let hits = {}
        for (let ownerName in this.shipCount) {
            for (let h = 0; h < this.shipCount[ownerName]; h++) {
                if (Math.random() < config.options.ships.hitChance) {
                    hits[ownerName] = ++hits[ownerName] || 1;
                }
            }
        }

        for (let attackingOwner in this.shipCount) {
            for (let h = 0; h < hits[attackingOwner]; h++) {
                let dead_ship = Math.floor(Math.random() * (this.ships.length - this.shipCount[attackingOwner]))
                for (let attackedOwner in this.shipCount) {
                    if (attackedOwner != attackingOwner) {
                        dead_ship -= this.shipCount[attackedOwner]
                        if (dead_ship < 0) {
                            const shipIndex = this.ships.findIndex(ship => ship.owner.id === attackedOwner)
                            this.removeShip(shipIndex)
                            break
                        }
                    }
                }
            }
        }
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

    firstRender() {
        this.background.drawImage(this.pos, 'planetIcon', this.size)
    }

    render(t) {
        // check current state of board
        const competingPlayers = Object.values(this.shipCount).filter(count => count !== 0).length
        const OFFSET = 2 / 3

        if (this.id in window.state.inSelection.ours || (window.state.inSelection.target && this.id === window.state.inSelection.target.id)) {
            // this window is selected
            this.foreground.drawArc(this.pos, this.size.scale(OFFSET), 'white', 0, 2 * Math.PI)
        }

        if (this.id in window.state.inSelection.ours && window.state.inSelection.target) {
            const target = window.state.inSelection.target
            const fromPos = this.pos.move(target.pos, this.size.x * OFFSET)
            let toPos

            if (target.type === 'location') {
                toPos = target.pos
            } else {
                toPos = target.pos.move(this.pos, target.size.x * OFFSET)
            }

            // console.log(fromPos, toPos)
            this.foreground.drawLine(fromPos, toPos)
        }

        if (this.health < 100) {
            this.foreground.drawText(this.pos.add(new Loc(0, -(this.size.y * 0.9))), `${Math.round(this.health)}%`, {
                fillStyle: this.owner.colour
            })
        }

        if (competingPlayers === 0) {
            this.foreground.drawText(this.pos, '0', {
                fillStyle: this.owner.colour
            })
            // we have nobody on a planet, display nothing...
        } else if (competingPlayers === 1) {
            // we have only one person on a planet
            this.foreground.drawText(this.pos, this.ships.length, {
                fillStyle: this.ships[0].owner.colour
            })
        } else {
            this.foreground.drawText(this.pos, JSON.stringify(this.shipCount), {
                fillStyle: this.owner.colour
            })
            // we have multiple people competing over a planet
            const totalShips = Object.values(this.shipCount).reduce((prev, sum) => prev + sum, 0)
            let last_end_angle = 3 * Math.PI / 2
            for (let owner in this.shipCount) {
                if (this.shipCount !== 0) {
                    const next_end_angle = (last_end_angle + (this.shipCount[owner] / totalShips) * 2 * Math.PI) % (2 * Math.PI)
                    const ownerColour = window.config.owners.find(searchOwner => searchOwner.id === owner).colour

                    this.foreground.drawArc(this.pos, this.size, ownerColour, last_end_angle, next_end_angle)

                    last_end_angle = next_end_angle
                }
            }
        }
    }

    addShip(ship) {
        if (!(ship.owner.id in this.shipCount)) this.shipCount[ship.owner.id] = 0
        this.shipCount[ship.owner.id] += 1
        this.ships.push(ship)
    }

    onClick() {
        if (this.shipCount[window.user.id] > 0 || this.owner.id === window.user.id) {
            window.state.inSelection.ours[this.id] = this
        }
        console.log('we were clicked')
    }

    sendShip(ship, from, to) {
        ship.setPosition(from.pos.jiggle(1))
        ship.moveTo(to, to.pos)
        this.renderer.addLightObject(ship)
    }

    sendShips(owner, to, percentToSend = undefined) {
        const percent = percentToSend ? percentToSend : window.state.shipTransferenceRatioSliderValue

        const numSending = Math.ceil(this.shipCount[owner.id] * percent)
        let removedShips = 0

        if (to.id != this.id) {
            for (let i = 0; i < this.ships.length; i++) {
                let ship = this.ships[i]
                if (ship.owner.id === owner.id) {
                    // console.log('sending ship', ship, to)

                    this.sendShip(ship, this, to)
                    this.ships.splice(i, 1)
                    i -= 1
                    removedShips += 1
                    if (removedShips >= numSending) break
                }
            }
        }

        // console.log(this.shipCount, percent, removedShips)

        this.shipCount[owner.id] -= removedShips;
    }

    onUnclick(isGlobal) {
        if (!isGlobal) {
            const selectedPlanets = Object.values(window.state.inSelection.ours)

            console.log('moving to planets', selectedPlanets)

            for (let selectedPlanet of selectedPlanets) {
                selectedPlanet.sendShips(window.config.owners[1], this)
            }

            console.log('we were unclicked')
        }
    }

    clickOver(event, clicked) {
        if (clicked) {
            if (this.shipCount[window.user.id] > 0 || this.owner.id === window.user.id) {
                window.state.inSelection.ours[this.id] = this
            }

            window.state.inSelection.target = this
        } else {
            window.state.inSelection.target = undefined
        }
        // console.log('we were clicked over: ', clicked)
    }
}

// const a = new Planet({}, {}, {}, {}, [])
// a.shipCount = {
//     'user1': 10,
//     'user2': 30
// }
// a.ships = []

// for (let i = 0; i < 10; i++) { a.ships.push(new Ship({}, {}, {}, { id: 'user1' })) }
// for (let i = 0; i < 30; i++) { a.ships.push(new Ship({}, {}, {}, { id: 'user2' })) }

// a.tick(150)