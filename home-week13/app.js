const FireReload = 70;
const ShieldDuration = 2000;

class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dead = false; // 객체가 파괴되었는지 여부
    this.type = ""; // 객체 타입 (영웅/적)
    this.width = 0; // 객체의 폭
    this.height = 0; // 객체의 높이
    this.img = undefined; // 객체의 이미지
  }

  rectFromGameObject() {
    return {
      top: this.y,
      left: this.x,
      bottom: this.y + this.height,
      right: this.x + this.width,
    };
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    // 캔버스에 이미지 그리기
  }
}

class Hero extends GameObject {
  constructor(x, y) {
    super(x, y);
    (this.width = 99), (this.height = 75);
    this.type = "Hero";
    this.speed = { x: 0, y: 0 };
    this.cooldown = 0;
    this.hp = 3;
    this.points = 0;
    this.isDamaged = false;
  }

  fire(xOffset = 0, yOffset = 0) {
    if (this.canFire()) {
      gameObjects.push(new Laser(this.x + 45 + xOffset, this.y - 10 + yOffset)); // 레이저 발사
      this.cooldown = 500; // 쿨다운 500ms
      let id = setInterval(() => {
        if (this.cooldown > 0) {
          this.cooldown -= 100;
        } else {
          clearInterval(id);
        }
      }, FireReload);
    }
  }

  canFire() {
    return this.cooldown === 0; // 쿨다운이 끝났는지 확인
  }

  decrementLife(decrement = 1) {
    this.hp -= decrement;

    this.isDamaged = true;

    this.img = heroDamagedImg;

    if (this.hp === 0) {
      this.dead = true;
    }
  }

  incrementPoints() {
    this.points += 100;
  }
}

class Enemy extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 98;
    this.height = 50;
    this.type = "Enemy";
    this.hp = 1;
  }

  decrementLife(decrement = 1) {
    this.hp -= decrement;

    if (this.hp === 0) {
      clearInterval(this.id);
      this.dead = true;
    }
  }
}

class EnemyBoss extends GameObject {
  constructor(x, y, hero) {
    super(x, y);
    this.width = 100;
    this.height = 100;
    this.type = "Enemy";
    this.hp = 3;

    // 적 캐릭터 플레이어 x축 따라 이동
    this.id = setInterval(() => {
      if (hero.x < this.x) {
        this.x -= 5; // 왼쪽으로 이동
      } else if (hero.x > this.x) {
        this.x += 5; // 오른쪽으로 이동
      }
    }, 100);

    // 적 캐릭터 레이저 발사
    this.autoFireId = setInterval(() => {
      gameObjects.push(new LaserEnemy(this.x + 45, this.y + 100)); // 레이저 발사
    }, 1700);
  }

  decrementLife(decrement = 1) {
    this.hp -= decrement;

    if (this.hp === 0) {
      this.dead = true;
      clearInterval(this.id);
      clearInterval(this.autoFireId);
    }
  }
}

class LaserEnemy extends GameObject {
  constructor(x, y) {
    super(x, y);
    (this.width = 9), (this.height = 33);
    this.type = "LaserEnemy";
    this.img = laserGreenImg;
    let id = setInterval(() => {
      if (this.y < canvas.height) {
        this.y += 15; // 레이저가 아래로 이동
      } else {
        this.dead = true; // 화면 하단에 도달하면 제거
        clearInterval(id);
      }
    }, 100);
  }
}

class Laser extends GameObject {
  constructor(x, y) {
    super(x, y);
    (this.width = 9), (this.height = 33);
    this.type = "Laser";
    this.img = laserImg;
    let id = setInterval(() => {
      if (this.y > 0) {
        this.y -= 15; // 레이저가 위로 이동
      } else {
        this.dead = true; // 화면 상단에 도달하면 제거
        clearInterval(id);
      }
    }, 100);
  }
}

