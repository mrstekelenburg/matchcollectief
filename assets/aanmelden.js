(function () {
  const form = document.getElementById('aanmeldformulier');
  if (!form) return;

  const recruiterTypes = new Set([
    'Recruiter',
    'Recruitmentspecialist',
    'Recruitmentbureau',
    'Interne recruiter'
  ]);
  const typeInputs = Array.from(form.querySelectorAll('input[name="type_aanmelder"]'));
  const recruitercodeBlock = document.getElementById('recruitercode-vraag');
  const recruitercodeInputs = Array.from(form.querySelectorAll('input[name="recruitercode_geregistreerd"]'));
  const status = document.getElementById('form-status');
  const submitButton = document.getElementById('verzendknop');
  const sourceInput = document.getElementById('bron');
  const params = new URLSearchParams(window.location.search);

  function updateRecruitercodeQuestion() {
    const selected = form.querySelector('input[name="type_aanmelder"]:checked');
    const show = selected && recruiterTypes.has(selected.value);
    recruitercodeBlock.hidden = !show;
    recruitercodeInputs.forEach(function (input) {
      input.required = Boolean(show);
      if (!show) input.checked = false;
    });
  }

  typeInputs.forEach(function (input) {
    input.addEventListener('change', updateRecruitercodeQuestion);
  });

  const payment = params.get('betaling');
  if (payment === 'maand' || payment === 'jaar') {
    const valueStart = payment === 'maand' ? 'Maandbetaling' : 'Jaarbetaling';
    const paymentInput = Array.from(form.querySelectorAll('input[name="betalingsperiode"]'))
      .find(function (input) { return input.value.indexOf(valueStart) === 0; });
    if (paymentInput) paymentInput.checked = true;
  }

  const source = params.get('bron') || params.get('utm_source');
  if (source && sourceInput) sourceInput.value = source.slice(0, 120);

  form.addEventListener('submit', async function (event) {
    if (!form.reportValidity()) return;
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = 'Aanmelding versturen…';
    status.className = 'form-status';
    status.textContent = '';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('Formulier kon niet worden verzonden.');
      window.location.assign('bedankt.html');
    } catch (error) {
      status.className = 'form-status form-status-error';
      status.textContent = 'Verzenden is niet gelukt. Probeer het opnieuw of mail naar info@remorec.com.';
      submitButton.disabled = false;
      submitButton.textContent = 'Aanmelding versturen';
    }
  });

  updateRecruitercodeQuestion();
}());
