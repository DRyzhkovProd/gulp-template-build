// folders path
const source = './src';
const build = './build';

// project file's system path's
const config = {
    src: {
        root: source,
        sass: `${source}/scss`,
        js: `${source}/js`,
        fonts: `${source}/assets/fonts`,
        images: `${source}/assets/images`,
        iconsMono: `${source}/assets/icons/mono`,
        iconsMulti: `${source}/assets/icons/multi`,
        pug: `${source}/pug`,
    },

    dest: {
        root: build,
        html: build,
        css: `${build}/css`,
        js: `${build}/js`,
        fonts: `${build}/fonts`,
        images: `${build}/images`,
    },
}

