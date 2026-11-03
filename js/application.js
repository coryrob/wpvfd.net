(() => {
  const form = document.querySelector('#application-form');
  const sectionsContainer = document.querySelector('#application-sections');
  const status = document.querySelector('#application-status');
  const submit = document.querySelector('#application-submit');
  const availability = document.querySelector('#application-availability');
  let widgetId;
  let securityToken = '';
  let onlineAvailable = false;
  const submissionId = crypto.randomUUID();
  let sending = false;
  const today = new Date();
  const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  for (const section of window.applicationSections) {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'application-section';
    const legend = document.createElement('legend');
    legend.textContent = section.title;
    fieldset.append(legend);
    if (section.note) {
      const note = document.createElement('p');
      note.textContent = section.note;
      fieldset.append(note);
    }
    const grid = document.createElement('div');
    grid.className = 'application-grid';
    for (const definition of section.fields) {
      const label = document.createElement('label');
      label.className = 'application-field';
      if (definition.multiline) label.classList.add('application-wide');
      const caption = document.createElement('span');
      caption.textContent = definition.label + (definition.required ? ' *' : '');
      const input = document.createElement(definition.choices ? 'select' : definition.multiline ? 'textarea' : 'input');
      input.name = definition.name;
      input.id = definition.name;
      input.required = !!definition.required;
      if (definition.choices) {
        input.add(new Option('Select an option', ''));
        definition.choices.forEach(choice => input.add(new Option(choice, choice)));
      } else {
        input.maxLength = definition.maxLength;
        if (definition.multiline) input.rows = 5;
        else input.type = definition.type || 'text';
        if (definition.pattern) input.pattern = definition.pattern;
        if (definition.inputmode) input.inputMode = definition.inputmode;
        if (definition.autocomplete) input.autocomplete = definition.autocomplete;
        if (definition.type === 'date') {
          input.max = localDate;
          if (definition.name !== 'birthDate') input.value = localDate;
        }
      }
      label.append(caption, input);
      grid.append(label);
    }
    fieldset.append(grid);
    sectionsContainer.append(fieldset);
  }
  for (const consent of window.applicationConsents) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = `Read application packet page ${consent.page}`;
    const content = document.createElement('p');
    content.className = 'application-consent-copy';
    content.textContent = consent.text;
    details.append(summary, content);
    document.querySelector('#application-consents').append(details);
  }
  const conditions = [
    ['membershipType', 'Other', 'membershipOther'],
    ['licenseMatches', 'No', 'licenseAddress'],
    ['heardFrom', 'Other', 'heardOther']
  ];
  for (const [source, value, target] of conditions) {
    const update = () => { form.elements[target].required = form.elements[source].value === value; };
    form.elements[source].addEventListener('change', update);
    update();
  }
  function message(text, error = false) {
    status.textContent = text;
    status.classList.toggle('application-error', error);
    status.focus();
    status.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
  // Handle validation here so blocked submissions also display a visible reason.
  form.noValidate = true;
  submit.disabled = false;
  function resetSecurity() {
    securityToken = '';
    submit.disabled = sending;
    availability.textContent = 'Complete the security check again before submitting.';
    if (widgetId !== undefined) window.turnstile.reset(widgetId);
  }
  async function setup() {
    try {
      const response = await fetch('/api/applications', { cache: 'no-store' });
      if (!response.ok) throw new Error();
      const config = await response.json();
      if (!config.available || !config.siteKey) throw new Error();
      onlineAvailable = true;
      window.applicationSecurityReady = () => {
        widgetId = window.turnstile.render('#application-security', {
          sitekey: config.siteKey,
          action: 'membership',
          callback: token => { securityToken = token; submit.disabled = sending; },
          'expired-callback': resetSecurity,
          'error-callback': () => { securityToken = ''; availability.textContent = 'The security check could not load. Refresh this page to try again.'; }
        });
      };
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=applicationSecurityReady&render=explicit';
      script.async = true;
      script.onerror = () => { availability.textContent = 'The security check could not load. Refresh this page to try again.'; };
      document.head.append(script);
      availability.textContent = 'Complete the form and security check, then submit your application.';
    } catch {
      availability.textContent = 'Online submission is currently unavailable. You can download and fill out the packet, then call (903) 873-3011 to arrange delivery.';
    }
  }
  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, content: reader.result.split(',')[1] });
      reader.onerror = () => reject(new Error('A document could not be read. Select it again and retry.'));
      reader.readAsDataURL(file);
    });
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    if (!form.checkValidity()) {
      const invalid = form.querySelector(':invalid');
      const label = invalid?.labels?.[0]?.textContent.trim().replace(/\s+/g, ' ') || invalid?.name || 'a required field';
      message(`Your application has not been sent. Check ${label}: ${invalid?.validationMessage || 'Complete this field.'}`, true);
      invalid?.focus();
      invalid?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      form.reportValidity();
      return;
    }
    if (!onlineAvailable) { message('Your application has not been sent. Online submission is unavailable or still loading. Please try again shortly or call (903) 873-3011.', true); return; }
    if (!securityToken) { message('Complete the security check before submitting.', true); return; }
    const files = [...form.elements.driverLicenseCopy.files, ...form.elements.supportingDocuments.files];
    if (files.length > 6 || files.reduce((sum, file) => sum + file.size, 0) > 6 * 1024 * 1024) {
      message('Attach up to six documents totaling 6 MB or less.', true);
      return;
    }
    if (files.some(file => !/\.(pdf|png|jpe?g)$/i.test(file.name))) {
      message('Use PDF, PNG or JPEG documents.', true);
      return;
    }
    sending = true;
    submit.disabled = true;
    submit.textContent = 'Sending application…';
    form.setAttribute('aria-busy', 'true');
    message('Sending your application. Keep this page open.');
    try {
      const values = {};
      window.applicationSections.flatMap(section => section.fields).forEach(field => { values[field.name] = form.elements[field.name].value.trim(); });
      const attachments = await Promise.all(files.map(readFile));
      const response = await fetch('/api/applications', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(120000),
        body: JSON.stringify({ submissionId, values, attachments, turnstileToken: securityToken, website: form.elements.website.value,
          certificationAccepted: form.elements.certificationAccepted.checked,
          screeningAccepted: form.elements.screeningAccepted.checked,
          electronicSignatureAccepted: form.elements.electronicSignatureAccepted.checked })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.error || 'We could not confirm delivery. Please try again or call (903) 873-3011.');
      form.hidden = true;
      availability.textContent = '';
      message(`Thank you. Your application has been sent to the department for review. Your reference number is ${result.reference}. The department will contact you about next steps.`);
    } catch (error) {
      const explanation = error.name === 'TimeoutError' ? 'Delivery confirmation timed out. Call (903) 873-3011 to check whether your application arrived before retrying.' : error.message;
      message(`${explanation} Your answers have been kept on this page.`, true);
      resetSecurity();
    } finally {
      sending = false;
      submit.disabled = false;
      submit.textContent = 'Submit application';
      form.removeAttribute('aria-busy');
    }
  });
  // Personal information stays in memory only; no local storage or URL fields.
  window.addEventListener('beforeunload', event => {
    if (!form.hidden && (sending || form.elements.firstName.value || form.elements.lastName.value)) {
      event.preventDefault();
      event.returnValue = '';
    }
  });
  setup();
})();
