const bots = {
    input: require('./bots/input.js'),
    text: require('./bots/text.js')
};

async function init() {
    bots.input.main();
    await bots.text();
    console.log(require('./bots/files').load());
}

init();
