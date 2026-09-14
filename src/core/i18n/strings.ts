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
  // Onboarding
  welcomeTitle: string;
  welcomeSubtitle: string;
  signupTitle: string;
  phoneLabel: string;
  phonePlaceholder: string;
  sendOtp: string;
  enterOtp: string;
  verifyOtp: string;
  invalidPhone: string;
  invalidOtp: string;
  selectLanguageTitle: string;
  selectLanguageSubtitle: string;
  businessTypeTitle: string;
  businessTypeSubtitle: string;
  newBusinessTitle: string;
  newBusinessDesc: string;
  existingBusinessTitle: string;
  existingBusinessDesc: string;
  voiceQATitle: string;
  voiceQASubtitle: string;
  typeAnswerPlaceholder: string;
  nextQuestion: string;
  finishOnboarding: string;
  skipStep: string;
  recordingActive: string;
  listening: string;
  tapToSpeak: string;
  qNew1: string;
  qNew2: string;
  qNew3: string;
  qEx1: string;
  qEx2: string;
  qEx3: string;
}

const strings: Record<LangKey, Strings> = {
  hi: {
    appName: 'उद्यम सारथी',
    appTagline: 'ग्रामीण उद्यमियों का स्मार्ट वित्तीय सलाहकार',
    getStarted: 'शुरू करें',
    selectLanguage: 'भाषा चुनें',
    businessIntake: 'व्यवसाय विवरण',
    villageName: '१. अपने गाँव का नाम',
    villagePlaceholder: 'उदा. निमगाव, संगमनेर...',
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
    // Onboarding Hindi
    welcomeTitle: 'उद्यम सारथी में आपका स्वागत है',
    welcomeSubtitle: 'आपका अपना AI ग्रामीण व्यवसाय सलाहकार',
    signupTitle: 'मोबाइल नंबर दर्ज करें',
    phoneLabel: '10 अंकों का मोबाइल नंबर',
    phonePlaceholder: '9876543210',
    sendOtp: 'OTP भेजें',
    enterOtp: '4 अंकों का OTP दर्ज करें',
    verifyOtp: 'सत्यापित करें और आगे बढ़ें',
    invalidPhone: 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें',
    invalidOtp: 'कृपया 4 अंकों का OTP दर्ज करें',
    selectLanguageTitle: 'अपनी भाषा चुनें',
    selectLanguageSubtitle: 'आप उद्यम सारथी का उपयोग किस भाषा में करना चाहते हैं?',
    businessTypeTitle: 'आपकी व्यावसायिक स्थिति',
    businessTypeSubtitle: 'कृपया चुनें कि आप नया व्यवसाय शुरू कर रहे हैं या मौजूदा व्यवसाय बढ़ा रहे हैं',
    newBusinessTitle: 'नया व्यवसाय (New Business)',
    newBusinessDesc: 'मैं एक नया व्यवसाय या उद्यम शुरू करना चाहता हूँ',
    existingBusinessTitle: 'मौजूदा व्यवसाय (Existing Business)',
    existingBusinessDesc: 'मेरा पहले से व्यवसाय है और मैं इसे बढ़ाना चाहता हूँ',
    voiceQATitle: 'AI सलाहकार से बातचीत',
    voiceQASubtitle: 'माइक दबाकर बोलें या उत्तर टाइप करें',
    typeAnswerPlaceholder: 'अपना उत्तर यहाँ लिखें...',
    nextQuestion: 'अगला प्रश्न',
    finishOnboarding: 'मुख्य पृष्ठ पर जाएं',
    skipStep: 'आगे बढ़ें (Skip)',
    recordingActive: 'सुन रहा है... बोलिए',
    listening: 'माइक सक्रिय है',
    tapToSpeak: 'बोलने के लिए माइक दबाएं',
    qNew1: 'आप कौन सा नया व्यवसाय शुरू करना चाहते हैं?',
    qNew2: 'आपका व्यवसाय किस स्थान/गाँव में होगा?',
    qNew3: 'शुरू करने के लिए आपको कितनी पूँजी या ऋण की आवश्यकता है?',
    qEx1: 'आपका वर्तमान व्यवसाय क्या है और आप इसे कितने समय से चला रहे हैं?',
    qEx2: 'आपकी मासिक बिक्री या औसत आय कितनी है?',
    qEx3: 'व्यवसाय के विस्तार के लिए आपकी मुख्य आवश्यकता क्या है?',
  },
  mr: {
    appName: 'उद्यम सारथी',
    appTagline: 'ग्रामीण उद्योजकांचा स्मार्ट वित्तीय सल्लागार',
    getStarted: 'सुरू करा',
    selectLanguage: 'भाषा निवडा',
    businessIntake: 'व्यवसाय तपशील',
    villageName: '१. गावाचे नाव',
    villagePlaceholder: 'उदा. निमगाव, संगमनेर...',
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
    // Onboarding Marathi
    welcomeTitle: 'उद्यम सारथी मध्ये आपले स्वागत आहे',
    welcomeSubtitle: 'तुमचा स्वतःचा AI ग्रामीण व्यवसाय सल्लागार',
    signupTitle: 'मोबाइल नंबर टाका',
    phoneLabel: '१० अंकी मोबाइल नंबर',
    phonePlaceholder: '9876543210',
    sendOtp: 'OTP पाठवा',
    enterOtp: '४ अंकी OTP टाका',
    verifyOtp: 'सत्यापित करा आणि पुढे जा',
    invalidPhone: 'कृपया १० अंकी वैध मोबाइल नंबर टाका',
    invalidOtp: 'कृपया ४ अंकी OTP टाका',
    selectLanguageTitle: 'तुमची भाषा निवडा',
    selectLanguageSubtitle: 'तुम्हाला उद्यम सारथी कोणत्या भाषेत वापरायचे आहे?',
    businessTypeTitle: 'तुमची व्यावसायिक स्थिती',
    businessTypeSubtitle: 'तुम्ही नवीन व्यवसाय सुरू करत आहात की सध्याचा व्यवसाय वाढवत आहात?',
    newBusinessTitle: 'नवीन व्यवसाय (New Business)',
    newBusinessDesc: 'मला एक नवीन व्यवसाय सुरू करायचा आहे',
    existingBusinessTitle: 'सध्याचा व्यवसाय (Existing Business)',
    existingBusinessDesc: 'माझा आधीपासूनच व्यवसाय आहे आणि मला तो वाढवायचा आहे',
    voiceQATitle: 'AI सल्लागाराशी संवाद',
    voiceQASubtitle: 'माईक दाबून बोला किंवा उत्तर टाईप करा',
    typeAnswerPlaceholder: 'तुमचे उत्तर येथे लिहा...',
    nextQuestion: 'पुढील प्रश्न',
    finishOnboarding: 'मुख्यपृष्ठावर जा',
    skipStep: 'पुढे जा (Skip)',
    recordingActive: 'ऐकत आहे... बोला',
    listening: 'माईक सुरू आहे',
    tapToSpeak: 'बोलण्यासाठी माईक दाबा',
    qNew1: 'तुम्हाला कोणता नवीन व्यवसाय सुरू करायचा आहे?',
    qNew2: 'तुमचा व्यवसाय कोणत्या ठिकाणी किंवा गावात असेल?',
    qNew3: 'सुरू करण्यासाठी तुम्हाला किती भांडवल किंवा कर्जाची गरज आहे?',
    qEx1: 'तुमचा सध्याचा व्यवसाय काय आहे आणि तुम्ही तो किती काळापासून करत आहात?',
    qEx2: 'तुमची सरासरी मासिक विक्री किंवा उत्पन्न किती आहे?',
    qEx3: 'व्यवसाय वाढवण्यासाठी तुमची मुख्य गरज काय आहे?',
  },
  en: {
    appName: 'Udyam Saarthi',
    appTagline: 'Smart rural business viability advisor',
    getStarted: 'Get Started',
    selectLanguage: 'Select Language',
    businessIntake: 'Business Intake',
    villageName: '1. Village Name',
    villagePlaceholder: 'e.g. Nimgaon, Sangamner...',
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
    // Onboarding English
    welcomeTitle: 'Welcome to Udyam Saarthi',
    welcomeSubtitle: 'Your AI Rural Business Viability Advisor',
    signupTitle: 'Enter Mobile Number',
    phoneLabel: '10-digit Mobile Number',
    phonePlaceholder: '9876543210',
    sendOtp: 'Send OTP',
    enterOtp: 'Enter 4-digit OTP',
    verifyOtp: 'Verify & Continue',
    invalidPhone: 'Please enter a valid 10-digit mobile number',
    invalidOtp: 'Please enter a valid 4-digit OTP',
    selectLanguageTitle: 'Select Your Language',
    selectLanguageSubtitle: 'In which language would you like to use Udyam Saarthi?',
    businessTypeTitle: 'Your Business Status',
    businessTypeSubtitle: 'Are you starting a new business or expanding an existing one?',
    newBusinessTitle: 'New Business',
    newBusinessDesc: 'I want to start a brand new business venture',
    existingBusinessTitle: 'Existing Business',
    existingBusinessDesc: 'I already have a business and want to expand it',
    voiceQATitle: 'AI Advisor Interaction',
    voiceQASubtitle: 'Speak via mic or type your answers below',
    typeAnswerPlaceholder: 'Type your answer here...',
    nextQuestion: 'Next Question',
    finishOnboarding: 'Go to Home',
    skipStep: 'Skip to Home',
    recordingActive: 'Listening... speak now',
    listening: 'Microphone active',
    tapToSpeak: 'Tap mic to speak',
    qNew1: 'What type of new business do you plan to start?',
    qNew2: 'Where will your business be located?',
    qNew3: 'How much capital or loan do you require?',
    qEx1: 'What is your current business and how long have you been running it?',
    qEx2: 'What is your average monthly revenue or income?',
    qEx3: 'What is your primary requirement for expanding?',
  },
};

export default strings;
export type { LangKey };
