class Tokenizer {
  constructor(options = {}) {
    this.options = {
      preserveCase: true,
      ...options
    };
  }

  tokenize(text) {
    const tokens = [];

    const regex = /\d+|[A-Za-z]+|[^\sA-Za-z0-9]/g;
    let match;
    let index = 0;

    while ((match = regex.exec(text)) !== null) {
      const raw = match[0];

      const token = {
        value: raw,
        normalized: raw.toLowerCase(),
        index: index++,
        start: match.index,
        end: match.index + raw.length,
        type: this._getType(raw)
      };

      tokens.push(token);
    }

    return tokens;
  }

  _getType(token) {
    if (/^\d+$/.test(token)) return "number";
    if (/^[A-Za-z]+$/.test(token)) return "word";
    return "symbol";
  }
}

module.exports = Tokenizer;



// EXAMPLE:
// const tokenizer = new Tokenizer();
// const text = "Hi, I am Raju from India! I am 25 years old.";
// const tokens = tokenizer.tokenize(text);
// console.log(tokens);

// [
//   { "value": "Hi", "normalized": "hi", "index": 0, "start": 0, "end": 2, "type": "word" },
//   { "value": ",", "normalized": ",", "index": 1, "start": 2, "end": 3, "type": "symbol" },
//   { "value": "I", "normalized": "i", "index": 2, "start": 4, "end": 5, "type": "word" },
//   { "value": "am", "normalized": "am", "index": 3, "start": 6, "end": 8, "type": "word" },
//   { "value": "Raju", "normalized": "raju", "index": 4, "start": 9, "end": 13, "type": "word" },
// ]


// Next-Level Features

// 1. Multi-word tokens
// 👉 "New York" → single token (later via entity stage)
// 2. Currency detection
// ₹120 → ["₹", "120"]
// 3. Custom token rules
// tokenizer.use(customRule);
// 4. Stopword tagging
// "is", "am", "the"


