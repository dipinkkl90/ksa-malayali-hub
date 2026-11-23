/**
 * KSA Malayali Hub — Digambaran (ദിഗംബരൻ) Pravasi AI Assistant & Kusruthi Chodhyangal
 * 100% Offline, Instant, Lightweight, and Zero-API Chatbot
 * Interactive 50+ Malayalam & Pravasi Riddle Game Engine with Options, Praise & Roasting
 * Developed by D&J Techies
 */

(function () {
  "use strict";

  // Built-in 52 Clean, Classic & Pravasi Malayalam Riddles (കുസൃതിച്ചോദ്യങ്ങൾ)
  const digambaranRiddles = [
      {
          "id": 1,
          "question": "കഴുത്തുണ്ട് പക്ഷേ തലയില്ല, കൈകളുണ്ട് പക്ഷേ വിരലുകളില്ല... ഞാനാര്?",
          "options": [
              "ഷർട്ട്! 👕",
              "തൊപ്പി 🧢",
              "കസേര 🪑"
          ],
          "correctIndex": 0,
          "answer": "ഷർട്ട്! 👕",
          "keywords": [
              "ഷർട്ട്",
              "shirt",
              "shert",
              "കുപ്പായം"
          ],
          "funnyReaction": "ഹഹഹ! വസ്ത്രധാരണത്തിൽ ശ്രദ്ധിക്കണം മച്ചാനെ! 😄"
      },
      {
          "id": 2,
          "question": "വരുമ്പോൾ കറുപ്പും, ഉപയോഗിക്കുമ്പോൾ ചുവപ്പും, തീരുമ്പോൾ വെളുപ്പും ആകുന്നതെന്ത്?",
          "options": [
              "പുകയില 🍂",
              "കരി (Charcoal)! 🔥",
              "ചായപ്പൊടി ☕"
          ],
          "correctIndex": 1,
          "answer": "കരി (Charcoal)! 🔥",
          "keywords": [
              "കരി",
              "charcoal",
              "kari",
              "അടുപ്പ്"
          ],
          "funnyReaction": "തീപ്പൊരി ഉത്തരം! കരി തന്നെയാണ് ശരി! 🔥"
      },
      {
          "id": 3,
          "question": "എത്ര കഴിച്ചാലും വിശപ്പ് മാറാത്ത, എന്നാൽ വെള്ളം കുടിച്ചാൽ ഉടൻ ചത്തുപോകുന്ന ആളാര്?",
          "options": [
              "മീൻ 🐟",
              "പാമ്പ് 🐍",
              "തീ! 🔥"
          ],
          "correctIndex": 2,
          "answer": "തീ! 🔥",
          "keywords": [
              "തീ",
              "thee",
              "fire",
              "അഗ്നി"
          ],
          "funnyReaction": "കണ്ണിൽ ചോരയില്ലാത്ത തീ! എങ്ങനെയുണ്ട് ദിഗംബരന്റെ ബുദ്ധി? 😈"
      },
      {
          "id": 4,
          "question": "രാവിലെ നാട്ടിലെ സമയം നോക്കാനും, വൈകിട്ട് സൗദിയിലെ ശമ്പളം കൂട്ടാനും പ്രവാസികൾ ഏറ്റവും കൂടുതൽ തൊടുന്ന സാധനം?",
          "options": [
              "മൊബൈൽ ഫോൺ! 📱",
              "വാച്ച് ⌚",
              "ക്ലോക്ക് ⏰"
          ],
          "correctIndex": 0,
          "answer": "മൊബൈൽ ഫോൺ! 📱",
          "keywords": [
              "മൊബൈൽ",
              "ഫോൺ",
              "mobile",
              "phone",
              "cellphone"
          ],
          "funnyReaction": "സത്യം പറഞ്ഞാൽ ചങ്ക് പറിച്ച് തരും പ്രവാസികൾ! ഫോൺ തന്നെ! 📱"
      },
      {
          "id": 5,
          "question": "പല്ല് ഒരുപാടുണ്ട്, പക്ഷേ ഒന്നും കടിക്കാൻ പറ്റില്ല... എന്താണത്?",
          "options": [
              "ഈർച്ചവാൾ 🪚",
              "ചീപ്പ് (Comb)! 🪮",
              "സിപ്പ് 🤐"
          ],
          "correctIndex": 1,
          "answer": "ചീപ്പ് (Comb)! 🪮",
          "keywords": [
              "ചീപ്പ്",
              "comb",
              "cheep",
              "thala"
          ],
          "funnyReaction": "തലമുടി ചീകുമ്പോൾ ഓർക്കണം എന്നെ! 😄"
      },
      {
          "id": 6,
          "question": "തൊട്ടാൽ പൊട്ടും, പക്ഷേ കയ്യിലെടുക്കാൻ പറ്റില്ല... എന്താണത്?",
          "options": [
              "കണ്ണാടി 🪞",
              "ബലൂൺ 🎈",
              "നിശബ്ദത (Silence)! 🤫"
          ],
          "correctIndex": 2,
          "answer": "നിശബ്ദത (Silence)! 🤫",
          "keywords": [
              "നിശബ്ദത",
              "silence",
              "nishabdatha",
              "mindathiri"
          ],
          "funnyReaction": "പിൻ ഡ്രോപ്പ് സൈലൻസ്! പിടികിട്ടിയോ? 🤫"
      },
      {
          "id": 7,
          "question": "എപ്പോഴും താഴോട്ട് മാത്രം വരും, ഒരിക്കലും മുകളിലേക്ക് പോവില്ല... എന്താണത്?",
          "options": [
              "മഴ! 🌧️",
              "പുക 💨",
              "വിമാനം ✈️"
          ],
          "correctIndex": 0,
          "answer": "മഴ! 🌧️",
          "keywords": [
              "മഴ",
              "rain",
              "mazha",
              "vellam"
          ],
          "funnyReaction": "പെയ്തൊഴിയാത്ത മഴപോലെ നിന്റെ ബുദ്ധി തിളങ്ങുന്നു! 🌧️"
      },
      {
          "id": 8,
          "question": "കണ്ണുണ്ട് പക്ഷേ കാണാൻ പറ്റില്ല... ഞാനാര്?",
          "options": [
              "ഉരുളക്കിഴങ്ങ് 🥔",
              "തേങ്ങ / സൂചി! 🥥",
              "കണ്ണട 👓"
          ],
          "correctIndex": 1,
          "answer": "തേങ്ങ / സൂചി! 🥥",
          "keywords": [
              "തേങ്ങ",
              "സൂചി",
              "coconut",
              "needle",
              "thenga"
          ],
          "funnyReaction": "തേങ്ങയ്ക്ക് മൂന്ന് കണ്ണുണ്ട്, പക്ഷെ കാഴ്ച്ചയില്ല! കറക്റ്റ്! 🥥"
      },
      {
          "id": 9,
          "question": "കാലുണ്ട് പക്ഷേ നടക്കാൻ പറ്റില്ല... എന്താണത്?",
          "options": [
              "പശു 🐄",
              "മരപ്പട്ടി 🦡",
              "മേശ / കസേര! 🪑"
          ],
          "correctIndex": 2,
          "answer": "മേശ / കസേര! 🪑",
          "keywords": [
              "മേശ",
              "കസേര",
              "table",
              "chair",
              "mesha"
          ],
          "funnyReaction": "നാല് കാലുള്ള മേശയും കസേരയും! നീ ഒരു ജീനിയസ് തന്നെ! 🪑"
      },
      {
          "id": 10,
          "question": "വളരുന്തോറും താഴോട്ട് പോകുന്ന സാധനം ഏതാണ്?",
          "options": [
              "കിണർ / വേര് / താടി! 🧔",
              "മരം 🌳",
              "മുടി 💇‍♂️"
          ],
          "correctIndex": 0,
          "answer": "കിണർ / വേര് / താടി! 🧔",
          "keywords": [
              "വേര്",
              "കിണർ",
              "താടി",
              "beard",
              "well",
              "root"
          ],
          "funnyReaction": "താഴോട്ട് വളരുന്ന താടിയും വേരുകളും! കലക്കി മച്ചാനെ! 🧔"
      },
      {
          "id": 11,
          "question": "മുറിക്കും തോറും നീളം കൂടുന്ന സാധനം ഏതാണ്?",
          "options": [
              "കയർ 🪢",
              "കുഴി (Hole)! 🕳️",
              "സാരി 🥻"
          ],
          "correctIndex": 1,
          "answer": "കുഴി (Hole)! 🕳️",
          "keywords": [
              "കുഴി",
              "kuzhi",
              "hole",
              "ditch"
          ],
          "funnyReaction": "വെട്ടി വെട്ടി വലുതാകുന്ന കുഴി! തകർത്തു! 🕳️"
      },
      {
          "id": 12,
          "question": "വെള്ളത്തിൽ വീണാലും നനയാത്ത സാധനം എന്താണ്?",
          "options": [
              "മീൻ 🐟",
              "എണ്ണ 🛢️",
              "നിഴൽ (Shadow)! 👤"
          ],
          "correctIndex": 2,
          "answer": "നിഴൽ (Shadow)! 👤",
          "keywords": [
              "നിഴൽ",
              "shadow",
              "nizhal"
          ],
          "funnyReaction": "വെള്ളത്തിൽ വീണാലും നനയാത്ത നിഴൽ! അടിപൊളി! 👤"
      },
      {
          "id": 13,
          "question": "എല്ലാവരും ഇരിക്കുമ്പോൾ നിൽക്കുകയും, എല്ലാവരും നിൽക്കുമ്പോൾ ഇരിക്കുകയും ചെയ്യുന്നയാൾ?",
          "options": [
              "ഡ്രൈവർ / കണ്ടക്ടർ! 🚌",
              "പോലീസുകാരൻ 👮",
              "ഡോക്ടർ 👨‍⚕️"
          ],
          "correctIndex": 0,
          "answer": "ഡ്രൈവർ / കണ്ടക്ടർ! 🚌",
          "keywords": [
              "ഡ്രൈവർ",
              "കണ്ടക്ടർ",
              "driver",
              "conductor"
          ],
          "funnyReaction": "സൗദിയിലെയും നാട്ടിലെയും ബസ് ഓർമ്മ വന്നു അല്ലേ? 🚌😂"
      },
      {
          "id": 14,
          "question": "ഉടമസ്ഥൻ അറിയാതെ ആരും കാണാതെ അകത്തു കടക്കുന്ന കള്ളൻ ആര്?",
          "options": [
              "കൊതുക് 🦟",
              "ഉറക്കം (Sleep)! 😴",
              "കാറ്റ് 💨"
          ],
          "correctIndex": 1,
          "answer": "ഉറക്കം (Sleep)! 😴",
          "keywords": [
              "ഉറക്കം",
              "sleep",
              "urakkam"
          ],
          "funnyReaction": "ഡ്യൂട്ടി കഴിഞ്ഞ് റൂമിൽ എത്തുമ്പോൾ വരുന്ന ഉറക്കം തന്നെ! 😴"
      },
      {
          "id": 15,
          "question": "തലയിൽ തൊപ്പിയുണ്ട്, പക്ഷേ നടക്കാൻ കാലില്ല... ആരാണ്?",
          "options": [
              "തവള 🐸",
              "വിളക്ക് 🏮",
              "കൂൺ / കുപ്പിയടപ്പ്! 🍄"
          ],
          "correctIndex": 2,
          "answer": "കൂൺ / കുപ്പിയടപ്പ്! 🍄",
          "keywords": [
              "കൂൺ",
              "mushroom",
              "koon",
              "കുപ്പിയടപ്പ്"
          ],
          "funnyReaction": "തൊപ്പിവെച്ച കൂൺ! പ്രകൃതിയുടെ കുസൃതി! 🍄"
      },
      {
          "id": 16,
          "question": "സൗദിയിലെ ബാച്ചിലർ റൂമുകളിൽ വ്യാഴാഴ്ച രാത്രി ഏറ്റവും കൂടുതൽ ഉണ്ടാക്കുന്ന സ്പെഷ്യൽ?",
          "options": [
              "ദം ബിരിയാണി! 🍗",
              "കഞ്ഞി 🥣",
              "ഉപ്പുമാവ് 🍛"
          ],
          "correctIndex": 0,
          "answer": "ദം ബിരിയാണി! 🍗",
          "keywords": [
              "ബിരിയാണി",
              "biriyani",
              "dum biriyani",
              "ചിക്കൻ"
          ],
          "funnyReaction": "വ്യാഴാഴ്ച രാത്രി ബിരിയാണിയുടെ മണം പരക്കാത്ത റൂമുകളുണ്ടോ ഗൾഫിൽ! 🍗😋"
      },
      {
          "id": 17,
          "question": "വായയുണ്ട് പക്ഷേ സംസാരിക്കില്ല, കിടക്കയുണ്ട് പക്ഷേ ഉറങ്ങില്ല... എന്താണത്?",
          "options": [
              "പൂച്ച 🐱",
              "പുഴ (River)! 🌊",
              "കിണർ 🕳️"
          ],
          "correctIndex": 1,
          "answer": "പുഴ (River)! 🌊",
          "keywords": [
              "പുഴ",
              "river",
              "puzha",
              "ആറ്"
          ],
          "funnyReaction": "റിവർ ബെഡും റിവർ മൗത്തും! ഇംഗ്ലീഷിലും മലയാളത്തിലും ഒരുപോലെ! 🌊"
      },
      {
          "id": 18,
          "question": "വിളിച്ചാൽ വരില്ല, എന്നാൽ പേര് പറഞ്ഞാൽ ഉടൻ അപ്രത്യക്ഷമാകും... ആരാണത്?",
          "options": [
              "കാറ്റ് 💨",
              "സ്വപ്നം 💭",
              "നിശബ്ദത (Silence)! 🤐"
          ],
          "correctIndex": 2,
          "answer": "നിശബ്ദത (Silence)! 🤐",
          "keywords": [
              "നിശബ്ദത",
              "silence",
              "mindathiri"
          ],
          "funnyReaction": "'മിണ്ടരുത്' എന്ന് പറഞ്ഞാൽ തന്നെ പോകുന്ന നിശബ്ദത! 🤐"
      },
      {
          "id": 19,
          "question": "സൗദിയിൽ വന്ന മലയാളി ഏറ്റവും കൂടുതൽ അന്വേഷിക്കുന്ന 'പച്ച' സാധനം?",
          "options": [
              "വാഴയില! 🍃",
              "പച്ചമുളക് 🌶️",
              "കപ്പലണ്ടി 🥜"
          ],
          "correctIndex": 0,
          "answer": "വാഴയില! 🍃",
          "keywords": [
              "വാഴയില",
              "vazhayila",
              "banana leaf",
              "leaf"
          ],
          "funnyReaction": "സദ്യ കഴിക്കാൻ വാഴയില കിട്ടിയാൽ പ്രവാസി ഹാപ്പി! 🍃🍛"
      },
      {
          "id": 20,
          "question": "മുകളിലേക്ക് പോകും തോറും കൂടുന്ന, എന്നാൽ ഒരിക്കലും കുറയാത്ത സാധനം?",
          "options": [
              "ശമ്പളം 💵",
              "പ്രായം (Age)! 🎂",
              "വണ്ണം ⚖️"
          ],
          "correctIndex": 1,
          "answer": "പ്രായം (Age)! 🎂",
          "keywords": [
              "പ്രായം",
              "age",
              "vayas",
              "വയസ്സ്"
          ],
          "funnyReaction": "ശമ്പളം കൂടിയാലും ഇല്ലെങ്കിലും പ്രായം കൂടിക്കൊണ്ടേയിരിക്കും! സത്യം! 🎂😂"
      },
      {
          "id": 21,
          "question": "ഒരു കാലിൽ നിൽക്കുന്ന കൊച്ചുസുന്ദരി, തല തിരിച്ചാൽ വെള്ളം തരും... ആരാണ്?",
          "options": [
              "കുട ☂️",
              "ഫാൻ 🌀",
              "പൈപ്പ് / ടാപ്പ് (Tap)! 🚰"
          ],
          "correctIndex": 2,
          "answer": "പൈപ്പ് / ടാപ്പ് (Tap)! 🚰",
          "keywords": [
              "ടാപ്പ്",
              "പൈപ്പ്",
              "tap",
              "pipe",
              "water tap"
          ],
          "funnyReaction": "തിരിച്ചാൽ വെള്ളം തരുന്ന പൈപ്പ്! നല്ല നീരീക്ഷണം! 🚰"
      },
      {
          "id": 22,
          "question": "പകൽ മുഴുവൻ നമ്മളെ അനുഗമിക്കും, രാത്രി വെളിച്ചം അണച്ചാൽ ഒളിച്ചുകളിക്കും... ആരാണ്?",
          "options": [
              "നിഴൽ (Shadow)! 👤",
              "നായ്ക്കുട്ടി 🐕",
              "മൊബൈൽ 📱"
          ],
          "correctIndex": 0,
          "answer": "നിഴൽ (Shadow)! 👤",
          "keywords": [
              "നിഴൽ",
              "shadow",
              "nizhal"
          ],
          "funnyReaction": "വെളിച്ചം ഉള്ളിടത്തോളം നിഴൽ നമ്മളെ വിട്ടുപോകില്ല! 👤"
      },
      {
          "id": 23,
          "question": "അകത്തു പോകുമ്പോൾ പച്ച, പുറത്തു വരുമ്പോൾ ചുവപ്പ്... എന്താണത്?",
          "options": [
              "ഐസ്ക്രീം 🍦",
              "മുറുക്കാൻ! 🍃",
              "പാലട പ്രഥമൻ 🥣"
          ],
          "correctIndex": 1,
          "answer": "മുറുക്കാൻ! 🍃",
          "keywords": [
              "മുറുക്കാൻ",
              "betel",
              "murukkan",
              "വെറ്റില"
          ],
          "funnyReaction": "വെറ്റില മുറുക്കി ചുവപ്പിച്ച പഴയ തലമുറ ഓർമ്മ വന്നു! 🍃🔴"
      },
      {
          "id": 24,
          "question": "ആയിരം കണ്ണുള്ള വമ്പൻ, ഒരൊറ്റ മീൻ പോലും പിടിക്കാത്ത ആൾ ആരാണ്?",
          "options": [
              "വല 🕸️",
              "മയിൽ 🦚",
              "അരിപ്പ (Strainer)! 🥣"
          ],
          "correctIndex": 2,
          "answer": "അരിപ്പ (Strainer)! 🥣",
          "keywords": [
              "അരിപ്പ",
              "strainer",
              "sieve",
              "arippa"
          ],
          "funnyReaction": "ചായ അരിക്കുന്ന അരിപ്പ തന്നെ! കണ്ണുകൾ നിറയെ! 🥣"
      },
      {
          "id": 25,
          "question": "ജനിക്കുമ്പോൾ വാലുണ്ട്, വളരുമ്പോൾ വാലില്ല... ആരാണീ ജീവി?",
          "options": [
              "തവളക്കുഞ്ഞ് (വാൽമാക്രി)! 🐸",
              "പാമ്പ് 🐍",
              "പല്ലി 🦎"
          ],
          "correctIndex": 0,
          "answer": "തവളക്കുഞ്ഞ് (വാൽമാക്രി)! 🐸",
          "keywords": [
              "തവള",
              "frog",
              "valmakri",
              "വാൽമാക്രി"
          ],
          "funnyReaction": "വാൽമാക്രി തവളയായി മാറുന്ന രഹസ്യം! ജീവശാസ്ത്രം കറക്റ്റ്! 🐸"
      },
      {
          "id": 26,
          "question": "സൗദിയിലെ ബാച്ചിലേഴ്സ് മാസാദ്യം സന്തോഷത്തോടെ നോക്കുന്ന മൊബൈൽ സ്ക്രീനിലെ മെസ്സേജ്?",
          "options": [
              "യൂട്യൂബ് നോട്ടിഫിക്കേഷൻ 🎬",
              "ബാങ്ക് അക്കൗണ്ട് ബാലൻസ്! 💳",
              "ക്രിക്കറ്റ് സ്കോർ 🏏"
          ],
          "correctIndex": 1,
          "answer": "ബാങ്ക് അക്കൗണ്ട് ബാലൻസ്! 💳",
          "keywords": [
              "ശമ്പളം",
              "സാലറി",
              "salary",
              "bank",
              "ബാലൻസ്",
              "balance"
          ],
          "funnyReaction": "'Salary Credited' എന്ന മെസ്സേജോളം സന്തോഷം വേറെ എന്തിനാണ് പ്രവാസിക്ക്! 💳💸"
      },
      {
          "id": 27,
          "question": "കയ്യുണ്ട് കാലുണ്ട്, പക്ഷേ ജീവനില്ല; ആളുകൾ എന്റെ മടിയിൽ ഇരിക്കും... ഞാനാര്?",
          "options": [
              "പാവ 🧸",
              "ബൈക്ക് 🏍️",
              "കസേര (Armchair)! 🪑"
          ],
          "correctIndex": 2,
          "answer": "കസേര (Armchair)! 🪑",
          "keywords": [
              "കസേര",
              "chair",
              "armchair",
              "kasera"
          ],
          "funnyReaction": "മടിയിലിരുത്തി താങ്ങുന്ന കസേര! ആശ്വാസമായി! 🪑"
      },
      {
          "id": 28,
          "question": "തലയുണ്ട് പക്ഷേ ചിന്തിക്കില്ല, സൂചിയുടെ എളിയിൽ കൂടെ നൂഴ്ന്നു പോകും... ആരാണ്?",
          "options": [
              "നൂൽ (Thread)! 🧵",
              "മുടിനാരിഴ 💇",
              "ചരട് 🪢"
          ],
          "correctIndex": 0,
          "answer": "നൂൽ (Thread)! 🧵",
          "keywords": [
              "നൂൽ",
              "thread",
              "nool"
          ],
          "funnyReaction": "സൂചിക്കുഴയിലൂടെ കയറുന്ന നൂൽ! ഉത്തരം തുന്നിപ്പിടിപ്പിച്ചു! 🧵"
      },
      {
          "id": 29,
          "question": "നനയുന്തോറും മറ്റുള്ളവരെ ഉണക്കുന്ന അത്ഭുത സാധനം?",
          "options": [
              "സ്പോഞ്ച് 🧽",
              "ടവ്വൽ / തോർത്ത്! 🧖",
              "കുട ☂️"
          ],
          "correctIndex": 1,
          "answer": "ടവ്വൽ / തോർത്ത്! 🧖",
          "keywords": [
              "തോർത്ത്",
              "തൂവാല",
              "towel",
              "thorthu"
          ],
          "funnyReaction": "മലയാളിയുടെ സ്വന്തം തോർത്ത്! നനഞ്ഞ് നനഞ്ഞ് നമ്മളെ ഉണക്കും! 🧖"
      },
      {
          "id": 30,
          "question": "അടിച്ചാൽ കരയില്ല, എന്നാൽ കാൽ കൊണ്ട് തട്ടിയാൽ ആളുകൾ ആർത്തുവിളിക്കും... എന്താണത്?",
          "options": [
              "മേളത്തപ്പ 🥁",
              "വാതിൽ 🚪",
              "ഫുട്ബോൾ! ⚽"
          ],
          "correctIndex": 2,
          "answer": "ഫുട്ബോൾ! ⚽",
          "keywords": [
              "ഫുട്ബോൾ",
              "football",
              "ball",
              "പന്ത്"
          ],
          "funnyReaction": "മലപ്പുറത്തുകാരന്റെ ജീവശ്വാസം! ഫുട്ബോൾ തന്നെ! ⚽🔥"
      },
      {
          "id": 31,
          "question": "സൗദി റോഡുകളിൽ ഡ്രൈവർമാർ ഏറ്റവും കൂടുതൽ ശ്രദ്ധിക്കുന്ന ആ 'കണ്ണുള്ള' കാവൽക്കാരൻ ആര്?",
          "options": [
              "സാഹെർ (Saher) ക്യാമറ! 📸",
              "സ്ട്രീറ്റ് ലൈറ്റ് 💡",
              "പോലീസ് വണ്ടി 🚓"
          ],
          "correctIndex": 0,
          "answer": "സാഹെർ (Saher) ക്യാമറ! 📸",
          "keywords": [
              "സാഹെർ",
              "saher",
              "camera",
              "ഫ്ലാഷ്"
          ],
          "funnyReaction": "ഫ്ലാഷ് അടിച്ചാൽ ശമ്പളം പോയി! സാഹെറിനെ പേടിക്കാത്ത ഡ്രൈവറുണ്ടോ! 📸💸"
      },
      {
          "id": 32,
          "question": "ഭൂമിയിൽ ഇരിക്കുമ്പോൾ പച്ച, കടയിൽ ഇരിക്കുമ്പോൾ കറുപ്പ്, വീട്ടിൽ വരുമ്പോൾ ചുവപ്പ്... എന്താണത്?",
          "options": [
              "മുളക് 🌶️",
              "ചായപ്പൊടി (Tea Powder)! ☕",
              "മൈലാഞ്ചി 🌿"
          ],
          "correctIndex": 1,
          "answer": "ചായപ്പൊടി (Tea Powder)! ☕",
          "keywords": [
              "ചായപ്പൊടി",
              "tea",
              "chayappodi",
              "തേയില"
          ],
          "funnyReaction": "നല്ല കട്ടൻ ചായയുടെ ചരിത്രം തന്നെ പറഞ്ഞു തന്നു! ☕👌"
      },
      {
          "id": 33,
          "question": "പൂട്ടില്ല താക്കോലില്ല, എന്നാൽ ഒരു തവണ തുറന്നാൽ പിന്നെ അടയ്ക്കാൻ പറ്റാത്ത പെട്ടി ഏതാണ്?",
          "options": [
              "പേപ്പർ പെട്ടി 📦",
              "തീപ്പെട്ടി 🪵",
              "മുട്ട (Egg)! 🥚"
          ],
          "correctIndex": 2,
          "answer": "മുട്ട (Egg)! 🥚",
          "keywords": [
              "മുട്ട",
              "egg",
              "mutta"
          ],
          "funnyReaction": "പൊട്ടിച്ചാൽ പിന്നെ ഒട്ടിക്കാൻ പറ്റാത്ത മുട്ട! കൃത്യം! 🥚"
      },
      {
          "id": 34,
          "question": "ചുമരിലൂടെ നടക്കും, പക്ഷേ നിലത്തു വീണാൽ പാവാട പൊക്കി ഓടും... ആരാണ്?",
          "options": [
              "പല്ലി! 🦎",
              "പാറ്റ 🪳",
              "ചിലന്തി 🕷️"
          ],
          "correctIndex": 0,
          "answer": "പല്ലി! 🦎",
          "keywords": [
              "പല്ലി",
              "lizard",
              "palli"
          ],
          "funnyReaction": "ബാച്ചിലർ റൂമിലെ നിത്യസന്ദർശകൻ പല്ലി അളിയൻ! 🦎😂"
      },
      {
          "id": 35,
          "question": "സൗദിയിലെ പ്രവാസികൾ നാട്ടിലേക്ക് പോകുമ്പോൾ എയർപോർട്ടിൽ തൂക്കം നോക്കി നെഞ്ചിടിക്കുന്ന സാധനം?",
          "options": [
              "പാസ്‌പോർട്ട് 🛂",
              "ലഗേജ് പെട്ടി (Suitcase)! 🧳",
              "ബോർഡിംഗ് പാസ് 🎫"
          ],
          "correctIndex": 1,
          "answer": "ലഗേജ് പെട്ടി (Suitcase)! 🧳",
          "keywords": [
              "ലഗേജ്",
              "സ്യൂട്ട്കേസ്",
              "പെട്ടി",
              "luggage",
              "suitcase",
              "kilo"
          ],
          "funnyReaction": "ഒരു കിലോ കൂടിയാൽ എയർപോർട്ടിൽ റീ-പാക്കിംഗ് നടത്തുന്ന പ്രവാസി! 🧳✈️"
      },
      {
          "id": 36,
          "question": "തുറന്നാൽ വീടാണ്, മടക്കിയാൽ വടിയാണ്... എന്താണത്?",
          "options": [
              "കൂടാരം ⛺",
              "പായ 🪵",
              "കുട (Umbrella)! ☂️"
          ],
          "correctIndex": 2,
          "answer": "കുട (Umbrella)! ☂️",
          "keywords": [
              "കുട",
              "umbrella",
              "kuda"
          ],
          "funnyReaction": "മഴയത്തും വെയിലത്തും മലയാളിക്ക് കുട വേണം! ☂️"
      },
      {
          "id": 37,
          "question": "എല്ലാവരുടെയും കയ്യിലുണ്ട്, എന്നാൽ ആർക്കും തൊടാൻ പറ്റാത്ത ഒന്നാണ്... എന്താണത്?",
          "options": [
              "സമയം (Time)! ⏳",
              "കാറ്റ് 💨",
              "നിഴൽ 👤"
          ],
          "correctIndex": 0,
          "answer": "സമയം (Time)! ⏳",
          "keywords": [
              "സമയം",
              "time",
              "samayam"
          ],
          "funnyReaction": "സമയം പോയാൽ തിരിച്ചു വരില്ല! സൂപ്പർ ഉത്തരം! ⏳"
      },
      {
          "id": 38,
          "question": "ഒരമ്മ പെറ്റ മക്കൾക്കെല്ലാം ഒരേ തൊപ്പി... ആരാണ്?",
          "options": [
              "പല്ലുകൾ 🦷",
              "തീപ്പെട്ടിക്കൊള്ളികൾ! 🪵",
              "വിരലുകൾ 🖐️"
          ],
          "correctIndex": 1,
          "answer": "തീപ്പെട്ടിക്കൊള്ളികൾ! 🪵",
          "keywords": [
              "തീപ്പെട്ടി",
              "matchbox",
              "matchstick",
              "theepetti"
          ],
          "funnyReaction": "തീപ്പെട്ടിക്കൂട്ടിലെ മക്കൾ! ക്ലാസിക് മലയാളി കടങ്കഥ! 🪵"
      },
      {
          "id": 39,
          "question": "സൗദിയിലെ മലയാളി ബാച്ചിലർ റൂമിൽ ഡ്യൂട്ടി ചാർട്ട് വെച്ച് ഏറ്റവുമധികം തർക്കമുണ്ടാകുന്ന വിഷയം?",
          "options": [
              "ചായ ഉണ്ടാക്കാൻ ☕",
              "തുണി കഴുകാൻ 👕",
              "പാത്രം കഴുകാൻ! 🍽️"
          ],
          "correctIndex": 2,
          "answer": "പാത്രം കഴുകാൻ! 🍽️",
          "keywords": [
              "പാത്രം",
              "കഴുകാൻ",
              "vessel",
              "washing",
              "pathram"
          ],
          "funnyReaction": "'ഇന്നലെ ഞാൻ കഴുകിയതാ, ഇന്ന് നിന്റെ ടേൺ'! ബാച്ചിലർ റൂമിലെ നിത്യകലഹം! 🍽️😂"
      },
      {
          "id": 40,
          "question": "കൂടെയുണ്ടെങ്കിലും കാണില്ല, ഉള്ളിൽ പോയാൽ ജീവിക്കും, പോയില്ലെങ്കിൽ മരിക്കും... എന്താണത്?",
          "options": [
              "ശ്വാസം (Breath)! 🫁",
              "വെള്ളം 💧",
              "ഭക്ഷണം 🍲"
          ],
          "correctIndex": 0,
          "answer": "ശ്വാസം (Breath)! 🫁",
          "keywords": [
              "ശ്വാസം",
              "breath",
              "oxygen",
              "shwasam"
          ],
          "funnyReaction": "ശ്വാസമെടുക്കാൻ മറക്കരുത് മച്ചാനെ! ജീവന്റെ തുടിപ്പ്! 🫁"
      },
      {
          "id": 41,
          "question": "തൊണ്ടയുണ്ട് ശബ്ദമില്ല, കാലുണ്ട് ഓട്ടമില്ല, തലയുണ്ട് മുടിയില്ല... എന്താണത്?",
          "options": [
              "പാവ 🪆",
              "കുപ്പി (Bottle)! 🍾",
              "കസേര 🪑"
          ],
          "correctIndex": 1,
          "answer": "കുപ്പി (Bottle)! 🍾",
          "keywords": [
              "കുപ്പി",
              "bottle",
              "kuppi"
          ],
          "funnyReaction": "വെള്ളം നിറച്ചുവെക്കുന്ന കുപ്പി തന്നെ! 🍾"
      },
      {
          "id": 42,
          "question": "ഓടുന്തോറും നിൽക്കും, നിന്നാൽ താഴെ വീഴും... എന്താണത്?",
          "options": [
              "പന്ത് ⚽",
              "കാറ്റ് 💨",
              "പമ്പരം / സൈക്കിൾ! 🚲"
          ],
          "correctIndex": 2,
          "answer": "പമ്പരം / സൈക്കിൾ! 🚲",
          "keywords": [
              "പമ്പരം",
              "സൈക്കിൾ",
              "top",
              "bicycle",
              "cycle"
          ],
          "funnyReaction": "കറങ്ങുന്ന പമ്പരവും സൈക്കിളും! ബാല്യകാല ഓർമ്മകൾ! 🚲"
      },
      {
          "id": 43,
          "question": "പച്ചക്കുപ്പായമിട്ട സുന്ദരിക്ക് തലനിറയെ സ്വർണ്ണമണികൾ... ആരാണത്?",
          "options": [
              "ചോളം (Corn)! 🌽",
              "മാതളനാരങ്ങ 🍎",
              "പൈനാപ്പിൾ 🍍"
          ],
          "correctIndex": 0,
          "answer": "ചോളം (Corn)! 🌽",
          "keywords": [
              "ചോളം",
              "corn",
              "cholam"
          ],
          "funnyReaction": "തീയിൽ ചുട്ട ചോളം ഓർമ്മ വന്നു! നല്ല രുചി! 🌽😋"
      },
      {
          "id": 44,
          "question": "കടയിൽ നമ്മൾ കൊടുത്താൽ അവർ പണി തീർത്ത് തിരിച്ചു തരും, എന്നിട്ട് നമ്മൾ കാശും കൊടുക്കണം... എന്താണത്?",
          "options": [
              "മുടിവെട്ട് 💇‍♂️",
              "ഫോട്ടോ (Photo)! 📷",
              "തുണി തയ്ക്കൽ 🧵"
          ],
          "correctIndex": 1,
          "answer": "ഫോട്ടോ (Photo)! 📷",
          "keywords": [
              "ഫോട്ടോ",
              "photo",
              "studio",
              "പോസ്"
          ],
          "funnyReaction": "സ്റ്റുഡിയോയിൽ പോയി പോസ് കൊടുത്ത് കാശും കൊടുക്കുന്ന ഫോട്ടോ! 📷"
      },
      {
          "id": 45,
          "question": "സൗദിയിലെ സൂപ്പർമാർക്കറ്റുകളിൽ പ്രവാസികൾ മഞ്ഞ ബോർഡിൽ കണ്ടാൽ ഉടൻ വണ്ടി തിരിക്കുന്ന വാക്ക്?",
          "options": [
              "പാർക്കിംഗ് 🅿️",
              "പ്രവേശന കവാടം 🚪",
              "ഓഫർ / പ്രൊമോഷൻ! 🏷️"
          ],
          "correctIndex": 2,
          "answer": "ഓഫർ / പ്രൊമോഷൻ! 🏷️",
          "keywords": [
              "ഓഫർ",
              "പ്രൊമോഷൻ",
              "offer",
              "discount",
              "sale",
              "ലൂലു"
          ],
          "funnyReaction": "മഞ്ഞ ബോർഡിൽ 'OFFER' എന്ന് കണ്ടാൽ പിന്നെ ഒന്നും നോക്കില്ല പ്രവാസി! 🏷️🛒"
      },
      {
          "id": 46,
          "question": "രാത്രിയിൽ ആകാശത്ത് ജനിക്കും, പകൽ സൂര്യൻ വന്നാൽ പേടിച്ച് ഒളിക്കും... ആരാണ്?",
          "options": [
              "നക്ഷത്രങ്ങൾ! 🌟",
              "മേഘം ☁️",
              "വവ്വാൽ 🦇"
          ],
          "correctIndex": 0,
          "answer": "നക്ഷത്രങ്ങൾ! 🌟",
          "keywords": [
              "നക്ഷത്രം",
              "stars",
              "nakshathram"
          ],
          "funnyReaction": "ആകാശത്ത് മിന്നിത്തിളങ്ങുന്ന നക്ഷത്രങ്ങൾ! മനോഹരം! 🌟"
      },
      {
          "id": 47,
          "question": "കണ്ണു തുറന്നുറങ്ങുന്ന വെള്ളത്തിലെ വിരുതൻ ആരാണ്?",
          "options": [
              "തവള 🐸",
              "മത്സ്യം (Fish)! 🐟",
              "ഞണ്ട് 🦀"
          ],
          "correctIndex": 1,
          "answer": "മത്സ്യം (Fish)! 🐟",
          "keywords": [
              "മീൻ",
              "മത്സ്യം",
              "fish",
              "meen"
          ],
          "funnyReaction": "മീനിന് കൺപോളകൾ ഇല്ലാത്തതുകൊണ്ട് കണ്ണ് തുറന്നുറങ്ങും! അറിവും തമാശയും! 🐟"
      },
      {
          "id": 48,
          "question": "ചെവി തുളച്ചാലും വേദനയില്ലാത്ത, തുണി തുന്നാൻ മുന്നിൽ നടക്കുന്ന ആൾ?",
          "options": [
              "കത്രിക ✂️",
              "കട്ടർ 🔪",
              "സൂചി (Needle)! 🪡"
          ],
          "correctIndex": 2,
          "answer": "സൂചി (Needle)! 🪡",
          "keywords": [
              "സൂചി",
              "needle",
              "soochi"
          ],
          "funnyReaction": "സൂചിയുടെ ചെവി തുളച്ചാണ് നൂൽ കോർക്കുന്നത്! കിടു ഉത്തരം! 🪡"
      },
      {
          "id": 49,
          "question": "സൗദിയിലെ മലയാളി വൈകുന്നേരം ജോലി കഴിഞ്ഞ് റൂമിൽ എത്തിയാൽ ആദ്യം ചോദിക്കുന്നത്?",
          "options": [
              "നാടൻ ചായ / സുലൈമാനി! ☕",
              "ജ്യൂസ് 🧃",
              "വെള്ളം 💧"
          ],
          "correctIndex": 0,
          "answer": "നാടൻ ചായ / സുലൈമാനി! ☕",
          "keywords": [
              "ചായ",
              "സുലൈമാനി",
              "tea",
              "chaya",
              "sulaimani"
          ],
          "funnyReaction": "ഒരു കപ്പ് ചൂടുള്ള ചായ കിട്ടിയാൽ അന്നത്തെ ക്ഷീണം മുഴുവൻ പമ്പ കടക്കും! ☕❤️"
      },
      {
          "id": 50,
          "question": "കയ്യിലിരുന്നാൽ അലിഞ്ഞുപോകും, നാവിലിരുന്നാൽ തണുപ്പും മധുരവും തരും... എന്താണത്?",
          "options": [
              "പഞ്ചസാര 🍬",
              "ഐസ്ക്രീം! 🍦",
              "തേൻ 🍯"
          ],
          "correctIndex": 1,
          "answer": "ഐസ്ക്രീം! 🍦",
          "keywords": [
              "ഐസ്ക്രീം",
              "icecream",
              "ice",
              "ചോക്ലേറ്റ്"
          ],
          "funnyReaction": "സൗദിയിലെ ചൂടിൽ കഴിക്കാൻ ഐസ്ക്രീം തന്നെ ബെസ്റ്റ്! 🍦"
      }
  ];
  const KUSRUTHI_RIDDLES = digambaranRiddles;

  // Expose on window for verification & global consumption
  if (typeof window !== "undefined") {
    window.digambaranRiddles = digambaranRiddles;
  }

  // Praise responses pool (8+)
  const PRAISE_POOL = [
    "പൊളിച്ചു മച്ചാനെ! 🔥 നീ ആളൊരു പുലിയാണല്ലോ! കറക്റ്റ് ഉത്തരം!",
    "സൂപ്പർ! 🏆 സൗദിയിലെ ചൂട് കൊണ്ടിട്ടും നിന്റെ ബുദ്ധിക്ക് ഒരു കുഴപ്പവുമില്ല!",
    "കറക്റ്റ്! 👏 ദിഗംബരന്റെ വക ഒരു ബിഗ് സല്യൂട്ട്!",
    "അടിപൊളി! 🧠 ഇന്നത്തെ ബിരിയാണി നിനക്കുള്ളതാണ്!",
    "കലക്കി! ⚡ ഒറ്റയടിക്ക് പിടികിട്ടിയല്ലോ!",
    "കിടുക്കാച്ചി! 🌟 നിന്നെ വെല്ലാൻ ഇവിടെ വേറെ ആളില്ല!",
    "തീപ്പൊരി! 💥 ശരിയായ ഉത്തരം! ദിഗംബരൻ ഇംപ്രസ്സായി!",
    "മാസ്സ് മച്ചാനെ! 🚀 ഇത്രയും പെട്ടെന്ന് ഉത്തരം പറയുമെന്ന് ഞാൻ കരുതിയില്ല!"
  ];

  // Roast / teasing responses pool (8+)
  const ROAST_POOL = [
    "അയ്യയ്യേ... തെറ്റിപ്പോയി മച്ചാനെ! 😂 ഇതൊക്കെ ചെറിയ പിള്ളേര് വരെ പറയും! ശരിയായ ഉത്തരം: **{ANSWER}**",
    "ഹഹഹ, പ്ലിംഗ്! 😜 ചുമ്മാ തള്ളിവിട്ടതാണല്ലേ? ശരിയായ ഉത്തരം: **{ANSWER}**",
    "എന്താ മോനേ ഇത്! 🤣 ബദാം കുറച്ച് കൂടുതൽ കഴിക്കണം! ശരിയായ ഉത്തരം: **{ANSWER}**",
    "പൊട്ടി! 💥 ദിഗംബരനെ തോൽപ്പിക്കാൻ അത്ര എളുപ്പമല്ല! ശരിയായ ഉത്തരം: **{ANSWER}**",
    "അയ്യോ, അടുത്തുപോലും എത്തിയില്ലല്ലോ! 😈 ശരിയായ ഉത്തരം: **{ANSWER}**",
    "തെറ്റിപ്പോയി ചങ്കേ! 🤭 അടുത്ത തവണ കുറച്ചുകൂടി ആലോചിക്കൂ! ശരിയായ ഉത്തരം: **{ANSWER}**",
    "അയ്യോ കഷ്ടം! 🤦‍♂️ വിക്കറ്റ് പോയി! ശരിയായ ഉത്തരം: **{ANSWER}**",
    "ഹഹഹ! വഴിതെറ്റിപ്പോയല്ലോ മച്ചാനെ! 🤪 ശരിയായ ഉത്തരം: **{ANSWER}**"
  ];

  // Game session state
  let askedRiddleIds = [];
  let currentActiveRiddle = null;
  let gameScore = 0;
  let gameTotal = 0;
  let nonUrgentChatCount = 0;
  let isModalOpen = false;

  // Normalizer for links depending on subpath
  function getSafeLink(href) {
    const isGitHub = window.location.hostname.includes("github.io");
    const repoMatch = window.location.pathname.match(/^(\/[^\/]+)\//);
    const prefix = isGitHub && repoMatch ? repoMatch[1] : "";
    if (prefix && href.startsWith("/")) {
      return prefix + href;
    }
    return href;
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

  // Shuffle array utility
  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Inject CSS Styles for Digambaran & Riddle Game
  
  // Cute SVG Mascot for Digambaran (2 tiny gold horns, cute smile, tiny fangs & curling tail)
  const MASCOT_SVG = `
    <svg width="24" height="24" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="digambaran-mascot-svg">
      <path d="M10 13 C8 6 12 5 13 8 C14 10 13 14 13 14 Z" fill="#F59E0B" stroke="#D97706" stroke-width="1" />
      <path d="M26 13 C28 6 24 5 23 8 C22 10 23 14 23 14 Z" fill="#F59E0B" stroke="#D97706" stroke-width="1" />
      <circle cx="18" cy="19" r="11" fill="url(#digaHeadGrad)" stroke="#10B981" stroke-width="1.8" />
      <ellipse cx="14" cy="18" rx="2" ry="2.6" fill="#FEF08A" />
      <circle cx="14.8" cy="17.2" r="0.8" fill="#064E3B" />
      <ellipse cx="22" cy="18" rx="2" ry="2.6" fill="#FEF08A" />
      <circle cx="21.2" cy="17.2" r="0.8" fill="#064E3B" />
      <path d="M14.5 23.5 Q18 27.5 21.5 23.5" stroke="#FEF08A" stroke-width="1.8" stroke-linecap="round" fill="none" />
      <polygon points="16,23.5 17,25.5 17.5,23.5" fill="#FFFFFF" />
      <polygon points="20,23.5 19,25.5 18.5,23.5" fill="#FFFFFF" />
      <path d="M28 24 Q35 25 33 30 Q31 34 26 29" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" fill="none" />
      <polygon points="24,28 26,32 23,31" fill="#F59E0B" />
      <defs>
        <linearGradient id="digaHeadGrad" x1="10" y1="10" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#059669" />
          <stop offset="100%" stop-color="#022c22" />
        </linearGradient>
      </defs>
    </svg>
  `;

  function injectStyles() {
    if (document.getElementById("digambaran-styles")) return;
    const style = document.createElement("style");
    style.id = "digambaran-styles";
    style.textContent = `
      /* Digambaran Floating Trigger Button */
      .digambaran-float-btn {
        position: fixed;
        right: 24px;
        bottom: 24px;
        left: auto;
        z-index: 150;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #064e3b 0%, #022c22 100%);
        color: #fde68a;
        border: 1.5px solid rgba(245, 158, 11, 0.45);
        border-radius: 9999px;
        padding: 8px 16px 8px 10px;
        font-family: var(--font-sans, "Inter", "Noto Sans Malayalam", sans-serif);
        font-size: 0.85rem;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }
      .digambaran-float-btn:hover {
        transform: translateY(-3px) scale(1.02);
        border-color: #f59e0b;
        box-shadow: 0 14px 32px rgba(245, 158, 11, 0.25), 0 10px 25px rgba(0, 0, 0, 0.5);
      }
      .digambaran-float-btn:active {
        transform: scale(0.96);
      }
      .digambaran-float-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: radial-gradient(circle, #f59e0b 0%, #b45309 100%);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 1.15rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }
      .digambaran-float-copy {
        display: flex;
        flex-direction: column;
        line-height: 1.15;
        text-align: left;
      }
      .digambaran-float-copy small {
        font-size: 0.65rem;
        color: #6ee7b7;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .digambaran-float-copy strong {
        font-size: 0.85rem;
        color: #ffffff;
        font-weight: 800;
      }

      /* Mobile adjustment for Floating Trigger */
      /* D&J WhatsApp header button */
      .digambaran-wa-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(37, 211, 102, 0.15);
        color: #25d366;
        border: 1px solid rgba(37, 211, 102, 0.4);
        padding: 5px 10px;
        border-radius: 999px;
        font-size: 0.74rem;
        font-weight: 700;
        text-decoration: none;
        transition: all 0.2s ease;
      }
      .digambaran-wa-btn:hover {
        background: #25d366;
        color: #ffffff;
      }

      @media (max-width: 768px) {
        .digambaran-float-btn {
          right: 16px !important;
          left: auto !important;
          bottom: calc(7rem + env(safe-area-inset-bottom, 0px)) !important;
          padding: 6px 12px 6px 8px;
        }
        body.pwa-banner-visible .digambaran-float-btn,
        body:has(#pwa-install-banner:not([style*="display: none"])) .digambaran-float-btn {
          bottom: calc(9.5rem + env(safe-area-inset-bottom, 0px)) !important;
        }
        .digambaran-float-avatar {
          width: 28px;
          height: 28px;
          font-size: 1rem;
        }
        .digambaran-float-copy strong {
          font-size: 0.78rem;
        }
        .digambaran-float-copy small {
          font-size: 0.6rem;
        }
      }

      /* Floating Speech Bubble Callout */
      .digambaran-speech-bubble {
        position: fixed;
        right: 24px;
        bottom: 84px;
        z-index: 151;
        max-width: 220px;
        background: #ffffff;
        color: #064e3b;
        border: 1.5px solid #059669;
        border-radius: 14px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25), 0 0 16px rgba(5, 150, 105, 0.2);
        padding: 9px 12px;
        font-family: var(--font-sans, "Inter", "Noto Sans Malayalam", sans-serif);
        font-size: 0.78rem;
        line-height: 1.38;
        font-weight: 600;
        cursor: pointer;
        opacity: 0;
        transform: translateY(8px) scale(0.96);
        pointer-events: none;
        transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }
      .digambaran-speech-bubble.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }
      .digambaran-speech-bubble:hover {
        transform: translateY(-2px) scale(1.02);
        border-color: #f59e0b;
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(245, 158, 11, 0.25);
      }
      .diga-bubble-content {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
      }
      .diga-bubble-text {
        flex: 1;
        color: #064e3b;
        font-weight: 700;
      }
      .diga-bubble-close {
        background: rgba(0, 0, 0, 0.06);
        border: none;
        color: #64748b;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.65rem;
        cursor: pointer;
        flex-shrink: 0;
        padding: 0;
        transition: background 0.15s, color 0.15s;
      }
      .diga-bubble-close:hover {
        background: rgba(239, 68, 68, 0.2);
        color: #dc2626;
      }
      .diga-bubble-arrow {
        position: absolute;
        bottom: -7px;
        right: 32px;
        width: 12px;
        height: 12px;
        background: #ffffff;
        border-right: 1.5px solid #059669;
        border-bottom: 1.5px solid #059669;
        transform: rotate(45deg);
      }
      .digambaran-speech-bubble:hover .diga-bubble-arrow {
        border-color: #f59e0b;
      }

      @media (max-width: 768px) {
        .digambaran-speech-bubble {
          right: 16px !important;
          left: auto !important;
          bottom: calc(10.6rem + env(safe-area-inset-bottom, 0px)) !important;
          max-width: 215px;
          padding: 8px 10px;
          font-size: 0.74rem;
        }
        body.pwa-banner-visible .digambaran-speech-bubble,
        body:has(#pwa-install-banner:not([style*="display: none"])) .digambaran-speech-bubble {
          bottom: calc(13.2rem + env(safe-area-inset-bottom, 0px)) !important;
        }
        .diga-bubble-arrow {
          right: 28px;
        }
      }

      /* Backdrop */
      .digambaran-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(2, 6, 23, 0.65);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
      }
      .digambaran-backdrop.active {
        opacity: 1;
        pointer-events: auto;
      }

      /* Chat Window */
      .digambaran-window {
        position: fixed;
        left: 20px;
        bottom: 85px;
        width: 400px;
        max-width: calc(100vw - 32px);
        height: 590px;
        max-height: calc(100vh - 110px);
        background: #09131c;
        border: 1.5px solid rgba(245, 158, 11, 0.35);
        border-radius: 20px;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.75), 0 0 20px rgba(245, 158, 11, 0.1);
        z-index: 1001;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        opacity: 0;
        transform: translateY(20px) scale(0.96);
        pointer-events: none;
        transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: var(--font-sans, "Inter", "Noto Sans Malayalam", sans-serif);
      }
      .digambaran-window.active {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      @media (max-width: 768px) {
        .digambaran-window {
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 100%;
          height: 85vh;
          max-height: 85vh;
          border-radius: 24px 24px 0 0;
          border-bottom: none;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.85);
          transform: translateY(100%);
        }
        .digambaran-window.active {
          transform: translateY(0);
        }
      }

      /* Header */
      .digambaran-header {
        background: linear-gradient(135deg, #064e3b 0%, #0f172a 100%);
        padding: 14px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(245, 158, 11, 0.25);
        flex-shrink: 0;
      }
      .digambaran-header-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .digambaran-header-avatar {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: radial-gradient(circle, #f59e0b 0%, #b45309 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      }
      .digambaran-header-text h3 {
        margin: 0;
        font-size: 0.98rem;
        font-weight: 800;
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .digambaran-header-text p {
        margin: 2px 0 0;
        font-size: 0.7rem;
        color: #6ee7b7;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .digambaran-status-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #10b981;
        display: inline-block;
        box-shadow: 0 0 8px #10b981;
      }
      .digambaran-header-actions {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .digambaran-btn-icon {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #e2e8f0;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 0.95rem;
        transition: background 0.15s ease, color 0.15s ease;
      }
      .digambaran-btn-icon:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #ffffff;
      }

      /* Messages container */
      .digambaran-body {
        flex: 1;
        overflow-y: auto;
        padding: 16px 14px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        background: radial-gradient(ellipse at top, #0f1c24 0%, #070d12 100%);
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }

      /* Message Bubbles */
      .digambaran-msg {
        display: flex;
        gap: 10px;
        max-width: 92%;
        animation: digambaranFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes digambaranFadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .digambaran-msg.bot {
        align-self: flex-start;
      }
      .digambaran-msg.user {
        align-self: flex-end;
        flex-direction: row-reverse;
      }
      .digambaran-msg-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: radial-gradient(circle, #f59e0b 0%, #b45309 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .digambaran-bubble {
        padding: 11px 14px;
        border-radius: 16px;
        font-size: 0.86rem;
        line-height: 1.5;
        color: #e2e8f0;
      }
      .digambaran-msg.bot .digambaran-bubble {
        background: #13222e;
        border: 1px solid rgba(245, 158, 11, 0.2);
        border-top-left-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
      .digambaran-msg.user .digambaran-bubble {
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        color: #ffffff;
        border-top-right-radius: 4px;
        font-weight: 500;
      }

      .digambaran-bubble a.digambaran-link-btn {
        display: inline-flex;
        align-items: center;
        margin-top: 8px;
        padding: 6px 12px;
        background: #047857;
        color: #ffffff;
        text-decoration: none;
        border-radius: 8px;
        font-size: 0.78rem;
        font-weight: 700;
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: background 0.15s ease;
      }
      .digambaran-bubble a.digambaran-link-btn:hover {
        background: #059669;
      }

      /* Riddle Card Styles with Interactive Options */
      .riddle-card {
        background: linear-gradient(145deg, #1e1e2f 0%, #151828 100%);
        border: 1.5px solid #f59e0b;
        border-radius: 14px;
        padding: 14px;
        margin-top: 4px;
        box-shadow: 0 8px 24px rgba(245, 158, 11, 0.15);
      }
      .riddle-header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
      }
      .riddle-badge {
        display: inline-flex;
        align-items: center;
        background: #f59e0b;
        color: #1a0f00;
        font-weight: 800;
        font-size: 0.7rem;
        padding: 3px 8px;
        border-radius: 6px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .riddle-score-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: rgba(16, 185, 129, 0.2);
        border: 1px solid #10b981;
        color: #6ee7b7;
        font-size: 0.72rem;
        font-weight: 800;
        padding: 3px 8px;
        border-radius: 6px;
      }
      .riddle-question {
        color: #fef08a;
        font-size: 0.94rem;
        font-weight: 700;
        line-height: 1.55;
        margin-bottom: 12px;
      }
      .riddle-options-grid {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 10px;
      }
      .riddle-opt-btn {
        background: #1e293b;
        border: 1.5px solid rgba(245, 158, 11, 0.35);
        border-radius: 10px;
        padding: 10px 14px;
        color: #f8fafc;
        font-family: inherit;
        font-size: 0.86rem;
        font-weight: 700;
        text-align: left;
        cursor: pointer;
        transition: transform 0.12s ease, background 0.15s ease, border-color 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: space-between;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }
      .riddle-opt-btn:hover {
        background: #334155;
        border-color: #f59e0b;
        transform: translateY(-1px);
      }
      .riddle-opt-btn:active {
        transform: scale(0.98);
      }
      .riddle-opt-tag {
        font-size: 0.7rem;
        color: #94a3b8;
        font-weight: 600;
      }

      /* Praise Card (Correct) */
      .riddle-praise-card {
        background: linear-gradient(145deg, #063c2e 0%, #062e24 100%);
        border: 1.5px solid #10b981;
        border-radius: 14px;
        padding: 14px;
        margin-top: 6px;
        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
      }
      .praise-badge {
        display: inline-flex;
        align-items: center;
        background: #10b981;
        color: #02261b;
        font-weight: 800;
        font-size: 0.72rem;
        padding: 3px 8px;
        border-radius: 6px;
        text-transform: uppercase;
        margin-bottom: 8px;
      }
      .praise-text {
        font-size: 0.95rem;
        font-weight: 800;
        color: #ffffff;
        line-height: 1.45;
        margin-bottom: 8px;
      }

      /* Teasing / Roast Card (Wrong) */
      .riddle-roast-card {
        background: linear-gradient(145deg, #3f1a1a 0%, #2b1111 100%);
        border: 1.5px solid #ef4444;
        border-radius: 14px;
        padding: 14px;
        margin-top: 6px;
        box-shadow: 0 8px 24px rgba(239, 68, 68, 0.2);
      }
      .roast-badge {
        display: inline-flex;
        align-items: center;
        background: #ef4444;
        color: #ffffff;
        font-weight: 800;
        font-size: 0.72rem;
        padding: 3px 8px;
        border-radius: 6px;
        text-transform: uppercase;
        margin-bottom: 8px;
      }
      .roast-text {
        font-size: 0.92rem;
        font-weight: 700;
        color: #fee2e2;
        line-height: 1.45;
        margin-bottom: 8px;
      }
      .roast-text strong {
        color: #fde047;
      }

      /* Navigation Actions after Guess */
      .riddle-nav-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
        padding-top: 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
      }
      .btn-game-next, .btn-game-stop {
        border: none;
        border-radius: 8px;
        padding: 8px 14px;
        font-family: inherit;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        transition: transform 0.12s ease, background 0.15s ease;
        -webkit-tap-highlight-color: transparent;
      }
      .btn-game-next {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: #160c00;
        box-shadow: 0 3px 10px rgba(245, 158, 11, 0.3);
      }
      .btn-game-next:hover {
        background: #fbbf24;
        transform: translateY(-1px);
      }
      .btn-game-next:active {
        transform: scale(0.96);
      }
      .btn-game-stop {
        background: #334155;
        color: #f1f5f9;
        border: 1px solid #475569;
      }
      .btn-game-stop:hover {
        background: #475569;
        transform: translateY(-1px);
      }
      .btn-game-stop:active {
        transform: scale(0.96);
      }

      /* Game Over Summary Card */
      .riddle-summary-card {
        background: linear-gradient(145deg, #0f172a 0%, #1e1e38 100%);
        border: 1.5px solid #a855f7;
        border-radius: 14px;
        padding: 14px;
        margin-top: 6px;
      }
      .summary-badge {
        display: inline-flex;
        align-items: center;
        background: #a855f7;
        color: #ffffff;
        font-weight: 800;
        font-size: 0.72rem;
        padding: 3px 8px;
        border-radius: 6px;
        margin-bottom: 8px;
      }
      .summary-score-large {
        font-size: 1.15rem;
        font-weight: 800;
        color: #fef08a;
        margin-bottom: 6px;
      }

      /* Playful Prompt Banner */
      .digambaran-playful-prompt {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(180, 83, 9, 0.25) 100%);
        border: 1px solid #f59e0b;
        border-radius: 10px;
        padding: 8px 12px;
        margin-top: 10px;
        cursor: pointer;
        transition: background 0.15s ease, transform 0.12s ease;
      }
      .digambaran-playful-prompt:hover {
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.28) 0%, rgba(180, 83, 9, 0.38) 100%);
        transform: translateY(-1px);
      }
      .digambaran-playful-prompt:active {
        transform: scale(0.98);
      }
      .playful-text {
        font-size: 0.78rem;
        font-weight: 700;
        color: #fde68a;
        line-height: 1.35;
      }
      .playful-badge {
        background: #f59e0b;
        color: #1a0f00;
        font-size: 0.68rem;
        font-weight: 800;
        padding: 3px 7px;
        border-radius: 6px;
        white-space: nowrap;
        flex-shrink: 0;
      }

      /* Quick Reply Chips Carousel */
      .digambaran-chips-container {
        padding: 8px 12px;
        background: #081119;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        gap: 8px;
        overflow-x: auto;
        white-space: nowrap;
        flex-shrink: 0;
        -webkit-overflow-scrolling: touch;
      }
      .digambaran-chips-container::-webkit-scrollbar {
        height: 4px;
      }
      .digambaran-chips-container::-webkit-scrollbar-thumb {
        background: rgba(245, 158, 11, 0.3);
        border-radius: 4px;
      }
      .digambaran-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: #162432;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 9999px;
        padding: 6px 12px;
        color: #cbd5e1;
        font-size: 0.76rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
        user-select: none;
        flex-shrink: 0;
      }
      .digambaran-chip:hover {
        background: #1e3347;
        color: #ffffff;
        border-color: rgba(245, 158, 11, 0.4);
      }
      .digambaran-chip:active {
        transform: scale(0.96);
      }
      .digambaran-chip.chip-highlight {
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(180, 83, 9, 0.3) 100%);
        border: 1.5px solid #f59e0b;
        color: #fef08a;
        font-weight: 700;
      }

      /* Input Bar */
      .digambaran-input-bar {
        padding: 10px 12px;
        background: #060c12;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }
      .digambaran-input {
        flex: 1;
        background: #13222f;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        padding: 10px 14px;
        color: #ffffff;
        font-family: inherit;
        font-size: 0.86rem;
        outline: none;
        transition: border-color 0.15s ease;
      }
      .digambaran-input::placeholder {
        color: #94a3b8;
        font-size: 0.8rem;
      }
      .digambaran-input:focus {
        border-color: #f59e0b;
        box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
      }
      .digambaran-send-btn {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        border: none;
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: #170d00;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1rem;
        flex-shrink: 0;
        transition: transform 0.12s ease, background 0.15s ease;
      }
      .digambaran-send-btn:hover {
        background: #fbbf24;
        transform: scale(1.05);
      }
      .digambaran-send-btn:active {
        transform: scale(0.95);
      }
    `;
    document.head.appendChild(style);
  }

  // Create & Inject Floating Button and Chat Window
  function injectDigambaranDOM() {
    if (document.getElementById("digambaran-float-btn")) return;

    // 1b. Floating Speech Bubble (Tooltip Callout)
    const bubble = document.createElement("div");
    bubble.id = "digambaran-speech-bubble";
    bubble.className = "digambaran-speech-bubble";
    bubble.setAttribute("role", "tooltip");
    bubble.setAttribute("aria-live", "polite");
    bubble.innerHTML = `
      <div class="diga-bubble-content">
        <span class="diga-bubble-text" id="diga-bubble-text">👋 നിങ്ങളെ സഹായിക്കാനുള്ള AI ആണ് ഞാൻ! എന്ത് സഹായം വേണം?</span>
        <button type="button" class="diga-bubble-close" id="diga-bubble-close" title="ക്ലോസ് ചെയ്യുക" aria-label="Dismiss">✕</button>
      </div>
      <div class="diga-bubble-arrow" aria-hidden="true"></div>
    `;
    document.body.appendChild(bubble);

    // 1. Floating Button
    const floatBtn = document.createElement("button");
    floatBtn.id = "digambaran-float-btn";
    floatBtn.type = "button";
    floatBtn.className = "digambaran-float-btn";
    floatBtn.setAttribute("aria-label", "ദിഗംബരൻ AI സഹായിയുമായി ചാറ്റ് ചെയ്യുക");
    floatBtn.setAttribute("title", "ദിഗംബരൻ · പ്രവാസി AI സഹായി & കുസൃതിച്ചോദ്യങ്ങൾ");
    floatBtn.innerHTML = `
      <span class="digambaran-float-avatar" aria-hidden="true">${MASCOT_SVG}</span>
      <span class="digambaran-float-copy">
        <small>പ്രവാസി AI</small>
        <strong>ദിഗംബരൻ</strong>
      </span>
    `;
    document.body.appendChild(floatBtn);

    // 2. Backdrop
    const backdrop = document.createElement("div");
    backdrop.id = "digambaran-backdrop";
    backdrop.className = "digambaran-backdrop";
    document.body.appendChild(backdrop);

    // 3. Chat Window
    const win = document.createElement("div");
    win.id = "digambaran-window";
    win.className = "digambaran-window";
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-modal", "true");
    win.setAttribute("aria-label", "ദിഗംബരൻ AI ചാറ്റ്ബോട്ട്");
    win.innerHTML = `
      <div class="digambaran-header">
        <div class="digambaran-header-info">
          <div class="digambaran-header-avatar">${MASCOT_SVG}</div>
          <div class="digambaran-header-text">
            <h3>ദിഗംബരൻ <span style="font-size:0.75rem; color:#f59e0b; font-weight:600;">(AI സഹായി)</span></h3>
            <p><span class="digambaran-status-dot"></span> 100% ഓഫ്‌ലൈൻ &amp; ഇൻസ്റ്റന്റ്</p>
          </div>
        </div>
        <div class="digambaran-header-actions">
          <a href="https://wa.me/447460646263?text=Hi%20D%26J!%20Need%20support%20from%20KSA%20Malayali%20Hub." target="_blank" rel="noopener noreferrer" class="digambaran-wa-btn" title="D&J WhatsApp Support (+44 7460 646263)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12.03 2C6.5 2 2 6.48 2 12c0 1.77.46 3.5 1.34 5.02L2 22l5.13-1.34A9.96 9.96 0 0 0 12.03 22C17.55 22 22 17.52 22 12S17.55 2 12.03 2zm5.82 14.17c-.24.68-1.42 1.3-1.97 1.38-.52.08-1.18.11-1.9-.12-.44-.14-1-.33-1.72-.64-3.02-1.31-4.99-4.38-5.14-4.58-.15-.2-1.23-1.64-1.23-3.13s.78-2.22 1.06-2.52c.28-.3.61-.38.81-.38h.59c.19 0 .44-.07.69.53.25.61.85 2.09.92 2.24.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.54-.15.15-.31.32-.13.62.18.3.79 1.31 1.7 2.12 1.17 1.04 2.15 1.37 2.46 1.52.3.15.48.13.66-.08.18-.2.76-.89.96-1.19.2-.3.41-.25.69-.15.28.1 1.78.84 2.08.99.3.15.51.23.58.36.08.13.08.76-.16 1.44z"/></svg>
            <span>D&amp;J വാട്സാപ്പ്</span>
          </a>
          <button type="button" id="digambaran-btn-clear" class="digambaran-btn-icon" title="ചാറ്റ് റീസെറ്റ് ചെയ്യുക" aria-label="Clear Chat">↺</button>
          <button type="button" id="digambaran-btn-close" class="digambaran-btn-icon" title="ക്ലോസ് ചെയ്യുക" aria-label="Close Chat">✕</button>
        </div>
      </div>

      <div class="digambaran-body" id="digambaran-messages">
        <!-- Initial Welcome Message -->
        <div class="digambaran-msg bot">
          <div class="digambaran-msg-avatar">${MASCOT_SVG}</div>
          <div class="digambaran-bubble">
            <strong>നമസ്കാരം മച്ചാനെ! ഞാൻ ദിഗംബരൻ</strong><br>
            സൗദിയിലെ മലയാളി ഹോട്ടലുകൾ, ലൈവ് റിയാൽ നിരക്ക്, ഹൈപ്പർമാർക്കറ്റ് ഓഫറുകൾ, ഇഖാമ, എമർജൻസി അല്ലെങ്കിൽ ബോറടിക്കുമ്പോൾ ഒരു കുസൃതിച്ചോദ്യം... എന്ത് വേണമെങ്കിലും ചോദിച്ചോളൂ!
          </div>
        </div>
      </div>

      <!-- Quick Reply Chips -->
      <div class="digambaran-chips-container" id="digambaran-chips">
        <button type="button" class="digambaran-chip chip-highlight" data-query="കുസൃതിച്ചോദ്യം">😜 കുസൃതിച്ചോദ്യം</button>
        <a href="https://wa.me/447460646263?text=Hi%20D%26J!%20Need%20support%20from%20KSA%20Malayali%20Hub." target="_blank" rel="noopener noreferrer" class="digambaran-chip chip-wa" style="text-decoration:none; background:rgba(37,211,102,0.12); color:#25d366; border-color:rgba(37,211,102,0.35);">💬 D&amp;J (+44 7460 646263)</a>
        <button type="button" class="digambaran-chip" data-query="ഹോട്ടൽ">🍲 മലയാളി ഹോട്ടൽ</button>
        <button type="button" class="digambaran-chip" data-query="റിയാൽ">💱 റിയാൽ നിരക്ക്</button>
        <button type="button" class="digambaran-chip" data-query="ഓഫർ">🛍️ ഓഫറുകൾ</button>
        <button type="button" class="digambaran-chip" data-query="എമർജൻസി">🚨 എമർജൻസി</button>
        <button type="button" class="digambaran-chip" data-query="ഇഖാമ">📄 ഇഖാമ &amp; ഖിവ</button>
        <button type="button" class="digambaran-chip" data-query="സിനിമ">🎬 സിനിമകൾ</button>
        <button type="button" class="digambaran-chip" data-query="ക്ലിനിക്ക്">🏥 ക്ലിനിക്കുകൾ</button>
        <button type="button" class="digambaran-chip" data-query="സിം">📱 സിം കോഡുകൾ</button>
        <button type="button" class="digambaran-chip" data-query="യാത്ര">🚄 യാത്ര &amp; ട്രെയിൻ</button>
      </div>

      <!-- Input Bar -->
      <form class="digambaran-input-bar" id="digambaran-form" action="javascript:void(0);">
        <input type="text" id="digambaran-input" class="digambaran-input" placeholder="ദിഗംബരനോട് ചോദിക്കൂ... (ഉദാ: കുസൃതി, ഹോട്ടൽ, ഇഖാമ)" autocomplete="off" />
        <button type="submit" id="digambaran-send-btn" class="digambaran-send-btn" title="അയക്കുക" aria-label="Send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </form>
    `;
    document.body.appendChild(win);

    bindEvents();
    initSpeechBubbleLifecycle();
  }

  // Rotating Speech Bubble Callout Logic
  const BUBBLE_MESSAGES = [
    "👋 നിങ്ങളെ സഹായിക്കാനുള്ള AI ആണ് ഞാൻ! എന്ത് സഹായം വേണം?",
    "😈 ഇഖാമ, റിയാൽ റേറ്റ്, ഹോട്ടലുകൾ — എന്നോട് ചോദിക്കൂ!",
    "😜 ബോറടിക്കുന്നോ? 100 കുസൃതിച്ചോദ്യങ്ങളുണ്ട്, കളിക്കാം!"
  ];

  let bubbleInterval = null;
  let bubbleHideTimer = null;
  let currentBubbleIdx = 0;

  function showSpeechBubble() {
    if (sessionStorage.getItem("digambaran_bubble_dismissed") === "true") return;
    if (isModalOpen) return;

    const bubble = document.getElementById("digambaran-speech-bubble");
    const textEl = document.getElementById("diga-bubble-text");
    if (!bubble || !textEl) return;

    textEl.textContent = BUBBLE_MESSAGES[currentBubbleIdx];
    currentBubbleIdx = (currentBubbleIdx + 1) % BUBBLE_MESSAGES.length;

    bubble.classList.add("visible");

    clearTimeout(bubbleHideTimer);
    bubbleHideTimer = setTimeout(() => {
      hideSpeechBubble();
    }, 6000);
  }

  function hideSpeechBubble() {
    const bubble = document.getElementById("digambaran-speech-bubble");
    if (bubble) bubble.classList.remove("visible");
    clearTimeout(bubbleHideTimer);
  }

  function dismissSpeechBubblePermanently() {
    sessionStorage.setItem("digambaran_bubble_dismissed", "true");
    hideSpeechBubble();
    if (bubbleInterval) clearInterval(bubbleInterval);
  }

  function initSpeechBubbleLifecycle() {
    // Initial show after 3 seconds
    setTimeout(() => {
      showSpeechBubble();
    }, 3000);

    // Periodic check every 30 seconds
    bubbleInterval = setInterval(() => {
      showSpeechBubble();
    }, 30000);
  }

  // Open & Close Chat Window
  function openDigambaran() {
    hideSpeechBubble();
    injectDigambaranDOM();
    const win = document.getElementById("digambaran-window");
    const backdrop = document.getElementById("digambaran-backdrop");
    if (win && backdrop) {
      win.classList.add("active");
      backdrop.classList.add("active");
      isModalOpen = true;
      const input = document.getElementById("digambaran-input");
      if (input) setTimeout(() => input.focus(), 250);
    }
  }

  function closeDigambaran() {
    const win = document.getElementById("digambaran-window");
    const backdrop = document.getElementById("digambaran-backdrop");
    if (win && backdrop) {
      win.classList.remove("active");
      backdrop.classList.remove("active");
      isModalOpen = false;
    }
  }

  // Append User Message
  function appendUserMessage(text) {
    const container = document.getElementById("digambaran-messages");
    if (!container) return;
    const msg = document.createElement("div");
    msg.className = "digambaran-msg user";
    msg.innerHTML = `<div class="digambaran-bubble">${escapeHtml(text)}</div>`;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  // Append Bot Message (supports HTML)
  function appendBotMessage(htmlContent, isPlayful = false) {
    const container = document.getElementById("digambaran-messages");
    if (!container) return;
    const msg = document.createElement("div");
    msg.className = "digambaran-msg bot";

    let extraPlayfulHtml = "";
    if (isPlayful) {
      extraPlayfulHtml = `
        <div class="digambaran-playful-prompt" role="button" tabindex="0" title="ഒരു കുസൃതിച്ചോദ്യം ചോദിക്കട്ടെ?">
          <span class="playful-text">ബോറടിക്കുന്നോ മച്ചാനെ? ഒരു കുസൃതിച്ചോദ്യം ചോദിക്കട്ടെ? 😈</span>
          <span class="playful-badge">ചോദിക്കൂ ➔</span>
        </div>
      `;
    }

    msg.innerHTML = `
      <div class="digambaran-msg-avatar">${MASCOT_SVG}</div>
      <div class="digambaran-bubble">
        ${htmlContent}
        ${extraPlayfulHtml}
      </div>
    `;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;

    // Attach click to playful prompt if present
    const promptBtn = msg.querySelector(".digambaran-playful-prompt");
    if (promptBtn) {
      promptBtn.addEventListener("click", () => {
        askRiddle();
      });
    }
  }

  // Serve Next Random Riddle (Ensures NO repeats until all 52 are finished)
  function askRiddle() {
    // If all asked, reset
    if (askedRiddleIds.length >= KUSRUTHI_RIDDLES.length) {
      askedRiddleIds = [];
    }

    const available = KUSRUTHI_RIDDLES.filter(r => !askedRiddleIds.includes(r.id));
    const riddle = available[Math.floor(Math.random() * available.length)] || KUSRUTHI_RIDDLES[0];
    askedRiddleIds.push(riddle.id);
    currentActiveRiddle = riddle;

    if (window.HubLogger) {
      window.HubLogger.logEvent("RIDDLE_GAME", `കുസൃതിച്ചോദ്യം തുടങ്ങി (#${riddle.id})`, `ചോദ്യം: ${riddle.question.slice(0, 40)}...`);
    }

    // Shuffle 3 options
    const shuffledOptions = shuffleArray(riddle.options);

    const optionsHtml = shuffledOptions
      .map((opt, idx) => {
        const isRight = (opt === riddle.answer || opt.includes(riddle.answer.split("!")[0]));
        return `
          <button type="button" class="riddle-opt-btn" data-riddle-id="${riddle.id}" data-opt-idx="${idx}" data-correct="${isRight ? 'true' : 'false'}">
            <span>${escapeHtml(opt)}</span>
            <span class="riddle-opt-tag">ഓപ്ഷൻ ${idx + 1}</span>
          </button>
        `;
      })
      .join("");

    const html = `
      <div class="riddle-card" id="active-riddle-card-${riddle.id}">
        <div class="riddle-header-row">
          <span class="riddle-badge">😜 ചോദ്യം ${askedRiddleIds.length} / ${digambaranRiddles.length}</span>
          <span class="riddle-score-badge">🏆 സ്കോർ: ${gameScore}</span>
        </div>
        <div class="riddle-question">"${escapeHtml(riddle.question)}"</div>
        <div style="font-size:0.75rem; color:#94a3b8; margin-bottom:6px;">ശരിയായ ഉത്തരം താഴെ നിന്ന് തിരഞ്ഞെടുക്കൂ (അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യൂ):</div>
        <div class="riddle-options-grid">
          ${optionsHtml}
        </div>
      </div>
    `;

    appendBotMessage(html, false);
  }

  // Handle Guess (Option Button Click or Typed Answer)
  function handleRiddleGuess(isCorrect, riddle) {
    if (!riddle) riddle = currentActiveRiddle;
    if (!riddle) return;

    // Disable buttons on the active riddle card
    const card = document.getElementById(`active-riddle-card-${riddle.id}`);
    if (card) {
      card.querySelectorAll(".riddle-opt-btn").forEach(b => {
        b.disabled = true;
        b.style.pointerEvents = "none";
        b.style.opacity = "0.7";
      });
    }

    gameTotal++;

    if (isCorrect) {
      gameScore++;
    }

    if (window.HubLogger) {
      window.HubLogger.logEvent("RIDDLE_GAME", isCorrect ? `കുസൃതിച്ചോദ്യം ശരിയുത്തരം (#${riddle.id})` : `കുസൃതിച്ചോദ്യം തെറ്റി (#${riddle.id})`, `സ്കോർ: ${gameScore} / ${gameTotal} · ഉത്തരം: ${riddle.answer}`);
    }

    if (isCorrect) {
      const randomPraise = PRAISE_POOL[Math.floor(Math.random() * PRAISE_POOL.length)];
      const html = `
        <div class="riddle-praise-card">
          <div class="praise-badge">✅ ശരിയുത്തരം!</div>
          <div class="praise-text">${escapeHtml(randomPraise)}</div>
          <div style="font-size:0.8rem; color:#a7f3d0; margin-bottom:6px;">
            ശരിയായ ഉത്തരം: <strong>${escapeHtml(riddle.answer)}</strong><br>
            <em>${escapeHtml(riddle.funnyReaction || "")}</em>
          </div>
          <div style="font-size:0.78rem; font-weight:800; color:#fde047;">🏆 നിലവിലെ സ്കോർ: ${gameScore} / ${gameTotal}</div>
          <div class="riddle-nav-actions">
            <button type="button" class="btn-game-next">➡️ അടുത്ത ചോദ്യം</button>
            <button type="button" class="btn-game-stop">🛑 മതി, നിർത്താം</button>
          </div>
        </div>
      `;
      appendBotMessage(html, false);
    } else {
      const template = ROAST_POOL[Math.floor(Math.random() * ROAST_POOL.length)];
      const randomRoast = template.replace("{ANSWER}", riddle.answer);
      // Format bold markdown
      const formattedRoast = escapeHtml(randomRoast).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const html = `
        <div class="riddle-roast-card">
          <div class="roast-badge">❌ അയ്യോ തെറ്റിപ്പോയി!</div>
          <div class="roast-text">${formattedRoast}</div>
          <div style="font-size:0.8rem; color:#fca5a5; margin-bottom:6px;">
            <em>${escapeHtml(riddle.funnyReaction || "")}</em>
          </div>
          <div style="font-size:0.78rem; font-weight:800; color:#fde047;">🏆 നിലവിലെ സ്കോർ: ${gameScore} / ${gameTotal}</div>
          <div class="riddle-nav-actions">
            <button type="button" class="btn-game-next">➡️ അടുത്ത ചോദ്യം</button>
            <button type="button" class="btn-game-stop">🛑 മതി, നിർത്താം</button>
          </div>
        </div>
      `;
      appendBotMessage(html, false);
    }

    currentActiveRiddle = null;
  }

  // Stop Game and Show Summary
  function stopRiddleGame() {
    currentActiveRiddle = null;
    let evalMsg = "";
    const pct = gameTotal > 0 ? (gameScore / gameTotal) * 100 : 0;
    if (pct >= 70) {
      evalMsg = "നീ ഒരു വൻ സംഭവം തന്നെ മച്ചാനെ! തലച്ചോറ് 24K ഗോൾഡ് ആണ്! 👑🔥";
    } else if (pct >= 40) {
      evalMsg = "കൊള്ളാം മച്ചാനെ! കുറച്ചുകൂടി ശ്രദ്ധിച്ചാൽ നമുക്ക് കപ്പടിക്കാം! 👏✨";
    } else {
      evalMsg = "ഹഹഹ! കുഴപ്പമില്ല, അടുത്ത തവണ ജയിക്കാം! ഇപ്പൊ പോയി നല്ലൊരു നാടൻ ചായ കുടിക്ക്! ☕😄";
    }

    const html = `
      <div class="riddle-summary-card">
        <div class="summary-badge">🏆 കളി കഴിഞ്ഞു!</div>
        <div class="summary-score-large">ഫൈനൽ സ്കോർ: ${gameScore} / ${gameTotal}</div>
        <div style="font-size:0.86rem; color:#e2e8f0; line-height:1.45; margin-bottom:10px;">${evalMsg}</div>
        <div style="font-size:0.76rem; color:#94a3b8;">
          വീണ്ടും കളിക്കണമെങ്കിൽ <strong>😜 കുസൃതിച്ചോദ്യം</strong> ചിപ്പിൽ ടാപ്പ് ചെയ്യൂ! അല്ലെങ്കിൽ മറ്റെന്തെങ്കിലും വിവരങ്ങൾ അറിയാൻ താഴെ ചോദിക്കൂ.
        </div>
      </div>
    `;

    // Reset scores for next round
    gameScore = 0;
    gameTotal = 0;

    appendBotMessage(html, false);
  }

  // Match Query Intent (Offline Engine)
  function processUserQuery(rawQuery) {
    const query = rawQuery.trim();
    if (!query) return;

    appendUserMessage(query);

    const q = query.toLowerCase();

    // 1. Riddle Game Mode: check if user is answering an active riddle!
    if (currentActiveRiddle) {
      // First check if query is a critical help command (Emergency, Iqama, Clinic, Hotel)
      const isCriticalIntent =
        q.includes("911") || q.includes("999") || q.includes("997") ||
        q.includes("emergency") || q.includes("ambulance") || q.includes("police") ||
        q.includes("iqama") || q.includes("qiwa") || q.includes("huroob") || q.includes("labor") ||
        q.includes("hospital") || q.includes("clinic") || q.includes("medicine") ||
        q.includes("hotel") || q.includes("food") || q.includes("biriyani") ||
        q.includes("rate") || q.includes("riyal") || q.includes("gold") ||
        q.includes("stop") || q.includes("മതി") || q.includes("നിർത്താം");

      if (q.includes("stop") || q.includes("മതി") || q.includes("നിർത്താം")) {
        setTimeout(stopRiddleGame, 200);
        return;
      }

      if (!isCriticalIntent) {
        // Evaluate typed guess against active riddle keywords & answer
        const r = currentActiveRiddle;
        const matchesKeyword = r.keywords.some(k => q.includes(k.toLowerCase())) ||
                               q.includes(r.answer.toLowerCase().slice(0, 4));
        setTimeout(() => {
          handleRiddleGuess(matchesKeyword, r);
        }, 200);
        return;
      } else {
        // Exit active riddle and handle critical query
        currentActiveRiddle = null;
      }
    }

    // 2. Secret Easter Egg: Owner / Creator / Founder queries
    const ownerKeywords = [
      "owner",
      "creator",
      "founder",
      "admin",
      "developer",
      "who made",
      "dipin",
      "jihad",
      "d&j",
      "dj",
      "ഓണർ",
      "ഉടമ",
      "ഉണ്ടാക്കിയത്",
      "ദിപിൻ",
      "ജിഹാദ്",
      "ആരാണിത്"
    ];

    if (ownerKeywords.some(keyword => keyword === "dj" ? /\bdj\b/i.test(q) : (q.includes(keyword.toLowerCase()) || query.includes(keyword)))) {
      setTimeout(() => {
        const botReply = "ശ്ശ്... 🤫 അവരുടെ പേരോ ഒരു ഒറ്റ അക്ഷരം പോലുമോ പുറത്തുപറയാൻ എനിക്ക് അനുവാദമില്ല! 🤐 പറഞ്ഞാൽ എന്റെ ശമ്പളം കട്ട് ആകും... അവർ 'Devil\'s Advocates' ആണ്! 😈 കൂടുതൽ ഒന്നും ചോദിക്കല്ലേ പ്ലീസ്! 😬";
        const easterEggHtml = `
          <div class="bot-message">
            <p style="margin:0 0 8px 0; line-height:1.5;">${botReply}</p>
            <a href="${getSafeLink('/about')}" class="about-btn" style="display:inline-block; margin-top:8px; padding:6px 12px; background:#15803d; color:#fff; border-radius:6px; text-decoration:none; font-size:13px;">
              ℹ️ ഞങ്ങളുടെ കഥ വായിക്കാം ↗
            </a>
          </div>
        `;
        appendBotMessage(easterEggHtml, false);
      }, 200);
      return;
    }

    // 3. Riddle / Joke keywords check to START riddle game
    const isRiddleQuery =
      q.includes("joke") ||
      q.includes("riddle") ||
      q.includes("kusruthi") ||
      q.includes("തമാശ") ||
      q.includes("കുസൃതി") ||
      q.includes("ചോദ്യം") ||
      q.includes("ചിരി") ||
      q.includes("കളി");

    if (isRiddleQuery) {
      setTimeout(() => {
        askRiddle();
      }, 200);
      return;
    }

    // 3. Categorize Query for Strict Urgent vs Non-Urgent distinction
    let category = "general";
    let botReply = "";

    // Emergency (STRICT: NEVER PLAYFUL)
    if (
      q.includes("911") ||
      q.includes("999") ||
      q.includes("997") ||
      q.includes("emergency") ||
      q.includes("police") ||
      q.includes("ambulance") ||
      q.includes("embassy") ||
      q.includes("എമർജൻസി") ||
      q.includes("പോലീസ്") ||
      q.includes("ആംബുലൻസ്") ||
      q.includes("എംബസി") ||
      q.includes("അപകടം")
    ) {
      category = "emergency";
      botReply = `
        🚨 <strong>സൗദി എമർജൻസി നമ്പറുകൾ (24/7 സൗജന്യം):</strong><br>
        • 📞 <strong>911</strong> — യൂണിഫൈഡ് എമർജൻസി (എല്ലാ അത്യാഹിതങ്ങൾക്കും)<br>
        • 🚑 <strong>997</strong> — റെഡ് ക്രസന്റ് ആംബുലൻസ്<br>
        • 🚓 <strong>999</strong> — പോലീസ്<br>
        • 🚒 <strong>998</strong> — സിവിൽ ഡിഫൻസ് (തീപിടുത്തം)<br>
        • 🏛️ <strong>800 247 1234</strong> — ഇന്ത്യൻ എംബസി ഹെൽപ്പ്‌ലൈൻ<br>
        <a href="${getSafeLink('/sahayi#emergency-helplines')}" class="digambaran-link-btn">🚨 മുഴുവൻ ഹെൽപ്പ്‌ലൈനുകളും ↗</a>
      `;
    }
    // Legal / Iqama / Qiwa / Labor / EOSB (STRICT: NEVER PLAYFUL)
    else if (
      q.includes("iqama") ||
      q.includes("qiwa") ||
      q.includes("huroob") ||
      q.includes("labor") ||
      q.includes("court") ||
      q.includes("fine") ||
      q.includes("absher") ||
      q.includes("gratuity") ||
      q.includes("eosb") ||
      q.includes("ഇഖാമ") ||
      q.includes("ഖിവ") ||
      q.includes("ഹുറൂബ്") ||
      q.includes("ലേബർ") ||
      q.includes("ഫൈൻ") ||
      q.includes("ഗ്രാറ്റുവിറ്റി") ||
      q.includes("നിയമം") ||
      q.includes("കേസ്")
    ) {
      category = "legal";
      botReply = `
        📄 <strong>ഇഖാമ, ഖിവ &amp; തൊഴിൽ നിയമ ഗൈഡ്:</strong><br>
        • അബ്ഷിർ ഇഖാമ വാലിഡിറ്റി പരിശോധന<br>
        • ഖിവ (Qiwa) സർവീസ് ട്രാൻസ്ഫർ &amp; കരാർ പരിശോധന<br>
        • ലേബർ കോർട്ട് കേസ് ഫയലിംഗ് &amp; സൗജന്യ ലീഗൽ എയ്ഡ്<br>
        • സൗദി തൊഴിൽ നിയമപ്രകാരമുള്ള സർവീസ് ആനുകൂല്യ (EOSB) കണക്കുകൂട്ടൽ<br>
        <a href="${getSafeLink('/sahayi#gratuity-calculator')}" class="digambaran-link-btn">💰 ഗ്രാറ്റുവിറ്റി കാൽക്കുലേറ്റർ ↗</a> 
        <a href="${getSafeLink('/sahayi#legal-and-courts')}" class="digambaran-link-btn" style="margin-left:6px;">⚖️ ലീഗൽ എയ്ഡ് ↗</a>
      `;
    }
    // Health / Polyclinics / Insurance / Banned Medicines (STRICT: NEVER PLAYFUL)
    else if (
      q.includes("health") ||
      q.includes("hospital") ||
      q.includes("clinic") ||
      q.includes("insurance") ||
      q.includes("chi") ||
      q.includes("medicine") ||
      q.includes("doctor") ||
      q.includes("ആരോഗ്യം") ||
      q.includes("ക്ലിനിക്ക്") ||
      q.includes("ഇൻഷുറൻസ്") ||
      q.includes("ഡോക്ടർ") ||
      q.includes("മരുന്ന്") ||
      q.includes("കസകസ്")
    ) {
      category = "medical";
      botReply = `
        🏥 <strong>ആരോഗ്യ സേവനങ്ങൾ &amp; ക്ലിനിക്കുകൾ:</strong><br>
        • CHI ഇൻഷുറൻസ് വാലിഡിറ്റി പരിശോധന<br>
        • സൗദിയിലെ 11 നഗരങ്ങളിലെ മലയാളി ഡോക്ടർമാരുള്ള പോളിക്ലിനിക്കുകൾ<br>
        • എയർപോർട്ടിൽ കൊണ്ടുവരാൻ പാടില്ലാത്ത നിരോധിത മരുന്നുകളുടെ ലിസ്റ്റ് (കസകസ്, ട്രമഡോൾ മുതലായവ)<br>
        <a href="${getSafeLink('/health')}" class="digambaran-link-btn">🏥 ആരോഗ്യ പോർട്ടലിലേക്ക് ↗</a>
      `;
    }
    // Saudi SIM Codes (NON-URGENT: CAN BE PLAYFUL)
    else if (
      q.includes("sim") ||
      q.includes("stc") ||
      q.includes("mobily") ||
      q.includes("zain") ||
      q.includes("virgin") ||
      q.includes("friendi") ||
      q.includes("lebara") ||
      q.includes("സിം") ||
      q.includes("കോഡ്")
    ) {
      category = "general";
      botReply = `
        📱 <strong>സൗദി സിം കാർഡ് ബാലൻസ് &amp; ഓഫർ കോഡുകൾ:</strong><br>
        STC, Mobily, Zain, Virgin, Friendi, Lebara എന്നീ 6 കമ്പനികളുടെയും ബാലൻസ്, ഡാറ്റ, നമ്പർ, റീചാർജ്, കസ്റ്റമർ കെയർ കോഡുകൾ ഒറ്റ ക്ലിക്കിൽ ഡയൽ ചെയ്യാം!<br>
        <a href="${getSafeLink('/health#sim-codes-section')}" class="digambaran-link-btn">📱 സിം കോഡുകൾ കാണുക ↗</a>
      `;
    }
    // Hotels & Kerala Food (NON-URGENT: CAN BE PLAYFUL)
    else if (
      q.includes("hotel") ||
      q.includes("food") ||
      q.includes("restaurant") ||
      q.includes("biriyani") ||
      q.includes("porotta") ||
      q.includes("meals") ||
      q.includes("മന്തി") ||
      q.includes("ഹോട്ടൽ") ||
      q.includes("ഭക്ഷണം") ||
      q.includes("ബിരിയാണി") ||
      q.includes("പൊറോട്ട") ||
      q.includes("ചായ") ||
      q.includes("തട്ടുകട")
    ) {
      category = "general";
      botReply = `
        🍲 <strong>മലയാളി ഹോട്ടലുകൾ &amp; നാടൻ ഭക്ഷണം:</strong><br>
        ജിദ്ദ, റിയാദ്, ദമ്മാം, മക്ക, മദീന, തായിഫ്, ഖോബാർ തുടങ്ങി 11 സൗദി നഗരങ്ങളിലെ <strong>174+ മലയാളി ഹോട്ടലുകളുടെ</strong> ലിസ്റ്റും ഗൂഗിൾ മാപ്പ് ലൊക്കേഷനുകളും ഫോൺ നമ്പറുകളും നമ്മുടെ സൈറ്റിലുണ്ട്!<br>
        <a href="${getSafeLink('/#hotels')}" class="digambaran-link-btn">🍲 മലയാളി ഹോട്ടലുകൾ കാണുക ↗</a>
      `;
    }
    // Hypermarket Offers (NON-URGENT: CAN BE PLAYFUL)
    else if (
      q.includes("offer") ||
      q.includes("lulu") ||
      q.includes("nesto") ||
      q.includes("panda") ||
      q.includes("grand") ||
      q.includes("flyer") ||
      q.includes("ഓഫർ") ||
      q.includes("ലുലു") ||
      q.includes("നെസ്റ്റോ") ||
      q.includes("പാണ്ട") ||
      q.includes("ഹൈപ്പർ")
    ) {
      category = "general";
      botReply = `
        🛍️ <strong>വാരാന്ത്യ ഹൈപ്പർമാർക്കറ്റ് ഓഫറുകൾ:</strong><br>
        ലുലു (LuLu), നെസ്റ്റോ (Nesto), പാണ്ട (Panda), ഗ്രാൻഡ് ഹൈപ്പർ എന്നിവയുടെ ഏറ്റവും പുതിയ വീക്ക്ലി ഓഫർ ഫ്ലയറുകൾ ഒറ്റ ക്ലിക്കിൽ കാണാം!<br>
        <a href="${getSafeLink('/#offers')}" class="digambaran-link-btn">🛍️ പുതിയ ഓഫർ ഫ്ലയറുകൾ ↗</a>
      `;
    }
    // Riyal & Gold Rates / Remittance (NON-URGENT: CAN BE PLAYFUL)
    else if (
      q.includes("riyal") ||
      q.includes("rate") ||
      q.includes("inr") ||
      q.includes("currency") ||
      q.includes("gold") ||
      q.includes("bank") ||
      q.includes("remittance") ||
      q.includes("iban") ||
      q.includes("സ്വർണ്ണം") ||
      q.includes("റിയാൽ") ||
      q.includes("രൂപ") ||
      q.includes("റേറ്റ്")
    ) {
      category = "general";
      botReply = `
        💱 <strong>തത്സമയ റിയാൽ &amp; സ്വർണ്ണ നിരക്കുകൾ:</strong><br>
        • ലൈവ് SAR ⇄ INR കൺവേർഷൻ കാൽക്കുലേറ്റർ<br>
        • 24K &amp; 22K തത്സമയ സൗദി സ്വർണ്ണവില<br>
        • 29 ബാങ്കുകളുടെ സൗജന്യ IBAN വാലിഡേറ്റർ<br>
        <a href="${getSafeLink('/#daily-desk')}" class="digambaran-link-btn">💱 ഡെയിലി ഡെസ്ക് കാണുക ↗</a>
      `;
    }
    // Movies & OTT (NON-URGENT: CAN BE PLAYFUL)
    else if (
      q.includes("movie") ||
      q.includes("cinema") ||
      q.includes("vox") ||
      q.includes("muvi") ||
      q.includes("ott") ||
      q.includes("film") ||
      q.includes("സിനിമ") ||
      q.includes("തിയേറ്റർ")
    ) {
      category = "general";
      botReply = `
        🎬 <strong>മലയാളം സിനിമകൾ &amp; OTT റിലീസുകൾ:</strong><br>
        സൗദിയിലെ VOX &amp; Muvi സിനിമാസ് ടിക്കറ്റ് ബുക്കിംഗും പുതിയ 12+ മലയാളം OTT റിലീസുകളുടെ ഒഫീഷ്യൽ സ്ട്രീമിംഗ് ലിങ്കുകളും എക്സ്പ്ലോർ പേജിൽ ലഭ്യമാണ്!<br>
        <a href="${getSafeLink('/explore?tab=cinema')}" class="digambaran-link-btn">🎬 സിനിമ &amp; OTT ഹബ്ബ് ↗</a>
      `;
    }
    // Travel, Train, Umrah (NON-URGENT: CAN BE PLAYFUL)
    else if (
      q.includes("travel") ||
      q.includes("flight") ||
      q.includes("train") ||
      q.includes("haramain") ||
      q.includes("bus") ||
      q.includes("saptco") ||
      q.includes("umrah") ||
      q.includes("nusuk") ||
      q.includes("യാത്ര") ||
      q.includes("ട്രെയിൻ") ||
      q.includes("ഹറമൈൻ") ||
      q.includes("ബസ്") ||
      q.includes("ഉംറ")
    ) {
      category = "general";
      botReply = `
        🚄 <strong>യാത്രാ വിവരങ്ങൾ &amp; ഹറമൈൻ ട്രെയിൻ:</strong><br>
        • മക്ക ⇄ മദീന ഹറമൈൻ ഹൈ-സ്പീഡ് ട്രെയിൻ ബുക്കിംഗ്<br>
        • ലൈവ് ഫ്ലൈറ്റ് സ്റ്റാറ്റസ് &amp; സൗദി എയർപോർട്ട് വിവരങ്ങൾ<br>
        • SAPTCO ഇന്റർസിറ്റി ബസ് സർവീസുകൾ<br>
        • നുസുക് (Nusuk) ഉംറ &amp; റൗദ പെർമിറ്റ് ഗൈഡ്<br>
        <a href="${getSafeLink('/travel')}" class="digambaran-link-btn">✈️ യാത്രാ ഹബ്ബിലേക്ക് ↗</a>
      `;
    }
    // Prayer & Calendar (NON-URGENT: CAN BE PLAYFUL)
    else if (
      q.includes("prayer") ||
      q.includes("namaz") ||
      q.includes("athan") ||
      q.includes("hijri") ||
      q.includes("calendar") ||
      q.includes("നമസ്കാരം") ||
      q.includes("ബാങ്ക്") ||
      q.includes("കലണ്ടർ") ||
      q.includes("ഹിജ്‌രി")
    ) {
      category = "general";
      botReply = `
        🕌 <strong>നമസ്കാര സമയവും കലണ്ടറും:</strong><br>
        സൗദിയിലെ 11 നഗരങ്ങളിലെ തത്സമയ നമസ്കാര സമയവും ഉമ്മുൽ ഖുറാ ഹിജ്‌രി - ഗ്രിഗോറിയൻ ഡേറ്റ് കൺവെർട്ടറും ലൈവായി ഉപയോഗിക്കാം!<br>
        <a href="${getSafeLink('/#prayer-times')}" class="digambaran-link-btn">🕌 നമസ്കാര സമയം കാണുക ↗</a>
      `;
    }
    // E-Library (NON-URGENT: CAN BE PLAYFUL)
    else if (
      q.includes("book") ||
      q.includes("library") ||
      q.includes("pdf") ||
      q.includes("വായിക്കാം") ||
      q.includes("പുസ്തകം") ||
      q.includes("നോവൽ") ||
      q.includes("കവിത")
    ) {
      category = "general";
      botReply = `
        📚 <strong>മലയാളം ഇ-ലൈബ്രറി (100 പുസ്തകങ്ങൾ):</strong><br>
        പബ്ലിക് ഡൊമൈൻ മലയാളം ക്ലാസിക്കുകളും 10 ഒറിജിനൽ പ്രവാസി ഗൈഡുകളും ഉൾപ്പെടുന്ന 100 പുസ്തകങ്ങളുടെ ഇ-ലൈബ്രറി സൗജന്യമായി വായിക്കാനും ലൈറ്റ്-മോഡ് PDF ആയി ഡൗൺലോഡ് ചെയ്യാനും ലഭ്യമാണ്!<br>
        <a href="${getSafeLink('/explore?tab=library')}" class="digambaran-link-btn">📚 ഇ-ലൈബ്രറി സന്ദർശിക്കുക ↗</a>
      `;
    }
    // Greetings & Who are you (NON-URGENT: CAN BE PLAYFUL)
    else if (
      q.includes("hi") ||
      q.includes("hello") ||
      q.includes("namaskaram") ||
      q.includes("ഹലോ") ||
      q.includes("നമസ്കാരം") ||
      q.includes("സുഖമാണോ") ||
      q.includes("ആരാണ്") ||
      q.includes("digambaran") ||
      q.includes("ദിഗംബരൻ") ||
      q.includes("who")
    ) {
      category = "general";
      botReply = `
        ഹലോ മച്ചാനെ! ഞാൻ <strong>ദിഗംബരൻ 🧙‍♂️</strong> — സൗദി മലയാളികളുടെ വിശ്വസ്ത സഹായി!<br>
        ഹോട്ടലുകൾ, റിയാൽ നിരക്ക്, ഓഫറുകൾ, ഇഖാമ, എമർജൻസി... പിന്നെ ബോറടിക്കുമ്പോൾ 50+ കുസൃതിച്ചോദ്യങ്ങളുടെ കളിയുമായി ഞാൻ കൂടെയുണ്ട്! എന്തിനാണ് സഹായം വേണ്ടത്?
      `;
    }
    // Default Fallback (NON-URGENT: CAN BE PLAYFUL)
    else {
      category = "general";
      botReply = `
        മച്ചാനെ, താങ്കൾ ചോദിച്ചതിന് കൃത്യമായ ഉത്തരം തരാൻ ഞാൻ ശ്രമിക്കാം! താഴെയുള്ള പ്രധാന വിഷയങ്ങളിൽ ഏതാണ് താങ്കൾക്ക് അറിയേണ്ടത്?
      `;
    }

    // Occasional Playful Trigger Check
    let shouldTriggerPlayful = false;
    if (category === "general") {
      nonUrgentChatCount++;
      if (nonUrgentChatCount % 3 === 0 || Math.random() < 0.35) {
        shouldTriggerPlayful = true;
      }
    }

    setTimeout(() => {
      appendBotMessage(botReply, shouldTriggerPlayful);
    }, 250);
  }

  // Bind Event Listeners
  function bindEvents() {
    const floatBtn = document.getElementById("digambaran-float-btn");
    const speechBubble = document.getElementById("digambaran-speech-bubble");
    const bubbleClose = document.getElementById("diga-bubble-close");
    const backdrop = document.getElementById("digambaran-backdrop");
    const btnClose = document.getElementById("digambaran-btn-close");
    const btnClear = document.getElementById("digambaran-btn-clear");
    const form = document.getElementById("digambaran-form");
    const input = document.getElementById("digambaran-input");
    const chipsContainer = document.getElementById("digambaran-chips");
    const messages = document.getElementById("digambaran-messages");

    // Speech bubble click & dismiss listeners
    if (speechBubble) {
      speechBubble.addEventListener("click", (e) => {
        if (e.target.closest("#diga-bubble-close")) return;
        hideSpeechBubble();
        openDigambaran();
      });
    }

    if (bubbleClose) {
      bubbleClose.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        dismissSpeechBubblePermanently();
      });
    }

    if (floatBtn) {
      floatBtn.addEventListener("click", () => {
        if (isModalOpen) closeDigambaran();
        else openDigambaran();
      });
    }

    if (backdrop) backdrop.addEventListener("click", closeDigambaran);
    if (btnClose) btnClose.addEventListener("click", closeDigambaran);

    if (btnClear) {
      btnClear.addEventListener("click", () => {
        currentActiveRiddle = null;
        gameScore = 0;
        gameTotal = 0;
        if (messages) {
          messages.innerHTML = `
            <div class="digambaran-msg bot">
              <div class="digambaran-msg-avatar">${MASCOT_SVG}</div>
              <div class="digambaran-bubble">
                <strong>ചാറ്റ് റീസെറ്റ് ചെയ്തു മച്ചാനെ! 🧙‍♂️</strong><br>
                സൗദി ഹോട്ടലുകൾ, റിയാൽ നിരക്ക്, ഓഫറുകൾ, ഇഖാമ, എമർജൻസി അല്ലെങ്കിൽ ഒരു കുസൃതിച്ചോദ്യം... എന്ത് വേണമെങ്കിലും ചോദിച്ചോളൂ!
              </div>
            </div>
          `;
        }
      });
    }

    if (form && input) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const val = input.value.trim();
        if (!val) return;
        input.value = "";
        processUserQuery(val);
      });
    }

    if (chipsContainer) {
      chipsContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".digambaran-chip");
        if (!btn) return;
        const q = btn.getAttribute("data-query");
        if (q) {
          processUserQuery(q);
        }
      });
    }

    // Event delegation for game actions in messages container
    if (messages) {
      messages.addEventListener("click", (e) => {
        // Option selection
        const optBtn = e.target.closest(".riddle-opt-btn");
        if (optBtn) {
          const isCorrect = optBtn.getAttribute("data-correct") === "true";
          const riddleId = Number(optBtn.getAttribute("data-riddle-id"));
          const riddle = KUSRUTHI_RIDDLES.find(r => r.id === riddleId);
          handleRiddleGuess(isCorrect, riddle);
          return;
        }

        // Next Question
        const nextBtn = e.target.closest(".btn-game-next");
        if (nextBtn) {
          askRiddle();
          return;
        }

        // Stop Game
        const stopBtn = e.target.closest(".btn-game-stop");
        if (stopBtn) {
          stopRiddleGame();
          return;
        }
      });
    }

    // Keyboard ESC to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isModalOpen) {
        closeDigambaran();
      }
    });
  }

  // Public API
  window.Digambaran = {
    open: openDigambaran,
    close: closeDigambaran,
    askRiddle: askRiddle,
    stopGame: stopRiddleGame,
    riddles: KUSRUTHI_RIDDLES
  };
  window.openDigambaran = openDigambaran;
  window.askDigambaranRiddle = function () {
    openDigambaran();
    setTimeout(() => {
      askRiddle();
    }, 350);
  };

  // Auto-init on DOM Ready
  function init() {
    injectStyles();
    injectDigambaranDOM();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
