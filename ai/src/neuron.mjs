import { Weight } from "./weight.js"
import { sigmoid, sigmoidDx, linear, linearDx, tanh, tanhDx } from "./func.mjs"

//индевидуальный нейрон (можно поставить любую задачу)
export class Neuron {
    constructor ({
        type,
        weights = [],
        inputs = [],
        output = 0,
        feedForward = {},
        learn = {}
    }) {
        this.type = type

        this.weights = weights
        this.inputs = inputs

        this.output = output

        this.feedForward = feedForward
        this.learn = learn
    }
}

export class NeuronInput {
    constructor () {
        this.type = 0

        this.input = 0

        this.output = 0
        this.delta = 0
    }

    feedForward (input, func) {
        this.input = input
        if (func == "sigmoid") this.output = sigmoid(this.input)
        else if (func == "tanh") this.output = tanh(this.input)
        else if (func == "linear") this.output = linear(this.input)
        return this.output
    }

    learn () {

    }
}

export class NeuronHidden {
    constructor (inputSignal) {
        this.type = 1
        
        this.weights = []
        this.inputs = []

        this.output = 0
        this.delta = 0

        for (let index = 0; index < inputSignal; index++) {
            this.weights.push(new Weight())
            this.inputs.push(0)
        }
    }

    feedForward (inputs, func) {
        let sum = 0
        this.inputs.forEach((input, i) => {
            this.inputs[i] = inputs[i]
            sum += this.inputs[i] * this.weights[i].value
        })
        if (func == "sigmoid") this.output = sigmoid(sum)
        else if (func == "tanh") this.output = tanh(sum)
        else if (func == "linear") this.output = linear(sum)
        return this.output
    }

    learn (error, epsilon, alpha, func) {
        if (func == "sigmoid") this.delta = error * sigmoidDx(this.output)
        else if (func == "tanh") this.delta = error * tanhDx(this.output)
        else if (func == "linear") this.delta = error * linearDx(this.output)
        this.weights.forEach((weight, i) => {
            weight.gradient = this.delta * this.inputs[i]
            weight.change = epsilon * weight.gradient + alpha * weight.change
            weight.value += weight.change
        })
    }
}


export class NeuronOutput {
    constructor (inputSignal) {
        this.type = 2
        
        this.weights = []
        this.inputs = []

        this.output = 0
        this.delta = 0

        for (let index = 0; index < inputSignal; index++) {
            this.weights.push(new Weight())
            this.inputs.push(0)
        }
    }

    feedForward (inputs, func) {
        let sum = 0
        this.inputs.forEach((input, i) => {
            this.inputs[i] = inputs[i]
            sum += this.inputs[i] * this.weights[i].value
        })
        if (func == "sigmoid") this.output = sigmoid(sum)
        else if (func == "tanh") this.output = tanh(sum)
        else if (func == "linear") this.output = linear(sum)
        return this.output
    }

    learn (error, epsilon, alpha, func) {
        if (func == "sigmoid") this.delta = error * sigmoidDx(this.output)
        else if (func == "tanh") this.delta = error * tanhDx(this.output)
        else if (func == "linear") this.delta = error * linearDx(this.output)
        this.weights.forEach((weight, i) => {
            weight.gradient = this.delta * this.inputs[i]
            weight.change = epsilon * weight.gradient + alpha * weight.change
            weight.value += weight.change
        })
    }
}

export class NeuronBias {
    constructor () {
        this.type = 3
        
        this.output = 1
    }

    feedForward (input, func) { return this.output }
}