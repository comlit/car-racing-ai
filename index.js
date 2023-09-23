var config = {
    type: Phaser.AUTO,
    parent: 'phaser-ai',
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    dom: {
        createContainer: true
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
var debugtext
var scanner;
var outer;
var inner;
var trackbounds = {};


var innerscan;
var outerscan;
var outerstart;
var innerstart;
var scanned = false;

const totalPopulation = 50;

let aliveCars = [];
let generation = 1;



function preload() {
    this.load.image('track0', 'assets/backdrop.png');
    this.load.image('track1', 'assets/track1.png');
    this.load.image('track2', 'assets/track2.png');
    this.load.image('track3', 'assets/track3.png');
    this.load.image('car', 'assets/car.png');
    this.load.image('rect', 'assets/rect.png');
    this.load.image('line', 'assets/line.png');
}

function create() {
    this.physics.world.setBounds(0, 0, 1920, 1080);

    this.add.image(0, 0, 'track3').setOrigin(0).setScale(1.5);

    this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff0000 } });

    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    var style = { font: "20px Arial", fill: "#000000", align: "center" };
    debugtext = this.add.text(100, 100, 'Generation: 0 \n Average score: 0', style);
    debugtext.x = 800;
    debugtext.y = 50;

    for (let i = 0; i < totalPopulation; i++) {
        let car = new Car(this, 800, 890);
        aliveCars[i] = car;
        cars[i] = car;
    }
}

function dectBounds(scene, startx, starty) {
    scanner = new Rect(scene, startx, starty, 0.5)

    while (!scanner.finished) {
        scanner.scan()
    }
    return scanner.pathp

}

function destroyCar(pCar) {
    pCar.destroy()
}

function findstart(scene, startx, starty) {
    let x, y;
    for (let i = startx; i < 1920; i += 1) {
        for (let n = starty; n < 1080; n += 1) {
            if (i % 2 == 0 && n % 2 == 0)
                if (scene.textures.getPixel(i / 1.5, n / 1.5, 'track3').r != 255) {
                    x = i
                    y = n
                    break;
                }
        }
        if (x != undefined)
            break;
    }
    return { x: x, y: y }
}

function createPolys() {
    let points = []
    for (let i = 0; i < outer.length - 1; i++) {
        points.push(new Phaser.Geom.Point(outer[i].x, outer[i].y))
    }
    trackbounds["outer"] = new Phaser.Geom.Polygon(points)
    points = []
    for (let i = 0; i < inner.length - 1; i++) {
        points.push(new Phaser.Geom.Point(inner[i].x, inner[i].y))
    }
    trackbounds["inner"] = new Phaser.Geom.Polygon(points)
}

function update() {
    if (!scanned) {
        if (!outerstart || !innerstart || !innerscan || !outerscan) {
            outerstart = findstart(this, 0, 0)
            innerstart = findstart(this, 1000, 500)
            innerscan = new Rect(this, innerstart.x, innerstart.y, 0.5)
            outerscan = new Rect(this, outerstart.x, outerstart.y, 0.5)
        }
        if (!outerscan.finished)
            outerscan.scan()
        if (!innerscan.finished)
            innerscan.scan()

        if (outerscan.finished && innerscan.finished) {
            outer = outerscan.pathp
            inner = innerscan.pathp
            scanned = true
            createPolys()

            outerscan.points.forEach(elem => elem.destroy())
            innerscan.points.forEach(elem => elem.destroy())

            outerscan.destroy()
            innerscan.destroy()
        }

    }

    if (scanned) {

        for (let car of cars) {
            let front = { x: car.x + Math.cos(car.toRadians(car.angle)) * 400, y: car.y + Math.sin(car.toRadians(car.angle)) * 400 }
            let left = { x: car.x + Math.cos(car.toRadians(car.angle - 45)) * 400, y: car.y + Math.sin(car.toRadians(car.angle - 45)) * 400 }
            let right = { x: car.x + Math.cos(car.toRadians(car.angle + 45)) * 400, y: car.y + Math.sin(car.toRadians(car.angle + 45)) * 400 }

            let fline = new Phaser.Geom.Line(car.x, car.y, front.x, front.y)
            let lline = new Phaser.Geom.Line(car.x, car.y, left.x, left.y)
            let rline = new Phaser.Geom.Line(car.x, car.y, right.x, right.y)

            let finter = Phaser.Geom.Intersects.GetLineToPolygon(fline, [trackbounds["outer"], trackbounds["inner"]])
            let linter = Phaser.Geom.Intersects.GetLineToPolygon(lline, [trackbounds["outer"], trackbounds["inner"]])
            let rinter = Phaser.Geom.Intersects.GetLineToPolygon(rline, [trackbounds["outer"], trackbounds["inner"]])

            let dist = { l: 400, r: 400, f: 400 }

            if (linter)
                dist.l = Math.sqrt(Math.pow(linter.x - car.x, 2) + Math.pow(linter.y - car.y, 2))
            if (rinter)
                dist.r = Math.sqrt(Math.pow(rinter.x - car.x, 2) + Math.pow(rinter.y - car.y, 2))
            if (finter)
                dist.f = Math.sqrt(Math.pow(finter.x - car.x, 2) + Math.pow(finter.y - car.y, 2))

            if (dist.f < 20 || dist.r < 20 || dist.l < 20)
                car.dead = true

            //let dist = {l: Math.random() * 400, r: Math.random() * 400, f: Math.random() * 400}

            car.pdate(dist.f, dist.r, dist.l, false)
        }


        for (let i = aliveCars.length - 1; i >= 0; i--) {
            let car = aliveCars[i];
            car.chooseAction();
            if (car.dead) {
                aliveCars.splice(i, 1);
            }

        }
        if (aliveCars.length == 0) {
            console.log("Generation: " + generation + " complete");
            generation++;
            createNextGeneration();
        }
        aliveCars.forEach(elem => elem.forward())
    }
}

function testUpdate() {
    if (!car.dead) {
        if (keyW.isDown)
            car.forward();
        if (keyS.isDown)
            car.backward();
        if (keyA.isDown)
            car.left();
        if (keyD.isDown)
            car.right();
    }

    for (let x of cars) {
        if (!x.dead) {
            if (Math.random() >= 0.1) { }
            else
                x.left();
            x.forward();
        }
        else {
            destroyCar(x)
        }

    }
}

function render() {


}