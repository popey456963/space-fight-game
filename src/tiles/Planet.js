import Entity from './Entity'
import Ship from './Ship'
import Loc from '../modules/Loc'

import { zeroObject } from '../utils/proxy'

export default class Planet extends Entity {
    constructor(opts) {
        // console.log(opts)

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

        this.orbitalTilt = 0.3
        this.orbitalRadius = this.size.length() * 1 / 2

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
        const angle = Math.random() * 2 * Math.PI
        const curOrbitalRadius = this.orbitalRadius + (Math.random() - 0.5) 
        this.addShip(new Ship({
            canvases: { foreground: this.foreground, background: this.background },
            pos: this.pos.add(new Loc(Math.cos(angle) * curOrbitalRadius,
                Math.sin(angle) * curOrbitalRadius * this.orbitalTilt)),
            size: new Loc(1, 1),
            owner: this.owner
        }))
    }

    removeShip(index) {
        this.shipCount[this.ships[index].owner.id] -= 1
        this.ships.splice(index, 1)
    }

    getOrbitalPosition(ship) {
        let circle_x = ship.pos.x - this.pos.x
        let circle_y = (ship.pos.y - this.pos.y) / this.orbitalTilt
        
        let angle = Math.atan2(circle_y, circle_x)
        let radius = Math.sqrt(circle_x * circle_x + circle_y * circle_y)
        return [angle, radius]
    }

    moveOrbitalShips() {
        for (let ship of this.ships) {
            const [angle, radius] = this.getOrbitalPosition(ship)
            let new_angle = (angle + ship.speed / radius) % (2 * Math.PI)
            ship.pos = this.pos.add(new Loc(Math.cos(new_angle) * radius,
                Math.sin(new_angle) * radius * this.orbitalTilt))
        }
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

        this.moveOrbitalShips()
    }

    firstRender() {
        this.background.drawImage(this.pos, 'planetIcon', this.size)
    }

    render(t) {
        // check current state of board
        const competingPlayers = Object.values(this.shipCount).filter(count => count !== 0).length
        const OFFSET = 1 / 3

        for (let ship of this.ships) {
            const circle_x = ship.pos.x - this.pos.x
            const circle_y = ship.pos.y - this.pos.y
            
            const angle = Math.atan2(circle_y, circle_x)
            const radius = Math.sqrt(circle_x * circle_x + circle_y * circle_y)

            // draw a ship at it's position
            if (radius > this.size.length() / 3.5 || angle > 0) {
                this.foreground.drawArc(ship.pos, new Loc(0.1, 0.1), ship.owner.colour, 0, Math.PI * 2, {
                    lineWidth: 0
                })
            }
        }

        if (this.id in window.state.inSelection.ours || (window.state.inSelection.target && this.id === window.state.inSelection.target.id)) {
            // this window is selected
            this.foreground.drawArc(this.pos, this.size.scale(OFFSET * 2), [255, 255, 255], 0, 2 * Math.PI)
        }

        if (this.id in window.state.inSelection.ours && window.state.inSelection.target) {
            const target = window.state.inSelection.target
            const fromPos = this.pos.move(target.pos, this.size.x * OFFSET * 2)
            let toPos

            if (target.type === 'location') {
                toPos = target.pos
            } else {
                toPos = target.pos.move(this.pos, target.size.x * OFFSET * 2)
            }

            // console.log(fromPos, toPos)
            this.foreground.drawLine(fromPos, toPos, {
                strokeStyle: [255, 255, 255]
            })
        }

        if (competingPlayers === 1) {
            if (this.health < 100) {
                const startAngle = - Math.PI / 2 - (this.health / 100) * Math.PI
                const endAngle = - Math.PI / 2 + (this.health / 100) * Math.PI

                this.foreground.drawArc(this.pos, this.size, this.owner.colour, startAngle, endAngle)
                this.foreground.drawArc(this.pos, this.size, this.owner.colour.concat(0.2), endAngle, startAngle)

                // this.foreground.drawText(this.pos.add(new Loc(0, -(this.size.y * 0.9))), `${Math.round(this.health)}%`, {
                //     fillStyle: this.owner.colour
                // })
            }
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
            // we have multiple people competing over a planet
            const totalShips = Object.values(this.shipCount).reduce((prev, sum) => prev + sum, 0)
            let lastEndAngle = undefined
            let textOffset = 0
            for (let owner in this.shipCount) {
                if (this.shipCount[owner] !== 0) {
                    if (lastEndAngle === undefined) {
                        lastEndAngle = 3/2 * Math.PI - (this.shipCount[owner] / totalShips) * Math.PI
                    }
                    const nextEndAngle = (lastEndAngle + (this.shipCount[owner] / totalShips) * 2 * Math.PI) % (2 * Math.PI)
                    const ownerColour = window.config.owners.find(searchOwner => searchOwner.id === owner).colour
                    
                    const distance = this.size.scale(2 / 3 + 2 / 6).length()
                    const x = Math.cos(textOffset) * distance
                    const y = Math.sin(textOffset) * distance

                    this.foreground.drawText(this.pos.add(new Loc(x, y)), this.shipCount[owner], {
                        fillStyle: ownerColour
                    })

                    textOffset += Math.PI * 2 / competingPlayers

                    this.foreground.drawArc(this.pos, this.size, ownerColour, lastEndAngle, nextEndAngle)

                    lastEndAngle = nextEndAngle
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
        let [angle, radius] = this.getOrbitalPosition(ship)
        ship.startTravel(ship.pos)

        ship.speed = 0.13 + Math.random() * 0.04

        ship.moveTo(to, to.pos.add(new Loc(Math.cos(angle) * radius * (to.size.length() / from.size.length()),
            Math.sin(angle) * radius * (to.size.length() / from.size.length()) * this.orbitalTilt)))
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