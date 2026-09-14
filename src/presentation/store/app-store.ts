import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Assessment } from '../../data/services/assessment-service';
import { Village } from '../../domain/models/village';
import { AssessmentRecord } from '../../domain/models/assessment-record';

const HISTORY_KEY = 'udyam_history';
const BOOKMARKS_KEY = 'udyam_bookmarks';
const ONBOARDING_KEY = 'udyam_onboarding';

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

interface OnboardingData {
  isOnboarded: boolean;
  phoneNumber: string;
  businessType: 'new' | 'existing' | null;
  userAnswers: Record<string, string>;
  locale?: Locale;
}

async function loadOnboarding(): Promise<OnboardingData | null> {
  try {
    const raw = await AsyncStorage.getItem(ONBOARDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

async function saveOnboarding(data: OnboardingData) {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(data));
  } catch (_) {}
}

type Locale = 'hi' | 'mr' | 'en';

interface AppState {
  // Locale
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // Onboarding
  isOnboarded: boolean;
  setIsOnboarded: (val: boolean) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  businessType: 'new' | 'existing' | null;
  setBusinessType: (type: 'new' | 'existing' | null) => void;
  userAnswers: Record<string, string>;
  setUserAnswer: (key: string, answer: string) => void;
  onboardingLoaded: boolean;
  loadOnboardingFromStorage: () => Promise<void>;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

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
  // The full backend assessment, not just the flattened verdict: run_id,
  // narration and the provenance-carrying envelope must stay reachable from
  // the screens that have to show where a number came from.
  verdict: Assessment | null;
  setVerdict: (verdict: Assessment | null) => void;

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
  setLocale: (locale) => {
    set({ locale });
    const current = get();
    saveOnboarding({
      isOnboarded: current.isOnboarded,
      phoneNumber: current.phoneNumber,
      businessType: current.businessType,
      userAnswers: current.userAnswers,
      locale,
    });
  },

  isOnboarded: false,
  setIsOnboarded: (val) => set({ isOnboarded: val }),
  phoneNumber: '',
  setPhoneNumber: (phone) => set({ phoneNumber: phone }),
  businessType: null,
  setBusinessType: (type) => set({ businessType: type }),
  userAnswers: {},
  setUserAnswer: (key, answer) => set((state) => ({ userAnswers: { ...state.userAnswers, [key]: answer } })),
  onboardingLoaded: false,
  loadOnboardingFromStorage: async () => {
    if (get().onboardingLoaded) return;
    const data = await loadOnboarding();
    if (data) {
      set({
        isOnboarded: data.isOnboarded ?? false,
        phoneNumber: data.phoneNumber ?? '',
        businessType: data.businessType ?? null,
        userAnswers: data.userAnswers ?? {},
        locale: data.locale || get().locale,
        onboardingLoaded: true,
      });
    } else {
      set({ onboardingLoaded: true });
    }
  },
  completeOnboarding: () => {
    set({ isOnboarded: true });
    const current = get();
    saveOnboarding({
      isOnboarded: true,
      phoneNumber: current.phoneNumber,
      businessType: current.businessType,
      userAnswers: current.userAnswers,
      locale: current.locale,
    });
  },
  resetOnboarding: () => {
    set({ isOnboarded: false, phoneNumber: '', businessType: null, userAnswers: {} });
    saveOnboarding({
      isOnboarded: false,
      phoneNumber: '',
      businessType: null,
      userAnswers: {},
      locale: get().locale,
    });
  },

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
