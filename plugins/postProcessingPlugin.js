module.exports = function postProcessingPlugin() {
  return {
    name: "postProcessingPlugin",

    init(nlp) {
      nlp.addPostProcessor((data, context) => {
        let result = { ...data };

        // =========================
        // 1. NORMALIZATION
        // =========================
        for (const key in result) {
          if (typeof result[key] === "string") {
            result[key] = result[key].trim();
          }
        }

        // =========================
        // 2. FULL NAME SPLIT
        // =========================
        if (result.full_name) {
          const parts = result.full_name.split(" ");

          if (parts.length >= 2) {
            result.first_name = parts[0];
            result.last_name = parts.slice(1).join(" ");
          } else {
            result.first_name = result.full_name;
          }
        }

        // =========================
        // 3. NAME → PERSON
        // =========================
        if (result.name && !result.person) {
          result.person = result.name;
        }

        // =========================
        // 4. CLEAN INVALID NAME
        // =========================
        const INVALID_NAMES = new Set(["from", "in", "at", "on"]);

        if (result.name && INVALID_NAMES.has(result.name.toLowerCase())) {
          delete result.name;
        }

        // =========================
        // 5. LOCATION NORMALIZATION
        // =========================
        if (result.location) {
          const loc = result.location;

          // basic heuristic (expand later)
          if (["India", "USA"].includes(loc)) {
            result.country = loc;
          }
        }

        // =========================
        // 6. LOWER PRIORITY CLEANUP
        // =========================
        if (result.full_name && result.name) {
          // full_name is stronger → remove name
          delete result.name;
        }

        return result;
      });
    },
  };
};
