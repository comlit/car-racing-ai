class Car extends Phaser.Physics.Arcade.Image {

    constructor(scene, x, y, brain, high) {
        super(scene, x, y, 'car');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        //this.setPosition(x, y);
        this.setCollideWorldBounds(true)
        this.setDrag(500, 500)
        this.setScale(0.03)
        this.dead = false
        this.frontDist = 10;
        this.rightDist = 10;
        this.leftDist = 10;
        this.score = 0;
        this.fitness = 0.5;
        this.high = high

        if (brain instanceof NeuralNetwork) {
            this.brain = brain.copy();
            //cars that performed well mutate less 0.05/this.fitness
            if (!high)
                this.brain.mutate(0.1);
        } else {
            // Parameters are number of inputs, number of units in hidden Layer, number of outputs
            this.brain = new NeuralNetwork(3, 4, 1);
            this.brain.mutate(0.05);
        }
    }

    /**
     * choose an action based on the inputs
     */
    chooseAction() {
        let inputs = [];
        inputs[0] = this.map(0, 400, this.frontDist);
        inputs[1] = this.map(0, 400, this.rightDist);
        inputs[2] = this.map(0, 400, this.leftDist);
        const action = this.brain.predict(inputs);

        if (action[0] < 0.3)
            this.left()
        if (action[0] > 0.7)
            this.right()
    }

    map(min, max, val) {
        if (val > max)
            return 1
        return val / max
    }

    copy() {
        return new Car(this.scene, 800, 890, this.brain, this.high);
    }

    forward() {
        this.setVelocityY(Math.sin(this.rotation) * 200)
        this.setVelocityX(Math.cos(this.rotation) * 200)
    }
    backward() {
        this.setVelocityY(-Math.sin(this.rotation) * 200)
        this.setVelocityX(-Math.cos(this.rotation) * 200)
    }
    left() {
        this.setAngle(this.angle - 1.5)
    }
    right() {
        this.setAngle(this.angle + 1.5)
    }

    pdate(front, right, left, dead) {
        this.frontDist = front
        this.rightDist = right
        this.leftDist = left

        if(!dead)
            this.score += 1
        else
            this.dead = true
    }

    toRadians(angle) {
        return angle * (Math.PI / 180);
    }
}