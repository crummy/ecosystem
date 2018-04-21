function Tail(x,y) {
    this.parts = []
    this.addPart(x, y)
    this.maxLength = 32
    this.linkLength = 4
    colorMode(RGB)
    this.c = color(255, 0, 0)
    this.desiredColor = this.c;
}

Tail.prototype.setColor = function(c) {
    this.desiredColor = c
}

Tail.prototype.isHungry = function() {
    return this.maxLength < 150
}

Tail.prototype.grow = function() {
    this.maxLength += 50
}

Tail.prototype.addPart = function(x, y) {
    this.parts.push(createVector(x, y))
}

Tail.prototype.shrink = function() {
    this.maxLength -= this.maxLength * 0.001
    let sum = 0
    for (let i = 0; i < this.parts.length - 2; ++i) {
        let part = this.parts[i]
        let nextPart = this.parts[i+1]
        sum += p5.Vector.dist(part, nextPart)
    }
    if (sum > this.maxLength) {
        this.parts.shift()
    }
}

Tail.prototype.update = function(x, y) {
    const part = this.parts[this.parts.length - 1]
    if (p5.Vector.dist(part, createVector(x, y)) > this.linkLength) {
        this.addPart(x, y)
    }
}

Tail.prototype.display = function(x, y) {
    this.c = lerpColor(this.c, this.desiredColor, 0.05)
    stroke(this.c)
    strokeWeight(4)
    line(x, y, this.parts[this.parts.length - 1].x, this.parts[this.parts.length - 1].y)
    for (let i = 0; i < this.parts.length - 1; ++i) {
        let part = this.parts[i]
        let nextPart = this.parts[i+1]
        if (p5.Vector.dist(part, nextPart) < this.linkLength * 2) {
            line(part.x, part.y, nextPart.x, nextPart.y)
        }
    }
}