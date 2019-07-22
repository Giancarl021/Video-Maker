const bots = {
    input: require('./bots/input.js'),
    text: require('./bots/text.js')
};

async function init() {
    const data = bots.input.main();
    data.maximumSenteces = 8;
    await bots.text(data);
    console.log(data);
}

init();
