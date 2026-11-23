/**
 * KSA Malayali Hub — Real Full PDF Generation Controller (v25)
 * Powered by html2pdf.js with Malayalam-first typography (Noto Sans Malayalam).
 * Generates:
 *   1) സൗദി പ്രവാസി സമ്പൂർണ്ണ ഗൈഡ് (Full Pravasi Survival Guide PDF)
 *   2) അറബിക് - മലയാളം - ഹിന്ദി നിത്യോപയോഗ വാക്കുകൾ (Full Dictionary PDF)
 *   3) E-Library Complete Book PDFs for all 57 titles
 */

(function () {
  "use strict";

  // Display Toast Message
  function showToast(msg, type = "success") {
    const existing = document.getElementById("pwa-toast");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.id = "pwa-toast";
    toast.className = `pwa-toast show ${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Show / Hide PDF Generation Spinner Overlay
  function showPdfSpinner(title = "PDF തയ്യാറാക്കുന്നു...", subtitle = "സൗദി മലയാളി ഹബ്ബ് ഡോക്യുമെന്റ് തയ്യാറാക്കുന്നു. ദയവായി അല്പം കാത്തിരിക്കൂ.") {
    let overlay = document.getElementById("pdf-spinner-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "pdf-spinner-overlay";
      overlay.className = "pdf-spinner-backdrop";
      overlay.innerHTML = `
        <div class="pdf-spinner-card">
          <div class="pdf-spinner-loader"></div>
          <h3 id="pdf-spinner-title" style="margin: 14px 0 6px; font-size: 1.25rem; font-weight: 800; color: #0f172a;"></h3>
          <p id="pdf-spinner-sub" style="margin: 0; font-size: 0.9rem; color: #475569;"></p>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    document.getElementById("pdf-spinner-title").textContent = title;
    document.getElementById("pdf-spinner-sub").textContent = subtitle;
    overlay.style.display = "flex";
  }

  function hidePdfSpinner() {
    const overlay = document.getElementById("pdf-spinner-overlay");
    if (overlay) overlay.style.display = "none";
  }

  // Render HTML element to PDF via html2pdf or fallback to print window
  function renderElementToPdf(element, filename, title) {
    if (window.HubLogger) {
      window.HubLogger.logEvent("PDF_DOWNLOAD", `PDF ഡൗൺലോഡ്: ${title || filename}`, `ഫയൽ: ${filename}`);
    }
    if (typeof window.html2pdf !== "function") {
      // Fallback: print window
      hidePdfSpinner();
      const printWin = window.open("", "_blank");
      if (printWin) {
        printWin.document.write(`
          <!DOCTYPE html>
          <html lang="ml">
          <head>
            <meta charset="utf-8">
            <title>${title} | KSA Malayali Hub</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Sans+Malayalam:wght@400;600;700;800&display=swap" rel="stylesheet">
            <style>
              body { font-family: 'Noto Sans Malayalam', 'Inter', sans-serif; padding: 24px; color: #0f172a; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            ${element.innerHTML}
          </body>
          </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => printWin.print(), 500);
        showToast("പ്രിന്റ് / PDF വിൻഡോ തുറന്നു. 'Save as PDF' തിരഞ്ഞെടുക്കുക.", "info");
      } else {
        showToast("പോപ്പ്-അപ്പ് അനുവദിക്കുക (Please allow pop-ups for PDF)", "error");
      }
      return;
    }

    const opt = {
      margin: [10, 10, 10, 10],
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy", "avoid-all"] }
    };

    window.html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        hidePdfSpinner();
        showToast(`'${filename}' വിജയകരമായി ഡൗൺലോഡ് ചെയ്തു! ✅`);
      })
      .catch((err) => {
        console.error("html2pdf generation error:", err);
        hidePdfSpinner();
        showToast("PDF ഡൗൺലോഡ് ചെയ്യുന്നതിൽ തടസ്സം നേരിട്ടു. പ്രിന്റ് ഓപ്ഷൻ തുറക്കുന്നു...", "info");
        window.print();
      });
  }

  // 1. GENERATE: സൗദി പ്രവാസി സമ്പൂർണ്ണ ഗൈഡ് (Full Survival Guide PDF)
  window.downloadFullPravasiGuidePdf = function () {
    showPdfSpinner("സൗദി പ്രവാസി സമ്പൂർണ്ണ ഗൈഡ് തയ്യാറാക്കുന്നു...", "എമർജൻസി, തൊഴിൽ നിയമം, ഇഖാമ, മരുന്നുകൾ, സിം കോഡുകൾ എന്നിവ ഒരുമിച്ച് പ്രോസസ്സ് ചെയ്യുന്നു...");

    setTimeout(() => {
      const container = document.createElement("div");
      container.className = "pdf-render-wrapper";
      container.innerHTML = `
        <div style="font-family: 'Noto Sans Malayalam', 'Inter', sans-serif; color: #0f172a; background: #ffffff; padding: 10px; line-height: 1.7; font-size: 13px;">
          <!-- Cover Header -->
          <div style="background: linear-gradient(135deg, #047857 0%, #064e3b 100%); color: #ffffff; padding: 24px; border-radius: 12px; margin-bottom: 24px; text-align: center; border: 2px solid #d97706;">
            <div style="font-size: 28px; margin-bottom: 6px;">🇸🇦 🌴  Kerala</div>
            <h1 style="margin: 0 0 6px; font-size: 24px; font-weight: 800; color: #fef08a;">സൗദി പ്രവാസി സമ്പൂർണ്ണ സഹായി</h1>
            <div style="font-size: 13px; color: #a7f3d0; margin-bottom: 12px;">KSA MALAYALI HUB — OFFICIAL EXPATS SURVIVAL HANDBOOK (2026 EDITION)</div>
            <p style="margin: 0; font-size: 12px; color: #e2e8f0; max-width: 600px; margin: 0 auto;">
              സൗദി അറേബ്യയിലെ എല്ലാ പ്രവാസി മലയാളികളുടെയും ദൈനംദിന ജീവിതത്തിനും അടിയന്തര ഘട്ടങ്ങൾക്കും ആവശ്യമായ സമഗ്ര മലയാളം റെഫറൻസ് ഗൈഡ്.
            </p>
          </div>

          <!-- Section 1: Emergency Helplines -->
          <div style="margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
            <div style="background: #dc2626; color: #ffffff; padding: 10px 16px; font-weight: 800; font-size: 15px; display: flex; align-items: center; justify-content: space-between;">
              <span>🆘 1. സൗദി 24/7 എമർജൻസി ഹെൽപ്പ്‌ലൈൻ നമ്പറുകൾ</span>
              <span style="font-size: 11px; background: rgba(0,0,0,0.25); padding: 2px 8px; border-radius: 4px;">CRITICAL</span>
            </div>
            <div style="padding: 14px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <thead>
                  <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left;">
                    <th style="padding: 8px; color: #334155;">വിഭാഗം</th>
                    <th style="padding: 8px; color: #334155;">നമ്പർ</th>
                    <th style="padding: 8px; color: #334155;">വിവരണം</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: 700;">ഏകീകൃത എമർജൻസി (Unified Emergency)</td><td style="padding: 8px; font-weight: 800; color: #dc2626; font-size: 14px;">911</td><td style="padding: 8px;">മക്ക, റിയാദ്, കിഴക്കൻ പ്രവിശ്യ ഏകീകൃത കൺട്രോൾ റൂം</td></tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: 700;">പോലീസ് (Police)</td><td style="padding: 8px; font-weight: 800; color: #047857;">999</td><td style="padding: 8px;">ക്രമസമാധാന പ്രശ്നങ്ങൾ & അപകടങ്ങൾ</td></tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: 700;">ആംബുലൻസ് (Red Crescent)</td><td style="padding: 8px; font-weight: 800; color: #dc2626;">997</td><td style="padding: 8px;">അടിയന്തര മെഡിക്കൽ സഹായം & അപകട രക്ഷാപ്രവർത്തനം</td></tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: 700;">സിവിൽ ഡിഫൻസ് (Civil Defense / തീപിടുത്തം)</td><td style="padding: 8px; font-weight: 800;">998</td><td style="padding: 8px;">തീപിടുത്തം, വെള്ളപ്പൊക്കം, റെസ്ക്യൂ ഓപ്പറേഷനുകൾ</td></tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: 700;">ട്രാഫിക് അപകടങ്ങൾ (Najm / Traffic)</td><td style="padding: 8px; font-weight: 800;">199014 / 993</td><td style="padding: 8px;">വാഹന അപകട റിപ്പോർട്ടിംഗും ഇൻഷുറൻസ് ക്ലെയിമും</td></tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: 700;">ഇന്ത്യൻ എംബസി (റിയാദ്)</td><td style="padding: 8px; font-weight: 800;">+966 11 488 4144</td><td style="padding: 8px;">24/7 പ്രവാസി ലീഗൽ, പാസ്‌പോർട്ട്, അത്യാഹിത സഹായം</td></tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: 700;">ഇന്ത്യൻ കോൺസുലേറ്റ് (ജിദ്ദ)</td><td style="padding: 8px; font-weight: 800;">+966 12 660 7466</td><td style="padding: 8px;">വെസ്റ്റേൺ പ്രവിശ്യ കോൺസുലാർ ഹെൽപ്പ്‌ലൈൻ</td></tr>
                  <tr><td style="padding: 8px; font-weight: 700;">തൊഴിൽ മന്ത്രാലയം (MHRSD)</td><td style="padding: 8px; font-weight: 800;">19911</td><td style="padding: 8px;">ശമ്പള കുടിശ്ശിക, സ്പോൺസർ പ്രശ്നങ്ങൾ (മലയാളം സപ്പോർട്ട്)</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Section 2: Saudi Labor Law & Gratuity (EOSB) -->
          <div style="margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; page-break-inside: avoid;">
            <div style="background: #047857; color: #ffffff; padding: 10px 16px; font-weight: 800; font-size: 15px;">
              💰 2. സൗദി ലേബർ ലോ & സർവീസ് ആനുകൂല്യം (EOSB Gratuity)
            </div>
            <div style="padding: 14px; font-size: 12px;">
              <p style="margin-top: 0; font-weight: 700; color: #047857;">ആർട്ടിക്കിൾ 84 (കമ്പനി കരാർ അവസാനിപ്പിക്കുകയോ കാലാവധി തികയുകയോ ചെയ്യുമ്പോൾ):</p>
              <ul style="padding-left: 20px; margin: 4px 0 10px;">
                <li>ആദ്യ 5 വർഷത്തെ ഓരോ വർഷത്തിനും: <strong>അര മാസത്തെ അടിസ്ഥാന ശമ്പളം</strong> വീതം.</li>
                <li>5 വർഷത്തിന് ശേഷമുള്ള ഓരോ വർഷത്തിനും: <strong>പൂർണ്ണ ഒരു മാസത്തെ ശമ്പളം</strong> വീതം.</li>
              </ul>
              <p style="font-weight: 700; color: #d97706; margin-bottom: 4px;">ആർട്ടിക്കിൾ 85 (തൊഴിലാളി സ്വന്തം ഇഷ്ടപ്രകാരം രാജി വെക്കുമ്പോൾ - Resignation):</p>
              <ul style="padding-left: 20px; margin: 4px 0;">
                <li>2 വർഷത്തിൽ താഴെ സർവീസ്: ആനുകൂല്യത്തിന് അർഹതയില്ല (0%).</li>
                <li>2 മുതൽ 5 വർഷം വരെ സർവീസ്: ആകെ കണക്കാക്കിയ തുകയുടെ <strong>മൂന്നിലൊന്ന് (1/3rd)</strong> ലഭിക്കും.</li>
                <li>5 മുതൽ 10 വർഷം വരെ സർവീസ്: ആകെ കണക്കാക്കിയ തുകയുടെ <strong>മൂന്നിൽ രണ്ട് (2/3rds)</strong> ലഭിക്കും.</li>
                <li>10 വർഷത്തിന് മുകളിൽ സർവീസ്: <strong>പൂർണ്ണമായ തുക (100%)</strong> ലഭിക്കും.</li>
              </ul>
            </div>
          </div>

          <!-- Section 3: Iqama, Huroob & Qiwa Guide -->
          <div style="margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; page-break-inside: avoid;">
            <div style="background: #0284c7; color: #ffffff; padding: 10px 16px; font-weight: 800; font-size: 15px;">
              📄 3. ഇഖാമ, ഹുറൂബ് & ഖിവ (Qiwa) പരിശോധനാ നിർദ്ദേശങ്ങൾ
            </div>
            <div style="padding: 14px; font-size: 12px;">
              <ol style="padding-left: 20px; margin: 0;">
                <li style="margin-bottom: 6px;"><strong>ഇഖാമ കാലാവധി പരിശോധന (Absher):</strong> absher.sa പോർട്ടലിൽ ലോഗിൻ ചെയ്ത് 'Query Iqama Expiry Service' തിരഞ്ഞെടുക്കുക. ഇഖാമ കാലാവധി കഴിഞ്ഞാൽ മാസം 500 റിയാൽ പിഴയും ബാങ്ക് അക്കൗണ്ട് ഫ്രീസും ഉണ്ടാകും.</li>
                <li style="margin-bottom: 6px;"><strong>ഖിവ (Qiwa) വെരിഫിക്കേഷൻ:</strong> qiwa.sa വഴി നിങ്ങളുടെ തൊഴിൽ കരാർ (Digital Contract) പരിശോധിച്ച് അപ്രൂവ് ചെയ്യുക. വേതന സുരക്ഷാ പദ്ധതി (WPS) പ്രകാരം ബാങ്ക് വഴി മാത്രമേ ശമ്പളം നൽകാവൂ.</li>
                <li><strong>ഹുറൂബ് ഒഴിവാക്കൽ:</strong> സ്പോൺസറുമായി തർക്കമുണ്ടായാൽ ഉടൻ തന്നെ 19911 വഴി തൊഴിൽ മന്ത്രാലയത്തിൽ പരാതി ഫയൽ ചെയ്യുക. പരാതി നിലനിൽക്കുമ്പോൾ സ്പോൺസർക്ക് ഹുറൂബ് അടിക്കാൻ നിയമപരമായി കഴിയില്ല.</li>
              </ol>
            </div>
          </div>

          <!-- Section 4: Airport Customs Banned Medicines -->
          <div style="margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; page-break-inside: avoid;">
            <div style="background: #dc2626; color: #ffffff; padding: 10px 16px; font-weight: 800; font-size: 15px;">
              ✈️ 4. സൗദി എയർപോർട്ട് കസ്റ്റംസ് നിരോധിത മരുന്നുകൾ & സാധനങ്ങൾ
            </div>
            <div style="padding: 14px; font-size: 12px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #fee2e2; background: #fef2f2;">
                  <td style="padding: 8px; font-weight: 800; color: #dc2626; width: 35%;">കസകസ് (Poppy Seeds / Khaskhas)</td>
                  <td style="padding: 8px; color: #7f1d1d;"><strong>പൂർണ്ണ നിരോധനം (Zero Tolerance).</strong> കറിക്കൂട്ടുകളിൽ ചേർക്കുന്നതാണെങ്കിൽ പോലും കഞ്ചാവ്/മയക്കുമരുന്ന് നിയമപ്രകാരം വൻ തടവുശിക്ഷ ലഭിക്കും.</td>
                </tr>
                <tr style="border-bottom: 1px solid #fee2e2;">
                  <td style="padding: 8px; font-weight: 800; color: #dc2626;">ട്രമഡോൾ (Tramadol / Opioids)</td>
                  <td style="padding: 8px; color: #7f1d1d;">കർശന നിരോധനം. ഔദ്യോഗിക എംബസി/മന്ത്രാലയ അറ്റസ്റ്റേഷൻ ഉള്ള സ്പെഷ്യൽ മെഡിക്കൽ പെർമിറ്റ് ഇല്ലാതെ കൈവശം വെക്കുന്നത് ക്രിമിനൽ കുറ്റമാണ്.</td>
                </tr>
                <tr style="border-bottom: 1px solid #fee2e2;">
                  <td style="padding: 8px; font-weight: 800; color: #d97706;">കോഡീൻ സിറപ്പുകൾ & ഉറക്കഗുളികകൾ</td>
                  <td style="padding: 8px; color: #78350f;">Diazepam, Alprazolam, Codeine ചുമ സിറപ്പുകൾ എന്നിവ ഒറിജിനൽ ഡോക്ടറുടെ പ്രിസ്ക്രിപ്ഷനും ബില്ലും ഇല്ലാതെ കൊണ്ടുവരരുത്.</td>
                </tr>
                <tr style="border-bottom: 1px solid #fee2e2;">
                  <td style="padding: 8px; font-weight: 800; color: #d97706;">ലേബൽ ഇല്ലാത്ത ആയുർവേദ/നാടൻ പൊടികൾ</td>
                  <td style="padding: 8px; color: #78350f;">ഇംഗ്ലീഷിലോ അറബിയിലോ ചേരുവകൾ രേഖപ്പെടുത്താത്ത നാടൻ മരുന്നുകൾ ഡ്രഗ് ടെസ്റ്റിംഗിനായി കസ്റ്റംസ് തടഞ്ഞുവെക്കും.</td>
                </tr>
                <tr style="background: #f0fdf4;">
                  <td style="padding: 8px; font-weight: 800; color: #15803d;">ജീവിതശൈലി മരുന്നുകൾ (BP, Sugar)</td>
                  <td style="padding: 8px; color: #14532d;"><strong>അനുവദനീയം (Safe).</strong> പരമാവധി 3 മാസത്തേക്കുള്ള മരുന്നുകൾ, ഒറിജിനൽ പ്രിസ്ക്രിപ്ഷനും ബില്ലും സഹിതം ഹാൻഡ് ബാഗേജിലോ ലഗേജിലോ കരുതാം.</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Section 5: Saudi SIM Card Balance Codes -->
          <div style="margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; page-break-inside: avoid;">
            <div style="background: #4f46e5; color: #ffffff; padding: 10px 16px; font-weight: 800; font-size: 15px;">
              📱 5. സൗദി സിം കാർഡ് ബാലൻസ് & ഓഫർ കോഡുകൾ (USSD)
            </div>
            <div style="padding: 14px; font-size: 12px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">STC (Sawa)</td><td style="padding: 6px; font-weight: 800; color: #4f46e5;">*166# (ബാലൻസ്)</td><td style="padding: 6px;">കസ്റ്റമർ കെയർ: 900</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">Mobily</td><td style="padding: 6px; font-weight: 800; color: #4f46e5;">*1411# (ബാലൻസ്)</td><td style="padding: 6px;">കസ്റ്റമർ കെയർ: 1100</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">Zain KSA</td><td style="padding: 6px; font-weight: 800; color: #4f46e5;">*142# (ബാലൻസ്)</td><td style="padding: 6px;">കസ്റ്റമർ കെയർ: 959</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">Virgin Mobile</td><td style="padding: 6px; font-weight: 800; color: #4f46e5;">*102# (ബാലൻസ്)</td><td style="padding: 6px;">കസ്റ്റമർ കെയർ: 1789</td></tr>
                <tr><td style="padding: 6px; font-weight: 700;">Salam Mobile</td><td style="padding: 6px; font-weight: 800; color: #4f46e5;">*103# (ബാലൻസ്)</td><td style="padding: 6px;">കസ്റ്റമർ കെയർ: 1101</td></tr>
              </table>
            </div>
          </div>

          <!-- Section 6: NORKA & Pravasi Welfare -->
          <div style="margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; page-break-inside: avoid;">
            <div style="background: #047857; color: #ffffff; padding: 10px 16px; font-weight: 800; font-size: 15px;">
              🏛️ 6. നോർക്ക റൂട്ട്സ് & പ്രവാസി ക്ഷേമനിധി പെൻഷൻ
            </div>
            <div style="padding: 14px; font-size: 12px;">
              <ul style="padding-left: 20px; margin: 0;">
                <li style="margin-bottom: 6px;"><strong>പ്രവാസി ക്ഷേമനിധി പെൻഷൻ:</strong> 60 വയസ്സ് തികഞ്ഞ പ്രവാസികൾക്ക് പ്രതിമാസം ₹3,500/- പെൻഷൻ. വെബ്സൈറ്റ്: pravasiwelfarefund.org</li>
                <li style="margin-bottom: 6px;"><strong>നോർക്ക ഐഡി കാർഡ് & ഇൻഷുറൻസ്:</strong> ₹4 ലക്ഷം വരെയുള്ള അപകട മരണ ഇൻഷുറൻസും അത്യാഹിത സഹായവും. വെബ്സൈറ്റ്: norkaroots.kerala.gov.in</li>
                <li><strong>സാന്ത്വന ധനസഹായം:</strong> രോഗബാധിതരായ പ്രവാസികൾക്ക് ₹50,000/- വരെയുള്ള ഒറ്റത്തവണ ചികിത്സാ സഹായം.</li>
              </ul>
            </div>
          </div>

          <!-- Footer Branding -->
          <div style="text-align: center; border-top: 2px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #64748b;">
            <p style="margin: 0 0 4px; font-weight: 700; color: #047857;">KSA MALAYALI HUB — സൗദി പ്രവാസികൾക്കായി സ്നേഹത്തോടെ സമർപ്പിക്കുന്നു</p>
            <p style="margin: 0;">വെബ്സൈറ്റ് സന്ദർശിക്കൂ: <strong>https://ksa-malayali-hub.vercel.app/</strong> | സഹായങ്ങൾക്ക്: +44 7460 646263</p>
          </div>
        </div>
      `;

      renderElementToPdf(container, "Saudi_Pravasi_Survival_Guide_KSA_Malayali_Hub.pdf", "സൗദി പ്രവാസി സമ്പൂർണ്ണ ഗൈഡ്");
    }, 150);
  };

  // 2. GENERATE: അറബിക് - മലയാളം - ഹിന്ദി നിത്യോപയോഗ വാക്കുകൾ (Full Dictionary PDF)
  window.downloadFullDictionaryPdf = function () {
    showPdfSpinner("അറബിക്-മലയാളം ഡിക്ഷണറി PDF തയ്യാറാക്കുന്നു...", "100+ നിത്യോപയോഗ സംഭാഷണങ്ങളും ഉച്ചാരണങ്ങളും പ്രോസസ്സ് ചെയ്യുന്നു...");

    setTimeout(() => {
      const container = document.createElement("div");
      container.className = "pdf-render-wrapper";
      container.innerHTML = `
        <div style="font-family: 'Noto Sans Malayalam', 'Inter', sans-serif; color: #0f172a; background: #ffffff; padding: 10px; line-height: 1.7; font-size: 12px;">
          <!-- Cover Header -->
          <div style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: #ffffff; padding: 22px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
            <div style="font-size: 26px; margin-bottom: 4px;">🇸🇦 📖 🇮🇳</div>
            <h1 style="margin: 0 0 4px; font-size: 22px; font-weight: 800; color: #ffffff;">അറബിക് - മലയാളം - ഹിന്ദി നിത്യോപയോഗ വാക്കുകൾ</h1>
            <div style="font-size: 12px; color: #fef3c7;">KSA MALAYALI HUB — 4-LANGUAGE EXPATS VOCABULARY GUIDE (2026)</div>
            <p style="margin: 6px auto 0; font-size: 11px; color: #fffbeb; max-width: 600px;">
              സൗദിയിലെ ആശുപത്രികൾ, കടകൾ, ജോലിസ്ഥലം, യാത്ര എന്നിവയിൽ പ്രവാസികൾക്ക് സംസാരിക്കാൻ ആവശ്യമായ പ്രധാന വാക്കുകളും മലയാളം ഉച്ചാരണവും.
            </p>
          </div>

          <!-- Category 1: Greetings -->
          <div style="margin-bottom: 20px; page-break-inside: avoid;">
            <div style="background: #047857; color: #ffffff; padding: 8px 14px; font-weight: 800; font-size: 13px; border-radius: 6px 6px 0 0;">
              1. ആശംസകളും പരിചയപ്പെടലും (Greetings & Basics)
            </div>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; font-size: 11.5px;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left;">
                  <th style="padding: 6px; width: 25%;">മലയാളം</th>
                  <th style="padding: 6px; width: 25%;">അറബിക് ലിപി</th>
                  <th style="padding: 6px; width: 25%;">അറബിക് ഉച്ചാരണം</th>
                  <th style="padding: 6px; width: 25%;">English / Hindi</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">സുഖമാണോ?</td><td style="padding: 6px; font-size: 13px;">كيف حالك؟</td><td style="padding: 6px; color: #047857; font-weight: 700;">കൈഫ ഹാലുക്?</td><td style="padding: 6px;">How are you? / क्या हाल है?</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">സുഖമാണ്, ദൈവത്തിന് സ്തുതി</td><td style="padding: 6px; font-size: 13px;">الحمد لله بخير</td><td style="padding: 6px; color: #047857; font-weight: 700;">അൽഹംദുലില്ലാഹ് ബിഖൈർ</td><td style="padding: 6px;">I am fine / ठीक हूँ</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">സുപ്രഭാതം</td><td style="padding: 6px; font-size: 13px;">صباح الخير</td><td style="padding: 6px; color: #047857; font-weight: 700;">സബാഹുൽ ഖൈർ</td><td style="padding: 6px;">Good Morning / शुभ प्रभात</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">നന്ദി</td><td style="padding: 6px; font-size: 13px;">شكراً جزيلاً</td><td style="padding: 6px; color: #047857; font-weight: 700;">ശുക്റൻ ജസീലം</td><td style="padding: 6px;">Thank you very much / धन्यवाद</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">ദയവായി / Please</td><td style="padding: 6px; font-size: 13px;">لو سمحت / من فضلك</td><td style="padding: 6px; color: #047857; font-weight: 700;">ലൗ സമഹ്ത് / മിൻ ഫദ്ലിക്</td><td style="padding: 6px;">Please / कृपया</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">എനിക്ക് മനസ്സിലായില്ല</td><td style="padding: 6px; font-size: 13px;">أنا ما فهمت</td><td style="padding: 6px; color: #047857; font-weight: 700;">അനാ മാ ഫഹിമ്ത്</td><td style="padding: 6px;">I don't understand / समझ नहीं आया</td></tr>
                <tr><td style="padding: 6px; font-weight: 700;">നിങ്ങളുടെ പേരെന്താണ്?</td><td style="padding: 6px; font-size: 13px;">ما اسمك؟</td><td style="padding: 6px; color: #047857; font-weight: 700;">മ ഇസ്മുക്?</td><td style="padding: 6px;">What is your name? / आपका नाम क्या है?</td></tr>
              </tbody>
            </table>
          </div>

          <!-- Category 2: Shopping & Supermarkets -->
          <div style="margin-bottom: 20px; page-break-inside: avoid;">
            <div style="background: #0284c7; color: #ffffff; padding: 8px 14px; font-weight: 800; font-size: 13px; border-radius: 6px 6px 0 0;">
              2. കടകളിലും സൂപ്പർമാർക്കറ്റുകളിലും (Shopping & Markets)
            </div>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; font-size: 11.5px;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left;">
                  <th style="padding: 6px; width: 25%;">മലയാളം</th>
                  <th style="padding: 6px; width: 25%;">അറബിക് ലിപി</th>
                  <th style="padding: 6px; width: 25%;">അറബിക് ഉച്ചാരണം</th>
                  <th style="padding: 6px; width: 25%;">English / Hindi</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">ഇതിന് എത്രയാണ് വില?</td><td style="padding: 6px; font-size: 13px;">بكم هذا؟ / كم سعره؟</td><td style="padding: 6px; color: #0284c7; font-weight: 700;">ബികം ഹാദാ? / കം സിഅ്റുഹ്?</td><td style="padding: 6px;">How much is this? / इसका दाम क्या है?</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">വില കുറയ്ക്കുമോ?</td><td style="padding: 6px; font-size: 13px;">ممكن تخفيض؟ / ناقص شوية</td><td style="padding: 6px; color: #0284c7; font-weight: 700;">മുംകിൻ തഖ്ഫീദ്? / നാഖിസ് ശുഖയ്യ</td><td style="padding: 6px;">Can you discount? / थोड़ा कम करो</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">ഇത് വളരെ വിലക്കൂടുതലാണ്</td><td style="padding: 6px; font-size: 13px;">هذا غالي جداً</td><td style="padding: 6px; color: #0284c7; font-weight: 700;">ഹാദാ ഗാലീ ജിദ്ദൻ</td><td style="padding: 6px;">This is very expensive / यह बहुत महंगा है</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">ബിൽ / ഇൻവോയ്സ് തരുമോ?</td><td style="padding: 6px; font-size: 13px;">أعطني الفاتورة لو سمحت</td><td style="padding: 6px; color: #0284c7; font-weight: 700;">അഅ്തിനിൽ ഫാതൂറ</td><td style="padding: 6px;">Give me bill / बिल दीजिये</td></tr>
                <tr><td style="padding: 6px; font-weight: 700;">കാർഡ് പേയ്മെന്റ് ഉണ്ടോ?</td><td style="padding: 6px; font-size: 13px;">فيه شبكة / دفع بالبطاقة؟</td><td style="padding: 6px; color: #0284c7; font-weight: 700;">ഫീഹി ശബക്ക / ബിതാഖ?</td><td style="padding: 6px;">Card payment available? / कार्ड चलेगा?</td></tr>
              </tbody>
            </table>
          </div>

          <!-- Category 3: Hospital & Medical -->
          <div style="margin-bottom: 20px; page-break-inside: avoid;">
            <div style="background: #dc2626; color: #ffffff; padding: 8px 14px; font-weight: 800; font-size: 13px; border-radius: 6px 6px 0 0;">
              3. ആശുപത്രിയിലും ക്ലിനിക്കിലും (Hospital & Medical Care)
            </div>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; font-size: 11.5px;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left;">
                  <th style="padding: 6px; width: 25%;">മലയാളം</th>
                  <th style="padding: 6px; width: 25%;">അറബിക് ലിപി</th>
                  <th style="padding: 6px; width: 25%;">അറബിക് ഉച്ചാരണം</th>
                  <th style="padding: 6px; width: 25%;">English / Hindi</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">എനിക്ക് അടിയന്തിര ചികിത്സ വേണം</td><td style="padding: 6px; font-size: 13px;">أحتاج إلى علاج طارئ</td><td style="padding: 6px; color: #dc2626; font-weight: 700;">അഹ്താജു ഇലാ ഇലാജ് താരിഅ്</td><td style="padding: 6px;">I need emergency care / मुझे तुरंत इलाज चाहिए</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">എനിക്ക് നെഞ്ചുവേദനയുണ്ട്</td><td style="padding: 6px; font-size: 13px;">عندي ألم في الصدر</td><td style="padding: 6px; color: #dc2626; font-weight: 700;">ഇന്ദീ അലം ഫിസ്-സ്വദ്ർ</td><td style="padding: 6px;">I have chest pain / सीने में दर्द है</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">എനിക്ക് കഠിനമായ പനിയുണ്ട്</td><td style="padding: 6px; font-size: 13px;">عندي حرارة شديدة</td><td style="padding: 6px; color: #dc2626; font-weight: 700;">ഇന്ദീ ഹറാറ ശദീദ</td><td style="padding: 6px;">I have high fever / तेज़ बुखार है</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">എനിക്ക് ഇൻഷുറൻസ് ഉണ്ട്</td><td style="padding: 6px; font-size: 13px;">عندي تأمين طبي</td><td style="padding: 6px; color: #dc2626; font-weight: 700;">ഇന്ദീ തഅ്മീൻ തിബ്ബീ</td><td style="padding: 6px;">I have medical insurance / मेरे पास बीमा है</td></tr>
                <tr><td style="padding: 6px; font-weight: 700;">ഡോക്ടറെ കാണണം</td><td style="padding: 6px; font-size: 13px;">أريد مقابلة الطبيب</td><td style="padding: 6px; color: #dc2626; font-weight: 700;">ഉരീദു മുഖാബലതത്-ത്വബീബ്</td><td style="padding: 6px;">I want to see doctor / डॉक्टर से मिलना है</td></tr>
              </tbody>
            </table>
          </div>

          <!-- Category 4: Workplace & Labor -->
          <div style="margin-bottom: 20px; page-break-inside: avoid;">
            <div style="background: #4f46e5; color: #ffffff; padding: 8px 14px; font-weight: 800; font-size: 13px; border-radius: 6px 6px 0 0;">
              4. ജോലിസ്ഥലത്തും കമ്പനിയിലും (Workplace & Labor)
            </div>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; font-size: 11.5px;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left;">
                  <th style="padding: 6px; width: 25%;">മലയാളം</th>
                  <th style="padding: 6px; width: 25%;">അറബിക് ലിപി</th>
                  <th style="padding: 6px; width: 25%;">അറബിക് ഉച്ചാരണം</th>
                  <th style="padding: 6px; width: 25%;">English / Hindi</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">എന്റെ ശമ്പളം ലഭിച്ചിട്ടില്ല</td><td style="padding: 6px; font-size: 13px;">لم أستلم راتبي</td><td style="padding: 6px; color: #4f46e5; font-weight: 700;">ലം അസ്തലിം റാതിബീ</td><td style="padding: 6px;">I haven't received salary / मुझे तनख्वाह नहीं मिली</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">ഇഖാമ പുതുക്കി തരുമോ?</td><td style="padding: 6px; font-size: 13px;">متى تجدد الإقامة؟</td><td style="padding: 6px; color: #4f46e5; font-weight: 700;">മതാ തുജദ്ദിദുൽ ഇഖാമ?</td><td style="padding: 6px;">When will Iqama renew? / इकामा कब रिन्यू होगा?</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">എനിക്ക് അവധി വേണം</td><td style="padding: 6px; font-size: 13px;">أحتاج إلى إجازة</td><td style="padding: 6px; color: #4f46e5; font-weight: 700;">അഹ്താജു ഇലാ ഇജാസ</td><td style="padding: 6px;">I need leave / मुझे छुट्टी चाहिए</td></tr>
                <tr><td style="padding: 6px; font-weight: 700;">ജോലി പൂർത്തിയായി</td><td style="padding: 6px; font-size: 13px;">خلصت الشغل / العمل انتهى</td><td style="padding: 6px; color: #4f46e5; font-weight: 700;">ഖല്ലസ്ത് അശ്-ശുഗ്ൽ</td><td style="padding: 6px;">Work is completed / काम खत्म हो गया</td></tr>
              </tbody>
            </table>
          </div>

          <!-- Category 5: Travel & Directions -->
          <div style="margin-bottom: 20px; page-break-inside: avoid;">
            <div style="background: #0d9488; color: #ffffff; padding: 8px 14px; font-weight: 800; font-size: 13px; border-radius: 6px 6px 0 0;">
              5. യാത്രയിലും ടാക്സിയിലും (Travel & Directions)
            </div>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; font-size: 11.5px;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left;">
                  <th style="padding: 6px; width: 25%;">മലയാളം</th>
                  <th style="padding: 6px; width: 25%;">അറബിക് ലിപി</th>
                  <th style="padding: 6px; width: 25%;">അറബിക് ഉച്ചാരണം</th>
                  <th style="padding: 6px; width: 25%;">English / Hindi</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">എനിക്ക് എയർപോർട്ടിലേക്ക് പോകണം</td><td style="padding: 6px; font-size: 13px;">وديني المطار لو سمحت</td><td style="padding: 6px; color: #0d9488; font-weight: 700;">വദ്ദീനിൽ മതാർ</td><td style="padding: 6px;">Take me to airport / मुझे एयरपोर्ट जाना है</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">നേരെ പോവുക</td><td style="padding: 6px; font-size: 13px;">روح على طول / سيده</td><td style="padding: 6px; color: #0d9488; font-weight: 700;">റൂഹ് അലാ തൂൽ / സീദ</td><td style="padding: 6px;">Go straight / सीधे जाओ</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px; font-weight: 700;">വലത്തോട്ട് / ഇടത്തോട്ട് തിരിയുക</td><td style="padding: 6px; font-size: 13px;">لف يمين / لف يسار</td><td style="padding: 6px; color: #0d9488; font-weight: 700;">ലിഫ് യമീൻ / ലിഫ് യസാർ</td><td style="padding: 6px;">Turn right / Turn left / दायें / बायें मुड़ो</td></tr>
                <tr><td style="padding: 6px; font-weight: 700;">ഇവിടെ നിർത്തുക</td><td style="padding: 6px; font-size: 13px;">وقف هنا لو سمحت</td><td style="padding: 6px; color: #0d9488; font-weight: 700;">വഖിഫ് ഹുനാ ലൗ സമഹ്ത്</td><td style="padding: 6px;">Stop here please / यहाँ रोकिये</td></tr>
              </tbody>
            </table>
          </div>

          <!-- Footer Branding -->
          <div style="text-align: center; border-top: 2px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #64748b;">
            <p style="margin: 0 0 4px; font-weight: 700; color: #d97706;">KSA MALAYALI HUB — 4-LANGUAGE PRAVASI PHRASEBOOK & DICTIONARY</p>
            <p style="margin: 0;">സൗജന്യമായി ഡൗൺലോഡ് ചെയ്യൂ: <strong>https://ksa-malayali-hub.vercel.app/</strong> | By D&J (+44 7460 646263)</p>
          </div>
        </div>
      `;

      renderElementToPdf(container, "Arabic_Malayalam_Hindi_Dictionary_KSA_Malayali_Hub.pdf", "അറബിക്-മലയാളം നിത്യോപയോഗ ഡിക്ഷണറി");
    }, 150);
  };

  // 3. GENERATE: E-Library Full Book PDF (Light-Mode Print-Ready & Non-Blank Guarantee)
  window.realDownloadBookPdf = window.downloadBookPdf = async function (bookId) {
    const books = window.MALAYALAM_LIBRARY_DATA || window.LIBRARY_DATA || [];
    const book = books.find((b) => String(b.id) === String(bookId));
    if (!book) {
      showToast("പുസ്തകം കണ്ടെത്താനായില്ല.", "error");
      return;
    }

    showPdfSpinner(`'${book.title}' PDF തയ്യാറാക്കുന്നു...`, `${book.author} രചിച്ച കൃതി ഡിജിറ്റലായി രൂപപ്പെടുത്തുന്നു. ദയവായി അല്പം കാത്തിരിക്കൂ...`);

    try {
      // Ensure Malayalam and web fonts are fully loaded before rendering
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
    } catch (e) {
      console.warn("Fonts ready check:", e);
    }

    setTimeout(() => {
      const container = document.createElement("div");
      container.className = "pdf-render-wrapper light-pdf-document";
      // Force strict light-mode print styles with white background and dark text (#111827)
      container.style.cssText = "position: fixed; left: 0; top: 0; width: 794px; background: #ffffff !important; color: #111827 !important; z-index: -9999; padding: 24px 28px; box-sizing: border-box; font-family: 'Noto Sans Malayalam', 'Inter', sans-serif;";

      const cleanContent = (book.full_content || book.summary || "")
        .split("\n\n")
        .map(p => `<p style="margin: 0 0 14px; line-height: 1.85; text-align: justify; color: #1f2937 !important;">${p.replace(/\n/g, "<br>")}</p>`)
        .join("");

      container.innerHTML = `
        <div style="font-family: 'Noto Sans Malayalam', 'Inter', sans-serif; color: #111827 !important; background: #ffffff !important; line-height: 1.8; font-size: 13.5px;">
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #047857 0%, #064e3b 100%) !important; color: #ffffff !important; padding: 22px 24px; border-radius: 12px; margin-bottom: 22px; text-align: center; border: 2px solid #d97706;">
            <div style="display: inline-block; background: rgba(255,255,255,0.2) !important; color: #ffffff !important; padding: 3px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; margin-bottom: 8px;">
              ${book.category_label || "മലയാള സാഹിത്യം"} · ${book.yearOrType || ""}
            </div>
            <h1 style="margin: 0 0 6px; font-size: 26px; font-weight: 800; color: #fef08a !important;">${book.title}</h1>
            <div style="font-size: 14px; font-weight: 700; color: #f8fafc !important; margin-bottom: 6px;">✍️ രചന: ${book.author} ${book.author_en ? `(${book.author_en})` : ""}</div>
            <div style="font-size: 11px; color: #cbd5e1 !important;">
              ⭐ ${book.rating ? book.rating.toFixed(1) : "5.0"} / 5.0 · 📄 ${book.pages || "200+"} പേജുകൾ · 🏷️ ബുക്ക് #${book.id}
            </div>
          </div>

          <!-- Summary Box -->
          <div style="background: #f8fafc !important; border-left: 4px solid #047857 !important; padding: 14px 18px; border-radius: 0 8px 8px 0; margin-bottom: 22px; font-size: 13px;">
            <div style="font-weight: 800; color: #047857 !important; margin-bottom: 4px;">📖 സംഗ്രഹം (Synopsis):</div>
            <p style="margin: 0; color: #374151 !important; line-height: 1.75;">${book.summary}</p>
          </div>

          <!-- Full Content / Excerpt -->
          <div style="margin-bottom: 28px;">
            <div style="font-size: 16px; font-weight: 800; color: #111827 !important; border-bottom: 2px solid #e5e7eb !important; padding-bottom: 8px; margin-bottom: 16px;">
              ${book.id > 90 ? "സമ്പൂർണ്ണ ഗൈഡ് വിവരങ്ങൾ (Full Guide)" : "ഗ്രന്ഥ വിവരണം & പ്രാരംഭ ഭാഗങ്ങൾ (Book Overview)"}
            </div>
            <div style="font-size: 13.5px; color: #1f2937 !important;">
              ${cleanContent}
            </div>
            ${book.id <= 90 ? `
              <div style="margin-top: 18px; padding: 12px; background: #ecfdf5 !important; border-radius: 8px; border: 1px dashed #059669 !important; text-align: center; font-size: 12px; color: #065f46 !important;">
                ഈ കൃതിയുടെ പൂർണ്ണ ഭാഗങ്ങൾ മലയാളം വിക്കിഗ്രന്ഥശാലയിൽ വായിക്കാം: <strong>${book.readUrl}</strong>
              </div>
            ` : ""}
          </div>

          <!-- Footer -->
          <div style="text-align: center; border-top: 2px solid #e5e7eb !important; padding-top: 14px; font-size: 11px; color: #6b7280 !important; page-break-inside: avoid;">
            <p style="margin: 0 0 4px; font-weight: 700; color: #047857 !important;">KSA MALAYALI HUB — 100-BOOK MALAYALAM E-LIBRARY</p>
            <p style="margin: 0; color: #6b7280 !important;">സൗജന്യ ഓൺലൈൻ വായനശാല: <strong>https://ksa-malayali-hub.vercel.app/explore?tab=library</strong></p>
          </div>
        </div>
      `;

      document.body.appendChild(container);

      const safeFilename = `${(book.title_en || book.title).replace(/[^a-zA-Z0-9]/g, "_")}_KSA_Malayali_Hub.pdf`;

      const opt = {
        margin: [8, 8, 8, 8],
        filename: safeFilename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          backgroundColor: "#ffffff"
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy", "avoid-all"] }
      };

      if (typeof window.html2pdf === "function") {
        window.html2pdf()
          .set(opt)
          .from(container)
          .save()
          .then(() => {
            container.remove();
            hidePdfSpinner();
            showToast(`'${book.title}' PDF വിജയകരമായി ഡൗൺലോഡ് ചെയ്തു! ✅`);
          })
          .catch((err) => {
            console.error("html2pdf generation error:", err);
            container.remove();
            hidePdfSpinner();
            showToast("PDF ഡൗൺലോഡ് ചെയ്യുന്നതിൽ തടസ്സം നേരിട്ടു. പ്രിന്റ് ഓപ്ഷൻ തുറക്കുന്നു...", "info");
            window.print();
          });
      } else {
        container.remove();
        renderElementToPdf(container, safeFilename, book.title);
      }
    }, 200);
  };
})();
