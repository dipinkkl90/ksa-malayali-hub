/**
 * KSA Malayali Hub — Malayalam ↔ Arabic Voice Translator
 * Large-button touch-friendly voice interface designed for Saudi Pravasi workers.
 * Uses Web Speech API (Recognition & Synthesis) + MyMemory API + 1-Tap Google Translate fallback.
 */

(function () {
  "use strict";

  const QUICK_PHRASES_ML_TO_AR = [
    { ml: "എനിക്ക് അടിയന്തിര ചികിത്സ വേണം", ar: "أحتاج إلى علاج طارئ فوراً" },
    { ml: "എനിക്ക് നെഞ്ചുവേദനയുണ്ട്, ദയവായി സഹായിക്കൂ", ar: "أعاني من ألم في الصدر، يرجى مساعدتي" },
    { ml: "എന്റെ ശമ്പളം ലഭിച്ചിട്ടില്ല, കരാർ ലംഘനമാണ്", ar: "لم أستلم راتبي، وهذا مخالف لعقد العمل" },
    { ml: "എന്റെ ഇഖാമ കാലാവധി കഴിഞ്ഞതാണ്", ar: "إقامتي منتهية الصلاحية" },
    { ml: "ദയവായി എനിക്ക് അംബുലൻസ് വിളിക്കൂ", ar: "يرجى الاتصال بالإسعاف من فضلي" },
    { ml: "എനിക്ക് ഡോക്ടറെ കാണണം", ar: "أريد مقابلة الطبيب" }
  ];

  const QUICK_PHRASES_AR_TO_ML = [
    { ar: "أين جواز سفرك؟", ml: "നിങ്ങളുടെ പാസ്‌പോർട്ട് എവിടെയാണ്?" },
    { ar: "ما هي المشكلة الصحية التي تعاني منها؟", ml: "നിങ്ങൾക്ക് എന്ത് ആരോഗ്യ പ്രശ്നമാണുള്ളത്?" },
    { ar: "هل لديك تأمين صحي ساري المفعول؟", ml: "നിങ്ങൾക്ക് സാധുവായ ആരോഗ്യ ഇൻഷുറൻസ് ഉണ്ടോ?" },
    { ar: "خذ هذا الدواء مرتين في اليوم بعد الأكل", ml: "ഈ മരുന്ന് ദിവസവും രണ്ട് നേരം ഭക്ഷണത്തിന് ശേഷം കഴിക്കുക" }
  ];

  function initTranslatorWidget(container) {
    let mode = "ml-to-ar"; // or "ar-to-ml"
    let isListening = false;
    let recognition = null;

    const btnModeMlAr = container.querySelector("#mode-ml-to-ar");
    const btnModeArMl = container.querySelector("#mode-ar-to-ml");
    const inputArea = container.querySelector("#trans-input-text");
    const outputArea = container.querySelector("#trans-output-text");
    const btnMic = container.querySelector("#trans-btn-mic");
    const micStatus = container.querySelector("#trans-mic-status");
    const btnTranslate = container.querySelector("#trans-btn-submit");
    const btnSpeakSource = container.querySelector("#trans-btn-speak-source");
    const btnSpeakTarget = container.querySelector("#trans-btn-speak-target");
    const btnCopy = container.querySelector("#trans-btn-copy");
    const btnGoogleFallback = container.querySelector("#trans-btn-google");
    const chipsContainer = container.querySelector("#trans-quick-chips");
    const loadingSpinner = container.querySelector("#trans-loading");

    // 1. Setup Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        isListening = true;
        btnMic.classList.add("is-recording");
        if (micStatus) {
          micStatus.innerHTML = `<span class="rec-dot"></span> സംസാരിക്കൂ, ശ്രദ്ധിക്കുന്നുണ്ട്... (Listening)`;
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
        recognition.lang = mode === "ml-to-ar" ? "ml-IN" : "ar-SA";
        recognition.start();
      } catch (e) {
        console.warn("[VoiceTranslator] recognition start error:", e);
      }
    }

    function stopListening() {
      isListening = false;
      if (btnMic) btnMic.classList.remove("is-recording");
      if (micStatus && (!inputArea || !inputArea.value.trim())) {
        micStatus.innerHTML = `മൈക്രോഫോൺ അമർത്തി സംസാരിക്കുക (Tap Mic to Speak)`;
      }
      try {
        if (recognition) recognition.stop();
      } catch (e) {}
    }

    // Toggle Mic
    if (btnMic) {
      btnMic.addEventListener("click", () => {
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      });
    }

    // 2. Mode Switching
    function setMode(newMode) {
      mode = newMode;
      stopListening();

      if (mode === "ml-to-ar") {
        btnModeMlAr.classList.add("active");
        btnModeArMl.classList.remove("active");
        inputArea.setAttribute("placeholder", "ഇവിടെ മലയാളത്തിൽ ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ സംസാരിക്കുക...");
        inputArea.setAttribute("dir", "ltr");
        outputArea.setAttribute("dir", "rtl");
      } else {
        btnModeArMl.classList.add("active");
        btnModeMlAr.classList.remove("active");
        inputArea.setAttribute("placeholder", "اكتب بالعربية أو تحدث هنا... (അറബിയിൽ ടൈപ്പ് ചെയ്യുക)");
        inputArea.setAttribute("dir", "rtl");
        outputArea.setAttribute("dir", "ltr");
      }

      renderQuickChips();
      updateGoogleFallbackLink();
    }

    if (btnModeMlAr) btnModeMlAr.addEventListener("click", () => setMode("ml-to-ar"));
    if (btnModeArMl) btnModeArMl.addEventListener("click", () => setMode("ar-to-ml"));

    // 3. Quick Chips
    function renderQuickChips() {
      if (!chipsContainer) return;
      const list = mode === "ml-to-ar" ? QUICK_PHRASES_ML_TO_AR : QUICK_PHRASES_AR_TO_ML;
      chipsContainer.innerHTML = list.map(item => `
        <button type="button" class="trans-chip" data-phrase="${encodeURIComponent(mode === "ml-to-ar" ? item.ml : item.ar)}">
          <span>💬 ${mode === "ml-to-ar" ? item.ml : item.ar}</span>
        </button>
      `).join("");

      chipsContainer.querySelectorAll(".trans-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          const phrase = decodeURIComponent(chip.getAttribute("data-phrase"));
          if (inputArea) inputArea.value = phrase;
          translateCurrentText();
        });
      });
    }

    // 4. Translation Logic (MyMemory API)
    async function translateCurrentText() {
      const text = (inputArea ? inputArea.value : "").trim();
      if (!text) {
        if (outputArea) outputArea.innerHTML = `<span class="trans-placeholder">വിവർത്തനം ഇവിടെ തെളിയും...</span>`;
        return;
      }

      if (loadingSpinner) loadingSpinner.style.display = "inline-flex";
      if (outputArea) outputArea.innerHTML = `<span class="trans-loading-text">🔄 വിവർത്തനം ചെയ്യുന്നു...</span>`;

      const fromLang = mode === "ml-to-ar" ? "ml" : "ar";
      const toLang = mode === "ml-to-ar" ? "ar" : "ml";

      updateGoogleFallbackLink();

      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        let translated = data && data.responseData ? data.responseData.translatedText : "";

        // Filter out bad responses
        if (!translated || translated.includes("MYMEMORY WARNING")) {
          // Fallback to match in quick phrases if available
          const found = (mode === "ml-to-ar" ? QUICK_PHRASES_ML_TO_AR : QUICK_PHRASES_AR_TO_ML).find(
            p => (mode === "ml-to-ar" ? p.ml : p.ar) === text
          );
          if (found) {
            translated = mode === "ml-to-ar" ? found.ar : found.ml;
          } else {
            throw new Error("No clean translation");
          }
        }

        if (outputArea) {
          outputArea.innerHTML = `<span class="trans-result-text">${escapeHtml(translated)}</span>`;
        }

        // Enable speak & copy buttons
        if (btnSpeakTarget) btnSpeakTarget.disabled = false;
        if (btnCopy) btnCopy.disabled = false;

      } catch (err) {
        console.warn("[VoiceTranslator] Translation API error:", err);
        if (outputArea) {
          outputArea.innerHTML = `
            <div class="trans-fallback-box">
              <p>⚠️ ഓൺലൈൻ ട്രാൻസ്‌ലേറ്റർ കണക്ഷൻ കിട്ടിയില്ല. താഴെയുള്ള ബട്ടൺ അമർത്തി ഗൂഗിൾ ട്രാൻസ്‌ലേറ്ററിൽ നേരിട്ട് തുറക്കാം:</p>
              <a href="${getGoogleTranslateUrl(text, fromLang, toLang)}" target="_blank" rel="noopener noreferrer" class="btn-open-google-direct">
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
    function getGoogleTranslateUrl(text, fromLang, toLang) {
      return `https://translate.google.com/?sl=${fromLang}&tl=${toLang}&text=${encodeURIComponent(text)}&op=translate`;
    }

    function updateGoogleFallbackLink() {
      if (!btnGoogleFallback) return;
      const text = (inputArea ? inputArea.value : "").trim() || (mode === "ml-to-ar" ? "സഹായം" : "مساعدة");
      const fromLang = mode === "ml-to-ar" ? "ml" : "ar";
      const toLang = mode === "ml-to-ar" ? "ar" : "ml";
      btnGoogleFallback.href = getGoogleTranslateUrl(text, fromLang, toLang);
    }

    if (inputArea) {
      inputArea.addEventListener("input", updateGoogleFallbackLink);
    }

    // 6. Speech Synthesis (Audio Output)
    function speakText(text, langCode) {
      if (!window.speechSynthesis) {
        showToast("സ്പീച്ച് ഓഡിയോ ഈ ഫോണിൽ ലഭ്യമല്ല.");
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.9; // Slightly slower for clarity
      window.speechSynthesis.speak(utterance);
    }

    if (btnSpeakTarget) {
      btnSpeakTarget.addEventListener("click", () => {
        const resEl = outputArea ? outputArea.querySelector(".trans-result-text") : null;
        const text = resEl ? resEl.textContent : "";
        if (!text) return;
        const targetLang = mode === "ml-to-ar" ? "ar-SA" : "ml-IN";
        speakText(text, targetLang);
      });
    }

    if (btnSpeakSource) {
      btnSpeakSource.addEventListener("click", () => {
        const text = (inputArea ? inputArea.value : "").trim();
        if (!text) return;
        const srcLang = mode === "ml-to-ar" ? "ml-IN" : "ar-SA";
        speakText(text, srcLang);
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
    renderQuickChips();
    setMode("ml-to-ar");
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
