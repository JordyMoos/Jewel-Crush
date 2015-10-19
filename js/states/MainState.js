
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

        this.initTiles();
    },

    initTiles: function ()
    {
        for (var y = 0; y < this.tileGrid.length; ++y)
        {
            for (var x = 0; x < this.tileGrid.length; ++x)
            {
                this.tileGrid[y][x] = this.addTile(x, y);
            }
        }

        this.game.time.events.add(600, function ()
            {
                this.checkMatch();
            }, this);
    },

    addTile: function (x, y)
    {
        var tileToAdd = this.tileTypes[this.random.integerInRange(0, this.tileTypes.length -1)];

        var tile = this.tiles.create((x * this.tileWidth) + (this.tileWidth / 2) + ((x + 1) * 10), 0, tileToAdd);
        tile.anchor.setTo(0.5, 0.5);
        tile.inputEnabled = true;
        tile.tileType = tileToAdd;
        tile.events.onInputDown.add(this.tileDown, this);

        this.game.add.tween(tile).to({
                y: (y * this.tileHeight) + (this.tileHeight / 2) + ((y + 1) * 10)
            }, 500, Phaser.Easing.Linear.In, true);

        return tile;
    },

    tileDown: function (tile, poointer)
    {

    },

    checkMatch: function ()
    {
        console.log('Check match');
    },

    update: function ()
    {

    },
};
