const plans = {
  starter: { name: 'Starter', monthly: 499, yearly: 4990, desc: 'For freelancers, nail artists and micro-businesses.' },
  growth: { name: 'Growth', monthly: 1499, yearly: 14990, desc: 'For restaurants, salons, shops and growing SMEs.' },
  premium: { name: 'Premium', monthly: 3999, yearly: 39990, desc: 'For hotels, venues and larger service businesses.' }
};

const sectorFields = {
  hotel: [
    ['Room types', 'Single, Double, Suite'], ['Room prices', 'From ₹3,500 per night'], ['Availability link', 'https://booking-link.com'],
    ['Check-in time', '14:00'], ['Check-out time', '11:00'], ['Facilities', 'WiFi, Pool, Parking, Breakfast'], ['Cancellation policy', 'Free cancellation up to 24 hours']
  ],
  restaurant: [
    ['Cuisine type', 'South Indian, Cafe, Italian'], ['Menu link', 'https://menu-link.com'], ['Table booking link', 'https://booking-link.com'],
    ['Delivery link', 'https://delivery-link.com'], ['Price range', '₹₹'], ['Dietary options', 'Vegetarian, Vegan, Halal']
  ],
  clothing: [
    ['Product categories', 'Sarees, Dresses, Accessories'], ['Online shop link', 'https://shop-link.com'], ['Instagram link', 'https://instagram.com/store'],
    ['Delivery options', 'India-wide delivery'], ['Return policy', '7-day exchange policy'], ['Size range', 'XS to XXL']
  ],
  beauty: [
    ['Services list', 'Nail art, Manicure, Bridal makeup'], ['Service prices', 'From ₹799'], ['Appointment booking link', 'https://booking-link.com'],
    ['Portfolio / Instagram link', 'https://instagram.com/beauty'], ['Staff details', '2 certified artists'], ['Home visit available', 'Yes / No']
  ],
  freelancer: [
    ['Service category', 'Design, Development, Marketing'], ['Portfolio link', 'https://portfolio.com'], ['Hourly / project price', 'From ₹1,500'],
    ['Availability', 'Weekdays / Remote'], ['Work samples link', 'https://drive.google.com/...'], ['Client review link', 'https://reviews-link.com']
  ],
  service: [
    ['Service type', 'Plumbing, Cleaning, Repairs'], ['Service area', 'City / district covered'], ['Booking link', 'https://booking-link.com'],
    ['Starting price', 'From ₹999'], ['Emergency service', 'Yes / No'], ['License / certification', 'Upload or link']
  ],
  events: [
    ['Venue type', 'Wedding hall, Conference, Outdoor'], ['Capacity', '100–500 people'], ['Package link', 'https://packages.com'],
    ['Catering available', 'Yes / No'], ['Availability link', 'https://availability.com'], ['Event photos link', 'https://gallery.com']
  ],
  realestate: [
    ['Property type', 'Residential, Commercial, Rental'], ['Listing link', 'https://property-listings.com'], ['Service area', 'City / district'],
    ['Consultation link', 'https://consultation-link.com'], ['RERA / license number', 'Enter number'], ['Featured properties', 'Paste links']
  ],
  other: [
    ['Main service or product', 'Describe what you offer'], ['Booking / enquiry link', 'https://link.com'], ['Price range', 'From ₹...'], ['Important customer information', 'Write here']
  ]
};

function formatINR(amount){ return '₹' + Number(amount).toLocaleString('en-IN'); }
function getBusiness(){ return JSON.parse(localStorage.getItem('marketlyBusiness') || 'null'); }
function setBusiness(data){ localStorage.setItem('marketlyBusiness', JSON.stringify(data)); }
function getListing(){ return JSON.parse(localStorage.getItem('marketlyListing') || 'null'); }
function setListing(data){ localStorage.setItem('marketlyListing', JSON.stringify(data)); }
function qs(name){ return new URLSearchParams(location.search).get(name); }

