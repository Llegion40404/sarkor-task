import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			name: "home",
			path: "/",
			component: Home,
		},
		{
			name: "edit",
			path: "/edit/:id?",
			component: () => import("../views/EditTodo.vue"),
			alias: "/create",
		},
	],
});

export default router;
