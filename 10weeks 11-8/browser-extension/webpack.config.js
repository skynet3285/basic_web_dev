// webpack.config.js

const path = require("path");

module.exports = {
  mode: "development", // 개발 모드에서는 소스맵 생성
  entry: "./src/index.js", // 엔트리 파일 경로
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "inline-source-map", // 소스맵 설정
};
