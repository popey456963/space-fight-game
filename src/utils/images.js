const images = {
    "unknownIcon": require("../assets/unknown_icon.jpg"),
    "planetIcon": require("../assets/planet_green.svg"),
    "sliderBackgroundIcon": require("../assets/slider_background_icon.svg"),
    "sliderIcon": require("../assets/slider_icon.svg"),
    "blackholeIcon": require("../assets/blackhole.png"),
    "redShipIcon": require("../assets/ship_red.svg"),
    "greenShipIcon": require("../assets/ship_green.svg"),
    "blueShipIcon": require("../assets/ship_blue.svg"),
    "purpleShipIcon": require("../assets/ship_purple.svg"),
    "background": require("../assets/space.jpg")
}

export function addImage(name, source) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = source
        img.onload = () => {
            resolve([name, img])
        }
        img.onerror = (err) => {
            console.log(err)
            reject(name)
        }
    })
}

export function loadImages() {
    return Promise.all(
        Object.entries(images).map(([name, source]) => {
            return addImage(name, source)
        })
    ).then(images => {
        return images.reduce((obj, item) => {
            return Object.assign(obj, { [item[0]]: item[1] })
        }, {})
    })
}