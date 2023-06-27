import { createWebHistory, createRouter } from "vue-router";
import FileExplorerView from "@/file-explorer/views/FileExplorerView.vue";
import TranscriptionEditorView from "@/transcription-editor/views/TranscriptionEditorView.vue";
import ResourceView from "@/resource/views/ResourceView.vue";

const routes = [
    {
        path: "/",
        name: "FileExplorer",
        component: FileExplorerView,
    },
    {
        path: "/transcription-editor",
        name: "TranscriptionEditor",
        component: TranscriptionEditorView,
    },
    {
        path: "/resource",
        name: "Resource",
        component: ResourceView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;