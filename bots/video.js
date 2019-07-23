const files = require('./files');
const gm = require('gm').subClass({imageMagick: true});

async function bot() {
    const data = files.load();
    console.log('> Editando imagens');
    // await editImages(data);
    console.log('> Imagens prontas');
    console.log('> Gerando imagens de frases');
    // await generateImagesFromSentences(data);
    console.log('> Imagens geradas');
    console.log('> Gerando Thumbnail');
    await createThumb(data);
    await renderVideo();
}

async function editImages(data) {
    for (let sentenceIndex = 0; sentenceIndex < data.sentences.length; sentenceIndex++) {
        await editImage(sentenceIndex);
    }

    async function editImage(sentenceIndex) {
        return new Promise((resolve, reject) => {
            const input = `data/images/${sentenceIndex}-original.png[0]`;
            const output = `data/images/${sentenceIndex}-edited.png`;
            const size = {
                width: 1920,
                height: 1080
            };
            gm() // magick ${input} ( -clone 0 -blur 0x15 -resize ${size.width}x${size.height}! ) ( -clone 0 -resize ${size.width}x${size.height} ) -delete 0 -gravity center -compose over -composite ${output}
                .in(input)
                .out('(')
                .out('-clone')
                .out('0')
                .out('-blur', '0x15')
                .out('-resize', `${size.width}x${size.height}!`)
                .out(')')
                .out('(')
                .out('-clone')
                .out('0')
                .out('-resize', `${size.width}x${size.height}`)
                .out(')')
                .out('-delete', '0')
                .out('-gravity', 'center')
                .out('-compose', 'over')
                .out('-composite')
                .write(output, err => {
                    if (err) return reject(err)
                });
            console.log(`> Imagem ${input} convertida`);
            resolve();
        });
    }
}

async function generateImagesFromSentences(data) {
    for (let i = 0; i < data.sentences.length; i++) {
        await generateTextImage(data.sentences[i], i);
    }

    async function generateTextImage(sentence, index) {
        return new Promise((resolve, reject) => {
            const output = `./data/images/${index}-sentence.png`;
            const sentenceTemplates = [
                {
                    size: '1920x400',
                    gravity: 'center'
                },
                {
                    size: '1920x1080',
                    gravity: 'center'
                },
                {
                    size: '800x1080',
                    gravity: 'west'
                },
                {
                    size: '800x1080',
                    gravity: 'east'
                }
            ];
            gm()
                .out('-background', 'transparent')
                .out('-fill', 'white')
                .out('-size', sentenceTemplates[index > 3 ? index - 4 : index].size)
                .out('-gravity', sentenceTemplates[index > 3 ? index - 4 : index].gravity)
                .out('-font', 'Calibri')
                .out('-fill', 'white')
                .out('-kerning', '-1')
                .out(`caption:${sentence.text}`)
                .write(output, err => {
                    if (err) return reject(err);
                });
            console.log('> Imagem X Gerada');
            resolve();
        });
    }

}

async function createThumb(data) {
    return new Promise((resolve, reject) => {
        const text = `${data.prefix} ${data.searchTerm}`;
        gm()
            .in('./data/images/0-edited.png')
            .out('-background', 'transparent')
            .out('-fill', 'white')
            .out('-size', '1920x500')
            .out('-gravity', 'center')
            .out('-font', 'Calibri')
            .out('-fill', 'white')
            .out('-kerning', '-1')
            .out('-stroke', 'black')
            .out('-strokewidth', '10')
            .out(`caption:${text}`)
            .out('-composite')
            .write('./data/images/thumb.jpg', err => {
                if(err) reject(err)
            });
        console.log('> Thumbnail Gerada');
        resolve();
    })
}

async function renderVideo() {

}

module.exports = bot;
