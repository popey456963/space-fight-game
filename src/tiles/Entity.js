import { v4 as uuidv4 } from 'uuid'
import Loc from '../modules/Loc'

const pause = time => new Promise(resolve => setTimeout(resolve, time))

export default class Entity {
    constructor(opts) {
        // console.log(opts)

        const defaults = {
            owner: window.config.owners[0],
            size: new Loc(5, 5),
            type: 'entity'
        }

        Object.assign(this, defaults, opts)

        this.background = this.canvases.background
        this.foreground = this.canvases.foreground

        this.id = uuidv4()
    }

    tick() {
        // do nothing
    }

    firstRender() {
        this.background.drawImage(this.pos, 'unknownIcon', this.size)
    }

    render() {
        // console.log('rendering base', this.pos)
    }
    
    onClick() {
        console.log('we were clicked')
    }

    onUnclick() {
        console.log('we were unclicked')
    }

    clickOver(event, clicked) {
        console.log('we were clicked over: ', clicked)
    }
}