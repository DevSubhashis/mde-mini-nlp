module.exports = function namePlugin() {
  const STOPWORDS = new Set([
    "from",
    "in",
    "at",
    "on",
    "to",
    "for",
    "with",
    "by",
    "and",
    "or",
    "but",
    "is",
    "am",
    "are",
    "was",
  ]);

  return {
    name: "namePlugin",

    init(nlp) {
      // =========================
      // NAME RULES
      // =========================

      nlp.addRule({
        id: "full_name_after_my_name_is",
        label: "full_name",
        priority: 20,
        confidence: 0.95,

        match(tokens, i) {
          if (
            tokens[i].normalized === "name" &&
            tokens[i + 1]?.normalized === "is" &&
            tokens[i + 2]?.pos === "PROPN"
          ) {
            let start = tokens[i + 2].index;
            let end = start;

            // capture multi-word name
            // A second name must also look like a proper noun. Without this,
            // "My name is John lives here" becomes "John lives".
            if (tokens[i + 3]?.pos === "PROPN") {
              end = tokens[i + 3].index;
              return {
                value: tokens[i + 2].value + " " + tokens[i + 3].value,
                start,
                end,
              };
            }

            return {
              value: tokens[i + 2].value,
              start,
              end,
            };
          }
        },
      });

      nlp.addRule({
        id: "name_after_i_am",
        label: "name",
        priority: 18,
        confidence: 0.9,

        match(tokens, i) {
          const next = tokens[i + 2];

          if (
            tokens[i].normalized === "i" &&
            tokens[i + 1]?.normalized === "am" &&
            next?.type === "word" &&
            /^[A-Z]/.test(next.value) &&
            !STOPWORDS.has(next.normalized)
          ) {
            return {
              value: next.value,
              start: next.index,
              end: next.index,
            };
          }

          return null;
        },
      });

      nlp.addRule({
        id: "nickname_pattern",
        label: "nickname",
        priority: 17,
        confidence: 0.85,

        match(tokens, i) {
          if (
            tokens[i].normalized === "called" &&
            tokens[i + 1]?.type === "word"
          ) {
            return {
              value: tokens[i + 1].value,
              start: tokens[i + 1].index,
              end: tokens[i + 1].index,
            };
          }
        },
      });

      // =========================
      // FIRST / LAST NAME SPLIT
      // =========================

      nlp.addRule({
        id: "split_full_name",
        label: "first_name",
        priority: 10,
        confidence: 0.8,

        match(tokens, i) {
          // handled later in resolver ideally
          return null;
        },
      });

      // =========================
      // LOCATION RULES
      // =========================

      nlp.addRule({
        id: "location_after_from",
        label: "location",
        priority: 18,
        confidence: 0.9,

        match(tokens, i) {
          if (
            tokens[i].normalized === "from" &&
            tokens[i + 1]?.type === "word"
          ) {
            return {
              value: tokens[i + 1].value,
              start: tokens[i + 1].index,
              end: tokens[i + 1].index,
            };
          }
        },
      });

      nlp.addRule({
        id: "location_after_in",
        label: "location",
        priority: 17,
        confidence: 0.85,

        match(tokens, i) {
          if (tokens[i].normalized === "in" && tokens[i + 1]?.type === "word") {
            return {
              value: tokens[i + 1].value,
              start: tokens[i + 1].index,
              end: tokens[i + 1].index,
            };
          }
        },
      });

      // =========================
      // ADDRESS
      // =========================

      nlp.addRule({
        id: "address_pattern",
        label: "address",
        priority: 15,
        confidence: 0.85,

        match(tokens, i) {
          if (tokens[i].normalized === "address") {
            let words = [];
            let j = i + 1;

            // Support both "address is ..." and "address: ..." while
            // excluding the connector from the extracted address.
            if (tokens[j]?.normalized === "is" || tokens[j]?.value === ":") {
              j++;
            }

            while (tokens[j] && tokens[j].type !== "symbol") {
              words.push(tokens[j].value);
              j++;
            }

            if (words.length) {
              return {
                value: words.join(" "),
                start: tokens[i + 1].index,
                end: tokens[j - 1].index,
              };
            }
          }
        },
      });

      // =========================
      // PINCODE / ZIP
      // =========================

      nlp.addRule({
        id: "pincode_rule",
        label: "pincode",
        priority: 20,
        confidence: 0.95,

        match(tokens, i) {
          if (
            /^\d{6}$/.test(tokens[i].value) // India
          ) {
            return {
              value: tokens[i].value,
              start: tokens[i].index,
              end: tokens[i].index,
            };
          }
        },
      });

      // =========================
      // ORGANIZATION / COMPANY
      // =========================

      nlp.addRule({
        id: "company_after_at",
        label: "company",
        priority: 18,
        confidence: 0.9,

        match(tokens, i) {
          if (tokens[i].normalized === "at" && tokens[i + 1]?.type === "word") {
            return {
              value: tokens[i + 1].value,
              start: tokens[i + 1].index,
              end: tokens[i + 1].index,
            };
          }
        },
      });

      nlp.addRule({
        id: "organization_keywords",
        label: "organization",
        priority: 16,
        confidence: 0.8,

        match(tokens, i) {
          const keywords = ["ltd", "inc", "corp"];

          if (
            tokens[i].type === "word" &&
            keywords.includes(tokens[i + 1]?.normalized)
          ) {
            return {
              value: tokens[i].value + " " + tokens[i + 1].value,
              start: tokens[i].index,
              end: tokens[i + 1].index,
            };
          }
        },
      });

      // =========================
      // BRAND
      // =========================

      nlp.addRule({
        id: "brand_after_using",
        label: "brand",
        priority: 14,
        confidence: 0.8,

        match(tokens, i) {
          if (
            tokens[i].normalized === "using" &&
            tokens[i + 1]?.type === "word"
          ) {
            return {
              value: tokens[i + 1].value,
              start: tokens[i + 1].index,
              end: tokens[i + 1].index,
            };
          }
        },
      });

      // =========================
      // LANDMARK
      // =========================

      nlp.addRule({
        id: "landmark_near",
        label: "landmark",
        priority: 14,
        confidence: 0.8,

        match(tokens, i) {
          if (
            tokens[i].normalized === "near" &&
            tokens[i + 1]?.type === "word"
          ) {
            return {
              value: tokens[i + 1].value,
              start: tokens[i + 1].index,
              end: tokens[i + 1].index,
            };
          }
        },
      });
    },
  };
};
