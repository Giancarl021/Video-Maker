const bots = {
    input: require('./bots/input'),
    text: require('./bots/text'),
    image: require('./bots/image'),
    video: require('./bots/video')
};

async function init() {
    // bots.input.main();
    // await bots.text();
    // await bots.image();
    await bots.video();
    // console.dir(require('./bots/files').load(), {depth: null});
}

init();
