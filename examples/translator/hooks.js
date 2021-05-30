const franc = require('franc');

// Annotates each item with the language of its sentence.
async function languageHook(item, next) {
    const { sentence } = item;
    item.lang = franc(sentence);

    await next();
}

async function logHook(item, next) {
    console.log(item);
    await next();
}

module.exports = { languageHook, logHook };