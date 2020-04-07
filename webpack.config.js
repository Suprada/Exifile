const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

let mode = "development";
if (process.env.NODE_ENV !== "development") {
  mode = "production";
}

console.log("Webpack mode is", mode);

module.exports = {
  mode,
  entry: "./src/index.js",
  output: {
    filename: "exifile.js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        sourceMap: mode === "development" ? true : false,
        test: /\.js(\?.*)?$/i,
      }),
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: false,
    port: 9000,
  },
};
