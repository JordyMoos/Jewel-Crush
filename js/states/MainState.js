
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
        this.canMove = true;
        this.tileWidth = this.game.cache.getImage('blue').width;
        this.tileHeight = this.game.cache.getImage('blue').height;
        this.tiles = this.game.add.group();

        this.tileGrid = [];
        for (var y = 0; y < 3; ++y)
        {
            this.tileGrid[y] = [];

            for (var x = 0; x < 3; ++x)
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

        var tile = this.tiles.create((x * this.tileWidth) + (this.tileWidth / 2) /*+ ((x + 1) * 10)*/, 0, tileToAdd);
        tile.anchor.setTo(0.5, 0.5);
        tile.inputEnabled = true;
        tile.tileType = tileToAdd;
        tile.events.onInputDown.add(this.tileDown, this);

        this.game.add.tween(tile).to({
                y: (y * this.tileHeight) + (this.tileHeight / 2) // + ((y + 1) * 10)
            }, 500, Phaser.Easing.Linear.In, true);

        return tile;
    },

    tileDown: function (tile, pointer)
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
                y: (this.activeTile1.y - this.tileHeight / 2) / this.tileHeight,
            };
            var tile2Pos = {
                x: (this.activeTile2.x - this.tileWidth / 2) / this.tileWidth,
                y: (this.activeTile2.y - this.tileHeight / 2) / this.tileHeight,
            };

            // Swap them on grid
            this.tileGrid[tile1Pos.x][tile1Pos.y] = this.activeTile2;
            this.tileGrid[tile2Pos.x][tile2Pos.y] = this.activeTile1;

            // Swap them on screen
            this.game.add.tween(this.activeTile1)
                .to({
                        x: tile2Pos.x * this.tileWidth + (this.tileWidth / 2),
                        y: tile2Pos.y * this.tileHeight + (this.tileHeight / 2),
                    }, 200, Phaser.Easing.Linear.In, true);
            this.game.add.tween(this.activeTile2)
                .to({
                        x: tile1Pos.x * this.tileWidth + (this.tileWidth / 2),
                        y: tile1Pos.y * this.tileHeight + (this.tileHeight / 2),
                    }, 200, Phaser.Easing.Linear.In, true);

            this.activeTile1 = this.tileGrid[tile1Pos.x][tile1Pos.y];
            this.activeTile2 = this.tileGrid[tile2Pos.x][tile2Pos.y];
        }
    },

    checkMatch: function ()
    {
        var matches = this.getMatches(this.tileGrid);

        if (matches.length > 0)
        {
            // Remove tiles
            this.removeTileGroup(matches);

            // Move tiles down
            this.resetTile();
            this.fillTile();

            this.game.time.events.add(500, function ()
                {
                    this.tileUp();
                    this.game.add.events.add(100, function ()
                        {
                            this.checkMatch()();
                        }, this);
                }, this);
        }
        else
        {
            // No match so swap the tiles back
            this.swapTiles();
            this.game.time.events.add(500, function ()
                {
                    this.tileUp();
                    this.canMove = true;
                }, this);
        }
    },

    tileUp: function ()
    {
        this.activeTile1 = null;
        this.activeTile2 = null;
    },

    // Todo
    getMatches: function(tileGrid)
    {
        var matches = [];
        var groups = [];
        var tempArr;

        //Check for horizontal matches
        for (var i = 0; i < tileGrid.length; i++)
        {
            tempArr = tileGrid[i];
            groups = [];
            for (var j = 0; j < tempArr.length; j++)
            {
                if(j < tempArr.length - 2)
                    if (tileGrid[i][j] && tileGrid[i][j + 1] && tileGrid[i][j + 2])
                    {
                        if (tileGrid[i][j].tileType == tileGrid[i][j+1].tileType && tileGrid[i][j+1].tileType == tileGrid[i][j+2].tileType)
                        {
                            if (groups.length > 0)
                            {
                                if (groups.indexOf(tileGrid[i][j]) == -1)
                                {
                                    matches.push(groups);
                                    groups = [];
                                }
                            }

                            if (groups.indexOf(tileGrid[i][j]) == -1)
                            {
                                groups.push(tileGrid[i][j]);
                            }
                            if (groups.indexOf(tileGrid[i][j+1]) == -1)
                            {
                                groups.push(tileGrid[i][j+1]);
                            }
                            if (groups.indexOf(tileGrid[i][j+2]) == -1)
                            {
                                groups.push(tileGrid[i][j+2]);
                            }
                        }
                    }
            }
            if(groups.length > 0) matches.push(groups);
        }

        //Check for vertical matches
        for (j = 0; j < tileGrid.length; j++)
        {
            tempArr = tileGrid[j];
            groups = [];
            for (i = 0; i < tempArr.length; i++)
            {
                if(i < tileGrid.length - 2)
                {
                    if (tileGrid[i][j] && tileGrid[i+1][j] && tileGrid[i+2][j])
                    {
                        if (tileGrid[i][j].tileType == tileGrid[i+1][j].tileType && tileGrid[i+1][j].tileType == tileGrid[i+2][j].tileType)
                        {
                            if (groups.length > 0)
                            {
                                if (groups.indexOf(tileGrid[i][j]) == -1)
                                {
                                    matches.push(groups);
                                    groups = [];
                                }
                            }

                            if (groups.indexOf(tileGrid[i][j]) == -1)
                            {
                                groups.push(tileGrid[i][j]);
                            }
                            if (groups.indexOf(tileGrid[i+1][j]) == -1)
                            {
                                groups.push(tileGrid[i+1][j]);
                            }
                            if (groups.indexOf(tileGrid[i+2][j]) == -1)
                            {
                                groups.push(tileGrid[i+2][j]);
                            }
                        }
                    }
                }
            }
            if(groups.length > 0) matches.push(groups);
        }

        return matches;
    },

    // Todo
    removeTileGroup: function (matches)
    {
        for (var i = 0; i < matches.length; i++)
        {
            var tempArr = matches[i];

            for (var j = 0; j < tempArr.length; j++)
            {
                var tile = tempArr[j];
                var tilePos = this.getTilePos(this.tileGrid, tile);
                this.tiles.remove(tile);

                // Remove the tile from the grid
                if (tilePos.x !== false)
                {
                    this.tileGrid[tilePos.x][tilePos.y] = null;
                }
            }
        }
    },

    getTilePos: function (tileGrid, tile)
    {
        for (var i = 0; i < tileGrid.length; i++)
        {
            for (var j = 0; i < tileGrid[i].length; j++)
            {
                if (tile === tileGrid[i][j])
                {
                    return {
                        x: i,
                        y: j,
                    };
                }
            }
        }

        return false;
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
                    this.activeTile2 = this.tileGrid[hoverPosY][hoverPosX];
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
