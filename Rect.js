class Rect extends Phaser.GameObjects.Image {

    constructor(scene, x, y, texx, size)
    {
        super(scene, x, y);
        scene.add.existing(this);
        this.tex = texx;
        this.size = size;
        this.setScale(size)
        this.scene = scene
        this.setTexture('rect');
        this.setPosition(x, y);
        this.vis = true;
        this.arrr = new Array()
        this.divide();
        this.point = new Phaser.Geom.Point(this.x, this.y);
        this.rectt = this.getBounds();
        this.setVisible(false)
    }

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
        if(this.hasred() && this.size > 0.2)
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
}