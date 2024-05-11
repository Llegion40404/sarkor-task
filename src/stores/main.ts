import { defineStore } from "pinia";
import { ref } from "vue";
import type { Todo } from "../Types/Todo";

export const useMainStore = defineStore("main", () => {
	const todos = ref<Todo[]>(JSON.parse(localStorage.getItem("todos")!) || []);
	const isOverlayActive = ref(false);

	function formattedDate() {
		return new Date().toISOString().slice(0, 16).replace("T", " ");
	}

	function toggleOverlay() {
		isOverlayActive.value = !isOverlayActive.value;
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
	}
	function deleteTask(id: string[] | string, taskId: string) {
		const todo = todos.value.find((t) => t.id === id);
		const idx = todo?.list.findIndex((task) => task.id === taskId);
		todo?.list.splice(idx!, 1);
	}

	function getSingleTodo(id: string | string[]) {
		return todos.value.find((t) => t.id === id);
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
		isOverlayActive,
		deleteTask,
		toggleOverlay,
		copy,
		formattedDate,
	};
});
