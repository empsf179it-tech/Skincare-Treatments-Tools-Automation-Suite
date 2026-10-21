/**
 * SKINCARE TREATMENTS TOOLS & AUTOMATION SUITE
 * Shared Global JavaScript (Vanilla ES6)
 * Handles: Navbar, Mobile Drawer, Theme Toggle, RTL Direction,
 * Search Modal, Enquiry Modal, Tools Filters, Workflows,
 * Auth Validation, and Dashboard Demonstrations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDirection();
  initHeaderAndNav();
  initMobileDrawer();
  initEnquiryModal();
  initDirectContactForm();
  initFaqAccordion();
  initSearchModal();
  initTreatmentSelector();
  initToolsExplorer();
  initWorkflowBuilder();
  initAuthForms();
  initDashboard();
  initScrollReveal();
});

/* ==========================================================================
   1. THEME TOGGLE (Rule 11)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('skincare_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  const themeToggleBtns = document.querySelectorAll('.js-theme-toggle');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('skincare_theme', newTheme);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeIcons = document.querySelectorAll('.js-theme-icon');
  themeIcons.forEach(icon => {
    if (theme === 'dark') {
      icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    } else {
      icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  });
}

/* ==========================================================================
   2. REAL RTL FUNCTIONALITY (Rule 12)
   ========================================================================== */
function initDirection() {
  const savedDir = localStorage.getItem('skincare_dir') || 'ltr';
  applyDirection(savedDir);

  const rtlToggleBtns = document.querySelectorAll('.js-rtl-toggle');
  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.dir || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir);
      localStorage.setItem('skincare_dir', newDir);
    });
  });
}

function applyDirection(dir) {
  document.documentElement.dir = dir;
  const rtlLabels = document.querySelectorAll('.js-rtl-label');
  rtlLabels.forEach(lbl => {
    lbl.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
  });
}

/* ==========================================================================
   3. STICKY NAVBAR & ACTIVE NAV STATE (Rule 9)
   ========================================================================== */
function initHeaderAndNav() {
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  // Set active link based on current path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   4. RESPONSIVE NAVBAR & HAMBURGER DRAWER (Rule 10)
   ========================================================================== */
function initMobileDrawer() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');
  const drawerCloseBtn = document.querySelector('.drawer-close-btn');

  if (!hamburgerBtn || !mobileDrawer) return;

  function openDrawer() {
    mobileDrawer.classList.add('is-open');
    if (drawerBackdrop) drawerBackdrop.classList.add('is-visible');
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('is-open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('is-visible');
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.contains('is-open');
    if (isOpen) closeDrawer();
    else openDrawer();
  });

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Close after selecting a link inside drawer
  const drawerLinks = mobileDrawer.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   5. GLOBAL ENQUIRY POPUP (Rule 25)
   ========================================================================== */
function initEnquiryModal() {
  const modalOverlay = document.getElementById('enquiryModal');
  if (!modalOverlay) return;

  const form = document.getElementById('enquiryForm');
  const closeBtn = modalOverlay.querySelector('.modal-close-btn');
  const cancelBtn = modalOverlay.querySelector('.js-modal-cancel');
  const successState = modalOverlay.querySelector('.modal-success-state');
  const successDismissBtn = modalOverlay.querySelector('.js-modal-success-dismiss');

  const nameInput = document.getElementById('enquiryName');
  const emailInput = document.getElementById('enquiryEmail');
  const phoneInput = document.getElementById('enquiryPhone');
  const typeSelect = document.getElementById('enquiryType');
  const itemInput = document.getElementById('enquiryItem');
  const dateInput = document.getElementById('enquiryDate');
  const messageInput = document.getElementById('enquiryMessage');

  // Triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-enquiry]');
    if (trigger) {
      e.preventDefault();
      const prefillType = trigger.getAttribute('data-enquiry-type') || 'General Enquiry';
      const prefillItem = trigger.getAttribute('data-enquiry-item') || '';

      if (typeSelect) typeSelect.value = prefillType;
      if (itemInput) itemInput.value = prefillItem;

      openModal();
    }
  });

  function openModal() {
    modalOverlay.classList.add('is-visible');
    if (form) form.style.display = 'block';
    if (successState) successState.classList.remove('is-active');
    document.body.style.overflow = 'hidden';
    if (nameInput) nameInput.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove('is-visible');
    document.body.style.overflow = '';
    clearErrors();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (successDismissBtn) {
    successDismissBtn.addEventListener('click', () => {
      closeModal();
      if (form) form.reset();
    });
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('is-visible')) {
      closeModal();
    }
  });

  function clearErrors() {
    modalOverlay.querySelectorAll('.form-feedback').forEach(el => el.classList.remove('is-error'));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();
      let isValid = true;

      if (!nameInput.value.trim()) {
        showError(nameInput, 'Please enter your full name.');
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      }

      if (phoneInput && phoneInput.value.trim()) {
        const phoneClean = phoneInput.value.replace(/[^0-9+]/g, '');
        if (phoneClean.length < 7) {
          showError(phoneInput, 'Please enter a valid phone number.');
          isValid = false;
        }
      }

      if (!messageInput.value.trim()) {
        showError(messageInput, 'Please provide details about your enquiry.');
        isValid = false;
      }

      if (isValid) {
        form.style.display = 'none';
        if (successState) successState.classList.add('is-active');
      }
    });
  }
}

