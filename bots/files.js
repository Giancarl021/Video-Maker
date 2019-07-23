const fs = require('fs');
const dataFilePath = './data/data.json';
const audioFilePath = './data/audio.json';

function save(data) {
    const dataString = JSON.stringify(data);
    return fs.writeFileSync(dataFilePath, dataString);
}

function load() {
    const stringBuffer = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(stringBuffer);
}

function loadAudioData() {
    const stringBuffer = fs.readFileSync(audioFilePath, 'utf-8');
    return JSON.parse(stringBuffer);
}

module.exports = {
    save,
    load,
    loadAudioData
};
