<script setup lang="ts">
import { ArrowLeft } from "@element-plus/icons-vue";
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
			<el-button tag="router-link" type="info" class="absolute left-10" to="/"
				><el-icon class="mr-1"><ArrowLeft /></el-icon>Back</el-button
			>
			<RouterView :key="route.path" />
		</section>
	</main>
</template>