function getAccounts(){ return JSON.parse(localStorage.getItem('marketlyBusinessAccounts') || '[]'); }
function setAccounts(list){ localStorage.setItem('marketlyBusinessAccounts', JSON.stringify(list)); }
function saveAccount(business){
  const accounts = getAccounts();
  const idx = accounts.findIndex(a => a.email === business.email);
  if(idx >= 0) accounts[idx] = business; else accounts.push(business);
  setAccounts(accounts);
}

function seedDemoAccounts(){
  if(localStorage.getItem('marketlyBusinessAccounts')) return; // only seed once
  const demoAccounts = [
    {
      firstName: 'Meera', lastName: 'Rao', email: 'meera@bluewavehotel.com', password: 'Demo@123',
      company: 'Blue Wave Hotel & Spa', businessType: 'sme', location: 'Goa, India', mode: 'both',
      sector: 'hotel', website: 'https://bluewavehotel.com', plan: 'growth', billing: 'monthly',
      price: plans.growth.monthly, paid: true, registeredAt: new Date().toISOString()
    },
    {
      firstName: 'Arjun', lastName: 'Mehta', email: 'arjun@spicetable.in', password: 'Demo@123',
      company: 'Spice Table Restaurant', businessType: 'micro-business', location: 'Mumbai, India', mode: 'offline',
      sector: 'restaurant', website: 'https://spicetable.in', plan: 'starter', billing: 'yearly',
      price: plans.starter.yearly, paid: true, registeredAt: new Date().toISOString()
    },
    {
      firstName: 'Divya', lastName: 'Nair', email: 'divya@glowbeautystudio.com', password: 'Demo@123',
      company: 'Glow Beauty Studio', businessType: 'freelancer', location: 'Bangalore, India', mode: 'both',
      sector: 'beauty', website: 'https://glowbeautystudio.com', plan: 'premium', billing: 'monthly',
      price: plans.premium.monthly, paid: true, registeredAt: new Date().toISOString()
    }
  ];
  setAccounts(demoAccounts);
}

function requireBusiness(){ const b = getBusiness(); if(!b){ location.href = 'business-login.html'; return null; } return b; }

function escapeHtml(str){ const div = document.createElement('div'); div.textContent = str == null ? '' : String(str); return div.innerHTML; }

function getAllMessages(){ return JSON.parse(localStorage.getItem('marketlyMessages') || '{}'); }
function setAllMessages(obj){ localStorage.setItem('marketlyMessages', JSON.stringify(obj)); }

function seedDemoMessages(email){
  const all = getAllMessages();
  if(all[email]) return; // already seeded for this business
  all[email] = [
    { id: 'rv', name: 'Rahul Verma', initials: 'RV', unread: true, messages: [
      { from: 'customer', text: 'Hi! Do you have availability this weekend?', time: '9:14 AM' },
      { from: 'customer', text: 'Can we move the reservation to 8:30 instead of 8:00?', time: '9:20 AM' }
    ]},
    { id: 'ai', name: 'Ananya Iyer', initials: 'AI', unread: true, messages: [
      { from: 'customer', text: 'Hello, I saw your listing on Marketly.', time: 'Yesterday' },
      { from: 'customer', text: 'Do you have a brochure with more details you could send over?', time: 'Yesterday' }
    ]},
    { id: 'sk', name: 'Sana Kapoor', initials: 'SK', unread: true, messages: [
      { from: 'customer', text: 'Hi, I have a booking for Aug 20.', time: '3 days ago' },
      { from: 'customer', text: "I'd like to cancel that booking, is that possible?", time: '3 days ago' }
    ]},
    { id: 'ps', name: 'Priya Shah', initials: 'PS', unread: false, messages: [
      { from: 'customer', text: 'Hi, confirming my booking for tonight.', time: '2:02 PM' },
      { from: 'business', text: 'Yes, we have you down for 7pm, see you soon!', time: '2:10 PM' },
      { from: 'customer', text: 'Thank you, see you at 7pm!', time: '2:11 PM' }
    ]},
    { id: 'km', name: 'Karan Mehta', initials: 'KM', unread: false, messages: [
      { from: 'customer', text: 'Quick question about pricing.', time: '2 days ago' },
      { from: 'business', text: 'Sure, happy to help. What would you like to know?', time: '2 days ago' },
      { from: 'customer', text: 'Perfect, thank you for the quick reply.', time: '2 days ago' }
    ]},
    { id: 'nj', name: 'Neha Joshi', initials: 'NJ', unread: false, messages: [
      { from: 'customer', text: 'Is weekend availability open for next month?', time: '4 days ago' },
      { from: 'business', text: 'Yes, weekends are open, feel free to book anytime.', time: '4 days ago' }
    ]}
  ];
  setAllMessages(all);
}

