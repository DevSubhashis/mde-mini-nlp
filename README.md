# mde-mini-nlp

`mde-mini-nlp` is a lightweight Node.js framework for extracting named entities from text. It combines tokenization, simple part-of-speech tagging, custom rules, dictionary matching, controlled fuzzy matching, entity resolution, and optional post-processing.

## Install

```sh
npm install mde-mini-nlp
```

## Quick start

```js
const MiniNLP = require("mde-mini-nlp");
const { name, dictionary, postProcessing } = MiniNLP.plugins;

const nlp = new MiniNLP();
nlp.use(name());
nlp.use(dictionary());
nlp.use(postProcessing());

const entities = nlp.extract(
  "My name is John Doe. I live in New York and work at Gooogle."
);

console.log(entities);
// {
//   full_name: "John Doe",
//   first_name: "John",
//   last_name: "Doe",
//   city: "New York",
//   company: "Google"
// }
```

## API

### `new MiniNLP()` / `createNLP()`

Creates an NLP pipeline. `createNLP()` is also available as a named export:

```js
const { createNLP } = require("mde-mini-nlp");
const nlp = createNLP();
```

### `nlp.use(plugin)`

Registers a plugin. Built-in plugins are exposed as `MiniNLP.plugins.name`, `MiniNLP.plugins.dictionary`, and `MiniNLP.plugins.postProcessing`.

### `nlp.addRule(rule)`

Adds a rule with `id`, `label`, `priority`, `confidence`, and a `match(tokens, index)` function. Return `null` for no match, or an object containing `value`, `start`, and `end` token indices.

### `nlp.addDictionary(label, entries)`

Adds an array of words or phrases to a dictionary. Phrase matches are case-insensitive; fuzzy matching is used for words of at least five characters.

### `nlp.extract(text, { debug: true })`

Returns extracted entities. With `debug: true`, returns the token/POS stream and the output from each pipeline stage.

## Development

```sh
npm test
npm pack --dry-run
```

## License

[MIT](LICENSE)
