const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'ux-speak';
const isGithubPages = process.env.GITHUB_PAGES === 'true';

/** Chemin de base SvelteKit, sans slash final (ex. `/ux-speak`). */
export const basePath =
	process.env.BASE_PATH ?? (isGithubPages ? `/${repoName}` : '');

/** Base Vite, avec slash final (ex. `/ux-speak/`). */
export const viteBase = basePath ? `${basePath}/` : '/';

export function withBase(path = '/') {
	const normalized = path.startsWith('/') ? path : `/${path}`;
	return `${basePath}${normalized}` || '/';
}

export const githubPagesUrl = `https://${process.env.GITHUB_REPOSITORY_OWNER ?? 'YOUR_USERNAME'}.github.io${withBase('/')}`;