function showError(inputEl, msg) {
  const parent = inputEl.closest('.form-group');
  if (parent) {
    const feedback = parent.querySelector('.form-feedback');
    if (feedback) {
      feedback.textContent = msg;
      feedback.classList.add('is-error');
    }
  }
}

function initDirectContactForm() {
  const form = document.getElementById('directContactForm');
  if (!form) return;

  const successBox = document.getElementById('directContactSuccess');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.querySelectorAll('.form-feedback').forEach(el => el.classList.remove('is-error'));

    let isValid = true;
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please enter your full name.');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      showError(messageInput, 'Please provide details about your message.');
      isValid = false;
    }

    if (isValid) {
      if (successBox) {
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
    }
  });
}

function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.open) {
            otherItem.open = false;
          }
        });
      }
    });
  });
}

/* ==========================================================================
   6. GLOBAL SEARCH MODAL (Rule 26)
   ========================================================================== */
const SEARCH_DATABASE = [
  // Treatments
  { title: 'HydraSkin Vortex Facial', category: 'Treatments', desc: 'Non-invasive vortex infusion & deep pore cleansing', url: 'services.html#deep-cleansing', img: 'assets/images/image-1.png' },
  { title: 'LED Phototherapy Mask', category: 'Treatments', desc: 'Multi-wavelength rejuvenation & collagen stimulation', url: 'services.html#led-therapy', img: 'assets/images/image-7.png' },
  { title: 'Laser Skin Resurfacing', category: 'Treatments', desc: 'Precision micro-ablative clinical rejuvenation', url: 'services.html#laser-rejuvenation', img: 'assets/images/image-6.png' },
  { title: 'Oxygen Infusion Therapy', category: 'Treatments', desc: 'Hyperbaric pure oxygen delivery for instant glow', url: 'services.html#hydration-facial', img: 'assets/images/image-13.png' },
  { title: 'Ultrasonic Peeling & Extractions', category: 'Treatments', desc: '28,000Hz ultrasonic wave pore purification', url: 'services.html#ultrasonic-cleansing', img: 'assets/images/image-50.png' },
  // Skincare Tools
  { title: 'LumiClean Ultrasonic Scrubber', category: 'Tools', desc: 'Professional cordless skin spatula with ion induction', url: 'tools.html#lumiclean', img: 'assets/images/image-48.png' },
  { title: 'DermaView 3D Skin Analyzer', category: 'Tools', desc: 'RGB, UV, & PL multi-spectral facial scanner', url: 'tools.html#dermaview', img: 'assets/images/image-67.png' },
  { title: 'GlowPanel Medical LED Console', category: 'Tools', desc: 'Multi-diode articulating light array for aesthetic bays', url: 'tools.html#glowpanel', img: 'assets/images/image-8.png' },
  { title: 'HydroFlow Treatment System', category: 'Tools', desc: 'Dual-chamber serum vacuum infusion console', url: 'tools.html#hydroflow', img: 'assets/images/image-65.png' },
  { title: 'PureMist Dual Ozone Steamer', category: 'Tools', desc: 'Ionic warm mist facial preparation console', url: 'tools.html#puremist', img: 'assets/images/image-47.png' },
  { title: 'ThermaLift RF & Cryo Wand', category: 'Tools', desc: 'Bipolar radiofrequency and sub-zero cooling device', url: 'tools.html#thermalift', img: 'assets/images/image-33.png' },
  // Workflows & Automation
  { title: 'Client Intake Automation', category: 'Automation', desc: 'Digital pre-treatment consultation questionnaires', url: 'automation.html#intake', img: 'assets/images/image-75.png' },
  { title: 'Treatment Plan Formulator', category: 'Automation', desc: 'Protocol sequencing and formulation tracking', url: 'automation.html#planning', img: 'assets/images/image-73.png' },
  { title: 'Smart Equipment Checklist', category: 'Automation', desc: 'Sterilization status and cartridge calibration', url: 'automation.html#equipment', img: 'assets/images/image-44.png' },
  { title: 'Automated Post-Treatment Care', category: 'Automation', desc: 'Automated SMS & email follow-up reminders', url: 'automation.html#followup', img: 'assets/images/image-25.png' },
  // Pages
  { title: 'About Our Skincare Technology', category: 'Pages', desc: 'Dermatological philosophy and laboratory standards', url: 'about.html', img: 'assets/images/image-24.png' },
  { title: 'Treatment Workflow Automation', category: 'Pages', desc: 'Interactive clinical workflow and protocol tracking', url: 'automation.html', img: 'assets/images/image-72.png' },
  { title: 'Contact Skincare Suite', category: 'Pages', desc: 'Consultation enquiries & studio locations', url: 'contact.html', img: 'assets/images/image-3.png' }
];

