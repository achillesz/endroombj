var webpack = require('webpack');

var AUTOPREFIXER_BROWSERS = ['Android 2.3', 'Android >= 4', 'Chrome >= 35', 'Firefox >= 31', 'Explorer >= 9', 'iOS >= 7', 'Opera >= 12', 'Safari >= 7.1', ];

module.exports = function(grunt) {
    'use strict';

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    RegExp.quote = function(string) {
        return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    //====webpack begin
    var uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    });

    var slarkPlugin = new webpack.optimize.CommonsChunkPlugin('base', 'base.js');

    var devFlagPlugin = new webpack.DefinePlugin({
        __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
    });
    //===== webpack end

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Metadata.
        meta: {
            srcPath   : 'src/',
            distPath  : 'dist/',
            libPath   : 'lib/'
        },

        banner: '/*!\n' + 
                ' * =====================================================\n' +
                ' * <%= pkg.name %> v<%= pkg.version %>\n' +
                ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                ' *\n' + 
                ' * v<%= pkg.version %> designed by @elong.\n' +
                ' * =====================================================\n' +
                ' */\n',

        clean: {
            dist: ['<%= meta.distPath %>']
        },

        // sass编译成css任务
        sass: {
            options: {
                // banner: '<%= banner %>',
                sourceMap: false,
                style: 'expanded',
                unixNewlines: true
            },
            usecase: {
                files: [{
                    expand: true,
                    cwd: '<%= meta.srcPath%>sass/page',
                    src: '**/main.scss',
                    dest: '<%= meta.distPath %>usecase/',
                    rename: function (dest, src) {
                        return dest + src.replace('main.scss', 'usecase.css');
                     }
                }]
            },
        },

        // css压缩任务
        cssmin: {
            options: {
                banner: '',
                // set to empty; see bellow
                keepSpecialComments: '*',
                // set to '*' because we already add the banner in sass
                compatibility: 'ie8',
                noAdvanced: true
            },
            usecase: {
                files: [{
                    expand: true,
                    cwd: '<%= meta.distPath%>usecase/',
                    src: '**/*.css',
                    dest: '<%= meta.distPath %>usecase/',
            /*        ext: '.min.css',
                    extDot: 'first'*/

                }]
            }
        },

        // 监听资源改动自动执行任务
        watch: {
            usecase: {
                files: ['<%= meta.srcPath %>**/*.*'],
                // tasks: ['sass']
                tasks: ['usecase']
            }
        },

        // js语法检查
        jshint: {
            options: {
                // jshintrc: 'js/.jshintrc'
                '-W033': true,
                '-W014': true,
                '-W030': true,
                '-W032': true,
                '-W069': true,
                '-W061': true,
                '-W103': true,
                //__proto__
            },
            grunt: {
                src: ['Gruntfile.js', 'grunt/*.js']
            },
            usecase: {
                src: ['src/js/**/*.js']
            }
        },

        // 本地server连接任务
        connect: {
            server: {
                options: {
                    port: 3000,
                    base: ''
                }
            }
        },

        // copy 图片任务
        copy:{
            images: {
                files: [
                  {expand: true, cwd: 'src/img/',src: ['**'], dest: 'dist/usecase/img/'},
                ]
            }
        },

        // server默认打开页面
        open: {
            kitchen: {
                path: 'http://localhost:3000/view/temp01/index.html'
            }
        },

        // webpack模块加载
        webpack: {
            saletemplate: {
                entry: {
                    base: ['./lib/zepto.js','./lib/fastclick.js'],
                    "index/usecase": './src/js/page/index/page.js'
                },
                output: {
                    path: '<%= meta.distPath %>/usecase/',
                    // 图片和 JS 会到这里来
                    // publicPath:"/dist/hotel/",
                    filename: '[name].js'
                },
                module: {
                    loaders: [
                    // {test: /lib\/zepto\.js$/, loader: "expose?$!expose?jQuery"},
                    {
                        test: /\.scss$/,
                        loader: 'style-loader!css-loader?minimize!sass-loader'
                    },
                    {
                        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                        loader: 'url?limit=10000&minetype=application/font-woff'
                    },
                    {
                        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                        loader: 'url?limit=10000&minetype=application/font-woff'
                    },
                    {
                        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                        loader: 'url?limit=10000&minetype=application/octet-stream'
                    },
                    {
                        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                        loader: 'file'
                    },
                    {
                        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                        loader: 'url?limit=10000&minetype=image/svg+xml'
                    },
                    {
                        test: /\.mustache$/,
                        loader: 'mustache'
                    },
                   /* {
                        test: /.js$/,
                        loader: 'babel',
                        exclude: /(node_modules|src)/,
                        query: {
                            presets: ['es2015']
                        }
                    }*/
                    // {test: /\.(gif|png|jpg)$/,loader: 'url?limit=25000&name=[path][name].[ext]?[hash:6]'},
                    ]
                },
                plugins: [
                    uglifyJsPlugin,
                    devFlagPlugin, 
                    slarkPlugin
                ],
                stats: {
                    // Configure the console output
                    colors: false,
                    modules: false,
                    reasons: true
                },
                storeStatsTo: "xyz",
                // writes the status to a variable named xyz
                progress: false,
                // Don't show progress
                failOnError: false,
                // don't report error to grunt if webpack find errors
                inline: true,
                // embed the webpack-dev-server runtime into the bundle
            }
        }
    });

    // Load the plugins
    require('load-grunt-tasks')(grunt, {
        scope: 'devDependencies'
    });
    require('time-grunt')(grunt);



    // server
    grunt.registerTask('server', 'Run server', ['connect', 'watch']);

    grunt.registerTask('usecase', ['sass:usecase', 'cssmin:usecase', 'webpack']);

    grunt.registerTask('default', ['usecase', 'server']);

};