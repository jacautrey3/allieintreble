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

    const emailValue = document.getElementById('email').value.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
    if (!emailValid) {
      formError.querySelector('p').textContent = 'Please enter a valid email address (e.g. jane@example.com).';
      formError.hidden = false;
      return;
    }

    submitBtn.textContent = 'Sending\u2026';
    submitBtn.disabled    = true;

    const payload = {
      name:     document.getElementById('name').value.trim(),
      email:    emailValue,
      phone:    document.getElementById('phone').value.trim(),
      level:    document.getElementById('level').value,
      duration: document.getElementById('duration').value,
      message:  document.getElementById('message').value.trim(),
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
      formError.querySelector('p').innerHTML = 'Something went wrong \u2014 please try again or email Allie directly at <a href="mailto:allievtaylor@gmail.com">allievtaylor@gmail.com</a>.';
      formError.hidden  = false;
      submitBtn.textContent = 'Send Inquiry';
      submitBtn.disabled    = false;
    }
  });
}
