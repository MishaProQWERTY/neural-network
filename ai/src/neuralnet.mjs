import { NeuronInput, NeuronHidden, NeuronOutput, NeuronBias } from "./neuron.mjs"
import { mse, rootMse, arctan } from "./func.mjs"

export class NeuralNet {
    constructor ({
        input = 2,
        output = 1,
        hidden = [],
        bias = true,
        item = 200000,
        epsilon = 0.7,
        alpha = 0.3,
        maxError = 0.01,
        func = "sigmoid"
    }) {
        this.layers = {
            input: [],
            hidden: [],
            output: []
        }

        this.item = item
        this.epsilon = epsilon
        this.alpha = alpha
        
        this.maxError = maxError

        this.bias = bias
        this.func = func

        for (let i = 0; i < input; i++) this.layers.input.push(new NeuronInput())
        if (this.bias) this.layers.input.push(new NeuronBias())
        for (let i = 0; i < hidden.length; i++) {
            let prevLayerCount = i === 0 ? this.layers.input.length : this.layers.hidden[i - 1].length
            let layer = []
            for (let j = 0; j < hidden[i]; j++) layer.push(new NeuronHidden(prevLayerCount))
            if (this.bias) layer.push(new NeuronBias())
            this.layers.hidden.push(layer)
        }
        let prevLayerCount = this.layers.hidden.length === 0 ? this.layers.input.length : this.layers.hidden[this.layers.hidden.length - 1].length
        for (let i = 0; i < output; i++) this.layers.output.push(new NeuronOutput(prevLayerCount))
    }

    predict (inputSignal) {
        this.layers.input.forEach((neuron, i) => neuron.feedForward(inputSignal[i], this.func))
        for (let i = 0; i < this.layers.hidden.length; i++) {
            let prevLayer = i === 0 ? this.layers.input : this.layers.hidden[i - 1]
            let signals = []
            prevLayer.forEach(neuron => signals.push(neuron.output))
            this.layers.hidden[i].forEach(neuron => neuron.feedForward(signals, this.func))
        }
        let prevLayer = this.layers.hidden.length === 0 ? this.layers.input : this.layers.hidden[this.layers.hidden.length - 1]
        let signals = []
        prevLayer.forEach(neuron => signals.push(neuron.output))
        this.layers.output.forEach(neuron => neuron.feedForward(signals, this.func))
        
        let output = []
        this.layers.output.forEach(neuron => output.push(neuron.output))
        return output
    }

    backPropagation (train = [{ input: [], output: [] }]) {
        let errorItem = 0
        for (let n = 0; n < this.item; n++) {
            let sumError = 0;
            for (let t = 0; t < train.length; t++) {
                let actual = this.predict(train[t].input)
                this.layers.output.forEach((neuron, i) => neuron.learn(train[t].output[i] - actual[i], this.epsilon, this.alpha, this.func))

                for (let i = this.layers.hidden.length - 1; i > 0; i--) {
                    let layer = this.layers.hidden[i]
                    let prevLayer = i === this.layers.hidden.length - 1 ? this.layers.output : this.layers.hidden[i+1]
                    layer.forEach((neuron, j) => {
                        let error = 0
                        prevLayer.forEach((prevLayerNeuron) => { if (prevLayerNeuron.type != 3) error += prevLayerNeuron.delta * prevLayerNeuron.weights[j].value })
                        if (j != layer.length-1) neuron.learn(error, this.epsilon, this.alpha, this.func)
                    })
                }

                sumError += mse({ output: actual, ideal: train[t].output })
            }
            errorItem = sumError
            if (sumError/train.length <= this.maxError) return { item: n, error: sumError/train.length } //проверка нейронной сети на качетво обучения
        }
        return { item: this.item, error: errorItem/train.length }
    }

    error ({
        input = [],
        output = []
    }) {
        let predict = this.predict(input)
        return {
            mse: mse({ output: predict, ideal: output }),
            rootMse: rootMse({ output: predict, ideal: output }),
            arctan: arctan({ output: predict, ideal: output })
        }
    }
}