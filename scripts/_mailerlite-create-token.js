// Fill token name and accept terms, then create
const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
const inp = document.querySelector('input[type="text"]');
setter.call(inp, 'MailerLite API');
inp.dispatchEvent(new Event('input', {bubbles:true}));
// Check the terms checkbox
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
for (let cb of checkboxes) {
  if (cb.offsetParent !== null) {
    cb.checked = true;
    cb.dispatchEvent(new Event('change', {bubbles:true}));
    break;
  }
}
// Click Create token
const btns = document.querySelectorAll('button');
for (let b of btns) {
  if (b.textContent.trim() === 'Create token') {
    b.disabled = false;
    b.click();
    break;
  }
}
