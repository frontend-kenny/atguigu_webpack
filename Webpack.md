# WebPack配置
## 配置5个核心
* entry
* ouput
* loader
* plugins
* mode

    	const { resolve } = require('path');

		module.exports = {
			// 入口文件
		  entry: './index.js',
			// 输出文件
		  output: {       
		    filename: 'bundle.js',
		    path: resolve(__dirname, 'dist')
		  },
		  module: {
		    rules: [
		
		    ]
		  },
		  plugins: [],
		  mode: 'development'
		};



## loader配置

### CSS文件：
#### 安装指令
    npm i style-loader css-loader -D
#### 配置
    module: {
    	rules: [
    		{
    			test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
    		}
    	]
    }



### less文件：
#### 安装指令
    npm i less less-loader -D
#### 配置
    module: {
    	rules: [
    		{
    			test: /\.less$/,
				use: [ 'style-loader', 'css-loader', 'less-loader' ]
    		}
    	]
    }



### 样式中的图片资源
#### 安装指令
    npm i url-loader file-loader -D
#### 配置
    module: {
    	rules: [
    		{
    			test: /\.(jpg|png|gif)$/,
				// url-loader 依赖于 file-loader
				loader: 'url-loader',
				options: {
					// 小于 8kb的图片会被base64处理
					// 优点：减少请求数量（减轻服务器压力）
					// 缺点：图片体积会更大（文件请求速度更慢）
					limit: 8 * 1024,
					// url-loader 默认使用es6模块化解析，而 html-loader 引入图片是commonjs
					// 解析时会出问题： [object Module]
					// 解决： 关闭 url-loader的es6模块化，使用commonjs解析
					esModule: false,
					// [hash:10]取哈希值的前10位
					// [ext]取原文件拓展名
					name: '[hash:10].[ext]',
					outputPath: 'imgs'
				}
    		}
    	]
    }



### 样式中的其他资源：
#### 安装指令
    npm i file-loader -D
#### 配置
    module: {
    	rules: [
    		{
				// 将不需要打包的资源排除在外
    			exclude: /\.(html|js|css|less|jpg|png|gif)$/,
				loader: 'file-loader',
				options: {
					// [hash:10]取哈希值的前10位
					// [ext]取原文件拓展名
					name: '[hash:10].[ext]',
					// 输出到 media 文件下
					outputPath: 'media'
				}
    		}
    	]
    }



## 处理 html 文件中的img图片
##### 安装指令
    npm i html-loader -D
##### 配置 HtmlWebpackPlugin
	module: {
		rules: [
			{
				test: /\.html$/,
				loader: 'html-loader'
			}
		]
	}


### postcss-preset-env  (CSS兼容性处理)
#### 安装指令
    npm i postcss-loader postcss-preset-env -D
#### 配置
	module: {
    	rules: [
    		{
    			test: /\.css$/,
				use: [ 
					// MiniCssExtractPlugin将取代style-loader。作用：将js中的css样式提取出来
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: () => [
								// postcss的插件
								require('postcss-preset-env')()
							]
						}
					}
				]
    		}
    	]
    }
#### 修改 package.json 文件
	"browserslist": {
		// 开发环境 --> 设置 node 的环境变量： process.env.NODE_ENV = 'development'
		"development": [
			// 兼容最近的一个 chorome 版本
			"last 1 chrome version",
			"last 1 firefox version",
			"last 1 safari version"
		],
		// 生产环境 --> 设置 node 的环境变量： process.env.NODE_ENV = 'production'
		"production": [
			">0.2%",
			"not dead",
			"not op_mini all"
		]
	}
#### 设置环境变量
	process.env.NODE_ENV = 'development'



### babel-loader  (JS兼容性处理)
#### 安装指令
    npm i babel-loader @babel/core @babel/preset-env -D
#### 配置
    module: {
    	rules: [
    		{
				/*
					方法2 与方法3 只能二选一
					1、基本js兼容性处理 --> @babel/preset-env
						问题：只能转换基本语法，如promise等高级语法不能转换
					2、全部js兼容性处理 --> @babel/polyfill  --- （无需配置）
						(1)安装： `npm i @babel/polyfill -D`
						(2)引入： 原js代码中引入 import '@babel/polyfill'
						问题：我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积过大。
					3、需要做兼容性处理的就做：按需加载 --> core.js
						(1)安装： `npm i core-js -D`
						(2)配置： 将presets改成
						presets: [
							[
								'@babel/preset-env',
								{
									// 按需加载
									useBuiltIns: 'usage',
									// 指定 core-js 版本
									corejs: {
										version: 3
									},
									// 指定兼容性做到哪个版本浏览器
									target: {
										chrome:  '',
										firefox: '',
										ie: '',
										safari: '',
										edge: ''
									}
								}
							]
						]
					
				*/
				// 将不需要打包的资源排除在外
    			test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					// 预设： 指示 babel 做怎么样的兼容性处理
					presets: '@babel/preset-env'
				}
    		}
    	]
    }






