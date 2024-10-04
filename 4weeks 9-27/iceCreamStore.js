let iceCreamFlavors = [
  { name: "Chocolate", type: "Chocolate", price: 2 },
  { name: "Strawberry", type: "Fruit", price: 1 },
  { name: "Vanilla", type: "Vanilla", price: 2 },
  { name: "Pistachio", type: "Nuts", price: 1.5 },
  { name: "Neapolitan", type: "Chocolate", price: 2 },
  { name: "Mint Chip", type: "Chocolate", price: 1.5 },
  { name: "Raspberry", type: "Fruit", price: 1 },
];

// { scoops: [], total: }
let transactions = [];
transactions.push({
  scoops: ["Chocolate", "Vanilla", "Mint Chip"],
  total: 5.5,
});
transactions.push({ scoops: ["Raspberry", "StrawBerry"], total: 2 });
transactions.push({ scoops: ["Vanilla", "Vanilla"], total: 4 });

console.log(iceCreamFlavors);

const total = transactions.reduce((acc, curr) => acc + curr.total, 0);
console.log(`You've made ${total} $ today`); // You've made 11.5 $ toda

let flavorDistribution = transactions.reduce((acc, curr) => {
  curr.scoops.forEach((scoop) => {
    if (!acc[scoop]) {
      acc[scoop] = 0;
    }
    ++acc[scoop];
  });
  return acc;
}, {}); // { Chocolate: 1, Vanilla: 3, Mint Chip: 1, Raspberry: 1, StrawBerry: 1 }
console.log(flavorDistribution);

const bestSeller = Object.keys(flavorDistribution).reduce((acc, curr) => {
  // 팔린 수를 비교하여 가장 큰 것을 반환
  if (flavorDistribution[acc] < flavorDistribution[curr]) {
    return curr;
  }
  return acc;
});
console.log(`best seller : ${bestSeller}`);