function initMessages(){
  const list = document.querySelector('#inboxList'); if(!list) return;
  const b = requireBusiness(); if(!b) return;
  seedDemoMessages(b.email);

  const header = document.querySelector('#threadHeader');
  const messagesBox = document.querySelector('#threadMessages');
  const emptyState = document.querySelector('#inboxEmpty');
  const inputRow = document.querySelector('#threadInputForm');
  const countEl = document.querySelector('#inboxCount');
  let activeId = null;

  function getConvos(){ return getAllMessages()[b.email] || []; }

  function render(){
    const convos = getConvos();
    const unreadCount = convos.filter(c => c.unread).length;
    if(countEl) countEl.textContent = unreadCount + ' unread of ' + convos.length + ' conversations';

    list.innerHTML = convos.map(c => {
      const last = c.messages[c.messages.length - 1];
      return `<button type="button" class="inbox-list-item${c.id === activeId ? ' active' : ''}" data-id="${c.id}">
        <span class="message-avatar">${escapeHtml(c.initials)}</span>
        <span class="message-body">
          <span class="message-top"><strong>${escapeHtml(c.name)}</strong><span>${escapeHtml(last.time)}</span></span>
          <p class="message-preview" ${c.unread ? 'style="color:var(--ink);font-weight:600"' : ''}>${escapeHtml(last.text)}</p>
        </span>
        ${c.unread ? '<span class="unread-dot"></span>' : ''}
      </button>`;
    }).join('');

    list.querySelectorAll('.inbox-list-item').forEach(btn => btn.addEventListener('click', () => selectConversation(btn.dataset.id)));

    const active = convos.find(c => c.id === activeId);
    renderThread(active);
  }

  function renderThread(convo){
    if(!convo){
      if(header) header.classList.add('hidden');
      if(messagesBox) messagesBox.classList.add('hidden');
      if(inputRow) inputRow.classList.add('hidden');
      if(emptyState) emptyState.classList.remove('hidden');
      return;
    }
    if(emptyState) emptyState.classList.add('hidden');
    if(header){
      header.classList.remove('hidden');
      header.querySelector('[data-thread-avatar]').textContent = convo.initials;
      header.querySelector('[data-thread-name]').textContent = convo.name;
    }
    if(messagesBox){
      messagesBox.classList.remove('hidden');
      messagesBox.innerHTML = convo.messages.map(m =>
        `<div class="chat-bubble ${m.from === 'business' ? 'out' : 'in'}">${escapeHtml(m.text)}<span class="chat-time">${escapeHtml(m.time)}</span></div>`
      ).join('');
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }
    if(inputRow) inputRow.classList.remove('hidden');
  }

  function selectConversation(id){
    activeId = id;
    const all = getAllMessages();
    const convos = all[b.email] || [];
    const convo = convos.find(c => c.id === id);
    if(convo && convo.unread){ convo.unread = false; setAllMessages(all); }
    render();
  }

  if(inputRow){
    inputRow.addEventListener('submit', e => {
      e.preventDefault();
      if(!activeId) return;
      const input = inputRow.querySelector('input[name="reply"]');
      const text = input.value.trim(); if(!text) return;
      const all = getAllMessages();
      const convos = all[b.email] || [];
      const convo = convos.find(c => c.id === activeId); if(!convo) return;
      convo.messages.push({ from: 'business', text, time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) });
      setAllMessages(all);
      input.value = '';
      render();

      const replies = ['Thanks for the quick reply!', 'Got it, thank you.', 'Sounds good, appreciate the update.', 'Perfect, thanks for letting me know.'];
      setTimeout(() => {
        const all2 = getAllMessages();
        const convos2 = all2[b.email] || [];
        const convo2 = convos2.find(c => c.id === activeId); if(!convo2) return;
        convo2.messages.push({ from: 'customer', text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) });
        setAllMessages(all2);
        if(convo2.id === activeId) render();
      }, 1300);
    });
  }

  const initialConvos = getConvos();
  if(initialConvos.length) selectConversation(initialConvos[0].id);
  else render();
}

