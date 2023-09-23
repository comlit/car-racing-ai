class Rect extends Phaser.GameObjects.Image {

    constructor(scene, x, y, siz) {
        super(scene, x, y);
        scene.add.existing(this);
        this.setScale(siz)
        this.scene = scene
        this.setTexture('rect');
        this.setPosition(x, y);
        this.vis = true

        this.points = []

        this.rot = 0;
        this.size = 10;

        /*
        this.topl = this.scene.add.circle(0, 0, 3, 0x008000);
        this.topr = this.scene.add.circle(0, 0, 3, 0x008000);
        this.bottoml = this.scene.add.circle(0, 0, 3, 0x008000);
        this.bottomr = this.scene.add.circle(0, 0, 3, 0x008000);
        this.direction = this.scene.add.circle(0, 0, 3, 0x008000);
        */

        this.pathp = []

        this.count = 0

        this.finished = false

        //this.scan()
        //this.arrr = new Array()
        //this.divide();

        //old collision stuff
        //this.point = new Phaser.Geom.Point(this.x, this.y);
        //this.rectt = this.getBounds();

        this.setVisible(true)
    }

    scan() {
        let inside = []


        //create bounding box based on position and rotation
        let lefttop = { x: this.x - Math.cos(this.toRadians(this.rot)) * this.size, y: this.y + Math.sin(this.toRadians(this.rot)) * this.size }
        let righttop = { x: this.x + Math.cos(this.toRadians(this.rot)) * this.size, y: this.y - Math.sin(this.toRadians(this.rot)) * this.size }

        let leftbottom = { x: lefttop.x + Math.sin(this.toRadians(this.rot)) * this.size * 2, y: lefttop.y + Math.cos(this.toRadians(this.rot)) * this.size * 2 }
        let rightbottom = { x: righttop.x + Math.sin(this.toRadians(this.rot)) * this.size * 2, y: righttop.y + Math.cos(this.toRadians(this.rot)) * this.size * 2 }

        //draw bounding box
        /*
        this.topl.x = lefttop.x
        this.topl.y = lefttop.y

        this.topr.x = righttop.x
        this.topr.y = righttop.y

        this.bottoml.x = leftbottom.x
        this.bottoml.y = leftbottom.y

        this.bottomr.x = rightbottom.x
        this.bottomr.y = rightbottom.y
        */

        //get all points inside bounding box that are on the line
        let r = {
            A: { x: lefttop.x, y: lefttop.y },
            B: { x: righttop.x, y: righttop.y },
            C: { x: rightbottom.x, y: rightbottom.y },
            D: { x: leftbottom.x, y: leftbottom.y }
        }

        for (let i = this.x - this.size * 2; i < this.x + this.size * 2; i++) {
            for (let n = this.y - this.size * 2; n < this.y + this.size * 2; n++) {
                let m = { x: i, y: n }
                let result = this.pointInRectangle(m, r)
                if (result && this.scene.textures.getPixel(i / 1.5, n / 1.5, 'track3').r != 255) {
                    inside.push({ x: i, y: n })
                }
            }
        }

        let totalx = inside.reduce((a, b) => a + b.x, 0)
        let totaly = inside.reduce((a, b) => a + b.y, 0)

        //get average position of all points on the line
        let avg = { x: totalx / inside.length, y: totaly / inside.length }
        //console.log("avg", avg.x, avg.y)


        let angle = Math.atan2(avg.y - this.y, avg.x - this.x) * 180 / Math.PI;
        let angle2 = Math.atan2(avg.y - this.y, avg.x - this.x) * 180 / Math.PI;

        //console.log(angle2)
        //console.log("angle atan2 ", angle)

        if (angle == 180)
            angle = 270
        else if (angle <= 90 && angle > -180)
            angle = Math.abs(angle - 90)
        else
            angle = Math.abs(angle - 450)


        this.setPosition(avg.x, avg.y)
        this.rot = angle

        //console.log("angle", angle)

        this.pathp.push({ x: avg.x, y: avg.y, rot: angle2 })
        this.points.push(this.scene.add.circle(avg.x, avg.y, 3, 0x000000))
        this.make()

    }

    /**
     * check if track is complete
     */
    make() {
        //check if last ten points match up with first ten points roughly
        if (this.pathp.length > 100) {
            let firstten = this.pathp.slice(0, 100)
            let lastten = this.pathp.slice(this.pathp.length - 100, this.pathp.length)

            let dist = 0
            for (let i = 0; i < 100; i += 5) {
                dist += Math.sqrt(Math.pow(firstten[i].x - lastten[i].x, 2) + Math.pow(firstten[i].y - lastten[i].y, 2))
            }
            //console.log("dist", dist)

            if (dist < 100) {
                console.log("track complete")
                this.finished = true
                this.pathp = this.pathp.slice(0, this.pathp.length - 100)
            }
        }


        let totalradius = this.pathp.reduce((a, b) => a + b.rot, 0)
        //console.log("totalradius", totalradius)
    }

    toRadians(angle) {
        return angle * (Math.PI / 180);
    }


    pointInRectangle(m, r) {
        var AB = this.vector(r.A, r.B);
        var AM = this.vector(r.A, m);
        var BC = this.vector(r.B, r.C);
        var BM = this.vector(r.B, m);
        var dotABAM = this.dot(AB, AM);
        var dotABAB = this.dot(AB, AB);
        var dotBCBM = this.dot(BC, BM);
        var dotBCBC = this.dot(BC, BC);
        return 0 <= dotABAM && dotABAM <= dotABAB && 0 <= dotBCBM && dotBCBM <= dotBCBC;
    }

    vector(p1, p2) {
        return {
            x: (p2.x - p1.x),
            y: (p2.y - p1.y)
        };
    }

    dot(u, v) {
        return u.x * v.x + u.y * v.y;
    }

    /*
    hasred()
    {
        var topleftX = this.x - 20*this.size;
        var topleftY = this.y - 20*this.size;
        //console.log(this.size)
        for(let i = 0; i < 40*this.size; i++)
        {
            for(let n = 0; n < 40*this.size; n++)
            {
                //console.log(i)
                //console.log(this.tex.getPixel(i+ topleftX, n + topleftY))
                var px = this.tex.getPixel(i+ topleftX, n + topleftY)
                if(px.r != 255 && px.g != 255 && px.b != 255)
                {
                    return true;
                }
            }
        }         
        return false;
    }

    
    divide() //box sizes (1, 0.5, 0.25, 0.125, ...)
    {
        if(this.hasred() && this.size > 0.1)
        {
            var nS = 0.5*this.size
            var s = 10*this.size
            this.arrr.push(new Rect(this.scene, this.x-s, this.y-s, this.tex, nS))
            this.arrr.push(new Rect(this.scene, this.x+s, this.y-s, this.tex, nS))
            this.arrr.push(new Rect(this.scene, this.x-s, this.y+s, this.tex, nS))
            this.arrr.push(new Rect(this.scene, this.x+s, this.y+s, this.tex, nS))
            //console.log(this.size)
            if(this.size > 0.3)
            {
                this.setVisible(false)
                this.vis = false;
            }
                
        }
        else
        {
            this.setVisible(false)
            this.vis = false;
        }
    }

    getChildrenRects()
    {
        if(this.arrr.length == 0)
        {
            return [this]
        }
        else
        {
            return this.arrr.concat(this.arrr[0].getChildrenRects()).concat(this.arrr[1].getChildrenRects()).concat(this.arrr[2].getChildrenRects()).concat(this.arrr[3].getChildrenRects())
        }
    }
    */
}