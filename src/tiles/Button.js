import Entity from './Entity'
import Loc from '../modules/Loc'

export default class Button extends Entity {
    constructor(opts) {
        const defaults = {
            type: 'button',
            text_colour: () => { return [255, 0, 0] },
            callback: () => {}
        }

        super(opts)
        Object.assign(this, defaults, opts)

        this.length = new Loc(this.size.x, 0)
    }

    firstRender() {
        this.background.drawLine(
            this.pos.add(this.length.scale(-0.5)),
            this.pos.add(this.length.scale(0.5)),
            {
                "strokeStyle": [255, 255, 255],
                "lineWidth": this.size.pointY(this.background),
            }
        )

        this.background.drawText(this.pos, this.text, {
            fillStyle: this.text_colour()
        })
    }

    render() {
    }
    
    onClick() {
        this.callback()
    }
}