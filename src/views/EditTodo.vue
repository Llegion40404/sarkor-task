<script setup lang="ts">
import type { Task, Todo } from "@/Types/Todo";
import { onMounted, ref } from "vue";
import { useMainStore } from "@/stores/main";
import Checkbox from "../components/Checkbox.vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { v4 as uid } from "uuid";
import router from "@/router/index";
import ConfirmBox from "@/components/ConfirmBox.vue";
import { Close } from "@element-plus/icons-vue";

const { addTodo, getSingleTodo, Save, toggleOverlay, copy, formattedDate } =
	useMainStore();
const route = useRoute();

const isCreating = route.path.endsWith("create");

const isOpen = ref(false);
const leaving = ref(false);
const isDeleting = ref(false);
const confirmLeaving = ref(false);

const taskTitle = ref("");

let todo = ref<Todo>({
	completedAt: "",
	createdAt: "",
	id: "",
	list: [],
	title: "",
});
let initTodo: Todo;
let currTodo: Todo;

const toggleVis = () => {
	isOpen.value = !isOpen.value;
	toggleOverlay();
};
const isLeaving = () => {
	leaving.value = !leaving.value;
	toggleOverlay();
};
const toggleDelete = () => {
	isDeleting.value = !isDeleting.value;
	toggleOverlay();
};
const leave = () => {
	confirmLeaving.value = true;
	toggleOverlay();
	router.push("/");
};

function onAdd() {
	if (todo.value.title.trim().length > 0) {
		if (isCreating) {
			todo.value.createdAt = formattedDate();
			addTodo(todo.value);
			router.push("/");
		} else {
			initTodo = todo.value;
			Save();
		}
	} else {
	}
}
function addTask() {
	const task = {
		text: taskTitle.value.trim(),
		id: uid(),
		isDone: false,
		createdAt: formattedDate(),
		doneAt: "",
	};
	if (todo.value.list.length < 15 && taskTitle.value.length > 0) {
		todo.value.list.push(task);
		toggleVis();
		taskTitle.value = "";
	}
}

function revert() {
	currTodo = copy(todo.value);
	todo.value = copy(initTodo);
}
function currentState() {
	todo.value = copy(currTodo);
}

onMounted(() => {
	if (!isCreating) {
		todo.value = getSingleTodo(route?.params?.id)!;
		initTodo = copy(todo.value);
	}
});

onBeforeRouteLeave(() => {
	isLeaving();
	if (confirmLeaving.value) {
		toggleOverlay();
		return true;
	}
	return false;
});
</script>

<template>
	<div class="bg-zinc-600 rounded p-5">
		<ConfirmBox v-if="isDeleting" :todo="todo" @close="toggleDelete" />
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
				<el-button @click="toggleDelete" type="danger">Delete</el-button>
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
					<Checkbox v-for="task in todo.list" :key="task.id" :task="task" />
				</div>
				<el-button type="warning" @click="toggleVis" class="w-max">
					Add task
				</el-button>
				<div
					v-show="isOpen"
					class="flex items-center gap-3 absolute top-0 left-1/3 bg-zinc-800 rounded-md z-20 p-10 pt-14">
					<el-icon :size="30" class="!absolute top-3 right-3" @click="toggleVis"
						><Close
					/></el-icon>
					<el-input clearable v-model="taskTitle" />
					<el-button type="success" @click="addTask">Add</el-button>
				</div>
			</section>
			<div class="flex justify-between">
				<RouterLink to="/ "
					><el-button type="danger">Cancel</el-button></RouterLink
				>
				<el-button @click="onAdd" type="success">Save</el-button>
			</div>
		</form>
		<ConfirmBox v-if="leaving">
			<p class="text-2xl">Changes won't save!</p>
			<div class="relative flex justify-between mt-5">
				<el-button type="success" @click="isLeaving">Stay</el-button>
				<el-button type="danger" @click="leave">Leave</el-button>
			</div>
		</ConfirmBox>
	</div>
</template>
