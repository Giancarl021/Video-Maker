const bots = {
    cleaner: require('./bots/cleaner'),
    input: require('./bots/input'),
    text: require('./bots/text'),
    image: require('./bots/image'),
    video: require('./bots/video'),
    youtube: require('./bots/youtube')
};

async function init() {
    bots.cleaner();
    bots.input.main();
    await bots.text();
    await bots.image();
    await bots.video();
    await bots.youtube();
}

init().catch(err => {
    console.log('Erro no programa: ', err);
});
