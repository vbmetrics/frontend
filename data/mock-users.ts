// Ten plik symuluje dane, które w przyszłości zwróci API w Pythonie.

export type User = {
    id: number;
    name: string;
    email: string;
    avatar: string;
};

export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    avatar: 'http://localhost:3000/mock-avatar.png',
  },
];
