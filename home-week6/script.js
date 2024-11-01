// 전역 z 인덱스를 위한 전역 변수
let topPlantId = "plant1";

document.addEventListener("dragover", (event) => {
  // dragover 기본 이벤트는 요소의 드래그가 풀리는 순간 원래 위치로 돌아갑니다
  // 해당 이벤트를 막아야 요소의 불필요한 원래 위치 이동을 막을수 있습니다
  event.preventDefault();
  console.log("Drag over");
});

function dragElement(terrariumElement) {
  let prevPosX = 0;
  let prevPosY = 0;

  terrariumElement.setAttribute("draggable", true);

  terrariumElement.addEventListener("dragstart", (event) => {
    console.log("Drag started");

    prevPosX = event.clientX;
    prevPosY = event.clientY;
  });

  terrariumElement.addEventListener("dragend", (event) => {
    event.preventDefault();
    console.log("Drag ended");

    terrariumElement.style.top =
      terrariumElement.offsetTop - prevPosY + event.clientY + "px";
    terrariumElement.style.left =
      terrariumElement.offsetLeft - prevPosX + event.clientX + "px";
  });

  terrariumElement.addEventListener("dblclick", () => {
    const prevZIndex = document.getElementById(topPlantId);

    prevZIndex.style.zIndex = 5;
    terrariumElement.style.zIndex = 6;
    topPlantId = terrariumElement.id;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // 이미지가 로드된 후에 element를 가져옵니다

  dragElement(document.getElementById("plant1"));
  dragElement(document.getElementById("plant2"));
  dragElement(document.getElementById("plant3"));
  dragElement(document.getElementById("plant4"));
  dragElement(document.getElementById("plant5"));
  dragElement(document.getElementById("plant6"));
  dragElement(document.getElementById("plant7"));
  dragElement(document.getElementById("plant8"));
  dragElement(document.getElementById("plant9"));
  dragElement(document.getElementById("plant10"));
  dragElement(document.getElementById("plant11"));
  dragElement(document.getElementById("plant12"));
  dragElement(document.getElementById("plant13"));
  dragElement(document.getElementById("plant14"));
});
