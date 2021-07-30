//Load background images
const back_img = new Image();
back_img.src = "img/bgnew.jpg";

const level_img = new Image();
level_img.src = "img/level.png";

const life_img = new Image();
life_img.src = "img/life.png";

const score_img = new Image();
score_img.src = "img/score.png";

//loading the sounds
const wall_hit = new Audio();
wall_hit.src = "sounds/wall.mp3";

const win_sound = new Audio();
win_sound.src = "sounds/win.mp3";

const paddlehit = new Audio();
paddlehit.src = "sounds/brick_hit.mp3";

const lost = new Audio();
lost.src = "sounds/life_lost.mp3";

const brickhitting = new Audio();
brickhitting.src = "sounds/paddle_hit.mp3";