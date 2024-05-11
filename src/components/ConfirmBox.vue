<script setup lang="ts">
import type { Task, Todo } from "@/Types/Todo";
import router from "@/router/index";
import { useMainStore } from "@/stores/main";
import { useRoute } from "vue-router";

const props = defineProps<{ todo?: Todo; task?: Task }>();
const emit = defineEmits(["close"]);
const route = useRoute();
const { deleteTodo, deleteTask } = useMainStore();

const onDelete = () => {
	if (props.todo) {
		deleteTodo(props?.todo?.id!);
		emit("close");
		if (route.path !== "/") router.push("/");
	} else {
		deleteTask(route?.params?.id, props.task?.id!);
		emit("close");
	}
};
</script>
<template>
	<section>
		<div class="bg-zinc-800 p-5 rounded-md center z-20">
			<slot>
				<div v-if="todo" class="w-auto flex flex-col justify-between gap-5">
					<div class="flex flex-col gap-2">
						<h4>
							You are going to delete todo:
							<span class="text-2xl text-orange-500">"{{ todo?.title }}"</span>
						</h4>

						<p>
							With
							<span class="text-green-500">{{ todo?.list.length }}</span>
							tasks
						</p>
						<p>Create at: {{ todo?.createdAt }}</p>
						<div class="flex justify-between mt-3">
							<el-button @click="emit('close')" type="success"
								>Cancel</el-button
							>
							<el-button @click="onDelete" type="danger">Delete</el-button>
						</div>
					</div>
				</div>

				<div v-else>
					<h4>
						{{
							task?.isDone
								? `Delete "` + task?.text + `"?`
								: `Task "` + task?.text + `" is not completed!`
						}}
					</h4>
					<p class="text-base text-gray-400 my-3">
						Was created at: {{ task?.createdAt }}
					</p>
					<div class="relative flex justify-between mt-5">
						<el-button @click="emit('close')" type="success">Cancel</el-button>
						<el-button @click="onDelete" type="danger">Delete</el-button>
					</div>
				</div>
			</slot>
		</div>
	</section>
</template>