## plugins配置


### HtmlWebpackPlugin  (创建HTML模板)
#### 安装指令
    npm i html-webpack-plugin -D
#### 引入
	const HtmlWebpackPlugin = require('html-webpack-plugin');

#### 配置
	plugins: [
		new HtmlWebpackPlugin(
			{
				// 复制一个模板 html 文件， 并且自动引入打包输出的所有资源
				template: './index.html',
				/*
				压缩html代码 production环境使用
				minify: {
					// 移除空格
					collapseWhitespace: true,
					// 移除注释
					removeComment: true
				}
				*/
			}
		)
	]



### MiniCssExtractPlugin  （单独提取出CSS文件）
#### 安装指令
	npm i mini-css-extract-plugin -D
#### 引入
	const MiniCssExtractPlugin = require('mini-css-extract-plugin');
#### 配置
	module: {
    	rules: [
    		{
    			test: /\.css$/,
				use: [ 
					// MiniCssExtractPlugin将取代style-loader。作用：将js中的css样式提取出来
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
    		}
    	]
    },
	plugins: [
		new MiniCssExtractPlugin(
			// 对输出的 css 文件进行重命名
			filename: 'css/bundle.css'
		)
	]



### OptimizeCssAssetsWebpackPlugin  (压缩CSS文件)
#### 安装指令
    npm i optimize-css-assets-webpack-plugin -D
#### 引入
	const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
#### 配置
	plugins: [
		new OptimizeCssAssetsWebpackPlugin()
	]











## 开发服务器   ---   (只会在内存中编译，不会有任何输出文件)
#### 启动指令
	npx webpack-dev-server
#### 安装指令
	npm i webpack-dev-server -D
#### 配置devServer
	devServer: {
		contentBase: resolve(__dirname, 'dist'),
		// 启动gzip压缩
		compress: true,
		// 端口号
		port: 3000,
		// 是否自动打开浏览器
		open: true,
			/*
			是否打开HMR（Hot Module Replacement）热模块替换 / 模块热替换
			作用：一个模块发生变化只会重新打包这个模块（而不是所有的模块）提升构建速度
			样式文件：可以使用HMR功能，因为style-loader内部实现了
			js文件：默认不能使用HMR功能 --> 需要修改js代码，添加支持HMR功能的代码
				注意：HMR功能对js的处理，只能处理非入口文件的其他文件。
			html文件：默认不能使用HMR功能，同时会导致问题，html文件不能热更新了。
				解决：修改entry入口，将html文件引入
			entry: ['./index.js', './index.html']
			*/
		hot: true
	}



## source-map   ---   (如果构建后代码出错，可以通过映射追踪源代码错误)
#### 启动指令
	npx webpack-dev-server
#### 配置devServer
	devtool: 'source-map'




	/*
	source-map：	一种提供源代码到构建后代码的映射技术
	[inline-|hidden-|eval][nosources-][cheap-[module-]]source-map
	
	
	source-map: 外部
		提示错误代码的准确信息 和 源代码的错误位置
	inline-source-map：内联
		只生成一个内联source-map
		提示错误代码的准确信息 和 源代码的错误位置
	hidden-source-map：外部
		提示代码错误原因，但是没有错误位置
		不能追踪源代码错误，只能提示到构建后代码的错误位置
	eval-source-map：内联
		每一个文件都生成对应的source-map，都在eval函数中
		提示错误代码的准确信息 和 源代码的错误位置
	nosources-source-map：外部
		提示错误代码的准确信息，但是没有任何源代码信息
	cheap-source-map：外部
		提示错误代码的准确信息 和 源代码的错误位置
		只能精确到源代码的行
	cheap-module-source-map：外部
		提示错误代码的准确信息 和 源代码的错误位置
		
	内联 和 外部 的区别： 1.外部生成了文件，内联是没有的。2.内联构建速度更快

	开发环境：速度快，调试更友好
		速度快（eval>inline>cheap>...）
		eval-cheap-source-map
		eval-source-map   ---   (脚手架默认选择)
		调试更友好
		source-map
		cheap-module-source-map
		cheap-source-map
		--> 建议选择eval-source-map / eval-cheap-module-source-map
	生产环境：源代码是否隐藏？调试要不要更友好
		内联会让代码体积更大，所以生产环境不用内联
		nosources-source-map   ---   全部隐藏
		hidden-source-map   ---   只隐藏源代码，会提示构建后代码错误信息

		--> 建议 source-map / cheap-module-source-map
	*/







## 复用loader
#### 
	const commonCssLoader = [
		MiniCssExtractPlugin.loader,
		'css-loader',
		{
			loader: 'postcss-loader',
			options: {
				ident: 'postcss',
				plugins: () => [require('postcss-preset-env')()]
			}
		}
	]

#### 配置
	module: {
	    	rules: [
	    		{
	    			test: /\.css$/,
					use: [...commonCssLoader]
	    		}
	    	]
	    }








# 生产环境优化
## 1、oneOf
### 作用   ---   oneOf能让文件只匹配一个loader。
* 通常来说每一种类型的文件要被所有的 loader 过一遍，oneOf能让文件只匹配一个loader。  
* 注意：一种文件被两种loader处理的时候要将其中一个loader到外面去。

	    module: {
    		rules: [
    			{
    				oneOf: [
    					{
    						test:/.css$/,
    						use: [ 'style-loader', 'css-loader' ]
    					}
    				]
    			}
    		]
    	}



## 2、缓存   ---   (babel缓存、文件资源缓存)
* 类似于开发环境中的HMR。  
### babel缓存  -->   让第二次打包构建速度更快
  
		module: {
    		rules: [
    			{
    				test: /\.js$/,
    				exclude: /node_modules/,
    				loader: 'babel-loader',
    				options: {
    					// 开启babel缓存
    					// 第二次构建时，会读取之前的缓存
    					cacheDirectory: true
    				}
    			}
    		]
    	}

### 文件资源缓存  -->   让代码上线运行缓存更好使用
* hash：每次webpack构建时会生成一个唯一的hash值。
	* 问题：因为js和css同时使用一个hash值。
		* 如果重新打包会导致所有缓存失效。（可能我只改动一个文件导致所有缓存失效）  


			    output: {
			       filename: 'bundle.[hash:10].js',
			    },
				plugins: [
					new MiniCssExtractPlugin(
						filename: 'css/bundle.[hash:10].css'
					)
				]
    	   

* chunkhash：根据chunk生成的hash值。如果打包来源于同一个chunk，那么hash值就一样。
	* 问题：js和css的hash值还是一样
		* 因为css是在js中被引入的，所以同属于一个chunk

				output: {
				   filename: 'bundle.[chunkhash:10].js',
				},
				plugins: [
					new MiniCssExtractPlugin(
						filename: 'css/bundle.[chunkhash:10].css'
					)
				]
* contenthash（推荐）：根据文件的内容生成hash值。不同文件hash值一定不一样

				output: {
				   filename: 'bundle.[contenthash:10].js',
				},
				plugins: [
					new MiniCssExtractPlugin(
						filename: 'css/bundle.[contenthash:10].css'
					)
				]



## 2、tree shaking
### 作用   ---   去除无用代码，减少代码体积
### 使用前提条件（满足条件自动开启功能）：
* 使用ES6模块化
* 开启production环境
### 配置
* 在package.json中配置

    	// 所有代码都没有副作用（都可以进行tree shaking）
		//	问题：可能会把css / @babel/polyfill （副作用）文件干掉
    	"sideEffects": false
		// 推荐以下写法，将 样式文件 或者 @babel/polyfill 排除，以免被tree shaking被干掉
		"sideEffects": ["*.css", "*.less"]



## 3、code split   ---   代码分割
### 作用：将一个文件分割成多个文件，实现并行加载或者按需加载。

### 做法一（多入口）：
		  // 入口文件
		  entry: {
				index: './index.js',
				test: './test.js'
			},
		  // 输出文件
		  output: {
			[name]：提取文件名
		    filename: '[name].[contenthash:10].js',
		    path: resolve(__dirname, 'dist')
		  }

### 做法二（单入口）：
		  // 入口文件
		  entry: './index.js',
			// 输出文件
		  output: {       
		    filename: '[name].[contenthash:10].js',
		    path: resolve(__dirname, 'dist')
		  },
		  /*
		  	1、可以将node_modules中代码单独打包一个chunk最终输出。
		    2、自动分析多入口chunk中，有没有公共的文件（有大小要求，至少要有几十kb）。如果有会打包成单独的一个chunk。
		  
		  */
		  // 入口文件
		  entry: {
				index: './index.js',
				test: './test.js'
			},
			// 输出文件
		  output: {       
		    filename: '[name].[contenthash:10].js',
		    path: resolve(__dirname, 'dist')
		  },
		  optimization: {
			splitChunks: {
				chunks: 'all'
			}	
		  }


###做法三（路由懒加载等用法）：
    /*
    通过js代码，让某个文件被单独打包成一个chunk
    import动态导入语法：能将某个文件单独打包
    */
	/* webpackChunkName: 'test' */将打包的名字设定为固定的名字
    import(/* webpackChunkName: 'test' */'./test')
    	.then() => {
    		// Do something
    	}


## 4、懒加载 / 预加载（兼容性不好）





## 5、PWA（离线可访问技术）




## 6、多进程打包
### 安装
	npm i thread-loader -D
### 配置
	module: {
    	rules: [
    		{
    			test: /\.js$/,
				exclude: /node_modules/,
				use: [
					/*
						开启多进程打包。
						进程启动时间大概600ms，进程通信也有开销。
						只有工作消耗时间比较长，才需要多进程打包
					*/
					{
						loader: 'thread-loader',
						options: {
							workers: 2	// 2个进程
						}
					},
					{
						loader: 'babel-loader',
						options: {
							presets: [
								[
									'@babel/preset-env',
									{
									// 按需加载
									useBuiltIns: 'usage',
									// 指定 core-js 版本
									corejs: {
										version: 3
									},
									// 指定兼容性做到哪个版本浏览器
									target: {
										chrome:  '',
										firefox: '',
										ie: '',
										safari: '',
										edge: ''
									}
								}
							]
						]
						}
					}
				]
    		}
    	]
    }




## 7、externals	  ---   彻底不打包，第三方库使用CDN引入

###配置
	mode: 'production',
	externals: {
		// 忽略库名 -- npm包名
		jquery: 'jQuery'
	}

打包完成后再html文件内引入CDN资源


## 8、DLL（动态连接库）   ---    打包一次,将第三方库打包整合在一起
与externals类似，指示webpack哪些文件是不参与打包的。
### 作用：对代码进行单独打包
### 命令(一般打包一次即可，不需要重复打包)
	webpack --config webpack.dll.js
### webpack.dll.js配置
	/*
	使用dll技术，对某些库（第三方库：jQuery、react、Vue...）进行单独打包
		当你运行webpack时，默认查找 webpack.config.js 配置文件
		需求：需要运行 webpack.dll.js 文件
			-->webpack --config webpack.dll.js
	*/
	
	const { resolve } = require('path');
	const webpack = require('webpack');
	module.exports = {
		entry: {
			// 最终打包生成的[name] --> jQuery
			// ['jQuery'] --> 要打包的库是jquery
			jquery: ['jQuery']
		},
		output: {
			filename: '[name].js',
			path: resolve(__dirname, 'dll'),
			library: '[name]_[hash]',	// 打包的库里面向外暴露出去的内容叫什么名字
		},
		plugins: [
			// 打包生成一个 manifest.json --> 提供和jquery映射
			new webpack.DllPlugin({
				name: '[name]_[hash]',	// 映射库的暴露的内容名称
				path: resolve(__dirname, 'dll/manifest.json')	// 输出文件路径
			})
		],
		mode: 'production'
	}
### webpack.config.js配置
	const webpack = require('webpack');
	
	plugins: [
		// 告诉webpack那些库不参与打包，同时使用时的名称也得变
		new webpack.DllReferencePlugin({
			manifest: resolve(__dirname, 'dll/manifest.json')
		})
	]

### 安装插件
	npm i add-asset-html-webpack-plugin -D
## webpack.config.js配置
	const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
	
	plugins: [
		// 将某个文件打包输出去，并在html中自动引入资源
		new AddAssetHtmlWebpackPlugin({
			filePath: resolve(__dirname, 'dll/jquery.js');
		})
	]






## 开发环境性能优化
* 优化打包构建速度
	* HMR
* 优化代码调试
	* source-map

## 生产环境性能优化
* 优化打包构建速度
	* oneOf
	* babel缓存
	* 多进程打包
	* externals
	* dll
* 优化代码运行的性能
	* 缓存（hash-chunkhash-contenthash）
	* tree shaking（mode: 'production'时默认开启）
	* code split（异步执行就会懒加载）
	* 懒加载 / 预加载（兼容性差）
	* PWA（兼容性差）
	



## 详细配置

	const { resolve } = require('path');
	const TerSerWebpackPlugin = require('terser-webpack-plugin');
	
	module.exports = {
		entry: './index.js',
		output: {
			// 文件名称（指定名称+目录）
			filename: 'js/[name].[contenthash:10].js',
			path: resolve(__dirname, 'dist'),
			// 所有资源引入公共路径前缀 --> 'imgs/a.jpg'  --> 'imgs/a.jpg'
			publicPath: '/',
			// 非入口chunk名称
			chunkFilename: 'js/[name]_chunk.js',
			library: '[name]',	// 整个库向外暴露的变量名(一般不用)
			//libraryTarget: 'window',	// 变量名称添加到哪个上  browser
			//libraryTarget: 'global',	// 变量名添加到哪个上 node
			libraryTarget: 'commonjs',
			chunkFilename: 'js/[name]_[contenthash:10]_chunk.js'
	
		},
		module: {},
		plugins: [],
		mode: 'production',
		resolve: {
			// 配置解析模块路径别名：优点简写路径 缺点路径没提示
			alias: {
				$css: resolve(__dirname, 'src/css')
			}
		},
		// 配置省略文件路径的后缀名
		extensions: ['.js', '.jsx', 'json'],
		// 告诉 webpack 解析模块是去哪个目录下寻找
		modules: [resolve(__dirname, './node_modules'), 'node_modules'],
		devServer: {
			// 运行代码的目录
			contentBase: resolve(__dirname, 'build'),
			// 监视 contentBase 目录下的所有文件，一旦文件变化就会reload
			watchContentBase: true,
			watchOptions: {
				// 忽略文件
				ignored: /node_modules/
			},
			// 启动 gzip 压缩
			compress: true,
			// 端口号
			port: 3000,
			// 域名
			host: 'localhost',
			// 自动打开浏览器
			open: true,
			// 开启HMR功能
			hot: true,
			// 不要显示启动服务器日志信息
			clientLogLevel: 'none',
			// 除了一些基本启动信息意外，其他内容都不要显示
			quiet: true,
			// 如果出错了，不要全屏提示
			overlay: false,
			// 服务器代理 --> 解决开发环境跨域问题
			proxy: {
				// 一旦devServer（5000）服务器接收到 /api/xxx 的请求，就会把请求转发到另外一个服务器（3000）
				'/api': {
					target: 'http://localhost:3000',
					// 发送请求时，请求路径重写：将/api/xxx --> /xxx（去掉/api）
					pathRewrite: {
						'^/api': ''
					}
				}
			}
		},
		// optimization 生产环境才有意义
		optimization: {
			splitChunks: {
				chunks: 'all',
				/*
				下面都是默认值，可以不改
				minSize: 30 * 1024,	// 分割的 chunk 最小为30kb
				maxSize: 0,	// 最大没有限制
				minChunks: 1,	// 要提取的chunks最少被引用1次
				maxAsyncRequests: 5,	// 按需加载时并行加载的文件的最大数量
				maxInitialRequests: 3,	// 入口js文件最大并行请求数量
				automaticNameDelimiter: '~',	// 名称连接符
				name: true,	//可以使用命名规则
				cacheGroups: {	//	 分割chunk的组
					vendors: {
						// node_modules 文件会被打包到 vendors 组的 chunk 中。 --> vendors~xxx.js
						// 满足上面的公共规则，如大小超过30kb， 至少被引用一次。
						test: /[\\/]node_modules[\\/]/,
						// 优先级
						priority: -10
					},
					default: {
						// 要提取的 chunk 最少被引用2次
						minChunks: 2,
						// 优先级
						priority: -20,
						// 如果当前要打包的模块，和之前已经被提取的模块是同一个，就会复用，而不是重新打包模块
						reuseExistingChunk: true
					}
				}
				*/
			},
			// 将当前模块保存的其他模块的 hash 值记录单独打包为一个文件 runtime
			// 问题：修改a文件导致b文件的contenthash变化导致两个文件都重新打包了。
			// 解决：将contenthash值提取出来保存在 runtime 里
			runtimeChunk: {
				name: entrypoint => `runtime-${entrypoint.name}`
			},
			minimizer: {
				/*  安装npm i terser-webpack-plugin -D
					配置生产环境的压缩方案： js和css
				*/
				new TerserWebpackPlugin({
					// 开启缓存
					cache: true,
					// 开启多进程打包
					parallel: true,
					// 启动 source-map
					source-map: true
				})
			}
		}
	}
