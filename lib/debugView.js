function printDebug(debug) {
  console.log("\n🟦 TOKENS");
  console.table(debug.tokens.map(t => ({
    value: t.value,
    pos: t.pos,
    index: t.index
  })));

  console.log("\n🟨 RULE ENTITIES");
  console.table(debug.ruleEntities);

  console.log("\n🟪 DICTIONARY ENTITIES");
  console.table(debug.dictEntities);

  console.log("\n🟥 MERGED");
  console.table(debug.allEntities);

  console.log("\n⚖️ RESOLVED");
  console.log(debug.resolved);

  console.log("\n✅ FINAL");
  console.log(debug.final);
}

module.exports = printDebug;