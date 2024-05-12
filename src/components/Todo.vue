<script setup lang="ts">
import type { Todo } from "@/Types/Types";
import Checkbox from "./Checkbox.vue";
import { computed, ref } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import ConfirmBox from "./ConfirmBox.vue";

const props = defineProps<{ todo: Todo }>();
const isOpen = ref(false);
const rest = computed(() =>
	props.todo.list.length > 3 ? props.todo.list.length - 3 + " task(s) more" : ""
);
</script>

<template>
	<div>
		<ConfirmBox v-if="isOpen" @close="isOpen = !isOpen" :todo="todo" />
		<article class="bg-zinc-500 p-5 pb-2 relative rounded flexCol">
			<div class="flex gap-5 absolute top-3 right-5">
				<RouterLink :to="`/edit/${todo.id}`"
					><el-button size="default" type="warning" :icon="Edit"></el-button>
				</RouterLink>
				<el-button
					size="default"
					@click="isOpen = !isOpen"
					:icon="Delete"
					type="danger"></el-button>
			</div>
			<h2 class="text-3xl">{{ todo.title }}</h2>
			<section v-if="todo.list.length > 0" class="flexCol gap-2 py-5 border-t">
				<h3 class="text-lg">Tasks:</h3>
				<Checkbox
					v-for="(task, idx) in todo.list.slice(0, 3)"
					:home="true"
					:task="task"
					:idx="idx"
					:key="task.id" />
				<RouterLink :to="`/edit/${todo.id}`" class="text-lime-400">{{
					rest
				}}</RouterLink>
			</section>
			<p
				class="text-3xl mx-auto my-5 bg-gradient-to-r from-blue-600 to-fuchsia-500 bg-clip-text text-transparent w-max"
				v-else>
				No tasks huh?
			</p>
			<footer class="text-right text-zinc-300">
				Created: {{ todo.createdAt }}
			</footer>
		</article>
	</div>
</template>
