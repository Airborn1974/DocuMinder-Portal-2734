// Text ranking algorithm for summarization
export class TextRank {
  constructor(text) {
    this.text = text;
    this.sentences = this.splitIntoSentences(text);
    this.similarity = this.buildSimilarityMatrix();
  }

  splitIntoSentences(text) {
    return text
      .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
      .split("|")
      .map(s => s.trim())
      .filter(s => s.length > 10);
  }

  calculateSimilarity(sent1, sent2) {
    const words1 = sent1.toLowerCase().split(/\s+/);
    const words2 = sent2.toLowerCase().split(/\s+/);
    const intersection = words1.filter(w => words2.includes(w));
    const union = new Set([...words1, ...words2]);
    return intersection.length / union.size;
  }

  buildSimilarityMatrix() {
    const matrix = Array(this.sentences.length).fill()
      .map(() => Array(this.sentences.length).fill(0));
    
    for (let i = 0; i < this.sentences.length; i++) {
      for (let j = 0; j < this.sentences.length; j++) {
        if (i !== j) {
          matrix[i][j] = this.calculateSimilarity(
            this.sentences[i],
            this.sentences[j]
          );
        }
      }
    }
    return matrix;
  }

  rankSentences(iterations = 30, dampingFactor = 0.85) {
    let scores = Array(this.sentences.length).fill(1);
    
    for (let iter = 0; iter < iterations; iter++) {
      const newScores = Array(this.sentences.length).fill(0);
      
      for (let i = 0; i < this.sentences.length; i++) {
        let sum = 0;
        for (let j = 0; j < this.sentences.length; j++) {
          if (i !== j) {
            sum += (this.similarity[j][i] * scores[j]);
          }
        }
        newScores[i] = (1 - dampingFactor) + dampingFactor * sum;
      }
      scores = newScores;
    }
    return scores;
  }

  summarize(ratio = 0.3) {
    if (this.sentences.length <= 3) return this.text;

    const scores = this.rankSentences();
    const minSentences = 3;
    const maxSentences = Math.max(
      minSentences,
      Math.ceil(this.sentences.length * ratio)
    );

    const ranked = this.sentences
      .map((sentence, index) => ({ sentence, score: scores[index], index }))
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSentences)
      .sort((a, b) => a.index - b.index);

    return ranked.map(r => r.sentence).join(' ');
  }
}

export const generateSummary = (text, ratio = 0.3) => {
  if (!text || text.length < 100) return text;
  const textRank = new TextRank(text);
  return textRank.summarize(ratio);
};