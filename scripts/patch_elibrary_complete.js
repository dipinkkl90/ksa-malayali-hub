const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Update explore.html and explore/index.html
function patchExploreHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace search & category buttons
  const oldControlsRegex = /<!-- Search & Filter Controls -->[\s\S]*?<!-- Books Dynamic Grid -->[\s\S]*?<div id="library-books-grid"[\s\S]*?<\/div>\s*<\/div>/m;

  const newControlsHtml = `<!-- Search & Filter Controls -->
        <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between; margin-bottom:20px;">
          <input type="text" id="library-search" placeholder="പുസ്തകത്തിന്റെ പേരോ എഴുത്തുകാരനോ തിരയുക..." aria-label="Search Malayalam Books" style="flex:1; min-width:240px; padding:12px 18px; border-radius:999px; border:1px solid var(--border); background:var(--surface); color:var(--text); font-size:0.9rem; outline:none; transition:border-color 0.2s ease;">
          <div id="library-category-tabs" style="display:flex; gap:8px; overflow-x:auto; padding:4px 0; -webkit-overflow-scrolling:touch;">
            <button type="button" class="sub-nav-pill active library-cat-btn" data-cat="all">എല്ലാം (100)</button>
            <button type="button" class="sub-nav-pill library-cat-btn" data-cat="pravasi">പ്രവാസി ഗൈഡുകൾ (10)</button>
            <button type="button" class="sub-nav-pill library-cat-btn" data-cat="novels">നോവലുകൾ (12)</button>
            <button type="button" class="sub-nav-pill library-cat-btn" data-cat="stories">കഥകൾ &amp; ഹാസ്യം (15)</button>
            <button type="button" class="sub-nav-pill library-cat-btn" data-cat="poetry">കവിതകൾ (30)</button>
            <button type="button" class="sub-nav-pill library-cat-btn" data-cat="classics">ക്ലാസിക്കുകൾ &amp; മാപ്പിളപ്പാട്ട് (20)</button>
            <button type="button" class="sub-nav-pill library-cat-btn" data-cat="history">ചരിത്രം &amp; യാത്ര (13)</button>
          </div>
        </div>

        <!-- Books Dynamic Grid -->
        <div id="library-books-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(290px, 1fr)); gap:18px;">
          <!-- Populated dynamically via js/explore.js -->
        </div>

        <!-- Load More Container -->
        <div id="library-load-more-wrap" style="text-align:center; margin-top:28px;">
          <button type="button" id="library-load-more-btn" class="nav-btn nav-btn-primary" style="padding:12px 28px; font-weight:700; border-radius:999px; cursor:pointer;">
            <span>കൂടുതൽ കാണുക (Load More) ⬇️</span>
          </button>
        </div>
      </div>`;

  html = html.replace(oldControlsRegex, newControlsHtml);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Patched ${path.relative(rootDir, filePath)}`);
}

patchExploreHtml(path.join(rootDir, 'explore.html'));
patchExploreHtml(path.join(rootDir, 'explore/index.html'));

// 2. Update js/explore.js
const exploreJsPath = path.join(rootDir, 'js/explore.js');
let exploreJs = fs.readFileSync(exploreJsPath, 'utf8');

const oldLibraryRegex = /\/\/ 2\. Tab 1: Render Digital Books from window\.MALAYALAM_LIBRARY_DATA[\s\S]*?\/\/ 3\. Tab 2: Render 25 Tourism Spots from window\.SAUDI_TOURISM_DATA/m;

const newLibraryJs = `// 2. Tab 1: Render Digital Books from window.MALAYALAM_LIBRARY_DATA
  function initLibrary() {
    const booksContainer = document.getElementById("library-books-grid");
    const searchInput = document.getElementById("library-search");
    const categoryBtns = document.querySelectorAll(".library-cat-btn");
    const loadMoreWrap = document.getElementById("library-load-more-wrap");
    const loadMoreBtn = document.getElementById("library-load-more-btn");
    const books = window.MALAYALAM_LIBRARY_DATA || window.LIBRARY_DATA || [];

    if (!booksContainer) return;

    let activeCategory = "all";
    let searchQuery = "";
    const PAGE_SIZE = 20;
    let currentLimit = PAGE_SIZE;

    function renderBooks() {
      const filtered = books.filter((b) => {
        const matchesCat = activeCategory === "all" || b.category === activeCategory;
        if (!matchesCat) return false;
        if (!searchQuery) return true;

        const q = searchQuery;
        const t = (b.title || "").toLowerCase();
        const a = (b.author || "").toLowerCase();
        const te = (b.title_en || "").toLowerCase();
        const ae = (b.author_en || "").toLowerCase();
        const cat = (b.category_label || "").toLowerCase();
        const id = String(b.id);

        return t.includes(q) || a.includes(q) || te.includes(q) || ae.includes(q) || cat.includes(q) || id === q;
      });

      if (filtered.length === 0) {
        booksContainer.innerHTML = \`
          <div style="grid-column:1/-1; text-align:center; padding:48px 20px; background:var(--surface); border-radius:16px; border:1px solid var(--border);">
            <span style="font-size:2.8rem; display:block; margin-bottom:12px;">🔍</span>
            <h4 style="color:var(--text); font-size:1.15rem; font-weight:800; margin:0 0 8px;">പുസ്തകങ്ങൾ കണ്ടെത്താനായില്ല</h4>
            <p style="color:var(--text-secondary); font-size:0.9rem; margin:0;">മറ്റൊരു വാക്കോ എഴുത്തുകാരന്റെ പേരോ തിരഞ്ഞു നോക്കൂ.</p>
          </div>
        \`;
        if (loadMoreWrap) loadMoreWrap.style.display = "none";
        return;
      }

      const visibleBooks = filtered.slice(0, currentLimit);

      booksContainer.innerHTML = visibleBooks
        .map(
          (book) => \`
        <div class="library-card" style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between; transition:all 0.2s ease;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
              <span style="background:rgba(4,120,87,0.12); color:#047857; font-size:0.75rem; font-weight:800; padding:3px 10px; border-radius:999px; border:1px solid rgba(4,120,87,0.25);">\${escapeHtml(book.category_label || "വായന")}</span>
              <span style="font-size:0.78rem; color:var(--text-muted); font-weight:700; background:rgba(255,255,255,0.06); padding:2px 8px; border-radius:6px;">#\${book.id}</span>
            </div>
            <h4 style="font-size:1.18rem; font-weight:800; color:var(--text); margin:4px 0 6px; line-height:1.35;">\${escapeHtml(book.title)}</h4>
            <p style="font-size:0.86rem; color:var(--text-muted); margin:0 0 10px; font-weight:600;">✍️ \${escapeHtml(book.author)} <span style="opacity:0.85;">(\${escapeHtml(book.yearOrType || "")})</span></p>
            <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6; margin:0 0 16px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">\${escapeHtml(book.summary || "")}</p>
          </div>
          <div style="display:flex; gap:8px; margin-top:10px;">
            <button type="button" class="airport-action-btn view-book-btn" data-id="\${book.id}" style="flex:1; margin:0; padding:10px 12px; font-size:0.85rem; font-weight:700;">
              <span>📖 വായിക്കാം</span>
            </button>
            <button type="button" class="airport-action-btn pdf-book-btn" data-id="\${book.id}" style="flex:1; margin:0; padding:10px 12px; font-size:0.85rem; font-weight:700; background:linear-gradient(135deg,#047857,#065f46); color:#fff; border-color:#047857;">
              <span>⬇️ PDF</span>
            </button>
          </div>
        </div>
      \`
        )
        .join("");

      // Update Load More button
      if (loadMoreWrap && loadMoreBtn) {
        if (currentLimit < filtered.length) {
          loadMoreWrap.style.display = "block";
          const remaining = filtered.length - currentLimit;
          loadMoreBtn.querySelector("span").textContent = \`കൂടുതൽ കാണുക (\${remaining} പുസ്തകങ്ങൾ ബാക്കി) ⬇️\`;
        } else {
          loadMoreWrap.style.display = "none";
        }
      }

      // Add event listeners for reading modal
      booksContainer.querySelectorAll(".view-book-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const bookId = btn.getAttribute("data-id");
          const found = books.find((b) => String(b.id) === String(bookId));
          if (found) openBookModal(found);
        });
      });

      // Add event listeners for PDF download
      booksContainer.querySelectorAll(".pdf-book-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
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
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        currentLimit = PAGE_SIZE; // Reset limit when searching
        renderBooks();
      });
    }

    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        categoryBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.getAttribute("data-cat");
        currentLimit = PAGE_SIZE; // Reset limit when changing category
        renderBooks();
      });
    });

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
      modal.innerHTML = \`
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
            <button type="button" id="bm-download-btn" class="airport-action-btn" style="flex:1; min-width:140px; margin:0; display:inline-flex; align-items:center; justify-content:center; gap:6px; background:linear-gradient(135deg,#047857,#065f46); color:#fff; border:1px solid #047857; font-weight:700; padding:10px 14px; border-radius:10px;">
              <span>⬇️ PDF ഡൗൺലോഡ്</span>
            </button>
            <a id="bm-share-btn" href="#" target="_blank" rel="noopener noreferrer" class="airport-action-btn" style="flex:1; min-width:140px; margin:0; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:6px; background:#25d366; color:#ffffff; border:1px solid #22c55e; font-weight:700; padding:10px 14px; border-radius:10px;">
              <span>📤 WhatsApp ഷെയർ</span>
            </a>
          </div>
        </div>
      \`;
      document.body.appendChild(modal);

      modal.querySelector("#bm-close").addEventListener("click", () => {
        modal.classList.remove("open");
        document.body.style.overflow = "";
      });

      modal.querySelector("#bm-download-btn").addEventListener("click", () => {
        if (currentActiveBook && typeof window.downloadBookPdf === "function") {
          window.downloadBookPdf(currentActiveBook.id);
        }
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("open");
          document.body.style.overflow = "";
        }
      });
    }

    modal.querySelector("#bm-badge").textContent = \`\${book.category_label || "വായന"} · #\${book.id}\`;
    modal.querySelector("#bm-year").textContent = book.yearOrType || "";
    modal.querySelector("#bm-title").textContent = book.title;
    modal.querySelector("#bm-author").textContent = \`✍️ \${book.author} · 📄 \${book.pages || "200+"} പേജുകൾ · ⭐ \${book.rating ? book.rating.toFixed(1) : "5.0"}\`;

    const isPravasi = book.category === "pravasi" || book.id > 90;
    const bodyEl = modal.querySelector("#bm-body");
    const readBtn = modal.querySelector("#bm-read-btn");
    const shareBtn = modal.querySelector("#bm-share-btn");

    if (isPravasi) {
      bodyEl.innerHTML = \`
        <div style="background:rgba(4,120,87,0.08); border-left:4px solid #047857; padding:14px 18px; border-radius:0 10px 10px 0; margin-bottom:18px;">
          <strong style="color:#047857; display:block; margin-bottom:4px;">📘 ഒറിജിനൽ പ്രവാസി ഗൈഡ്:</strong>
          <span style="color:var(--text); font-size:0.92rem;">\${escapeHtml(book.summary)}</span>
        </div>
        <div style="white-space:pre-line; color:var(--text); font-size:0.96rem; line-height:1.85;">\${escapeHtml(book.full_content)}</div>
      \`;
      readBtn.removeAttribute("href");
      readBtn.removeAttribute("target");
      readBtn.querySelector("span").textContent = "📖 മുഴുവൻ ഗൈഡ് (ഇവിടെ വായിക്കാം)";
      readBtn.onclick = (e) => {
        e.preventDefault();
        bodyEl.scrollTo({ top: 0, behavior: "smooth" });
      };
    } else {
      bodyEl.innerHTML = \`
        <div style="background:rgba(217,119,6,0.08); border-left:4px solid #d97706; padding:14px 18px; border-radius:0 10px 10px 0; margin-bottom:18px;">
          <strong style="color:#d97706; display:block; margin-bottom:4px;">📖 സംഗ്രഹം (Synopsis):</strong>
          <span style="color:var(--text); font-size:0.92rem;">\${escapeHtml(book.summary)}</span>
        </div>
        <div style="white-space:pre-line; color:var(--text); font-size:0.96rem; line-height:1.85; margin-bottom:20px;">\${escapeHtml(book.full_content)}</div>
        <div style="text-align:center; padding:16px 20px; background:var(--surface); border:1px dashed var(--border); border-radius:12px; margin-top:16px;">
          <p style="margin:0 0 10px; font-weight:700; color:var(--text);">ഈ ക്ലാസിക് കൃതി പകർപ്പവകാശ മുക്തമായി (Public Domain) മലയാളം വിക്കിഗ്രന്ഥശാലയിൽ പൂർണ്ണമായി വായിക്കാം:</p>
          <a href="\${book.readUrl}" target="_blank" rel="noopener noreferrer" class="nav-btn nav-btn-primary" style="display:inline-flex; align-items:center; gap:8px; text-decoration:none; padding:10px 22px; border-radius:999px;">
            <span>📖 വിക്കിഗ്രന്ഥശാലയിൽ പൂർണ്ണ ഗ്രന്ഥം വായിക്കുക ↗</span>
          </a>
        </div>
      \`;
      readBtn.setAttribute("href", book.readUrl);
      readBtn.setAttribute("target", "_blank");
      readBtn.setAttribute("rel", "noopener noreferrer");
      readBtn.querySelector("span").textContent = "📖 മുഴുവൻ വായിക്കാം ↗";
      readBtn.onclick = null;
    }

    const shareText = encodeURIComponent(\`📚 മലയാളം ഇ-ലൈബ്രറിയിൽ '\${book.title}' (\${book.author}) വായിക്കൂ!\\n\\nസൗദി മലയാളി ഹബ്ബിൽ സൗജന്യമായി ലഭ്യമാണ്: https://ksa-malayali-hub.vercel.app/explore?tab=library&book=\${book.id}\`);
    shareBtn.setAttribute("href", \`https://wa.me/?text=\${shareText}\`);

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  // 3. Tab 2: Render 25 Tourism Spots from window.SAUDI_TOURISM_DATA`;

exploreJs = exploreJs.replace(oldLibraryRegex, newLibraryJs);
fs.writeFileSync(exploreJsPath, exploreJs, 'utf8');
console.log('Successfully updated js/explore.js with 100-book pagination, search, filters & reader modal');

// 3. Update js/pdf_generator.js for non-blank Light-Mode Print-Ready PDFs
const pdfGenPath = path.join(rootDir, 'js/pdf_generator.js');
let pdfGenJs = fs.readFileSync(pdfGenPath, 'utf8');

const oldPdfGenRegex = /\/\/ 3\. GENERATE: E-Library Full Book PDF[\s\S]*?renderElementToPdf\(container, safeFilename, book\.title\);\s*\}, 150\);\s*\};/m;

