
var MainState = {

    create: function ()
    {
        this.game.stage.backgroundColor = '#34495f';

        this.tileTypes = [
            'blue',
            'green',
            'red',
            'yellow',
        ];
        this.score = 0;
        this.activeTile1 = null;
        this.activeTile2 = null;
        this.canMove = false;
        this.tileWidth = this.game.cache.getImage('blue').width;
        this.tileHeight = this.game.cache.getImage('blue').height;
        this.tiles = this.game.add.group();

        this.tileGrid = [];
        for (var y = 0; y < 6; ++y)
        {
            this.tileGrid[y] = [];

            for (var x = 0; x < 6; ++x)
            {
                this.tileGrid[y][x] = null;
            }
        }

        var seed = Date.now();
        this.random = new Phaser.RandomDataGenerator([seed]);
    },

    update: function ()
    {

    },
};
