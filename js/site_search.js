/**
 * KSA Malayali Hub — Global Instant Live Search Engine (v25)
 * Instant 1-letter typeahead with grouped categories, bilingual & Manglish matching,
 * and direct navigation across all tools, restaurants, clinics, travel, and library.
 */

(function () {
  "use strict";

  // Common Manglish to Malayalam & English keyword synonym dictionary
  const MANGLISH_MAP = {
    "digambaran": ["ദിഗംബരൻ", "digambaran", "ai", "chatbot", "സഹായി"],
    "riddle": ["കുസൃതിച്ചോദ്യം", "കുസൃതി", "riddle", "joke", "തമാശ"],
    "kusruthi": ["കുസൃതിച്ചോദ്യം", "കുസൃതി", "riddle", "kusruthi"],
    "joke": ["തമാശ", "കുസൃതി", "joke", "riddle"],
    "iqama": ["ഇഖാമ", "iqama", "id card", "residence"],
    "ikama": ["ഇഖാമ", "iqama"],
    "huroob": ["ഹുറൂബ്", "huroob", "absconding"],
    "khuroob": ["ഹുറൂബ്", "huroob"],
    "gratuity": ["ഗ്രാറ്റുവിറ്റി", "eosb", "സർവീസ്", "service benefits", "article 84", "article 85"],
    "eosb": ["ഗ്രാറ്റുവിറ്റി", "eosb", "service benefits"],
    "service": ["സർവീസ്", "ഗ്രാറ്റുവിറ്റി", "eosb"],
    "hospital": ["ആശുപത്രി", "ക്ലിനിക്ക്", "hospital", "clinic", "abeer", "badr"],
    "clinic": ["ക്ലിനിക്ക്", "clinic", "polyclinic", "ആശുപത്രി"],
    "doctor": ["ഡോക്ടർ", "doctor", "physician", "ക്ലിനിക്ക്"],
    "train": ["ട്രെയിൻ", "ഹറമൈൻ", "train", "haramain", "sar"],
    "haramain": ["ഹറമൈൻ", "ട്രെയിൻ", "haramain", "high speed"],
    "bus": ["ബസ്", "സാപ്റ്റ്കോ", "bus", "saptco"],
    "saptco": ["സാപ്റ്റ്കോ", "ബസ്", "saptco", "bus"],
    "sim": ["സിം", "sim", "stc", "mobily", "zain", "virgin", "salam", "red bull"],
    "stc": ["stc", "സവാ", "sawa", "സിം", "balance"],
    "mobily": ["mobily", "മൊബൈലി", "സിം", "balance"],
    "zain": ["zain", "സൈൻ", "സിം", "balance"],
    "gold": ["സ്വർണ്ണം", "സ്വർണ്ണവില", "gold rate", "24k", "22k"],
    "swarnam": ["സ്വർണ്ണം", "സ്വർണ്ണവില", "gold"],
    "riyal": ["റിയാൽ", "sar", "currency", "exchange rate", "കറൻസി"],
    "sar": ["റിയാൽ", "sar", "riyal", "currency"],
    "rate": ["നിരക്ക്", "rate", "currency", "gold"],
    "flight": ["ഫ്ലൈറ്റ്", "വിമാനം", "flight", "tracker", "airport"],
    "biriyani": ["ബിരിയാണി", "biriyani", "biryani", "food"],
    "biryani": ["ബിരിയാണി", "biriyani", "biryani"],
    "porotta": ["പൊറോട്ട", "porotta", "parotta"],
    "chai": ["ചായ", "tea", "chai"],
    "tea": ["ചായ", "tea"],
    "mandi": ["കുഴിമന്തി", "മന്തി", "mandi", "mandhi"],
    "mandhi": ["കുഴിമന്തി", "മന്തി", "mandhi"],
    "hotel": ["ഹോട്ടൽ", "hotel", "restaurant", "ഭക്ഷണം"],
    "restaurant": ["റെസ്റ്റോറന്റ്", "restaurant", "hotel"],
    "norka": ["നോർക്ക", "norka", "ക്ഷേമനിധി", "പെൻഷൻ", "pension"],
    "pravasi": ["പ്രവാസി", "pravasi", "welfare", "ക്ഷേമനിധി"],
    "pension": ["പെൻഷൻ", "pension", "ക്ഷേമനിധി", "നോർക്ക"],
    "emergency": ["എമർജൻസി", "അടിയന്തരം", "emergency", "911", "പോലീസ്", "ആംബുലൻസ്"],
    "police": ["പോലീസ്", "police", "999"],
    "ambulance": ["ആംബുലൻസ്", "ambulance", "997"],
    "embassy": ["എംബസി", "embassy", "consulate", "കോൺസുലേറ്റ്"],
    "medicine": ["മരുന്ന്", "medicine", "banned", "കസ്റ്റംസ്"],
    "banned": ["നിരോധിത", "banned", "കസകസ്", "ട്രമഡോൾ"],
    "kasakas": ["കസകസ്", "poppy seeds", "khaskhas"],
    "tramadol": ["ട്രമഡോൾ", "tramadol", "painkiller"],
    "stadium": ["സ്റ്റേഡിയം", "stadium", "fifa", "2034"],
    "fifa": ["ഫിഫ", "fifa", "world cup", "football"],
    "football": ["ഫുട്ബോൾ", "football", "fifa", "stadium"],
    "neom": ["നിയോം", "neom", "the line", "trojena", "oxagon"],
    "qiddiya": ["ഖിദ്ദിയ", "qiddiya", "six flags"],
    "vision": ["വിഷൻ 2030", "vision 2030"],
    "prayer": ["നമസ്കാരം", "prayer", "namaz", "salah", "സമയം"],
    "namaz": ["നമസ്കാരം", "namaz", "prayer"],
    "hijri": ["ഹിജ്‌രി", "hijri", "calendar", "കലണ്ടർ"],
    "scam": ["തട്ടിപ്പ്", "scam", "തട്ടിപ്പ് ജാഗ്രത", "fraud"],
    "court": ["കോടതി", "court", "തൊഴിൽ കോടതി", "legal", "najiz"],
    "legal": ["ലീഗൽ", "legal", "നിയമ സഹായം", "കോടതി"],
    "pdf": ["pdf", "ഡൗൺലോഡ്", "download", "ഗൈഡ്", "guide"],
    "guide": ["ഗൈഡ്", "guide", "സഹായി", "pdf"],
    "book": ["പുസ്തകം", "book", "ലൈബ്രറി", "library", "ബഷീർ", "മാധവിക്കുട്ടി"],
    "library": ["ഇ-ലൈബ്രറി", "library", "വായന", "പുസ്തകം"],
    "dictionary": ["ഡിക്ഷണറി", "dictionary", "നിഘണ്ടു", "വാക്കുകൾ", "അറബിക്"],
    "translator": ["ട്രാൻസ്ലേറ്റർ", "translator", "വോയ്സ്", "പരിഭാഷ"],
    "offers": ["ഓഫറുകൾ", "offers", "ലുലു", "നെസ്റ്റോ", "പാണ്ട", "flyer"],
    "lulu": ["ലുലു", "lulu", "hypermarket", "ഓഫർ"],
    "nesto": ["നെസ്റ്റോ", "nesto", "hypermarket", "ഓഫർ"],
    "panda": ["പാണ്ട", "panda", "hypermarket", "ഓഫർ"],
    "cinema": ["സിനിമ", "cinema", "vox", "muvi", "amc", "ott"],
    "ott": ["ഒടിടി", "ott", "റിലീസ്", "cinema"]
  };

  // Base Tools & Services Dataset
  const BASE_TOOLS = [
    {
      id: "tool-digambaran",
      category: "tools",
      categoryLabel: "🛠️ ടൂളുകൾ & സഹായി",
      icon: "🧙‍♂️",
      title: "ദിഗംബരൻ AI സഹായി & കുസൃതിച്ചോദ്യങ്ങൾ",
      titleEn: "Digambaran AI Assistant & Riddles",
      subtitle: "100% ഓഫ്‌ലൈൻ AI ചാറ്റ്ബോട്ട് & 18+ രസകരമായ കുസൃതിച്ചോദ്യങ്ങൾ",
      url: "javascript:window.openDigambaran()",
      keywords: ["digambaran", "ai", "bot", "chatbot", "riddle", "joke", "kusruthi", "ദിഗംബരൻ", "കുസൃതി", "തമാശ", "ചോദ്യം", "സഹായി"]
    },
    {
      id: "tool-eosb",
      category: "tools",
      categoryLabel: "🛠️ ടൂളുകൾ & സഹായി",
      icon: "💰",
      title: "സൗദി സർവീസ് ആനുകൂല്യ (EOSB) കാൽക്കുലേറ്റർ",
      titleEn: "Saudi End of Service Gratuity Calculator",
      subtitle: "ആർട്ടിക്കിൾ 84 & 85 പ്രകാരമുള്ള ഗ്രാറ്റുവിറ്റി തുക കണക്കാക്കാം",
      url: "/sahayi#eosb-calc-section",
      keywords: ["eosb", "gratuity", "calculator", "resignation", "termination", "ആർട്ടിക്കിൾ", "സർവീസ്", "ശമ്പളം", "സെർവീസ് ആനുകൂല്യം"]
    },
    {
      id: "tool-emergency",
      category: "tools",
      categoryLabel: "🛠️ ടൂളുകൾ & സഹായി",
      icon: "🆘",
      title: "24/7 പ്രവാസി എമർജൻസി ഹെൽപ്പ്‌ലൈനുകൾ",
      titleEn: "24/7 Emergency Helplines (911, 999, Embassy)",
      subtitle: "911 ഏകീകൃത എമർജൻസി, പോലീസ്, ആംബുലൻസ്, ഇന്ത്യൻ എംബസി & കോൺസുലേറ്റ്",
      url: "/sahayi#emergency",
      keywords: ["emergency", "911", "999", "997", "embassy", "consulate", "പോലീസ്", "ആംബുലൻസ്", "എംബസി", "ഹെൽപ്പ്‌ലൈൻ"]
    },
    {
      id: "tool-translator",
      category: "tools",
      categoryLabel: "🛠️ ടൂളുകൾ & സഹായി",
      icon: "🎙️",
      title: "3-ഭാഷാ തൊഴിലാളി വോയ്സ് ട്രാൻസ്ലേറ്റർ",
      titleEn: "3-Language Voice Translator (Arabic, English, Hindi)",
      subtitle: "മലയാളം ⇄ അറബിക്, ഇംഗ്ലീഷ്, ഹിന്ദി സംസാര പരിഭാഷകൻ",
      url: "/health#voice-translator-section",
      keywords: ["translator", "voice", "speech", "arabic", "english", "hindi", "വോയ്സ്", "ട്രാൻസ്ലേറ്റർ", "പരിഭാഷ", "അറബിക്"]
    },
    {
      id: "tool-sim-codes",
      category: "tools",
      categoryLabel: "🛠️ ടൂളുകൾ & സഹായി",
      icon: "📱",
      title: "സൗദി സിം കാർഡ് ബാലൻസ് & ഓഫർ കോഡുകൾ",
      titleEn: "Saudi SIM Card Balance & USSD Codes",
      subtitle: "STC, Mobily, Zain, Virgin, Salam, Red Bull ബാലൻസ് ചെക്കർ",
      url: "/sahayi#sim-codes-section",
      keywords: ["sim", "stc", "mobily", "zain", "virgin", "salam", "red bull", "ussd", "balance", "സിം", "ബാലൻസ്"]
    },
    {
      id: "tool-prayer-calendar",
      category: "tools",
      categoryLabel: "🛠️ ടൂളുകൾ & സഹായി",
      icon: "🕌",
      title: "ലൈവ് സൗദി നമസ്കാര സമയം & ഹിജ്‌രി കലണ്ടർ",
      titleEn: "Live Saudi Prayer Times & Umm Al-Qura Hijri Calendar",
      subtitle: "11 സൗദി നഗരങ്ങളിലെ കൃത്യമായ നമസ്കാര സമയവും തീയതി കൺവെർട്ടറും",
      url: "/saudi#saudi-prayer-calendar-section",
      keywords: ["prayer", "namaz", "salah", "azan", "hijri", "calendar", "നമസ്കാരം", "ഹിജ്‌രി", "കലണ്ടർ", "സമയം"]
    },
    {
      id: "tool-norka",
      category: "tools",
      categoryLabel: "🛠️ ടൂളുകൾ & സഹായി",
      icon: "🏛️",
      title: "നോർക്ക റൂട്ട്സ് & പ്രവാസി ക്ഷേമനിധി ഗൈഡ്",
      titleEn: "NORKA Roots & Pravasi Welfare Pension Guide",
      subtitle: "നോർക്ക ഐഡി കാർഡ്, ക്ഷേമനിധി പെൻഷൻ ₹3,500/മാസം, സാന്ത്വന സഹായം",
      url: "/norka",
      keywords: ["norka", "roots", "pension", "welfare", "santhwana", "നോർക്ക", "ക്ഷേമനിധി", "പെൻഷൻ", "പ്രവാസി ഐഡി"]
    },
    {
      id: "tool-iqama-huroob",
      category: "tools",
      categoryLabel: "🛠️ ടൂളുകൾ & സഹായി",
      icon: "📄",
      title: "ഇഖാമ & ഹുറൂബ് സ്റ്റാറ്റസ് ചെക്ക് ഗൈഡ്",
      titleEn: "Iqama & Huroob Status Verification Guide (Absher/Qiwa)",
      subtitle: "അബ്ഷീർ, ഖിവ, തൊഴിൽ മന്ത്രാലയ പോർട്ടലുകൾ പരിശോധിക്കാനുള്ള ഗൈഡ്",
      url: "/sahayi#iqama",
      keywords: ["iqama", "huroob", "absher", "qiwa", "mhrsd", "ഇഖാമ", "ഹുറൂബ്", "അബ്ഷീർ", "ഖിവ"]
    },
    {
      id: "tool-legal-courts",
      category: "tools",
      categoryLabel: "🛠️ ടൂളുകൾ & സഹായി",
      icon: "⚖️",
      title: "പ്രവാസി ലീഗൽ എയ്ഡ് & തൊഴിൽ കോടതികൾ",
      titleEn: "Pravasi Legal Aid, Najiz & Saudi Labor Court",
      subtitle: "തൊഴിൽ തർക്കങ്ങൾ, വേതന സംരക്ഷണം (WPS), നജീസ് ഓൺലൈൻ പരാതി",
      url: "/sahayi#legal-and-courts",
      keywords: ["legal", "court", "lawyer", "advocate", "najiz", "wps", "കോടതി", "നിയമ സഹായം", "വക്കീൽ", "തൊഴിൽ തർക്കം"]
    },
    {
      id: "tool-scam-checker",
      category: "tools",
      categoryLabel: "🛠️ ടൂളുകൾ & സഹായി",
      icon: "🛡️",
      title: "സൗദി ഓൺലൈൻ തട്ടിപ്പ് ജാഗ്രത (Scam Checker)",
      titleEn: "Saudi Online Scam & Fraud Checker",
      subtitle: "വ്യാജ വിസ, ഫേക്ക് കോളിംഗ്, ക്രിപ്റ്റോ തട്ടിപ്പുകൾ തിരിച്ചറിയാനുള്ള ടൂൾ",
      url: "/sahayi#scam-checker-section",
      keywords: ["scam", "fraud", "fake visa", "call", "crypto", "തട്ടിപ്പ്", "വ്യാജ വിസ", "സുരക്ഷ"]
    },
    {
      id: "tool-sar-gold",
      category: "tools",
      categoryLabel: "🛠️ ടൂളുകൾ & സഹായി",
      icon: "💱",
      title: "ലൈവ് റിയാൽ നിരക്ക് & 24K/22K സ്വർണ്ണവില",
      titleEn: "Live SAR Exchange Rate & Gold Prices",
      subtitle: "തത്സമയ കറൻസി കാൽക്കുലേറ്റർ & 29 സൗദി ബാങ്കുകളുടെ ഐബാൻ ചെക്കർ",
      url: "/#remittance",
      keywords: ["sar", "riyal", "currency", "exchange", "gold", "iban", "റിയാൽ", "സ്വർണ്ണം", "സ്വർണ്ണവില", "ഐബാൻ"]
    },
    {
      id: "tool-mall-offers",
      category: "tools",
      categoryLabel: "🛠️ ടൂളുകൾ & സഹായി",
      icon: "🛍️",
      title: "സൂപ്പർമാർക്കറ്റ് & മാൾ ഓഫറുകൾ",
      titleEn: "Supermarket & Mall Weekly Promotion Flyers",
      subtitle: "ലുലു, നെസ്റ്റോ, പാണ്ട, ഗ്രാൻഡ് ഹൈപ്പർ ഓഫർ കാറ്റലോഗുകൾ",
      url: "/#hypers",
      keywords: ["offers", "lulu", "nesto", "panda", "grand hyper", "flyer", "ഓഫർ", "മാൾ", "സൂപ്പർമാർക്കറ്റ്"]
    },
    {
      id: "tool-cinemas-ott",
      category: "tools",
      categoryLabel: "🛠️ ടൂളുകൾ & സഹായി",
      icon: "🎬",
      title: "സിനിമകൾ & മലയാളം OTT റിലീസുകൾ",
      titleEn: "Saudi Cinemas & Malayalam OTT Releases",
      subtitle: "വോക്സ്, മുവി, എഎംസി സിനിമാ ടൈമിംഗുകളും പുതിയ OTT മൂവികളും",
      url: "/#cinemas",
      keywords: ["cinemas", "vox", "muvi", "amc", "ott", "movies", "സിനിമ", "തിയേറ്റർ", "ഒടിടി"]
    },
    {
      id: "pdf-survival-guide",
      category: "tools",
      categoryLabel: "🛠️ ടൂളുകൾ & സഹായി",
      icon: "📥",
      title: "സൗദി പ്രവാസി സമ്പൂർണ്ണ ഗൈഡ് (Full PDF)",
      titleEn: "Download Full Pravasi Survival Guide PDF",
      subtitle: "എമർജൻസി, തൊഴിൽ നിയമം, ഇഖാമ, മരുന്നുകൾ, സിം കോഡുകൾ അടങ്ങിയ സമ്പൂർണ്ണ PDF",
      url: "javascript:window.downloadFullPravasiGuidePdf()",
      keywords: ["pdf", "guide", "survival", "download", "സമ്പൂർണ്ണ ഗൈഡ്", "ഡൗൺലോഡ്", "പിഡിഎഫ്"]
    },
    {
      id: "pdf-dictionary",
      category: "tools",
      categoryLabel: "🛠️ ടൂളുകൾ & സഹായി",
      icon: "📖",
      title: "അറബിക് - മലയാളം നിത്യോപയോഗ ഡിക്ഷണറി (Full PDF)",
      titleEn: "Download 4-Language Expat Dictionary PDF",
      subtitle: "100+ ആശുപത്രി, കടകൾ, ജോലി, യാത്രാ സംഭാഷണങ്ങളും ഉച്ചാരണവും",
      url: "javascript:window.downloadFullDictionaryPdf()",
      keywords: ["pdf", "dictionary", "phrasebook", "arabic", "words", "ഡിക്ഷണറി", "നിഘണ്ടു", "വാക്കുകൾ", "ഡൗൺലോഡ്"]
    }
  ];

  // Base Travel Services Dataset
  const BASE_TRAVEL = [
    {
      id: "travel-haramain",
      category: "travel",
      categoryLabel: "✈️ യാത്ര & ടിക്കറ്റ്",
      icon: "🚅",
      title: "ഹറമൈൻ ഹൈസ്പീഡ് ട്രെയിൻ സമഗ്ര ഗൈഡ്",
      titleEn: "Haramain High-Speed Train Guide & SAR Booking",
      subtitle: "മക്ക, ജിദ്ദ, KAEC, മദീന ട്രെയിൻ സമയം, ക്ലാസുകൾ, ബാഗേജ് & ടിക്കറ്റ് ബുക്കിംഗ്",
      url: "/travel#haramain-train-section",
      keywords: ["haramain", "train", "sar", "makkah", "madinah", "jeddah", "ട്രെയിൻ", "ഹറമൈൻ", "ടിക്കറ്റ്"]
    },
    {
      id: "travel-saptco",
      category: "travel",
      categoryLabel: "✈️ യാത്ര & ടിക്കറ്റ്",
      icon: "🚌",
      title: "സാപ്റ്റ്കോ (SAPTCO) സൗദി ഇന്റർസിറ്റി ബസ് സർവീസ്",
      titleEn: "SAPTCO Saudi Intercity Bus Booking & Schedules",
      subtitle: "സൗദിയിലെ നഗരങ്ങൾ തമ്മിലുള്ള ബസ് ടൈംടേബിളും ടിക്കറ്റ് ബുക്കിംഗും",
      url: "/travel#saptco-bus",
      keywords: ["saptco", "bus", "intercity", "transport", "സാപ്റ്റ്കോ", "ബസ്", "ടിക്കറ്റ്"]
    },
    {
      id: "travel-flights",
      category: "travel",
      categoryLabel: "✈️ യാത്ര & ടിക്കറ്റ്",
      icon: "🛫",
      title: "ലൈവ് ഫ്ലൈറ്റ് സ്റ്റാറ്റസ് ട്രാക്കർ",
      titleEn: "Live Flight Tracker (Saudi & Kerala Airports)",
      subtitle: "ജിദ്ദ, റിയാദ്, ദമ്മാം, കൊച്ചി, കോഴിക്കോട്, കണ്ണൂർ ഫ്ലൈറ്റ് ടൈമിംഗ്സ്",
      url: "/travel#flight-tracker",
      keywords: ["flight", "tracker", "airport", "jeddah", "riyadh", "kochi", "calicut", "ഫ്ലൈറ്റ്", "വിമാനം"]
    },
    {
      id: "travel-ksrtc",
      category: "travel",
      categoryLabel: "✈️ യാത്ര & ടിക്കറ്റ്",
      icon: "🚍",
      title: "KSRTC സ്വിഫ്റ്റ് & കേരള ബസ് ബുക്കിംഗ്",
      titleEn: "KSRTC SWIFT Online Bus Reservation",
      subtitle: "നാട്ടിലെത്തിയാൽ എയർപോർട്ടിൽ നിന്നുള്ള സ്വിഫ്റ്റ് ബസ് ടിക്കറ്റ് റിസർവേഷൻ",
      url: "/travel#ksrtc-booking",
      keywords: ["ksrtc", "swift", "bus", "kerala", "booking", "കെഎസ്ആർടിസി", "സ്വിഫ്റ്റ്", "ബസ്"]
    },
    {
      id: "travel-irctc",
      category: "travel",
      categoryLabel: "✈️ യാത്ര & ടിക്കറ്റ്",
      icon: "🚆",
      title: "ഇന്ത്യൻ റെയിൽവേ (IRCTC) ട്രെയിൻ ബുക്കിംഗ്",
      titleEn: "IRCTC Indian Railways Train Booking & Tatkal",
      subtitle: "നാട്ടിലെ ട്രെയിൻ ടിക്കറ്റുകൾ ബുക്ക് ചെയ്യാനുള്ള ഔദ്യോഗിക പോർട്ടൽ",
      url: "/travel#train-booking",
      keywords: ["irctc", "railway", "train", "tatkal", "ഇന്ത്യൻ റെയിൽവേ", "ട്രെയിൻ", "തത്കാൽ"]
    }
  ];

  // Global Search State
  let searchIndex = [];
  let isIndexBuilt = false;
  let activeResults = [];

  // Dynamically load missing dataset scripts if on a subpage
  function ensureDatasetsLoaded(callback) {
    const needed = [];
    if (!window.KSA_KERALA_FOODS) needed.push("./js/data.js?v=20261121_v24");
    if (!window.HEALTH_DATA) needed.push("./js/health_data.js?v=20261121_v24");
    if (!window.MALAYALAM_LIBRARY_DATA) needed.push("./js/library_data.js?v=20261120_v15");
    if (!window.SAUDI_TOURISM_DATA) needed.push("./js/tourism_data.js?v=20261120_v15");
    if (!window.VISION_2030_DATA || !window.FIFA_STADIUMS_DATA) needed.push("./js/vision_fifa.js?v=20261121_v24");

    if (needed.length === 0) {
      if (callback) callback();
      return;
    }

    let loaded = 0;
    needed.forEach(src => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = s.onerror = () => {
        loaded++;
        if (loaded === needed.length) {
          isIndexBuilt = false;
          buildSearchIndex();
          if (callback) callback();
        }
      };
      document.head.appendChild(s);
    });
  }

  // Build Comprehensive Multi-Entity Search Index
  function buildSearchIndex() {
    if (isIndexBuilt && searchIndex.length > 50) return;
    const items = [];

    // 1. Add Base Tools & Travel
    BASE_TOOLS.forEach(t => items.push(t));
    BASE_TRAVEL.forEach(t => items.push(t));

    // 2. Add Restaurants from window.KSA_KERALA_FOODS
    if (window.KSA_KERALA_FOODS && Array.isArray(window.KSA_KERALA_FOODS)) {
      window.KSA_KERALA_FOODS.forEach(r => {
        items.push({
          id: `rest-${r.restaurant_id || r.name}`,
          category: "restaurants",
          categoryLabel: "🍽️ റെസ്റ്റോറന്റുകൾ",
          icon: "🍲",
          title: r.name,
          titleEn: r.name,
          subtitle: `${r.city} (${r.area || "സൗദി"}) · ${r.category || "കേരള ഭക്ഷണം"} · ⭐ ${r.display_rating || "4.8"}`,
          url: `/?city=${encodeURIComponent(r.city || "")}#food-grid`,
          actionParam: r.restaurant_id,
          keywords: [
            r.name,
            r.city,
            r.area,
            r.category,
            "റെസ്റ്റോറന്റ്",
            "ഹോട്ടൽ",
            "ഭക്ഷണം",
            "ബിരിയാണി",
            "പൊറോട്ട",
            "ചായ",
            "ഊണ്",
            ...(r.tags || [])
          ]
        });
      });
    }

    // 3. Add Clinics & Health from window.HEALTH_DATA
    if (window.HEALTH_DATA && window.HEALTH_DATA.clinicsByCity) {
      Object.entries(window.HEALTH_DATA.clinicsByCity).forEach(([city, clinics]) => {
        if (Array.isArray(clinics)) {
          clinics.forEach(c => {
            items.push({
              id: `clinic-${c.name}`,
              category: "health",
              categoryLabel: "🏥 ക്ലിനിക്കുകൾ & ആരോഗ്യം",
              icon: "🏥",
              title: c.nameMl || c.name,
              titleEn: c.name,
              subtitle: `${city} (${c.area || ""}) · ഫോൺ: ${c.phone || "ലഭ്യം"}`,
              url: `/health#clinics-section`,
              keywords: [c.name, c.nameMl, city, c.area, c.areaMl, "ക്ലിനിക്ക്", "ആശുപത്രി", "ഡോക്ടർ", "മെഡിക്കൽ", "clinic", "hospital", "abeer"]
            });
          });
        }
      });
    }

    // Add Banned Medicines
    if (window.HEALTH_DATA && Array.isArray(window.HEALTH_DATA.customsChecklist)) {
      window.HEALTH_DATA.customsChecklist.forEach(m => {
        items.push({
          id: `med-${m.id || m.title}`,
          category: "health",
          categoryLabel: "🏥 ക്ലിനിക്കുകൾ & ആരോഗ്യം",
          icon: m.status === "allowed" ? "✅" : "⚠️",
          title: m.title,
          titleEn: m.title,
          subtitle: `കസ്റ്റംസ് പരിശോധന: ${m.rule || m.desc || ""}`,
          url: `/health#customs-checklist`,
          keywords: [m.title, "മരുന്ന്", "നിരോധിത", "കസകസ്", "ട്രമഡോൾ", "medicine", "banned", "customs"]
        });
      });
    }

    // 4. Add E-Library Books from window.MALAYALAM_LIBRARY_DATA
    if (window.MALAYALAM_LIBRARY_DATA && Array.isArray(window.MALAYALAM_LIBRARY_DATA)) {
      window.MALAYALAM_LIBRARY_DATA.forEach(b => {
        items.push({
          id: `book-${b.id}`,
          category: "library",
          categoryLabel: "📚 ഇ-ലൈബ്രറി & ഗൈഡുകൾ",
          icon: b.icon || "📖",
          title: b.title,
          titleEn: b.title_en,
          subtitle: `രചന: ${b.author} (${b.year || ""}) · ${b.category_label || "വായന"} · ⭐ ${b.rating ? b.rating.toFixed(1) : "4.8"}`,
          url: `/explore?tab=library&book=${encodeURIComponent(b.id)}`,
          actionParam: b.id,
          keywords: [b.title, b.title_en, b.author, b.author_en, b.category_label, "പുസ്തകം", "നോവൽ", "കഥ", "book", "library"]
        });
      });
    }

    // 5. Add Vision 2030 & FIFA 2034 Stadiums
    if (window.VISION_2030_DATA && Array.isArray(window.VISION_2030_DATA)) {
      window.VISION_2030_DATA.forEach(p => {
        items.push({
          id: `vision-${p.id}`,
          category: "library",
          categoryLabel: "📚 ഇ-ലൈബ്രറി & ഗൈഡുകൾ",
          icon: p.icon || "🚀",
          title: p.titleMl || p.title,
          titleEn: p.titleEn,
          subtitle: `സൗദി വിഷൻ 2030 മെഗാ പ്രോജക്റ്റ് (${p.region || "Saudi"})`,
          url: `/saudi#vision-fifa-section`,
          keywords: [p.titleMl, p.titleEn, p.region, "vision", "2030", "മെഗാ പ്രോജക്റ്റ്", "നിയോം", "neom", "qiddiya"]
        });
      });
    }

    if (window.FIFA_STADIUMS_DATA && Array.isArray(window.FIFA_STADIUMS_DATA)) {
      window.FIFA_STADIUMS_DATA.forEach(s => {
        items.push({
          id: `fifa-${s.id}`,
          category: "library",
          categoryLabel: "📚 ഇ-ലൈബ്രറി & ഗൈഡുകൾ",
          icon: "⚽",
          title: s.nameMl || s.name,
          titleEn: s.name,
          subtitle: `FIFA World Cup 2034 സ്റ്റേഡിയം · ${s.city || ""} · കപ്പാസിറ്റി: ${s.capacity || ""}`,
          url: `/saudi#vision-fifa-section`,
          keywords: [s.nameMl, s.name, s.city, "fifa", "stadium", "2034", "സ്റ്റേഡിയം", "football"]
        });
      });
    }

    // 6. Add Tourism Spots from window.SAUDI_TOURISM_DATA
    if (window.SAUDI_TOURISM_DATA && Array.isArray(window.SAUDI_TOURISM_DATA)) {
      window.SAUDI_TOURISM_DATA.forEach(t => {
        items.push({
          id: `tour-${t.id || t.name_ml}`,
          category: "library",
          categoryLabel: "📚 ഇ-ലൈബ്രറി & ഗൈഡുകൾ",
          icon: "🌴",
          title: t.name_ml,
          titleEn: t.name_en,
          subtitle: `സഞ്ചാര കേന്ദ്രം · ${t.region_label_ml || ""} · പ്രവേശന ഫീസ്: ${t.entry_fee || "സൗജന്യം"}`,
          url: `/explore?tab=tourism`,
          keywords: [t.name_ml, t.name_en, t.region, t.region_label_ml, "ടൂറിസം", "സഞ്ചാരം", "വിസ്മയം", "tourism", "hidden spot"]
        });
      });
    }

    searchIndex = items;
    isIndexBuilt = true;
  }

  // Normalize string for fuzzy/phonetic comparison
  function normalizeStr(str) {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
      .trim();
  }

  // Smart Query Search with 1-Letter Typeahead & Manglish expansion
  function performSearch(rawQuery) {
    buildSearchIndex();
    const query = normalizeStr(rawQuery);
    if (!query) return [];

    // Find all synonymous search terms from Manglish dictionary
    const searchTerms = [query];
    Object.entries(MANGLISH_MAP).forEach(([key, syns]) => {
      if (key.startsWith(query) || query.startsWith(key) || syns.some(s => s.toLowerCase().startsWith(query))) {
        syns.forEach(s => {
          const norm = normalizeStr(s);
          if (norm && !searchTerms.includes(norm)) searchTerms.push(norm);
        });
      }
    });

    const matches = [];

    for (const item of searchIndex) {
      let score = 0;
      const titleNorm = normalizeStr(item.title);
      const titleEnNorm = normalizeStr(item.titleEn);
      const subNorm = normalizeStr(item.subtitle);
      const allKeywords = (item.keywords || []).map(normalizeStr).join(" ");

      for (const term of searchTerms) {
        if (!term) continue;

        if (titleNorm.startsWith(term) || titleEnNorm.startsWith(term)) {
          score += 15;
        } else if (titleNorm.includes(term) || titleEnNorm.includes(term)) {
          score += 10;
        } else if (allKeywords.includes(term)) {
          score += 6;
        } else if (subNorm.includes(term)) {
          score += 3;
        }
      }

      if (score > 0) {
        matches.push({ item, score });
      }
    }

    // Sort by relevance score
    matches.sort((a, b) => b.score - a.score);
    return matches.map(m => m.item);
  }

  // Create & Inject Modal DOM
  function injectSearchModal() {
    if (document.getElementById("site-search-modal")) return;

    const modal = document.createElement("div");
    modal.id = "site-search-modal";
    modal.className = "site-search-modal-backdrop";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Search KSA Malayali Hub");

    modal.innerHTML = `
      <div class="site-search-modal-card">
        <!-- Search Header Bar -->
        <div class="search-header-bar">
          <div class="search-input-wrapper">
            <span class="search-input-icon" aria-hidden="true">🔍</span>
            <input 
              type="text" 
              id="site-search-input" 
              class="site-search-input" 
              placeholder="തിരയുക... (ഉദാ: ഇഖാമ, Abeer, ബിരിയാണി, STC, Gratuity)" 
              autocomplete="off" 
              spellcheck="false"
              aria-label="Search across site"
            >
            <button type="button" id="search-input-clear-btn" class="search-clear-btn" style="display:none;" aria-label="Clear Search">✕</button>
          </div>
          <button type="button" id="site-search-close-btn" class="search-modal-close-btn" aria-label="Close search">✕</button>
        </div>

        <!-- Quick Search Suggestion Chips (Shown when input is empty) -->
        <div id="search-quick-chips-box" class="search-chips-container">
          <div class="search-chips-label">🔥 ജനപ്രിയ തിരച്ചിലുകൾ (Popular Quick Searches):</div>
          <div class="search-chips-list">
            <button type="button" class="search-chip" data-search="ഇഖാമ">📄 ഇഖാമ</button>
            <button type="button" class="search-chip" data-search="ഗ്രാറ്റുവിറ്റി">💰 ഗ്രാറ്റുവിറ്റി (EOSB)</button>
            <button type="button" class="search-chip" data-search="Abeer">🏥 Abeer Clinic</button>
            <button type="button" class="search-chip" data-search="STC">📱 STC ബാലൻസ്</button>
            <button type="button" class="search-chip" data-search="ഹറമൈൻ">🚅 ഹറമൈൻ ട്രെയിൻ</button>
            <button type="button" class="search-chip" data-search="NORKA">🏛️ നോർക്ക പെൻഷൻ</button>
            <button type="button" class="search-chip" data-search="നമസ്കാര സമയം">🕌 നമസ്കാര സമയം</button>
            <button type="button" class="search-chip" data-search="വോയ്സ് ട്രാൻസ്ലേറ്റർ">🎙️ വോയ്സ് ട്രാൻസ്ലേറ്റർ</button>
            <button type="button" class="search-chip" data-search="ബിരിയാണി">🍲 ബിരിയാണി</button>
            <button type="button" class="search-chip" data-search="സ്വർണ്ണ നിരക്ക്">💱 സ്വർണ്ണ നിരക്ക്</button>
            <button type="button" class="search-chip" data-search="FIFA 2034">⚽ FIFA 2034</button>
            <button type="button" class="search-chip" data-search="നിരോധിത മരുന്നുകൾ">✈️ കസ്റ്റംസ് മരുന്നുകൾ</button>
          </div>
        </div>

        <!-- Grouped Results Container -->
        <div id="site-search-results-area" class="search-results-area">
          <!-- Dynamically populated -->
        </div>

        <!-- Keyboard Hint Footer -->
        <div class="search-modal-footer">
          <span>💡 ഒരു അക്ഷരം ടൈപ്പ് ചെയ്താലും തത്സമയം റിസൾട്ടുകൾ ലഭിക്കും</span>
          <span class="search-footer-hint">ESC അടിക്കുക (Close)</span>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    attachSearchEvents(modal);
  }

  // Attach Listeners to Modal
  function attachSearchEvents(modal) {
    const input = modal.querySelector("#site-search-input");
    const clearBtn = modal.querySelector("#search-input-clear-btn");
    const closeBtn = modal.querySelector("#site-search-close-btn");
    const chipsBox = modal.querySelector("#search-quick-chips-box");
    const resultsArea = modal.querySelector("#site-search-results-area");

    // Clear search
    clearBtn.addEventListener("click", () => {
      input.value = "";
      input.focus();
      clearBtn.style.display = "none";
      chipsBox.style.display = "block";
      resultsArea.innerHTML = "";
    });

    // Close Modal
    function closeModal() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
      input.value = "";
      clearBtn.style.display = "none";
      chipsBox.style.display = "block";
      resultsArea.innerHTML = "";
    }

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // Instant 1-Letter Typeahead on input
    input.addEventListener("input", (e) => {
      const q = e.target.value.trim();
      clearBtn.style.display = q.length > 0 ? "block" : "none";

      if (q.length === 0) {
        chipsBox.style.display = "block";
        resultsArea.innerHTML = "";
        activeResults = [];
        return;
      }

      chipsBox.style.display = "none";
      const results = performSearch(q);
      activeResults = results;
      renderGroupedResults(results, q, resultsArea);
    });

    // Quick chip click
    modal.querySelectorAll(".search-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const query = chip.getAttribute("data-search");
        input.value = query;
        input.focus();
        clearBtn.style.display = "block";
        chipsBox.style.display = "none";
        const results = performSearch(query);
        activeResults = results;
        renderGroupedResults(results, query, resultsArea);
      });
    });

    // Keydown handling (ESC, Enter)
    window.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("open")) return;
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "Enter" && activeResults.length > 0) {
        e.preventDefault();
        navigateToResult(activeResults[0]);
      }
    });
  }

  // Render Grouped Search Results
  function renderGroupedResults(results, query, container) {
    if (!results || results.length === 0) {
      container.innerHTML = `
        <div class="search-empty-state">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🔍</div>
          <h4 style="margin: 0 0 6px; font-size: 1.15rem; color: #0f172a;">ഫലങ്ങളൊന്നും കണ്ടെത്തിയില്ല</h4>
          <p style="margin: 0; font-size: 0.9rem; color: #64748b;">
            "${escapeHtml(query)}" എന്നതിന് അനുയോജ്യമായ വിവരങ്ങൾ കണ്ടെത്താനായില്ല. മറ്റൊരു വാക്ക് ടൈപ്പ് ചെയ്യുകയോ ജനപ്രിയ ടാഗുകൾ ഉപയോഗിക്കുകയോ ചെയ്യുക.
          </p>
        </div>
      `;
      return;
    }

    // Group results by category
    const categoryOrder = ["tools", "restaurants", "health", "travel", "library"];
    const categoryLabels = {
      tools: "🛠️ ടൂളുകൾ & സഹായി (Tools & Assistance)",
      restaurants: "🍽️ റെസ്റ്റോറന്റുകൾ (Kerala Restaurants)",
      health: "🏥 ക്ലിനിക്കുകൾ & ആരോഗ്യം (Clinics & Health)",
      travel: "✈️ യാത്ര & ടിക്കറ്റ് (Travel & Tickets)",
      library: "📚 ഇ-ലൈബ്രറി & ഗൈഡുകൾ (E-Library, Vision & Heritage)"
    };

    const grouped = {};
    categoryOrder.forEach(cat => (grouped[cat] = []));

    results.forEach(item => {
      const cat = item.category || "tools";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    let totalCount = results.length;
    let html = `
      <div class="search-results-meta">
        <span class="search-count-badge">${totalCount} ഫലങ്ങൾ ലഭ്യമാണ്</span>
        <span class="search-hint-sub">നേരിട്ട് തുറക്കാൻ ലിങ്കിൽ ക്ലിക്ക് ചെയ്യുക</span>
      </div>
    `;

    categoryOrder.forEach(cat => {
      const items = grouped[cat];
      if (!items || items.length === 0) return;

      const displayItems = items.slice(0, 6); // Top 6 per category for fast rendering
      html += `
        <div class="search-category-group">
          <div class="search-category-header">
            <span>${categoryLabels[cat]}</span>
            <span class="cat-count-pill">${items.length}</span>
          </div>
          <div class="search-items-list">
            ${displayItems.map((item, idx) => `
              <div class="search-result-card" data-cat="${item.category}" data-id="${item.id}">
                <div class="search-item-icon">${item.icon || "🔍"}</div>
                <div class="search-item-info">
                  <div class="search-item-title-row">
                    <h4 class="search-item-title">${highlightMatch(item.title, query)}</h4>
                    ${item.titleEn && item.titleEn !== item.title ? `<span class="search-item-en">${escapeHtml(item.titleEn)}</span>` : ""}
                  </div>
                  <p class="search-item-sub">${escapeHtml(item.subtitle)}</p>
                </div>
                <div class="search-item-arrow">↗</div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Attach click handlers to results
    container.querySelectorAll(".search-result-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        const found = results.find(r => r.id === id);
        if (found) navigateToResult(found);
      });
    });
  }

  // Highlight matching letters
  function highlightMatch(text, query) {
    if (!text || !query) return escapeHtml(text || "");
    const safeText = escapeHtml(text);
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const reg = new RegExp(`(${escapedQuery})`, "gi");
    return safeText.replace(reg, `<mark class="search-mark">$1</mark>`);
  }

  // Escape HTML helper
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Direct Navigation to exact section or execute action
  function navigateToResult(item) {
    const modal = document.getElementById("site-search-modal");
    if (modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }

    if (!item || !item.url) return;

    if (item.url.startsWith("javascript:")) {
      const code = item.url.replace("javascript:", "");
      try {
        eval(code);
      } catch (e) {
        console.error("Action error:", e);
      }
      return;
    }

    const currentPath = window.location.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "");
    const targetUrl = new URL(item.url, window.location.origin);
    const targetPath = targetUrl.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "");

    // If already on the same page and target has a hash, smooth scroll directly
    if (targetPath === currentPath && targetUrl.hash) {
      const targetEl = document.querySelector(targetUrl.hash);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        targetEl.classList.add("search-target-highlight");
        setTimeout(() => targetEl.classList.remove("search-target-highlight"), 2500);
        return;
      }
    }

    // Otherwise navigate directly
    window.location.href = item.url;
  }

  // Open Search Modal Handler
  window.openSiteSearch = function (initialQuery = "") {
    injectSearchModal();
    ensureDatasetsLoaded();
    const modal = document.getElementById("site-search-modal");
    if (!modal) return;

    modal.classList.add("open");
    document.body.style.overflow = "hidden";

    const input = modal.querySelector("#site-search-input");
    if (input) {
      if (initialQuery) {
        input.value = initialQuery;
        const results = performSearch(initialQuery);
        activeResults = results;
        renderGroupedResults(results, initialQuery, modal.querySelector("#site-search-results-area"));
        modal.querySelector("#search-quick-chips-box").style.display = "none";
        modal.querySelector("#search-input-clear-btn").style.display = "block";
      } else {
        input.value = "";
        modal.querySelector("#search-quick-chips-box").style.display = "block";
        modal.querySelector("#site-search-results-area").innerHTML = "";
      }
      setTimeout(() => input.focus(), 80);
    }
  };

  // Bind Navbar Search Trigger Buttons across all pages
  function bindTriggers() {
    document.querySelectorAll("#site-search-btn, .site-search-trigger").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.openSiteSearch();
      });
    });

    // Keyboard shortcut (Ctrl+K, Cmd+K, or '/')
    window.addEventListener("keydown", (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
      const isInput = activeTag === "input" || activeTag === "textarea" || document.activeElement.isContentEditable;

      if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !isInput)) {
        e.preventDefault();
        window.openSiteSearch();
      }
    });
  }

  // Init once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      injectSearchModal();
      bindTriggers();
      setTimeout(ensureDatasetsLoaded, 800);
    });
  } else {
    injectSearchModal();
    bindTriggers();
    setTimeout(ensureDatasetsLoaded, 800);
  }
})();
