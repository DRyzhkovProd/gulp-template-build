const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const fileInclude = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const plumber = require('gulp-plumber');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;
const del = require('del');


// folders
const source = './src';
const build = './build';

const pathImages = [`${source}/img/**.jpg`, `${source}/img/**.png`, `${source}/img/**.jpeg`]

const styles = () => {
    return src(`${source}/scss/**/*.scss`)
        .pipe(sourcemaps.init())
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }))
        .pipe(plumber(notify.onError({
            title: "Styles",
            message: "Error: <%= error.message %>"
            })))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(dest(`${build}/css/`))
        .pipe(browserSync.stream())
}

const htmlInclude = () => {
    return src([`${source}/index.html`])
        .pipe(fileInclude({
            prefix: '@',
            basepath:'@file'
        }))
        .pipe(dest(`${build}`))
        .pipe(browserSync.stream())
}

const scriptsLoader = () => {
    return src(`${source}/js/main.js`)
        .pipe(webpackStream({
            output: {
                filename: 'main.js'
            },
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['@babel/preset-env', { targets: "defaults" }]
                                ]
                            }
                        }
                    }
                ]
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(uglify().pipe(plumber(notify.onError({
            title: "JS",
            message: "Error: <%= error.message %>"
        }))))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./build/js'))
        .pipe(browserSync.stream())
}

const imgToBuild = () => {
    return src(pathImages)
        .pipe(dest(`${build}/img`))
}

const assetsToBuild = () => {
    return src(`${source}/assets/**`)
        .pipe(dest(`${build}/assets`))
}

const fonts = () => {
  src(`${source}/fonts/**.ttf`)
      .pipe(ttf2woff())
      .pipe(dest(`${build}/fonts`))
    return src(`${source}/fonts/**.ttf`)
        .pipe(ttf2woff2())
        .pipe(dest(`${build}/fonts`))
}

const svgToSprites = () => {
  return src(`${source}/img/**.svg`)
      .pipe(svgSprite({
          mode: {
              stack: {
                  sprite: "../sprite.svg"
              }
          },
      }))
      .pipe(dest(`${build}/img`))
}

const cleaner = () => del([`${build}/*`]);

const watcher = () => {
    browserSync.init({
        server: {
            baseDir: `${build}`
        }
    })

    watch(`${source}/scss/**/*.scss`, styles);
    watch(`${source}/index.html`, htmlInclude);
    watch(pathImages, imgToBuild);
    watch(`${source}/img/**.svg`, svgToSprites);
    watch(`${source}/assets/**`, assetsToBuild);
    watch(`${source}/js/**/*.js`, scriptsLoader);
}

exports.default = series(cleaner, parallel(htmlInclude, scriptsLoader, fonts, imgToBuild, svgToSprites, assetsToBuild), styles, watcher)