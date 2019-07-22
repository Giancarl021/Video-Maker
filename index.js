const bots = {
    input: require('./bots/input.js'),
    text: require('./bots/text.js'),
    images: require('./bots/images')
};

async function init() {
    bots.input.main();
    await bots.text();
    await bots.images();
    console.dir(require('./bots/files').load(), {depth: null});
}

init();
