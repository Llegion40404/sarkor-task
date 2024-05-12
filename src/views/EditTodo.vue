<script setup lang="ts">
import type { Todo } from "@/Types/Types";
import { onBeforeMount, ref, watch } from "vue";
import { useMainStore } from "@/stores/main";
import Checkbox from "../components/Checkbox.vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { v4 as uid } from "uuid";
import router from "@/router/index";
import ConfirmBox from "@/components/ConfirmBox.vue";

const { addTodo, getSingleTodo, Save, copy, formattedDate, notify, getTodos } =
	useMainStore();
const route = useRoute();

const isCreating = route.path.endsWith("create");

const isOpen = ref(false);
const leaving = ref(false);
const isCreated = ref(false);
const isSaved = ref(true);
const isReverting = ref(false);
const isDeleting = ref(false);
const confirmLeaving = ref(false);

const taskTitle = ref("");

let todo = ref<Todo>({
	completedAt: "",
	createdAt: "",
	id: uid(),
	list: [],
	title: "",
});
let initTodo: Todo;
let currTodo: Todo;

const leave = () => {
	confirmLeaving.value = true;
	router.push({ path: "/" });
};

function onAdd() {
	if (todo.value.title.trim().length > 0) {
		if (isCreating) {
			todo.value.createdAt = formattedDate();
			addTodo(todo.value);
			isCreated.value = true;
			router.push({ path: "/" });
			notify("Successfully added new todo!");
		} else {
			initTodo = todo.value;
			notify("Saved changes!");
			isSaved.value = true;
			Save();
		}
	} else {
	}
}
function addTask() {
	const task = {
		title: taskTitle.value.trim(),
		id: uid(),
		isDone: false,
		createdAt: formattedDate(),
		doneAt: "",
	};
	if (todo.value.list.length < 15) {
		if (taskTitle.value.length > 0) {
			todo.value.list.push(task);
			isOpen.value = false;
			taskTitle.value = "";
		} else notify("Give a name to yor task!", "warning");
	} else {
		notify("Limit of 15 tasks reached!", "warning");
	}
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
		leaving.value = !leaving.value;
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
				<el-input clearable v-model="taskTitle" />
				<el-button type="success" @click="addTask">Add</el-button>
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
		<el-dialog v-model="leaving">
			<template #header>Changes won't save!</template>
			<div class="flex gap-5 my-3">
				<el-button type="success" @click="leaving = false">Stay</el-button>
				<el-button type="danger" @click="leave">Leave</el-button>
			</div>
		</el-dialog>
	</div>
</template>
