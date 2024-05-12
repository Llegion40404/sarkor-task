<script setup lang="ts">
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { onBeforeMount, ref, watch } from "vue";
import router from "@/router/index";
import { useMainStore } from "@/stores/main";
import { useTodoStore } from "@/stores/todo";
import ConfirmBox from "@/components/ConfirmBox.vue";
import Checkbox from "../components/Checkbox.vue";
import { v4 as uid } from "uuid";
import type { Todo } from "@/Types/Types";

const { addTodo, notify, getTodos } = useMainStore();
const { getSingleTodo, Save, copy, formattedDate, addTask } = useTodoStore();
const route = useRoute();

const isCreating = route.path.endsWith("create");

const isOpen = ref(false);
const isLeaving = ref(false);
const isDeleting = ref(false);

const isSaved = ref(true);
const isReverting = ref(false);
const isCreated = ref(false);
const confirmLeaving = ref(false);

const taskTitle = ref("");

let todo = ref<Todo>({
	createdAt: "",
	id: uid(),
	list: [],
	title: "",
});
let initTodo: Todo;
let currTodo: Todo;

function leave() {
	confirmLeaving.value = true;
	router.push({ path: "/" });
}
function newTask() {
	addTask(todo.value, taskTitle.value);
	isOpen.value = false;
	taskTitle.value = "";
}

function onAdd() {
	if (todo.value.title.trim().length > 0) {
		if (isCreating) {
			isCreated.value = true;
			todo.value.createdAt = formattedDate();
			addTodo(todo.value);
			notify("Successfully added new todo!");
			router.push({ path: "/" });
		} else {
			initTodo = todo.value;
			isSaved.value = true;
			notify("Saved changes!");
			Save();
		}
	} else notify("Enter a valid title!", "error");
}

function revert() {
	isReverting.value = true;
	if (initTodo && initTodo.title) {
		todo.value = copy(initTodo);
		notify("Rolled back to last save!");
	} else notify("No saves yet!", "warning");
	isReverting.value = false;
}
function currentState() {
	if (currTodo) {
		todo.value = copy(currTodo);
		notify("Last unsaved changes returned");
	} else notify("No saves yet!", "warning");
}

watch(
	todo,
	(newTodo, oldTodo) => {
		if (!isReverting.value) {
			currTodo = copy(newTodo);
		}
		if (newTodo == oldTodo) isSaved.value = false;
	},
	{ deep: true }
);

onBeforeRouteLeave(() => {
	if (isCreated.value || isSaved.value) {
		return true;
	} else {
		isLeaving.value = !isLeaving.value;
		if (confirmLeaving.value) {
			return true;
		}
		return false;
	}
});

onBeforeMount(() => {
	if (!isCreating) {
		getTodos();
		todo.value = getSingleTodo(route?.params?.id as string)!;
		initTodo = copy(todo.value);
	}
});
</script>

<template>
	<div class="bg-zinc-600 rounded p-5">
		<el-dialog v-model="isOpen">
			<template #header>Add a new task</template>
			<div class="flex gap-5 my-3">
				<el-input class="!text-lg" clearable v-model="taskTitle" />
				<el-button type="success" @click="newTask">Add</el-button>
			</div>
		</el-dialog>
		<ConfirmBox
			v-if="isDeleting"
			@close="isDeleting = !isDeleting"
			:todo="todo" />
		<div class="flex justify-between">
			<h1 class="text-2xl">
				{{ isCreating ? "Create a new todo" : "Change existing todo" }}
			</h1>
			<div>
				<el-tooltip effect="dark" placement="bottom">
					<template #content
						><p class="text-base">Roll back to the last save</p></template
					>
					<el-button @click="revert" type="warning">Revert</el-button>
				</el-tooltip>
				<el-tooltip effect="dark" placement="bottom">
					<template #content
						><p class="text-base">Return last unsaved changes</p></template
					>
					<el-button @click="currentState" type="success"
						>Current state</el-button
					>
				</el-tooltip>
				<el-button @click="isDeleting = !isDeleting" type="danger"
					>Delete</el-button
				>
			</div>
		</div>
		<form id="form" @submit.prevent="onAdd" class="mt-3 flexCol gap-5 relative">
			<label :for="todo?.title">
				<span class="text-xl mr-5">Todo title:</span>
				<el-input
					size="large"
					class="!text-lg"
					style="width: fit-content"
					v-model="todo.title"
					clearable
					:name="todo.title" />
			</label>
			<section class="flexCol gap-5 border-y py-5">
				<h3 class="text-xl">
					{{ todo?.list?.length > 0 ? "Tasks:" : "Create a task!" }}
				</h3>

				<div
					v-if="todo.list.length > 0"
					class="flexCol flex-wrap max-h-[30vh] gap-4">
					<Checkbox
						v-for="task in todo.list"
						:key="task.id"
						:task="task"
						:todo="todo" />
				</div>
				<el-button type="warning" @click="isOpen = !isOpen" class="w-max">
					Add task
				</el-button>
			</section>
			<div class="flex justify-between">
				<RouterLink to="/"
					><el-button type="danger">Cancel</el-button></RouterLink
				>
				<el-button native-type="submit" type="success">Save</el-button>
			</div>
		</form>
		<el-dialog v-model="isLeaving">
			<template #header>Changes won't save!</template>
			<div class="flex gap-5 my-3">
				<el-button type="success" @click="isLeaving = false">Stay</el-button>
				<el-button type="danger" @click="leave">Leave</el-button>
			</div>
		</el-dialog>
	</div>
</template>
