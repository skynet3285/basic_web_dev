chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === "updateIcon") {
    let iconSizes = [16, 32, 48, 128];
    let imageDataDict = {};
    iconSizes.forEach((size) => {
      imageDataDict[size] = drawIcon(msg.value.color, size);
    });
    chrome.action.setIcon({ imageData: imageDataDict });
  }
});

function drawIcon(color, size) {
  let canvas = new OffscreenCanvas(size, size);
  let context = canvas.getContext("2d");
  context.clearRect(0, 0, size, size);
  context.beginPath();
  context.fillStyle = color;
  context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
  context.fill();
  return context.getImageData(0, 0, size, size);
}
