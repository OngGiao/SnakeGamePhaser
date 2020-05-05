var width = 608,
    height = 608,
    box = 32;
var startX = 1 * box;
var startY = 3 * box;
var boxX = 17,
    boxY = 15;

var snakeHead;

var cusors;
var playerDirection;
var frameCounter = 0;
var gameSpeed = 10;
var apple;
let score = 0;
let dead = false;

var config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);

function preload() {
    this.load.image('food', '../img/food.png');
    this.load.image('body', '../img/ground.png');
    this.load.audio('dead', '../audio/dead.mp3');
    this.load.audio('eat', '../audio/eat.mp3');
    this.load.audio('up', '../audio/up.mp3');
    this.load.audio('right', '../audio/right.mp3');
    this.load.audio('left', '../audio/left.mp3');
    this.load.audio('down', '../audio/down.mp3');
}

function create() {
    this.add.image(0, 0, 'body').setOrigin(0);

    gameText = this.add.text(2 * box, 0.5 * box, score, {
        font: "45px Arial",
        fill: "#fff"
    });

    newApple(this);

    snakeHead = {
        x: 9 * box,
        y: 10 * box,
        oldHead: null
    };
    newHead(this, snakeHead);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {

    frameCounter++;
    gameText.text = score;
    updateDirection();
    if (frameCounter == gameSpeed) {
        movePlayer(this);
        frameCounter = 0;
    }
}

function newHead(scene, head) {
    var rectGraphic = scene.add.graphics({
        lineStyle: {
            width: 1,
            color: 0xffffff
        },
        fillStyle: {
            color: 0x008000
        }
    });
    rectGraphic.fillRect(head.x, head.y, box, box);
    rectGraphic.strokeRect(head.x, head.y, box, box);
    head.rect = rectGraphic;
}

function removeTail(head) {
    if (head.oldHead == null) {
        head.rect.destroy();
        return true;
    }

    var result = removeTail(head.oldHead);
    if (result) {
        head.oldHead = null;
    }
    return false;
}

function newApple(scene) {
    var ranX = (Phaser.Math.RND.between(0, boxX - 1) * box) + startX;
    var ranY = (Phaser.Math.RND.between(0, boxY - 1) * box) + startY;


    var a = scene.add.image(ranX, ranY, 'food').setOrigin(0);
    a.displayWidth = box;
    a.displayHeight = box;

    apple = {
        x: ranX,
        y: ranY,
        img: a
    }
}

function updateDirection() {
    if (cursors.right.isDown && playerDirection != "LEFT") {
        playerDirection = "RIGHT";
    }
    if (cursors.left.isDown && playerDirection != "RIGHT") {
        playerDirection = "LEFT";
    }
    if (cursors.up.isDown && playerDirection != "DOWN") {
        playerDirection = "UP";
    }
    if (cursors.down.isDown && playerDirection != "UP") {
        playerDirection = "DOWN";
    }
}

function movePlayer(scene) {
    if (!playerDirection || dead) {
        return;
    }
    // old head position
    let snakeX = snakeHead.x;
    let snakeY = snakeHead.y;

    if (playerDirection == "LEFT") {
        game.sound.play('left');
        snakeX -= box;
    } else if (playerDirection == "UP") {
        game.sound.play('up');
        snakeY -= box;
    } else if (playerDirection == "RIGHT") {
        game.sound.play('right');
        snakeX += box;
    } else if (playerDirection == "DOWN") {
        game.sound.play('down');
        snakeY += box;
    }

    var newSnakeHead = {
        x: snakeX,
        y: snakeY,
        oldHead: snakeHead
    }

    snakeHead = newSnakeHead;

    if (snakeX < startX || snakeX > boxX * box || snakeY < startY || snakeY > boxX * box || playerCollide()) {
        game.sound.play('dead');
        dead = true;
        return;
    }

    newHead(scene, snakeHead);

    if (apple.x == snakeX && apple.y == snakeY) {
        score++;
        game.sound.play('eat');
        apple.img.destroy();
        newApple(scene);
    } else {
        removeTail(snakeHead)
    }
}

function playerCollide() {
    // check if the head has collided with any other body part, starting at the tail
    var thisOldHead = snakeHead.oldHead;
    var collides = false;
    while (thisOldHead != null) {
        if (snakeHead.x == thisOldHead.x &&
            snakeHead.y == thisOldHead.y) {
            collides = true;
        }
        thisOldHead = thisOldHead.oldHead;
    }
    return collides;
}