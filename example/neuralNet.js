class Weight {
    constructor (value = Math.random()) {
        this.gradient = 0
        this.delta = 0

        this.value = value
    }
}

class Neuron {
    constructor (inputSignal, type = 1) {
        this.weights = []
        this.inputs = []
       
        this.type = type

        this.output = 0
        this.delta = 0

        for (let i = 0; i < inputSignal; i++) {
            if (this.type != 0 && this.type != 3) this.weights.push(new Weight())
            this.inputs.push(1)
        }
    }

    insertInput (inputs) { this.inputs.forEach((input, i) => input = inputs[i]) }

    feedForward (inputs) {
        inputs.forEach((input, i) => this.inputs[i] = input)
        if (this.type == 3) this.output = 1
        else if (this.type != 0) this.output = this.sigmoid(this.inputs.reduce((ass, input, i) => {
            return ass + input * this.weights[i].value
        }))
        return this.output
    }

    learn (error, epsilon, alpha) {
        this.delta = error * this.sigmoidDx(this.output)
        for (let i = 0; i < this.weights.length; i++) {
            let weight = this.weights[i]
            weight.gradient = this.delta * this.inputs[i]
            weight.delta = epsilon * weight.gradient + alpha * weight.delta
            weight.value += weight.delta
        }
    }
    
    sigmoid (x) {
        return 1 / (1 + Math.pow(Math.E, -x))
    }

    sigmoidDx (x) {
        return x * (1 - x)
    }

    tanh (x) {
        const e2x = Math.pow(Math.E, 2 * x)
        return (e2x - 1) / (e2x + 1)
    }
    
    tanhDx (x) {
        return 1 - x*x
    }
}

class NeuralNet {
    constructor (inputCount, hiddenCount, outputCount, bias = true) {
        this.layers = {
            input: [],
            hidden: [],
            output: []
        }

        this.bias = bias

        for (let i = 0; i < inputCount; i++) this.layers.input.push(new Neuron(1, 0))
        for (let i = 0; i < hiddenCount.length; i++) {
            let prevLayerCount = i === 0 ? this.layers.input.length : this.layers.hidden[i - 1].length
            let layer = []
            for (let j = 0; j < hiddenCount[i]; j++) layer.push(new Neuron(prevLayerCount))
            if (this.bias) layer.push(new Neuron(prevLayerCount, 3))
            this.layers.hidden.push(layer)
        }
        for (let i = 0; i < outputCount; i++) this.layers.output.push(new Neuron(this.layers.hidden[this.layers.hidden.length - 1].length, 2))
    }

    predict (inputSignal) {
        for (let i = 0; i < inputSignal.length; i++) this.layers.input[i].output = inputSignal[i]
        this.layers.hidden.forEach((layer, i) => {
            let prevLayer = i === 0 ? this.layers.input : this.layers.hidden[i - 1]
            let signals = []
            prevLayer.forEach(neuron => signals.push(neuron.output))
            layer.forEach(neuron => neuron.feedForward(signals))
        })
        this.layers.output.forEach(neuron => {
            let prevLayer = this.layers.hidden[this.layers.hidden.length - 1]
            let signals = []
            prevLayer.forEach(prevNeuron => signals.push(prevNeuron.output))
            neuron.feedForward(signals)
        })
        let outputs = []
        this.layers.output.forEach(neuron => outputs.push(neuron.output))
        return outputs
    }

    backPropagation (data, { 
        item = 20000,
        epsilon = 0.7,
        alpha = 0.3
    }) {
        for (let itms = 0; itms < item; itms++) {
            for (let index = 0; index < data.length; index++) {
                let actual = this.predict(data[index].input)
                
                this.layers.output.forEach((neuron, i) => neuron.learn(data[index].output[i] - actual[i], epsilon, alpha))

                for (let l = this.layers.hidden.length - 1; l >= 0; l--) {
                    const layer = this.layers.hidden[l]
                    const prevLayer = l === this.layers.hidden.length - 1 ? this.layers.output : this.layers.hidden[l + 1]
                    layer.forEach((neuron, i) => neuron.learn(prevLayer.reduce((acc, prevLayerNeuron) => { 
                        if (prevLayerNeuron.type != 3) return acc + prevLayerNeuron.weights[i].value * prevLayerNeuron.delta
                        else return acc
                    }, 0), epsilon, alpha))
                }
            }
        }
    }

    JSON () {
        const data = {
            input: this.layers.input.length,
            hidden: [],
            output: this.layers.output.length,
            weights: [],
            bias: this.bias
        }
        this.layers.hidden.forEach(layer => data.hidden.push(layer.length-1))

        this.layers.hidden.forEach(layer => layer.forEach(neuron => { if (neuron.type != 3) neuron.weights.forEach(weight => data.weights.push(weight.value)) }))
        this.layers.output.forEach(neuron => neuron.weights.forEach(weight => data.weights.push(weight.value)))
        return data
    }
}

class NeuralNetJSON extends NeuralNet {
    constructor (json) {
        super(json.input, json.hidden, json.output, json.bias)

        this.layers.hidden.forEach(layer => layer.forEach(neuron => neuron.weights.forEach(weight => weight.value = json.weights.shift())))
        this.layers.output.forEach(neuron => neuron.weights.forEach(weight => weight.value = json.weights.shift()))
    }
}

/*module.exports = {
    Neuron,
    NeuralNet,
    NeuralNetJSON
}*/