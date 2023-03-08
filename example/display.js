class Display {
    constructor (width = 1000, height = 500) {
        this.canvas = document.getElementById('canvas')
        this.ctx = this.canvas.getContext('2d')

        this.size = { width: width, height: height }
        this.pixel = { width: 15, height: 15 }

        this.img = []

        this.pensil = {
            draw: false,
            eraser: false,
            blur: 90,
            size: 15,
            r: 200,
            g: 10,
            b: 100,
            color: '',
            x: 0,
            y: 0,
            img_x: 0,
            img_y: 0
        }

        this.pensil.color = `rgba(${this.pensil.r}, ${this.pensil.g}, ${this.pensil.b}, ${this.pensil.blur/100})`

        for (let i = 0; i < this.pixel.width; i++) {
            this.img.push([])
            for (let j = 0; j < this.pixel.height; j++) {
                this.img[i].push(0)
            }
        }

        this.initSize()

        this.canvas.addEventListener("mousedown", (e) => {
            this.pensil.draw = true
            this.draw(e)
        })

        this.canvas.addEventListener("mouseup", (e) => {
            this.pensil.draw = false
        })

        this.canvas.addEventListener("mouseout", (e) => {
            this.pensil.draw = false
        })

        this.canvas.addEventListener("mousemove", (e) => {
            if (this.pensil.draw == true) this.draw(e)
        })
    }

    initSize () {
        this.canvas.width = this.size.width
        this.canvas.height = this.size.height
    }

    draw (e) {
        let cRect = canvas.getBoundingClientRect()
        this.pensil.x = Math.round(e.clientX - cRect.left)
        this.pensil.y = Math.round(e.clientY - cRect.top)
        this.pensil.img_x = Math.round(this.pensil.x/(this.size.width/this.pixel.width))
        this.pensil.img_y = Math.round(this.pensil.y/(this.size.height/this.pixel.height))

        this.ctx.fillStyle = this.pensil.color
        this.ctx.beginPath()
        this.ctx.arc(this.pensil.x, this.pensil.y, this.pensil.size, 0, 2 * Math.PI)
        if (this.pensil.eraser == false) this.ctx.fill()
        else {
            this.ctx.fillStyle = `rgba(255, 255, 255, 1)`
            this.ctx.fill()
        }
        if (this.pensil.img_x >= this.pixel.width) this.pensil.img_x = this.pixel.width - 1
        if (this.pensil.img_y >= this.pixel.height) this.pensil.img_y = this.pixel.height - 1
        if (this.pensil.eraser == false) this.img[this.pensil.img_x][this.pensil.img_y] = 1
        else this.img[this.pensil.img_x][this.pensil.img_y] = 0
    }

    digitalisere () {
        for (let i = 0; i < this.pixel.width; i++) {
            for (let j = 0; j < this.pixel.height; j++) {
                if (this.img[i][j] == 1) this.ctx.fillStyle = this.pensil.color
                else this.ctx.fillStyle = `rgba(255, 255, 255, 1)`
                this.ctx.fillRect(i*(this.size.width/this.pixel.width), j*(this.size.width/this.pixel.width), (this.size.width/this.pixel.width), (this.size.width/this.pixel.width))
            }
        }
    }

    delit () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        for (let i = 0; i < this.pixel.width; i++) {
            for (let j = 0; j < this.pixel.height; j++) {
                this.img[i][j] = 0
            }
        }
    }

    eraser (el) {
        this.pensil.eraser = !this.pensil.eraser
        if (this.pensil.eraser) el.className = 'button-cont-invevia'
        else el.className = 'button-cont'
    }
}

const display = new Display(500, 500)
//const net = new NeuralNet(15*15, [4], 2)
const net = new NeuralNetJSON(JSON.parse(document.getElementById('data').textContent))
let train = []

function download () {
    let json = JSON.stringify(net.JSON())
    let blob = new Blob([json], {type: "application/json"})
    let url  = URL.createObjectURL(blob)
    let link = document.createElement('a')
    link.download = "data.json"
    link.href = url
    link.click()
}

function learn () {
    display.digitalisere()
    let img = []
    for (let i = 0; i < display.pixel.width; i++) {
        for (let j = 0; j < display.pixel.height; j++) {
            img.push(display.img[i][j])
        }
    }
    
    if (confirm('Положительный\n Да=Ок, Нет=Отмена')) train.push({ input: img, output: [1, 0] })
    else train.push({ input: img, output: [0, 1] })
}

function answer () {
    display.digitalisere()
    let img = []
    for (let i = 0; i < display.pixel.width; i++) {
        for (let j = 0; j < display.pixel.height; j++) {
            img.push(display.img[i][j])
        }
    }
    net.backPropagation(train, { item: 20000, epsilon: 0.3, alpha: 0.7 })
    let output = net.predict(img)
    if (output[0] > output[1]) alert('Галочка\nВероятность = ' + output[0])
    else alert('Крестик\nВероятность = ' + output[1])
}