const Algorithmia = require('algorithmia');
const AlgorithmiaApiKey = require('../credentials/algorithmia.json');

const SentenceBoundaryDetection = require('sbd');

const input = require('./input');

const watsonApiKey = require('../credentials/watson-nlu').apikey;
const WatsonNLU = require('ibm-watson/natural-language-understanding/v1.js');
const nlu = new WatsonNLU({
    iam_apikey: watsonApiKey,
    version: '2018-04-05',
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

const files = require('./files');

async function bot() {
    const data = files.load();
    console.log('> Pesquisando artigos na Wikipedia');
    await getTextFromWikipedia(data);
    console.log('> Preparando artigo');
    sanitizeText(data);
    breakTextIntoSentences(data);
    limitMaxSentences(data);
    console.log('> Gerando palavras-chave');
    await getKeyWords(data);
    files.save(data);
}

async function getTextFromWikipedia(data) {
    const auth = Algorithmia(AlgorithmiaApiKey.ApiKey);
    const wikipedia = auth.algo('web/WikipediaParser/0.1.2');
    const articles = await selectArticle();
    const selectedArticle = input.selectArticle(articles);

    data.sourceContent = {};

    const article = await wikipedia.pipe({
        articleName: selectedArticle,
        lang: 'pt'
    });

    data.sourceContent.original = article.result.content;

    async function selectArticle() {
        const searchList = await wikipedia.pipe({
            search: data.searchTerm,
            lang: 'pt'
        });
        return searchList.result;
    }
}

function sanitizeText(data) {
    const cleanedText = removeBlankLinesAndMarkdown(data.sourceContent.original);
    // noinspection UnnecessaryLocalVariableJS
    const filteredText = removeDatesInParenthesis(cleanedText);

    data.sourceContent.filtered = filteredText;

    function removeBlankLinesAndMarkdown(text) {
        const lines = text.split('\n');
        const filter = lines.filter(e => e.trim() !== '' && !e.startsWith('=='));
        return filter.join(' ');
    }

    function removeDatesInParenthesis(text) {
        return text.replace(/\(\d{4}\)/g, '').replace(/\([\s\S]+,\s\d{2}\sde\s(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\sde\s\d{4}\)/g, '');
    }

}

function breakTextIntoSentences(data) {
    data.sentences = getSentences(data.sourceContent.filtered);

    function getSentences(text) {
        const phrases = SentenceBoundaryDetection.sentences(text);
        const sentences = [];

        phrases.forEach(e => {
            sentences.push({
                text: e,
                keywords: [],
                images: []
            });
        });

        return sentences;
    }
}

function limitMaxSentences(data) {
    data.sentences = data.sentences.slice(0, data.maximumSentences);
}

async function getKeyWords(data) {

    for (const sentence of data.sentences) {
        sentence.keywords = await returnKeywordsFromWatson(sentence.text);
    }

    async function returnKeywordsFromWatson(sentence) {
        const promise = new Promise((resolve, reject) => {
            nlu.analyze({
                text: sentence,
                features: {
                    keywords: {}
                },
                language: 'pt'
            }, (err, res) => {
                if (err) reject(err);
                const keywords = res.keywords
                    .sort((a, b) => {
                        if (a.relevance < b.relevance) return 1;
                        if (a.relevance > b.relevance) return -1;
                        return 0;
                    })
                    .map(e => e.text);
                resolve(keywords);
            })
        });

        promise.catch((err) => {
            console.log(err);
            console.log('> Erro ao carregar palavras-chave');
            process.exit(0);
        });

        return promise;
    }
}

module.exports = bot;
