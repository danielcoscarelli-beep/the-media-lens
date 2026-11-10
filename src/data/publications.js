// Publication registry. Note: no publication-level "bias" field exists by design.
// Ratings in The Media Lens attach to individual articles, never to outlets.
export const publications = {
  nyt: { id: 'nyt', name: 'The New York Times', short: 'NYT', kind: 'Daily newspaper', homepage: 'https://www.nytimes.com' },
  fox: { id: 'fox', name: 'Fox News', short: 'FOX', kind: 'Cable & digital news', homepage: 'https://www.foxnews.com' },
  wsj: { id: 'wsj', name: 'The Wall Street Journal', short: 'WSJ', kind: 'Daily newspaper', homepage: 'https://www.wsj.com' },
  cnn: { id: 'cnn', name: 'CNN', short: 'CNN', kind: 'Cable & digital news', homepage: 'https://www.cnn.com' },
  ap: { id: 'ap', name: 'Associated Press', short: 'AP', kind: 'Wire service', homepage: 'https://apnews.com' },
  reuters: { id: 'reuters', name: 'Reuters', short: 'RTRS', kind: 'Wire service', homepage: 'https://www.reuters.com' },
  bbc: { id: 'bbc', name: 'BBC News', short: 'BBC', kind: 'Public broadcaster', homepage: 'https://www.bbc.com/news' },
  guardian: { id: 'guardian', name: 'The Guardian', short: 'GDN', kind: 'Daily newspaper', homepage: 'https://www.theguardian.com' },
  npr: { id: 'npr', name: 'NPR', short: 'NPR', kind: 'Public broadcaster', homepage: 'https://www.npr.org' },
  bloomberg: { id: 'bloomberg', name: 'Bloomberg', short: 'BBG', kind: 'Financial news', homepage: 'https://www.bloomberg.com' },
  politico: { id: 'politico', name: 'Politico', short: 'POL', kind: 'Political news', homepage: 'https://www.politico.com' },
  wapo: { id: 'wapo', name: 'The Washington Post', short: 'WP', kind: 'Daily newspaper', homepage: 'https://www.washingtonpost.com' },
};

export const pubList = Object.values(publications);
