import Entity from './Entity'
import Ship from './Ship'
import Loc from '../modules/Loc'

export default class Slider extends Entity {
    constructor(opts) {
        const defaults = {
            value: 1,
            type: 'slider'
        }

        super(opts)
        Object.assign(this, defaults, opts)

        this.length = new Loc(this.sizeBackground.x, 0)
        this.width = this.sizeBackground.y
    }

    setValue(value) {
        console.log('changing value to', value)
        this.value = value
        window.state.shipTransferenceRatioSliderValue = this.value
    }

    tick(t) {
    }

    firstRender() {
        //this.background.drawImage(this.posBackground, 'sliderBackgroundIcon', this.sizeBackground)
        this.background.drawLine(
            this.posBackground.add(this.length.scale(-0.5)),
            this.posBackground.add(this.length.scale( 0.5)),
            {
                "strokeStyle": [255, 255, 255],
                "lineWidth": this.width,
                "lineCap": "round"
            }
        )
    }

    render(t) {
        this.pos = new Loc(this.posBackground.x + (this.value - 0.5) * this.sizeBackground.x, this.posBackground.y)
        this.foreground.drawArc(this.pos, this.size.scale(0.5), [255, 255, 255], 0, 2*Math.PI, {"lineWidth": 4})

        this.foreground.drawText(this.pos.add(new Loc(0, -3)), `${parseInt(this.value * 100)}%`, {
            fillStyle: [255, 255, 0]
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