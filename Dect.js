class Dect extends Phaser.GameObjects.Image {
    constructor(scene, x, y)
    {
        super(scene, x, y);
        scene.add.existing(this);
        this.setTexture('line')
        this.setOrigin(0,0.5)
        this.scaleX = 4
        this.setVisible(false);
    }
    preUpdate()
    {
        if(dectWallOverlap(this))
            this.scaleX -= 1
        else
            this.scaleX += 1
    }
    getLine()
    {
        var rect = this.getBounds()
        rect.left
        rect.right
        rect.top
        rect.bottom

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