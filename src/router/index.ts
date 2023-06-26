import { createWebHistory, createRouter } from "vue-router";
import FileExplorerView from "../views/FileExplorerView.vue";
import ProjectView from "../views/ProjectView.vue";

const routes = [
    {
        path: "/",
        name: "FileExplorer",
        component: FileExplorerView,
    },
    {
        path: "/project",
        name: "Project",
        component: ProjectView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;