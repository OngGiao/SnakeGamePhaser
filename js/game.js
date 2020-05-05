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

var game = new Phaser.Game(width, height, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});

function preload() {
    game.load.image('food', '../img/food.png');
    game.load.image('body', '../img/ground.png');
    game.load.audio('dead', '../audio/dead.mp3');
    game.load.audio('eat', '../audio/eat.mp3');
    game.load.audio('up', '../audio/up.mp3');
    game.load.audio('right', '../audio/right.mp3');
    game.load.audio('left', '../audio/left.mp3');
    game.load.audio('down', '../audio/down.mp3');
}

function create() {
    game.add.image(0, 0, 'body');

    gameText = game.add.text(2 * box, 0.5 * box, score, {
        font: "45px Arial",
        fill: "#fff"
    });

    newApple();

    snakeHead = {
        x: 9 * box,
        y: 10 * box,
        oldHead: null
    };
    newHead(snakeHead);

    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    frameCounter++;
    gameText.text = score;
    updateDirection();
    if (frameCounter == gameSpeed) {
        movePlayer();
        frameCounter = 0;
    }
}

function newHead(head) {

    var rectGraphic = game.add.graphics()
    rectGraphic.beginFill(0x008000);
    rectGraphic.drawRect(head.x, head.y, box, box);

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

function newApple() {
    var ranX = (game.math.between(0, boxX - 1) * box) + startX;
    var ranY = (game.math.between(0, boxY - 1) * box) + startY;


    var a = game.add.image(ranX, ranY, 'food');
    a.width = box;
    a.height = box;

    apple = {
        x: ranX,
        y: ranY,
        img: a
    }
}

function updateDirection() {
    if (cursors.right.isDown) {
        playerDirection = "RIGHT";
    }
    if (cursors.left.isDown) {
        playerDirection = "LEFT";
    }
    if (cursors.up.isDown) {
        playerDirection = "UP";
    }
    if (cursors.down.isDown) {
        playerDirection = "DOWN";
    }
}

function movePlayer() {
    if (!playerDirection || dead) {
        return;
    }
    // old head position
    let snakeX = snakeHead.x;
    let snakeY = snakeHead.y;

    if (playerDirection == "LEFT" && playerDirection != "RIGHT") {
        game.sound.play('left');
        snakeX -= box;
    } else if (playerDirection == "UP" && playerDirection != "DOWN") {
        game.sound.play('up');
        snakeY -= box;
    } else if (playerDirection == "RIGHT" && playerDirection != "LEFT") {
        game.sound.play('right');
        snakeX += box;
    } else if (playerDirection == "DOWN" && playerDirection != "UP") {
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

    newHead(snakeHead);

    if (apple.x == snakeX && apple.y == snakeY) {
        score++;
        game.sound.play('eat');
        apple.img.destroy();
        newApple();
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