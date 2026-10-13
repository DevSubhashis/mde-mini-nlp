class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(words) {
    let node = this.root;

    for (const word of words) {
      const key = word.toLowerCase();

      if (!node.children.has(key)) {
        node.children.set(key, new TrieNode());
      }

      node = node.children.get(key);
    }

    node.isEnd = true;
  }

  // Find longest match from index
  search(tokens, startIndex) {
    let node = this.root;
    let currentIndex = startIndex;
    let lastMatch = null;

    while (currentIndex < tokens.length) {
      const token = tokens[currentIndex].normalized;

      if (!node.children.has(token)) break;

      node = node.children.get(token);

      if (node.isEnd) {
        lastMatch = currentIndex;
      }

      currentIndex++;
    }

    return lastMatch !== null
      ? { start: startIndex, end: lastMatch }
      : null;
  }
}

module.exports = Trie;