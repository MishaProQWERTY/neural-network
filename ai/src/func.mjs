//функции активации и их производные
export function linear (x) {
    return x
}

export function linearDx (x) {
    return 1
}

export function sigmoid (x) {
    return 1 / (1 + Math.pow(Math.E, -x))
}

export function sigmoidDx (x) {
    return x * (1 - x)
}

export function tanh (x) {
    const e2x = Math.pow(Math.E, 2 * x)
    return (e2x - 1) / (e2x + 1)
}

export function tanhDx (x) {
    return 1 - x*x
}

//возразает ошибку в процентах
export function mse ({
    output = [],
    ideal = []
}) {
    let sum = 0
    if (output.length != ideal.length) return 0
    for (let i = 0; i < output.length; i++) sum += Math.pow(ideal[i]-output[i], 2)
    sum /= ideal.length
    return sum
}

//альтерначивы mse
export function rootMse ({
    output = [],
    ideal = []
}) {
    return Math.sqrt(mse({ output, ideal }))
}

export function arctan ({
    output = [],
    ideal = []
}) {
    let sum = 0
    if (output.length != ideal.length) return 0
    for (let i = 0; i < output.length; i++) sum += Math.pow(Math.atan(ideal[i]-output[i]), 2)
    sum /= ideal.length
    return sum
}