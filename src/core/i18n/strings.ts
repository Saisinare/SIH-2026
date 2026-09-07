// Centralised i18n strings for Hi / Mr / En
type LangKey = 'hi' | 'mr' | 'en';

interface Strings {
  appName: string;
  appTagline: string;
  getStarted: string;
  selectLanguage: string;
  // Intake
  businessIntake: string;
  villageName: string;
  villagePlaceholder: string;
  businessSector: string;
  requestedLoan: string;
  ownCapital: string;
  womanEntrepreneur: string;
  womanSubtitle: string;
  scStBeneficiary: string;
  scStSubtitle: string;
  analyzeViability: string;
  quickDemo: string;
  enterVillage: string;
  villageNotFound: string;
  // Loading
  analyzingPipeline: string;
  deterministicSteps: string;
  // Results
  viabilityReport: string;
  overview: string;
  market: string;
  cashflow: string;
  scheme: string;
  risk: string;
  shareReport: string;
  home: string;
  // Tabs
  assessment: string;
  insights: string;
  history: string;
  settings: string;
  // History
  assessmentHistory: string;
  noHistory: string;
  clearHistory: string;
  clearHistoryConfirm: string;
  cancel: string;
  delete: string;
  // Insights
  marketCreditInsights: string;
  mandiPrices: string;
  creditPlan: string;
  schemes: string;
  currentRate: string;
  // Settings
  settingsTitle: string;
  languagePreference: string;
  officerMode: string;
  officerModeDesc: string;
  bookmarkedSchemes: string;
  noBookmarks: string;
  aiNarration: string;
  // Verdict
  proceed: string;
  adjust: string;
  reconsider: string;
  spokenAdvisory: string;
  playAdvisory: string;
  stopAdvisory: string;
  dataSources: string;
  alternativeSectors: string;
  noActiveAssessment: string;
  startNewAssessment: string;
}

