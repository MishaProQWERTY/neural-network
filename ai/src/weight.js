export class Weight {
    constructor (value = Math.random()) {
        this.gradient = 0
        this.change = 0 //предыдущее изменение веса
        
        this.value = value
    }
}