/**
 * KSA Malayali Hub — Explorer Hub Controller (/explore)
 * Handles 3 Tabs: E-Library, Tourism & Hidden Spots, Heritage & Agriculture
 */

(function () {
  "use strict";

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

  // 2. Tab 1: Render Digital Books from window.LIBRARY_DATA
  function initLibrary() {
    const booksContainer = document.getElementById("library-books-grid");
    const searchInput = document.getElementById("library-search");
    const categoryBtns = document.querySelectorAll(".library-cat-btn");
    const books = window.LIBRARY_DATA || window.MALAYALAM_LIBRARY_DATA || [];

    if (!booksContainer) return;

    let activeCategory = "all";
    let searchQuery = "";

    function renderBooks() {
      const filtered = books.filter((b) => {
        const matchesCat = activeCategory === "all" || b.category === activeCategory;
        const matchesSearch =
          searchQuery === "" ||
          (b.title && b.title.toLowerCase().includes(searchQuery)) ||
          (b.author && b.author.toLowerCase().includes(searchQuery)) ||
          (b.title_en && b.title_en.toLowerCase().includes(searchQuery));
        return matchesCat && matchesSearch;
      });

      if (filtered.length === 0) {
        booksContainer.innerHTML = `
          <div style="grid-column:1/-1; text-align:center; padding:40px 20px; background:var(--surface); border-radius:14px; border:1px solid var(--border);">
            <span style="font-size:2.5rem;">📖</span>
            <p style="color:var(--text-secondary); margin-top:10px; font-weight:600;">പുസ്തകങ്ങൾ കണ്ടെത്താനായില്ല. മറ്റൊരു വാക്ക് തിരഞ്ഞു നോക്കൂ.</p>
          </div>
        `;
        return;
      }

      booksContainer.innerHTML = filtered
        .map(
          (book) => `
        <div class="library-card" style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <span style="background:rgba(4,120,87,0.1); color:#047857; font-size:0.75rem; font-weight:800; padding:3px 10px; border-radius:999px;">${book.category_label || "വായന"}</span>
              <span style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">⭐ ${book.rating || "4.8"}</span>
            </div>
            <h4 style="font-size:1.15rem; font-weight:800; color:var(--text); margin:4px 0;">${book.title}</h4>
            <p style="font-size:0.84rem; color:var(--text-muted); margin:0 0 10px;">${book.author} (${book.year || ""})</p>
            <p style="font-size:0.86rem; color:var(--text-secondary); line-height:1.5; margin:0 0 16px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">${book.summary || ""}</p>
          </div>
          <button type="button" class="airport-action-btn view-book-btn" data-id="${book.id}" style="width:100%; margin:0;">
            <span>📖 വായിക്കുക / വിവരങ്ങൾ ↗</span>
          </button>
        </div>
      `
        )
        .join("");

      // Add event listeners for reading modal
      booksContainer.querySelectorAll(".view-book-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const bookId = btn.getAttribute("data-id");
          const found = books.find((b) => b.id === bookId);
          if (found) openBookModal(found);
        });
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderBooks();
      });
    }

    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        categoryBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.getAttribute("data-cat");
        renderBooks();
      });
    });

    renderBooks();
  }

  // Book Reader Modal
  function openBookModal(book) {
    let modal = document.getElementById("book-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "book-modal";
      modal.className = "modal-backdrop";
      modal.innerHTML = `
        <div class="modal-card" style="max-width:680px; max-height:85vh; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:14px; margin-bottom:14px;">
            <div>
              <span id="bm-badge" style="background:#047857; color:#fff; font-size:0.75rem; font-weight:800; padding:2px 8px; border-radius:6px;"></span>
              <h3 id="bm-title" style="font-size:1.35rem; font-weight:800; color:var(--text); margin:6px 0 2px;"></h3>
              <p id="bm-author" style="font-size:0.86rem; color:var(--text-muted); margin:0;"></p>
            </div>
            <button type="button" id="bm-close" class="modal-close-btn" aria-label="Close">✕</button>
          </div>
          <div id="bm-body" style="overflow-y:auto; line-height:1.7; font-size:0.95rem; color:var(--text-secondary); white-space:pre-line; padding-right:8px;"></div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector("#bm-close").addEventListener("click", () => {
        modal.classList.remove("open");
        document.body.style.overflow = "";
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("open");
          document.body.style.overflow = "";
        }
      });
    }

    modal.querySelector("#bm-badge").textContent = book.category_label || "വായന";
    modal.querySelector("#bm-title").textContent = book.title;
    modal.querySelector("#bm-author").textContent = `${book.author} · ${book.pages || "200+"} പേജുകൾ · ${book.year || ""}`;
    modal.querySelector("#bm-body").textContent = book.full_content || book.summary;

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
