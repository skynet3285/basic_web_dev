window.onload = async () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  function loadTexture(path) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        resolve(img);
      };
    });
  }

  let playerX = canvas.width / 2 - 45;
  let playerY = canvas.height - canvas.height / 4;

  const heroImg = await loadTexture("assets/player.png");
  const smallHeroWidth = heroImg.width * 0.5;
  const smallHeroHeight = heroImg.height * 0.5;

  const enemyImg = await loadTexture("assets/enemyShip.png");
  const backgroundImg = await loadTexture("assets/starBackground.png");
  const ptrn = ctx.createPattern(backgroundImg, "repeat");

  ctx.fillStyle = ptrn;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(heroImg, playerX, playerY);
  ctx.drawImage(
    heroImg,
    playerX + heroImg.width / 2 - 100,
    playerY + heroImg.height / 2 - 15,
    smallHeroWidth,
    smallHeroHeight
  ); // 왼쪽에 작은 이미지
  ctx.drawImage(
    heroImg,
    playerX + heroImg.width / 2 + 50,
    playerY + heroImg.height / 2 - 15,
    smallHeroWidth,
    smallHeroHeight
  ); // 오른쪽에 작은 이미지

  function createEnemies(ctx, canvas, enemyImg) {
    const MONSTER_TOTAL = 5;
    const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
    const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    const STOP_X = START_X + MONSTER_WIDTH;
    for (let x = START_X; x < STOP_X; x += enemyImg.width) {
      for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height) {
        ctx.drawImage(enemyImg, x, y);
      }
    }
  }

  function createEnemies2(ctx, canvas, enemyImg) {
    const MONSTER_TOTAL = 5; // 피라미드의 가장 아래 행의 적 개수
    const ROWS = 5; // 피라미드의 행 수

    for (let row = 0; row < ROWS; row++) {
      // 각 행의 적 개수: 아래에서 위로 갈수록 줄어듦
      const monstersInRow = MONSTER_TOTAL - row;

      // 각 행의 적들이 중앙에 맞춰지도록 시작 X 좌표 계산
      const rowWidth = monstersInRow * enemyImg.width;
      const startX = (canvas.width - rowWidth) / 2;

      // 현재 행(row)의 적을 중앙 정렬로 배치
      for (let col = 0; col < monstersInRow; col++) {
        const x = startX + col * enemyImg.width;
        const y = row * enemyImg.height;
        ctx.drawImage(enemyImg, x, y);
      }
    }
  }

  createEnemies2(ctx, canvas, enemyImg);
};
