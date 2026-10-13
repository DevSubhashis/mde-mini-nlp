class EntityResolver {
  constructor(options = {}) {
    this.options = {
      multiValueLabels: new Set(), // e.g. skills, items
      ...options
    };
  }

  resolve(entities) {
    // Step 1: sort deterministically
    const sorted = this._sortEntities(entities);

    // Step 2: resolve overlaps
    const nonOverlapping = this._removeOverlaps(sorted);

    // Step 3: group by label
    const grouped = this._groupByLabel(nonOverlapping);

    // Step 4: build final output
    return this._buildOutput(grouped);
  }

  // =========================
  // SORTING (CORE LOGIC)
  // =========================
  _sortEntities(entities) {
    return [...entities].sort((a, b) => {
      // 1. confidence DESC
      if (b.confidence !== a.confidence) {
        return b.confidence - a.confidence;
      }

      // 2. priority DESC
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }

      // 3. span length DESC
      const lenA = a.end - a.start;
      const lenB = b.end - b.start;
      if (lenB !== lenA) {
        return lenB - lenA;
      }

      // 4. earlier occurrence ASC
      return a.start - b.start;
    });
  }

  // =========================
  // REMOVE OVERLAPS
  // =========================
  _removeOverlaps(entities) {
    const selected = [];
    const occupied = new Set();

    for (const entity of entities) {
      let conflict = false;

      for (let i = entity.start; i <= entity.end; i++) {
        if (occupied.has(i)) {
          conflict = true;
          break;
        }
      }

      if (!conflict) {
        selected.push(entity);

        for (let i = entity.start; i <= entity.end; i++) {
          occupied.add(i);
        }
      }
    }

    return selected;
  }

  // =========================
  // GROUP BY LABEL
  // =========================
  _groupByLabel(entities) {
    const grouped = {};

    for (const entity of entities) {
      if (!grouped[entity.label]) {
        grouped[entity.label] = [];
      }
      grouped[entity.label].push(entity);
    }

    return grouped;
  }

  // =========================
  // FINAL OUTPUT
  // =========================
  _buildOutput(grouped) {
    const result = {};

    for (const label in grouped) {
      const values = grouped[label];

      if (this.options.multiValueLabels.has(label)) {
        // return array
        result[label] = values.map(v => v.value);
      } else {
        // return best (first after sorting)
        result[label] = values[0].value;
      }
    }

    return result;
  }
}

module.exports = EntityResolver;