
var PreloadState = {

    preload: function ()
    {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 120, 'preloadBar');
        this.preloadBar.anchor.setTo(0.5);

        this.load.setPreloadSprite(this.preloadBar);

        this.game.load.image('blue', 'assets/images/blue.png');
        this.game.load.image('red', 'assets/images/red.png');
        this.game.load.image('yellow', 'assets/images/yellow.png');
        this.game.load.image('green', 'assets/images/green.png');
    },

    create: function ()
    {
        this.state.start('MainState');
    },
};
