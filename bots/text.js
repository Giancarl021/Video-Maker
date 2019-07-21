const Algorithmia = require('algorithmia');
const AlgorithmiaApiKey = require('../credentials/algorithmia.json');
const SentenceBoundaryDetection = require('sbd');
const input = require('./input');

async function bot(data) {
    await getTextFromWikipedia(data);
    sanitizeText(data);
    breakTextIntoSentences(data);
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

module.exports = bot;
