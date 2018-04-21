let hunters =[]
let food = []
const initNum = 3
const numFood = 12 
const startsize = 30

function setup() {
    createCanvas(windowWidth, windowHeight)
    background(0)

    for (let i=0; i< initNum; i++) {
        hunters.push(new Hunter(random(width), random(height),startsize))
    }

    for (let i=0; i< numFood; i++) {
        food.push(new Food(random(width), random(height),10))
    }

}

function draw () {
    background(0)
    hunters.forEach(hunter => {
        hunter.update()
        hunter.starve()
        if (hunter.isHungry()) {
            hunter.c = color(255, 50, 200)
            hunter.hunt(food)
        } else {
            hunter.c = color(100,24,45)
            const mateableOthers = hunters.filter(other => other.wantsToMate()).filter(other => other !== hunter)
            const matedOther = hunter.mate(mateableOthers)
            if (matedOther !== undefined) {
                reproduce(hunter, matedOther);
            }
        }
        hunter.display()
    });
    hunters = hunters.filter(hunter => hunter.isAlive())
    food = food.filter(f => f.isAlive())    
    food.forEach(f => {
        f.update()
        if (f.wantsToReproduce()) {
            food.push(new Food(f.loc.x + random(), f.loc.y + random(), 10))          
        }
        f.display()
    })
    
}

function reproduce(parentA, parentB) {
    parentA.r *= 0.25
    parentB.r *= 0.25
    let loc = p5.Vector.lerp(parentA.loc, parentB.loc, 0.5)
    hunters.push(new Hunter(loc.x, loc.y, startsize))
}