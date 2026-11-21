/**
 * KSA Malayali Hub — 3-Language Worker Voice Translator
 * Supporting:
 *   1) 🇸🇦 Malayalam ⇄ Arabic (ml-IN ⇄ ar-SA)
 *   2) 🇬🇧 Malayalam ⇄ English (ml-IN ⇄ en-US)
 *   3) 🇮🇳 Malayalam ⇄ Hindi   (ml-IN ⇄ hi-IN)
 *
 * Features:
 *   - 1-Tap Language Pair Selector
 *   - 1-Tap Bidirectional Swap (⇄ ദിശ മാറ്റുക)
 *   - 1-Tap Clear (🗑️ ക്ലിയർ)
 *   - Voice SpeechRecognition in all 4 languages (ml-IN, ar-SA, en-US, hi-IN)
 *   - SpeechSynthesis Voice Playback in source & target languages
 *   - MyMemory API Translation Engine + Direct Google Translate 1-Tap Fallback
 *   - Scoped for touch-friendly mobile use (≥44px buttons, clear Malayalam labels)
 */

(function () {
  "use strict";

  const PAIR_CONFIGS = {
    "ml-ar": {
      id: "ml-ar",
      title: "🇸🇦 മലയാളം ⇄ അറബിക്",
      lang1: {
        code: "ml",
        bcp47: "ml-IN",
        nameMl: "മലയാളം",
        nameEn: "Malayalam",
        dir: "ltr",
        placeholder: "ഇവിടെ മലയാളത്തിൽ സംസാരിക്കുക അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യുക...",
        speakLabel: "🔊 മലയാളം കേൾക്കുക"
      },
      lang2: {
        code: "ar",
        bcp47: "ar-SA",
        nameMl: "അറബിക്",
        nameEn: "Arabic",
        dir: "rtl",
        placeholder: "اكتب بالعربية أو تحدث هنا... (അറബിയിൽ ടൈപ്പ് ചെയ്യുക)",
        speakLabel: "🔊 അറബിക് കേൾപ്പിക്കുക"
      },
      chips1to2: [
        { src: "എനിക്ക് അടിയന്തിര ചികിത്സ വേണം", tgt: "أحتاج إلى علاج طارئ فوراً" },
        { src: "എനിക്ക് നെഞ്ചുവേദനയുണ്ട്, സഹായിക്കൂ", tgt: "أعاني من ألم في الصدر، يرجى مساعدتي" },
        { src: "എന്റെ ഇഖാമ കാലാവധി കഴിഞ്ഞതാണ്", tgt: "إقامتي منتهية الصلاحية" },
        { src: "എനിക്ക് ഡോക്ടറെ കാണണം", tgt: "أريد مقابلة الطبيب" },
        { src: "ഇതിന്റെ വില എത്രയാണ്?", tgt: "كم سعر هذا؟" },
        { src: "എന്റെ ശമ്പളം ലഭിച്ചിട്ടില്ല", tgt: "لم أستلم راتبي" }
      ],
      chips2to1: [
        { src: "أين جواز سفرك؟", tgt: "നിങ്ങളുടെ പാസ്‌പോർട്ട് എവിടെയാണ്?" },
        { src: "ما هي المشكلة الصحية التي تعاني منها؟", tgt: "നിങ്ങൾക്ക് എന്ത് ആരോഗ്യ പ്രശ്നമാണുള്ളത്?" },
        { src: "هل لديك تأمين صحي ساري المفعول؟", tgt: "നിങ്ങൾക്ക് സാധുവായ ആരോഗ്യ ഇൻഷുറൻസ് ഉണ്ടോ?" },
        { src: "خذ هذا الدواء مرتين في اليوم بعد الأكل", tgt: "ഈ മരുന്ന് ദിവസവും രണ്ട് നേരം ഭക്ഷണത്തിന് ശേഷം കഴിക്കുക" }
      ]
    },
    "ml-en": {
      id: "ml-en",
      title: "🇬🇧 മലയാളം ⇄ ഇംഗ്ലീഷ്",
      lang1: {
        code: "ml",
        bcp47: "ml-IN",
        nameMl: "മലയാളം",
        nameEn: "Malayalam",
        dir: "ltr",
        placeholder: "ഇവിടെ മലയാളത്തിൽ സംസാരിക്കുക അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യുക...",
        speakLabel: "🔊 മലയാളം കേൾക്കുക"
      },
      lang2: {
        code: "en",
        bcp47: "en-US",
        nameMl: "ഇംഗ്ലീഷ്",
        nameEn: "English",
        dir: "ltr",
        placeholder: "Type or speak in English here...",
        speakLabel: "🔊 ഇംഗ്ലീഷ് കേൾപ്പിക്കുക"
      },
      chips1to2: [
        { src: "എനിക്ക് അടിയന്തിരമായി ഡോക്ടറെ കാണണം", tgt: "I need to see a doctor urgently" },
        { src: "എന്റെ പാസ്‌പോർട്ടും ഇഖാമയും ഇതാ", tgt: "Here is my passport and Iqama" },
        { src: "ഫ്ലൈറ്റ് പുറപ്പെടുന്നത് എപ്പോഴാണ്?", tgt: "What time does the flight depart?" },
        { src: "എന്റെ ലഗേജ് നഷ്ടപ്പെട്ടു", tgt: "My baggage is missing" },
        { src: "എനിക്ക് ഈ അഡ്രസ്സിലേക്ക് പോകണം", tgt: "I need to go to this address" }
      ],
      chips2to1: [
        { src: "Please show your identity proof", tgt: "ദയവായി നിങ്ങളുടെ തിരിച്ചറിയൽ രേഖ കാണിക്കുക" },
        { src: "Do you have medical insurance?", tgt: "നിങ്ങൾക്ക് മെഡിക്കൽ ഇൻഷുറൻസ് ഉണ്ടോ?" },
        { src: "Take this tablet after dinner", tgt: "ഈ ഗുളിക അത്താഴത്തിന് ശേഷം കഴിക്കുക" },
        { src: "Proceed to Gate Number 5", tgt: "ഗേറ്റ് നമ്പർ 5-ലേക്ക് പോവുക" }
      ]
    },
    "ml-hi": {
      id: "ml-hi",
      title: "🇮🇳 മലയാളം ⇄ ഹിന്ദി",
      lang1: {
        code: "ml",
        bcp47: "ml-IN",
        nameMl: "മലയാളം",
        nameEn: "Malayalam",
        dir: "ltr",
        placeholder: "ഇവിടെ മലയാളത്തിൽ സംസാരിക്കുക അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യുക...",
        speakLabel: "🔊 മലയാളം കേൾക്കുക"
      },
      lang2: {
        code: "hi",
        bcp47: "hi-IN",
        nameMl: "ഹിന്ദി",
        nameEn: "Hindi",
        dir: "ltr",
        placeholder: "यहाँ हिंदी में टाइप करें या बोलें... (ഹിന്ദിയിൽ ടൈപ്പ് ചെയ്യുക)",
        speakLabel: "🔊 ഹിന്ദി കേൾപ്പിക്കുക"
      },
      chips1to2: [
        { src: "സുഖമാണോ ഭായ്?", tgt: "कैसा है भाई? सब ठीक है?" },
        { src: "ജോലി സമയം എപ്പോഴാണ്?", tgt: "काम का समय कब है?" },
        { src: "റൂമിൽ കുടിവെള്ളമില്ല", tgt: "कमरे में पीने का पानी नहीं है" },
        { src: "ശമ്പളം എപ്പോൾ ലഭിക്കും?", tgt: "सैलरी कब मिलेगी?" },
        { src: "ഭക്ഷണം കഴിച്ചോ ഭായ്?", tgt: "खाना खाया भाई?" },
        { src: "എനിക്ക് സുഖമില്ല, ഇന്ന് വരാൻ കഴിയില്ല", tgt: "मेरी तबीयत ठीक नहीं है, आज नहीं आ पाऊंगा" }
      ],
      chips2to1: [
        { src: "क्या हाल है भाई सब ठीक?", tgt: "എന്തൊക്കെയുണ്ട് വിശേഷം ഭായ്?" },
        { src: "कल सुबह 7 बजे काम पर आना है", tgt: "നാളെ രാവിലെ 7 മണിക്ക് ജോലിക്ക് വരണം" },
        { src: "अपना इकामा हमेशा साथ रखो", tgt: "നിങ്ങളുടെ ഇഖാമ എപ്പോഴും കൂടെ കരുതുക" },
        { src: "चलो खाना खाने चलते हैं", tgt: "വരൂ ഭക്ഷണം കഴിക്കാൻ പോകാം" }
      ]
    }
  };

  function initTranslatorWidget(container) {
    let currentPairKey = "ml-ar";
    let isReversed = false; // false: lang1 -> lang2, true: lang2 -> lang1
    let isListening = false;
    let recognition = null;

    // Elements
    const pairBtns = container.querySelectorAll(".trans-pair-pill");
    const srcBadge = container.querySelector("#trans-src-badge");
    const tgtBadge = container.querySelector("#trans-tgt-badge");
    const btnSwap = container.querySelector("#trans-btn-swap");
    const btnClear = container.querySelector("#trans-btn-clear");

    const inputArea = container.querySelector("#trans-input-text");
    const outputArea = container.querySelector("#trans-output-text");
    const inputHeadLabel = container.querySelector("#trans-input-label");
    const outputHeadLabel = container.querySelector("#trans-output-label");

    const btnMic = container.querySelector("#trans-btn-mic");
    const micStatus = container.querySelector("#trans-mic-status");
    const btnTranslate = container.querySelector("#trans-btn-submit");
    const btnSpeakSource = container.querySelector("#trans-btn-speak-source");
    const btnSpeakTarget = container.querySelector("#trans-btn-speak-target");
    const btnCopy = container.querySelector("#trans-btn-copy");
    const btnGoogleFallback = container.querySelector("#trans-btn-google");
    const chipsContainer = container.querySelector("#trans-quick-chips");
    const loadingSpinner = container.querySelector("#trans-loading");

    // Legacy buttons support
    const legacyMlAr = container.querySelector("#mode-ml-to-ar");
    const legacyArMl = container.querySelector("#mode-ar-to-ml");

    function getActiveSource() {
      const pair = PAIR_CONFIGS[currentPairKey];
      return isReversed ? pair.lang2 : pair.lang1;
    }

    function getActiveTarget() {
      const pair = PAIR_CONFIGS[currentPairKey];
      return isReversed ? pair.lang1 : pair.lang2;
    }

    // 1. Setup Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          isListening = true;
          if (btnMic) btnMic.classList.add("is-recording");
          if (micStatus) {
            const src = getActiveSource();
            micStatus.innerHTML = `<span class="rec-dot"></span> സംസാരിക്കൂ (${src.nameMl}), ശ്രദ്ധിക്കുന്നുണ്ട്... (Listening)`;
          }
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          if (inputArea) {
            inputArea.value = transcript;
          }
          translateCurrentText();
        };

        recognition.onerror = (event) => {
          console.warn("[VoiceTranslator] Speech error:", event.error);
          stopListening();
          if (micStatus) {
            micStatus.innerHTML = `⚠️ മൈക്രോഫോൺ പ്രശ്നം (${event.error}). ടൈപ്പ് ചെയ്യുകയോ താഴെയുള്ള ഗൂഗിൾ ട്രാൻസ്‌ലേറ്റർ ബട്ടൺ ഉപയോഗിക്കുകയോ ചെയ്യാം.`;
          }
        };

        recognition.onend = () => {
          stopListening();
        };
      } catch (err) {
        console.warn("[VoiceTranslator] Init recognition failed:", err);
      }
    } else {
      if (btnMic) {
        btnMic.title = "ഈ ബ്രൗസറിൽ സ്പീച്ച് റെക്കഗ്നിഷൻ ലഭ്യമല്ല. ടൈപ്പ് ചെയ്ത് വിവർത്തനം ചെയ്യാം.";
      }
      if (micStatus) {
        micStatus.innerHTML = `💡 മൈക്രോഫോൺ ലഭ്യമല്ലെങ്കിൽ ബോക്സിൽ ടൈപ്പ് ചെയ്ത് വിവർത്തനം ചെയ്യാം.`;
      }
    }

    function startListening() {
      if (!recognition) {
        showToast("ഈ ബ്രൗസറിൽ വോയ്സ് റെക്കഗ്നിഷൻ ലഭ്യമല്ല. ടൈപ്പ് ചെയ്യുക.");
        return;
      }
      try {
        const src = getActiveSource();
        recognition.lang = src.bcp47;
        recognition.start();
      } catch (e) {
        console.warn("[VoiceTranslator] recognition start error:", e);
      }
    }

    function stopListening() {
      isListening = false;
      if (btnMic) btnMic.classList.remove("is-recording");
      if (micStatus && (!inputArea || !inputArea.value.trim())) {
        const src = getActiveSource();
        micStatus.innerHTML = `മൈക്രോഫോൺ അമർത്തി സംസാരിക്കുക (${src.nameMl} · Tap Mic to Speak)`;
      }
      try {
        if (recognition) recognition.stop();
      } catch (e) {}
    }

    if (btnMic) {
      btnMic.addEventListener("click", () => {
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      });
    }

    // 2. UI Refresh on State Change
    function updateUIState() {
      const src = getActiveSource();
      const tgt = getActiveTarget();

      // Pair pills active class
      pairBtns.forEach(btn => {
        const pair = btn.getAttribute("data-pair");
        btn.classList.toggle("active", pair === currentPairKey);
      });

      // Direction badge
      if (srcBadge) srcBadge.textContent = src.nameMl;
      if (tgtBadge) tgtBadge.textContent = tgt.nameMl;

      // Box headers
      if (inputHeadLabel) {
        inputHeadLabel.innerHTML = `നിങ്ങൾ പറയുന്നത് (<strong style="color:var(--brand);">${src.nameMl}</strong>):`;
      }
      if (outputHeadLabel) {
        outputHeadLabel.innerHTML = `വിവർത്തനം (<strong style="color:var(--gold);">${tgt.nameMl}</strong>):`;
      }

      // Input placeholder & dir
      if (inputArea) {
        inputArea.setAttribute("placeholder", src.placeholder);
        inputArea.setAttribute("dir", src.dir);
      }

      // Output dir
      if (outputArea) {
        outputArea.setAttribute("dir", tgt.dir);
      }

      // Mic status hint
      if (micStatus && (!inputArea || !inputArea.value.trim())) {
        micStatus.innerHTML = `മൈക്രോഫോൺ അമർത്തി സംസാരിക്കുക (${src.nameMl} · Tap Mic to Speak)`;
      }

      // Speak Target Button Label
      if (btnSpeakTarget) {
        btnSpeakTarget.textContent = tgt.speakLabel || `🔊 ${tgt.nameMl} കേൾപ്പിക്കുക`;
      }

      // Legacy buttons sync
      if (legacyMlAr && legacyArMl) {
        if (currentPairKey === "ml-ar") {
          legacyMlAr.classList.toggle("active", !isReversed);
          legacyArMl.classList.toggle("active", isReversed);
        }
      }

      renderQuickChips();
      updateGoogleFallbackLink();
    }

    function setLanguagePair(pairKey) {
      if (!PAIR_CONFIGS[pairKey]) return;
      currentPairKey = pairKey;
      isReversed = false;
      stopListening();
      updateUIState();
    }

    function swapDirection() {
      stopListening();
      isReversed = !isReversed;

      // Swap existing input & output values if available
      if (inputArea && outputArea) {
        const currentIn = inputArea.value.trim();
        const resEl = outputArea.querySelector(".trans-result-text");
        const currentOut = resEl ? resEl.textContent.trim() : "";

        if (currentOut) {
          inputArea.value = currentOut;
          outputArea.innerHTML = `<span class="trans-result-text">${escapeHtml(currentIn)}</span>`;
        }
      }

      updateUIState();
      showToast(`ദിശ മാറ്റി: ${getActiveSource().nameMl} ➔ ${getActiveTarget().nameMl}`);
    }

    function clearAll() {
      stopListening();
      if (inputArea) inputArea.value = "";
      if (outputArea) {
        outputArea.innerHTML = `<span class="trans-placeholder">വിവർത്തനം ഇവിടെ തെളിയും...</span>`;
      }
      if (btnSpeakTarget) btnSpeakTarget.disabled = true;
      if (btnCopy) btnCopy.disabled = true;
      updateGoogleFallbackLink();
      const src = getActiveSource();
      if (micStatus) {
        micStatus.innerHTML = `മൈക്രോഫോൺ അമർത്തി സംസാരിക്കുക (${src.nameMl} · Tap Mic to Speak)`;
      }
    }

    // Attach pair button listeners
    pairBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const pair = btn.getAttribute("data-pair");
        setLanguagePair(pair);
      });
    });

    if (btnSwap) btnSwap.addEventListener("click", swapDirection);
    if (btnClear) btnClear.addEventListener("click", clearAll);

    // Legacy mode listeners
    if (legacyMlAr) {
      legacyMlAr.addEventListener("click", () => {
        currentPairKey = "ml-ar";
        isReversed = false;
        updateUIState();
      });
    }
    if (legacyArMl) {
      legacyArMl.addEventListener("click", () => {
        currentPairKey = "ml-ar";
        isReversed = true;
        updateUIState();
      });
    }

    // 3. Quick Chips
    function renderQuickChips() {
      if (!chipsContainer) return;
      const pair = PAIR_CONFIGS[currentPairKey];
      const list = isReversed ? pair.chips2to1 : pair.chips1to2;

      chipsContainer.innerHTML = list.map(item => `
        <button type="button" class="trans-chip" data-phrase="${encodeURIComponent(item.src)}" data-target="${encodeURIComponent(item.tgt)}">
          <span>💬 ${item.src}</span>
        </button>
      `).join("");

      chipsContainer.querySelectorAll(".trans-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          const phrase = decodeURIComponent(chip.getAttribute("data-phrase"));
          const target = decodeURIComponent(chip.getAttribute("data-target"));
          if (inputArea) inputArea.value = phrase;
          if (outputArea && target) {
            outputArea.innerHTML = `<span class="trans-result-text">${escapeHtml(target)}</span>`;
            if (btnSpeakTarget) btnSpeakTarget.disabled = false;
            if (btnCopy) btnCopy.disabled = false;
            updateGoogleFallbackLink();
          } else {
            translateCurrentText();
          }
        });
      });
    }

    // 4. Translation Logic (MyMemory API + Fallback)
    async function translateCurrentText() {
      const text = (inputArea ? inputArea.value : "").trim();
      if (!text) {
        if (outputArea) outputArea.innerHTML = `<span class="trans-placeholder">വിവർത്തനം ഇവിടെ തെളിയും...</span>`;
        if (btnSpeakTarget) btnSpeakTarget.disabled = true;
        if (btnCopy) btnCopy.disabled = true;
        return;
      }

      if (loadingSpinner) loadingSpinner.style.display = "inline-flex";
      if (outputArea) outputArea.innerHTML = `<span class="trans-loading-text">🔄 വിവർത്തനം ചെയ്യുന്നു...</span>`;

      const src = getActiveSource();
      const tgt = getActiveTarget();

      updateGoogleFallbackLink();

      // Check quick phrases cache first for lightning fast instant response
      const pair = PAIR_CONFIGS[currentPairKey];
      const list = isReversed ? pair.chips2to1 : pair.chips1to2;
      const match = list.find(p => p.src === text);
      if (match) {
        if (outputArea) {
          outputArea.innerHTML = `<span class="trans-result-text">${escapeHtml(match.tgt)}</span>`;
        }
        if (btnSpeakTarget) btnSpeakTarget.disabled = false;
        if (btnCopy) btnCopy.disabled = false;
        if (loadingSpinner) loadingSpinner.style.display = "none";
        return;
      }

      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src.code}|${tgt.code}`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        let translated = data && data.responseData ? data.responseData.translatedText : "";

        // Check for MyMemory warning/empty responses
        if (!translated || translated.includes("MYMEMORY WARNING")) {
          throw new Error("MyMemory quota or low confidence");
        }

        if (outputArea) {
          outputArea.innerHTML = `<span class="trans-result-text">${escapeHtml(translated)}</span>`;
        }

        if (btnSpeakTarget) btnSpeakTarget.disabled = false;
        if (btnCopy) btnCopy.disabled = false;

      } catch (err) {
        console.warn("[VoiceTranslator] Translation API error:", err);
        if (outputArea) {
          outputArea.innerHTML = `
            <div class="trans-fallback-box">
              <p>⚠️ ഓൺലൈൻ ട്രാൻസ്‌ലേറ്റർ കണക്ഷൻ കിട്ടിയില്ല. താഴെയുള്ള ബട്ടൺ അമർത്തി ഗൂഗിൾ ട്രാൻസ്‌ലേറ്ററിൽ നേരിട്ട് തുറക്കാം:</p>
              <a href="${getGoogleTranslateUrl(text, src.code, tgt.code)}" target="_blank" rel="noopener noreferrer" class="btn-open-google-direct">
                🌐 Google Translate-ൽ കാണുക ➔
              </a>
            </div>
          `;
        }
      } finally {
        if (loadingSpinner) loadingSpinner.style.display = "none";
      }
    }

    if (btnTranslate) {
      btnTranslate.addEventListener("click", translateCurrentText);
    }

    // 5. Google Translate Fallback URL Helper
    function getGoogleTranslateUrl(text, fromCode, toCode) {
      return `https://translate.google.com/?sl=${fromCode}&tl=${toCode}&text=${encodeURIComponent(text)}&op=translate`;
    }

    function updateGoogleFallbackLink() {
      if (!btnGoogleFallback) return;
      const src = getActiveSource();
      const tgt = getActiveTarget();
      const text = (inputArea ? inputArea.value : "").trim() || (src.code === "ml" ? "സഹായം" : "help");
      btnGoogleFallback.href = getGoogleTranslateUrl(text, src.code, tgt.code);
    }

    if (inputArea) {
      inputArea.addEventListener("input", updateGoogleFallbackLink);
      inputArea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          translateCurrentText();
        }
      });
    }

    // 6. Speech Synthesis (Audio Output)
    function speakText(text, bcp47Code) {
      if (!window.speechSynthesis) {
        showToast("സ്പീച്ച് ഓഡിയോ ഈ ഫോണിൽ ലഭ്യമല്ല.");
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = bcp47Code;
      utterance.rate = 0.9; // Clear pace for workers
      window.speechSynthesis.speak(utterance);
    }

    if (btnSpeakTarget) {
      btnSpeakTarget.addEventListener("click", () => {
        const resEl = outputArea ? outputArea.querySelector(".trans-result-text") : null;
        const text = resEl ? resEl.textContent : "";
        if (!text) return;
        const tgt = getActiveTarget();
        speakText(text, tgt.bcp47);
      });
    }

    if (btnSpeakSource) {
      btnSpeakSource.addEventListener("click", () => {
        const text = (inputArea ? inputArea.value : "").trim();
        if (!text) return;
        const src = getActiveSource();
        speakText(text, src.bcp47);
      });
    }

    // 7. Copy Translated Text
    if (btnCopy) {
      btnCopy.addEventListener("click", () => {
        const resEl = outputArea ? outputArea.querySelector(".trans-result-text") : null;
        const text = resEl ? resEl.textContent : "";
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
          showToast("✅ കോപ്പി ചെയ്തു (Copied to Clipboard)");
        }).catch(() => {
          showToast("കോപ്പി ചെയ്യാൻ കഴിഞ്ഞില്ല");
        });
      });
    }

    // Initial setup
    updateUIState();
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showToast(msg) {
    const existing = document.getElementById("pwa-toast");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.id = "pwa-toast";
    toast.className = "pwa-toast show";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function init() {
    const widgets = document.querySelectorAll(".voice-translator-box");
    widgets.forEach(w => initTranslatorWidget(w));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
