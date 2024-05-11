export type Todo = {
	title: string;
	list: Task[];
	id: string;
	createdAt: string;
	completedAt: string;
};

export type Task = {
	text: string;
	isDone: boolean;
	id: string;
	createdAt: string;
	doneAt: string;
};
