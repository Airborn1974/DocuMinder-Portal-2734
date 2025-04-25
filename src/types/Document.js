export class Document {
  constructor(id, title, content, metadata, summary) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.metadata = metadata;
    this.summary = summary;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export class DocumentMetadata {
  constructor(tags = [], author = '', category = '', keywords = [], description = '') {
    this.tags = tags;
    this.author = author;
    this.category = category;
    this.keywords = keywords;
    this.description = description;
    this.readingTime = 0;
  }

  setReadingTime(minutes) {
    this.readingTime = minutes;
    return this;
  }
}