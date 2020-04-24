import shuffle from 'lodash/shuffle'
import { zeroObject } from '../utils/proxy'

export default class AI {
    constructor(level, player) {
        this.player = player
        this.level = level
    }

    start() {
        this.interval = setInterval(() => {
            this.tick()
        }, 1000)
    }

    stop() {
        clearInterval(this.interval)
    }

    tick() {
        // console.log('running ai')

        // work out ships in transit
        // shipsToPlanet {
        //     [planetId]: {
        //         [userId]: shipsInTransit
        //     }
        // }

        const shipsToPlanet = {}
        const owners = {}
        window.config.owners.forEach(user => owners[user.id] = 0)
        this.level.getPlanets().forEach(planet => shipsToPlanet[planet.id] = Object.assign({}, owners))


        for (let item of Object.values(this.level.render.lightObjects)) {
            const ship = item
            if (ship.type === 'ship') {
                // we have a ship!
                const owner = ship.owner.id
                const planet = ship.aimPlanet.id

                shipsToPlanet[planet][owner] += 1
            }
        }

        console.log(shipsToPlanet)

        const planetStates = {
            'winning': [], // do nothing
            'owned': [], // send all to other planet
            'losing': [], // send all to other planet
            'enemy': [] // to be attacked
        }

        for (let planet of this.level.getPlanets()) {
            const competingPlayers = Object.values(planet.shipCount).filter(count => count !== 0).length

            if (competingPlayers === 0 || competingPlayers === 1) {
                // no competition is happening
                if (planet.ownedBy(this.player) && planet.totalShips === planet.shipCount[this.player.id]) {
                    planetStates.owned.push(planet)
                } else {
                    planetStates.enemy.push(planet)
                }
            } else {
                // more than one person is competing for this planet.
                
                // are we not competing for it?
                if (planet.shipCount[this.player.id] === 0) {
                    planetStates.enemy.push(planet)
                }

                // then we are competing for it, so we need to figure out
                // whether we are winning or not...
                if (Math.max.apply(null, Object.values(planet.shipCount)) === planet.shipCount[this.player.id]) {
                    // we have the most amount of ships!
                    planetStates.winning.push(planet)
                } else {
                    // alas, we're losing.
                    planetStates.losing.push(planet)
                }
            }
        }

        shuffle(planetStates.enemy)

        for (let ownedPlanet of planetStates.owned) {
            // console.log('hello')
            // console.log(planetStates.enemy.length)
            for (let enemyPlanet of planetStates.enemy) {   
                if (shipsToPlanet[enemyPlanet.id][this.player.id] < enemyPlanet.totalShips) {
                    if (enemyPlanet.totalShips < ownedPlanet.shipCount[this.player.id]) {
                        let frac_to_send = (enemyPlanet.totalShips * 1.2 + 10) / ownedPlanet.shipCount[this.player.id];
                        frac_to_send = Math.min(frac_to_send, 1.0);
                        // console.log('sending ship to other planet')
                        ownedPlanet.sendShips(this.player, enemyPlanet, frac_to_send);

                        // console.log('we are breaking')
                        break;
                    }
                }
            }
        }
        for (let losingPlanet of planetStates.losing) {
            let moved = false;
            for (let enemyPlanet of planetStates.enemy) {
                if (enemyPlanet.totalShips < losingPlanet.shipCount[this.player.id]) {
                    //let frac_losing_by = enemyPlanet.shipCount[this.player.id] / enemyPlanet.totalShips
                    //frac_losing_by = Math.min(Math.max(frac_losing_by, 0.5)
                    losingPlanet.sendShips(this.player, enemyPlanet, 1);
                    moved = true;
                    break;
                }
            }
            if (!moved) {
                let nearestOwned = planetStates.owned.reduce((prev_best, cur) => {
                    const dist = losingPlanet.pos.distanceTo(cur.pos);
                    if (dist < prev_best.dist && dist != 0) {
                        return {"dist": dist, "planet": cur};
                    }
                    else {
                        return prev_best;
                    }
                }, {"dist": Infinity, "planet": undefined});

                if (nearestOwned.planet) {
                    losingPlanet.sendShips(this.player, nearestOwned.planet, 1);
                }
            }
        }
    }
}