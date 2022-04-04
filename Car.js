class Car extends Phaser.Physics.Arcade.Image {

    constructor (scene, x, y, rects, brain, high)
    {
        super(scene, 450, 600, 'car');
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
        this.fitness = 0.5;
        this.high = high

        if (brain instanceof NeuralNetwork) {
			this.brain = brain.copy();
            //cars that performed well mutate less 0.05/this.fitness
            if(!high)
			    this.brain.mutate(0.1);
		} else {
			// Parameters are number of inputs, number of units in hidden Layer, number of outputs
			this.brain = new NeuralNetwork(4, 8, 1);
            this.brain.mutate(0.05);
		}
    }

    chooseAction()
    {
        let inputs = [];
        inputs[0] = this.map(0, 360, this.angle+180);
        inputs[1] = this.map(0, 700, this.frontDist);
        inputs[2] = this.map(0, 700, this.rightDist);
        inputs[3] = this.map(0, 700, this.leftDist);
        const action = this.brain.predict(inputs);
        //console.log(inputs)
        //console.log(action[0])
        if(action[0] < 0.3)
            this.left()
        if(action[0] > 0.7)
            this.right()   
        //this.forward()
    }

    map(min, max, val)
    {
        if(val > max)
            return 1
        return val/max
    }

    copy() {
		return new Car(this.scene, this.x, this.y, this.rects, this.brain, this.high);
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

    pdate()
    {
        if(!this.dead)
            this.score += 1
        var bounds = this.getBounds()
        for(let item of rects)
            if(carWallOverlap(bounds, item))
                this.dead = true;

        this.dectFront.copyPosition(this)
        this.dectFront.setRotation(this.rotation)
        this.frontDist = this.dectFront.length;
        this.dectRight.copyPosition(this)
        this.dectRight.setRotation(this.rotation+0.785)
        this.rightDist = this.dectRight.length;
        this.dectLeft.copyPosition(this)
        this.dectLeft.setRotation(this.rotation-0.785)
        this.leftDist = this.dectLeft.length;
    }
}