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

  document.querySelectorAll('[data-payment-placeholder]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const note = document.createElement('p');
      note.className = 'small-note';
      note.textContent = 'Payment flow is ready for PayEngine connection. No payment was processed.';
      form.appendChild(note);
    });
  });

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

