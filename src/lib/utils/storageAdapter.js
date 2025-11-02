import { Preferences } from '@capacitor/preferences';

export const storageAdapter = {

	async getItem(key) {
		const { value } = await Preferences.get({ key });
		return value;
	},

	async setItem(key, value) {
		await Preferences.set({ key, value });
	},

	async removeItem(key) {
		await Preferences.remove({ key });
	},

	async getObject(key) {
		const ret = await Preferences.get({ key });
		return JSON.parse(ret.value);
	},

	async setObject(key, object) {
		await Preferences.set({
			key,
			value: JSON.stringify(object)
		});
	},

	async removeObject(key) {
		await Preferences.remove({ key });
	}

};
