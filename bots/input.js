const readline = require('readline-sync');
const files = require('./files');

Array.prototype.norm = function () {
    return this.map(e => e.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
};

function main() {
    const data = {};
    data.searchTerm = returnSearchTerm();
    // data.prefix = returnPrefix();
    data.maximumSentences = 8;
    files.save(data);
}

function returnSearchTerm() {
    return readline.question('Digite o termo de busca (Wikipedia): ');
}

function returnPrefix() {
    const prefixes = ['Quem é', 'O que é', 'A história de'];
    const index = readline.keyInSelect(prefixes.norm(), 'Selecione o prefixo:');
    return prefixes[index];
}

function selectArticle(search) {
    const index = readline.keyInSelect(search.norm(), 'Selecione o artigo');
    return search[index];
}

module.exports = {main, selectArticle};
