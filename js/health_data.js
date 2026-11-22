// KSA Malayali Hub — Health & Language Data (ആരോഗ്യം & ഭാഷ)

var HEALTH_DATA = (typeof window !== "undefined" && window.HEALTH_DATA) ? window.HEALTH_DATA : {
  // 1. Insurance Providers Directory
  insuranceProviders: [
    { name: "Bupa Arabia", nameMl: "ബൂപ അറേബ്യ", link: "https://bupa.com.sa/", badge: "Market Leader" },
    { name: "Tawuniya", nameMl: "തവൂനിയ ഇൻഷുറൻസ്", link: "https://www.tawuniya.com.sa/", badge: "Govt / Semi-Govt" },
    { name: "Al Rajhi Takaful", nameMl: "അൽ റാജ്ഹി തകാഫുൽ", link: "https://www.alrajhitakaful.com/", badge: "Islamic Takaful" },
    { name: "MedGulf", nameMl: "മെഡ്ഗൾഫ് ഇൻഷുറൻസ്", link: "https://www.medgulf.com.sa/", badge: "Popular Network" },
    { name: "Walaa Insurance", nameMl: "വലാഅ് കോഓപ്പറേറ്റീവ്", link: "https://www.walaa.com/", badge: "Corporate & SME" },
    { name: "Malath Insurance", nameMl: "മലാദ് കോഓപ്പറേറ്റീവ്", link: "https://www.malath.com.sa/", badge: "Affordable Plans" }
  ],

  // 2. Malayali-Friendly Polyclinics Across 11 Saudi Cities
  clinicsByCity: {
    "Jeddah": [
      {
        name: "Abeer Medical Center – Sharafiyah",
        nameMl: "അബീർ മെഡിക്കൽ സെന്റർ (ഷറഫിയ്യ)",
        area: "Al Sharafiyah, Jeddah",
        areaMl: "അൽ ഷറഫിയ്യ, ജിദ്ദ",
        phone: "+966920015888",
        isAbeerUnified: true,
        mapsQuery: "Abeer Medical Center Sharafiyah Jeddah Saudi Arabia",
        note: "മലയാളി ഡോക്ടർമാരും നേഴ്സുമാരും ഉള്ള സൗദിയിലെ ഏറ്റവും വലിയ പ്രവാസി ക്ലിനിക്ക് ശൃംഖല."
      },
      {
        name: "Abeer Medical Center – Bawadi",
        nameMl: "അബീർ മെഡിക്കൽ സെന്റർ (ബവാദി)",
        area: "Al Bawadi, Jeddah",
        areaMl: "അൽ ബവാദി, ജിദ്ദ",
        phone: "+966920015888",
        isAbeerUnified: true,
        mapsQuery: "Abeer Medical Center Bawadi Jeddah Saudi Arabia",
        note: "ബവാദി മാർക്കറ്റിന് സമീപം, ഒപി & അത്യാഹിത വിഭാഗം."
      },
      {
        name: "Abeer Medical Center – Aziziyah",
        nameMl: "അബീർ മെഡിക്കൽ സെന്റർ (അസീസിയ്യ)",
        area: "Al Aziziyah, Jeddah",
        areaMl: "അൽ അസീസിയ്യ, ജിദ്ദ",
        phone: "+966920015888",
        isAbeerUnified: true,
        mapsQuery: "Abeer Medical Center Aziziyah Jeddah Saudi Arabia",
        note: "അസീസിയ്യ പ്രദേശത്തെ പ്രവാസികൾക്ക് സൗകര്യപ്രദം."
      },
      {
        name: "Abeer Medical Center – Sanayah",
        nameMl: "അബീർ മെഡിക്കൽ സെന്റർ (സനായ്യ)",
        area: "Industrial Area (Sanayah), Jeddah",
        areaMl: "ഇൻഡസ്ട്രിയൽ ഏരിയ (സനായ്യ), ജിദ്ദ",
        phone: "+966920015888",
        isAbeerUnified: true,
        mapsQuery: "Abeer Medical Center Sanayah Industrial Area Jeddah Saudi Arabia",
        note: "സനായ്യയിലെ വർക്ക്ഷോപ്പ് തൊഴിലാളികൾക്ക് അടുത്തുള്ള പ്രവാസി ക്ലിനിക്ക്."
      },
      {
        name: "New Al Hiba Medical Group – Ajwad",
        nameMl: "ന്യൂ അൽ ഹിബ മെഡിക്കൽ ഗ്രൂപ്പ് (അജ്‌വാദ്)",
        area: "Al Ajwad, Jeddah",
        areaMl: "അൽ അജ്‌വാദ്, ജിദ്ദ",
        mapsQuery: "New Al Hiba Medical Group Ajwad Jeddah Saudi Arabia",
        note: "അജ്‌വാദ്, സാമിർ ഭാഗങ്ങളിലുള്ള മലയാളികൾക്ക് ഏറ്റവും അനുയോജ്യം."
      },
      {
        name: "Shifa Jeddah Polyclinic – Al Wahah",
        nameMl: "ശിഫ ജിദ്ദ പോളിക്ലിനിക്ക് (അൽ വാഹ)",
        area: "Al Wahah, Jeddah",
        areaMl: "അൽ വാഹ, ജിദ്ദ",
        mapsQuery: "Shifa Jeddah Polyclinic Al Wahah Jeddah Saudi Arabia",
        note: "മലയാളികൾക്ക് പ്രിയപ്പെട്ട ജനറൽ & ഡെന്റൽ ക്ലിനിക്ക് സേവനങ്ങൾ."
      },
      {
        name: "Shifa Jeddah Polyclinic – Al Khumrah",
        nameMl: "ശിഫ ജിദ്ദ പോളിക്ലിനിക്ക് (അൽ ഖുംറ)",
        area: "Al Khumrah, South Jeddah",
        areaMl: "അൽ ഖുംറ, സൗത്ത് ജിദ്ദ",
        mapsQuery: "Shifa Jeddah Polyclinic Al Khumrah South Jeddah Saudi Arabia",
        note: "സൗത്ത് ജിദ്ദ, വെയർഹൗസ് ഏരിയകളിലുള്ള തൊഴിലാളികൾക്ക് അനുയോജ്യം."
      },
      {
        name: "Al Ryan Polyclinic",
        nameMl: "അൽ റയ്യാൻ പോളിക്ലിനിക്ക്",
        area: "Al Ruwais / Sharafiyah, Jeddah",
        areaMl: "അൽ റുവൈസ് / ഷറഫിയ്യ, ജിദ്ദ",
        mapsQuery: "Al Ryan Polyclinic Jeddah Saudi Arabia",
        note: "പ്രധാന ഇൻഷുറൻസ് നെറ്റ്‌വർക്കുകൾ സ്വീകരിക്കുന്ന ജനപ്രിയ ക്ലിനിക്ക്."
      },
      {
        name: "Al Salama Polyclinic",
        nameMl: "അൽ സലാമ പോളിക്ലിനിക്ക്",
        area: "Al Salama, Jeddah",
        areaMl: "അൽ സലാമ, ജിദ്ദ",
        mapsQuery: "Al Salama Polyclinic Jeddah Saudi Arabia",
        note: "നൂതന സൗകര്യങ്ങളോടെയുള്ള ഫാമിലി & ജനറൽ മെഡിസിൻ."
      },
      {
        name: "SABA Clinics",
        nameMl: "സബ ക്ലിനിക്സ് (SABA Clinics)",
        area: "Multiple Branches, Jeddah",
        areaMl: "വിവിധ ശാഖകൾ, ജിദ്ദ",
        mapsQuery: "SABA Clinics Jeddah Saudi Arabia",
        note: "മികച്ച സ്പെഷ്യാലിറ്റി വിഭാഗങ്ങളും ലബോറട്ടറിയും."
      }
    ],

    "Makkah": [
      {
        name: "Abeer Medical Center – Al Nuzha",
        nameMl: "അബീർ മെഡിക്കൽ സെന്റർ (അൽ നുസ്‌ഹ)",
        area: "Al Nuzha, Makkah",
        areaMl: "അൽ നുസ്‌ഹ, മക്ക",
        phone: "+966920015888",
        isAbeerUnified: true,
        mapsQuery: "Abeer Medical Center Al Nuzha Makkah Saudi Arabia",
        note: "മക്കയിലെ മലയാളികൾക്കും ഉംറ തീർത്ഥാടകർക്കും ആശ്രയിക്കാവുന്ന കേന്ദ്രം."
      },
      {
        name: "Abeer Medical Center – Al Aziziyah",
        nameMl: "അബീർ മെഡിക്കൽ സെന്റർ (അൽ അസീസിയ്യ)",
        area: "Al Aziziyah, Makkah",
        areaMl: "അൽ അസീസിയ്യ, മക്ക",
        phone: "+966920015888",
        isAbeerUnified: true,
        mapsQuery: "Abeer Medical Center Al Aziziyah Makkah Saudi Arabia",
        note: "അസീസിയ്യയിലെ പ്രവാസികൾക്ക് സൗകര്യപ്രദമായ ക്ലിനിക്ക്."
      },
      {
        name: "Saudi National Hospital Makkah",
        nameMl: "സൗദി നാഷണൽ ഹോസ്പിറ്റൽ (മക്ക)",
        area: "Al Maabdah, Makkah",
        areaMl: "അൽ മഅബ്ദ, മക്ക",
        mapsQuery: "Saudi National Hospital Makkah Saudi Arabia",
        note: "24 മണിക്കൂർ അത്യാഹിത വിഭാഗവും അത്യാധുനിക സർജിക്കൽ സൗകര്യങ്ങളും."
      },
      {
        name: "Al Kholood Polyclinic",
        nameMl: "അൽ ഖുലൂദ് പോളിക്ലിനിക്ക് (മക്ക)",
        area: "Al Mansoor / Kudai, Makkah",
        areaMl: "അൽ മൻസൂർ, മക്ക",
        mapsQuery: "Al Kholood Polyclinic Makkah Saudi Arabia",
        note: "മലയാളി ഡോക്ടർമാരുടെ സേവനവും താങ്ങാവുന്ന നിരക്കുകളും."
      },
      {
        name: "Makkah Polyclinic – Al Zaher",
        nameMl: "മക്ക പോളിക്ലിനിക്ക് (അൽ സാഹിർ)",
        area: "Al Zaher, Makkah",
        areaMl: "അൽ സാഹിർ, മക്ക",
        mapsQuery: "Makkah Polyclinic Al Zaher Makkah Saudi Arabia",
        note: "ജനറൽ പ്രാക്ടീസ്, ഡെന്റൽ, പീഡിയാട്രിക് സേവനങ്ങൾ."
      }
    ],

    "Madinah": [
      {
        name: "Abeer Medical Center – Madinah",
        nameMl: "അബീർ മെഡിക്കൽ സെന്റർ (മദീന)",
        area: "Al Qurban / Masjid Nabawi vicinity, Madinah",
        areaMl: "ഖുർബാൻ / മസ്ജിദുന്നബവിക്ക് സമീപം, മദീന",
        phone: "+966920015888",
        isAbeerUnified: true,
        mapsQuery: "Abeer Medical Center Madinah Saudi Arabia",
        note: "മദീനയിലെ പ്രവാസികൾക്കും സന്ദർശകർക്കും മലയാളത്തിൽ സംസാരിക്കുന്ന സ്റ്റാഫ്."
      },
      {
        name: "Al Zahra Hospital",
        nameMl: "അൽ സഹ്ര ഹോസ്പിറ്റൽ (മദീന)",
        area: "King Fahd Road, Madinah",
        areaMl: "കിംഗ് ഫഹദ് റോഡ്, മദീന",
        mapsQuery: "Al Zahra Hospital Madinah Saudi Arabia",
        note: "മൾട്ടി സ്പെഷ്യാലിറ്റി സേവനങ്ങളും ആംബുലൻസ് സൗകര്യവും."
      }
    ],

    "Taif": [
      {
        name: "Al Ausrah Clinic – Taif",
        nameMl: "അൽ ഉസ്‌റ ക്ലിനിക്ക് (തായിഫ്)",
        area: "Shubra, Taif",
        areaMl: "ശുബ്ര, തായിഫ്",
        mapsQuery: "Al Ausrah Clinic Shubra Taif Saudi Arabia",
        note: "തായിഫിലെ മലയാളികൾ ഏറ്റവും കൂടുതൽ ആശ്രയിക്കുന്ന പോളിക്ലിനിക്ക്."
      },
      {
        name: "Nahdi Care Clinics – Taif",
        nameMl: "നഹ്ദി കെയർ ക്ലിനിക്സ് (തായിഫ്)",
        area: "Shehar, Taif",
        areaMl: "ശിഹാർ, തായിഫ്",
        mapsQuery: "Nahdi Care Clinics Taif Saudi Arabia",
        note: "നഹ്ദി ഗ്രൂപ്പിന്റെ മികച്ച ക്ലിനിക്ക് ശൃംഖല, ഡിജിറ്റൽ ലാബ്."
      },
      {
        name: "Al Adwani General Hospital",
        nameMl: "അൽ അദ്‌വാനി ജനറൽ ഹോസ്പിറ്റൽ (തായിഫ്)",
        area: "Faisal Street, Taif",
        areaMl: "ഫൈസൽ സ്ട്രീറ്റ്, തായിഫ്",
        mapsQuery: "Al Adwani General Hospital Taif Saudi Arabia",
        note: "24/7 എമർജൻസി, ഇൻപേഷ്യന്റ് അഡ്മിഷൻ, ഇൻഷുറൻസ് അപ്രൂവൽ."
      }
    ],

    "Riyadh": [
      {
        name: "Abeer Medical Center – Batha",
        nameMl: "അബീർ മെഡിക്കൽ സെന്റർ (ബത്ത)",
        area: "Al Batha, Riyadh",
        areaMl: "അൽ ബത്ത, റിയാദ്",
        phone: "+966920015888",
        isAbeerUnified: true,
        mapsQuery: "Abeer Medical Center Batha Riyadh Saudi Arabia",
        note: "റിയാദ് ബത്തയിലെ പ്രധാന മലയാളി മെഡിക്കൽ ലാൻഡ്മാർക്ക്."
      },
      {
        name: "Abeer Medical Center – Shumaisy",
        nameMl: "അബീർ മെഡിക്കൽ സെന്റർ (ശുമൈസി)",
        area: "Al Shumaisi, Riyadh",
        areaMl: "ശുമൈസി, റിയാദ്",
        phone: "+966920015888",
        isAbeerUnified: true,
        mapsQuery: "Abeer Medical Center Shumaisy Riyadh Saudi Arabia",
        note: "ശുമൈസി ഹോസ്പിറ്റൽ പരിസരത്തുള്ള മലയാളി പ്രവാസി കേന്ദ്രം."
      },
      {
        name: "Abeer Medical Center – Manfuha",
        nameMl: "അബീർ മെഡിക്കൽ സെന്റർ (മൻഫൂഹ)",
        area: "Al Manfuha, Riyadh",
        areaMl: "മൻഫൂഹ, റിയാദ്",
        phone: "+966920015888",
        isAbeerUnified: true,
        mapsQuery: "Abeer Medical Center Manfuha Riyadh Saudi Arabia",
        note: "മൻഫൂഹയിലെ പ്രവാസി തൊഴിലാളികൾക്ക് വളരെ അടുത്തുള്ള ക്ലിനിക്ക്."
      },
      {
        name: "Abeer Medical Center – Rowdha",
        nameMl: "അബീർ മെഡിക്കൽ സെന്റർ (റൗദ)",
        area: "Al Rawdah, Riyadh",
        areaMl: "അൽ റൗദ, റിയാദ്",
        phone: "+966920015888",
        isAbeerUnified: true,
        mapsQuery: "Abeer Medical Center Rawdah Riyadh Saudi Arabia",
        note: "ഈസ്റ്റ് റിയാദിലെ ഫാമിലികൾക്കും തൊഴിലാളികൾക്കും അനുയോജ്യം."
      },
      {
        name: "Shifa Al Jazeera Polyclinic – Batha",
        nameMl: "ശിഫ അൽ ജസീറ പോളിക്ലിനിക്ക് (ബത്ത)",
        area: "Al Batha, Riyadh",
        areaMl: "അൽ ബത്ത, റിയാദ്",
        mapsQuery: "Shifa Al Jazeera Polyclinic Batha Riyadh Saudi Arabia",
        note: "റിയാദിലെ മലയാളികളുടെ മുൻനിര പോളിക്ലിനിക്ക്, പ്രശസ്ത മലയാളി ഡോക്ടർമാർ."
      },
      {
        name: "Al Ryan Polyclinic – Batha",
        nameMl: "അൽ റയ്യാൻ പോളിക്ലിനിക്ക് (ബത്ത)",
        area: "Al Batha, Riyadh",
        areaMl: "അൽ ബത്ത, റിയാദ്",
        mapsQuery: "Al Ryan Polyclinic Batha Riyadh Saudi Arabia",
        note: "ഫാർമസി, എക്സ്-റേ, പ്രധാന ഇൻഷുറൻസ് കാർഡുകൾ സ്വീകരിക്കുന്നു."
      },
      {
        name: "Aster Sanad Hospital",
        nameMl: "ആസ്റ്റർ സനദ് ഹോസ്പിറ്റൽ (റിയാദ്)",
        area: "Khurais Road, Riyadh",
        areaMl: "ഖുറൈസ് റോഡ്, റിയാദ്",
        mapsQuery: "Aster Sanad Hospital Khurais Road Riyadh Saudi Arabia",
        note: "ആസ്റ്റർ ഡിഎം ഹെൽത്ത്‌കെയറിന്റെ സൂപ്പർ സ്പെഷ്യാലിറ്റി ഹോസ്പിറ്റൽ."
      },
      {
        name: "KIMSHEALTH Medical Center",
        nameMl: "കിംസ് ഹെൽത്ത് മെഡിക്കൽ സെന്റർ (റിയാദ്)",
        area: "Umm Al Hamam / Olaya, Riyadh",
        areaMl: "ഉമ്മുൽ ഹമാം / ഒലയ്യ, റിയാദ്",
        mapsQuery: "KIMSHEALTH Medical Center Riyadh Saudi Arabia",
        note: "കിംസ് ഗ്രൂപ്പിന്റെ പ്രീമിയം ആരോഗ്യ പരിചരണം."
      },
      {
        name: "Suncity Polyclinic",
        nameMl: "സൺസിറ്റി പോളിക്ലിനിക്ക് (റിയാദ്)",
        area: "Al Batha / Hara, Riyadh",
        areaMl: "ബത്ത / ഹാറ, റിയാദ്",
        mapsQuery: "Suncity Polyclinic Batha Riyadh Saudi Arabia",
        note: "താങ്ങാവുന്ന നിരക്കുകൾ, ലേബർ ഇൻഷുറൻസ് സ്വീകരിക്കുന്നു."
      }
    ],

    "Dammam": [
      {
        name: "Abeer Medical Center – Dammam",
        nameMl: "അബീർ മെഡിക്കൽ സെന്റർ (ദമ്മാം)",
        area: "Al Souq / King Saud Street, Dammam",
        areaMl: "അൽ സൂഖ് / കിംഗ് സൗദ് സ്ട്രീറ്റ്, ദമ്മാം",
        phone: "+966920015888",
        isAbeerUnified: true,
        mapsQuery: "Abeer Medical Center Dammam Saudi Arabia",
        note: "ദമ്മാമിലെ പ്രവാസികളുടെ പ്രധാന ആരോഗ്യ കേന്ദ്രം."
      },
      {
        name: "Badr Al Samaa Polyclinic",
        nameMl: "ബദർ അൽ സമ പോളിക്ലിനിക്ക് (ദമ്മാം)",
        area: "Al Adamah, Dammam",
        areaMl: "അൽ അദാമ, ദമ്മാം",
        mapsQuery: "Badr Al Samaa Polyclinic Dammam Saudi Arabia",
        note: "മലയാളികൾ നേതൃത്വം നൽകുന്ന വിശ്വസ്ത ക്ലിനിക്ക് ശൃംഖല."
      },
      {
        name: "Shifa Al Khobar Polyclinic",
        nameMl: "ശിഫ അൽ ഖോബാർ പോളിക്ലിനിക്ക്",
        area: "Al Thuqbah, Al Khobar",
        areaMl: "അൽ തുഖ്ബ, അൽ ഖോബാർ",
        mapsQuery: "Shifa Al Khobar Polyclinic Thuqbah Al Khobar Saudi Arabia",
        note: "ഖോബാർ, ദഹ്‌റാൻ പ്രദേശങ്ങളിലെ പ്രവാസികൾക്ക് പ്രിയപ്പെട്ട ഇടം."
      },
      {
        name: "Al Ryan Polyclinic – Dammam",
        nameMl: "അൽ റയ്യാൻ പോളിക്ലിനിക്ക് (ദമ്മാം)",
        area: "Al Mazrouiah, Dammam",
        areaMl: "അൽ മസ്റൂഇയ്യ, ദമ്മാം",
        mapsQuery: "Al Ryan Polyclinic Dammam Saudi Arabia",
        note: "ജനറൽ ഒപി, ഇൻഷുറൻസ് ക്ലെയിം പരിശോധന സൗകര്യം."
      }
    ],

    "Buraidah": [
      {
        name: "Al Faiha Medical Center",
        nameMl: "അൽ ഫൈഹ മെഡിക്കൽ സെന്റർ (ബുറൈദ)",
        area: "Al Fayha, Buraidah, Al Qassim",
        areaMl: "അൽ ഫൈഹ, ബുറൈദ (അൽ ഖസീം)",
        mapsQuery: "Al Faiha Medical Center Buraidah Saudi Arabia",
        note: "ബുറൈദയിലെയും ഉനൈസയിലെയും പ്രവാസികൾ ആശ്രയിക്കുന്ന കേന്ദ്രം."
      },
      {
        name: "Maali Medical Clinic",
        nameMl: "മാലി മെഡിക്കൽ ക്ലിനിക്ക് (ബുറൈദ)",
        area: "King Abdulaziz Road, Buraidah",
        areaMl: "കിംഗ് അബ്ദുൽഅസീസ് റോഡ്, ബുറൈദ",
        mapsQuery: "Maali Medical Clinic Buraidah Saudi Arabia",
        note: "ജനറൽ കെയർ, ഡെന്റൽ സർവീസുകൾ, ഇൻഷുറൻസ് അഫിലിയേഷൻ."
      }
    ],

    "Tabuk": [
      {
        name: "Tabuk National Polyclinic",
        nameMl: "തബൂക്ക് നാഷണൽ പോളിക്ലിനിക്ക്",
        area: "Al Manshiyah, Tabuk",
        areaMl: "അൽ മൻശിയ്യ, തബൂക്ക്",
        mapsQuery: "Tabuk National Polyclinic Tabuk Saudi Arabia",
        note: "തബൂക്ക് നഗരത്തിലെ മലയാളി പ്രവാസികൾക്ക് സൗകര്യപ്രദം."
      },
      {
        name: "Al Arjan Medical Polyclinic",
        nameMl: "അൽ അർജാൻ മെഡിക്കൽ പോളിക്ലിനിക്ക്",
        area: "Al Aziziyah, Tabuk",
        areaMl: "അൽ അസീസിയ്യ, തബൂക്ക്",
        mapsQuery: "Al Arjan Medical Polyclinic Tabuk Saudi Arabia",
        note: "വിവിധ വകുപ്പുകളിലെ വിദഗ്ദ്ധ ഡോക്ടർമാരുടെ സേവനം."
      },
      {
        name: "Al Dakhel Polyclinic",
        nameMl: "അൽ ദാഖിൽ പോളിക്ലിനിക്ക് (തബൂക്ക്)",
        area: "Al Ulaya, Tabuk",
        areaMl: "അൽ ഉലയ്യ, തബൂക്ക്",
        mapsQuery: "Al Dakhel Polyclinic Tabuk Saudi Arabia",
        note: "ലാബ് പരിശോധനകളും ജനറൽ ഒപിയും."
      }
    ],

    "AlJouf": [
      {
        name: "Amass Polyclinic Complex – Sakaka",
        nameMl: "അമാസ് പോളിക്ലിനിക്ക് കോംപ്ലക്സ് (സകാക്ക)",
        area: "King Khalid Road, Sakaka, Al Jouf",
        areaMl: "കിംഗ് ഖാലിദ് റോഡ്, സകാക്ക (അൽ ജൗഫ്)",
        mapsQuery: "Amass Polyclinic Complex Sakaka Al Jouf Saudi Arabia",
        note: "സകാക്കയിലെ പ്രധാന പ്രവാസി മെഡിക്കൽ കോംപ്ലക്സ്."
      },
      {
        name: "Al Baraka Polyclinic",
        nameMl: "അൽ ബറക പോളിക്ലിനിക്ക് (അൽ ജൗഫ്)",
        area: "Al Faisaliyah, Sakaka",
        areaMl: "അൽ ഫൈസലിയ്യ, സകാക്ക",
        mapsQuery: "Al Baraka Polyclinic Sakaka Al Jouf Saudi Arabia",
        note: "ക്ലാസ് ബി & സി ഇൻഷുറൻസ് സൗകര്യങ്ങൾ."
      }
    ],

    "AlBaha": [
      {
        name: "Al-Hayat General Medical Clinics Complex",
        nameMl: "അൽ ഹയാത്ത് മെഡിക്കൽ ക്ലിനിക്സ് കോംപ്ലക്സ്",
        area: "Al Baha City Center",
        areaMl: "അൽ ബഹ സിറ്റി സെന്റർ",
        mapsQuery: "Al Hayat General Medical Clinics Complex Al Baha Saudi Arabia",
        note: "അൽ ബഹയിലെ മലയാളി തൊഴിലാളികൾക്ക് ആശ്രയിക്കാവുന്ന കേന്ദ്രം."
      },
      {
        name: "Al-Baha Medical Center",
        nameMl: "അൽ ബഹ മെഡിക്കൽ സെന്റർ",
        area: "King Fahd Road, Al Baha",
        areaMl: "കിംഗ് ഫഹദ് റോഡ്, അൽ ബഹ",
        mapsQuery: "Al Baha Medical Center Al Baha Saudi Arabia",
        note: "ജനറൽ കൺസൾട്ടേഷനും അത്യാഹിത വിഭാഗവും."
      },
      {
        name: "Al-Farabi Medical Complex",
        nameMl: "അൽ ഫറാബി മെഡിക്കൽ കോംപ്ലക്സ്",
        area: "Al Rawdah, Al Baha",
        areaMl: "അൽ റൗദ, അൽ ബഹ",
        mapsQuery: "Al Farabi Medical Complex Al Baha Saudi Arabia",
        note: "ഡെന്റൽ, ഇന്റേണൽ മെഡിസിൻ, ഫാർമസി."
      },
      {
        name: "Salem Medical Care",
        nameMl: "സാലെം മെഡിക്കൽ കെയർ (അൽ ബഹ)",
        area: "Baljurashi Road, Al Baha",
        areaMl: "ബൽജുറാഷി റോഡ്, അൽ ബഹ",
        mapsQuery: "Salem Medical Care Al Baha Saudi Arabia",
        note: "നല്ല പെരുമാറ്റമുള്ള സ്റ്റാഫും താങ്ങാവുന്ന ഫീസും."
      }
    ],

    "Khamis": [
      {
        name: "Abeer Medical Center – Khamis Mushait",
        nameMl: "അബീർ മെഡിക്കൽ സെന്റർ (ഖമീസ് മുശൈത്ത്)",
        area: "Al Aziziyah / King Fahd Road, Khamis Mushait",
        areaMl: "അൽ അസീസിയ്യ / കിംഗ് ഫഹദ് റോഡ്, ഖമീസ് മുശൈത്ത്",
        phone: "+966920015888",
        isAbeerUnified: true,
        mapsQuery: "Abeer Medical Center Khamis Mushait Saudi Arabia",
        note: "അസീർ മേഖലയിലെ മലയാളികളുടെ ഏറ്റവും വലിയ മെഡിക്കൽ സെന്റർ."
      },
      {
        name: "Shifa Al Khamis Polyclinic",
        nameMl: "ശിഫ അൽ ഖമീസ് പോളിക്ലിനിക്ക്",
        area: "Industrial Area (Sanayah), Khamis Mushait",
        areaMl: "സനായ്യ, ഖമീസ് മുശൈത്ത്",
        mapsQuery: "Shifa Al Khamis Polyclinic Khamis Mushait Saudi Arabia",
        note: "സനായ്യയിലെ മലയാളി വർക്ക്‌ഷോപ്പ് തൊഴിലാളികളുടെ വിശ്വസ്ത ക്ലിനിക്ക്."
      },
      {
        name: "Al-Haramain National Medical Complex",
        nameMl: "അൽ ഹറമൈൻ നാഷണൽ മെഡിക്കൽ കോംപ്ലക്സ്",
        area: "Al Khalidiyah, Khamis Mushait",
        areaMl: "അൽ ഖാലിദിയ്യ, ഖമീസ് മുശൈത്ത്",
        mapsQuery: "AlHaramain National Medical Complex Khamis Mushait Saudi Arabia",
        note: "പ്രധാന ഇൻഷുറൻസ് അംഗീകാരങ്ങൾ ഉള്ള പോളിക്ലിനിക്ക്."
      },
      {
        name: "Nahdi Care Clinics – Khamis",
        nameMl: "നഹ്ദി കെയർ ക്ലിനിക്സ് (ഖമീസ്)",
        area: "Military City Road, Khamis Mushait",
        areaMl: "മിലിട്ടറി സിറ്റി റോഡ്, ഖമീസ് മുശൈത്ത്",
        mapsQuery: "Nahdi Care Clinics Khamis Mushait Saudi Arabia",
        note: "ഡിജിറ്റൽ അപ്പോയിന്റ്മെന്റും ആധുനിക ഡയഗ്നോസ്റ്റിക്സും."
      }
    ]
  },

  // 3. Airport Customs & Banned Medicines Checklist
  customsChecklist: [
    {
      category: "banned",
      titleMl: "കസകസ (Poppy Seeds / Khaskhas)",
      statusText: "പൂർണ്ണ നിരോധനം (Zero Tolerance)",
      descMl: "കറികളിലും ബിരിയാണികളിലും ചേർക്കുന്ന കസകസ സൗദിയിൽ മയക്കുമരുന്ന് (Narcotics) നിയമപ്രകാരം കർശനമായി നിരോധിച്ചതാണ്. ഒരു നുള്ള് പോലും കൊണ്ടുവരരുത് — വൻ തടവുശിക്ഷ ലഭിക്കാം.",
      riskLevel: "CRITICAL"
    },
    {
      category: "banned",
      titleMl: "ട്രമഡോൾ & കഠിനമായ വേദനസംഹാരികൾ (Tramadol / Narcotics)",
      statusText: "നിയമവിരുദ്ധം (Strictly Prohibited)",
      descMl: "ട്രമഡോൾ, മോർഫിൻ തുടങ്ങിയ ഒപിയോയിഡ് വേദനസംഹാരികൾ സൗദിയിൽ പൂർണ്ണ നിരോധനത്തിലാണ്. കൃത്യമായ എംബസി/മന്ത്രാലയ അറ്റസ്റ്റേഷൻ ഇല്ലാതെ കൈവശം വെക്കുന്നത് ക്രിമിനൽ കുറ്റമാണ്.",
      riskLevel: "CRITICAL"
    },
    {
      category: "banned",
      titleMl: "ചില ഉറക്കഗുളികകൾ & കോഡീൻ സിറപ്പുകൾ (Sleeping Pills / Codeine)",
      statusText: "നിരോധിതം (Prohibited)",
      descMl: "കോഡീൻ (Codeine) അടങ്ങിയ ചുമ സിറപ്പുകൾ, സൈക്കോട്രോപിക് ഉറക്കഗുളികകൾ (Diazepam, Zolpidem മുതലായവ) സ്പെഷ്യൽ പെർമിറ്റ് ഇല്ലാതെ എയർപോർട്ടിൽ പിടികൂടും.",
      riskLevel: "HIGH"
    },
    {
      category: "banned",
      titleMl: "ലേബൽ ഇല്ലാത്ത നാടൻ മരുന്നുകൾ / പൊടികൾ / ഭസ്മങ്ങൾ",
      statusText: "തടഞ്ഞുവെക്കും (Confiscated)",
      descMl: "ഇംഗ്ലീഷിലോ അറബിയിലോ ഔദ്യോഗിക ചേരുവകൾ രേഖപ്പെടുത്താത്ത നാടൻ ആയുർവേദ/സിദ്ധ/ഹോമിയോ പൊടികൾ ഡ്രഗ്ഗ് ടെസ്റ്റിംഗിനായി കസ്റ്റംസ് തടഞ്ഞുവെക്കും.",
      riskLevel: "HIGH"
    },
    {
      category: "banned",
      titleMl: "പാൻമസാല, ഗുട്ഖ, വെറ്റില, ലഹരിവസ്തുക്കൾ",
      statusText: "വൻ പിഴയും നാടുകടത്തലും",
      descMl: "വെറ്റില, പാക്ക്, പുകയില ഉൽപ്പന്നങ്ങൾ, പാൻമസാല എന്നിവ ബാഗേജിൽ കൊണ്ടുവരുന്നത് സൗദി കസ്റ്റംസ് നിയമപ്രകാരം ശിക്ഷാർഹമാണ്.",
      riskLevel: "CRITICAL"
    },
    {
      category: "allowed",
      titleMl: "സ്ഥിരം കഴിക്കുന്ന ജീവിതശൈലി മരുന്നുകൾ (BP, ഷുഗർ, കൊളസ്ട്രോൾ)",
      statusText: "അനുവദനീയം (Allowed with Prescription)",
      descMl: "യഥാർത്ഥ സ്ട്രിപ്പുകളിൽ (Original packing), രജിസ്റ്റർ ചെയ്ത ഡോക്ടറുടെ ഇംഗ്ലീഷ് കുറിപ്പടിയോടെ (Prescription) 3 മാസത്തെ ആവശ്യത്തിന് വരെ കൊണ്ടുവരാം.",
      riskLevel: "SAFE"
    },
    {
      category: "allowed",
      titleMl: "സാധാരണ പാരസെറ്റമോൾ & ആന്റാസിഡുകൾ (OTC Medicines)",
      statusText: "വ്യക്തിഗത ആവശ്യത്തിന് അനുവദനീയം",
      descMl: "പാരസെറ്റമോൾ (Panadol), വയറുവേദന, ഗ്യാസ് സംബന്ധമായ സാധാരണ മരുന്നുകൾ ചെറിയ അളവിൽ വ്യക്തിഗത ഉപയോഗത്തിനായി ബാഗേജിൽ വെക്കാം.",
      riskLevel: "SAFE"
    },
    {
      category: "allowed",
      titleMl: "ഇൻസുലിൻ & ഡയബറ്റിക് കുത്തിവെയ്പ്പുകൾ",
      statusText: "ഡോക്ടർ കുറിപ്പടിയോടെ ഹാൻഡ് ബാഗിൽ",
      descMl: "ഇൻസുലിൻ വയലുകൾ കൂളിംഗ് പൗച്ചിൽ ഹാൻഡ് ബാഗേജിൽ കരുതാം. ഇൻസുലിൻ പെൻ സൂചികൾ സൂക്ഷിക്കാൻ ഡോക്ടറുടെ മെഡിക്കൽ ലെറ്റർ കരുതുക.",
      riskLevel: "SAFE"
    }
  ],

  // 4. Daily Arabic-Malayalam Phrasebook (5 Categories, 8-10 phrases each)
  phrasebook: {
    "hospital": [
      {
        ar: "أنا مريض جداً",
        mlMeaning: "എനിക്ക് സുഖമില്ല / അസുഖമാണ്",
        mlPhonetic: "അന മരീദ് ജിദ്ദൻ",
        enPhonetic: "Ana mareedh jiddan"
      },
      {
        ar: "عندي ألم في بطني",
        mlMeaning: "എന്റെ വയറുവേദനിക്കുന്നു",
        mlPhonetic: "ഇന്ദീ അലം ഫീ ബത്‌നീ",
        enPhonetic: "Indi alam fee batnee"
      },
      {
        ar: "عندي صداع قوي",
        mlMeaning: "എനിക്ക് കഠിനമായ തലവേദനയുണ്ട്",
        mlPhonetic: "ഇന്ദീ സുദാഅ് ഖവിയ്യ്",
        enPhonetic: "Indi suda' qawiyy"
      },
      {
        ar: "عندي حرارة وسعال",
        mlMeaning: "എനിക്ക് പനിയും ചുമയുമുണ്ട്",
        mlPhonetic: "ഇന്ദീ ഹറാറ വ സുആൽ",
        enPhonetic: "Indi hararah wa su'al"
      },
      {
        ar: "أين قسم الطوارئ؟",
        mlMeaning: "എമർജൻസി / അത്യാഹിത വിഭാഗം എവിടെയാണ്?",
        mlPhonetic: "ഐന ഖിസ്മു തവാരിഅ്?",
        enPhonetic: "Ayna qismu-tawari'?"
      },
      {
        ar: "هل تقبلون هذا التأمين؟",
        mlMeaning: "ഈ ഇൻഷുറൻസ് ഇവിടെ എടുക്കുമോ?",
        mlPhonetic: "ഹൽ തഖ്ബലൂൻ ഹാദാ തഅ്മീൻ?",
        enPhonetic: "Hal taqbaloon hadha ta'meen?"
      },
      {
        ar: "أحتاج إلى دواء مسكن",
        mlMeaning: "എനിക്ക് വേദനസംഹാരി ഗുളിക വേണം",
        mlPhonetic: "അഹ്താജു ഇലാ ദവാഅ് മുസക്കിൻ",
        enPhonetic: "Ahtaju ila dawa' musakkin"
      },
      {
        ar: "أريد مقابلة طبيب عام",
        mlMeaning: "എനിക്ക് ജനറൽ ഡോക്ടറെ കാണണം",
        mlPhonetic: "ഉരീദു മുഖാബലത തബീബ് ആം",
        enPhonetic: "Ureedu muqabalata tabeeb 'aam"
      },
      {
        ar: "كم تكلفة الكشف؟",
        mlMeaning: "ഡോക്ടറെ കാണാൻ എത്ര ഫീസ് വരും?",
        mlPhonetic: "കം തക്ലിഫതുൽ കശ്ഫ്?",
        enPhonetic: "Kam taklifatul kashf?"
      }
    ],

    "police": [
      {
        ar: "السلام عليكم يا ضابط",
        mlMeaning: "നമസ്കാരം ഓഫീസർ",
        mlPhonetic: "അസ്സലാമു അലൈക്കും യാ ദാബിത്വ്",
        enPhonetic: "Assalamu alaykum ya dhabit"
      },
      {
        ar: "تفضل، هذه إقامتي ورخصتي",
        mlMeaning: "ഇതാ എന്റെ ഇഖാമയും ഡ്രൈവിംഗ് ലൈസൻസും",
        mlPhonetic: "തഫദ്ദൽ, ഹാദിഹീ ഇഖാമതീ വ റുഖ്സതീ",
        enPhonetic: "Tafaddal, hadhihi iqamatee wa rukhsatee"
      },
      {
        ar: "صار حادث بسيط هنا",
        mlMeaning: "ഇവിടെ ഒരു ചെറിയ അപകടം നടന്നു",
        mlPhonetic: "സ്വാറ ഹാദിസ് ബസീത്വ് ഹുനാ",
        enPhonetic: "Saara haadith baseet huna"
      },
      {
        ar: "اتصلت بنجم وأنا أنتظر",
        mlMeaning: "ഞാൻ നജ്മിൽ വിളിച്ചു കാത്തുനിൽക്കുകയാണ്",
        mlPhonetic: "ഇത്തസ്വൽത്തു ബി-നജ്മ് വ അന അൻതദിർ",
        enPhonetic: "Ittasaltu bi-Najm wa ana antadhir"
      },
      {
        ar: "فقدت محفظتي وإقامتي",
        mlMeaning: "എന്റെ വാലറ്റും ഇഖാമയും നഷ്ടപ്പെട്ടു",
        mlPhonetic: "ഫഖദ്തു മഹ്ഫദതീ വ ഇഖാമതീ",
        enPhonetic: "Faqadtu mahfadhatee wa iqamatee"
      },
      {
        ar: "أنا لا أفهم عربي كثير",
        mlMeaning: "എനിക്ക് അറബി അധികം മനസ്സിലാകില്ല",
        mlPhonetic: "അന ലാ അഫ്ഹം അറബീ കസീർ",
        enPhonetic: "Ana la afham arabi katheer"
      },
      {
        ar: "هل يمكنني الذهاب الآن؟",
        mlMeaning: "എനിക്ക് ഇപ്പോൾ പോകാൻ അനുവാദമുണ്ടോ?",
        mlPhonetic: "ഹൽ യുമകിനുനീ അദ്ദഹാബ് അൽആൻ?",
        enPhonetic: "Hal yumkinunee adh-dhahab al-aan?"
      },
      {
        ar: "أحتاج إلى مساعدة من فضلك",
        mlMeaning: "ദയവായി എനിക്കൊരു സഹായം വേണം",
        mlPhonetic: "അഹ്താജു ഇലാ മുസാഅദ മിൻ ഫദ്‌ലക്",
        enPhonetic: "Ahtaju ila musa'adah min fadlak"
      }
    ],

    "shop": [
      {
        ar: "بكم هذا الكيلو؟",
        mlMeaning: "ഇതിന് ഒരു കിലോക്ക് എത്ര രൂപയാണ്?",
        mlPhonetic: "ബികം ഹാദൽ കീലോ?",
        enPhonetic: "Bikam hadhal-keelo?"
      },
      {
        ar: "أعطني خبز وحليب لو سمحت",
        mlMeaning: "ദയവായി ഖുബ്ബൂസും പാലും തരൂ",
        mlPhonetic: "അഅ്തിനീ ഖുബ്സ് വ ഹലീബ് ലൗ സമഹ്ത്",
        enPhonetic: "A'tinee khubz wa haleeb law samaht"
      },
      {
        ar: "هل الدفع بالشبكة متوفر؟",
        mlMeaning: "ഇവിടെ കാർഡ് / മദ (Mada) സ്വീകരിക്കുമോ?",
        mlPhonetic: "ഹൽ അദ്ദഫ്അ് ബി-ശബക മുതവഫ്ഫിർ?",
        enPhonetic: "Hal ad-daf' bi-shabaka mutawaffir?"
      },
      {
        ar: "هل هناك خصم أو عرض؟",
        mlMeaning: "എന്തെങ്കിലും ഡിസ്കൗണ്ടോ ഓഫറോ ഉണ്ടോ?",
        mlPhonetic: "ഹൽ ഹുനാക ഖസ്മ് ഔ അർദ്വ്?",
        enPhonetic: "Hal hunaka khasm aw 'ardh?"
      },
      {
        ar: "أريد كيس نايلون",
        mlMeaning: "എനിക്കൊരു പ്ലാസ്റ്റിക് കവർ വേണം",
        mlPhonetic: "ഉരീദു കീസ് നൈലോൺ",
        enPhonetic: "Ureedu kees nylon"
      },
      {
        ar: "أعطني الفاتورة من فضلك",
        mlMeaning: "ദയവായി ബില്ല് / രസീത് തരൂ",
        mlPhonetic: "അഅ്തിനിൽ ഫാതൂറ മിൻ ഫദ്‌ലക്",
        enPhonetic: "A'tinil-fatoorah min fadlak"
      },
      {
        ar: "كم الحساب الإجمالي؟",
        mlMeaning: "ആകെ എത്ര തുകയായി?",
        mlPhonetic: "കമിൽ ഹിസാബുൽ ഇജ്മാലീ?",
        enPhonetic: "Kamil-hisabul ijmali?"
      },
      {
        ar: "شكراً وجزاك الله خيراً",
        mlMeaning: "നന്ദി, ദൈവം അനുഗ്രഹിക്കട്ടെ",
        mlPhonetic: "ശുക്റൻ വ ജസാക്കല്ലാഹു ഖൈറൻ",
        enPhonetic: "Shukran wa jazakallahu khayran"
      }
    ],

    "workplace": [
      {
        ar: "صباح الخير يا معلم",
        mlMeaning: "സുപ്രഭാതം മുദലാളി / സാർ",
        mlPhonetic: "സ്വബാഹുൽ ഖൈർ യാ മുഅല്ലിം",
        enPhonetic: "Sabahul-khayr ya m'allim"
      },
      {
        ar: "أنا خلصت الشغل كامل",
        mlMeaning: "ഞാൻ ജോലി മുഴുവൻ പൂർത്തിയാക്കി",
        mlPhonetic: "അന ഖല്ലസ്ത്തു ശുഗ്ല് കാമിൽ",
        enPhonetic: "Ana khallastu shugl kaamil"
      },
      {
        ar: "إيش الشغل المطلوب اليوم؟",
        mlMeaning: "ഇന്ന് എന്താണ് ചെയ്യേണ്ട പണി?",
        mlPhonetic: "ഈശ് അശ്ശുഗ്ലുൽ മത്‌ലൂബ് അൽയൗം?",
        enPhonetic: "Eesh ash-shuglul matloob al-yawm?"
      },
      {
        ar: "أنا تعبان، أبغى أرتاح شوي",
        mlMeaning: "ക്ഷീണമാണ്, അല്പസമയം വിശ്രമിച്ചോട്ടെ",
        mlPhonetic: "അന തഅ്ബാൻ, അബ്ഗാ അർതാഹ് ശ്വയ്യ്",
        enPhonetic: "Ana ta'baan, abgha artaah shwayy"
      },
      {
        ar: "متى ينزل الراتب؟",
        mlMeaning: "ശമ്പളം എപ്പോഴാണ് അക്കൗണ്ടിൽ വരിക?",
        mlPhonetic: "മതാ യൻസിലുർ റާތിബ്?",
        enPhonetic: "Mata yanzilur-raatib?"
      },
      {
        ar: "أبغى إجازة سنوية للسفر",
        mlMeaning: "നാട്ടിൽ പോകാൻ വാർഷിക അവധി വേണം",
        mlPhonetic: "അബ്ഗാ ഇജാസ സനവിയ്യ ലിസ്സഫർ",
        enPhonetic: "Abgha ijazah sanawiyyah lis-safar"
      },
      {
        ar: "أحتاج ورقة تعريف راتب",
        mlMeaning: "എനിക്കൊരു സാലറി സർട്ടിഫിക്കറ്റ് വേണം",
        mlPhonetic: "അഹ്താജു വറഖത തഅ്‌രീഫ് റާތിബ്",
        enPhonetic: "Ahtaju waraqata ta'reef raatib"
      },
      {
        ar: "ما عندي مشكلة، حاضر",
        mlMeaning: "പ്രശ്നമില്ല, ചെയ്തോളാം (ഹാദിർ)",
        mlPhonetic: "മാ ഇന്ദീ മുശ്കില, ഹാദിർ",
        enPhonetic: "Ma indi mushkila, haadhir"
      }
    ],

    "daily": [
      {
        ar: "السلام عليكم ورحمة الله",
        mlMeaning: "നിങ്ങൾക്ക് സമാധാനം ഉണ്ടാവട്ടെ",
        mlPhonetic: "അസ്സലാമു അലൈക്കും വ റഹ്മത്തുല്ലാഹ്",
        enPhonetic: "Assalamu alaykum wa rahmatullah"
      },
      {
        ar: "كيف حالك؟ عساك بخير؟",
        mlMeaning: "എന്തുണ്ട് വിശേഷം? സുഖമാണോ?",
        mlPhonetic: "കൈഫ ഹാലുക്? അസാക്ക ബിഖൈർ?",
        enPhonetic: "Kayfa haaluk? Asaaka bikhayr?"
      },
      {
        ar: "الحمد لله، كل شيء تمام",
        mlMeaning: "ദൈവത്തിന് സ്തുതി, എല്ലാം സുഖം തന്നെ",
        mlPhonetic: "അൽഹംദുലില്ലാഹ്, കുല്ലു ശൈഇൻ തമാം",
        enPhonetic: "Alhamdulillah, kullu shayin tamaam"
      },
      {
        ar: "كم الساعة الآن؟",
        mlMeaning: "ഇപ്പോൾ സമയം എത്രയായി?",
        mlPhonetic: "കമിസ് സാഅത്തുൽ ആൻ?",
        enPhonetic: "Kamis-sa'atul aan?"
      },
      {
        ar: "أين المسجد القريب من هنا؟",
        mlMeaning: "ഇവിടെ അടുത്ത് പള്ളി എവിടെയാണ്?",
        mlPhonetic: "ഐനൽ മസ്ജിദുൽ ഖരീബ് മിൻ ഹുനാ?",
        enPhonetic: "Aynal-masjidul qareeb min huna?"
      },
      {
        ar: "لو سمحت، أريد ماء بارد",
        mlMeaning: "ദയവായി കുറച്ചു തണുത്ത വെള്ളം തരൂ",
        mlPhonetic: "ലൗ സമഹ്ത്, ഉരീദു മാഅ് ബാരിദ്",
        enPhonetic: "Law samaht, ureedu ma' barid"
      },
      {
        ar: "أنا رايح الحين، مع السلامة",
        mlMeaning: "ഞാൻ ഇപ്പോൾ ഇറങ്ങുന്നു, യാത്രപറയുന്നു",
        mlPhonetic: "അന റായിഹ് അൽഹീൻ, മഅസ്സലാമ",
        enPhonetic: "Ana rayih al-heen, ma'as-salamah"
      },
      {
        ar: "إن شاء الله، الله يسلمك",
        mlMeaning: "ദൈവം ഇച്ഛിച്ചാൽ, ദൈവം രക്ഷിക്കട്ടെ",
        mlPhonetic: "ഇൻഷാ അല്ലാഹ്, അല്ലാഹു യുസല്ലിമുക്",
        enPhonetic: "Insha'Allah, Allahu yusallimuk"
      }
    ]
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = HEALTH_DATA;
}

if (typeof window !== "undefined") { window.HEALTH_DATA = HEALTH_DATA; }
