class SearchIndex {
  constructor() {
    this.index = new Map();
    this.categoryIndex = new Map();
    this.dateIndex = new Map();
    this.authorIndex = new Map();
  }

  addToIndex(term, docId) {
    const normalized = term.toLowerCase();
    if (!this.index.has(normalized)) {
      this.index.set(normalized, new Set());
    }
    this.index.get(normalized).add(docId);
  }

  indexDocument(document) {
    // Index title words
    document.title.split(/\s+/).forEach(word => {
      if (word.length > 2) this.addToIndex(word, document.id);
    });

    // Index content words
    document.content.split(/\s+/).forEach(word => {
      if (word.length > 2) this.addToIndex(word, document.id);
    });

    // Index metadata
    document.metadata.tags.forEach(tag => {
      this.addToIndex(tag, document.id);
    });

    document.metadata.keywords.forEach(keyword => {
      this.addToIndex(keyword, document.id);
    });

    // Category indexing
    const category = document.metadata.category.toLowerCase();
    if (!this.categoryIndex.has(category)) {
      this.categoryIndex.set(category, new Set());
    }
    this.categoryIndex.get(category).add(document.id);

    // Author indexing
    const author = document.metadata.author.toLowerCase();
    if (!this.authorIndex.has(author)) {
      this.authorIndex.set(author, new Set());
    }
    this.authorIndex.get(author).add(document.id);

    // Date indexing
    const date = document.createdAt.toISOString().split('T')[0];
    if (!this.dateIndex.has(date)) {
      this.dateIndex.set(date, new Set());
    }
    this.dateIndex.get(date).add(document.id);
  }

  search(query, filters = {}) {
    const terms = query.toLowerCase().split(/\s+/);
    let results = new Set();
    let isFirstTerm = true;

    terms.forEach(term => {
      const matches = this.index.get(term) || new Set();
      if (isFirstTerm) {
        results = new Set(matches);
        isFirstTerm = false;
      } else {
        results = new Set([...results].filter(id => matches.has(id)));
      }
    });

    if (filters.category) {
      const categoryMatches = this.categoryIndex.get(filters.category.toLowerCase()) || new Set();
      results = new Set([...results].filter(id => categoryMatches.has(id)));
    }

    if (filters.author) {
      const authorMatches = this.authorIndex.get(filters.author.toLowerCase()) || new Set();
      results = new Set([...results].filter(id => authorMatches.has(id)));
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      results = new Set([...results].filter(id => {
        const docDate = this.getDocumentDate(id);
        return docDate >= start && docDate <= end;
      }));
    }

    return Array.from(results);
  }
}

class ArchiveDatabase {
  constructor() {
    this.documents = new Map();
    this.searchIndex = new SearchIndex();
  }

  add(document) {
    this.documents.set(document.id, document);
    this.searchIndex.indexDocument(document);
    return document;
  }

  get(id) {
    return this.documents.get(id);
  }

  getAll() {
    return Array.from(this.documents.values());
  }

  search(query, filters = {}) {
    const ids = this.searchIndex.search(query, filters);
    return ids.map(id => this.documents.get(id));
  }

  getCategories() {
    return Array.from(this.searchIndex.categoryIndex.keys());
  }

  getAuthors() {
    return Array.from(this.searchIndex.authorIndex.keys());
  }

  getDateRange() {
    const dates = Array.from(this.searchIndex.dateIndex.keys())
      .sort((a, b) => new Date(a) - new Date(b));
    return {
      earliest: dates[0],
      latest: dates[dates.length - 1]
    };
  }
}

export const archiveDb = new ArchiveDatabase();