class Explosion extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 50; // 폭발 이미지 크기
    this.height = 50;
    this.frame = 0; // 폭발 애니메이션 프레임
    this.totalFrames = 10; // 총 프레임 수 (적당히 조절)
    let id = setInterval(() => {
      if (this.frame < this.totalFrames) {
        ++this.frame;
      } else {
        this.dead = true; // 애니메이션 끝나면 삭제
        clearInterval(id);
      }
    }, 100); // 각 프레임 지속 시간
  }

  draw(ctx) {
    ctx.drawImage(
      this.img,
      this.frame * this.width, // 프레임에 따라 x 좌표 이동
      0, // y는 고정
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(message, listener) {
    if (!this.listeners[message]) {
      this.listeners[message] = [];
    }
    this.listeners[message].push(listener);
  }

  emit(message, payload = null) {
    if (this.listeners[message]) {
      this.listeners[message].forEach((l) => l(message, payload));
    }
  }

  clear() {
    this.listeners = {};
  }
}

const Messages = {
  KEY_EVENT_UP: "KEY_EVENT_UP",
  KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
  KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
  KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
  KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
  COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
  COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
  GAME_END_LOSS: "GAME_END_LOSS",
  GAME_END_WIN: "GAME_END_WIN",
  KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
};

///////////////
//
//
// 전역 함수

function loadTexture(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
  });
}

function intersectRect(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}

///////////////
//
//
// 전역 변수

let lifeImg,
  heroImg,
  enemyImg,
  enemyBossImg,
  laserImg,
  laserGreenShotImg,
  laserGreenImg,
  canvas,
  ctx,
  gameObjects = [],
  hero,
  heroLeftSmall,
  heroRightSmall,
  shieldCount,
  isShield,
  isGameEnd,
  gameLoopId,
  autoLazerId,
  eventEmitter = new EventEmitter();

async function loadAssets() {
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  lifeImg = await loadTexture("assets/life.png");
  heroImg = await loadTexture("assets/player.png");
  heroLeftImg = await loadTexture("assets/playerLeft.png");
  heroRightImg = await loadTexture("assets/playerRight.png");
  heroDamagedImg = await loadTexture("assets/playerDamaged.png");
  enemyImg = await loadTexture("assets/enemyShip.png");
  enemyBossImg = await loadTexture("assets/enemyUFO.png");
  laserImg = await loadTexture("assets/laserRed.png");
  laserGreenImg = await loadTexture("assets/laserGreen.png");
  laserGreenShotImg = await loadTexture("assets/laserGreenShot.png");
  shieldImg = await loadTexture("assets/shield.png");
  shieldCountImg = await loadTexture("assets/shieldCount.png");
}

function createStarEnemies(enemyHp, enemySpeed) {
  const pattern = [5, 3, 1]; // 각 줄에 배치할 적의 개수
  const ROW_HEIGHT = 50; // 줄 간 간격
  const COL_WIDTH = 98; // 적 하나의 너비

  let y = 0; // 초기 y 위치
  pattern.forEach((enemyCount) => {
    const totalWidth = enemyCount * COL_WIDTH;
    const startX = (canvas.width - totalWidth) / 2; // 중앙 정렬

    for (let i = 0; i < enemyCount; i++) {
      const x = startX + i * COL_WIDTH; // x 위치 계산
      const enemy = new Enemy(x, y);
      enemy.hp = enemyHp;
      enemy.img = enemyImg;

      // 적 이동 속도 조정
      enemy.id = setInterval(() => {
        if (enemy.y < canvas.height - enemy.height) {
          enemy.y += 5; // 기본 이동
        } else {
          enemy.dead = true; // 화면 끝에 도달하면 제거
          clearInterval(enemy.id);
        }
      }, enemySpeed);

      gameObjects.push(enemy);
    }

    y += ROW_HEIGHT; // 다음 줄로 이동
  });
}

function createEnemiesByCount(enemyCount, enemyHp, enemySpeed) {
  if (enemyCount > 50) {
    enemyCount = 50;
  }
  const MONSTER_WIDTH = enemyCount * 98;
  const START_X = (canvas.width - MONSTER_WIDTH) / 2;
  const STOP_X = START_X + MONSTER_WIDTH;

  for (let x = START_X; x < STOP_X; x += 98) {
    for (let y = 0; y < 50 * (enemyCount / 5); y += 50) {
      const enemy = new Enemy(x, y);
      enemy.hp = enemyHp;
      enemy.img = enemyImg;

      // 적 이동 속도 조정
      enemy.id = setInterval(() => {
        if (enemy.y < canvas.height - enemy.height) {
          enemy.y += 5; // 기본 이동
        } else {
          enemy.dead = true; // 화면 끝에 도달하면 제거
          clearInterval(enemy.id);
        }
      }, enemySpeed);

      gameObjects.push(enemy);
    }
  }
}

function createEnemyBoss(enemyHp) {
  const enemyBoss = new EnemyBoss(canvas.width / 2, 0, hero);
  enemyBoss.hp = enemyHp;
  enemyBoss.img = enemyBossImg;
  gameObjects.push(enemyBoss);
}

