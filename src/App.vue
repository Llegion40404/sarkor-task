<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

window.onbeforeunload = function () {
	if (route.path !== "/") return confirm("");
};
</script>

<template>
	<main>
		<nav class="bg-emerald-600">
			<div class="container py-7 flex justify-between">
				<RouterLink class="text-2xl" to="/">Home</RouterLink>
				<el-button tag="router-link" to="/create" type="danger">
					Create todo
				</el-button>
			</div>
		</nav>
		<section class="container py-5">
			<RouterView :key="route.path" />
		</section>
	</main>
</template>
