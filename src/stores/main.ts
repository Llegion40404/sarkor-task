import { defineStore } from "pinia";
import { ref } from "vue";
import type { Todo } from "../Types/Types";
import { ElMessage } from "element-plus";

export const useMainStore = defineStore("main", () => {
	const todos = ref<Todo[]>([]);

	function getTodos() {
		todos.value = JSON.parse(localStorage.getItem("todos")!) || [];
	}
	function formattedDate() {
		return new Date().toISOString().slice(0, 16).replace("T", " ");
	}
	function Save() {
		localStorage.setItem("todos", JSON.stringify(todos.value));
	}
	function addTodo(todo: Todo) {
		todos.value.push(todo);
		Save();
	}

	function deleteTodo(id: string) {
		const idx = todos.value.findIndex((t) => t.id === id);
		todos.value.splice(idx, 1);
		Save();
		notify("Successfully deleted todo", "warning");
	}
	function deleteTask(id: string[] | string, taskId: string) {
		const todo = todos.value.find((t) => t.id === id);
		const idx = todo?.list.findIndex((task) => task.id === taskId);
		todo?.list.splice(idx!, 1);
		notify("Successfully deleted task", "warning");
	}

	function getSingleTodo(id: string) {
		return todos.value.find((t) => t.id === id);
	}

	function notify(
		mess: string,
		type: "success" | "warning" | "error" = "success"
	) {
		return ElMessage({
			message: mess,
			type: type,
			plain: true,
		});
	}
	function copy(obj: Todo) {
		return JSON.parse(JSON.stringify(obj));
	}

	return {
		todos,
		addTodo,
		deleteTodo,
		getSingleTodo,
		Save,
		deleteTask,
		copy,
		formattedDate,
		getTodos,
		notify,
	};
});
