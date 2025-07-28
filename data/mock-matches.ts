// Ten plik symuluje dane, które w przyszłości zwróci Twoje API w Pythonie.

export type Match = {
  id: string;
  date: string;
  teams: { home: string; away: string };
  score: string;
  status: 'Finished' | 'Live';
};

export const MOCK_MATCHES: Match[] = [
  {
    id: '1',
    date: '2024-07-14',
    teams: { home: 'Team A', away: 'Team B' },
    score: '3-1',
    status: 'Finished',
  },
  {
    id: '2',
    date: '2024-07-15',
    teams: { home: 'Team D', away: 'Team C' },
    score: '1-1',
    status: 'Live',
  },
];
