import AsyncStorage from '@react-native-async-storage/async-storage';

export class LocalStorageService {
  static async saveString(key: string, value: string) {
    await AsyncStorage.setItem(key, value);
  }

  static async getString(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  static async saveNumber(key: string, value: number) {
    await AsyncStorage.setItem(key, String(value));
  }

  static async getNumber(key: string): Promise<number | undefined> {
    const val = await AsyncStorage.getItem(key);
    return val ? Number(val) : undefined;
  }

  static async saveBoolean(key: string, value: boolean) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  static async getBoolean(key: string): Promise<boolean | undefined> {
    const val = await AsyncStorage.getItem(key);
    return val ? JSON.parse(val) : undefined;
  }

  static async saveObject<T>(key: string, value: T) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  static async getObject<T>(key: string): Promise<T | undefined> {
    const json = await AsyncStorage.getItem(key);
    if (json) {
      try {
        return JSON.parse(json) as T;
      } catch (e) {
        console.error('Failed to parse object from storage', e);
        return undefined;
      }
    }
    return undefined;
  }

  static async remove(key: string) {
    await AsyncStorage.removeItem(key);
  }

  static async clearAll() {
    await AsyncStorage.clear();
  }
}

