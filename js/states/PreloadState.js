
var PreloadState = {

    preload: function ()
    {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 120, 'preloadBar');
        this.preloadBar.anchor.setTo(0.5);

        this.load.setPreloadSprite(this.preloadBar);
    },

    create: function ()
    {
        this.state.start('GameState');
    },
};