function createHero() {
  hero = new Hero(canvas.width / 2 - 45, canvas.height - canvas.height / 4);
  hero.img = heroImg;
  gameObjects.push(hero);

  heroLeftSmall = new Hero(
    hero.x + heroImg.width / 2 - 100,
    hero.y + heroImg.width / 2 - 15
  );
  heroLeftSmall.img = heroImg;
  heroLeftSmall.width = heroImg.width * 0.5;
  heroLeftSmall.height = heroImg.height * 0.5;
  gameObjects.push(heroLeftSmall);

  heroRightSmall = new Hero(
    hero.x + heroImg.width / 2 + 50,
    hero.y + heroImg.width / 2 - 15
  );
  heroRightSmall.img = heroImg;
  heroRightSmall.width = heroImg.width * 0.5;
  heroRightSmall.height = heroImg.height * 0.5;
  gameObjects.push(heroRightSmall);
}

function updateGameObjects() {
  const enemies = gameObjects.filter((go) => go.type === "Enemy");
  const lasers = gameObjects.filter((go) => go.type === "Laser");
  const lasersEnemy = gameObjects.filter((go) => go.type === "LaserEnemy");

  if (isShield) {
    drawShield();
  } else {
    enemies.forEach((enemy) => {
      const heroRect = hero.rectFromGameObject();
      if (intersectRect(heroRect, enemy.rectFromGameObject())) {
        eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
      }
    });

    lasersEnemy.forEach((l) => {
      const heroRect = hero.rectFromGameObject();
      if (intersectRect(l.rectFromGameObject(), heroRect)) {
        eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy: l });
      }
    });
  }

  lasers.forEach((l) => {
    enemies.forEach((m) => {
      if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
        eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
          first: l,
          second: m,
        });

        const explosion = new Explosion(m.x, m.y);
        explosion.img = laserGreenShotImg;
        gameObjects.push(explosion);
      }
    });
  });
  // 죽은 객체 제거
  gameObjects = gameObjects.filter((go) => !go.dead);

  if (isHeroDead()) {
    eventEmitter.emit(Messages.GAME_END_LOSS);
  } else if (isEnemiesDead()) {
    eventEmitter.emit(Messages.GAME_END_WIN);
  }
}

function isHeroDead() {
  return hero.hp <= 0;
}

function isEnemiesDead() {
  const enemies = gameObjects.filter((go) => go.type === "Enemy" && !go.dead);
  return enemies.length === 0;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBackground() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawShield() {
  ctx.drawImage(shieldImg, hero.x - 25, hero.y - 30);
}

function drawShieldCount() {
  const START_POS = canvas.width - 320;
  for (let i = 0; i < shieldCount; ++i) {
    ctx.drawImage(
      shieldCountImg,
      START_POS + 45 * (i + 1),
      canvas.height - 37,
      30,
      30
    );
  }
}

function drawLife() {
  const START_POS = canvas.width - 180;
  for (let i = 0; i < hero.hp; ++i) {
    ctx.drawImage(lifeImg, START_POS + 45 * (i + 1), canvas.height - 37);
  }
}

function drawPoints() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "left";
  drawText("Points: " + hero.points, 10, canvas.height - 20);
}

function drawStage() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  drawText("Stage: " + currentStage, canvas.width / 2 - 50, canvas.height - 20);
}

function drawText(message, x, y) {
  ctx.fillText(message, x, y);
}

function drawGameObjects(ctx) {
  gameObjects.forEach((go) => go.draw(ctx));
}

function displayMessage(message, color = "red") {
  ctx.font = "30px Arial";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function setupEventEmitter() {
  eventEmitter.on(Messages.KEY_EVENT_UP, () => {
    hero.y -= 10;
    heroLeftSmall.y -= 10;
    heroRightSmall.y -= 10;
  });
  eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
    hero.y += 10;
    heroLeftSmall.y += 10;
    heroRightSmall.y += 10;
  });
  eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
    hero.x -= 10;
    heroLeftSmall.x -= 10;
    heroRightSmall.x -= 10;

    hero.img = heroLeftImg;
    setTimeout(() => {
      if (hero.isDamaged === true) {
        hero.img = heroDamagedImg;
      } else {
        hero.img = heroImg;
      }
    }, 150);
  });
  eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
    hero.x += 10;
    heroLeftSmall.x += 10;
    heroRightSmall.x += 10;

    hero.img = heroRightImg;
    setTimeout(() => {
      if (hero.isDamaged === true) {
        hero.img = heroDamagedImg;
      } else {
        hero.img = heroImg;
      }
    }, 150);
  });
  eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
    first.dead = true; // 레이저 제거
    second.decrementLife(); // 적 체력 감소
    hero.incrementPoints();
  });
  eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
    if (hero.canFire()) {
      hero.fire();
    }
  });
  eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
    enemy.dead = true;
    hero.decrementLife();
    heroLeftSmall.decrementLife();
    heroRightSmall.decrementLife();
  });
  eventEmitter.on(Messages.GAME_END_WIN, () => {
    if (currentStage < 3) {
      ++currentStage;
      createEnemiesForStage(currentStage);
    } else {
      endGame(true);
    }
  });
  eventEmitter.on(Messages.GAME_END_LOSS, () => {
    endGame(false);
  });
  eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
    if (isGameEnd) {
      mainMenu.style.display = "flex";
      canvas.style.display = "none";
      isGameRunning = false;

      reset();
    }
  });
}

