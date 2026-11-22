/**
 * KSA Malayali Hub — Saudi Vision 2030 & FIFA World Cup 2034 Stadiums Guide
 * Includes:
 *   - Tab A: Saudi Vision 2030 Mega Projects (NEOM, Qiddiya, Red Sea Global, Diriyah, New Murabba, Transport)
 *   - Tab B: FIFA World Cup 2034 Stadiums (15 Stadiums across 5 Cities with City Filter & Google Maps CTAs)
 */

(function () {
  "use strict";

  const VISION_2030_DATA = {
    overview: {
      title: "സൗദി വിഷൻ 2030 — മാറ്റത്തിന്റെ സുവർണ്ണ യുഗം",
      subtitle: "കിരീടാവകാശി മുഹമ്മദ് ബിൻ സൽമാൻ (MBS) വിഭാവനം ചെയ്ത സൗദി അറേബ്യയുടെ സമഗ്ര പരിവർത്തന രൂപരേഖ.",
      pillars: [
        {
          icon: "📈",
          title: "സാമ്പത്തിക വൈവിധ്യവൽക്കരണം",
          desc: "എണ്ണയെ മാത്രം ആശ്രയിക്കുന്ന സമ്പദ്‌വ്യവസ്ഥയിൽ നിന്ന് മാറി ടൂറിസം, സാങ്കേതികവിദ്യ, വ്യവസായം, നിർമ്മാണം, ലോജിസ്റ്റിക്സ് എന്നിവയിൽ സ്വകാര്യ മേഖലയുടെ പങ്കാളിത്തം 65% ആയി വർദ്ധിപ്പിക്കുന്നു."
        },
        {
          icon: "🌍",
          title: "ആഗോള വിനോദസഞ്ചാര വിപ്ലവം",
          desc: "വർഷം 150 ദശലക്ഷം സന്ദർശകരെ ആകർഷിക്കുന്ന ലോകോത്തര ഹബ്ബായി സൗദിയെ മാറ്റുക; ജിഡിപിയുടെ 10% ടൂറിസത്തിൽ നിന്നാക്കുക."
        },
        {
          icon: "💼",
          title: "പ്രവാസികൾക്കുള്ള തൊഴിലവസരങ്ങൾ",
          desc: "മെഗാ പ്രോജക്ടുകളിൽ എഞ്ചിനീയറിംഗ്, ഐടി, നിർമ്മാണം, ഹോസ്പിറ്റാലിറ്റി, ഏവിയേഷൻ, ഹെൽത്ത്കെയർ രംഗങ്ങളിൽ മലയാളികൾ ഉൾപ്പെടെയുള്ള പ്രവാസികൾക്ക് മികച്ച കരിയർ സാധ്യതകൾ."
        },
        {
          icon: "🌱",
          title: "ജീവിതനിലവാരവും പരിസ്ഥിതിയും",
          desc: "സൗദി ഗ്രീൻ ഇനിഷ്യേറ്റീവ് വഴി 10 ബില്യൺ മരങ്ങൾ വെച്ചുപിടിപ്പിക്കൽ, 50% ക്ലീൻ റിന്യൂവബിൾ എനർജി, മികച്ച ആരോഗ്യ-വിദ്യാഭ്യാസ-കായിക സംസ്കാരം."
        }
      ]
    },
    projects: [
      {
        id: "neom",
        nameMl: "നിയോം (NEOM)",
        nameEn: "NEOM Futuristic Region",
        location: "തബൂക്ക് പ്രവിശ്യ, ചെങ്കടൽ തീരം (Tabuk)",
        investment: "$500+ ബില്യൺ",
        icon: "🏙️",
        tag: "ലോകത്തിന്റെ ഭാവി നഗരം",
        desc: "ചെങ്കടൽ തീരത്ത് 26,500 ചതുരശ്ര കി.മീറ്ററിൽ 100% പുനരുപയോഗ ഊർജ്ജത്തിൽ മാത്രം പ്രവർത്തിക്കുന്ന ലോകത്തിലെ ഏറ്റവും വലിയ ഫ്യൂച്ചറിസ്റ്റിക് മെഗാ പ്രോജക്റ്റ്.",
        subProjects: [
          {
            name: "ദി ലൈൻ (The Line)",
            desc: "170 കി.മീ നീളവും 500 മീറ്റർ ഉയരവുമുള്ള കണ്ണാടി നഗരം. കാറുകളോ റോഡുകളോ കാർബൺ എമിഷനോ ഇല്ലാതെ 9 ദശലക്ഷം ആളുകൾക്ക് താമസിക്കാം."
          },
          {
            name: "ട്രൊജീന (Trojena)",
            desc: "2029 ഏഷ്യൻ വിന്റർ ഗെയിംസ് വേദി. സൗദിയിലെ മഞ്ഞുമൂടിയ മലനിരകളിൽ വർഷം മുഴുവൻ ആസ്വദിക്കാവുന്ന ഔട്ട്ഡോർ സ്കീയിംഗ് റിസോർട്ട്."
          },
          {
            name: "ഒക്സാഗൺ (Oxagon)",
            desc: "ചെങ്കടലിൽ പൊങ്ങിക്കിടക്കുന്ന ലോകത്തെ ഏറ്റവും വലിയ ഫ്ലോട്ടിംഗ് ഇൻഡസ്ട്രിയൽ സിറ്റി & ക്ലീൻ എനർജി അഡ്വാൻസ്ഡ് മാനുഫാക്ചറിംഗ് ഹബ്."
          },
          {
            name: "സിന്ദാല (Sindalah)",
            desc: "ചെങ്കടലിലെ അതീവ ആഡംബര യാച്ച് ക്ലബ്ബ്, ഗോൾഫ് കോഴ്സ്, പ്രീമിയം മറൈൻ ടൂറിസം ദ്വീപ് (സന്ദർശകർക്കായി തുറന്നുകൊടുത്തു)."
          }
        ]
      },
      {
        id: "qiddiya",
        nameMl: "ഖിദ്ദിയ (Qiddiya)",
        nameEn: "Qiddiya Entertainment City",
        location: "റിയാദ് പടിഞ്ഞാറ്, ടുവൈഖ് മലനിരകൾ (Riyadh)",
        investment: "$10+ ബില്യൺ",
        icon: "🎢",
        tag: "വിനോദ & കായിക തലസ്ഥാനം",
        desc: "റിയാദിന് സമീപം 367 ചതുരശ്ര കി.മീറ്ററിൽ പണിതുയർത്തുന്ന ലോകത്തെ ഏറ്റവും വലിയ വിനോദ, കായിക, കലാ കേന്ദ്രം.",
        subProjects: [
          {
            name: "സിക്സ് ഫ്ലാഗ്സ് ഖിദ്ദിയ (Six Flags)",
            desc: "ലോകത്തിലെ ഏറ്റവും ഉയരമുള്ളതും വേഗതയേറിയതുമായ (250 km/h) 'Falcon\\'s Flight' റോളർ കോസ്റ്റർ അടങ്ങിയ 28 അൾട്രാ-റൈഡുകൾ."
          },
          {
            name: "സ്പീഡ് പാർക്ക് ട്രാക്ക് (Speed Park)",
            desc: "ഫോർമുല 1 (F1) മത്സരങ്ങൾക്കായി ടുവൈഖ് മലനിരകളുടെ വശങ്ങളിലൂടെ കടന്നുപോകുന്ന ലോകത്തെ അത്യാധുനിക മോട്ടോർ സ്പോർട്സ് ട്രാക്ക്."
          },
          {
            name: "ഗെയിമിംഗ് & ഇ-സ്പോർട്സ് ഡിസ്ട്രിക്റ്റ്",
            desc: "ലോകത്തെ മുൻനിര ഗെയിമിംഗ് ടൂർണമെന്റുകൾക്ക് സ്ഥിരം വേദിയാകുന്ന ആദ്യത്തെ സമഗ്ര ഇ-സ്പോർട്സ് നഗരം."
          },
          {
            name: "ക്ലിഫ്-ടോപ്പ് സ്റ്റേഡിയം",
            desc: "മലമുകളിൽ 200 മീറ്റർ ഉയരത്തിൽ നിർമ്മിക്കുന്ന ഫിഫ വേൾഡ് കപ്പ് 2034 വേദി (പ്രിൻസ് മുഹമ്മദ് ബിൻ സൽമാൻ സ്റ്റേഡിയം)."
          }
        ]
      },
      {
        id: "redsea",
        nameMl: "റെഡ് സീ ഗ്ലോബൽ (Red Sea Global)",
        nameEn: "Red Sea Project & Amaala",
        location: "ചെങ്കടൽ തീരം, അൽ-വജ്ഹ് & ഉംലുജ് (Red Sea Coast)",
        investment: "$30+ ബില്യൺ",
        icon: "🏝️",
        tag: "ആഡംബര ഇക്കോ-ടൂറിസം",
        desc: "90-ലധികം അൺടച്ച്ഡ് പ്രകൃതിദത്ത ദ്വീപുകളിലും പവിഴപ്പുറ്റുകളിലും വ്യാപിച്ച് കിടക്കുന്ന ലോകത്തിലെ ഏറ്റവും വലിയ റീജനറേറ്റീവ് ലക്ഷ്വറി ടൂറിസം പദ്ധതി.",
        subProjects: [
          {
            name: "100% പുനരുപയോഗ ഊർജ്ജം",
            desc: "ലോകത്തിൽ ആദ്യമായി മുഴുവൻ റിസോർട്ടുകളും സോളാർ പവറിലും ബാറ്ററി സ്റ്റോറേജിലും രാത്രിയും പകലും പൂർണ്ണമായി പ്രവർത്തിക്കുന്നു."
          },
          {
            name: "റെഡ് സീ ഇന്റർനാഷണൽ എയർപോർട്ട് (RSI)",
            desc: "ദ്വീപുകളിലേക്ക് നേരിട്ട് വിദേശ സഞ്ചാരികളെ എത്തിക്കുന്ന ഫോസ്റ്റർ + പാർട്ണേഴ്സ് രൂപകൽപ്പന ചെയ്ത ആധുനിക അന്താരാഷ്ട്ര വിമാനത്താവളം."
          },
          {
            name: "അമാല (Amaala)",
            desc: "അൾട്രാ-ലക്ഷ്വറി വെൽനസ് ടൂറിസം — യോഗ, മെഡിക്കൽ വെൽനസ്, മറൈൻ ലൈഫ് റിസർച്ച് ഇൻസ്റ്റിറ്റ്യൂട്ട്."
          }
        ]
      },
      {
        id: "diriyah",
        nameMl: "ദിരിയ ഗേറ്റ് (Diriyah Gate)",
        nameEn: "Diriyah Gate Development",
        location: "റിയാദ്, വാദി ഹനീഫ തീരം (Diriyah, Riyadh)",
        investment: "$63+ ബില്യൺ",
        icon: "🏰",
        tag: "പൈതൃക തലസ്ഥാനം",
        desc: "സൗദി അറേബ്യയുടെ പ്രഥമ തലസ്ഥാനവും സൗദി രാജവംശത്തിന്റെ ജന്മസ്ഥലവുമായ ദിരിയയെ ലോകത്തിലെ മുൻനിര സാംസ്കാരിക പൈതൃക നഗരമാക്കി മാറ്റുന്ന വൻകിട പദ്ധതി.",
        subProjects: [
          {
            name: "അൽ-തുറൈഫ് (At-Turaif)",
            desc: "യുനെസ്കോയുടെ ലോക പൈതൃക പട്ടികയിലുള്ള ചരിത്രപ്രസിദ്ധമായ മൺകൊട്ടാര സമുച്ചയം."
          },
          {
            name: "പരമ്പരാഗത നജ്ദി വാസ്തുവിദ്യ",
            desc: "നജ്ദി ശൈലിയിലുള്ള 38-ലധികം ആഡംബര ഹോട്ടലുകൾ, മ്യൂസിയങ്ങൾ, അക്കാദമികൾ, പരമ്പരാഗത ചന്തകൾ."
          },
          {
            name: "ബുജൈരി ടെറസ് (Bujairi Terrace)",
            desc: "ലോകോത്തര മിഷേലിൻ-സ്റ്റാർ റെസ്റ്റോറന്റുകളും പരമ്പരാഗത സൗദി വിഭവങ്ങളും നിറഞ്ഞ പ്രീമിയം ഡൈനിംഗ് കേന്ദ്രം."
          }
        ]
      },
      {
        id: "new_murabba",
        nameMl: "ന്യൂ മുറബ്ബ (New Murabba)",
        nameEn: "New Murabba & The Mukaab",
        location: "റിയാദ് നോർത്ത്-വെസ്റ്റ് (Riyadh)",
        investment: "$50+ ബില്യൺ",
        icon: "🕋",
        tag: "ദി മുഖാബ് — വിസ്മയ ക്യൂബ്",
        desc: "19 ചതുരശ്ര കി.മീറ്ററിൽ ലക്ഷക്കണക്കിന് ആളുകൾക്ക് താമസവും ഓഫീസുകളും വിനോദവും ഒരുക്കുന്ന ലോകത്തിലെ ഏറ്റവും വലിയ ആധുനിക ഡൗൺടൗൺ.",
        subProjects: [
          {
            name: "ദി മുഖാബ് (The Mukaab)",
            desc: "400 മീറ്റർ ഉയരവും 400 മീറ്റർ വീതിയുമുള്ള ഭീമാകാരമായ ക്യൂബ്. 20 എംപയർ സ്റ്റേറ്റ് ബിൽഡിംഗുകൾ ഉൾക്കൊള്ളാൻ ശേഷിയുള്ള ലോകത്തിലെ ഏറ്റവും വലിയ സിംഗിൾ സ്ട്രക്ചർ."
          },
          {
            name: "ഹോളോഗ്രാഫിക് ഇമ്മേഴ്‌സീവ് ലോകം",
            desc: "മുഖാബിന്റെ ഉൾവശത്ത് മറ്റൊരു ലോകത്ത് എത്തിയതുപോലെ തോന്നിപ്പിക്കുന്ന അത്യാധുനിക വെർച്വൽ ഡിജിറ്റൽ സ്കൈസ് & എഐ സാങ്കേതികവിദ്യ."
          },
          {
            name: "1,04,000 റെസിഡൻഷ്യൽ യൂണിറ്റുകൾ",
            desc: "9,000 ഹോട്ടൽ മുറികൾ, വാക്കിംഗ് പ്ലാസകൾ, റിയാദ് മെട്രോയുമായി നേരിട്ടുള്ള കണക്റ്റിവിറ്റി."
          }
        ]
      },
      {
        id: "riyadh_transport",
        nameMl: "റിയാദ് മെട്രോ & കിംഗ് സൽമാൻ എയർപോർട്ട്",
        nameEn: "Riyadh Metro & King Salman Airport",
        location: "റിയാദ് തലസ്ഥാന മേഖല (Riyadh Region)",
        investment: "$40+ ബില്യൺ",
        icon: "🚇",
        tag: "മെഗാ ട്രാൻസ്പോർട്ട് ശൃംഖല",
        desc: "റിയാദിനെ ലോകത്തിലെ ഏറ്റവും മികച്ച 10 നഗരങ്ങളിൽ ഒന്നാക്കി മാറ്റുന്നതിനായുള്ള അതിവേഗ ഗതാഗത-വ്യോമയാന വികസനങ്ങൾ.",
        subProjects: [
          {
            name: "റിയാദ് മെട്രോ (Riyadh Metro)",
            desc: "176 കി.മീ നീളം, 6 ലൈനുകൾ, 84 സ്റ്റേഷനുകൾ. മിഡിൽ ഈസ്റ്റിലെ ഏറ്റവും വലിയ ഓട്ടോമേറ്റഡ് ഡ്രൈവർലെസ്സ് ട്രെയിൻ ശൃംഖല."
          },
          {
            name: "കിംഗ് സൽമാൻ എയർപോർട്ട് (KSIA)",
            desc: "57 ച.കി.മീറ്ററിൽ 6 സമാന്തര റൺവേകളോടെ വർഷം 120 ദശലക്ഷം യാത്രക്കാരെ ഉൾക്കൊള്ളുന്ന ലോകത്തിലെ ഏറ്റവും വലിയ മെഗാ എയർപോർട്ടുകളിൽ ഒന്ന്."
          },
          {
            name: "റിയാദ് എയർ (Riyadh Air)",
            desc: "സൗദിയുടെ പുതിയ പ്രീമിയം ദേശീയ വിമാനക്കമ്പനി — 2030-ഓടെ 100-ലധികം ആഗോള ലക്ഷ്യസ്ഥാനങ്ങളിലേക്ക് നേരിട്ടുള്ള സർവീസ്."
          }
        ]
      }
    ]
  };

  const FIFA_STADIUMS_DATA = [
    // Riyadh (8 Stadiums)
    {
      id: "stadium-1",
      nameMl: "കിംഗ് സൽമാൻ ഇന്റർനാഷണൽ സ്റ്റേഡിയം",
      nameEn: "King Salman International Stadium",
      city: "Riyadh",
      cityMl: "റിയാദ്",
      capacity: "~92,760",
      status: "new",
      statusText: "പുതിയ നിർമ്മാണം",
      badgeColor: "emerald",
      highlight: "🏆 ഉദ്ഘാടന മത്സരവും ഫൈനലും നടക്കുന്ന പ്രധാന വേദി",
      desc: "സൗദിയിലെ ഏറ്റവും വലിയ സ്റ്റേഡിയം. റിയാദ് ഗ്രീൻ ബെൽറ്റിനോട് ചേർന്ന് പച്ചപ്പും അത്യാധുനിക സോളാർ റൂഫും കൂടിച്ചേർന്ന ഗംഭീര രൂപകൽപ്പന.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=King+Salman+International+Stadium+Riyadh"
    },
    {
      id: "stadium-2",
      nameMl: "കിംഗ് ഫഹദ് സ്പോർട്സ് സിറ്റി സ്റ്റേഡിയം",
      nameEn: "King Fahd Sports City Stadium",
      city: "Riyadh",
      cityMl: "റിയാദ്",
      capacity: "~70,200",
      status: "renovated",
      statusText: "നവീകരിച്ചത്",
      badgeColor: "gold",
      highlight: "⛺ പാരമ്പര്യ ടെന്റ് മേൽക്കൂര നിലനിർത്തി സമഗ്രമായി നവീകരിക്കുന്നു",
      desc: "സൗദിയുടെ അഭിമാനമായ ചരിത്ര സ്റ്റേഡിയം. ആധുനിക സാങ്കേതികവിദ്യകളും വിഐപി സൗകര്യങ്ങളും ചേർത്ത് ശേഷി 70,000-ത്തിന് മുകളിലേക്ക് ഉയർത്തുന്നു.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=King+Fahd+Sports+City+Stadium+Riyadh"
    },
    {
      id: "stadium-3",
      nameMl: "സൗത്ത് റിയാദ് സ്റ്റേഡിയം",
      nameEn: "South Riyadh Stadium",
      city: "Riyadh",
      cityMl: "റിയാദ്",
      capacity: "~47,060",
      status: "new",
      statusText: "പുതിയ നിർമ്മാണം",
      badgeColor: "emerald",
      highlight: "⚡ വാദി നംറിലെ സൗദി ഗ്രീൻ ഇനിഷ്യേറ്റീവ് പരിസ്ഥിതി സൗഹൃദ വേദി",
      desc: "നജ്ദി വാസ്തുവിദ്യയും സുസ്ഥിര നിർമ്മാണ രീതികളും ഉൾക്കൊണ്ട് തെക്കൻ റിയാദിൽ ഉയരുന്ന പുത്തൻ ഫുട്ബോൾ മൈതാനം.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=South+Riyadh+Stadium"
    },
    {
      id: "stadium-4",
      nameMl: "പ്രിൻസ് മുഹമ്മദ് ബിൻ സൽമാൻ സ്റ്റേഡിയം (ഖിദ്ദിയ)",
      nameEn: "Prince Mohammed bin Salman Stadium",
      city: "Riyadh",
      cityMl: "റിയാദ് (ഖിദ്ദിയ)",
      capacity: "~46,979",
      status: "new",
      statusText: "പുതിയ നിർമ്മാണം",
      badgeColor: "emerald",
      highlight: "⛰️ ടുവൈഖ് മലമുകളിലെ ക്ലിഫ്സൈഡ് വിസ്മയം (200m Clifftop)",
      desc: "ലോകത്തിലെ ഏറ്റവും മനോഹരമായ കാഴ്ചയുള്ള സ്റ്റേഡിയം. എൽഇഡി ഭിത്തികളും മലഞ്ചെരിവിലെ അത്ഭുതക്കാഴ്ചകളുമുള്ള സവിശേഷ വേദി.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Prince+Mohammed+bin+Salman+Stadium+Qiddiya"
    },
    {
      id: "stadium-5",
      nameMl: "പ്രിൻസ് ഫൈസൽ ബിൻ ഫഹദ് സ്പോർട്സ് സിറ്റി",
      nameEn: "Prince Faisal bin Fahd Sports City Stadium",
      city: "Riyadh",
      cityMl: "റിയാദ് (അൽ-മലാസ്)",
      capacity: "~46,865",
      status: "new",
      statusText: "പുതിയ നിർമ്മാണം",
      badgeColor: "emerald",
      highlight: "📍 റിയാദ് നഗരഹൃദയത്തിലെ അൽ-മലാസിലെ പുനർനിർമ്മിതി",
      desc: "ചരിത്രപ്രസിദ്ധമായ അൽ-മലാസ് സ്റ്റേഡിയം പൂർണ്ണമായും പൊളിച്ചുമാറ്റി ലോകകപ്പ് നിലവാരത്തിൽ അത്യാധുനികമായി പുനർനിർമ്മിക്കുന്നു.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Prince+Faisal+bin+Fahd+Sports+City+Stadium+Riyadh"
    },
    {
      id: "stadium-6",
      nameMl: "കിംഗ് സൗദ് യൂണിവേഴ്സിറ്റി സ്റ്റേഡിയം (അൽ-അവ്വൽ പാർക്ക്)",
      nameEn: "King Saud University Stadium (Al-Awwal Park)",
      city: "Riyadh",
      cityMl: "റിയാദ്",
      capacity: "~46,319",
      status: "renovated",
      statusText: "നവീകരിച്ചത്",
      badgeColor: "gold",
      highlight: "⚽ അൽ-നസ്ർ എഫ്‌സിയുടെയും ക്രിസ്റ്റ്യാനോ റൊണാൾഡോയുടെയും ഹോം ഗ്രൗണ്ട്",
      desc: "നിലവിൽ റിയാദിലെ ഏറ്റവും ആവേശകരമായ ഫുട്ബോൾ സ്റ്റേഡിയം. ലോകകപ്പിനായി ശേഷി വർദ്ധിപ്പിച്ച് നവീകരിക്കുന്നു.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Al-Awwal+Park+King+Saud+University+Stadium+Riyadh"
    },
    {
      id: "stadium-7",
      nameMl: "ന്യൂ മുറബ്ബ സ്റ്റേഡിയം",
      nameEn: "New Murabba Stadium",
      city: "Riyadh",
      cityMl: "റിയാദ്",
      capacity: "~46,010",
      status: "new",
      statusText: "പുതിയ നിർമ്മാണം",
      badgeColor: "emerald",
      highlight: "🌴 അക്കേഷ്യ മരങ്ങളുടെ ആകൃതിയിലുള്ള പുറംചട്ട",
      desc: "ന്യൂ മുറബ്ബ മെഗാ ഡൗൺടൗണിൽ ദി മുഖാബിന് സമീപം പ്രകൃതിദത്ത സൗദി അക്കേഷ്യ മരങ്ങളുടെ ആകൃതിയിൽ നിർമ്മിക്കുന്ന സ്റ്റേഡിയം.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=New+Murabba+Stadium+Riyadh"
    },
    {
      id: "stadium-8",
      nameMl: "റോഷൻ സ്റ്റേഡിയം (ROSHN Stadium)",
      nameEn: "ROSHN Stadium",
      city: "Riyadh",
      cityMl: "റിയാദ്",
      capacity: "~46,000",
      status: "new",
      statusText: "പുതിയ നിർമ്മാണം",
      badgeColor: "emerald",
      highlight: "✨ കമ്മ്യൂണിറ്റി പാർക്കുകളോട് ചേർന്നുള്ള ക്രിസ്റ്റൽ ഡിസൈൻ",
      desc: "റോഷൻ കമ്മ്യൂണിറ്റിയുടെ ഭാഗമായി സൗത്ത്-വെസ്റ്റ് റിയാദിൽ കാൽനട സൗഹൃദ പ്ലാസകളോടെ നിർമ്മിക്കുന്ന സ്റ്റേഡിയം.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=ROSHN+Stadium+Riyadh"
    },

    // Jeddah (4 Stadiums)
    {
      id: "stadium-9",
      nameMl: "കിംഗ് അബ്ദുള്ള സ്പോർട്സ് സിറ്റി (അൽ-ജൗഹറ)",
      nameEn: "King Abdullah Sports City Stadium (Al-Jawhara)",
      city: "Jeddah",
      cityMl: "ജിദ്ദ",
      capacity: "~58,432",
      status: "renovated",
      statusText: "നവീകരിച്ചത്",
      badgeColor: "gold",
      highlight: "💎 'ചെങ്കടലിലെ രത്നം' — ജിദ്ദയിലെ ഏറ്റവും പ്രശസ്തമായ വേദി",
      desc: "ഇത്തിഹാദ്, അൽ-അഹ്‌ലി ക്ലബ്ബുകളുടെ ഹോം ഗ്രൗണ്ട്. ലോകകപ്പ് സെമി-ഫൈനൽ നിലവാരത്തിലേക്ക് വിഐപി സൗകര്യങ്ങൾ വർദ്ധിപ്പിക്കുന്നു.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=King+Abdullah+Sports+City+Jeddah"
    },
    {
      id: "stadium-10",
      nameMl: "ഖിദ്ദിയ കോസ്റ്റ് സ്റ്റേഡിയം",
      nameEn: "Qiddiya Coast Stadium",
      city: "Jeddah",
      cityMl: "ജിദ്ദ",
      capacity: "~46,096",
      status: "new",
      statusText: "പുതിയ നിർമ്മാണം",
      badgeColor: "emerald",
      highlight: "🌊 ചെങ്കടൽ തീരത്തെ പ്രകൃതിദത്ത വേലിയേറ്റ തരംഗങ്ങളുടെ ഡിസൈൻ",
      desc: "വടക്കൻ ജിദ്ദയിൽ ചെങ്കടലിനോട് ചേർന്ന് സ്പോർട്സ് ടൂറിസം ഹബ്ബിന്റെ ഭാഗമായി ഉയരുന്ന പുത്തൻ തീരദേശ സ്റ്റേഡിയം.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Qiddiya+Coast+Stadium+Jeddah"
    },
    {
      id: "stadium-11",
      nameMl: "ജിദ്ദ സെൻട്രൽ ഡെവലപ്‌മെന്റ് സ്റ്റേഡിയം",
      nameEn: "Jeddah Central Development Stadium",
      city: "Jeddah",
      cityMl: "ജിദ്ദ (അൽ-അൻദലുസ്)",
      capacity: "~45,794",
      status: "new",
      statusText: "പുതിയ നിർമ്മാണം",
      badgeColor: "emerald",
      highlight: "🏛️ ചരിത്രപ്രസിദ്ധമായ അൽ-ബലദ് വാസ്തുവിദ്യയുമായി ഇണങ്ങിനിൽക്കുന്ന നിർമ്മിതി",
      desc: "ജിദ്ദ സെൻട്രൽ മെഗാ പ്രോജക്റ്റിന്റെ ഭാഗമായി രൂപകൽപ്പന ചെയ്ത ആഡംബര സ്പോർട്സ് ഡിസ്ട്രിക്റ്റ് വേദി.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Jeddah+Central+Stadium"
    },
    {
      id: "stadium-12",
      nameMl: "കിംഗ് അബ്ദുള്ള ഇക്കണോമിക് സിറ്റി (KAEC) സ്റ്റേഡിയം",
      nameEn: "King Abdullah Economic City Stadium",
      city: "Jeddah",
      cityMl: "ജിദ്ദ / KAEC റാബിഗ്",
      capacity: "~45,700",
      status: "new",
      statusText: "പുതിയ നിർമ്മാണം",
      badgeColor: "emerald",
      highlight: "🚅 ഹറമൈൻ ഹൈ-സ്പീഡ് ട്രെയിൻ സ്റ്റേഷനുമായി നേരിട്ട് ബന്ധിപ്പിച്ചത്",
      desc: "ചെങ്കടൽ പവിഴപ്പുറ്റുകളുടെ സ്വാഭാവിക ഘടനയിൽ നിന്ന് പ്രചോദനം ഉൾക്കൊണ്ട് നിർമ്മിക്കുന്ന തീരദേശ മെഗാ സ്റ്റേഡിയം.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=King+Abdullah+Economic+City+Stadium"
    },

    // Al Khobar (1 Stadium)
    {
      id: "stadium-13",
      nameMl: "അരാംകോ സ്റ്റേഡിയം (Aramco Stadium)",
      nameEn: "Aramco Stadium",
      city: "Al Khobar",
      cityMl: "അൽ ഖോബാർ (കിഴക്കൻ പ്രവിശ്യ)",
      capacity: "~46,096",
      status: "new",
      statusText: "പുതിയ നിർമ്മാണം",
      badgeColor: "emerald",
      highlight: "🌊 അറേബ്യൻ ഗൾഫ് കടൽത്തിരമാലകളുടെ വിസ്മയിപ്പിക്കുന്ന ആകൃതി",
      desc: "അൽ-ഖോബാറിലെ തീരദേശത്ത് സൗദി അരാംകോയുടെ പങ്കാളിത്തത്തോടെ കിഴക്കൻ പ്രവിശ്യക്കായി നിർമ്മിക്കുന്ന ലോകോത്തര വേദി.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Aramco+Stadium+Al+Khobar"
    },

    // Abha (1 Stadium)
    {
      id: "stadium-14",
      nameMl: "കിംഗ് ഖാലിദ് യൂണിവേഴ്സിറ്റി സ്റ്റേഡിയം",
      nameEn: "King Khalid University Stadium",
      city: "Abha",
      cityMl: "അബഹ (അസീർ പർവ്വതനിരകൾ)",
      capacity: "~45,428",
      status: "renovated",
      statusText: "നവീകരിച്ചത്",
      badgeColor: "gold",
      highlight: "🏔️ സമുദ്രനിരപ്പിൽ നിന്ന് 2,200 മീറ്റർ ഉയരത്തിലുള്ള കുളിർമയുള്ള സ്റ്റേഡിയം",
      desc: "സൗദിയിലെ പ്രകൃതിരമണീയമായ അബഹയിലെ തണുപ്പുള്ള കാലാവസ്ഥയിൽ സ്ഥിതിചെയ്യുന്ന പർവ്വത സ്റ്റേഡിയം. ലോകകപ്പിനായി ശേഷി 45,000-ലേക്ക് ഉയർത്തുന്നു.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=King+Khalid+University+Stadium+Abha"
    },

    // NEOM (1 Stadium)
    {
      id: "stadium-15",
      nameMl: "നിയോം സ്റ്റേഡിയം (NEOM Stadium)",
      nameEn: "NEOM Stadium (The Line)",
      city: "NEOM",
      cityMl: "നിയോം (തബൂക്ക്)",
      capacity: "~46,010",
      status: "new",
      statusText: "പുതിയ നിർമ്മാണം",
      badgeColor: "emerald",
      highlight: "☁️ ദി ലൈനിനുള്ളിൽ ഭൂനിരപ്പിൽ നിന്ന് 350 മീറ്റർ ഉയരത്തിൽ ആകാശ സ്റ്റേഡിയം",
      desc: "ലോക ചരിത്രത്തിൽ ആദ്യമായി ഒരു ആകാശഗോപുര നഗരത്തിനുള്ളിൽ ഉയരത്തിൽ നിർമ്മിക്കുന്ന ഫുട്ബോൾ വിസ്മയം. പൂർണ്ണമായും വിൻഡ് & സോളാർ പവറിൽ പ്രവർത്തിക്കും.",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=NEOM+The+Line+Saudi+Arabia"
    }
  ];

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initVisionFIFA() {
    const section = document.getElementById("worldcup-2034") || document.getElementById("saudi-vision-fifa-section");
    if (!section) return;

    let activeTab = "vision"; // "vision" or "fifa"
    let activeCity = "all";   // "all", "Riyadh", "Jeddah", "Al Khobar", "Abha", "NEOM"

    const btnTabVision = section.querySelector("#tab-btn-vision");
    const btnTabFIFA = section.querySelector("#tab-btn-fifa");
    const paneVision = section.querySelector("#pane-vision-2030");
    const paneFIFA = section.querySelector("#pane-fifa-2034");

    const projectsContainer = section.querySelector("#vision-projects-grid");
    const stadiumsContainer = section.querySelector("#fifa-stadiums-grid");
    const cityFilterContainer = section.querySelector("#stadium-city-filters");

    // 1. Render Vision 2030 Projects
    function renderVisionProjects() {
      if (!projectsContainer) return;

      projectsContainer.innerHTML = VISION_2030_DATA.projects.map(proj => `
        <div class="mega-project-card" id="${proj.id}">
          <div class="mega-project-header">
            <div class="mega-project-icon">${proj.icon}</div>
            <div class="mega-project-titles">
              <span class="mega-project-tag">${proj.tag}</span>
              <h3>${proj.nameMl}</h3>
              <span class="mega-project-sub">${proj.nameEn}</span>
            </div>
            <div class="mega-project-badges">
              <span class="mega-badge-location">📍 ${proj.location}</span>
              <span class="mega-badge-invest">💰 ${proj.investment}</span>
            </div>
          </div>

          <p class="mega-project-desc">${proj.desc}</p>

          <div class="mega-subprojects-title">പ്രധാന സവിശേഷതകളും ഭാഗങ്ങളും:</div>
          <div class="mega-subprojects-grid">
            ${proj.subProjects.map(sub => `
              <div class="mega-subproject-item">
                <strong>✨ ${escapeHtml(sub.name)}</strong>
                <p>${escapeHtml(sub.desc)}</p>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("");
    }

    // 2. Render FIFA 2034 Stadiums (All 15 Stadiums across 5 Cities)
    function renderStadiums() {
      if (!stadiumsContainer) return;

      const filtered = activeCity === "all"
        ? FIFA_STADIUMS_DATA
        : FIFA_STADIUMS_DATA.filter(s => s.city === activeCity);

      if (filtered.length === 0) {
        stadiumsContainer.innerHTML = `<div class="empty-state"><p>ഈ നഗരത്തിൽ സ്റ്റേഡിയങ്ങൾ കണ്ടെത്തിയില്ല.</p></div>`;
        return;
      }

      stadiumsContainer.innerHTML = filtered.map(stadium => {
        const isNew = stadium.status === "new";
        const statusBadgeClass = isNew ? "status-badge-new" : "status-badge-renovated";

        return `
          <div class="stadium-card" id="${stadium.id}">
            <div class="stadium-card-head">
              <div class="stadium-city-pill">📍 ${stadium.cityMl}</div>
              <span class="${statusBadgeClass}">
                ${isNew ? "✨ പുതിയത് (New)" : "🔄 നവീകരിച്ചത് (Renovated)"}
              </span>
            </div>

            <h3 class="stadium-name-ml">${escapeHtml(stadium.nameMl)}</h3>
            <div class="stadium-name-en">${escapeHtml(stadium.nameEn)}</div>

            <div class="stadium-capacity-row">
              <span class="capacity-icon">🏟️</span>
              <span class="capacity-label">ശേഷി (Capacity):</span>
              <strong class="capacity-value">${stadium.capacity} സീറ്റുകൾ</strong>
            </div>

            <div class="stadium-highlight-box">
              ${escapeHtml(stadium.highlight)}
            </div>

            <p class="stadium-desc">${escapeHtml(stadium.desc)}</p>

            <a href="${stadium.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-stadium-maps" title="Google Maps-ൽ സ്റ്റേഡിയം ലൊക്കേഷൻ കാണുക">
              <span>📍 Google Maps-ൽ കാണുക ➔</span>
            </a>
          </div>
        `;
      }).join("");
    }

    // 3. Tab Switching
    function setTab(tab) {
      activeTab = tab;
      if (btnTabVision && btnTabFIFA) {
        btnTabVision.classList.toggle("active", tab === "vision");
        btnTabFIFA.classList.toggle("active", tab === "fifa");
        btnTabVision.setAttribute("aria-selected", tab === "vision");
        btnTabFIFA.setAttribute("aria-selected", tab === "fifa");
      }

      if (paneVision && paneFIFA) {
        paneVision.style.display = tab === "vision" ? "block" : "none";
        paneFIFA.style.display = tab === "fifa" ? "block" : "none";
      }
    }

    window.switchVisionFifaTab = setTab;

    if (btnTabVision) btnTabVision.addEventListener("click", () => setTab("vision"));
    if (btnTabFIFA) btnTabFIFA.addEventListener("click", () => setTab("fifa"));

    // 4. City Filter Buttons for Stadiums
    if (cityFilterContainer) {
      cityFilterContainer.querySelectorAll(".stadium-filter-pill").forEach(btn => {
        btn.addEventListener("click", () => {
          cityFilterContainer.querySelectorAll(".stadium-filter-pill").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          activeCity = btn.getAttribute("data-city") || "all";
          renderStadiums();
        });
      });
    }

    // 5. Hash navigation and jump pills
    function handleHash() {
      const hash = (window.location.hash || "").toLowerCase();
      if (hash.includes("worldcup") || hash.includes("fifa") || hash.includes("stadium")) {
        setTab("fifa");
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      } else if (hash.includes("vision")) {
        setTab("vision");
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      }
    }

    window.addEventListener("hashchange", handleHash);

    // Attach click listeners to all jump pills
    document.querySelectorAll('a[href*="worldcup-2034"], a[href*="fifa"]').forEach(link => {
      link.addEventListener("click", () => {
        setTab("fifa");
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      });
    });

    document.querySelectorAll('a[href*="vision"]').forEach(link => {
      link.addEventListener("click", () => {
        setTab("vision");
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      });
    });

    // Initial Render
    renderVisionProjects();
    renderStadiums();

    const initialHash = (window.location.hash || "").toLowerCase();
    if (initialHash.includes("worldcup") || initialHash.includes("fifa") || initialHash.includes("stadium")) {
      setTab("fifa");
      setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      setTab("vision");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVisionFIFA);
  } else {
    initVisionFIFA();
  }
})();
