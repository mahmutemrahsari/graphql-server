export type User = {
  id: number;
  name: string;
};

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  user_id: number;
};
