const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");


const generateHTMLPlugins = () =>

  glob.sync('./src/templates/**/*.twig')
    .filter(item => !item.includes('base'))
    .filter(item => !item.includes('menu'))
    .filter(item => !item.includes('topnavbar'))
    .map(dir => {
      let folder = path.normalize(path.dirname(dir)).split(path.sep).pop().replace('templates', '.')
      let filename = path.basename(dir).replace('.twig', '.html')
      return new HtmlWebpackPlugin({
        filename: folder + '/' + filename, // Output
        template: dir, // Input
      })
  })

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    theme: ['./src/js/theme-init.js', './src/sass/index.scss'],
  },
  optimization: {
    removeEmptyChunks: true,
  },
  output: {
    clean: true,
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../', 'build'),

  },
  devServer: {
    open: true,
    static: path.resolve(__dirname, '../', 'build/'),
    port: 5001
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.txt$/,
        use: 'raw-loader'
      },
      {
        test: /\.(c|sa|sc)ss$/,
          use: [
            {loader: MiniCssExtractPlugin.loader},
            {loader: "css-loader"},
            {loader: "sass-loader"}
          ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
        },
      {
        test:/\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            ["@babel/preset-env", { useBuiltIns: 'usage', corejs: "2.0.0" }]
          ],
          plugins: [
            "@babel/plugin-proposal-class-properties"
          ]
        }
      },
      {
        test:/\.twig$/,
        use: [
          'raw-loader',
          {
            loader: 'twig-html-loader',
            options: {
              namespaces: {
                'components': path.join(__dirname, './src/templates/components'),
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
      ...generateHTMLPlugins(),
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    }),
    new CopyPlugin({
      patterns: [
        { from: path.join(__dirname, '../src/img'), to: 'images'},
        { from: path.join(__dirname, '../src/js/prism.js'), to: 'js'},
        { from: path.join(__dirname, '../src/js/docs.js'), to: 'js'},
        { from: path.join(__dirname, '../src/js/scrollspy.js'), to: 'js'},
        { from: path.join(__dirname, '../src/css'), to: 'css'},
        { from: path.join(__dirname, '../src/json'), to: 'json'},
      ],
    })
    // new CleanWebpackPlugin()
  ],

}
