const files = require('./files');
const googleCredentials = require('../credentials/google-custom-search');
const googleSearch = require('googleapis').google.customsearch('v1');
const imgDownloader = require('image-downloader');

async function bot() {
    const data = files.load();
    console.log('> Buscando imagens');
    await getImages(data);
    console.log('> Baixando imagens');
    await downloadImages(data);
    files.save(data);
}

async function getImages(data) {
    for (const sentence of data.sentences) {
        sentence.keywords.filter(e => e !== data.searchTerm);
        let query;
        if (sentence.length === 0) {
            query = data.searchTerm;
        } else {
            query = data.searchTerm + ' ' + sentence.keywords[0];
        }
        sentence.images = await returnImageLinks(query);
        sentence.googleQuery = query;
    }
}

async function returnImageLinks(query) {
    const response = await googleSearch.cse.list({
        auth: googleCredentials.APIKey,
        cx: googleCredentials.SerachEngineAPIKey,
        q: query,
        num: 5,
        searchType: 'image',
        imgSize: 'huge',
        safe: 'high'
    });

    if(!response.data.items) {
        console.log('> Erro ao carregar imagens');
        process.exit(0);
    }

    return response.data.items.map(e => {
        return {url: e.link, context: e.image.contextLink}
    });
}

async function downloadImages(data) {
    data.downloadedImages = [];

    for (let sentenceIndex = 0; sentenceIndex < data.sentences.length; sentenceIndex++) {
        const images = data.sentences[sentenceIndex].images.map(e => e.url);

        for (let imgIndex = 0; imgIndex < images.length; imgIndex++) {
            try {
                if (data.downloadedImages.includes(images[imgIndex])) {
                    throw new Error('Imagem já carregada');
                }
                await downloadAndSaveImage(images[imgIndex], `${sentenceIndex}-original.png`);
                console.log(`>> Imagem carregada: ${images[imgIndex]}`);
                data.downloadedImages.push(images[imgIndex]);
                break;
            } catch (err) {
                console.log(`> Erro ao carregar imagem: ${err.toString().substr(7, err.length)}`);
            }
        }
    }

    async function downloadAndSaveImage(url, filename) {
        return await imgDownloader.image({
            url: url,
            dest: `./data/images/${filename}`
        });
    }
}

module.exports = bot;
