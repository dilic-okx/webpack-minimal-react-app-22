const path = require('path')
//const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.tsx',
  stats: 'minimal',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[name][ext]'
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    historyApiFallback: {
      disableDotRule: true,
      index: '/'
    },
    hot: true,
    //quiet: true,
    open: true,
    compress: true,
    port: 9001
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'src/assets', to: 'dist' }]
    }),
    new HtmlWebpackPlugin({
      title: 'minimal react 22',
      template: path.resolve(__dirname, 'public/index.html'),
      favicon: path.resolve(__dirname, 'public/favicon.ico'),
      inject: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|dist)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif|ico|woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource'
      } /*,
			{
				test: /\.(csv|tsv)$/,
				use: ['csv-loader']
			},
			{
				test: /\.xml$/,
				use: ['xml-loader']
			},
			{
				test: /\.(glsl|vert|frag)$/,
				use: ['glsl-template-loader']
			}*/
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      fs: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      stream: false,
      crypto: false
    }
  }
}
