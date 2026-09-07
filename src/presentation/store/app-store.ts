import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VerdictResult } from '../../domain/models/engine-results';
import { Village } from '../../domain/models/village';
import { AssessmentRecord } from '../../domain/models/assessment-record';

const HISTORY_KEY = 'udyam_history';
const BOOKMARKS_KEY = 'udyam_bookmarks';

async function loadHistory(): Promise<AssessmentRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as AssessmentRecord[]) : [];
  } catch (_) {
    return [];
  }
}

async function saveHistory(records: AssessmentRecord[]) {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(records));
  } catch (_) {}
}

async function loadBookmarks(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch (_) {
    return [];
  }
}

async function saveBookmarks(schemes: string[]) {
  try {
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(schemes));
  } catch (_) {}
}

type Locale = 'hi' | 'mr' | 'en';

interface AppState {
  // Locale
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // Village search / intake
  selectedVillage: Village | null;
  setVillage: (village: Village | null) => void;
  sector: string;
  setSector: (sector: string) => void;
  loanAmount: number;
  setLoanAmount: (amount: number) => void;
  availableCapital: number;
  setAvailableCapital: (amount: number) => void;
  isWoman: boolean;
  setIsWoman: (val: boolean) => void;
  isScSt: boolean;
  setIsScSt: (val: boolean) => void;

  // Active verdict
  verdict: VerdictResult | null;
  setVerdict: (verdict: VerdictResult | null) => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Assessment history (persisted via AsyncStorage)
  history: AssessmentRecord[];
  historyLoaded: boolean;
  loadHistoryFromStorage: () => Promise<void>;
  addToHistory: (record: AssessmentRecord) => void;
  clearHistory: () => void;

  // Bookmarked schemes (persisted via AsyncStorage)
  bookmarkedSchemes: string[];
  bookmarksLoaded: boolean;
  loadBookmarksFromStorage: () => Promise<void>;
  toggleBookmark: (schemeName: string) => void;
  isBookmarked: (schemeName: string) => boolean;

  // Officer mode
  officerMode: boolean;
  setOfficerMode: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  locale: 'hi',
  setLocale: (locale) => set({ locale }),

  selectedVillage: null,
  setVillage: (village) => set({ selectedVillage: village }),

  sector: 'Kirana Store',
  setSector: (sector) => set({ sector }),

  loanAmount: 50000,
  setLoanAmount: (amount) => set({ loanAmount: amount }),

  availableCapital: 20000,
  setAvailableCapital: (amount) => set({ availableCapital: amount }),

  isWoman: false,
  setIsWoman: (val) => set({ isWoman: val }),

  isScSt: false,
  setIsScSt: (val) => set({ isScSt: val }),

  verdict: null,
  setVerdict: (verdict) => set({ verdict }),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  history: [],
  historyLoaded: false,
  loadHistoryFromStorage: async () => {
    if (get().historyLoaded) return;
    const records = await loadHistory();
    set({ history: records, historyLoaded: true });
  },
  addToHistory: (record) => {
    const updated = [record, ...get().history];
    set({ history: updated });
    saveHistory(updated);
  },
  clearHistory: () => {
    set({ history: [] });
    saveHistory([]);
  },

  bookmarkedSchemes: [],
  bookmarksLoaded: false,
  loadBookmarksFromStorage: async () => {
    if (get().bookmarksLoaded) return;
    const schemes = await loadBookmarks();
    set({ bookmarkedSchemes: schemes, bookmarksLoaded: true });
  },
  toggleBookmark: (schemeName) => {
    const current = get().bookmarkedSchemes;
    const updated = current.includes(schemeName)
      ? current.filter((s) => s !== schemeName)
      : [...current, schemeName];
    set({ bookmarkedSchemes: updated });
    saveBookmarks(updated);
  },
  isBookmarked: (schemeName) => get().bookmarkedSchemes.includes(schemeName),

  officerMode: false,
  setOfficerMode: (val) => set({ officerMode: val }),
}));
