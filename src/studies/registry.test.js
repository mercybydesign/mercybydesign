import { describe, it, expect } from 'vitest';
import { TOPICS, STUDIES } from './registry.js';

describe('studies/registry', () => {
  it('exports STUDIES as an alias of TOPICS', () => {
    expect(STUDIES).toBe(TOPICS);
    expect(TOPICS.length).toBeGreaterThanOrEqual(9);
  });

  it('has unique topic IDs, paths, and sequential numbering', () => {
    const ids = new Set();
    const paths = new Set();

    TOPICS.forEach((topic, idx) => {
      expect(ids.has(topic.id)).toBe(false);
      ids.add(topic.id);

      expect(paths.has(topic.path)).toBe(false);
      paths.add(topic.path);

      expect(topic.path).toBe(`/${topic.id}`);
      expect(topic.num).toBe(String(idx + 1).padStart(2, '0'));
      expect(topic.title).toBeTruthy();
      expect(topic.subtitle).toBeTruthy();
      expect(topic.category).toBeTruthy();
      expect(topic.verse).toBeTruthy();
      expect(topic.benefits).toHaveProperty('Individual');
      expect(topic.benefits).toHaveProperty('Community');
      expect(topic.benefits).toHaveProperty('Society');
    });
  });

  it('has valid studies with unique IDs and lazy components under every topic', () => {
    for (const topic of TOPICS) {
      expect(topic.studies.length).toBeGreaterThanOrEqual(1);
      const studyIds = new Set();
      for (const study of topic.studies) {
        expect(study.id).toBeTruthy();
        expect(studyIds.has(study.id)).toBe(false);
        studyIds.add(study.id);
        expect(study.title).toBeTruthy();
        expect(study.component || study.article).toBeTruthy();
      }
    }
  });
});