function initRegister(){
  const form = document.querySelector('#registerForm'); if(!form) return;
  const planRadios = document.querySelectorAll('input[name="plan"]');
  const billingRadios = document.querySelectorAll('input[name="billing"]');
  const selectedFromUrl = qs('plan');
  if(selectedFromUrl && plans[selectedFromUrl]) document.querySelector(`#plan-${selectedFromUrl}`).checked = true;

  function updateSummary(){
    const plan = document.querySelector('input[name="plan"]:checked').value;
    const billing = document.querySelector('input[name="billing"]:checked').value;
    const price = plans[plan][billing];
    document.querySelector('#summaryPlan').textContent = plans[plan].name;
    document.querySelector('#summaryBilling').textContent = billing === 'monthly' ? 'Monthly' : 'Yearly';
    document.querySelector('#summaryPrice').textContent = formatINR(price) + (billing === 'monthly' ? ' / month' : ' / year');
    document.querySelectorAll('.plan-card').forEach(c => c.classList.toggle('selected', c.dataset.plan === plan));
  }
  planRadios.forEach(r => r.addEventListener('change', updateSummary));
  billingRadios.forEach(r => r.addEventListener('change', updateSummary));
  document.querySelectorAll('.plan-card').forEach(card => card.addEventListener('click', () => { document.querySelector(`#plan-${card.dataset.plan}`).checked = true; updateSummary(); }));
  updateSummary();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const card = form.card_number.value.replace(/\s/g,'');
    if(card.length < 12){ showMessage('registerMessage','Please enter a valid demo card number.', true); return; }
    const plan = form.plan.value; const billing = form.billing.value;
    const business = {
      firstName: form.first_name.value.trim(), lastName: form.last_name.value.trim(), email: form.email.value.trim().toLowerCase(),
      password: form.password.value, company: form.company_name.value.trim(), businessType: form.business_type.value,
      location: form.location.value.trim(), mode: form.mode_service.value, sector: form.sector.value, website: form.website.value.trim(),
      plan, billing, price: plans[plan][billing], paid: true, registeredAt: new Date().toISOString()
    };
    setBusiness(business);
    saveAccount(business);
    showMessage('registerMessage','Payment successful. Your business account has been created. Redirecting...');
    setTimeout(() => location.href = 'business-home.html', 900);
  });
}

function initLogin(){
  const form = document.querySelector('#loginForm'); if(!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const accounts = getAccounts();
    const match = accounts.find(a => a.email === email && a.password === password);
    if(match){ setBusiness(match); localStorage.setItem('marketlyBusinessLoggedIn','true'); location.href='business-home.html'; }
    else showMessage('loginMessage','Email or password is incorrect for this prototype.', true);
  });
}

function populateBusinessFields(b){
  document.querySelectorAll('[data-company]').forEach(el => el.textContent = b.company);
  document.querySelectorAll('[data-owner]').forEach(el => el.textContent = b.firstName + ' ' + b.lastName);
  document.querySelectorAll('[data-sector]').forEach(el => el.textContent = sectorLabel(b.sector));
  document.querySelectorAll('[data-location]').forEach(el => el.textContent = b.location);
  document.querySelectorAll('[data-plan]').forEach(el => el.textContent = `${plans[b.plan].name}: ${formatINR(b.price)} ${b.billing === 'monthly' ? '/ month' : '/ year'}`);
  document.querySelectorAll('[data-email]').forEach(el => el.textContent = b.email);
}

