function Food(x,y,r) {
    Boid.call(this, x, y, r);
    this.c = color(255);
    this.maxspeed = 2
    this.maxforce = 0.2
    this.isEaten = false
  }

  Food.prototype = Object.create(Boid.prototype);
  Food.prototype.constructor = Food;
  
  Food.prototype.eat = function() {
      this.isEaten = true
  }

  Food.prototype.isAlive = function() {
    return !this.isEaten
  }

  Food.prototype.wantsToReproduce = function() {
      return random(900) < 1
  }