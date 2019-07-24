const bots = {
    input: require('./bots/input'),
    text: require('./bots/text'),
    image: require('./bots/image'),
    video: require('./bots/video'),
    cleaner: require('./bots/cleaner')
};

async function init() {
    bots.cleaner();
    bots.input.main();
    await bots.text();
    await bots.image();
    await bots.video();
}

init().catch(err => {
    console.log('Erro no programa: ', err);
});
