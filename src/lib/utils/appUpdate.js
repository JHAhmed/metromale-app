import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

const DEFAULT_MANIFEST_URL = 'https://app.metromaleclinic.com/app-version.json';
const CHECK_INTERVAL_MS = 30 * 60 * 1000;

let lastCheckAt = 0;

function fetchWithTimeout(url, timeoutMs) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

	return fetch(url, { cache: 'no-store', signal: controller.signal }).finally(() => {
		clearTimeout(timeoutId);
	});
}

function compareVersions(left, right) {
	const a = String(left || '0')
		.split(/[.-]/)
		.map((part) => Number.parseInt(part, 10) || 0);
	const b = String(right || '0')
		.split(/[.-]/)
		.map((part) => Number.parseInt(part, 10) || 0);

	for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
		const difference = (a[index] || 0) - (b[index] || 0);
		if (difference !== 0) return difference;
	}

	return 0;
}

function isNewerVersion(current, target) {
	const currentBuild = Number.parseInt(current.build, 10);
	const targetBuild = Number.parseInt(target.build, 10);

	if (Number.isFinite(currentBuild) && Number.isFinite(targetBuild) && targetBuild !== currentBuild) {
		return targetBuild > currentBuild;
	}

	return compareVersions(target.version, current.version) > 0;
}

function getPlatformManifest(manifest, platform) {
	const platformManifest = manifest?.[platform];
	if (!platformManifest || typeof platformManifest !== 'object') return null;

	return {
		latestVersion: platformManifest.latestVersion,
		latestBuild: platformManifest.latestBuild,
		minimumVersion: platformManifest.minimumVersion,
		minimumBuild: platformManifest.minimumBuild,
		storeUrl: platformManifest.storeUrl || '',
		notes: platformManifest.notes || ''
	};
}

function isBelowMinimum(current, target) {
	const currentBuild = Number.parseInt(current.build, 10);
	const minimumBuild = Number.parseInt(target.minimumBuild, 10);

	if (Number.isFinite(currentBuild) && Number.isFinite(minimumBuild) && minimumBuild !== currentBuild) {
		return currentBuild < minimumBuild;
	}

	return compareVersions(current.version, target.minimumVersion) < 0;
}

/**
 * Check the public version manifest. The manifest is deliberately external
 * to the binary so a minimum-version rule can be changed without another app
 * release. If the endpoint is unavailable, the current app keeps working.
 */
export async function checkForAppUpdate({ force = false } = {}) {
	if (!Capacitor.isNativePlatform()) return null;
	if (!force && Date.now() - lastCheckAt < CHECK_INTERVAL_MS) return null;

	lastCheckAt = Date.now();

	try {
		const [{ version, build }, response] = await Promise.all([
			App.getInfo(),
			fetchWithTimeout(import.meta.env.PUBLIC_APP_UPDATE_MANIFEST_URL || DEFAULT_MANIFEST_URL, 8000)
		]);

		if (!response.ok) return null;

		const platform = Capacitor.getPlatform();
		const target = getPlatformManifest(await response.json(), platform);
		if (!target?.latestVersion) return null;

		const current = { version, build };
		const updateAvailable = isNewerVersion(current, {
			version: target.latestVersion,
			build: target.latestBuild
		});
		const required = isBelowMinimum(current, {
			version: target.minimumVersion || target.latestVersion,
			build: target.minimumBuild ?? target.latestBuild
		});

		if (!updateAvailable && !required) return null;

		return {
			currentVersion: version,
			latestVersion: target.latestVersion,
			storeUrl: target.storeUrl,
			notes: target.notes,
			required
		};
	} catch (error) {
		console.warn('App update check skipped:', error);
		return null;
	}
}
