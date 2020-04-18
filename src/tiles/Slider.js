import Entity from './Entity'
import Ship from './Ship'
import Loc from '../modules/Loc'

export default class Slider extends Entity {
    constructor(opts) {
        const defaults = {
            value: 1
        }

        super(opts)
        Object.assign(this, defaults, opts)
    }

    tick(t) {
    }

    firstRender() {
        this.background.drawImage(this.posBackground, 'sliderBackgroundIcon', this.sizeBackground)
    }

    render(t) {
        this.pos = new Loc(this.posBackground.x + (this.value - 0.5) * this.sizeBackground.x, this.posBackground.y)

        this.foreground.drawImage(this.pos, 'sliderIcon', this.size)
        this.foreground.drawText(this.pos.add(new Loc(0, -2.5)), `${parseInt(this.value * 100)}%`, {
            fillStyle: 'black'
        })
    }

    onClick() {
        this.isMoving = true
    }

    onUnclick(isGlobal) {
        this.isMoving = false
    }

    clickOver(event, clicked) {
        if (this.isMoving) {
            const pos = Loc.fromAbsolute(this.background, event.clientX, event.clientY)

            // this.value = 0 - 1, based on percentage of slider
            this.value = (pos.x - this.posBackground.x + this.sizeBackground.x/2) / this.sizeBackground.x;
            this.value = Math.min(Math.max(this.value, 0.0), 1.0)
            window.state.shipTransferenceRatioSliderValue = this.value
        }
    }
}