const bots = {
    input: require('./bots/input.js'),
    text: require('./bots/text.js')
};

async function init() {
    const data = bots.input.main();
    await bots.text(data);
    console.log(data);
}

init();
