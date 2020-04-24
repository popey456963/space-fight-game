export const zeroObject = {
    get: function (obj, prop) {
        return prop in obj ? obj[prop] : 0
    },

    set: function (obj, prop, value) {
        obj[prop] = value

        if (isNaN(value)) throw new Error('Set Not a Number')

        return true
    }
}

export const arrayObject = {
    get: function (obj, prop) {
        return prop in obj ? obj[prop] : []
    },

    set: function (obj, prop, value) {
        obj[prop] = value

        return true
    }
}