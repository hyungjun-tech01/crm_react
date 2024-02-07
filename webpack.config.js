const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const publicPath = '/template/';
// const publicPath = '/';
const opn = require('opn'); // Import the 'opn' package

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "src", "index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    // publicPath: publicPath, // base path where referenced files will be look for
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public/"),
    },
    port: 3001,
    historyApiFallback: true,
    open: true, // Automatically open the browser
    onAfterSetupMiddleware() {
      // Open the browser after the dev server is up and running
      // const open = require('open');
      opn(`http://localhost:${this.port}`);
      // opn(`http://localhost:${this.port}/template3/`);
    },  
  },

  externals: {
    // global app config object
    config: JSON.stringify({
      apiUrl: '',
      publicPath: '/template/'
      // publicPath: '/react/template/'

    })
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      Assets: path.resolve(__dirname, 'src/assets/'),
    },
    fallback: {
      "process": require.resolve("process/browser")
    }

  },

  module: {
    rules: [
      { // config for es6 jsx
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      { // config for sass compilation
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          {
            loader: "sass-loader"
          }
        ]
      },
      //  {
      //    test: /\.(png|jpg|gif)$/i,
      //    use: [
      //      {
      //        loader: 'url-loader',
      //        options: {
      //          limit: 8192,
      //        },
      //      },
      //    ],
      //  },

      /////--------------------------------------

      //  {
      //      test: /\.(woff|woff2|eot|ttf|svg)$/,
      //      loader: 'url-loader?limit=100000'
      //   },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|otf|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'assets/img/[name].[ext]'
            }
          }
        ]
      }
      //  { // config for fonts
      //    test: /\.(woff|woff2|eot|ttf|otf)$/,
      //   use: [
      //      {
      //        loader: 'file-loader',
      //        options: {
      //          outputPath: 'fonts',
      //       }
      //     }
      //    ],
      //  }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
      filename: "./index.html",
      // favicon: './public/favicon.ico'
    }),
    new MiniCssExtractPlugin({ // plugin for controlling how compiled css will be outputted and named
      filename: "css/[name].css",
      chunkFilename: "css/[id].css"
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["css/*.*", "js/*.*", "fonts/*.*", "images/*.*"]
    }),
    new webpack.ProvidePlugin({ //To automatically load jquery
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ],

}