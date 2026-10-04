export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}
