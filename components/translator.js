const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const britishOnly = require('./british-only.js');
const flipSpelling = Object.fromEntries(Object.entries(americanToBritishSpelling).map(([k, v]) => [v, k]));

// let result = text.replace(/blue/g, "red");

const terms = [];
Object.keys(americanOnly).forEach((key) => {
  terms.push([key, americanOnly[key]]);
});
Object.keys(americanToBritishSpelling).forEach((key) => {
  terms.push([key, americanToBritishSpelling[key]]);
});
Object.keys(britishOnly).forEach((key) => {
  terms.push([britishOnly[key], key]);
});

class Translator {
    amtobr(text) {
        let timeCapture = text.match(/([0-1]?[0-9]|2[0-3]):([0-5][0-9])/g);
        if (timeCapture) timeCapture.map(time => {
            text = text.replace(time,
                `<span class="highlight">${time.replace(':', '.')}</span>`);
        });
        const titleCapture = text.match(/(mr|mrs|ms|dr|prof)\./gi);
        if (titleCapture) titleCapture.map(title => {
            text = text.replace(title,
                `<span class="highlight">${(title[0] + title.slice(1)).replace(".", "")}</span>`
            );
        });
        Object.keys(americanOnly).forEach(key => {
            const toUK = new RegExp("\\b" + key + "\\b", "i");
            text = text.replace(toUK,
                `<span class="highlight">${americanOnly[key]}</span>`);
        });
        Object.keys(americanToBritishSpelling).forEach(key => {
            const toUK = new RegExp("\\b" + key + "\\b", "i");
            text = text.replace(toUK,
                `<span class="highlight">${americanToBritishSpelling[key]}</span>`);
        });
        return text;
    }
    brtoam(text) {
        let timeCapture = text.match(/([0-1]?[0-9]|2[0-3])\.([0-5][0-9])/g);
        if (timeCapture) timeCapture.map(time => {
            text = text.replace(time,
                `<span class="highlight">${time.replace('.', ':')}</span>`);
        });
        const titleCapture = text.match(/(mr|mrs|ms|dr|prof)\s/gi);
        if (titleCapture) titleCapture.map(title => {
            text = text.replace(title,
                `<span class="highlight">${(title[0] + title.slice(1)).replace(" ", ".")}</span> `
            );
        });
        Object.keys(britishOnly).forEach(key => {
            const toUS = new RegExp("(?<!-)\\b" + key + "\\b", "i");
            text = text.replace(toUS,
                `<span class="highlight">${britishOnly[key]}</span>`);
        });
        Object.keys(americanToBritishSpelling).forEach(key => {
            const toUS = new RegExp("\\b" + americanToBritishSpelling[key] + "\\b", "i");
            text = text.replace(toUS,
                `<span class="highlight">${key}</span>`);
        });
        return text;
    }
    hub(text, locale) {
        let translation;
        if (locale === 'american-to-british') {
            translation = this.amtobr(text);
        } else {
            translation = this.brtoam(text);
        }
        if (translation === text) {
            translation = 'Everything looks good to me!';
        }
    return translation;
    }
}

module.exports = Translator;