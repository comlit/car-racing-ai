class Car extends Phaser.Physics.Arcade.Image {

    constructor (scene, x, y, rects, brain)
    {
        super(scene, 600, 630, 'car');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        //this.setPosition(x, y);
        this.setCollideWorldBounds(true)
        this.setDrag(500, 500)
        this.setScale(0.03)
        this.dectFront = new Dect(scene, x, y)
        this.dectFront.scaleX += 5  
        this.dectRight = new Dect(scene, x, y)
        this.dectLeft = new Dect(scene, x, y)
        this.dead = false
        this.rects = rects
        this.frontDist = 10;
        this.rightDist = 10;
        this.leftDist = 10;
        this.score = 0;
        this.fitness = 0;

        if (brain instanceof NeuralNetwork) {
			this.brain = brain.copy();
			this.brain.mutate(0.1);
		} else {
			// Parameters are number of inputs, number of units in hidden Layer, number of outputs
			this.brain = new NeuralNetwork(4, 8, 1);
		}
    }

    chooseAction()
    {
        let inputs = [];
        inputs[0] = this.map(0, 360, this.angle+180);
        inputs[1] = this.map(0, 1200, this.dectFront);
        inputs[2] = this.map(0, 1200, this.dectLeft);
        inputs[3] = this.map(0, 1200, this.dectRight);
        const action = this.brain.predict(inputs);
        if(action[0] > 0.5)
            this.left()
        else
            this.right()
        this.forward()
    }

    map(min, max, val)
    {
        return val/max
    }

    copy() {
		return new Car(this.scene, this.x, this.y, this.rects, this.brain);
	}

    forward()
    {
        this.setVelocityY(Math.sin(this.rotation)*200)
        this.setVelocityX(Math.cos(this.rotation)*200)
    }
    backward()
    {
        this.setVelocityY(-Math.sin(this.rotation)*200)
        this.setVelocityX(-Math.cos(this.rotation)*200)
    }
    left()
    {
        this.setAngle(this.angle - 2.5)
    }
    right()
    {
        this.setAngle(this.angle + 2.5)
    }

    preUpdate()
    {
        this.score++
        var bounds = this.getBounds()
        for(let item of rects)
            if(carWallOverlap(bounds, item))
                this.dead = true;

        this.dectFront.copyPosition(this)
        this.dectFront.setRotation(this.rotation)
        this.frontDist = this.dectFront.scaleX;
        this.dectRight.copyPosition(this)
        this.dectRight.setRotation(this.rotation+0.785)
        this.rightDist = this.dectFront.scaleX;
        this.dectLeft.copyPosition(this)
        this.dectLeft.setRotation(this.rotation-0.785)
        this.leftDist = this.dectFront.scaleX;
    }
}