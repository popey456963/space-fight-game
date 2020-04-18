export default class Loc {
    constructor(x, y) {
        // locations go from 0 to 100 and determine the percentage an object
        // is along the screen
        this.x = x
        this.y = y
    }

    getPoint(canvas) {
        return {
            x: this.pointX(canvas),
            y: this.pointY(canvas)
        }
    }

    pointX(canvas) {
        return parseInt(this.x * canvas.edge * 0.01 + canvas.xOffset)
    }

    pointY(canvas) {
        return parseInt(this.y * canvas.edge * 0.01)
    }

    sizeX(canvas) {
        return this.x * 0.01 * canvas.edge
    }

    sizeY(canvas) {
        return this.y * 0.01 * canvas.edge
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    static fromAbsolute(canvas, x, y) {
        return new Loc((x - canvas.xOffset) / 0.01 / canvas.edge, y / 0.01 / canvas.edge)
    }

    inObject(object) {
        const halfX = object.size.x / 2
        const halfY = object.size.y / 2

        return this.x + halfX > object.pos.x && this.y + halfY > object.pos.y && this.x - halfX < (object.pos.x + object.size.x) && this.y - halfY < (object.pos.y + object.size.y)
    }

    add(loc) {
        return new Loc(this.x + loc.x, this.y + loc.y)
    }

    scale(scalar) {
        return new Loc(this.x * scalar, this.y * scalar)
    }

    jiggle(max) {
        return new Loc(this.x + (Math.random() - 0.5) * max * 2, this.y + (Math.random() - 0.5) * max * 2)
    }

    move(aim, speed) {
        const angle = Math.atan2(aim.y - this.y, aim.x - this.x)

        return new Loc(this.x + speed * Math.cos(angle), this.y + speed * Math.sin(angle))
    }

    distanceTo(to) {
        return Math.sqrt(Math.pow(to.y - this.y, 2) + Math.pow(to.x - this.x, 2))
    }
}