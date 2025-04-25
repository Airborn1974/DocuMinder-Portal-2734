class DocumentService {
  constructor() {
    this.documents = new Map();
  }

  create(document) {
    this.documents.set(document.id, document);
    return document;
  }

  getById(id) {
    return this.documents.get(id);
  }

  getAll() {
    return Array.from(this.documents.values());
  }

  update(id, updates) {
    const document = this.documents.get(id);
    if (!document) return null;

    const updated = { ...document, ...updates, updatedAt: new Date() };
    this.documents.set(id, updated);
    return updated;
  }

  delete(id) {
    return this.documents.delete(id);
  }

  searchByTag(tag) {
    return this.getAll().filter(doc => 
      doc.metadata.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  searchByCategory(category) {
    return this.getAll().filter(doc => 
      doc.metadata.category.toLowerCase() === category.toLowerCase()
    );
  }
}

export const documentService = new DocumentService();