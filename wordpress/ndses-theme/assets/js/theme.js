(function () {
  // Scroll-reveal: fade/slide in each section's content once it enters the
  // viewport. Skipped entirely when the visitor prefers reduced motion, or
  // when IntersectionObserver isn't available — content just stays visible.
  const prefersMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (prefersMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll('.section > .container');
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach(function (target) {
      target.setAttribute('data-reveal', '');
      observer.observe(target);
    });
  }

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');

  if (header && toggle) {
    toggle.addEventListener('click', function () {
      const isOpen = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const calculator = document.querySelector('[data-calculator]');
  if (calculator) {
    const form = calculator.querySelector('form');
    const result = calculator.querySelector('.calculator-result');
    const rules = {
      'Home/Garage Cleanout': '10/12 Yard Dumpster',
      'Home Remodel': '15 Yard Dumpster',
      'Bathroom/Kitchen Demo': '15 Yard Dumpster',
      'Roofing/Siding Teardown': '20 Yard Dumpster',
      'Concrete, Dirt, and Rocks': '10/12 Yard Dumpster',
      Other: '20 Yard Dumpster',
    };

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const project = data.get('project') || 'Home Remodel';
      const materials = data.getAll('materials');
      let recommendation = rules[project] || '15 Yard Dumpster';

      if (materials.includes('Other Heavy Materials')) {
        recommendation = '10/12 Yard Dumpster';
      } else if (project === 'Roofing/Siding Teardown') {
        recommendation = '20 Yard Dumpster';
      }

      result.innerHTML = '<p class="eyebrow">Recommendation</p><h2>' + recommendation + '</h2><p>This size is a good starting point for your selected project. NDS can confirm final sizing, material restrictions, and availability when you request a quote.</p><p class="small-note">This is a 15 day rental. If you use a credit card for payment, there will be a 3% fee. Dimensions may vary slightly, but capacity remains the same.</p><a class="button button-primary" href="' + window.location.origin + '/contact?service=dumpster">Request Quote</a>';
    });

    ndsesInitAddressLookup(form.querySelector('input[name="address"]'));
  }

  /**
   * Live address autocomplete + service-county check, powered by the
   * ndses_geocode AJAX action (server-side proxy to OpenStreetMap Nominatim).
   */
  function ndsesInitAddressLookup(input) {
    if (!input || typeof ndsesData === 'undefined') return;

    const field = input.closest('label') || input.parentElement;
    field.style.position = 'relative';

    const list = document.createElement('ul');
    list.className = 'address-suggestions';
    list.hidden = true;
    field.appendChild(list);

    const status = document.createElement('small');
    status.className = 'address-status';
    field.appendChild(status);

    let debounceId = null;
    let lastSelected = '';

    function renderSuggestions(results) {
      list.innerHTML = '';
      if (!results.length) {
        list.hidden = true;
        return;
      }
      results.forEach(function (result) {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = result.label;
        button.addEventListener('click', function () {
          input.value = result.label;
          lastSelected = result.label;
          list.hidden = true;
          showStatus(result.county);
        });
        item.appendChild(button);
        list.appendChild(item);
      });
      list.hidden = false;
    }

    function showStatus(county) {
      const inArea = county && ndsesData.serviceCounties.indexOf(county) !== -1;
      status.classList.toggle('in-area', Boolean(inArea));
      if (inArea) {
        status.textContent = '✓ ' + county + ' County is in the NDS service area.';
      } else if (county) {
        status.textContent = county + ' County is outside the core NDS service area — call ' + ndsesData.phone + ' to confirm.';
      } else {
        status.textContent = '';
      }
    }

    input.addEventListener('input', function () {
      if (input.value !== lastSelected) {
        status.textContent = '';
        status.classList.remove('in-area');
      }
      if (debounceId) clearTimeout(debounceId);
      const query = input.value.trim();
      if (query.length < 3 || query === lastSelected) {
        list.hidden = true;
        return;
      }
      debounceId = setTimeout(function () {
        fetch(ndsesData.ajaxUrl + '?action=ndses_geocode&q=' + encodeURIComponent(query))
          .then(function (response) { return response.json(); })
          .then(function (data) { renderSuggestions(data.results || []); })
          .catch(function () { list.hidden = true; });
      }, 400);
    });

    input.addEventListener('blur', function () {
      setTimeout(function () { list.hidden = true; }, 150);
    });
  }

  /**
   * PayEngine payment form. Card/bank details are tokenized client-side by
   * PayEngine's SecureFields JS SDK (hosted iframes — the raw numbers never
   * touch this page or NDS's server), then the resulting token is posted to
   * the ndses/v1/payments/charge REST route, which charges it server-side.
   */
  const payEngineForm = document.querySelector('[data-payengine-form]');
  if (payEngineForm) {
    const statusEl = payEngineForm.querySelector('.form-status');
    const submitButton = payEngineForm.querySelector('button[type="submit"]');
    const cardFields = payEngineForm.querySelector('[data-payment-fields="card"]');
    const achFields = payEngineForm.querySelector('[data-payment-fields="ach"]');
    // PayEngine's createCard()/createBankAccount() validate every field
    // registered on that SecureFields form instance, not just the ones
    // relevant to the call being made. Card and ACH fields must therefore
    // live on two separate instances, or submitting a card payment fails
    // validation against the empty, hidden ACH fields (and vice versa).
    let cardForm = null;
    let achForm = null;

    payEngineForm.querySelectorAll('input[name="paymentMethod"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (!radio.checked) return;
        cardFields.hidden = radio.value !== 'card';
        achFields.hidden = radio.value !== 'ach';
      });
    });

    function initSecureFields() {
      if (!window.PayEngine || (cardForm && achForm)) return;
      const css = { fontFamily: 'inherit', fontSize: '16px', width: '100%', height: '46px', padding: '10px 12px', color: '#14211a' };

      Promise.all([
        window.PayEngine.SecureFields.create(),
        window.PayEngine.SecureFields.create()
      ]).then(function (forms) {
        cardForm = forms[0];
        achForm = forms[1];

        cardForm.field('#pe-card-name', { type: 'text', name: 'card_holder', placeholder: 'Name on card', validations: ['required'], css: css });
        cardForm.field('#pe-card-number', { type: 'card-number', name: 'card_number', placeholder: 'Card number', showCardIcon: true, validations: ['required', 'validCardNumber'], css: css });
        cardForm.field('#pe-card-expiry', { type: 'card-expiration-date', name: 'card_exp', placeholder: 'MM / YY', validations: ['required', 'validCardExpirationDate'], css: css });
        cardForm.field('#pe-card-cvc', { type: 'card-security-code', name: 'card_cvc', placeholder: 'CVC', maxLength: 4, validations: ['required', 'validCardSecurityCode'], css: css });
        cardForm.field('#pe-card-zip', { type: 'zip-code', name: 'address_zip', placeholder: 'Billing ZIP', validations: ['required'], css: css });

        achForm.field('#pe-routing-number', { type: 'number', name: 'routing_number', placeholder: 'Routing number', validations: ['required'], css: css });
        achForm.field('#pe-account-number', { type: 'number', name: 'account_number', placeholder: 'Account number', validations: ['required'], css: css });
        achForm.field('#pe-ach-first-name', { type: 'text', name: 'first_name', placeholder: 'First name', validations: ['required'], css: css });
        achForm.field('#pe-ach-last-name', { type: 'text', name: 'last_name', placeholder: 'Last name', validations: ['required'], css: css });

        if (submitButton) submitButton.disabled = false;
      });
    }

    if (submitButton) submitButton.disabled = true;
    if (window.PayEngine) {
      initSecureFields();
    } else {
      const securefieldsScript = document.getElementById('payengine-securefields-js');
      if (securefieldsScript) securefieldsScript.addEventListener('load', initSecureFields);
    }

    payEngineForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!payEngineForm.checkValidity()) {
        payEngineForm.reportValidity();
        return;
      }
      if (!cardForm || !achForm) {
        if (statusEl) {
          statusEl.textContent = 'Payment fields are still loading. Please wait a moment and try again.';
          statusEl.className = 'form-status is-error';
        }
        return;
      }

      const paymentMethod = (payEngineForm.querySelector('input[name="paymentMethod"]:checked') || {}).value || 'card';
      const values = Object.fromEntries(new FormData(payEngineForm).entries());

      if (submitButton) submitButton.disabled = true;
      if (statusEl) {
        statusEl.textContent = 'Processing your payment…';
        statusEl.className = 'form-status';
      }

      const tokenize = paymentMethod === 'ach'
        ? achForm.createBankAccount()
        : cardForm.createCard({ manuallyEntered: true });

      tokenize
        .then(function (tokenObj) {
          const token = tokenObj.token
            || (tokenObj.card && tokenObj.card.token)
            || (tokenObj.bank_account && tokenObj.bank_account.token);

          if (!token) {
            throw new Error('no-token');
          }

          return fetch(ndsesData.restUrl + 'payments/charge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token: token,
              paymentMethod: paymentMethod,
              accountNumber: values.accountNumber,
              amount: values.amount,
              email: values.email
            })
          });
        })
        .then(function (response) { return response.json().then(function (body) { return { ok: response.ok, body: body }; }); })
        .then(function (result) {
          const mode = result.body && result.body.mode;
          if (result.ok && mode === 'success') {
            payEngineForm.reset();
            if (statusEl) {
              statusEl.textContent = result.body.message || 'Thank you! Your payment has been received.';
              statusEl.className = 'form-status is-success';
            }
          } else if (statusEl) {
            statusEl.textContent = (result.body && result.body.message) || 'Payment could not be completed. Please try again or contact NDS.';
            statusEl.className = 'form-status is-error';
          }
        })
        .catch(function () {
          if (statusEl) {
            statusEl.textContent = 'We could not process those payment details. Please check them and try again.';
            statusEl.className = 'form-status is-error';
          }
        })
        .finally(function () {
          if (submitButton) submitButton.disabled = false;
        });
    });
  }

  /**
   * Inquiry forms (contact, quote requests) submit to the ndses/v1/forms
   * REST route, which honeypot-checks, rate-limits, stores the submission
   * as a form_submission post, and emails the office.
   */
  document.querySelectorAll('[data-inquiry-form]').forEach(function (form) {
    const status = form.querySelector('.form-status');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      if (submitButton) submitButton.disabled = true;
      if (status) {
        status.textContent = 'Sending your request…';
        status.className = 'form-status';
      }

      fetch(ndsesData.restUrl + 'forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (response) {
          return response.json().then(function (body) { return { ok: response.ok, body: body }; });
        })
        .then(function (result) {
          if (result.ok) {
            form.reset();
            if (status) {
              status.textContent = 'Thanks — your request has been sent. NDS will be in touch soon.';
              status.className = 'form-status is-success';
            }
          } else {
            if (status) {
              status.textContent = (result.body && result.body.message) || 'Something went wrong. Please try again or call NDS directly.';
              status.className = 'form-status is-error';
            }
          }
        })
        .catch(function () {
          if (status) {
            status.textContent = 'Something went wrong. Please try again or call NDS directly.';
            status.className = 'form-status is-error';
          }
        })
        .finally(function () {
          if (submitButton) submitButton.disabled = false;
        });
    });
  });
})();

