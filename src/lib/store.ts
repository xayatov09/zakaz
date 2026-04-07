export interface Site {
  id: string;
  url: string;
  title: string;
  status: 'pending' | 'indexing' | 'indexed' | 'error';
  pagesIndexed: number;
  totalPages: number;
  lastIndexed: string | null;
  addedAt: string;
  autoReindex: boolean;
  reindexInterval: number; // hours
}

export interface SearchQuery {
  id: string;
  query: string;
  results: number;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

const SITES_KEY = 'webindex_sites';
const QUERIES_KEY = 'webindex_queries';
const USER_KEY = 'webindex_user';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Sites
export function getSites(): Site[] {
  const data = localStorage.getItem(SITES_KEY);
  if (!data) {
    const defaults = getDefaultSites();
    localStorage.setItem(SITES_KEY, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(data);
}

export function saveSites(sites: Site[]) {
  localStorage.setItem(SITES_KEY, JSON.stringify(sites));
}

export function addSite(url: string, title: string): Site {
  const sites = getSites();
  const site: Site = {
    id: generateId(),
    url,
    title,
    status: 'pending',
    pagesIndexed: 0,
    totalPages: 0,
    lastIndexed: null,
    addedAt: new Date().toISOString(),
    autoReindex: true,
    reindexInterval: 24,
  };
  sites.push(site);
  saveSites(sites);
  return site;
}

export function removeSite(id: string) {
  const sites = getSites().filter(s => s.id !== id);
  saveSites(sites);
}

export function updateSite(id: string, updates: Partial<Site>) {
  const sites = getSites().map(s => s.id === id ? { ...s, ...updates } : s);
  saveSites(sites);
}

export function startIndexing(id: string) {
  const site = getSites().find(s => s.id === id);
  if (!site) return;
  const total = Math.floor(Math.random() * 200) + 20;
  updateSite(id, { status: 'indexing', totalPages: total, pagesIndexed: 0 });
  
  // Simulate indexing progress
  let indexed = 0;
  const interval = setInterval(() => {
    indexed += Math.floor(Math.random() * 15) + 5;
    if (indexed >= total) {
      indexed = total;
      updateSite(id, { status: 'indexed', pagesIndexed: indexed, lastIndexed: new Date().toISOString() });
      clearInterval(interval);
    } else {
      updateSite(id, { pagesIndexed: indexed });
    }
  }, 500);
}

// Search queries
export function getSearchQueries(): SearchQuery[] {
  const data = localStorage.getItem(QUERIES_KEY);
  if (!data) {
    const defaults = getDefaultQueries();
    localStorage.setItem(QUERIES_KEY, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(data);
}

export function addSearchQuery(query: string): SearchQuery {
  const queries = getSearchQueries();
  const q: SearchQuery = {
    id: generateId(),
    query,
    results: Math.floor(Math.random() * 50) + 1,
    timestamp: new Date().toISOString(),
  };
  queries.unshift(q);
  if (queries.length > 100) queries.pop();
  localStorage.setItem(QUERIES_KEY, JSON.stringify(queries));
  return q;
}

// User
export function getUser(): User {
  const data = localStorage.getItem(USER_KEY);
  if (!data) {
    const user: User = {
      id: generateId(),
      name: 'Администратор',
      email: 'admin@webindex.ru',
      role: 'admin',
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  }
  return JSON.parse(data);
}

export function updateUser(updates: Partial<User>) {
  const user = { ...getUser(), ...updates };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

// Default data
function getDefaultSites(): Site[] {
  return [
    { id: generateId(), url: 'https://example.com', title: 'Пример сайта', status: 'indexed', pagesIndexed: 142, totalPages: 142, lastIndexed: '2026-04-06T10:30:00Z', addedAt: '2026-03-15T08:00:00Z', autoReindex: true, reindexInterval: 24 },
    { id: generateId(), url: 'https://blog.example.com', title: 'Блог', status: 'indexed', pagesIndexed: 87, totalPages: 87, lastIndexed: '2026-04-05T14:00:00Z', addedAt: '2026-03-20T12:00:00Z', autoReindex: true, reindexInterval: 12 },
    { id: generateId(), url: 'https://shop.example.com', title: 'Интернет-магазин', status: 'indexing', pagesIndexed: 45, totalPages: 320, lastIndexed: null, addedAt: '2026-04-01T09:00:00Z', autoReindex: true, reindexInterval: 6 },
    { id: generateId(), url: 'https://docs.example.com', title: 'Документация', status: 'pending', pagesIndexed: 0, totalPages: 0, lastIndexed: null, addedAt: '2026-04-07T07:00:00Z', autoReindex: false, reindexInterval: 48 },
    { id: generateId(), url: 'https://news.example.com', title: 'Новостной портал', status: 'error', pagesIndexed: 12, totalPages: 200, lastIndexed: '2026-04-02T16:00:00Z', addedAt: '2026-03-28T11:00:00Z', autoReindex: true, reindexInterval: 4 },
  ];
}

function getDefaultQueries(): SearchQuery[] {
  const queries = [
    'как создать сайт', 'react компоненты', 'оптимизация SEO', 'базы данных', 'индексация сайтов',
    'веб-разработка', 'машинное обучение', 'облачные технологии', 'кибербезопасность', 'API интеграция',
  ];
  return queries.map((q, i) => ({
    id: generateId(),
    query: q,
    results: Math.floor(Math.random() * 100) + 5,
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  }));
}

// Stats
export function getStats() {
  const sites = getSites();
  const queries = getSearchQueries();
  return {
    totalSites: sites.length,
    indexedSites: sites.filter(s => s.status === 'indexed').length,
    indexingSites: sites.filter(s => s.status === 'indexing').length,
    errorSites: sites.filter(s => s.status === 'error').length,
    totalPages: sites.reduce((acc, s) => acc + s.pagesIndexed, 0),
    totalQueries: queries.length,
    avgResults: queries.length > 0 ? Math.round(queries.reduce((a, q) => a + q.results, 0) / queries.length) : 0,
  };
}
