export default class Canvas {
    constructor(canvas, images) {
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        this.images = images

        this.size = {
            y: window.innerHeight,
            x: window.innerWidth
        }
        this.edge = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight
        this.xOffset = window.innerWidth > window.innerHeight ? (window.innerWidth - window.innerHeight) / 2 : 0
    }

    static drawBackground(context, images) {
        context.drawImage(images['background'], 0, 0, window.innerWidth, window.innerHeight)
        context.fillStyle = "rgba(0, 0, 0, 0.6)";
        context.fillRect(0, 0, window.innerWidth, window.innerHeight)

        if ('render' in window) window.render.firstRender()
    }

    static init(id, images, onResize = () => { }) {
        const element = document.getElementById(id)

        // resize the canvas to fill browser window dynamically
        window.addEventListener('resize', resizeCanvas, false);

        const canvas = new Canvas(element, images)

        function resizeCanvas() {
            element.width = window.innerWidth;
            element.height = window.innerHeight;

            canvas.size = {
                y: window.innerHeight,
                x: window.innerWidth
            }

            canvas.edge = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight
            canvas.xOffset = window.innerWidth > window.innerHeight ? (window.innerWidth - window.innerHeight) / 2 : 0

            onResize(canvas)
        }

        resizeCanvas()

        return canvas
    }

    drawImage(loc, source, size, angle = 0) {
        this.context.translate(loc.pointX(this) - size.sizeX(this) / 2, loc.pointY(this) - size.sizeY(this) / 2);
        this.context.rotate(angle);
        this.context.drawImage(this.images[source], 0, 0, size.sizeX(this), size.sizeY(this))
        this.context.rotate(-angle);
        this.context.translate(size.sizeX(this) / 2 - loc.pointX(this), size.sizeY(this) / 2 - loc.pointY(this));
    }

    drawShip(loc, start, colour) {
        this.context.save()
        this.context.beginPath()

        const distTravelled = loc.distanceTo(start);
        const scaling = Math.min(0.35 * distTravelled, 7) / distTravelled
        const trailEndX = loc.pointX(this) - scaling * (loc.pointX(this) - start.pointX(this))
        const trailEndY = loc.pointY(this) - scaling * (loc.pointY(this) - start.pointY(this))

        const gradient = this.context.createLinearGradient(loc.pointX(this), loc.pointY(this), trailEndX, trailEndY)

        gradient.addColorStop(0, `rgba(${colour.join(',')})`)
        gradient.addColorStop(0.08, `rgba(${colour.join(',')})`)
        gradient.addColorStop(0.08, `rgba(${colour.join(',')},0.15)`)
        gradient.addColorStop(1, 'transparent')

        this.context.strokeStyle = gradient
        this.context.lineWidth = 2;
        this.context.moveTo(loc.pointX(this), loc.pointY(this))
        this.context.lineTo(trailEndX, trailEndY)

        this.context.stroke()
        this.context.restore()
    }

    drawArc(center, size, colour, start, end, options = {}) {
        this.context.save()
        Object.assign(this.context, options)

        this.context.beginPath()

        if (options.setLineDashArray) {
            this.context.setLineDash(options.setLineDashArray)
        }

        this.context.strokeStyle = `rgba(${colour.join(',')})`
        this.context.arc(center.pointX(this), center.pointY(this), size.sizeX(this), start, end)
        this.context.stroke()
        this.context.restore()
    }

    drawText(loc, text, options = {}) {
        // console.log('drawing text', loc.pointX(this), loc.pointY(this))
        Object.assign(this.context, {
            font: "3vmin Arial",
            fillStyle: "black",
            textBaseline: "middle",
            textAlign: "center"
        }, options)

        if (options.fillStyle) {
            // console.log(options.fillStyle)
            this.context.fillStyle = `rgba(${options.fillStyle.join(',')})`
        }

        this.context.fillText(text, loc.pointX(this), loc.pointY(this)); 

        return this.context.measureText(text)
    }

    drawLine(from, to, options = {}) {
        this.context.save()
        this.context.beginPath()

        Object.assign(this.context, {
            strokeStyle: "black",
        }, options)

        if (options.strokeStyle) {
            this.context.strokeStyle = `rgba(${options.strokeStyle.join(',')})`
        }

        this.context.moveTo(from.pointX(this), from.pointY(this))
        this.context.lineTo(to.pointX(this), to.pointY(this))
        this.context.stroke()
        this.context.restore()
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}