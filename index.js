const MiniNLP = require("./lib/core");

/**
 * Create a MiniNLP instance.
 *
 * @returns {MiniNLP}
 */
function createNLP() {
  return new MiniNLP();
}

// The default export keeps the simplest usage concise:
// const MiniNLP = require("mde-mini-nlp");
module.exports = MiniNLP;
module.exports.MiniNLP = MiniNLP;
module.exports.createNLP = createNLP;
module.exports.plugins = {
  name: require("./plugins/namePlugin"),
  dictionary: require("./plugins/dictionaryPlugin"),
  postProcessing: require("./plugins/postProcessingPlugin"),
};
