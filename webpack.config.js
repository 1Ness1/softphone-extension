const path = require('path');
const isProduction = process.env.NODE_ENV == 'production';
const stylesHandler = 'style-loader';

const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry: {
        serviceWorker: "./src/service-worker/service-worker.js",
        contentScript: "./src/content-script/content-script.js",
        offscreen: "./src/offscreen/offscreen.js",
        popup: "./src/popup/popup.js",
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            filename: "offscreen.html",
            template: 'src/offscreen/offscreen.html',
        }),

        new HtmlWebpackPlugin({
            inject: false,
            filename: "popup.html",
            template: 'src/popup/popup.html',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },

    devtool: isProduction ? false : "inline-source-map",
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};
