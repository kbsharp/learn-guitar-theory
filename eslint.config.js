import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					varsIgnorePattern: '^_',
					argsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_'
				}
			]
		}
	},
	{
		// Flat config's `ignores` replaces the old `.eslintignore` file, which
		// ESLint 9 no longer supports — keeping one around only bought a
		// deprecation warning on every single lint run, in every CI log.
		// node_modules is ignored by default and doesn't need listing.
		ignores: [
			'.svelte-kit/**',
			'build/**',
			'dist/**',
			'package/**',
			'*.config.*',
			'package-lock.json',
			'.env',
			'.env.*',
			'!.env.example'
		]
	}
);
