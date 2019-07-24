const files = require('./files');
const gm = require('gm').subClass({imageMagick: true});

const videoshow = require('videoshow');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

async function bot() {
    const data = files.load();
    console.log('> Editando imagens');
    await editImages(data);
    console.log('> Gerando imagens com sentenças');
    await generateImagesFromSentences(data);
    console.log('> Gerando Thumbnail');
    await createThumb(data);
    console.log('> Renderizando vídeo');
    await renderVideo(data);
    console.log('> Renderização Concluída');
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
                    if (err) return reject(err);
                    return resolve();
                });
            console.log(`>> Imagem ${sentenceIndex + 1} editada`);
        });
    }
}

async function generateImagesFromSentences(data) {
    for (let i = 0; i < data.sentences.length; i++) {
        await generateTextImage(data.sentences[i], i);
        console.log(`>> Imagem ${i + 1} gerada`);
    }

    async function generateTextImage(sentence, index) {
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

        const templateIndex = index > 3 ? index - 4 : index;

        return new Promise((resolve, reject) => {
            gm()
                .in(`./data/images/${index}-edited.png`)
                .out('-brightness-contrast', '-30x-10')
                .out('-background', 'transparent')
                .out('-fill', 'white')
                .out('-size', sentenceTemplates[templateIndex].size)
                .out('-gravity', sentenceTemplates[templateIndex].gravity)
                .out('-font', 'Calibri')
                .out('-fill', 'white')
                .out('-kerning', '-1')
                .out(`caption:${sentence.text}`)
                .out('-composite')
                .write(output, err => {
                    if (err) return reject(err);
                    return resolve();
                });

        });
    }
}

async function createThumb(data) {
    const response = new Promise((resolve, reject) => {
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
                if (err) return reject(err);
                return resolve();
            });
    });

    response.catch(() => {
        console.log('> Erro ao gerar thumbnail');
    });

    return response;
}

async function renderVideo(data) {
    const images = [];
    const audioData = files.loadAudioData();
    const audio = audioData[Math.floor(Math.random() * audioData.length)];
    const options = {
        fps: 25,
        loop: 5,
        transition: true,
        transitionDuration: 0.5,
        videoBitrate: 4000,
        videoCodec: "libx264",
        size: "?x1080",
        audioBitrate: "128k",
        audioChannels: 2,
        format: "mp4",
        pixelFormat: "yuv420p",
    };

    data.musicFont = audio.credits;
    files.save(data);

    loadImages(images);

    return new Promise((resolve, reject) => {
        videoshow(images, options)
            .audio(audio.path)
            .save('data/render.mp4')
            .on('error', err => {
                console.log('> Erro ao renderizar vídeo: ', err);
                reject(err);
            })
            .on('end', () => {
                resolve();
            });
    });

    function loadImages(images) {
        images.push({
            path: './data/images/static/start.png',
            loop: audio.timeData.start
        });

        for (let sentenceIndex = 0; sentenceIndex < data.sentences.length; sentenceIndex++) {
            images.push({
                path: `./data/images/${sentenceIndex}-edited.png`,
                loop: audio.timeData.images[sentenceIndex]
            });
            images.push({
                path: `./data/images/${sentenceIndex}-sentence.png`,
                loop: audio.timeData.sentences[sentenceIndex]
            });
        }

        images.push({
            path: './data/images/static/end.png',
            loop: 20
        });
    }
}

module.exports = bot;
