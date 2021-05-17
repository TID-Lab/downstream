// Allows `downstream/builtin` to work as an import path.

const exports = require('./build/builtin/channels');
module.exports = exports;
