import { createWebHistory, createRouter } from "vue-router";
import Home from "../components/Home.vue";
import About from "../components/About.vue";
import FileExplorerView from "../views/FileExplorerView.vue";
import TestComponentsView from "../views/TestComponentsView.vue";
import VideoView from "../views/VideoView.vue";
import AudioView from "../views/AudioView.vue";

const routes = [
    {
        path: "/",
        name: "FileExplorer",
        component: TestComponentsView,
    },
    // {
    //     path: "/",
    //     name: "FileExplorer",
    //     component: FileExplorerView,
    // },
    {
        path: "/video",
        name: "Video",
        component: VideoView,
    },
    {
        path: "/audio",
        name: "Audio",
        component: AudioView,
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