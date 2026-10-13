const Tokenizer = require("./tokenizer");
const RuleEngine = require("./ruleEngine");
const EntityResolver = require("./entityResolver");
const DictionaryEngine = require("./dictionaryEngine");
const POSTagger = require("./posTagger");

class MiniNLP {
  constructor() {
    this.tokenizer = new Tokenizer();
    this.rules = [];
    this.ruleEngine = new RuleEngine();
    this.resolver = new EntityResolver({
      multiValueLabels: new Set(["skills", "items"]),
    });
    this.postProcessors = [];
    this.dictionaryEngine = new DictionaryEngine();
    this.posTagger = new POSTagger();
  }

  addRule(rule) {
    this.rules.push(rule);
    this.ruleEngine.setRules(this.rules);
  }

  addPostProcessor(fn) {
    this.postProcessors.push(fn);
  }

  addDictionary(name, entries) {
    this.dictionaryEngine.addDictionary(name, entries);
  }

  use(plugin) {
    plugin.init(this);
  }
  extract(text, options = {}) {
    const debugData = {};

    // 1. TOKENIZER
    const tokens = this.tokenizer.tokenize(text);
    if (options.debug) debugData.tokens = tokens;

    // 2. POS TAGGING
    const taggedTokens = this.posTagger.tag(tokens);
    if (options.debug) {
      // Keep the token view and POS view consistent for debug consumers.
      debugData.tokens = taggedTokens;
      debugData.pos = taggedTokens;
    }

    // 3. RULE ENGINE
    const { entities: ruleEntities, debug } = this.ruleEngine.run(
      taggedTokens,
      options,
    );

    if (options.debug) {
      debugData.ruleMatches = debug;
      debugData.ruleEntities = ruleEntities;
    }

    // 4. DICTIONARY ENGINE
    const dictEntities = this.dictionaryEngine.lookup(taggedTokens);

    if (options.debug) {
      debugData.dictEntities = dictEntities;
    }

    // 5. MERGE
    const allEntities = [...ruleEntities, ...dictEntities];
    if (options.debug) debugData.allEntities = allEntities;

    // 6. RESOLVE
    const resolved = this.resolver.resolve(allEntities);
    if (options.debug) debugData.resolved = resolved;

    // 7. POST PROCESS
    let final = resolved;
    for (const processor of this.postProcessors) {
      final = processor(final, { tokens, entities: allEntities });
    }

    if (options.debug) debugData.final = final;

    return options.debug ? debugData : final;
  }
}

module.exports = MiniNLP;
