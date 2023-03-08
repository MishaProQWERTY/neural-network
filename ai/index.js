import { NeuralNet } from "./src/neuralnet.mjs";

const neuralnet = new NeuralNet({
    input: 2,
    output: 1,
    hidden: [],
    bias: true,
    epsilon: 0.7,
    alpha: 0.3,
    maxError: 0.01,
    func: "sigmoid" //"sigmoid", "tanh", "linear"
})

//console.log("До обучения: ", neuralnet.predict([1, 0]))

console.log(neuralnet.backPropagation([
    { input: [0, 0], output: [0] },
    { input: [1, 1], output: [1] },
    { input: [1, 0], output: [0] },
    { input: [0, 1], output: [0] }
]))

console.log("После обучения: ", neuralnet.predict([1, 0]))

//console.log(neuralnet.error({ input: [1, 0], output: [0] }))