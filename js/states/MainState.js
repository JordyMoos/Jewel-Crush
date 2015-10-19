
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
        for (var y = 0; y < 8; ++y)
        {
            this.tileGrid[y] = [];

            for (var x = 0; x < 9; ++x)
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
            for (var x = 0; x < this.tileGrid[y].length; ++x)
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
        if (this.canMove === true)
        {
            this.activeTile1 = tile;

            this.startPosX = (tile.x - this.tileWidth / 2) / this.tileWidth;
            this.startPosY = (tile.y - this.tileHeight / 2) / this.tileHeight;
        }
    },

    swapTiles: function ()
    {
        if (this.activeTile1 && this.activeTile2)
        {
            var tile1Pos = {
                x: (this.activeTile1.x - this.tileWidth / 2) / this.tileWidth,
            };
        }
    },

    checkMatch: function ()
    {
        console.log('Check match');
    },

    update: function ()
    {
        // Check if user is hovering over another tile
        if (this.activeTile1 && ! this.activeTile2)
        {
            var hoverX = this.game.input.x;
            var hoverY = this.game.input.y;

            var hoverPosX = Math.floor(hoverX / this.tileWidth);
            var hoverPosY = Math.floor(hoverY / this.tileHeight);

            var difX = (hoverPosX - this.startPosX);
            var difY = (hoverPosY - this.startPosY);

            // Make sure we are in le bounds of le grid
            if ( ! (hoverPosY > this.tileGrid[0].length - 1 || hoverPosY < 0)
                && ! (hoverPosX > this.tileGrid.length - 1 || hoverPosX < 0))
            {
                // Check if user dragged far enough for a swap
                if ((Math.abs(difY) == 1 && difX == 0) || (Math.abs(difX) == 1 && difY == 0))
                {
                    this.canMove = false;
                    this.activeTile2 = this.tileGrid[hoverPosX][hoverPosY];
                    this.swapTiles();

                    // After the swap check for any matches
                    this.game.time.events.add(500, function ()
                        {
                            this.checkMatch();
                        }, this);
                }
            }
        }
    },
};