const strings: Record<LangKey, Strings> = {
  hi: {
    appName: 'उद्यम सारथी',
    appTagline: 'ग्रामीण उद्यमियों का स्मार्ट वित्तीय सलाहकार',
    getStarted: 'शुरू करें',
    selectLanguage: 'भाषा चुनें',
    businessIntake: 'व्यवसाय विवरण',
    villageName: '१. अपने गाँव का नाम',
    villagePlaceholder: 'उदा. Rampur, Nandgaon...',
    businessSector: '२. व्यापार का प्रकार',
    requestedLoan: '३. आवश्यक ऋण राशि',
    ownCapital: '४. अपनी उपलब्ध पूँजी',
    womanEntrepreneur: 'महिला उद्यमी',
    womanSubtitle: 'Stand-Up India / महिला सब्सिडी योजना',
    scStBeneficiary: 'SC / ST लाभार्थी',
    scStSubtitle: 'NBCFDC / विशेष साख लाभ',
    analyzeViability: 'व्यापार व्यवहार्यता जांचें',
    quickDemo: 'त्वरित डेमो परिदृश्य',
    enterVillage: 'कृपया गाँव का नाम दर्ज करें',
    villageNotFound: 'गाँव रिकॉर्ड में नहीं मिला',
    analyzingPipeline: 'व्यवहार्यता विश्लेषण चल रहा है...',
    deterministicSteps: '८ पारदर्शी गणितीय चरणों द्वारा गणना',
    viabilityReport: 'व्यवहार्यता रिपोर्ट',
    overview: 'सारांश',
    market: 'बाजार',
    cashflow: 'ऋण क्षमता',
    scheme: 'योजना',
    risk: 'जोखिम',
    shareReport: 'रिपोर्ट साझा करें',
    home: 'मुख्य पृष्ठ',
    assessment: 'मूल्यांकन',
    insights: 'अंतर्दृष्टि',
    history: 'इतिहास',
    settings: 'सेटिंग्स',
    assessmentHistory: 'पूर्व विश्लेषण इतिहास',
    noHistory: 'कोई पूर्व रिकॉर्ड उपलब्ध नहीं है',
    clearHistory: 'इतिहास हटाएं',
    clearHistoryConfirm: 'क्या आप सभी सहेजे गए रिकॉर्ड हटाना चाहते हैं?',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    marketCreditInsights: 'बाजार एवं साख अंतर्दृष्टि',
    mandiPrices: 'मंडी भाव',
    creditPlan: 'साख क्षमता',
    schemes: 'योजना कोष',
    currentRate: 'वर्तमान दर',
    settingsTitle: 'सेटिंग्स एवं संदर्भ',
    languagePreference: 'भाषा प्राथमिकता',
    officerMode: 'बैंक फील्ड अधिकारी मोड',
    officerModeDesc: 'शाखा प्रबंधक व ऋण मूल्यांकनकर्ता दृश्य',
    bookmarkedSchemes: 'सहेजी गई सरकारी योजनाएं',
    noBookmarks: 'कोई योजना बुकमार्क नहीं की गई है',
    aiNarration: 'AI वक्ता एवं मॉडल स्थिति',
    proceed: '✅ आगे बढ़ें',
    adjust: '⚠️ योजना सुधारें',
    reconsider: '🛑 पुनर्विचार करें',
    spokenAdvisory: 'वॉइस परामर्श',
    playAdvisory: 'परामर्श सुनें',
    stopAdvisory: 'रोकें',
    dataSources: 'डेटा स्रोत',
    alternativeSectors: 'वैकल्पिक व्यवसाय',
    noActiveAssessment: 'कोई सक्रिय मूल्यांकन नहीं मिला।',
    startNewAssessment: 'नया विश्लेषण शुरू करें',
  },
  mr: {
    appName: 'उद्यम सारथी',
    appTagline: 'ग्रामीण उद्योजकांचा स्मार्ट वित्तीय सल्लागार',
    getStarted: 'सुरू करा',
    selectLanguage: 'भाषा निवडा',
    businessIntake: 'व्यवसाय तपशील',
    villageName: '१. गावाचे नाव',
    villagePlaceholder: 'उदा. Rampur, Nandgaon...',
    businessSector: '२. व्यवसाय प्रकार',
    requestedLoan: '३. अपेक्षित कर्ज रक्कम',
    ownCapital: '४. स्वतःचे भांडवल',
    womanEntrepreneur: 'महिला उद्योजक',
    womanSubtitle: 'Stand-Up India / महिला अनुदान योजना',
    scStBeneficiary: 'SC / ST लाभार्थी',
    scStSubtitle: 'NBCFDC / विशेष साख लाभ',
    analyzeViability: 'व्यवसाय शक्यता तपासा',
    quickDemo: 'जलद डेमो',
    enterVillage: 'कृपया गावाचे नाव टाका',
    villageNotFound: 'गाव नोंदीत सापडले नाही',
    analyzingPipeline: 'व्यवहार्यता तपासणी सुरू आहे...',
    deterministicSteps: '८ पारदर्शी गणितीय टप्प्यांद्वारे गणना',
    viabilityReport: 'व्यवहार्यता अहवाल',
    overview: 'सारांश',
    market: 'बाजारपेठ',
    cashflow: 'कर्ज क्षमता',
    scheme: 'योजना',
    risk: 'जोखीम',
    shareReport: 'अहवाल शेअर करा',
    home: 'मुख्यपृष्ठ',
    assessment: 'मूल्यांकन',
    insights: 'अंतर्दृष्टी',
    history: 'इतिहास',
    settings: 'सेटिंग्ज',
    assessmentHistory: 'मागील मूल्यांकन इतिहास',
    noHistory: 'कोणत्याही मागील नोंदी नाहीत',
    clearHistory: 'इतिहास हटवा',
    clearHistoryConfirm: 'सर्व जतन केलेल्या नोंदी हटवायच्या आहेत का?',
    cancel: 'रद्द करा',
    delete: 'हटवा',
    marketCreditInsights: 'बाजारपेठ आणि साख अंतर्दृष्टी',
    mandiPrices: 'मंडी भाव',
    creditPlan: 'साख क्षमता',
    schemes: 'योजना',
    currentRate: 'सध्याचा दर',
    settingsTitle: 'सेटिंग्ज आणि संदर्भ',
    languagePreference: 'भाषा प्राधान्य',
    officerMode: 'बँक फील्ड अधिकारी मोड',
    officerModeDesc: 'शाखा व्यवस्थापक आणि कर्ज मूल्यांकन दृश्य',
    bookmarkedSchemes: 'जतन केलेल्या सरकारी योजना',
    noBookmarks: 'कोणतीही योजना बुकमार्क केलेली नाही',
    aiNarration: 'AI वक्ता आणि मॉडेल स्थिती',
    proceed: '✅ पुढे जा',
    adjust: '⚠️ योजनेत बदल करा',
    reconsider: '🛑 फेरविचार करा',
    spokenAdvisory: 'आवाज सल्ला',
    playAdvisory: 'सल्ला ऐका',
    stopAdvisory: 'थांबवा',
    dataSources: 'डेटा स्रोत',
    alternativeSectors: 'पर्यायी व्यवसाय',
    noActiveAssessment: 'कोणतेही सक्रिय मूल्यांकन सापडले नाही.',
    startNewAssessment: 'नवीन मूल्यांकन सुरू करा',
  },
  en: {
    appName: 'Udyam Saarthi',
    appTagline: 'Smart rural business viability advisor',
    getStarted: 'Get Started',
    selectLanguage: 'Select Language',
    businessIntake: 'Business Intake',
    villageName: '1. Village Name',
    villagePlaceholder: 'e.g. Rampur, Nandgaon...',
    businessSector: '2. Business Sector',
    requestedLoan: '3. Requested Loan',
    ownCapital: '4. Own Capital',
    womanEntrepreneur: 'Women Entrepreneur',
    womanSubtitle: 'Stand-Up India / Women subsidy schemes',
    scStBeneficiary: 'SC/ST Beneficiary',
    scStSubtitle: 'NBCFDC / Special credit benefits',
    analyzeViability: 'Analyze Viability',
    quickDemo: 'Quick Demo Presets',
    enterVillage: 'Please enter village name',
    villageNotFound: 'Village not found in records',
    analyzingPipeline: 'Analyzing Viability Pipeline...',
    deterministicSteps: 'Deterministic 8-stage verification pipeline',
    viabilityReport: 'Viability Report',
    overview: 'Overview',
    market: 'Market',
    cashflow: 'Cashflow',
    scheme: 'Scheme',
    risk: 'Risk',
    shareReport: 'Share Report',
    home: 'Home',
    assessment: 'Home',
    insights: 'Insights',
    history: 'History',
    settings: 'Settings',
    assessmentHistory: 'Assessment History',
    noHistory: 'No past assessments found',
    clearHistory: 'Clear History',
    clearHistoryConfirm: 'Delete all saved assessment records?',
    cancel: 'Cancel',
    delete: 'Delete',
    marketCreditInsights: 'Market & Credit Insights',
    mandiPrices: 'Mandi Prices',
    creditPlan: 'Credit Plan',
    schemes: 'Schemes',
    currentRate: 'Current Rate',
    settingsTitle: 'Settings & Portal Controls',
    languagePreference: 'Language Selection',
    officerMode: 'Bank Officer / Institutional View',
    officerModeDesc: 'Lead bank applicant portfolio & review simulation',
    bookmarkedSchemes: 'Bookmarked Schemes',
    noBookmarks: 'No saved schemes yet. Bookmark schemes from Insights.',
    aiNarration: 'AI Narration Mode',
    proceed: '✅ Proceed',
    adjust: '⚠️ Adjust Plan',
    reconsider: '🛑 Reconsider',
    spokenAdvisory: 'Spoken Advisory',
    playAdvisory: 'Play Advisory',
    stopAdvisory: 'Stop',
    dataSources: 'Data Sources',
    alternativeSectors: 'Promising Alternatives',
    noActiveAssessment: 'No active assessment found.',
    startNewAssessment: 'Start New Assessment',
  },
};

export default strings;
export type { LangKey };
