'use strict';

/* ---------- Mobile menu ---------- */
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');

function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
}

toggle.addEventListener('click', () => {
  setMenu(toggle.getAttribute('aria-expanded') !== 'true');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    toggle.focus();
  }
});

menu.addEventListener('click', (e) => {
  if (e.target.closest('a')) setMenu(false);
});

/* ---------- Highlight the link for the section in view ---------- */
const links = [...menu.querySelectorAll('a')];
const sections = links.map((link) => document.querySelector(link.getAttribute('href')));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((link) => {
      const active = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach((section) => section && observer.observe(section));

/* ---------- Contact form validation ---------- */
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const fields = [...form.querySelectorAll('input, textarea')];

const messages = {
  name: 'Enter your name.',
  email: 'Enter a valid email address, like name@example.com.',
  message: 'Write a message of at least 10 characters.'
};

function validate(field) {
  const error = document.getElementById(`${field.id}-error`);
  const valid = field.checkValidity();

  field.setAttribute('aria-invalid', String(!valid));
  if (valid) field.removeAttribute('aria-describedby');
  else field.setAttribute('aria-describedby', error.id);

  error.textContent = valid ? '' : messages[field.id];
  return valid;
}

fields.forEach((field) => {
  field.addEventListener('blur', () => validate(field));
  field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') validate(field);
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  status.textContent = '';

  const results = fields.map(validate);
  const firstInvalid = fields[results.indexOf(false)];

  if (firstInvalid) {
    firstInvalid.focus();
    status.textContent = 'Please fix the highlighted fields.';
    return;
  }

  // Demo only. To receive real messages, send the data to a form service,
  // for example Formspree: fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', body: new FormData(form) })
  status.textContent = 'Thanks! Your message was sent. I will reply soon.';
  form.reset();
});

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();