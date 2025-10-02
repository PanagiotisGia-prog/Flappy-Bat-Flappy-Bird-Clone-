let config = {
    renderer: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

let isGameStarted = false;

function preload() {
    this.load.image("background", "assets/Background.png");
    this.load.image("platform", "assets/platform.png");
    this.load.image("column", "assets/Column.png");
    this.load.image("column-upside", "assets/Column-Upside.png");
    this.load.image("bat", "assets/Bat.png", {frameWidth: 64, frameHeight: 96});
}

let bat;
let hasLanded = false;
let cursor;
let hasBumbed = false;
let message;

function create() {
    const background = this.add.image(0, 0, "background").setOrigin(0, 0);
    const roads = this.physics.add.staticGroup();

    const upColumn = this.physics.add.staticGroup({
        key: "column-upside",
        repeat: 1,
        setXY: {x: 200, y: 0, stepX: 300}
    });

    const botColumn = this.physics.add.staticGroup({
        key: "column",
        repeat: 1,
        setXY: {x: 350, y: 400, stepX: 300}
    });

    const road = roads.create(400, 558, "platform").setScale(2).refreshBody();

    bat = this.physics.add.sprite(0, 50, "bat").setScale(2);
    bat.setBounce(0.2);
    bat.setCollideWorldBounds(true);

    this.physics.add.overlap(bat, road, () => hasLanded = true, null, this);
    this.physics.add.collider(bat, road);

    this.physics.add.overlap(bat, upColumn, ()=> hasBumbed = true, null, this);
    this.physics.add.collider(bat, upColumn);
    this.physics.add.overlap(bat, botColumn, () => hasBumbed = true, null, this);
    this.physics.add.collider(bat, botColumn);

    message = this.add.text(0, 0, "How to play: Press space to start", {fontFamily: '"Fantasy", Impact', fontSize: "20px", color: "black", backgroundColor: "white"});
    Phaser.Display.Align.In.BottomCenter(message, background, 0, 50);

    cursor = this.input.keyboard.createCursorKeys();
}

function update() {

    if (!isGameStarted) {
        bat.setVelocityY(-160);
    }

    if (cursor.space.isDown && !isGameStarted) {
        isGameStarted = true;
        message.text = "How to play: Press the 'Up arrow' button to stay up\nand try not to hit the fire columns or the ground";
    }

    if (cursor.up.isDown && !hasLanded){
        bat.setVelocityY(-160);
    }

    if (!hasLanded || !hasBumbed){
        bat.body.velocity.x = 50;
    }
    if (hasLanded || hasBumbed || !isGameStarted) {
        bat.body.velocity.x = 0;
    }

    if (hasLanded || hasBumbed){
        bat.setVelocityY(160);
        message.text = "Oh no you crashed!";
    }

    if (bat.x > 750) {
        bat.setVelocityY(40);
        message.text = "Congratulations! You won!";
    }
}