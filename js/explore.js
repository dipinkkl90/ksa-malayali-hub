/**
 * KSA Malayali Hub — Explorer Hub Controller (/explore)
 * Handles 3 Tabs: E-Library, Tourism & Hidden Spots, Heritage & Agriculture
 * Enhanced with Real Full PDF Downloads and Direct Book Opening
 */

(function () {
  "use strict";

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Elements
  const tabBtns = document.querySelectorAll(".explore-tab-btn");
  const tabPanes = document.querySelectorAll(".explore-tab-pane");
  const subNavPills = document.querySelectorAll(".sub-nav-pill");

  // 1. Tab Switching Logic with URL Sync
  function switchTab(tabId) {
    if (!tabId) tabId = "library";

    tabBtns.forEach((btn) => {
      const isTarget = btn.getAttribute("data-tab") === tabId;
      btn.classList.toggle("active", isTarget);
      btn.setAttribute("aria-selected", isTarget ? "true" : "false");
    });

    tabPanes.forEach((pane) => {
      const isTarget = pane.id === `tab-${tabId}`;
      pane.classList.toggle("active", isTarget);
    });

    // Update Sub-Nav Pill
    subNavPills.forEach((pill) => {
      const subType = pill.getAttribute("data-sub");
      pill.classList.toggle("active", subType === tabId);
    });

    // Update URL without page reload
    const url = new URL(window.location);
    url.searchParams.set("tab", tabId);
    window.history.replaceState({}, "", url);
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      switchTab(target);
    });
  });

  // Initial tab from URL parameter or hash
  const initialParams = new URLSearchParams(window.location.search);
  const initialTab = initialParams.get("tab") || window.location.hash.replace("#", "") || "library";
  switchTab(initialTab);

    // 2. Tab 1: Render Digital Books from window.MALAYALAM_LIBRARY_DATA
  function initLibrary() {
    const booksContainer = document.getElementById("library-books-grid");
    const searchInput = document.getElementById("library-search");
    const tabsContainer = document.getElementById("library-category-tabs");
    const loadMoreWrap = document.getElementById("library-load-more-wrap");
    const loadMoreBtn = document.getElementById("library-load-more-btn");
    const books = window.MALAYALAM_LIBRARY_DATA || window.LIBRARY_DATA || window.LIBRARY_BOOKS || [];

    if (!booksContainer) return;

    let activeCategory = "all";
    let searchQuery = "";
    const PAGE_SIZE = 20;
    let currentLimit = PAGE_SIZE;

    const CATEGORIES = [
      { id: "all", label: "എല്ലാം" },
      { id: "pravasi", label: "പ്രവാസി ഗൈഡുകൾ" },
      { id: "novels", label: "നോവലുകൾ" },
      { id: "stories", label: "കഥകൾ & ഹാസ്യം" },
      { id: "poetry", label: "കവിതകൾ" },
      { id: "classics", label: "ക്ലാസിക്കുകൾ & മാപ്പിളപ്പാട്ട്" },
      { id: "history", label: "ചരിത്രം & യാത്ര" }
    ];

    function renderCategoryTabs() {
      if (!tabsContainer) return;
      const counts = { all: books.length };
      books.forEach((b) => {
        counts[b.category] = (counts[b.category] || 0) + 1;
      });

      tabsContainer.innerHTML = CATEGORIES.map((cat) => {
        const count = counts[cat.id] || 0;
        const isActive = activeCategory === cat.id ? "active" : "";
        return `<button type="button" class="sub-nav-pill library-cat-btn ${isActive}" data-cat="${cat.id}">${cat.label} (${count})</button>`;
      }).join("");

      tabsContainer.querySelectorAll(".library-cat-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          tabsContainer.querySelectorAll(".library-cat-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          activeCategory = btn.getAttribute("data-cat") || "all";
          currentLimit = PAGE_SIZE;
          renderBooks();
        });
      });
    }

    function renderBooks() {
      const filtered = books.filter((b) => {
        let matchesCat = activeCategory === "all" || b.category === activeCategory;
        if (activeCategory === "travel" && b.category === "history") matchesCat = true;
        if (!matchesCat) return false;
        if (!searchQuery) return true;

        const q = searchQuery;
        const t = (b.title || "").toLowerCase();
        const a = (b.author || "").toLowerCase();
        const te = (b.englishTitle || b.title_en || "").toLowerCase();
        const ae = (b.author_en || "").toLowerCase();
        const cat = (b.category_label || "").toLowerCase();
        const sm = (b.summary || "").toLowerCase();
        const id = String(b.id);

        return t.includes(q) || a.includes(q) || te.includes(q) || ae.includes(q) || cat.includes(q) || sm.includes(q) || id === q;
      });

      if (filtered.length === 0) {
        booksContainer.innerHTML = `
          <div style="grid-column:1/-1; text-align:center; padding:48px 20px; background:var(--surface); border-radius:16px; border:1px solid var(--border);">
            <span style="font-size:2.8rem; display:block; margin-bottom:12px;">🔍</span>
            <h4 style="color:var(--text); font-size:1.15rem; font-weight:800; margin:0 0 8px;">പുസ്തകങ്ങൾ കണ്ടെത്താനായില്ല</h4>
            <p style="color:var(--text-secondary); font-size:0.9rem; margin:0;">മറ്റൊരു വാക്കോ എഴുത്തുകാരന്റെ പേരോ തിരഞ്ഞു നോക്കൂ.</p>
          </div>
        `;
        if (loadMoreWrap) loadMoreWrap.style.display = "none";
        return;
      }

      const visibleBooks = filtered.slice(0, currentLimit);

      booksContainer.innerHTML = visibleBooks
        .map((book) => {
          const eng = book.englishTitle || book.title_en || "";
          const yr = book.year || (book.yearOrType ? (book.yearOrType.match(/\b\d{4}\b/) ? book.yearOrType.match(/\b\d{4}\b/)[0] : "") : "");
          const metaParts = [eng, yr].filter(Boolean);
          const metaStr = metaParts.length ? `<span style="opacity:0.85;">(${escapeHtml(metaParts.join(" · "))})</span>` : "";

          return `
            <div class="library-card" data-book-id="${book.id}" role="button" tabindex="0" style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between; transition:transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease; cursor:pointer;">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                  <span style="background:rgba(4,120,87,0.12); color:#047857; font-size:0.75rem; font-weight:800; padding:3px 10px; border-radius:999px; border:1px solid rgba(4,120,87,0.25);">${escapeHtml(book.category_label || "വായന")}</span>
                  <span style="font-size:0.78rem; color:var(--text-muted); font-weight:700; background:rgba(255,255,255,0.06); padding:2px 8px; border-radius:6px;">#${book.id}</span>
                </div>
                <h4 style="font-size:1.18rem; font-weight:800; color:var(--text); margin:4px 0 6px; line-height:1.35;">${escapeHtml(book.title)}</h4>
                <p style="font-size:0.86rem; color:var(--text-muted); margin:0 0 10px; font-weight:600;">✍️ ${escapeHtml(book.author)} ${metaStr}</p>
                <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6; margin:0 0 16px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">${escapeHtml(book.summary || "")}</p>
              </div>
              <div style="display:flex; gap:8px; margin-top:10px;">
                <button type="button" class="airport-action-btn view-book-btn" data-id="${book.id}" style="flex:1; margin:0; padding:10px 12px; font-size:0.85rem; font-weight:700;">
                  <span>📖 വായിക്കാം</span>
                </button>
                <button type="button" class="airport-action-btn pdf-book-btn" data-id="${book.id}" style="flex:1; margin:0; padding:10px 12px; font-size:0.85rem; font-weight:700; background:linear-gradient(135deg,#047857,#065f46); color:#fff; border-color:#047857;">
                  <span>⬇️ PDF</span>
                </button>
              </div>
            </div>
          `;
        })
        .join("");

      // Update Load More button
      if (loadMoreWrap && loadMoreBtn) {
        if (currentLimit < filtered.length) {
          loadMoreWrap.style.display = "block";
          const remaining = filtered.length - currentLimit;
          loadMoreBtn.querySelector("span").textContent = `കൂടുതൽ കാണുക (${remaining} പുസ്തകങ്ങൾ ബാക്കി) ⬇️`;
        } else {
          loadMoreWrap.style.display = "none";
        }
      }

      // Add event listeners for whole card clicks
      booksContainer.querySelectorAll(".library-card").forEach((card) => {
        card.addEventListener("click", (e) => {
          if (e.target.closest(".pdf-book-btn")) return;
          const bookId = card.getAttribute("data-book-id");
          const found = books.find((b) => String(b.id) === String(bookId));
          if (found) openBookModal(found);
        });
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            if (e.target.closest(".pdf-book-btn")) return;
            e.preventDefault();
            const bookId = card.getAttribute("data-book-id");
            const found = books.find((b) => String(b.id) === String(bookId));
            if (found) openBookModal(found);
          }
        });
      });

      // Add event listeners for reading modal button
      booksContainer.querySelectorAll(".view-book-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const bookId = btn.getAttribute("data-id");
          const found = books.find((b) => String(b.id) === String(bookId));
          if (found) openBookModal(found);
        });
      });

      // Add event listeners for PDF download button
      booksContainer.querySelectorAll(".pdf-book-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const bookId = btn.getAttribute("data-id");
          if (typeof window.downloadBookPdf === "function") {
            window.downloadBookPdf(bookId);
          }
        });
      });
    }

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        currentLimit += PAGE_SIZE;
        renderBooks();
      });
    }

    if (searchInput) {
      ["input", "change", "keyup"].forEach((evt) => {
        searchInput.addEventListener(evt, (e) => {
          searchQuery = e.target.value.trim().toLowerCase();
          currentLimit = PAGE_SIZE;
          renderBooks();
        });
      });
    }

    renderCategoryTabs();
    renderBooks();

    // Auto open if book query parameter provided
    const bookParam = initialParams.get("book");
    if (bookParam) {
      const targetBook = books.find((b) => String(b.id) === String(bookParam));
      if (targetBook) {
        setTimeout(() => openBookModal(targetBook), 300);
      }
    }
  }

  // Book Reader Modal
  let currentActiveBook = null;

  function openBookModal(book) {
    currentActiveBook = book;
    let modal = document.getElementById("book-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "book-modal";
      modal.className = "modal-backdrop";
      modal.innerHTML = `
        <div class="modal-card" style="max-width:760px; max-height:88vh; display:flex; flex-direction:column; position:relative; overflow:hidden; border-radius:18px;">
          <!-- Modal Header -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--border); padding:16px 20px; flex-shrink:0;">
            <div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                <span id="bm-badge" style="background:#047857; color:#fff; font-size:0.75rem; font-weight:800; padding:3px 10px; border-radius:6px;"></span>
                <span id="bm-year" style="font-size:0.8rem; color:var(--text-muted); font-weight:700;"></span>
              </div>
              <h3 id="bm-title" style="font-size:1.35rem; font-weight:800; color:var(--text); margin:0 0 4px; line-height:1.3;"></h3>
              <p id="bm-author" style="font-size:0.88rem; color:var(--text-secondary); margin:0; font-weight:600;"></p>
            </div>
            <button type="button" id="bm-close" class="modal-close-btn" aria-label="Close" style="width:36px; height:36px; border-radius:50%; border:1px solid var(--border); background:var(--surface); color:var(--text); font-size:1.1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0;">✕</button>
          </div>

          <!-- Modal Body (Scrollable) -->
          <div id="bm-body" style="overflow-y:auto; line-height:1.85; font-size:0.96rem; color:var(--text); padding:20px; flex-grow:1;"></div>

          <!-- Sticky Bottom Bar with 3 working buttons -->
          <div style="position:sticky; bottom:0; left:0; right:0; background:var(--surface); border-top:1px solid var(--border); padding:12px 18px; display:flex; flex-wrap:wrap; gap:10px; justify-content:space-between; align-items:center; z-index:10; box-shadow:0 -4px 12px rgba(0,0,0,0.06);">
            <a id="bm-read-btn" href="#" target="_blank" rel="noopener noreferrer" class="airport-action-btn" style="flex:1; min-width:140px; margin:0; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:6px; background:rgba(4,120,87,0.1); color:#047857; border:1px solid rgba(4,120,87,0.3); font-weight:700; padding:10px 14px; border-radius:10px;">
              <span>📖 മുഴുവൻ വായിക്കാം ↗</span>
            </a>
            <button type="button" id="bm-download-btn" class="airport-action-btn" style="flex:1; min-width:140px; margin:0; display:inline-flex; align-items:center; justify-content:center; gap:6px; background:linear-gradient(135deg,#047857,#065f46); color:#fff; border:1px solid #047857; font-weight:700; padding:10px 14px; border-radius:10px; cursor:pointer;">
              <span>⬇️ PDF ഡൗൺലോഡ്</span>
            </button>
            <button type="button" id="bm-bottom-close-btn" class="airport-action-btn" style="flex:1; min-width:110px; margin:0; display:inline-flex; align-items:center; justify-content:center; gap:6px; background:var(--surface); color:var(--text); border:1px solid var(--border); font-weight:700; padding:10px 14px; border-radius:10px; cursor:pointer;">
              <span>✕ അടയ്ക്കുക</span>
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      function closeModal() {
        modal.classList.remove("open");
        document.body.style.overflow = "";
      }

      modal.querySelector("#bm-close").addEventListener("click", closeModal);
      modal.querySelector("#bm-bottom-close-btn").addEventListener("click", closeModal);

      modal.querySelector("#bm-download-btn").addEventListener("click", () => {
        if (currentActiveBook && typeof window.downloadBookPdf === "function") {
          window.downloadBookPdf(currentActiveBook.id);
        }
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
          closeModal();
        }
      });
    }

    const eng = book.englishTitle || book.title_en || "";
    const yr = book.year || (book.yearOrType ? (book.yearOrType.match(/\b\d{4}\b/) ? book.yearOrType.match(/\b\d{4}\b/)[0] : "") : "");
    modal.querySelector("#bm-badge").textContent = `${book.category_label || "വായന"} · #${book.id}`;
    modal.querySelector("#bm-year").textContent = yr ? yr : (book.yearOrType || "");
    modal.querySelector("#bm-title").textContent = book.title || "";
    modal.querySelector("#bm-author").textContent = `✍️ ${book.author || ""}${eng ? ` (${eng})` : ""} · 📄 ${book.pages || "180"} പേജുകൾ · ⭐ ${typeof book.rating === "number" ? book.rating.toFixed(1) : "4.8"}`;

    const isPravasi = book.category === "pravasi" || book.id > 90;
    const bodyEl = modal.querySelector("#bm-body");
    const readBtn = modal.querySelector("#bm-read-btn");

    if (isPravasi) {
      bodyEl.innerHTML = `
        <div style="background:rgba(4,120,87,0.08); border-left:4px solid #047857; padding:14px 18px; border-radius:0 10px 10px 0; margin-bottom:18px;">
          <strong style="color:#047857; display:block; margin-bottom:4px;">📘 ഒറിജിനൽ പ്രവാസി ഗൈഡ്:</strong>
          <span style="color:var(--text); font-size:0.92rem;">${escapeHtml(book.summary || "")}</span>
        </div>
        <div style="white-space:pre-line; color:var(--text); font-size:0.96rem; line-height:1.85;">${escapeHtml(book.full_content || book.summary || "")}</div>
      `;
      readBtn.removeAttribute("href");
      readBtn.removeAttribute("target");
      readBtn.removeAttribute("rel");
      readBtn.querySelector("span").textContent = "📖 മുഴുവൻ ഗൈഡ് (ഇവിടെ വായിക്കാം)";
      readBtn.onclick = (e) => {
        e.preventDefault();
        bodyEl.scrollTo({ top: 0, behavior: "smooth" });
      };
    } else {
      bodyEl.innerHTML = `
        <div style="background:rgba(217,119,6,0.08); border-left:4px solid #d97706; padding:14px 18px; border-radius:0 10px 10px 0; margin-bottom:18px;">
          <strong style="color:#d97706; display:block; margin-bottom:4px;">📖 സംഗ്രഹം (Synopsis):</strong>
          <span style="color:var(--text); font-size:0.92rem;">${escapeHtml(book.summary || "")}</span>
        </div>
        <div style="white-space:pre-line; color:var(--text); font-size:0.96rem; line-height:1.85; margin-bottom:20px;">${escapeHtml(book.full_content || book.summary || "")}</div>
        <div style="text-align:center; padding:16px 20px; background:var(--surface); border:1px dashed var(--border); border-radius:12px; margin-top:16px;">
          <p style="margin:0 0 10px; font-weight:700; color:var(--text);">ഈ ക്ലാസിക് കൃതി പകർപ്പവകാശ മുക്തമായി (Public Domain) മലയാളം വിക്കിഗ്രന്ഥശാലയിൽ പൂർണ്ണമായി വായിക്കാം:</p>
          <a href="${book.readUrl}" target="_blank" rel="noopener noreferrer" class="nav-btn nav-btn-primary" style="display:inline-flex; align-items:center; gap:8px; text-decoration:none; padding:10px 22px; border-radius:999px;">
            <span>📖 വിക്കിഗ്രന്ഥശാലയിൽ പൂർണ്ണ ഗ്രന്ഥം വായിക്കുക ↗</span>
          </a>
        </div>
      `;
      readBtn.setAttribute("href", book.readUrl || "https://ml.wikisource.org");
      readBtn.setAttribute("target", "_blank");
      readBtn.setAttribute("rel", "noopener noreferrer");
      readBtn.querySelector("span").textContent = "📖 മുഴുവൻ വായിക്കാം ↗";
      readBtn.onclick = null;
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  // 3. Tab 2: Render 25 Tourism Spots from window.SAUDI_TOURISM_DATA
  function initTourism() {
    const tourismContainer = document.getElementById("tourism-spots-grid");
    const regionBtns = document.querySelectorAll(".tourism-reg-btn");
    const spots = window.SAUDI_TOURISM_DATA || [];

    if (!tourismContainer) return;

    let activeRegion = "all";

    function renderSpots() {
      const filtered = spots.filter((s) => {
        if (activeRegion === "all") return true;
        if (activeRegion === "riyadh") return s.region === "riyadh";
        if (activeRegion === "west") return s.region === "makkah" || s.region === "madinah" || s.region === "tabuk";
        if (activeRegion === "south") return s.region === "asir" || s.region === "baha" || s.region === "jazan";
        if (activeRegion === "east") return s.region === "eastern";
        return true;
      });

      tourismContainer.innerHTML = filtered
        .map(
          (spot) => `
        <div class="tourism-card" style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); overflow:hidden; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between;">
          <div style="position:relative; height:180px; background:#042f24; overflow:hidden;">
            <img src="${spot.image || './assets/favicon.svg'}" alt="${spot.name_ml}" loading="lazy" style="width:100%; height:100%; object-fit:cover; transition:transform 0.3s ease;" onerror="this.src='./assets/favicon.svg'">
            <span style="position:absolute; top:12px; left:12px; background:rgba(0,0,0,0.75); backdrop-filter:blur(6px); color:#fef08a; font-size:0.75rem; font-weight:800; padding:4px 10px; border-radius:999px;">${spot.category_label_ml || "വിസ്മയം"}</span>
            <span style="position:absolute; bottom:12px; right:12px; background:#047857; color:#fff; font-size:0.72rem; font-weight:800; padding:3px 8px; border-radius:6px;">${spot.region_label_ml || ""}</span>
          </div>
          <div style="padding:18px 20px; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <h4 style="font-size:1.15rem; font-weight:800; color:var(--text); margin:0 0 4px;">${spot.name_ml}</h4>
              <p style="font-size:0.8rem; color:var(--text-muted); margin:0 0 10px;">${spot.name_en || ""}</p>
              <p style="font-size:0.86rem; color:var(--text-secondary); line-height:1.55; margin:0 0 14px;">${spot.description_ml || ""}</p>
              
              <div style="background:var(--surface-soft); padding:10px 12px; border-radius:10px; font-size:0.82rem; margin-bottom:14px;">
                <div style="color:var(--text); margin-bottom:4px;">⏱️ <strong>ഏറ്റവും നല്ല സമയം:</strong> ${spot.best_time || "വർഷം മുഴുവൻ"}</div>
                <div style="color:var(--text);">💰 <strong>പ്രവേശനം:</strong> ${spot.entry_fee || "സൗജന്യം"}</div>
              </div>
            </div>

            <a href="${spot.map_url || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(spot.name_en + ' Saudi Arabia')}" target="_blank" rel="noopener noreferrer" class="airport-action-btn" style="width:100%; margin:0; background:#047857; color:#ffffff;">
              <span>📍 Google Maps ലൊക്കേഷൻ ↗</span>
            </a>
          </div>
        </div>
      `
        )
        .join("");
    }

    regionBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        regionBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeRegion = btn.getAttribute("data-reg");
        renderSpots();
      });
    });

    renderSpots();
  }

  // Initialize once DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    initLibrary();
    initTourism();
  });
})();
