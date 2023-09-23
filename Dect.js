class Dect extends Phaser.GameObjects.Image {
    constructor(scene, x, y)
    {
        super(scene, x, y);
        scene.add.existing(this);
        this.setTexture('line')
        this.setOrigin(0,0.5)
        this.scaleX = 30
        this.setVisible(true);
        this.last = 0;
        this.length = this.scaleX/40
    }
    preUpdate()
    {
        let over = dectWallOverlap(this)
        
        if(over != [])
        {
            var len = 1000;
            var x = this.x;
            var y = this.y;
            over.forEach(function(item){
                var curLen = (Math.pow(Math.pow(x-item.x,2)+Math.pow(y-item.y,2),0.5));
                if(len > curLen)
                    len = curLen;
            })
            this.length = len 

        }
    }
    getLine()
    {
        var rect = this.getBounds()
        if(this.angle >= 0 && this.angle < 90)
            return new Phaser.Geom.Line(rect.left, rect.top, rect.right, rect.bottom)
        else if(this.angle >= 90 && this.angle < 180)
            return new Phaser.Geom.Line(rect.right, rect.top, rect.left, rect.bottom)
        else if(this.angle < 0 && this.angle >= -90)
            return new Phaser.Geom.Line(rect.left, rect.bottom, rect.right, rect.top)
        else
            return new Phaser.Geom.Line(rect.right, rect.bottom, rect.left, rect.top)
    }
}