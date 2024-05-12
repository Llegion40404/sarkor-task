<script setup lang="ts">
import type { Task, Todo } from "@/Types/Types";
import { ref } from "vue";
import { Delete } from "@element-plus/icons-vue";
import ConfirmBox from "./ConfirmBox.vue";

const props = defineProps<{
	task: Task;
	todo?: Todo;
	idx?: number;
	home?: boolean;
}>();

const isOpen = ref( false )

</script>

<template>
	<p class="flex" >
		<p class="flex text-xl items-center">
			<input
			v-if="!home"
			class="w-5 h-5 mr-1 "
			type="checkbox"
			v-model="task.isDone"
			:name="task.title" />
			<span v-if="home"> {{ idx! + 1 }}.  </span>
			<div class="ml-3"v-if="home" >
				<i class="fa-solid text-base" :class="task.isDone?'fa-check text-green-600':'fa-xmark text-rose-600'"></i>
			</div>
			<input required type="text" v-model="task.title" :disabled="home" class="bg-transparent ml-2" :class="!home?'border-b-2 p-1 px-3 border-sky-500':''">
		</p>
		<div v-if="!home">
			<el-button size="default" @click="isOpen=!isOpen" type=danger class="ml-5 mt-2" :icon="Delete"></el-button>
		</div>
		<ConfirmBox @close="isOpen=!isOpen" v-show="isOpen" :todo="todo!" :task="task" :isTodo="false"/>
	</p>

	</template>
