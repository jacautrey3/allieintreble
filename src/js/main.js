/* ============================================================
   Allie in Treble — Main JS
   ============================================================ */

// API Gateway URL is injected by GitHub Actions from the API_GATEWAY_URL secret.
// During local development replace this value with your deployed API URL.
const API_URL = 'REPLACE_WITH_API_GATEWAY_URL';

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('nav-links--open');
    navToggle.classList.toggle('nav-toggle--open', open);
    navToggle.setAttribute('aria-expanded', open);
  });
}

/* ---------- Inquiry form ---------- */
const inquiryForm = document.getElementById('inquiryForm');

if (inquiryForm) {
  inquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn  = document.getElementById('submitBtn');
    const formError  = document.getElementById('formError');
    const formSuccess = document.getElementById('formSuccess');

    // Reset error state
    formError.hidden = true;

    submitBtn.textContent = 'Sending\u2026';
    submitBtn.disabled    = true;

    const payload = {
      name:    document.getElementById('name').value.trim(),
      email:   document.getElementById('email').value.trim(),
      phone:   document.getElementById('phone').value.trim(),
      level:   document.getElementById('level').value,
      message: document.getElementById('message').value.trim(),
    };

    try {
      const response = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Server responded ${response.status}`);

      // Show success
      inquiryForm.hidden   = true;
      formSuccess.hidden   = false;

    } catch (err) {
      console.error('Inquiry submission failed:', err);
      formError.hidden  = false;
      submitBtn.textContent = 'Send Inquiry';
      submitBtn.disabled    = false;
    }
  });
}
