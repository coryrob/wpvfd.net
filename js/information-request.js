(() => {
  const form = document.querySelector('#information-request-form');
  const button = form.querySelector('button[type="submit"]');
  const availability = document.querySelector('#request-availability');
  const status = document.querySelector('#request-status');
  let token = '';
  let widget;
  let sending = false;
  function resetSecurity() {
    token = '';
    button.disabled = true;
    if (widget !== undefined) window.turnstile.reset(widget);
  }
  async function setup() {
    try {
      const response = await fetch('/api/information-requests', { cache: 'no-store' });
      if (!response.ok) throw new Error();
      const config = await response.json();
      if (!config.available || !config.siteKey) throw new Error();
      window.requestSecurityReady = () => {
        widget = window.turnstile.render('#request-security', {
          sitekey: config.siteKey, action: 'information_request',
          callback: value => { token = value; button.disabled = sending; },
          'expired-callback': resetSecurity,
          'error-callback': () => {
            token = ''; button.disabled = true;
            availability.textContent = 'The security check could not load. Refresh to retry or call (903) 873-3011.';
          }
        });
      };
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=requestSecurityReady&render=explicit';
      script.async = true;
      script.onerror = () => { availability.textContent = 'The security check could not load. Refresh to retry or call (903) 873-3011.'; };
      document.head.append(script);
      availability.textContent = 'Complete the form and security check to send your request.';
    } catch {
      availability.textContent = 'Online requests are currently unavailable. Please call (903) 873-3011 or email Chief@wpvfd.net and asstchief@wpvfd.net.';
    }
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity() || !token) return;
    sending = true;
    button.disabled = true;
    button.textContent = 'Sending request...';
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending your request. Keep this page open.';
    status.classList.remove('application-error');
    try {
      const body = Object.fromEntries(new FormData(form));
      body.turnstileToken = token;
      const response = await fetch('/api/information-requests', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.error || 'We could not confirm delivery. Please try again or call (903) 873-3011.');
      form.hidden = true;
      availability.textContent = '';
      status.textContent = 'Thank you. Your information request has been sent to the Chief and Assistant Chief.';
    } catch (error) {
      status.textContent = `${error.message} Your answers have been kept on this page.`;
      status.classList.add('application-error');
      resetSecurity();
    } finally {
      sending = false;
      button.disabled = !token;
      button.textContent = 'Send information request';
      form.removeAttribute('aria-busy');
      status.focus();
    }
  });
  setup();
})();
