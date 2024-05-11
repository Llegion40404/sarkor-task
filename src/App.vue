<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMainStore } from "./stores/main";
import { useRoute } from "vue-router";

const route = useRoute();
const { isOverlayActive } = storeToRefs(useMainStore());

window.onbeforeunload = function () {
	if (route.path !== "/") return confirm("");
};
</script>

<template>
	<main>
		<div
			v-show="isOverlayActive"
			class="fullscrn bg-black bg-opacity-30 z-10"></div>
		<nav class="bg-emerald-600">
			<div class="container py-7 flex justify-between">
				<RouterLink class="text-2xl" to="/">Home</RouterLink>
				<RouterLink to="/create">
					<el-button type="danger"> Create todo </el-button>
				</RouterLink>
			</div>
		</nav>
		<section class="container py-5">
			<RouterView />
		</section>
	</main>
</template>
