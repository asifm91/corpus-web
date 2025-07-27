let audios = [
  {
    id: 1,
    title: 'Sample Audio 1',
    tags: ['english', 'lesson'],
    description: 'First sample audio',
    file: null,
  },
  {
    id: 2,
    title: 'Sample Audio 2',
    tags: ['practice', 'audio'],
    description: 'Second sample audio',
    file: null,
  },
];
let nextId = 3;

function parseTags(tags) {
  if (typeof tags === 'string') return tags.split(',').map(t => t.trim()).filter(Boolean);
  return tags || [];
}

export default {
  async getAudios() {
    return JSON.parse(JSON.stringify(audios));
  },
  async addAudio(form) {
    audios.push({
      id: nextId++,
      title: form.title,
      tags: parseTags(form.tags),
      description: form.description,
      file: form.file ? form.file.name : null,
    });
  },
  async updateAudio(id, form) {
    const idx = audios.findIndex(a => a.id === id);
    if (idx !== -1) {
      audios[idx] = {
        ...audios[idx],
        title: form.title,
        tags: parseTags(form.tags),
        description: form.description,
        file: form.file ? form.file.name : audios[idx].file,
      };
    }
  },
  async deleteAudio(id) {
    audios = audios.filter(a => a.id !== id);
  },
  getAllTags(audiosList) {
    const tagSet = new Set();
    (audiosList || audios).forEach(a => (a.tags || []).forEach(t => tagSet.add(t)));
    return Array.from(tagSet);
  },
  getStats(audiosList) {
    const list = audiosList || audios;
    const tagCounts = {};
    list.forEach(a => (a.tags || []).forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1));
    return { total: list.length, tagCounts };
  },
}; 