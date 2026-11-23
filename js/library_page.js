// KSA Malayali Hub — Dedicated Malayalam E-Library Page Script
(function () {
  "use strict";

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLibraryPage();
  });

  function initLibraryPage() {
    const grid = document.getElementById("lib-books-grid");
    const searchInput = document.getElementById("lib-search");
    const countBadge = document.getElementById("lib-count-badge");
    const catButtons = document.querySelectorAll(".lib-cat-btn");

    if (!grid) return;

    const allBooks = window.MALAYALAM_LIBRARY_DATA || window.LIBRARY_DATA || [];
    let currentCategory = "all";
    let searchQuery = "";

    // Category button click handling
    catButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        catButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.getAttribute("data-cat") || "all";
        renderBooks();
      });
    });

    // Search input handling
    if (searchInput) {
      ["input", "change", "keyup"].forEach((evt) => {
        searchInput.addEventListener(evt, (e) => {
          searchQuery = e.target.value.trim().toLowerCase();
          renderBooks();
        });
      });
    }

    renderBooks();

    function renderBooks() {
      const filtered = allBooks.filter((book) => {
        // Category check
        if (currentCategory !== "all") {
          if (book.category !== currentCategory) {
            if (!(currentCategory === "history" && book.category === "travel")) {
              return false;
            }
          }
        }

        // Search check
        if (searchQuery) {
          const tMl = (book.title || "").toLowerCase();
          const tEn = (book.englishTitle || book.title_en || "").toLowerCase();
          const aMl = (book.author || "").toLowerCase();
          const aEn = (book.author_en || "").toLowerCase();
          const sm = (book.summary || "").toLowerCase();
          const id = String(book.id);

          return (
            tMl.includes(searchQuery) ||
            tEn.includes(searchQuery) ||
            aMl.includes(searchQuery) ||
            aEn.includes(searchQuery) ||
            sm.includes(searchQuery) ||
            id === searchQuery
          );
        }

        return true;
      });

      if (countBadge) {
        countBadge.textContent = `${filtered.length} പുസ്തകങ്ങൾ`;
      }

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column:1 / -1; text-align:center; padding:48px 20px; background:var(--surface); border:1px dashed var(--border); border-radius:16px;">
            <div style="font-size:2.5rem; margin-bottom:12px;">🔍</div>
            <h3 style="color:var(--text); margin:0 0 6px;">പുസ്തകങ്ങൾ ഒന്നും കണ്ടെത്തിയില്ല</h3>
            <p style="color:var(--text-secondary); font-size:0.9rem; margin:0;">ദയവായി മറ്റൊരു പേര് തിരയുകയോ മറ്റൊരു കാറ്റഗറി തിരഞ്ഞെടുക്കുകയോ ചെയ്യുക.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered
        .map((book) => {
          const eng = book.englishTitle || book.title_en || "";
          const yr =
            book.year ||
            (book.yearOrType
              ? book.yearOrType.match(/\b\d{4}\b/)
                ? book.yearOrType.match(/\b\d{4}\b/)[0]
                : ""
              : "");
          const metaParts = [eng, yr].filter(Boolean);
          const metaStr = metaParts.length
            ? `<span style="opacity:0.85; font-size:0.82rem;">(${escapeHtml(metaParts.join(" · "))})</span>`
            : "";

          const readUrl = book.readUrl || "https://ml.wikisource.org";
          const archiveUrl =
            book.archiveUrl ||
            `https://archive.org/search.php?query=${encodeURIComponent((book.englishTitle || book.title) + " malayalam")}`;
          const isPravasi = book.category === "pravasi" || book.id > 90;

          return `
            <article class="lib-book-card">
              <div class="lib-book-top">
                <span class="lib-book-cat">${escapeHtml(book.category_label || "വായന")}</span>
                <span class="lib-book-id">#${book.id}</span>
              </div>

              <h3 class="lib-book-title">${escapeHtml(book.title)}</h3>
              <p class="lib-book-author">✍️ ${escapeHtml(book.author)} ${metaStr}</p>
              <p class="lib-book-summary">${escapeHtml(book.summary || "")}</p>

              <div class="lib-book-actions">
                <a 
                  href="${readUrl}" 
                  ${isPravasi ? "" : 'target="_blank" rel="noopener noreferrer"'} 
                  class="lib-btn-read" 
                  title="${isPravasi ? "ഗൈഡ് കാണുക" : "ഓൺലൈനിൽ വായിക്കുക (New Tab)"}"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                  <span>${isPravasi ? "📖 ഗൈഡ് കാണുക ↗" : "📖 വായിക്കാം ↗"}</span>
                </a>

                <a 
                  href="${archiveUrl}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="lib-btn-archive" 
                  title="Internet Archive-ൽ തിരയുക (New Tab)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                  <span>🏛️ ആർക്കൈവ് ↗</span>
                </a>
              </div>
            </article>
          `;
        })
        .join("");
    }
  }
})();
