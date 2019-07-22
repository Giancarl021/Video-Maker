const files = require('./files');
const googleCredentials = require('../credentials/google-custom-search');
const googleSearch = require('googleapis').google.customsearch('v1');

async function bot() {
    const data = files.load();
    await getImages(data);
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
        num: 2,
        searchType: 'image',
        imgSize: 'huge'
    });

    return response.data.items.map(e => {
        return {url: e.link, context: e.image.contextLink}
    });
}

module.exports = bot;
