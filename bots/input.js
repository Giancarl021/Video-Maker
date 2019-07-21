const readline = require('readline-sync');

Array.prototype.norm = function () {
    return this.map(e => e.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
};

function main() {
    const data = {};
    data.searchTerm = returnSearchTerm();
    data.prefix = returnPrefix();
    return data;
}

function returnSearchTerm() {
    return readline.question('Digite o termo de busca (Wikipedia): ');
}

function returnPrefix() {
    const prefixes = ['Quem é', 'O que é', 'A história de'];
    const selectedPrefix = readline.keyInSelect(prefixes.norm(), 'Selecione o prefixo:');
    return prefixes[selectedPrefix];
}

module.exports = main;
