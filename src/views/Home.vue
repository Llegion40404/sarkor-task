<script setup lang="ts">
import Todo from "@/components/Todo.vue";
import { useMainStore } from "../stores/main";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const { todos } = storeToRefs(useMainStore());

onMounted(() => {
	todos.value = JSON.parse(localStorage.getItem("todos")!);
});
</script>

<template>
	<main>
		<section
			class="grid grid-cols-3 gap-5 duration-500"
			v-if="todos.length > 0">
			<Todo v-for="todo in todos" :key="todo.id" :todo="todo" />
		</section>
		<article class="text-center text-3xl mx-auto w-1/3 p-10" v-else>
			Uh oh...
			<p>No todos!</p>
			<RouterLink to="/create" class="btnGreen inline-block mt-10 p-5"
				>Create one!</RouterLink
			>
		</article>
	</main>
</template>
