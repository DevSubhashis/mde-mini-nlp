module.exports = function dictionaryPlugin() {
  return {
    name: "dictionaryPlugin",

    init(nlp) {
      // =========================
      // COUNTRIES
      // =========================
      nlp.addDictionary("country", [
        "India",
        "USA",
        "UK",
        "France",
        "United States",
        "United Kingdom"
      ]);

      // =========================
      // CITIES
      // =========================
      nlp.addDictionary("city", [
        "Kolkata",
        "Delhi",
        "Mumbai",
        "London",
        "New York"
      ]);

      // =========================
      // COMPANIES / BRANDS
      // =========================
      nlp.addDictionary("company", [
        "Tata Consultancy Services",
        "Infosys",
        "Google",
        "Microsoft"
      ]);

      nlp.addDictionary("brand", [
        "Nike",
        "Adidas",
        "Apple",
        "Samsung"
      ]);
    }
  };
};