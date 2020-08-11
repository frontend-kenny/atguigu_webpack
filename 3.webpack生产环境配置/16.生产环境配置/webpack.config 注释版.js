/**
 *  webpack.config.js  webpack的配置文件
 *   作用: 指示 webpack 干哪些活（当你运行 webpack 指令时，会加载里面的配置）
 *
 *   所有构建工具都是基于nodejs平台运行的~模块化默认采用commonjs。
 */

// resolve用来拼接绝对路径的方法
const { resolve } = require("path");
//<css> 提取css成单独文件 1/3
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//<css> 压缩插件optimize-css-assets-webpack-plugin 1/2
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 定义nodejs环境变量：决定使用browserslist的哪个环境
process.env.NODE_ENV = "production";

//<css> 复用loader，包含四个loader
const commonCssLoader = [
  //<css> 提取css成单独文件 取代style-loader 3/3
  //      同时拥有style-loader功能,将js中的样式资源插入进行，添加到head中生效
  MiniCssExtractPlugin.loader,

  //<css> 将css文件变成commonjs模块加载js中，里面内容是样式字符串
  "css-loader",

  /*<css>
      css兼容性处理：postcss --> postcss-loader postcss-preset-env

    帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式
  */
  {
    /* 还需要在package.json中定义browserslist
        "browserslist": {
        // 开发环境 --> 设置node环境变量：process.env.NODE_ENV = development
        "development": [
          "last 1 chrome version",
          "last 1 firefox version",
          "last 1 safari version"
        ],
        // 生产环境：默认是看生产环境
        "production": [
          ">0.2%",
          "not dead",
          "not op_mini all"
        ]
      }
  */
    // 使用loader的默认配置
    // 'postcss-loader',
    // 修改loader的配置
    loader: "postcss-loader",
    options: {
      ident: "postcss",
      plugins: () => [require("postcss-preset-env")()],
    },
  },
];

module.exports = {
  // webpack配置
  // *****1 入口起点*****
  entry: "./src/js/index.js",
  // *****2 输出文件名*****
  output: {
    filename: "js/built.js",
    path: resolve(__dirname, "build"),
  },
  // *****3 loader的配置*****
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [...commonCssLoader],
      },
      {
        test: /\.less$/,
        use: [
          ...commonCssLoader,
          // 将less文件编译成css文件
          "less-loader",
        ],
      },
      /*
        正常来讲，一个文件只能被一个loader处理。
        当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序：
          先执行eslint 在执行babel
      */
      {
        // 在package.json中eslintConfig --> airbnb
        test: /\.js$/,
        exclude: /node_modules/,
        // 优先执行
        enforce: "pre",
        loader: "eslint-loader",
        options: {
          fix: true,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                useBuiltIns: "usage",
                corejs: { version: 3 },
                targets: {
                  chrome: "60",
                  firefox: "50",
                },
              },
            ],
          ],
        },
      },
      {
        test: /\.(jpg|png|gif)/,
        loader: "url-loader",
        options: {
          limit: 8 * 1024,
          name: "[hash:10].[ext]",
          outputPath: "imgs",
          esModule: false,
        },
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        exclude: /\.(js|css|less|html|jpg|png|gif)/,
        loader: "file-loader",
        options: {
          outputPath: "media",
        },
      },
    ],
  },
  // *****4 插件的配置*****
  plugins: [
    //<css> 提取css成单独文件 2/3
    new MiniCssExtractPlugin({
      filename: "css/built.css",
    }),
    //<css> 压缩插件optimize-css-assets-webpack-plugin 2/2
    new OptimizeCssAssetsWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
  ],
  // *****5 模式*****
  mode: "production",
};
