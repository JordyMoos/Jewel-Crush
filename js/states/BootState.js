
var BootState = {

    init: function ()
    {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    },

    preload: function ()
    {
        this.load.image('preloadBar', 'assets/images/preload_bar.png');
    },

    create: function ()
    {
        this.game.stage.backgroundColor = '#000';

        this.state.start('PreloadState');
    },
};
