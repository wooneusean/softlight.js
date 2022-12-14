/** @type {import('vite').UserConfig} */
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, "src/softlight.ts"),
            name: "SoftLight.js",
            // the proper extensions will be added
            fileName: "softlight",
        },
    },
});
