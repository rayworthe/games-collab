import Maze from "../modules/Maze";
import Map from "../modules/Map";
import Room from "../modules/Room";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({key : "GameScene"});
        this.key = null;
        this.room = null;
        this.neighboursRooms = null;
        this.x = null;
        this.y = null;

        // Get an instance of the camera, set in the index.js file - CANNOT BE DONE IN CONSTRUCTOR
        //this.camera = this.cameras.main;

        // Cmaera cant be used, instead below is set to null. More info in Maze.js.
        // this.maze = new Maze(this, camera, 40);

        // Set to string means nothing
        this.maze = new Maze(this, "camera", 40);

        this.grid = this.maze.generateGrid();
        this.newMaze = this.maze.generateMaze(this.grid);

        this.map = new Map(this, this.newMaze);

    };

    // Where we preload our images, gifs, sound file and anything else we want to load when the game first opens.
    preload() {
        this.load.image("honk", "assets/honkhonksnippet.png");
        this.load.image("white_square", "assets/white_square.png");

        this.load.image("vertical", "assets/verticalCollision.png");
        this.load.image("horizontal", "assets/horizontalCollision.png");

        /*
         Images below represent walls, 0 = false, 1 = true.
         In order of naming convention - TOP - RIGHT - BOTTOM - LEFT
         0000 = false, false, false, false - a white sqaure with no walls.
         1111 = true, true, true, true - a white square with all walls.
         1010 = true, false, true, false - a white sqaure with a top wall, and a bottom wall.
        */
        this.load.image("0000", "assets/0000.png");
        this.load.image("0001", "assets/0001.png");
        this.load.image("0010", "assets/0010.png");
        this.load.image("0011", "assets/0011.png");
        this.load.image("0100", "assets/0100.png");
        this.load.image("0101", "assets/0101.png");
        this.load.image("0110", "assets/0110.png");
        this.load.image("0111", "assets/0111.png");
        this.load.image("1000", "assets/1000.png");
        this.load.image("1001", "assets/1001.png");
        this.load.image("1010", "assets/1010.png");
        this.load.image("1011", "assets/1011.png");
        this.load.image("1100", "assets/1100.png");
        this.load.image("1101", "assets/1101.png");
        this.load.image("1110", "assets/1110.png");
        this.load.image("1111", "assets/1111.png");
    };

    // Created things when the game is running.
    create() {
        // this.honk = this.physics.add.sprite(400, 400, "honk");
        // this.honk.setScale(0.1);
        // this.honk.setCollideWorldBounds(true);
        //this.honk.body.setGravityY(300);

        //this.screenBounds = this.physics.add.staticGroup();

        // Character movement
        this.cursors = this.input.keyboard.createCursorKeys();

        this.doublePresses = [];

        this.playerBaseSpeed = 300;

        var arrowKeys = {
            "up" : this.cursors.up,
            "left" : this.cursors.left,
            "right" : this.cursors.right,
            "down" : this.cursors.down
        };

        // Used for speeding up the game character
        const arrowKeyVals = Object.values(arrowKeys);
        for (const key of arrowKeyVals) {
            this.doublePress(key, 500, () => {
                this.playerBaseSpeed = 600;
            }, () => {
                this.playerBaseSpeed = 300;
            });
        }

        //this.map.generateMap();

        /*
         Key will be changed, depending on the character movement.
         If the character goes to the right side of the screen (as long as the wall is empty) and wants to travel to the next room,
         then we set the new key to be the new neighbour coordinate of the cell, to the right - (new coordinates depend on which direction the character moves)
         and restart the scene. When the game if first opened, change from null, to the first maze key - always "0|0".
         Will be done in the 'update()'
        */
        if (this.key == null) {
            this.key = "0|0";
        }

        // Get first room object
        // this.room = new Room(this, this.newMaze[this.key]);
        // this.neighboursRooms = this.neighbours(this.room, this.newMaze);

        // var currentRoomWalls = this.room.walls;
        // if (currentRoomWalls.bottom == true) {
        //     this.screenBounds.create(800, 800, "horizontal");
        // }

        // if (currentRoomWalls.left == true) {
        //     this.screenBounds.create(0, 800, "vertical");
        // }

        // if (currentRoomWalls.right == true) {
        //     this.screenBounds.create(800, 800, "vertical");
        // }

        // if (currentRoomWalls.top == true) {
        //     this.screenBounds.create(0, 0, "horizontal");
        // }
        if (this.key == null) {
            this.key = "0|0";
        }
        this.screenBounds = this.physics.add.staticGroup();
        this.getRoom(this.key);
        this.x = 400;
        this.y = 400;
        this.honk = this.physics.add.sprite(this.x, this.y, "honk");
        this.honk.setScale(0.1);
        this.honk.setCollideWorldBounds(true);
        this.physics.add.collider(this.honk, this.screenBounds);
    };
    getRoom(incomingkey){
        
        if(this.screenBounds.getChildren().length != 0){
            this.screenBounds.clear(true, true)
            console.log("screenbounds not null");
        }
        
    
        
        // Get first room object
        this.room = new Room(this, this.newMaze[incomingkey]);
        this.neighboursRooms = this.neighbours(this.room, this.newMaze);

        var currentRoomWalls = this.room.walls;
        if (currentRoomWalls.bottom == true) {
            this.screenBounds.create(800, 800, "horizontal");
        }

        if (currentRoomWalls.left == true) {
            this.screenBounds.create(0, 800, "vertical");
        }

        if (currentRoomWalls.right == true) {
            this.screenBounds.create(800, 800, "vertical");
        }

        if (currentRoomWalls.top == true) {
            this.screenBounds.create(0, 0, "horizontal");
        }
    }
    setHonkPos(x,y){
        this.honk.x = x;
        this.honk.y = y;
    }
    update() {
        this.honk.setVelocity(0);

        // bottom of screen
        if (this.honk.y > 765) {
            let newRow = this.room.row + 1;
            let col = this.room.col;
            this.key = newRow + "|" + col;
            this.getRoom(this.key)
            this.setHonkPos(this.honk.x,45);
        }

        // top of screen
        if (this.honk.y < 40) {
            let newRow = this.room.row - 1;
            let col = this.room.col;
            this.key = newRow + "|" + col;
            this.getRoom(this.key);
            this.setHonkPos(this.honk.x,760)
        }

        // right of screen
        if (this.honk.x > 750) {
            let row = this.room.row;
            let newCol = this.room.col + 1;
            this.key = row + "|" + newCol;
            this.getRoom(this.key);
            this.setHonkPos(55, this.honk.y);
        }

        // left of screen
        if (this.honk.x < 50) {
            let row = this.room.row;
            let newCol = this.room.col - 1;
            this.key = row + "|" + newCol;
            this.getRoom(this.key);
            this.setHonkPos(745,this.honk.y);
        }

        // console.log(this.honk.x);
        // console.log(this.honk.y);

        if (this.cursors.left.isDown) {
            this.honk.setVelocityX(this.playerBaseSpeed * -1);
        } else if (this.cursors.right.isDown) {
            this.honk.setVelocityX(this.playerBaseSpeed);
        }

        if (this.cursors.up.isDown) {
            this.honk.setVelocityY(this.playerBaseSpeed * -1);
        } else if (this.cursors.down.isDown) {
            this.honk.setVelocityY(this.playerBaseSpeed);
        }
    };

    neighbours(room, maze) {
        var neighboursRooms = [];
        for (var i in room.neighbours) {
            let neighboursRow = room.neighbours[i].r;
            let neighboursCol = room.neighbours[i].c;

            if (neighboursRow || neighboursCol) {
                var neighboursRoom = new Room(this, maze[neighboursRow + "|" + neighboursCol]);
                neighboursRooms.push(neighboursRoom);
            }
        }
        return neighboursRooms;
    }

    doublePress(cursorKey, delay, pressCallback, resetCallback) {
        cursorKey.on("down", (event) => {
            let now = new Date().getTime();
            if (this.doublePresses[cursorKey.keyCode]) {
                let difference = now - this.doublePresses[cursorKey.keyCode];
                if (difference < delay) {
                    pressCallback();
                }
            }

            this.doublePresses[cursorKey.keyCode] = now;
        });
        cursorKey.on("up", () => {
            resetCallback();
        });
    }
}
