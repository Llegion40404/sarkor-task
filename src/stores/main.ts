import { defineStore } from "pinia";
import { ref } from "vue";
import type { Todo } from "../Types/Types";
import { ElMessage } from "element-plus";

export const useMainStore = defineStore("main", () => {
	const todos = ref<Todo[]>([]);

	function getTodos() {
		todos.value = JSON.parse(localStorage.getItem("todos")!) || [];
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

	return {
		todos,
		addTodo,
		deleteTodo,
		getTodos,
		notify,
	};
});
