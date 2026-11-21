// KSA Malayali Hub — Pravasi Sahayi Interactive Engine
(function() {
  // Path normalizer for root-relative links if hosted on GitHub Pages with subpath
  function normalizeLinks() {
    const path = window.location.pathname;
    const isGitHub = window.location.hostname.includes("github.io");
    const repoMatch = path.match(/^(\/[^\/]+)\//);
    const prefix = isGitHub && repoMatch ? repoMatch[1] : "";
    if (prefix) {
      document.querySelectorAll("a[href^='/']").forEach(a => {
        const href = a.getAttribute("href");
        if (!href.startsWith(prefix) && href !== "#") {
          let target = prefix + href;
          if (href !== "/" && !target.endsWith(".html") && !target.endsWith("/")) {
            target += ".html";
          } else if (href === "/") {
            target = prefix + "/";
          }
          a.setAttribute("href", target);
        }
      });
    }
  }

  // EOSB / Gratuity Calculator Logic
  function initEosbCalc() {
    const salaryInput = document.getElementById("eosb-salary");
    const yearsInput = document.getElementById("eosb-years");
    const monthsInput = document.getElementById("eosb-months");
    const reasonButtons = document.querySelectorAll(".calc-radio-btn");
    const calcBtn = document.getElementById("eosb-calc-btn");
    const resultBox = document.getElementById("eosb-result-box");
    
    if (!salaryInput || !calcBtn || !resultBox) return;

    let selectedReason = "termination"; // default: Article 84 (Termination / Contract End)

    reasonButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        reasonButtons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedReason = btn.getAttribute("data-reason") || "termination";
        calculateEosb();
      });
    });

    calcBtn.addEventListener("click", calculateEosb);
    salaryInput.addEventListener("input", calculateEosb);
    yearsInput.addEventListener("input", calculateEosb);
    if (monthsInput) monthsInput.addEventListener("input", calculateEosb);

    function calculateEosb() {
      const salary = parseFloat(salaryInput.value) || 0;
      const years = parseFloat(yearsInput.value) || 0;
      const months = monthsInput ? (parseFloat(monthsInput.value) || 0) : 0;
      const totalYears = Math.max(0, years + (months / 12));

      if (salary <= 0 || totalYears <= 0) {
        resultBox.style.display = "none";
        return;
      }

      // Base calculation: Art. 84
      // Half month wage for first 5 years, 1 full month wage for each year after
      const first5Years = Math.min(totalYears, 5);
      const after5Years = Math.max(0, totalYears - 5);
      const baseFirst5 = first5Years * (salary / 2.0);
      const baseAfter5 = after5Years * salary;
      const totalBase = baseFirst5 + baseAfter5;

      let finalEosb = 0;
      let reasonRatio = 1.0;
      let ratioExplanation = "";

      if (selectedReason === "termination") {
        finalEosb = totalBase;
        reasonRatio = 1.0;
        ratioExplanation = "100% (ആർട്ടിക്കിൾ 84 - കരാർ പൂർത്തിയായി / പിരിച്ചുവിടൽ)";
      } else {
        // Resignation (Article 85)
        if (totalYears < 2) {
          finalEosb = 0;
          reasonRatio = 0;
          ratioExplanation = "0% (ആർട്ടിക്കിൾ 85 പ്രകാരം 2 വർഷത്തിൽ താഴെ സേവനമുള്ളപ്പോൾ രാജി വെച്ചാൽ ആനുകൂല്യം ലഭിക്കില്ല)";
        } else if (totalYears < 5) {
          finalEosb = totalBase * (1.0 / 3.0);
          reasonRatio = 1.0 / 3.0;
          ratioExplanation = "33.3% (ആർട്ടിക്കിൾ 85 പ്രകാരം 2 മുതൽ 5 വർഷം വരെ സേവനത്തിൽ മൂന്നിലൊന്ന് ഭാഗം)";
        } else if (totalYears < 10) {
          finalEosb = totalBase * (2.0 / 3.0);
          reasonRatio = 2.0 / 3.0;
          ratioExplanation = "66.7% (ആർട്ടിക്കിൾ 85 പ്രകാരം 5 മുതൽ 10 വർഷം വരെ സേവനത്തിൽ മൂന്നിൽ രണ്ട് ഭാഗം)";
        } else {
          finalEosb = totalBase;
          reasonRatio = 1.0;
          ratioExplanation = "100% (ആർട്ടിക്കിൾ 85 പ്രകാരം 10 വർഷത്തിൽ കൂടുതൽ സേവനത്തിന് മുഴുവൻ തുകയും)";
        }
      }

      // Live exchange rate estimation (approx 22.6 INR per SAR)
      const approxInr = Math.round(finalEosb * 22.6);

      // Render Results
      const resTotalSar = document.getElementById("res-total-sar");
      const resTotalInr = document.getElementById("res-total-inr");
      const resFirst5Val = document.getElementById("res-first5-val");
      const resAfter5Val = document.getElementById("res-after5-val");
      const resRatioDesc = document.getElementById("res-ratio-desc");

      if (resTotalSar) resTotalSar.textContent = Math.round(finalEosb).toLocaleString("en-IN") + " SAR";
      if (resTotalInr) resTotalInr.textContent = "₹ " + approxInr.toLocaleString("en-IN") + " (ഏകദേശം)";
      if (resFirst5Val) resFirst5Val.textContent = Math.round(baseFirst5).toLocaleString("en-IN") + " SAR";
      if (resAfter5Val) resAfter5Val.textContent = Math.round(baseAfter5).toLocaleString("en-IN") + " SAR";
      if (resRatioDesc) resRatioDesc.textContent = ratioExplanation;

      resultBox.style.display = "flex";
    }

    // Run initial calc
    calculateEosb();
  }

  // Accordion Expand / Collapse
  function initAccordions() {
    document.querySelectorAll(".accordion-header").forEach(header => {
      header.addEventListener("click", () => {
        const item = header.closest(".accordion-item");
        if (item) {
          item.classList.toggle("open");
        }
      });
    });
  }

  // DOM ready init
  document.addEventListener("DOMContentLoaded", () => {
    normalizeLinks();
    initEosbCalc();
    initAccordions();
  });
})();
