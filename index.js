var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        render: render
    }
};

var game = new Phaser.Game(config);

var keyW;
var keyA;
var keyS;
var keyD;
var car;
var cars = [];
var texture;
var rects;
var line;

const totalPopulation = 300;

let aliveCars = [];
let generation = 1;



function preload ()
{
    this.load.image('track0', 'assets/backdrop.png');
    this.load.image('track1', 'assets/track1.png');
    this.load.image('track2', 'assets/track2.png');
    this.load.image('car', 'assets/car.png');
    this.load.image('rect', 'assets/rect.png');
    this.load.image('line', 'assets/line.png');
}

function create ()
{
    
    this.physics.world.setBounds(0, 0, 1280, 720);
    //this.add.image(640, 360, 'backdrop').setScale(0.8);
    texture = this.textures.createCanvas('back', 1280, 720);
    texture.draw(0,0,this.textures.get('track0').getSourceImage())
    this.add.image(0, 0, 'back').setOrigin(0);
    
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    //car = new Car(this,600,630)

    dectBounds(this)

    for (let i = 0; i < totalPopulation; i++) {
		let car = new Car(this, 600, 630, rects);
		aliveCars[i] = car;
		cars[i] = car;
	}
    
    //line = new Dect(this, 10, 10)
}

function dectBounds(scene)
{
    rects = new Array()
    for(let i = 20; i < 1280; i+=40)
    {
        for(let n = 20; n < 720; n+=40)
        {
            var r = new Rect(scene, i, n, texture, 1.0)
            rects.push(r);
            rects = rects.concat(r.getChildrenRects())
            
            //console.log(r.arrr.length)
        }
    }
    console.log(rects.length)
    rects.forEach(function(item){
        if(!item.vis)
            item.destroy();
      });
    rects = rects.filter(function(item){
        return item.vis;
    })
}

function carWallOverlap(spriteA, spriteB) {
    return Phaser.Geom.Rectangle.ContainsPoint(spriteA, spriteB.point);
}

function dectWallOverlap(spriteA) {
    var line = spriteA.getLine();
    for(item of rects)
        if(Phaser.Geom.Intersects.LineToRectangle(line, item.rectt))
            return true
    return false
}

function destroyCar(pCar)
{
    pCar.dectFront.destroy()
    pCar.dectLeft.destroy()
    pCar.dectRight.destroy()
    pCar.destroy()
}

function update() 
{
    for (let i = aliveCars.length - 1; i >= 0; i--) {
		let car = aliveCars[i];
		car.chooseAction();
        if(car.dead)
        {
            aliveCars.splice(i, 1);
        }
            
	}    
    if (aliveCars.length == 0) {
		generation++;
		createNextGeneration();
	}
}

function testUpdate()
{
    if(!car.dead)
    {
        if(keyW.isDown)
        car.forward();
    if(keyS.isDown)
        car.backward();
    if(keyA.isDown)
        car.left(); 
    if(keyD.isDown)
        car.right();
    }
    
    for(let x of cars)
    {
        if(!x.dead)
        {
            if(Math.random() >= 0.1)
            {}
            else
                x.left();
            x.forward();
        }
        else
        {
            destroyCar(x)
        }
        
    }
}

function render() {


}