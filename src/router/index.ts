import { createWebHistory, createRouter } from "vue-router";
import Home from "../components/Home.vue";
import About from "../components/About.vue";
import FileExplorerView from "../views/FileExplorerView.vue";

const routes = [
    {
        path: "/",
        name: "FileExplorer",
        component: FileExplorerView,
    },
    {
        path: "/home",
        name: "Home2",
        component: Home,
    },
    {
        path: "/about",
        name: "About",
        component: About,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;