import Planet from './Planet'
import Loc from '../modules/Loc'

export default class Turret extends Planet {
    constructor(opts) {
        const defaults = {
            spawnFrequency: Infinity,
            size: new Loc(5, 5),
            range: 17.5,
            shootingFrequency: 15,
            type: 'turret'
        }
        
        super(opts)
        Object.assign(this, defaults, opts)

        this.laserTicksLeft = 0
        this.laserAim = new Loc(0, 0)
    }

    getEnemiesInRange() {
        let shipsInRange = []
        for (let ship of Object.values(window.render.lightObjects)) {
            if (ship.type === "ship") {
                if (this.pos.distanceTo(ship.pos) < this.range) {
                    shipsInRange.push(ship)
                }
            }
        }
        return shipsInRange
    }

    tick(t) {
        super.tick(t)

        if (t % this.shootingFrequency === 0) {
            const enemies = this.getEnemiesInRange()

            if (enemies.length) {
                // shoot at enemy 0.
                this.renderer.lightRemove(enemies[0])

                // console.log('shooting', enemies[0])
                this.laserTicksLeft = 5
                this.laserAim = enemies[0].pos
            }
        }
    }

    firstRender() {
        this.background.drawImage(this.pos, 'unknownIcon', this.size)
    }

    render(t) {
        super.render(t)

        if (this.hoverOver) {
            this.foreground.drawArc(this.pos, new Loc(this.range, 0), [255, 255, 255], 0, 2 * Math.PI, {
                setLineDashArray: [5, 15]
            })
        }

        if (this.laserTicksLeft > 0) {
            this.laserTicksLeft -= 1
            this.foreground.drawLine(this.pos, this.laserAim, {"strokeStyle": [255, 200, 200, 0.5]})
        }
    }

    clickOver(event, clicked) {
        super.clickOver(event, clicked)

        this.hoverOver = true
    }
}