const fs = require("fs");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPartialsPlugin = require("html-webpack-partials-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");

let mode = "development";
let hostPath = "https://localhost:9000";
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
const buildTime = new Date().toLocaleDateString("us-EN", options);

if (process.env.NODE_ENV !== "development") {
  mode = "production";
  hostPath = "https://secure27.webhostinghub.com/~suprad5/oddumbrella/exifile";
}

const JSPath = `'javascript:void function(){(function(e){var t=document.createElement("link");t.rel="stylesheet",t.type="text/css",t.href="${hostPath}/exifile.css",document.body.appendChild(t);var s=document.createElement("script");s.setAttribute("src",e),document.body.appendChild(s)})("${hostPath}/exifile.js")}();'`;

const plugins = [
  new CopyPlugin([
    {
      from: path.join(__dirname, "./static/"),
      to: path.join(__dirname, "./dist/"),
    },
  ]),
  new HtmlWebpackPlugin({
    template: path.join(__dirname, "./src/html/template.html"),
  }),
  new HtmlWebpackPartialsPlugin([
    {
      path: path.join(__dirname, "./src/html/_styles.html"),
      location: "head",
    },
    {
      path: path.join(__dirname, "./src/html/_analytics.html"),
      location: "head",
    },
    {
      path: path.join(__dirname, "./src/html/_column2.html"),
      location: "section",
      options: {
        JSPath,
      },
    },
    {
      path: path.join(__dirname, "./src/html/_test.html"),
      location: `div`,
      inject: mode === "development",
    },
  ]),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "exifile.css",
  }),
  new webpack.EnvironmentPlugin({
    NODE_ENV: "development",
    buildTime: buildTime,
  }),
];

const optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      sourceMap: mode === "development" ? true : false,
      test: /\.js(\?.*)?$/i,
    }),
    new OptimizeCssAssetsPlugin({
      filename: "exifile.css",
      cssProcessor: require("cssnano"),
      cssProcessorPluginOptions: {
        preset: ["default", { discardComments: { removeAll: true } }],
      },
      canPrint: true,
    }),
  ],
};

const devServer = {
  contentBase: path.join(__dirname, "static"),
  filename: "exifile.js",
  compress: false,
  port: 9000,
  https: true,
  key: fs.readFileSync("./localhost.key"),
  cert: fs.readFileSync("./localhost.crt"),
  ca: fs.readFileSync("./localhost.pem"),
  hot: true,
  historyApiFallback: true,
};

module.exports = {
  mode,
  entry: "./src/index.js",
  output: {
    filename: "exifile.js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization,
  plugins,
  devServer,
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "/dist/",
            },
          },
          "css-loader",
        ],
      },
    ],
  },
};
