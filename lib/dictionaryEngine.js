const Trie = require("./trie");
const levenshtein = require("../utils/levenshtein");

class DictionaryEngine {
  constructor(options = {}) {
    this.tries = new Map();
    this.rawEntries = new Map();

    this.options = {
      fuzzy: true,
      maxDistance: 1, // tolerance
      // One-edit fuzzy matches on four-letter words are far too broad
      // (for example, "like" can match the brand "Nike").
      minLength: 5, // avoid noise
      ...options,
    };
  }

  // =========================
  // ADD DICTIONARY
  // =========================
  addDictionary(label, entries) {
    const trie = new Trie();

    for (const entry of entries) {
      const words = entry.split(/\s+/);
      trie.insert(words);
    }

    this.tries.set(label, trie);
    this.rawEntries.set(label, entries);
  }

  // =========================
  // LOOKUP
  // =========================
  lookup(tokens) {
    const entities = [];

    for (let i = 0; i < tokens.length; i++) {
      for (const [label, trie] of this.tries.entries()) {
        // 1. EXACT MATCH (FAST)
        const exactMatch = trie.search(tokens, i);

        if (exactMatch) {
          const value = this._buildValue(tokens, exactMatch);
          entities.push(this._buildEntity(label, value, exactMatch, "exact"));
          continue;
        }

        // 2. FUZZY MATCH (CONTROLLED)
        if (this.options.fuzzy) {
          const fuzzyMatch = this._fuzzyMatch(tokens[i], label);

          if (fuzzyMatch) {
            entities.push({
              label,
              value: fuzzyMatch,
              start: tokens[i].index,
              end: tokens[i].index,
              ruleId: `dict_${label}_fuzzy`,
              // A normalized near match from a controlled dictionary is more
              // reliable than a generic contextual rule such as "at <word>".
              confidence: 0.92,
              priority: 10,
            });
          }
        }
      }
    }

    return entities;
  }

  // =========================
  // FUZZY MATCH LOGIC
  // =========================
  _fuzzyMatch(token, label) {
    function normalizeRepeats(str) {
      return str.replace(/(.)\1{2,}/g, "$1$1");
    }

    let word = normalizeRepeats(token.normalized);

    if (word.length < this.options.minLength) return null;

    const entries = this.rawEntries.get(label) || [];

    let bestMatch = null;
    let bestScore = Infinity;

    for (const entry of entries) {
      const target = normalizeRepeats(entry.toLowerCase());

      const maxDistance = Math.floor(target.length * 0.3);

      const dist = levenshtein(word, target);

      if (dist <= maxDistance && dist < bestScore) {
        bestScore = dist;
        bestMatch = entry;
      }
    }

    return bestMatch;
  }

  // =========================
  // HELPERS
  // =========================
  _buildValue(tokens, match) {
    return tokens
      .slice(match.start, match.end + 1)
      .map((t) => t.value)
      .join(" ");
  }

  _buildEntity(label, value, match, type) {
    return {
      label,
      value,
      start: match.start,
      end: match.end,
      ruleId: `dict_${label}_${type}`,
      confidence: type === "exact" ? 0.95 : 0.75,
      priority: type === "exact" ? 20 : 10,
    };
  }
}

module.exports = DictionaryEngine;
