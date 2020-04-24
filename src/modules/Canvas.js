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

    static init(id, images, onResize = () => {}) {
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

    drawArc(center, size, colour, start, end) {
        this.context.beginPath()
        this.context.strokeStyle = colour
        this.context.arc(center.pointX(this), center.pointY(this), size.sizeX(this), start, end)
        this.context.stroke()
    }

    drawText(loc, text, options = {}) {
        // console.log('drawing text', loc.pointX(this), loc.pointY(this))
        Object.assign(this.context, {
            font: "3vmin Arial",
            fillStyle: "black",
            textBaseline: "middle",
            textAlign: "center"
        }, options)
        this.context.fillText(text, loc.pointX(this), loc.pointY(this)); 

        return this.context.measureText(text)
    }

    drawLine(from, to, options = {}) {
        this.context.beginPath()

        Object.assign(this.context, {
            fillStyle: "black",
        }, options)

        this.context.moveTo(from.pointX(this), from.pointY(this))
        this.context.lineTo(to.pointX(this), to.pointY(this))
        this.context.stroke()
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}