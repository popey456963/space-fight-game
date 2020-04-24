import { arrayObject } from '../utils/proxy'

export default class Level {
    constructor(canvases, render) {
        this.canvases = canvases
        this.render = render

        this.objects = new Proxy({}, arrayObject)
    }

    addObject(object, opts) {
        render.addObject(object, opts)
        this.objects[object.type] = this.objects[object.type].concat(object)
    }

    getPlanets() {
        return this.objects.planet.concat(this.objects.teleporter)
    }
}