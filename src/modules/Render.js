import Loc from './Loc'
import { zeroObject } from '../utils/proxy'

export default class Render {
    constructor(background, foreground) {
        this.objects = {}
        this.lightObjects = {}
        this.globalEvents = {}
        this.background = background
        this.foreground = foreground
        this.clicked = false
        this.tickCount = 0
        this.level = undefined

        this.shouldDestroy = false
    }

    onKeyPress(event) {
        console.log('key press', event)
        if (this.level) {
            if (event.charCode >= 48 && event.charCode <= 57) {
                // user pressed a number key
                this.level.onNumPress(event)
            }
        }
    }

    destroy() {
        this.shouldDestroy = true
    }

    addObject(object, opts = {}) {
        // console.log(object)
        this.objects[object.id] = object
        if (opts.globalEvents) this.globalEvents[object.id] = object
        object.renderer = this
        object.firstRender()
    }

    addLightObject(object) {
        this.lightObjects[object.id] = object
        object.renderer = this
        object.firstRender()
    }

    lightRemove(object) {
        this.lightObjects[object.id].delete = true
    }

    addLevel(level) {
        this.level = level
    }

    firstRender() {
        for (let id in this.objects) {
            this.objects[id].firstRender()
        }

        for (let id in this.lightObjects) {
            this.lightObjects[id].firstRender()
        }
    }

    tick() {
        window.meter.tickStart()
        // console.log('tick', this.objects)
        // clear foreground
        this.foreground.clear()

        for (let id in this.objects) {
            this.objects[id].tick(this.tickCount)
            this.objects[id].render(this.tickCount)
        }

        for (let id in this.lightObjects) {
            this.lightObjects[id].tick(this.tickCount)
            this.lightObjects[id].render(this.tickCount)

            if (this.lightObjects[id].delete) {
                this.lightObjects[id].delete = false
                delete this.lightObjects[id]
            }
        }

        this.level.tick(this.tickCount)

        this.tickCount += 1

        window.meter.tick()

        if (!this.shouldDestroy) {
            window.requestAnimationFrame(this.tick.bind(this))
        } else {
            this.foreground.clear()
        }
    }

    hits(pos) {
        const objects = []

        for (let object of Object.values(this.objects)) {
            if (pos.inObject(object)) {
                objects.push(object)
            }
        }

        return objects
    }

    mouseDown(event) {
        const pos = Loc.fromAbsolute(this.background, event.clientX, event.clientY)

        this.hits(pos).forEach(object => object.onClick())

        this.clicked = true
    }

    mouseUp(event) {
        const pos = Loc.fromAbsolute(this.background, event.clientX, event.clientY)

        for (let object of Object.values(this.objects)) {
            if (pos.inObject(object)) {
                object.onUnclick(false)
            } else {
                object.onUnclick(true)
            }
        }

        window.state.inSelection.ours = {}

        // window.state.inSelection.target = {}

        this.clicked = false
    }

    mouseMove(event) {
        const pos = Loc.fromAbsolute(this.background, event.clientX, event.clientY)

        const hits = new Proxy({}, zeroObject)
        this.hits(pos).forEach(object => {
            hits[object.type] += 1
            object.clickOver(event, this.clicked)
        })

        if (this.clicked) {
            if (hits['planet'] === 0 && hits['teleporter'] === 0) {
                // not over planet
                window.state.inSelection.target = { type: 'location', pos }
            }
        }

        if (hits['turret'] === 0) {
            for (let turret of this.level.objects['turret']) {
                turret.hoverOver = false
            }
        }

        for (let object of Object.values(this.globalEvents)) {
            object.clickOver(event, this.clicked)
        }
    }
}