function initDashboardChrome(){
  // Runs on every logged-in business page (identified by the shared dashboard layout).
  // Guards the page and fills in any generic [data-*] placeholders in the header/sidebar area.
  if(!document.querySelector('.dashboard-layout')) return;
  const b = requireBusiness(); if(!b) return;
  populateBusinessFields(b);
  return b;
}

function initHome(){
  if(!document.querySelector('[data-completion]')) return; // only run on the home/dashboard page
  const b = requireBusiness(); if(!b) return;
  const listing = getListing();
  populateBusinessFields(b);
  const completion = listing ? '95%' : '55%';
  document.querySelector('[data-completion]').textContent = completion;
  document.querySelector('[data-listing-status]').textContent = listing ? 'Ready for review' : 'Needs listing details';
  const tasks = document.querySelector('#sectorTasks');
  const fields = sectorFields[b.sector] || sectorFields.other;
  tasks.innerHTML = fields.slice(0,4).map(f => `<li><strong>${f[0]}</strong><span>${f[1]}</span></li>`).join('');
}

function initListing(){
  const form = document.querySelector('#listingForm'); if(!form) return; // only run on the listing page
  const b = requireBusiness(); if(!b) return;
  document.querySelector('[data-company]').textContent = b.company;
  document.querySelector('[data-sector]').textContent = sectorLabel(b.sector);
  form.business_name.value = b.company;
  form.location.value = b.location;
  form.website.value = b.website || '';
  const existing = getListing();
  if(existing){ Object.keys(existing).forEach(k => { if(form[k]) form[k].value = existing[k]; }); }
  renderSectorFields(b.sector, existing);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form); const data = { sector: b.sector, updatedAt: new Date().toISOString() };
    for(const [key,val] of fd.entries()) data[key] = val;
    document.querySelectorAll('[data-sector-field]').forEach(input => data[input.name] = input.value);
    setListing(data);
    showMessage('listingMessage','Your sector-tailored listing has been saved.');
    setTimeout(() => window.scrollTo({top:0, behavior:'smooth'}), 50);
  });
}

function renderSectorFields(sector, existing){
  const box = document.querySelector('#sectorFields');
  const fields = sectorFields[sector] || sectorFields.other;
  box.innerHTML = fields.map((f, i) => `<div class="form-row ${i === fields.length-1 && fields.length%2 ? 'full' : ''}"><label>${f[0]}</label><input data-sector-field name="sector_${i}" type="text" placeholder="${f[1]}" value="${existing?.['sector_'+i] || ''}"></div>`).join('');
}

function sectorLabel(sector){
  const labels = {hotel:'Hotel / Accommodation',restaurant:'Restaurant / Cafe',clothing:'Clothing / Retail',beauty:'Health & Beauty / Nail Art',freelancer:'Freelancer',service:'Service Provider',events:'Events / Venue',realestate:'Real Estate',other:'Other'};
  return labels[sector] || 'Other';
}

