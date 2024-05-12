<script setup lang="ts">
import type { Task, Todo } from "@/Types/Types";
import { useMainStore } from "@/stores/main";

const props = defineProps<{
	todo: Todo;
	task?: Task;
	isTodo?: boolean;
}>();
const emit = defineEmits(["close"]);
const visible = true;
const { deleteTask, deleteTodo } = useMainStore();
</script>
<template>
	<div>
		<el-dialog v-model="visible">
			<template #header>
				<p class="text-2xl">
					You're about to delete {{ !task ? "todo" : "task" }}
					<span class="text-orange-400">"{{ task?.title ?? todo.title }}"</span>
				</p>
			</template>
			<p
				class="text-white text-base"
				v-if="todo?.list && todo?.list.length > 0">
				With <span class="text-green-500">{{ todo?.list.length }}</span>
				task(s)
			</p>
			<p class="text-zinc-300">Was created: {{ todo?.createdAt || "now" }}</p>
			<template #footer>
				<el-button type="success" @click="emit('close')">Cancel</el-button>
				<el-button v-if="todo" type="danger" @click="deleteTodo(todo.id)"
					>Delete</el-button
				>
				<el-button
					v-else
					type="danger"
					@click="deleteTask((todo! as Todo)?.id, task?.id!)"
					>Delete</el-button
				>
			</template>
		</el-dialog>
	</div>
</template>
