// blackjack.js

// Dealer
let bankSum = 0;

// Player
let sum = 0;

function add_sum_dealer(amount) {
  bankSum += amount;
}

function add_sum_player(amount) {
  sum += amount;
}

// Player Card Draw
add_sum_player(5);
add_sum_player(7);

// Dealer Card Draw
add_sum_dealer(7);
add_sum_dealer(5);
add_sum_dealer(3);
add_sum_dealer(1);

// Player Card Draw
add_sum_player(7);

// Point
console.log(`You have ${sum} points`);
console.log(`Bank has ${bankSum} points`);

// 딜러는 17점 이상일 때 멈춰야 하고, 그 이하일 때는 추가 카드를 뽑아야 함
if (bankSum <= 17) {
  console.log("Dealer should draw a new card");
  return;
}

// 플레이어와 딜러의 카드 합계가 21을 넘으면 Bust(패배).
if (bankSum > 21 && sum > 21) {
  console.log("Bust");
  return;
}

// 플레이어가 21점을 달성하면 블랙잭(즉시 승리).
if (sum == 21) {
  console.log("Blackjack!");
  return;
}
if (bankSum == 21) {
  console.log("You lost");
  return;
}

// 21점을 초과한 쪽이 무조건 패배
if (bankSum > 21) {
  console.log("Bank lost");
  return;
}
if (sum > 21) {
  console.log("You lost");
  return;
}

// 카드 합계가 같은 경우 무승부(Draw).
if (bankSum == sum) {
  console.log("Draw");
  return;
}
