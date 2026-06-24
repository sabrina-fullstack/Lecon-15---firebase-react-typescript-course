export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  userId: string;
}

export type NewTodo = Omit<Todo, "id">;
