class RuleEngine {
  constructor(rules = []) {
    this.rules = rules;
  }

  setRules(rules) {
    this.rules = this._sortRules(rules);
  }

  _sortRules(rules) {
    // Deterministic ordering:
    // 1. Higher priority first
    // 2. Stable order fallback
    return [...rules].sort((a, b) => b.priority - a.priority);
  }

  run(tokens, options = {}) {
    const entities = [];
    const debug = [];

    for (let i = 0; i < tokens.length; i++) {
      for (const rule of this.rules) {
        let match = null;

        try {
          match = rule.match(tokens, i);
        } catch (err) {
          // Safe execution (important for plugins)
          continue;
        }

        const debugInfo = {
          ruleId: rule.id,
          index: i,
          matched: !!match
        };

        if (options.debug) {
          debug.push(debugInfo);
        }

        if (match) {
          const entity = this._buildEntity(rule, match);
          entities.push(entity);
        }
      }
    }

    return options.debug ? { entities, debug } : { entities };
  }

  _buildEntity(rule, match) {
    return {
      label: rule.label,
      value: match.value,
      start: match.start,
      end: match.end,
      ruleId: rule.id,
      confidence: rule.confidence
    };
  }
}

module.exports = RuleEngine;