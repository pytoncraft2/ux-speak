import { browser } from '$app/environment';

const DISMISS_KEY = 'ux-speak-pwa-banner-dismissed';

export interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function checkInstalled(): boolean {
	if (!browser) return false;
	return (
		window.matchMedia('(display-mode: standalone)').matches ||
		(navigator as Navigator & { standalone?: boolean }).standalone === true
	);
}

function detectIos(): boolean {
	if (!browser) return false;
	return (
		/iphone|ipad|ipod/i.test(navigator.userAgent) &&
		!(window as Window & { MSStream?: unknown }).MSStream
	);
}

class PwaInstallStore {
	installEvent = $state<BeforeInstallPromptEvent | null>(null);
	isInstalled = $state(false);
	bannerDismissed = $state(false);
	showIosHelp = $state(false);
	showUnsupportedHelp = $state(false);
	isIos = $state(false);
	initialized = $state(false);

	get showBanner(): boolean {
		return this.initialized && !this.isInstalled && !this.bannerDismissed;
	}

	init(): void {
		if (!browser || this.initialized) return;

		this.isInstalled = checkInstalled();
		this.isIos = detectIos();
		this.bannerDismissed = localStorage.getItem(DISMISS_KEY) === 'true';
		this.initialized = true;

		const onInstallReady = (e: Event) => {
			e.preventDefault();
			this.installEvent = e as BeforeInstallPromptEvent;
		};

		const onInstalled = () => {
			this.isInstalled = true;
			this.installEvent = null;
			this.showIosHelp = false;
			this.showUnsupportedHelp = false;
		};

		window.addEventListener('beforeinstallprompt', onInstallReady);
		window.addEventListener('appinstalled', onInstalled);
	}

	dismissBanner(): void {
		this.bannerDismissed = true;
		if (browser) {
			localStorage.setItem(DISMISS_KEY, 'true');
		}
	}

	closeHelp(): void {
		this.showIosHelp = false;
		this.showUnsupportedHelp = false;
	}

	async install(): Promise<void> {
		if (this.installEvent) {
			await this.installEvent.prompt();
			const { outcome } = await this.installEvent.userChoice;
			if (outcome === 'accepted') {
				this.installEvent = null;
			}
			return;
		}

		if (this.isIos) {
			this.showIosHelp = true;
			return;
		}

		this.showUnsupportedHelp = true;
	}
}

export const pwaInstall = new PwaInstallStore();

export function getPwaInstall() {
	return pwaInstall;
}