/////////////// 게임 메인
const mainMenu = document.getElementById("mainMenu");
const startButton = document.getElementById("startButton");
const highScoreElement = document.getElementById("highScore");

let isGameRunning = false;
let highScore = localStorage.getItem("highScore") || 0;

function updateScore(newScore) {
  score = newScore;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  drawHighScore();
}

function drawHighScore() {
  highScoreElement.textContent = highScore;
}

function gameLoop() {
  if (!isGameRunning) return;

  clearCanvas();
  drawBackground();
  drawPoints();
  drawStage();
  drawLife();
  drawShieldCount();
  updateGameObjects();
  drawGameObjects(ctx);
}

function startGame() {
  isGameEnd = false;

  gameLoopId = setInterval(gameLoop, 50);

  autoLazer = setInterval(() => {
    if (hero.dead === false) {
      heroLeftSmall.fire(-23);
      heroRightSmall.fire(-23);
    }
  }, 700);

  gameObjects = [];
  shieldCount = 3;
  isShield = false;
  currentStage = 1;

  createHero();
  createEnemiesForStage(currentStage);

  eventEmitter.clear();
  setupEventEmitter();
}

function endGame(win) {
  updateScore(hero.points);
  clearInterval(gameLoopId);
  // 게임 화면이 겹칠 수 있으니, 200ms 지연
  setTimeout(() => {
    isGameEnd = true;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (win) {
      displayMessage(
        "Victory!!! Pew Pew... - Press [Enter] to start a new game Captain Pew Pew",
        "green"
      );
    } else {
      displayMessage(
        "You died !!! Press [Enter] to start a new game Captain Pew Pew"
      );
    }
  }, 200);
}

function reset() {
  clearInterval(gameLoopId);
  clearInterval(autoLazerId);
}

function initGame() {
  mainMenu.style.display = "none";
  canvas.style.display = "block";
  isGameRunning = true;
  startGame();
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    eventEmitter.emit(Messages.KEY_EVENT_UP);
  } else if (e.key === "ArrowDown") {
    eventEmitter.emit(Messages.KEY_EVENT_DOWN);
  } else if (e.key === "ArrowLeft") {
    eventEmitter.emit(Messages.KEY_EVENT_LEFT);
  } else if (e.key === "ArrowRight") {
    eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
  } else if (e.key === "Enter") {
    eventEmitter.emit(Messages.KEY_EVENT_ENTER);
  } else if (e.key === " ") {
    eventEmitter.emit(Messages.KEY_EVENT_SPACE);
  } else if (e.key === "r") {
    if (!isShield && shieldCount > 0) {
      isShield = true;
      --shieldCount;

      setTimeout(() => {
        isShield = false;
      }, ShieldDuration);
    }
  }
});

startButton.addEventListener("click", initGame);

let currentStage = 1;

function createEnemiesForStage(stageIndex) {
  switch (stageIndex) {
    case 1:
      createStarEnemies(3, 200);
      setTimeout(() => {
        createStarEnemies(3, 200);
      }, 6000);
      break;
    case 2:
      createEnemiesByCount(20, 2, 200);
      setTimeout(() => {
        createEnemiesByCount(20, 2, 200);

        setTimeout(() => {
          createStarEnemies(3, 200);
        }, 8000);
      }, 8000);
      break;

    case 3:
      createEnemiesByCount(20, 3, 200);

      setTimeout(() => {
        createEnemyBoss(10);
      }, 3000);
      break;
  }
}

window.onload = async () => {
  await loadAssets();
  drawHighScore();
};
