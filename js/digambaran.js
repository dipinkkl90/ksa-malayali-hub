/**
 * KSA Malayali Hub — Digambaran (ദിഗംബരൻ) Pravasi AI Assistant & Kusruthi Chodhyangal
 * 100% Offline, Instant, Lightweight, and Zero-API Chatbot
 * Developed by D&J Techies
 */

(function () {
  "use strict";

  // Built-in 18+ Clean, Classic & Pravasi Malayalam Riddles (കുസൃതിച്ചോദ്യങ്ങൾ)
  const KUSRUTHI_RIDDLES = [
    {
      id: 1,
      question: "കഴുത്തുണ്ട് പക്ഷേ തലയില്ല, കൈകളുണ്ട് പക്ഷേ വിരലുകളില്ല... ഞാനാര്?",
      answer: "ഷർട്ട്! 👕",
      funnyReaction: "ഹഹഹ! വസ്ത്രധാരണത്തിൽ ശ്രദ്ധിക്കണം മച്ചാനെ! 😄"
    },
    {
      id: 2,
      question: "വരുമ്പോൾ കറുപ്പും, ഉപയോഗിക്കുമ്പോൾ ചുവപ്പും, തീരുമ്പോൾ വെളുപ്പും ആകുന്നതെന്ത്?",
      answer: "കരി (Charcoal)! 🔥",
      funnyReaction: "തീപ്പൊരി ഉത്തരം! കരി തന്നെയാണ് ശരി! 🔥"
    },
    {
      id: 3,
      question: "എത്ര കഴിച്ചാലും വിശപ്പ് മാറാത്ത, എന്നാൽ വെള്ളം കുടിച്ചാൽ ഉടൻ ചത്തുപോകുന്ന ആളാര്?",
      answer: "തീ! 🔥",
      funnyReaction: "കണ്ണിൽ ചോരയില്ലാത്ത തീ! എങ്ങനെയുണ്ട് ദിഗംബരന്റെ ബുദ്ധി? 😈"
    },
    {
      id: 4,
      question: "രാവിലെ നാട്ടിലെ സമയം നോക്കാനും, വൈകിട്ട് സൗദിയിലെ ശമ്പളം കൂട്ടാനും പ്രവാസികൾ ഏറ്റവും കൂടുതൽ തൊടുന്ന സാധനം?",
      answer: "മൊബൈൽ ഫോൺ! 📱",
      funnyReaction: "സത്യം പറഞ്ഞാൽ ചങ്ക് പറിച്ച് തരും പ്രവാസികൾ! ഫോൺ തന്നെ! 📱"
    },
    {
      id: 5,
      question: "പല്ല് ഒരുപാടുണ്ട്, പക്ഷേ ഒന്നും കടിക്കാൻ പറ്റില്ല... എന്താണത്?",
      answer: "ചീപ്പ് (Comb)! 🪮",
      funnyReaction: "തലമുടി ചീകുമ്പോൾ ഓർക്കണം എന്നെ! 😄"
    },
    {
      id: 6,
      question: "തൊട്ടാൽ പൊട്ടും, പക്ഷേ കയ്യിലെടുക്കാൻ പറ്റില്ല... എന്താണത്?",
      answer: "നിശബ്ദത (Silence)! 🤫",
      funnyReaction: "പിൻ ഡ്രോപ്പ് സൈലൻസ്! പിടികിട്ടിയോ? 🤫"
    },
    {
      id: 7,
      question: "എപ്പോഴും താഴോട്ട് മാത്രം വരും, ഒരിക്കലും മുകളിലോട്ട് പോകില്ല... എന്താണത്?",
      answer: "മഴ! 🌧️",
      funnyReaction: "നാട്ടിലെ കർക്കടക മഴ ഓർമ്മവന്നോ മച്ചാനെ? 🌧️"
    },
    {
      id: 8,
      question: "കണ്ണുണ്ട് പക്ഷേ കാണാൻ പറ്റില്ല... ഞാനാര്?",
      answer: "തേങ്ങ / സൂചി! 🥥",
      funnyReaction: "തേങ്ങയും സൂചിയും! ചിന്തിച്ചാൽ തലപുകയും! 🥥"
    },
    {
      id: 9,
      question: "കാലുണ്ട് പക്ഷേ നടക്കാൻ പറ്റില്ല... എന്താണത്?",
      answer: "മേശ / കസേര! 🪑",
      funnyReaction: "ഇരിക്കാൻ മാത്രം അറിയാം, ഒരടി നടക്കില്ല! 🪑"
    },
    {
      id: 10,
      question: "വളരുംതോറും താഴോട്ട് പോകുന്ന സാധനം ഏതാണ്?",
      answer: "കിണർ / വേര് / താടി! 🧔",
      funnyReaction: "താഴോട്ട് താഴോട്ട്... അടിപൊളി അല്ലേ! 🧔"
    },
    {
      id: 11,
      question: "മുറിക്കും തോറും നീളം കൂടുന്ന സാധനം ഏതാണ്?",
      answer: "കുഴി (Hole)! 🕳️",
      funnyReaction: "വെട്ടുന്തോറും വലുതാകുന്ന കുഴി! തകർത്തു! 🕳️"
    },
    {
      id: 12,
      question: "വെള്ളത്തിൽ വീണാലും നനയാത്ത സാധനം എന്താണ്?",
      answer: "നിഴൽ (Shadow)! 👤",
      funnyReaction: "നിഴൽ പോലെ എപ്പോഴും കൂടെയുണ്ട് ദിഗംബരൻ! 👤"
    },
    {
      id: 13,
      question: "എല്ലാവരും ഇരിക്കുമ്പോൾ നിൽക്കുകയും, എല്ലാവരും നിൽക്കുമ്പോൾ ഇരിക്കുകയും ചെയ്യുന്ന ആളാര്?",
      answer: "ഡ്രൈവർ / ബസ് കണ്ടക്ടർ! 🚌",
      funnyReaction: "ടിക്കറ്റ് പ്ലീസ്! കൃത്യം ഉത്തരം! 🚌"
    },
    {
      id: 14,
      question: "ഉടമസ്ഥൻ അറിയാതെ ആരും കാണാതെ അകത്തു കടക്കുന്ന കള്ളൻ?",
      answer: "ഉറക്കം (Sleep)! 😴",
      funnyReaction: "ഡ്യൂട്ടി കഴിഞ്ഞ് റൂമിൽ എത്തുമ്പോൾ വരുന്ന സാക്ഷാൽ ഉറക്കം! 😴"
    },
    {
      id: 15,
      question: "തലയിൽ തൊപ്പിയുണ്ട്, പക്ഷേ നടക്കാൻ കാലില്ല... ഞാനാര്?",
      answer: "കുപ്പിയിലെ അടപ്പ് / കൂൺ! 🍄",
      funnyReaction: "തലയുയർത്തി നിൽക്കുന്ന കൂൺ! അടിപൊളി! 🍄"
    },
    {
      id: 16,
      question: "സൗദിയിലെ ബാച്ചിലർ റൂമുകളിൽ വ്യാഴാഴ്ച രാത്രി അല്ലെങ്കിൽ വെള്ളിയാഴ്ച ഉച്ചയ്ക്ക് മസ്റ്റായി ഉണ്ടാക്കുന്ന സാധനം?",
      answer: "ദം ബിരിയാണി / നെയ്ച്ചോറും ചിക്കൻ കറിയും! 🍗",
      funnyReaction: "റൂമിലെ ബാച്ചിലർ ബിരിയാണി വൈബ്സ് ഓർമ്മവന്നോ? 🍗😋"
    },
    {
      id: 17,
      question: "വായയുണ്ട് പക്ഷേ സംസാരിക്കില്ല, കിടക്കയുണ്ട് പക്ഷേ ഒരിക്കലും ഉറങ്ങില്ല... ഞാനാര്?",
      answer: "പുഴ (River)! 🌊",
      funnyReaction: "പുഴയുടെ വായയും കിടക്കയും! കിടുക്കൻ ചിന്ത! 🌊"
    },
    {
      id: 18,
      question: "വിളിച്ചാൽ വരില്ല, എന്നാൽ പേര് പറഞ്ഞാൽ ഉടൻ അപ്രത്യക്ഷമാകും... ആരാണത്?",
      answer: "നിശബ്ദത (Silence)! 🤐",
      funnyReaction: "മിണ്ടരുത്! പേര് പറഞ്ഞാൽ പോയി! 🤐"
    }
  ];

  let lastRiddleId = null;
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

  // Inject CSS Styles for Digambaran
  function injectStyles() {
    if (document.getElementById("digambaran-styles")) return;
    const style = document.createElement("style");
    style.id = "digambaran-styles";
    style.textContent = `
      /* Digambaran Floating Trigger Button */
      .digambaran-float-btn {
        position: fixed;
        left: 20px;
        bottom: 20px;
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
      @media (max-width: 768px) {
        .digambaran-float-btn {
          left: 12px;
          bottom: calc(76px + env(safe-area-inset-bottom, 0px)) !important;
          padding: 6px 12px 6px 8px;
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
        width: 390px;
        max-width: calc(100vw - 32px);
        height: 580px;
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
        max-width: 90%;
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

      /* Riddle Card Styles */
      .riddle-card {
        background: linear-gradient(145deg, #1e1e2f 0%, #151828 100%);
        border: 1.5px solid #f59e0b;
        border-radius: 14px;
        padding: 14px;
        margin-top: 4px;
        box-shadow: 0 8px 24px rgba(245, 158, 11, 0.15);
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
        margin-bottom: 8px;
        letter-spacing: 0.04em;
      }
      .riddle-question {
        color: #fef08a;
        font-size: 0.92rem;
        font-weight: 700;
        line-height: 1.55;
        margin-bottom: 12px;
      }
      .riddle-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }
      .btn-riddle-show, .btn-riddle-next {
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
      .btn-riddle-show {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: #160c00;
        box-shadow: 0 3px 10px rgba(245, 158, 11, 0.3);
      }
      .btn-riddle-show:hover {
        background: #fbbf24;
        transform: translateY(-1px);
      }
      .btn-riddle-show:active {
        transform: scale(0.96);
      }
      .btn-riddle-next {
        background: #334155;
        color: #f1f5f9;
        border: 1px solid #475569;
      }
      .btn-riddle-next:hover {
        background: #475569;
        transform: translateY(-1px);
      }
      .btn-riddle-next:active {
        transform: scale(0.96);
      }

      /* Answer Card */
      .answer-card {
        background: linear-gradient(145deg, #063c2e 0%, #062e24 100%);
        border: 1.5px solid #10b981;
        border-radius: 14px;
        padding: 14px;
        margin-top: 6px;
        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.18);
      }
      .answer-badge {
        display: inline-flex;
        align-items: center;
        background: #10b981;
        color: #02261b;
        font-weight: 800;
        font-size: 0.7rem;
        padding: 3px 8px;
        border-radius: 6px;
        text-transform: uppercase;
        margin-bottom: 6px;
      }
      .answer-text {
        font-size: 1.05rem;
        font-weight: 800;
        color: #ffffff;
        margin-bottom: 6px;
      }
      .funny-reaction {
        font-size: 0.85rem;
        color: #a7f3d0;
        font-style: italic;
        line-height: 1.45;
        margin-bottom: 10px;
        padding-top: 4px;
        border-top: 1px dashed rgba(16, 185, 129, 0.3);
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

    // 1. Floating Button
    const floatBtn = document.createElement("button");
    floatBtn.id = "digambaran-float-btn";
    floatBtn.type = "button";
    floatBtn.className = "digambaran-float-btn";
    floatBtn.setAttribute("aria-label", "ദിഗംബരൻ AI സഹായിയുമായി ചാറ്റ് ചെയ്യുക");
    floatBtn.setAttribute("title", "ദിഗംബരൻ · പ്രവാസി AI സഹായി & കുസൃതിച്ചോദ്യങ്ങൾ");
    floatBtn.innerHTML = `
      <span class="digambaran-float-avatar" aria-hidden="true">🧙‍♂️</span>
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
          <div class="digambaran-header-avatar">🧙‍♂️</div>
          <div class="digambaran-header-text">
            <h3>ദിഗംബരൻ <span style="font-size:0.75rem; color:#f59e0b; font-weight:600;">(AI സഹായി)</span></h3>
            <p><span class="digambaran-status-dot"></span> 100% ഓഫ്‌ലൈൻ &amp; ഇൻസ്റ്റന്റ്</p>
          </div>
        </div>
        <div class="digambaran-header-actions">
          <button type="button" id="digambaran-btn-clear" class="digambaran-btn-icon" title="ചാറ്റ് റീസെറ്റ് ചെയ്യുക" aria-label="Clear Chat">↺</button>
          <button type="button" id="digambaran-btn-close" class="digambaran-btn-icon" title="ക്ലോസ് ചെയ്യുക" aria-label="Close Chat">✕</button>
        </div>
      </div>

      <div class="digambaran-body" id="digambaran-messages">
        <!-- Initial Welcome Message -->
        <div class="digambaran-msg bot">
          <div class="digambaran-msg-avatar">🧙‍♂️</div>
          <div class="digambaran-bubble">
            <strong>നമസ്കാരം മച്ചാനെ! ഞാൻ ദിഗംബരൻ 🧙‍♂️</strong><br>
            സൗദിയിലെ മലയാളി ഹോട്ടലുകൾ, ലൈവ് റിയാൽ നിരക്ക്, ഹൈപ്പർമാർക്കറ്റ് ഓഫറുകൾ, ഇഖാമ, എമർജൻസി അല്ലെങ്കിൽ ബോറടിക്കുമ്പോൾ ഒരു കുസൃതിച്ചോദ്യം... എന്ത് വേണമെങ്കിലും ചോദിച്ചോളൂ!
          </div>
        </div>
      </div>

      <!-- Quick Reply Chips -->
      <div class="digambaran-chips-container" id="digambaran-chips">
        <button type="button" class="digambaran-chip chip-highlight" data-query="കുസൃതിച്ചോദ്യം">😜 കുസൃതിച്ചോദ്യം</button>
        <button type="button" class="digambaran-chip" data-query="ഹോട്ടൽ">🍲 മലയാളി ഹോട്ടൽ</button>
        <button type="button" class="digambaran-chip" data-query="റിയാൽ">💱 റിയാൽ നിരക്ക്</button>
        <button type="button" class="digambaran-chip" data-query="ഓഫർ">🛍️ ഓഫറുകൾ</button>
        <button type="button" class="digambaran-chip" data-query="എമർജൻസി">🚨 എമർജൻസി</button>
        <button type="button" class="digambaran-chip" data-query="ഇഖാമ">📄 ഇഖാമ &amp; ഖിവ</button>
        <button type="button" class="digambaran-chip" data-query="സിനിമ">🎬 സിനിമകൾ</button>
        <button type="button" class="digambaran-chip" data-query="ക്ലിനിക്ക്">🏥 ക്ലിനിക്കുകൾ</button>
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
  }

  // Open & Close Chat Window
  function openDigambaran() {
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
      <div class="digambaran-msg-avatar">🧙‍♂️</div>
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

  // Serve a Random Riddle (Interactive Flow)
  function askRiddle(specificId = null) {
    let riddle;
    if (specificId !== null) {
      riddle = KUSRUTHI_RIDDLES.find(r => r.id === specificId);
    }
    if (!riddle) {
      // Pick random different from lastRiddleId
      const available = KUSRUTHI_RIDDLES.filter(r => r.id !== lastRiddleId);
      riddle = available[Math.floor(Math.random() * available.length)] || KUSRUTHI_RIDDLES[0];
    }
    lastRiddleId = riddle.id;

    const html = `
      <div class="riddle-card">
        <div class="riddle-badge">😜 കുസൃതിച്ചോദ്യം #${riddle.id}</div>
        <div class="riddle-question">"${escapeHtml(riddle.question)}"</div>
        <div class="riddle-actions">
          <button type="button" class="btn-riddle-show" data-riddle-id="${riddle.id}">💡 ഉത്തരം കാണുക</button>
          <button type="button" class="btn-riddle-next">➡️ അടുത്ത ചോദ്യം</button>
        </div>
      </div>
    `;

    appendBotMessage(html, false);
  }

  // Reveal Riddle Answer
  function revealAnswer(riddleId, targetButton) {
    const riddle = KUSRUTHI_RIDDLES.find(r => r.id === Number(riddleId));
    if (!riddle) return;

    if (targetButton) {
      targetButton.style.display = "none";
    }

    const html = `
      <div class="answer-card">
        <div class="answer-badge">💡 ശരിയായ ഉത്തരം</div>
        <div class="answer-text">${escapeHtml(riddle.answer)}</div>
        <div class="funny-reaction">${escapeHtml(riddle.funnyReaction)}</div>
        <div class="riddle-actions">
          <button type="button" class="btn-riddle-next">➡️ അടുത്ത കുസൃതിച്ചോദ്യം ചോദിക്കൂ</button>
        </div>
      </div>
    `;

    appendBotMessage(html, false);
  }

  // Match Query Intent (Offline Engine)
  function processUserQuery(rawQuery) {
    const query = rawQuery.trim();
    if (!query) return;

    appendUserMessage(query);

    const q = query.toLowerCase();

    // 1. Riddle / Joke keywords check
    const isRiddleQuery =
      q.includes("joke") ||
      q.includes("riddle") ||
      q.includes("kusruthi") ||
      q.includes("തമാശ") ||
      q.includes("കുസൃതി") ||
      q.includes("ചോദ്യം") ||
      q.includes("ചിരി");

    if (isRiddleQuery) {
      setTimeout(() => {
        askRiddle();
      }, 200);
      return;
    }

    // 2. Categorize Query for Strict Urgent vs Non-Urgent distinction
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
        ഹോട്ടലുകൾ, റിയാൽ നിരക്ക്, ഓഫറുകൾ, ഇഖാമ, എമർജൻസി... പിന്നെ ബോറടിക്കുമ്പോൾ നല്ല കുസൃതിച്ചോദ്യങ്ങളും ആയി ഞാൻ കൂടെയുണ്ട്! എന്തിനാണ് സഹായം വേണ്ടത്?
      `;
    }
    // Default Fallback (NON-URGENT: CAN BE PLAYFUL)
    else {
      category = "general";
      botReply = `
        മച്ചാനെ, താങ്കൾ ചോദിച്ചതിന് കൃത്യമായ ഉത്തരം തരാൻ ഞാൻ ശ്രമിക്കാം! താഴെയുള്ള പ്രധാന വിഷയങ്ങളിൽ ഏതാണ് താങ്കൾക്ക് അറിയേണ്ടത്?
      `;
    }

    // Occasional Playful Trigger Check:
    // "After answering a normal non-urgent query (like hotels, movies, offers, or rates — NEVER during emergency, medical, or iqama/legal queries),
    // occasionally (e.g., 1 in 3 chats) let Digambaran playfully append a small clickable prompt:
    // 'ബോറടിക്കുന്നോ മച്ചാനെ? ഒരു കുസൃതിച്ചോദ്യം ചോദിക്കട്ടെ? 😈' → tapping it launches a random riddle."
    let shouldTriggerPlayful = false;
    if (category === "general") {
      nonUrgentChatCount++;
      // Trigger on every 3rd non-urgent chat or ~35% probability
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
    const backdrop = document.getElementById("digambaran-backdrop");
    const btnClose = document.getElementById("digambaran-btn-close");
    const btnClear = document.getElementById("digambaran-btn-clear");
    const form = document.getElementById("digambaran-form");
    const input = document.getElementById("digambaran-input");
    const chipsContainer = document.getElementById("digambaran-chips");
    const messages = document.getElementById("digambaran-messages");

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
        if (messages) {
          messages.innerHTML = `
            <div class="digambaran-msg bot">
              <div class="digambaran-msg-avatar">🧙‍♂️</div>
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

    // Event delegation for riddle buttons in messages container
    if (messages) {
      messages.addEventListener("click", (e) => {
        // Show Answer
        const showBtn = e.target.closest(".btn-riddle-show");
        if (showBtn) {
          const riddleId = showBtn.getAttribute("data-riddle-id");
          revealAnswer(riddleId, showBtn);
          return;
        }

        // Next Riddle
        const nextBtn = e.target.closest(".btn-riddle-next");
        if (nextBtn) {
          appendBotMessage("<em>ദാ അടുത്ത കുസൃതിച്ചോദ്യം വരുന്നു! 😈</em>", false);
          setTimeout(() => {
            askRiddle();
          }, 300);
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
