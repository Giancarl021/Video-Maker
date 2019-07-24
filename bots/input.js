const readline = require('readline-sync');
const files = require('./files');

Array.prototype.norm = function () {
    return this.map(e => e.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
};

function main() {
    const data = {};
    data.searchTerm = returnSearchTerm();
    data.prefix = returnPrefix();
    data.maximumSentences = 8;
    files.save(data);
}

function returnSearchTerm() {
    const search = readline.question('Digite o termo de busca (Wikipedia): ');
    if(!search) {
        console.log('> Este campo precisa ser preenchido');
        return returnSearchTerm();
    }
    return search;
}

function returnPrefix() {
    const prefixes = ['Quem é', 'O que é', 'A história de'];
    const index = readline.keyInSelect(prefixes.norm(), 'Selecione um prefixo:');
    if (index === -1) {
        console.log('> Encerramento por parte do usuário');
        process.exit(0);
    }
    return prefixes[index];
}

function selectArticle(search) {
    const index = readline.keyInSelect(search.norm(), 'Selecione o artigo');
    if (index === -1) {
        console.log('> Encerramento por parte do usuário');
        process.exit(0);
    }
    return search[index];
}

module.exports = {main, selectArticle};
