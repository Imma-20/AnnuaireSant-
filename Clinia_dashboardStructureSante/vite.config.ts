import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // Correctly imports the SWC React plugin
import path from "path"; // Used for path resolution
import { componentTagger } from "lovable-tagger"; // Your custom plugin

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Makes your development server accessible externally (e.g., from other devices on your network)
    port: 8080, // Sets the development server port to 8080
  },
  plugins: [
    react(), // This is the crucial part that enables JSX support via SWC
    mode === 'development' &&
    componentTagger(), // Your custom plugin, only active in development mode
  ].filter(Boolean), // Removes any 'false' values from the plugins array (useful for conditional plugins)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Configures an alias so you can use '@' for './src' imports
    },
  },
}));