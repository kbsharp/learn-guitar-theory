import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess({
        style: {
            css:{
                preprocessorOptions: {
                    scss: {
                        additionalData: `@import "./src/routes/styles/main.scss";`,
                    }
                },
            }
        }
    }), 

	kit: {
		adapter: adapter()
	}
};

export default config;
