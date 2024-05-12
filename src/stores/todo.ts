import { defineStore, storeToRefs } from "pinia";
import type { Todo } from "../Types/Types";
import { useMainStore } from "./main";
import { v4 as uid } from "uuid";

export const useTodoStore = defineStore("todo", () => {
	const { todos } = storeToRefs(useMainStore());
	const { notify } = useMainStore();
	function formattedDate() {
		return new Date().toISOString().slice(0, 16).replace("T", " ");
	}
	function Save() {
		localStorage.setItem("todos", JSON.stringify(todos.value));
	}

	function getSingleTodo(id: string) {
		return todos.value.find((t) => t.id === id);
	}

	// function addTask(todo: Todo, title: string, open: boolean) {
	// 	const task = {
	// 		title: taskTitle.value.trim(),
	// 		id: uid(),
	// 		isDone: false,
	// 		createdAt: formattedDate(),
	// 		doneAt: "",
	// 	};
	// 	if (todo.value.list.length < 15) {
	// 		if (taskTitle.value.length > 0) {
	// 			todo.value.list.push(task);
	// 			isOpen.value = false;
	// 			taskTitle.value = "";
	// 		} else notify("Give a name to your task!", "warning");
	// 	} else {
	// 		notify("Limit of 15 tasks reached!", "warning");
	// 	}
	// }
	function addTask(todo: Todo, title: string) {
		const task = {
			title: title.trim(),
			id: uid(),
			isDone: false,
			createdAt: formattedDate(),
		};
		if (todo.list.length < 15) {
			if (title.length > 0) {
				todo.list.push(task);
			} else notify("Give a name to your task!", "warning");
		} else {
			notify("Limit of 15 tasks reached!", "warning");
		}
	}
	function deleteTask(id: string[] | string, taskId: string) {
		const todo = todos.value.find((t) => t.id === id);
		const idx = todo?.list.findIndex((task) => task.id === taskId);
		todo?.list.splice(idx!, 1);
		notify("Successfully deleted task", "warning");
	}
	function copy(obj: Todo) {
		return JSON.parse(JSON.stringify(obj));
	}

	return {
		getSingleTodo,
		Save,
		deleteTask,
		copy,
		formattedDate,
		addTask,
	};
});
