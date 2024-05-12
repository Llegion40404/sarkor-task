export type Todo = {
	title: string;
	list: Task[];
	id: string;
	createdAt: string;
};
export type Task = {
	title: string;
	isDone: boolean;
	id: string;
	createdAt: string;
};
