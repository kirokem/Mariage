// Mobile navigation toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Countdown to the wedding
const weddingDate = new Date('2027-06-11T16:00:00');
const countdownText = document.getElementById('countdown-text');

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    countdownText.textContent = "C'est le grand jour ! 🎉";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  countdownText.textContent = `J - ${days} jours, ${hours}h ${minutes}min avant le mariage de Charlène & Julien`;
}

updateCountdown();
setInterval(updateCountdown, 60000);

// RSVP form: show/hide fields based on attendance, and handle submission
const rsvpForm = document.getElementById('rsvp-form');
const attendingOnlyFields = document.querySelectorAll('.attending-only');
const confirmation = document.getElementById('form-confirmation');

function toggleAttendingFields() {
  const selected = rsvpForm.querySelector('input[name="attending"]:checked');
  const isAttending = selected && selected.value === 'yes';
  attendingOnlyFields.forEach((field) => {
    field.classList.toggle('hidden', !isAttending);
  });
}

rsvpForm.querySelectorAll('input[name="attending"]').forEach((radio) => {
  radio.addEventListener('change', toggleAttendingFields);
});

rsvpForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!rsvpForm.checkValidity()) {
    rsvpForm.reportValidity();
    return;
  }

  const data = new FormData(rsvpForm);
  const name = data.get('fullname');
  const attending = data.get('attending');

  if (attending === 'yes') {
    confirmation.textContent = `Merci ${name} ! Nous avons hâte de célébrer ce moment avec vous. 💜`;
  } else {
    confirmation.textContent = `Merci ${name} pour votre réponse, vous nous manquerez !`;
  }

  rsvpForm.reset();
  toggleAttendingFields();
});