function initSubscription(){
  const form = document.querySelector('#subscriptionForm'); if(!form) return;
  const b = requireBusiness(); if(!b) return;

  document.querySelector(`#plan-${b.plan}`).checked = true;
  document.querySelector(`#billing-${b.billing}`).checked = true;
  if(document.querySelector('#currentPlanName')) document.querySelector('#currentPlanName').textContent = plans[b.plan].name;
  if(document.querySelector('#currentBilling')) document.querySelector('#currentBilling').textContent = b.billing === 'monthly' ? 'Monthly' : 'Yearly';
  if(document.querySelector('#currentPrice')) document.querySelector('#currentPrice').textContent = formatINR(b.price) + (b.billing === 'monthly' ? ' / month' : ' / year');

  function updateSummary(){
    const plan = document.querySelector('input[name="plan"]:checked').value;
    const billing = document.querySelector('input[name="billing"]:checked').value;
    const price = plans[plan][billing];
    document.querySelector('#subSummaryPlan').textContent = plans[plan].name;
    document.querySelector('#subSummaryBilling').textContent = billing === 'monthly' ? 'Monthly' : 'Yearly';
    document.querySelector('#subSummaryPrice').textContent = formatINR(price) + (billing === 'monthly' ? ' / month' : ' / year');
    document.querySelectorAll('.plan-card').forEach(c => c.classList.toggle('selected', c.dataset.plan === plan));
  }
  document.querySelectorAll('input[name="plan"],input[name="billing"]').forEach(r => r.addEventListener('change', updateSummary));
  document.querySelectorAll('.plan-card').forEach(card => card.addEventListener('click', () => { document.querySelector(`#plan-${card.dataset.plan}`).checked = true; updateSummary(); }));
  updateSummary();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const plan = form.plan.value; const billing = form.billing.value;
    const updated = Object.assign({}, b, { plan, billing, price: plans[plan][billing] });
    setBusiness(updated); saveAccount(updated);
    populateBusinessFields(updated);
    document.querySelector('#currentPlanName').textContent = plans[updated.plan].name;
    document.querySelector('#currentBilling').textContent = updated.billing === 'monthly' ? 'Monthly' : 'Yearly';
    document.querySelector('#currentPrice').textContent = formatINR(updated.price) + (updated.billing === 'monthly' ? ' / month' : ' / year');
    showMessage('subscriptionMessage','Your subscription has been updated.');
  });

  const cancelBtn = document.querySelector('#cancelSubscription');
  if(cancelBtn) cancelBtn.addEventListener('click', () => {
    showMessage('subscriptionMessage','Your subscription will stay active until the end of the current billing period, then it will not renew.', true);
  });
}

function initSettings(){
  const form = document.querySelector('#settingsForm'); if(!form) return;
  const b = requireBusiness(); if(!b) return;

  form.company_name.value = b.company;
  form.first_name.value = b.firstName;
  form.last_name.value = b.lastName;
  form.email.value = b.email;
  form.location.value = b.location;
  form.website.value = b.website || '';
  if(form.notify_email) form.notify_email.checked = b.notifyEmail !== false;
  if(form.notify_sms) form.notify_sms.checked = !!b.notifySms;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const newPassword = form.new_password ? form.new_password.value.trim() : '';
    const currentPassword = form.current_password ? form.current_password.value : '';
    if(newPassword && currentPassword !== b.password){
      showMessage('settingsMessage','Current password is incorrect.', true); return;
    }
    const updated = Object.assign({}, b, {
      company: form.company_name.value.trim(),
      firstName: form.first_name.value.trim(),
      lastName: form.last_name.value.trim(),
      email: form.email.value.trim().toLowerCase(),
      location: form.location.value.trim(),
      website: form.website.value.trim(),
      notifyEmail: form.notify_email ? form.notify_email.checked : true,
      notifySms: form.notify_sms ? form.notify_sms.checked : false,
      password: newPassword ? newPassword : b.password
    });
    const accounts = getAccounts().filter(a => a.email !== b.email);
    accounts.push(updated);
    setAccounts(accounts);
    setBusiness(updated);
    populateBusinessFields(updated);
    if(form.current_password) form.current_password.value = '';
    if(form.new_password) form.new_password.value = '';
    showMessage('settingsMessage','Your settings have been saved.');
  });

  const deleteBtn = document.querySelector('#deleteAccount');
  if(deleteBtn) deleteBtn.addEventListener('click', () => {
    if(!confirm('Delete your business account? This cannot be undone in this prototype.')) return;
    const accounts = getAccounts().filter(a => a.email !== b.email);
    setAccounts(accounts);
    localStorage.removeItem('marketlyBusiness');
    localStorage.removeItem('marketlyBusinessLoggedIn');
    localStorage.removeItem('marketlyListing');
    location.href = 'index.html';
  });
}

function logout(){ localStorage.removeItem('marketlyBusinessLoggedIn'); location.href='business-login.html'; }
function showMessage(id, text, isError=false){ const el = document.getElementById(id); if(!el) return; el.className = isError ? 'error' : 'success'; el.textContent = text; el.classList.remove('hidden'); }

document.addEventListener('DOMContentLoaded', () => {
  seedDemoAccounts();
  initRegister();
  initLogin();
  initDashboardChrome();
  initHome();
  initListing();
  initSubscription();
  initSettings();
  initMessages();
});
