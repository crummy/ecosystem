function Boid(x, y, rad) {
    this.loc = new p5.Vector(x, y);
    this.acc = new p5.Vector(0, 0);
    this.vel = new p5.Vector(random(-1, 1), random(-1, 1));
    this.r = rad;
    this.c = (255, 50, 200);
    this.maxspeed = 3;
    this.maxforce = 0.05;
  }

  Boid.prototype.wander = function() {
    const wanderR = 30
    const wanderD = 90
    this.theta += random(-0.3, 0.3)
    
    let circlepos = this.vel.copy()
    circlepos.normalize()
    circlepos.mult(wanderD)
    circlepos.add(this.loc)
    
    let h = this.vel.heading()
    
    let circleOffset = createVector(wanderR*cos(this.theta+h), wanderR * sin(this.theta+h))
    let t = new p5.Vector.add(circlepos, circleOffset)
    
    let desired = new p5.Vector.sub(t, this.loc)
    desired.normalize()
    desired.mult(this.maxspeed)
    let steer = new p5.Vector.sub(desired, this.vel)
    steer.limit(this.maxforce)
    this.applyForce(steer)
  }

  Boid.prototype.applyForce = function(force) {
    // Force = mass * acceleration
    let fAcc = new p5.Vector.div(force, this.r * 2);
    this.acc.add(fAcc);
  };
  
  Boid.prototype.update = function() {
    this.vel.add(this.acc);
    this.loc.add(this.vel);
    this.checkEdges()
    this.vel.limit(this.maxspeed);
    this.acc.mult(0);
  };
  
  Boid.prototype.display = function() {
    fill(this.c);
    noStroke();
    push();
    translate(this.loc.x, this.loc.y);
    rotate(this.vel.heading() + radians(90));
    beginShape();
    vertex(this.r / 2, 0);
    vertex(this.r, this.r);
    vertex(0, this.r);
    endShape(CLOSE);
    pop();
  };

  Boid.prototype.checkEdges = function() {
      const padding = 10
      if (this.loc.x > width+padding) {
          this.loc.x = -padding
      } else if (this.loc.x < -padding) {
          this.loc.x = width+padding
      }
      if (this.loc.y > height+padding) {
        this.loc.y = -padding
    } else if (this.loc.y < -padding) {
        this.loc.y = height+padding
    }
  }


  function Hunter(x,y,r) {
    Boid.call(this, x, y, r);
    this.c = color(226, 43, 43);
    this.maxspeed = 4
    this.maxforce = 0.5
    this.tail = new Tail(x, y)
  }

  Hunter.prototype = Object.create(Boid.prototype);
  Hunter.prototype.constructor = Hunter;

  Hunter.prototype.isAlive =function() {
      if (this.tail.maxLength > 0) {
          return true
      } else {
          return false
      }
  }

  Hunter.prototype.starve = function() {
      this.tail.shrink()
  }

  Hunter.prototype.isHungry = function() {
    return this.tail.isHungry()
}

  Hunter.prototype.hunt = function(food) {
    const perceptionRadius = 3*this.r
    let closestDistance = 9999999;
    let closestFood = undefined;
    for (f of food) {
        const distance = p5.Vector.dist(this.loc, f.loc)
        if (distance < closestDistance) {
            closestDistance = distance;
            closestFood = f;
        }
    }
    if (closestDistance < 4 || closestDistance < this.r) {
        closestFood.eat()
        console.log("Eating food")
        this.tail.grow()
    }
    if (closestFood !== undefined) {
        let desired = new p5.Vector.sub(closestFood.loc, this.loc);
        desired.normalize();
        desired.mult(this.maxspeed);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);
        this.applyForce(steer)
    }
  }

  Hunter.prototype.wantsToMate = function() {
      return !this.isHungry()
  }

  Hunter.prototype.mate = function(mateableOthers) {
    const perceptionRadius = 50
    let closestDistance = 9999999;
    let closestMate = undefined;
    for (o of mateableOthers) {
        const distance = p5.Vector.dist(this.loc, o.loc)
        if (distance < closestDistance) {
            closestDistance = distance;
            closestMate = o;
        }
    }
    if (closestDistance < 16) {
        return closestMate;
    }
    if (closestMate !== undefined) {
        let desired = new p5.Vector.sub(closestMate.loc, this.loc);
        desired.normalize();
        desired.mult(this.maxspeed);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);
        this.applyForce(steer)
    }
    return undefined;
  }

  Hunter.prototype.display = function() {
        this.tail.display(this.loc.x, this.loc.y)
  }

  Hunter.prototype.mated = function() {
    this.tail.maxLength *= 0.25;
}

  Hunter.prototype.update = function() {
    this.vel.add(this.acc);
    this.loc.add(this.vel);
    this.checkEdges()
    this.vel.limit(this.maxspeed);
    this.acc.mult(0);
    this.tail.update(this.loc.x, this.loc.y)
}



