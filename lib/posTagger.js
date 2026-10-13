class POSTagger {
  constructor() {
    this.lexicon = this._buildLexicon();
  }

  // =========================
  // MAIN TAG FUNCTION
  // =========================
  tag(tokens) {
    return tokens.map(token => {
      const pos = this._getPOS(token);
      return { ...token, pos };
    });
  }

  // =========================
  // POS DETECTION LOGIC
  // =========================
  _getPOS(token) {
    const word = token.normalized;

    // 1. NUMBER
    if (token.type === "number") return "NUM";

    // 2. PROPER NOUN (Capitalized)
    if (/^[A-Z]/.test(token.value)) return "PROPN";

    // 3. LEXICON LOOKUP
    if (this.lexicon[word]) return this.lexicon[word];

    // 4. DEFAULTS
    if (token.type === "word") return "NOUN";

    return "UNKNOWN";
  }

  // =========================
  // BASIC LEXICON
  // =========================
  _buildLexicon() {
    return {
      // VERBS
      "is": "VERB",
      "am": "VERB",
      "are": "VERB",
      "was": "VERB",
      "be": "VERB",
      "have": "VERB",
      "has": "VERB",

      // PREPOSITIONS
      "in": "PREP",
      "on": "PREP",
      "at": "PREP",
      "from": "PREP",
      "to": "PREP",
      "with": "PREP",

      // DETERMINERS
      "the": "DET",
      "a": "DET",
      "an": "DET",

      // CONJUNCTIONS
      "and": "CONJ",
      "or": "CONJ",
      "but": "CONJ",

      // PRONOUNS
      "i": "PRON",
      "you": "PRON",
      "he": "PRON",
      "she": "PRON",
      "they": "PRON",

      // ADVERBS
      "very": "ADV",
      "quickly": "ADV"
    };
  }
}

module.exports = POSTagger;