function initSearchModal() {
  const searchModal = document.getElementById('searchModal');
  if (!searchModal) return;

  const searchInput = document.getElementById('globalSearchInput');
  const resultsContainer = document.getElementById('searchResultsList');
  const closeBtn = searchModal.querySelector('.modal-close-btn');

  // Trigger search modal from header & drawer buttons
  document.querySelectorAll('.js-open-search').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      searchModal.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
      if (searchInput) {
        searchInput.value = '';
        renderSearchResults('');
        searchInput.focus();
      }
    });
  });

  function closeSearch() {
    searchModal.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('is-visible')) {
      closeSearch();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value.trim().toLowerCase());
    });
  }

  function renderSearchResults(query) {
    if (!resultsContainer) return;

    if (!query) {
      resultsContainer.innerHTML = SEARCH_DATABASE.slice(0, 6).map(item => createResultHTML(item)).join('');
      return;
    }

    const matches = SEARCH_DATABASE.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<div class="search-empty"><p>No matching treatments, tools, or features found for "${query}".</p></div>`;
    } else {
      resultsContainer.innerHTML = matches.map(item => createResultHTML(item)).join('');
    }
  }

  function createResultHTML(item) {
    return `
      <a href="${item.url}" class="search-result-item">
        <div class="search-result-thumb">
          <img src="${item.img}" alt="${item.title}" loading="lazy">
        </div>
        <div class="search-result-info">
          <h4>${item.title}</h4>
          <p><span class="badge" style="font-size: 0.65rem; padding: 2px 6px;">${item.category}</span> ${item.desc}</p>
        </div>
      </a>
    `;
  }
}

/* ==========================================================================
   7. INTERACTIVE TREATMENT SELECTOR (Home S2)
   ========================================================================== */
function initTreatmentSelector() {
  const selectorContainer = document.querySelector('.js-treatment-selector');
  if (!selectorContainer) return;

  const navItems = selectorContainer.querySelectorAll('.treatment-nav-item');
  const previewImg = selectorContainer.querySelector('.js-treatment-img');
  const previewTitle = selectorContainer.querySelector('.js-treatment-title');
  const previewCategory = selectorContainer.querySelector('.js-treatment-category');
  const previewDesc = selectorContainer.querySelector('.js-treatment-desc');
  const previewWorkflow = selectorContainer.querySelector('.js-treatment-workflow');
  const previewCta = selectorContainer.querySelector('.js-treatment-cta');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('is-active'));
      item.classList.add('is-active');

      const title = item.getAttribute('data-title');
      const cat = item.getAttribute('data-category');
      const desc = item.getAttribute('data-desc');
      const workflow = item.getAttribute('data-workflow');
      const imgSrc = item.getAttribute('data-img');

      if (previewTitle) previewTitle.textContent = title;
      if (previewCategory) previewCategory.textContent = cat;
      if (previewDesc) previewDesc.textContent = desc;
      if (previewWorkflow) previewWorkflow.textContent = workflow;
      if (previewImg) {
        previewImg.style.opacity = '0';
        setTimeout(() => {
          previewImg.src = imgSrc;
          previewImg.alt = title;
          previewImg.style.opacity = '1';
        }, 150);
      }
      if (previewCta) {
        previewCta.setAttribute('data-enquiry-item', title);
        previewCta.setAttribute('data-enquiry-type', 'Treatment Information');
      }
    });
  });
}

/* ==========================================================================
   8. SKINCARE TOOLS EXPLORER & DETAILS MODAL (Tools S2 & S3)
   ========================================================================== */
function initToolsExplorer() {
  const filterBtns = document.querySelectorAll('.js-tool-filter');
  const toolCards = document.querySelectorAll('.js-tool-card');
  const detailModal = document.getElementById('toolDetailModal');

  // Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.getAttribute('data-filter');
      toolCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Product Details Modal
  if (detailModal) {
    const modalImg = document.getElementById('modalToolImg');
    const modalTitle = document.getElementById('modalToolTitle');
    const modalCategory = document.getElementById('modalToolCategory');
    const modalDesc = document.getElementById('modalToolDesc');
    const modalSpecs = document.getElementById('modalToolSpecs');
    const modalUse = document.getElementById('modalToolUse');
    const modalCare = document.getElementById('modalToolCare');
    const modalEnquireBtn = document.getElementById('modalToolEnquireBtn');
    const closeBtn = detailModal.querySelector('.modal-close-btn');

    document.querySelectorAll('.js-view-tool-details').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.js-tool-card');
        if (!card) return;

        const title = card.getAttribute('data-title');
        const cat = card.getAttribute('data-cat-label');
        const desc = card.getAttribute('data-desc');
        const specs = card.getAttribute('data-specs');
        const use = card.getAttribute('data-use');
        const care = card.getAttribute('data-care');
        const img = card.getAttribute('data-img');

        if (modalTitle) modalTitle.textContent = title;
        if (modalCategory) modalCategory.textContent = cat;
        if (modalDesc) modalDesc.textContent = desc;
        if (modalUse) modalUse.textContent = use;
        if (modalCare) modalCare.textContent = care;
        if (modalImg) {
          modalImg.src = img;
          modalImg.alt = title;
        }

        if (modalSpecs && specs) {
          const specList = specs.split(';').map(s => {
            const [k, v] = s.split(':');
            return `<li><span>${k.trim()}</span><span>${v ? v.trim() : ''}</span></li>`;
          }).join('');
          modalSpecs.innerHTML = specList;
        }

        if (modalEnquireBtn) {
          modalEnquireBtn.setAttribute('data-enquiry-item', title);
          modalEnquireBtn.setAttribute('data-enquiry-type', 'Skincare Tools');
        }

        detailModal.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeDetailModal() {
      detailModal.classList.remove('is-visible');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeDetailModal);
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) closeDetailModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && detailModal.classList.contains('is-visible')) {
        closeDetailModal();
      }
    });

    if (modalEnquireBtn) {
      modalEnquireBtn.addEventListener('click', () => {
        closeDetailModal();
      });
    }
  }
}

/* ==========================================================================
   9. INTERACTIVE WORKFLOW BUILDER (Automation S2 & Home S4)
   ========================================================================== */
function initWorkflowBuilder() {
  const workflowContainers = document.querySelectorAll('.js-workflow-section');
  workflowContainers.forEach(container => {
    const steps = container.querySelectorAll('.workflow-step');
    const displayTitle = container.querySelector('.js-workflow-title');
    const displayDesc = container.querySelector('.js-workflow-desc');
    const displayImg = container.querySelector('.js-workflow-img');
    const displayTasks = container.querySelector('.js-workflow-tasks');
    const progressBar = container.querySelector('.js-workflow-progress-bar');
    const progressText = container.querySelector('.js-workflow-progress-text');

    steps.forEach(step => {
      step.addEventListener('click', () => {
        steps.forEach(s => s.classList.remove('is-active'));
        step.classList.add('is-active');

        const title = step.getAttribute('data-title');
        const desc = step.getAttribute('data-desc');
        const img = step.getAttribute('data-img');
        const tasks = step.getAttribute('data-tasks');

        if (displayTitle) displayTitle.textContent = title;
        if (displayDesc) displayDesc.textContent = desc;
        if (displayImg) {
          displayImg.src = img;
          displayImg.alt = title;
        }

        if (displayTasks && tasks) {
          const taskList = tasks.split(';').map((t, idx) => `
            <label style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; cursor: pointer; font-size: 0.9rem;">
              <input type="checkbox" class="js-workflow-chk" data-idx="${idx}" style="accent-color: var(--accent-champagne); width: 18px; height: 18px;">
              <span>${t.trim()}</span>
            </label>
          `).join('');
          displayTasks.innerHTML = taskList;
          attachCheckboxListeners(container);
        }
      });
    });

    attachCheckboxListeners(container);
  });

  function attachCheckboxListeners(container) {
    const checkboxes = container.querySelectorAll('.js-workflow-chk');
    const progressBar = container.querySelector('.js-workflow-progress-bar');
    const progressText = container.querySelector('.js-workflow-progress-text');

    if (!checkboxes.length) return;

    function updateProgress() {
      const checked = container.querySelectorAll('.js-workflow-chk:checked').length;
      const total = checkboxes.length;
      const pct = Math.round((checked / total) * 100);
      if (progressBar) progressBar.style.width = `${pct}%`;
      if (progressText) progressText.textContent = `${pct}% Workflow Protocol Ready`;
    }

    checkboxes.forEach(chk => {
      chk.addEventListener('change', updateProgress);
    });
  }
}

/* ==========================================================================
   10. AUTH VALIDATION & DEMO BEHAVIOR (Rules 22 & 23)
   ========================================================================== */
function initAuthForms() {
  // Show / Hide Password toggle
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.password-wrapper');
      const input = wrapper.querySelector('input');
      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = 'Hide';
      } else {
        input.type = 'password';
        btn.textContent = 'Show';
      }
    });
  });

  // Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAuthErrors(loginForm);
      let isValid = true;

      const email = document.getElementById('loginEmail');
      const pass = document.getElementById('loginPassword');
      const feedback = document.getElementById('loginDemoFeedback');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        showError(email, 'Please enter a valid clinic or personal email address.');
        isValid = false;
      }

      if (!pass.value.trim() || pass.value.length < 6) {
        showError(pass, 'Password must be at least 6 characters.');
        isValid = false;
      }

      if (isValid && feedback) {
        feedback.innerHTML = `
          <div class="badge" style="background: rgba(39, 174, 96, 0.15); color: #27ae60; border-color: rgba(39, 174, 96, 0.4); padding: 0.75rem 1rem; width: 100%; border-radius: 8px; font-size: 0.85rem; line-height: 1.4;">
            ✓ Demo credentials validated. Welcome to Skincare Suite. Redirecting to <a href="automation.html" style="text-decoration: underline; font-weight: bold; color: inherit;">Workflow Suite</a>...
          </div>
        `;
        setTimeout(() => {
          window.location.href = 'automation.html';
        }, 1200);
      }
    });
  }

  // Register Form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAuthErrors(registerForm);
      let isValid = true;

      const name = document.getElementById('regName');
      const email = document.getElementById('regEmail');
      const pass = document.getElementById('regPassword');
      const confirmPass = document.getElementById('regConfirmPassword');
      const terms = document.getElementById('regTerms');
      const feedback = document.getElementById('registerDemoFeedback');

      if (!name.value.trim()) {
        showError(name, 'Please enter your full name.');
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
      }

      if (!pass.value.trim() || pass.value.length < 6) {
        showError(pass, 'Password must be at least 6 characters.');
        isValid = false;
      }

      if (pass.value !== confirmPass.value) {
        showError(confirmPass, 'Passwords do not match.');
        isValid = false;
      }

      if (terms && !terms.checked) {
        showError(terms, 'You must agree to the Terms of Demonstration.');
        isValid = false;
      }

      if (isValid && feedback) {
        feedback.innerHTML = `
          <div class="badge" style="background: rgba(39, 174, 96, 0.15); color: #27ae60; border-color: rgba(39, 174, 96, 0.4); padding: 0.75rem 1rem; width: 100%; border-radius: 8px; font-size: 0.85rem; line-height: 1.4;">
            ✓ Demonstration account created. Launching <a href="automation.html" style="text-decoration: underline; font-weight: bold; color: inherit;">Skincare Suite Automation</a>...
          </div>
        `;
        setTimeout(() => {
          window.location.href = 'automation.html';
        }, 1200);
      }
    });
  }

  function clearAuthErrors(formEl) {
    formEl.querySelectorAll('.form-feedback').forEach(el => el.classList.remove('is-error'));
  }
}

/* ==========================================================================
   11. DASHBOARD DEMO FUNCTIONALITY (Rule 24)
   ========================================================================== */
function initDashboard() {
  const tabBtns = document.querySelectorAll('.js-dash-tab');
  const tabPanels = document.querySelectorAll('.js-dash-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('is-active'));
      tabPanels.forEach(p => p.classList.remove('is-active'));

      btn.classList.add('is-active');
      const target = btn.getAttribute('data-tab');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('is-active');
    });
  });

  // Task Completion Toggles
  document.querySelectorAll('.js-dash-task-chk').forEach(chk => {
    chk.addEventListener('change', () => {
      const parent = chk.closest('tr') || chk.closest('li') || chk.closest('div');
      if (chk.checked) {
        parent.style.opacity = '0.6';
        parent.style.textDecoration = 'line-through';
      } else {
        parent.style.opacity = '1';
        parent.style.textDecoration = 'none';
      }
    });
  });

  // Add Demo Appointment Modal Trigger
  const addApptBtn = document.querySelector('.js-add-demo-appt');
  if (addApptBtn) {
    addApptBtn.addEventListener('click', () => {
      const apptTable = document.getElementById('demoApptTableBody');
      if (!apptTable) return;
      const clientNames = ['Eleanor Vance', 'Sophia Laurent', 'Dr. Marcus Webb', 'Camille Dupont'];
      const treatments = ['HydraSkin Deluxe', 'LED Rejuvenation', 'ThermaLift Jawline', 'DermaView 3D Scan'];
      const randomClient = clientNames[Math.floor(Math.random() * clientNames.length)];
      const randomTreatment = treatments[Math.floor(Math.random() * treatments.length)];
      const row = document.createElement('tr');
      row.style.borderBottom = '1px solid var(--border-subtle)';
      row.innerHTML = `
        <td style="padding: 1rem 0.75rem; font-weight: 600;">${randomClient}</td>
        <td style="padding: 1rem 0.75rem;"><span class="badge">${randomTreatment}</span></td>
        <td style="padding: 1rem 0.75rem; color: var(--text-muted);">Today, 04:30 PM</td>
        <td style="padding: 1rem 0.75rem;"><span class="badge" style="background: rgba(39, 174, 96, 0.15); color: #27ae60;">Confirmed</span></td>
      `;
      apptTable.prepend(row);
      alert(`Demo appointment created for ${randomClient} (${randomTreatment})!`);
    });
  }
}

/* ==========================================================================
   12. SCROLL REVEAL (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));
}
