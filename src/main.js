import * as Phaser from "phaser";
import './style.css';
import dudeImg from "./assets/caballero-derecha.png";
import dudeImg2 from "./assets/rosa.png";
import dudeImg3 from "./assets/caballero-izquierda.png";
import dudeImg4 from "./assets/cielo.jpg";
import dudeImg5 from "./assets/suelo.png";



const config = {
  type: Phaser.AUTO,
  width: 800, height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
};

var player;
var flowers;
var cursors;
var score = 0;
var scoreText;
var platforms;


function preload() {
  this.load.image('sky', dudeImg4);
  this.load.image('ground', dudeImg5)

  this.load.spritesheet('dude', dudeImg, { 
    frameWidth: 148, frameHeight: 218
  });

  this.load.spritesheet('dude2', dudeImg3, { 
    frameWidth: 148, frameHeight: 218
  });

  this.load.spritesheet('flower', dudeImg2, { 
    frameWidth: 330, frameHeight: 580
  });
}

function create() {
  this.add.image(400, 300, 'sky');
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 785, 'ground').setScale(2).refreshBody();
  platforms.create('ground');
  platforms.create( 'ground');
  platforms.create(750, 220, 'ground');
  
  player = this.physics.add.sprite(40, 495, 'dude');
  player.setCollideWorldBounds(true);

  player.setScale(0.7)
  
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude2', { start: 0, end: 4 }),
    frameRate: 0,
    repeat: -10
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 4 }),
    frameRate: 0,
    repeat: -10
  });

  flowers = this.physics.add.group({
    key: 'flower',
    repeat: 5,
    setXY: { x: 250, y: 0, stepX: 100 },
  });

  flowers.getChildren().forEach((child) => {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.7));
    child.setCollideWorldBounds(true);
    child.setScale(0.1);
  });


  scoreText = this.add.text(32, 32, 'Rosas: 0', { fontSize: '32px', fill: '#ffffff' });
  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.overlap(flowers, player,collect, null, this);
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(flowers, platforms);

}

function update() {
  if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  } else {
    player.setVelocityX(0);
  };
  
  if (cursors.up.isDown && player.body.blocked.down)  {
    player.setVelocityY(-500);
  };
};

function collect (player, flower) {
  flower.disableBody(true, true);
  score += 1;
  scoreText.setText('Rosas: ' + score);
}


const game = new Phaser.Game(config);