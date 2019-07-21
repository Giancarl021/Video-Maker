const bots = {
    input: require('./bots/input.js'),
    text: require('./bots/text.js')
};

function init() {
    const data = bots.input();
    bots.text(data);
}

init();