const newPdfGenJs = `// 3. GENERATE: E-Library Full Book PDF (Light-Mode Print-Ready & Non-Blank Guarantee)
  window.realDownloadBookPdf = window.downloadBookPdf = async function (bookId) {
    const books = window.MALAYALAM_LIBRARY_DATA || window.LIBRARY_DATA || [];
    const book = books.find((b) => String(b.id) === String(bookId));
    if (!book) {
      showToast("പുസ്തകം കണ്ടെത്താനായില്ല.", "error");
      return;
    }

    showPdfSpinner(\`'\${book.title}' PDF തയ്യാറാക്കുന്നു...\`, \`\${book.author} രചിച്ച കൃതി ഡിജിറ്റലായി രൂപപ്പെടുത്തുന്നു. ദയവായി അല്പം കാത്തിരിക്കൂ...\`);

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
        .split("\\n\\n")
        .map(p => \`<p style="margin: 0 0 14px; line-height: 1.85; text-align: justify; color: #1f2937 !important;">\${p.replace(/\\n/g, "<br>")}</p>\`)
        .join("");

      container.innerHTML = \`
        <div style="font-family: 'Noto Sans Malayalam', 'Inter', sans-serif; color: #111827 !important; background: #ffffff !important; line-height: 1.8; font-size: 13.5px;">
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #047857 0%, #064e3b 100%) !important; color: #ffffff !important; padding: 22px 24px; border-radius: 12px; margin-bottom: 22px; text-align: center; border: 2px solid #d97706;">
            <div style="display: inline-block; background: rgba(255,255,255,0.2) !important; color: #ffffff !important; padding: 3px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; margin-bottom: 8px;">
              \${book.category_label || "മലയാള സാഹിത്യം"} · \${book.yearOrType || ""}
            </div>
            <h1 style="margin: 0 0 6px; font-size: 26px; font-weight: 800; color: #fef08a !important;">\${book.title}</h1>
            <div style="font-size: 14px; font-weight: 700; color: #f8fafc !important; margin-bottom: 6px;">✍️ രചന: \${book.author} \${book.author_en ? \`(\${book.author_en})\` : ""}</div>
            <div style="font-size: 11px; color: #cbd5e1 !important;">
              ⭐ \${book.rating ? book.rating.toFixed(1) : "5.0"} / 5.0 · 📄 \${book.pages || "200+"} പേജുകൾ · 🏷️ ബുക്ക് #\${book.id}
            </div>
          </div>

          <!-- Summary Box -->
          <div style="background: #f8fafc !important; border-left: 4px solid #047857 !important; padding: 14px 18px; border-radius: 0 8px 8px 0; margin-bottom: 22px; font-size: 13px;">
            <div style="font-weight: 800; color: #047857 !important; margin-bottom: 4px;">📖 സംഗ്രഹം (Synopsis):</div>
            <p style="margin: 0; color: #374151 !important; line-height: 1.75;">\${book.summary}</p>
          </div>

          <!-- Full Content / Excerpt -->
          <div style="margin-bottom: 28px;">
            <div style="font-size: 16px; font-weight: 800; color: #111827 !important; border-bottom: 2px solid #e5e7eb !important; padding-bottom: 8px; margin-bottom: 16px;">
              \${book.id > 90 ? "സമ്പൂർണ്ണ ഗൈഡ് വിവരങ്ങൾ (Full Guide)" : "ഗ്രന്ഥ വിവരണം & പ്രാരംഭ ഭാഗങ്ങൾ (Book Overview)"}
            </div>
            <div style="font-size: 13.5px; color: #1f2937 !important;">
              \${cleanContent}
            </div>
            \${book.id <= 90 ? \`
              <div style="margin-top: 18px; padding: 12px; background: #ecfdf5 !important; border-radius: 8px; border: 1px dashed #059669 !important; text-align: center; font-size: 12px; color: #065f46 !important;">
                ഈ കൃതിയുടെ പൂർണ്ണ ഭാഗങ്ങൾ മലയാളം വിക്കിഗ്രന്ഥശാലയിൽ വായിക്കാം: <strong>\${book.readUrl}</strong>
              </div>
            \` : ""}
          </div>

          <!-- Footer -->
          <div style="text-align: center; border-top: 2px solid #e5e7eb !important; padding-top: 14px; font-size: 11px; color: #6b7280 !important; page-break-inside: avoid;">
            <p style="margin: 0 0 4px; font-weight: 700; color: #047857 !important;">KSA MALAYALI HUB — 100-BOOK MALAYALAM E-LIBRARY</p>
            <p style="margin: 0; color: #6b7280 !important;">സൗജന്യ ഓൺലൈൻ വായനശാല: <strong>https://ksa-malayali-hub.vercel.app/explore?tab=library</strong></p>
          </div>
        </div>
      \`;

      document.body.appendChild(container);

      const safeFilename = \`\${(book.title_en || book.title).replace(/[^a-zA-Z0-9]/g, "_")}_KSA_Malayali_Hub.pdf\`;

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
            showToast(\`'\${book.title}' PDF വിജയകരമായി ഡൗൺലോഡ് ചെയ്തു! ✅\`);
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
  };`;

pdfGenJs = pdfGenJs.replace(oldPdfGenRegex, newPdfGenJs);
fs.writeFileSync(pdfGenPath, pdfGenJs, 'utf8');
console.log('Successfully updated js/pdf_generator.js for non-blank Light-Mode Print-Ready PDFs');
