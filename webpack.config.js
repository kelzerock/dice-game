const path = require("path");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src", "index.ts"),
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      util: false,
      os: false,
    },
  },
  externals: {
    "node:crypto": "commonjs crypto",
    "node:readline/promises": "commonjs readline/promises",
    "node:process": "commonjs process",
  },
};
