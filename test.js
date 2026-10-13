const MiniNLP = require("./lib/core");
const assert = require("node:assert/strict");
const namePlugin = require("./plugins/namePlugin");
const dictionaryPlugin = require("./plugins/dictionaryPlugin");
const postProcessingPlugin = require("./plugins/postProcessingPlugin");

const nlp = new MiniNLP();

nlp.use(namePlugin());
nlp.use(dictionaryPlugin());
nlp.use(postProcessingPlugin());

function extract(text, options) {
  return nlp.extract(text, options);
}

assert.deepEqual(extract("I live in New York and work at Gooogle"), {
  city: "New York",
  company: "Google",
});

assert.deepEqual(extract("I like Gooogle"), {
  company: "Google",
});

assert.equal(extract("My address is 12 Main Street.").address, "12 Main Street");
assert.equal(extract("My address: 12 Main Street.").address, "12 Main Street");

assert.deepEqual(extract("My name is John lives here."), {
  full_name: "John",
  first_name: "John",
});

const debug = extract("I live in New York", { debug: true });
assert.ok(debug.tokens.every((token) => token.pos));
assert.deepEqual(debug.tokens, debug.pos);

console.log("All regression tests passed.");

