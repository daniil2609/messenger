const path = require("path");

module.exports = {
    entry: "./src/index.js",
    mode: "development",
    output: {
        filename: "main.js"
    },
    devServer: {
        static: {
          directory: path.join(__dirname, "dist")
        },
        compress: true,
        port: 9000,
      },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                options: {
                    presets: [
                        "@babel/preset-env", "@babel/preset-react"
                    ]
                }
            }
        ]
    }
};