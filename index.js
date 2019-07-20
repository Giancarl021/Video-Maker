const readline = require('readline-sync');
const bots = {
    text: require('./bots/text.js')
};

function init() {
    const data = {};
    data.searchTerm = returnSearchTerm();
    data.prefix = returnPrefix();
    console.log(data);
    bots.text(data);

    /* Funções Internas */

    function returnSearchTerm() {
        return readline.question('Digite o termo de busca (Wikipedia): ');
    }

    function returnPrefix() {
        const prefixes = ['Quem é', 'O que é', 'A história de'];
        const selectedPrefix = readline.keyInSelect(prefixes.norm(), 'Selecione o prefixo:');
        return prefixes[selectedPrefix];
    }
}

Array.prototype.norm = function () {
    return this.map(e => e.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
};

init();
