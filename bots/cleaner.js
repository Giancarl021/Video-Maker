const fs = require('fs');

function bot() {
    const f = fs.readdirSync('data/images/');
    f.forEach(e => {
       if(e.includes('.jpg') || e.includes('.png')) {
           fs.unlinkSync('data/images/' + e);
       }
    });
}

module.exports = bot;
