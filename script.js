/* =========================================================
   NATANEL & ORA — JS (FR/HE) — VALIDATION + I18N + 1 SUBMISSION
   (version corrigée : labels SAFE → on ne détruit plus les <input> dans les <label>)
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  /* ---------- Navbar / burger ---------- */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  const onScrollNav = () => {
    if (window.scrollY > 20) { navbar?.classList.add('scrolled'); navbar?.classList.remove('transparent'); }
    else { navbar?.classList.add('transparent'); navbar?.classList.remove('scrolled'); }
  };
  onScrollNav(); window.addEventListener('scroll', onScrollNav);

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks?.classList.toggle('active');
  });
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger?.classList.remove('open'); navLinks?.classList.remove('active');
  }));

  /* ---------- Scroll progress ---------- */
  const progress = document.getElementById('scroll-progress');
  const onScrollProgress = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if (progress) progress.style.width = `${scrolled}%`;
  };
  window.addEventListener('scroll', onScrollProgress); onScrollProgress();

  /* ---------- Reveal (fallback) ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  reveals.forEach(el => io.observe(el));

  /* ---------- AOS ---------- */
  if (window.AOS) AOS.init({ once: true });

  /* ---------- CircleType ---------- */
  const arcEl = document.getElementById('arc-title');
  if (arcEl && window.CircleType) {
    const ct = new CircleType(arcEl);
    const setRadius = () => {
      const w = window.innerWidth;
      ct.radius(w >= 992 ? 600 : w >= 560 ? 360 : 280);
    };
    setRadius(); window.addEventListener('resize', setRadius);
  }

  /* ---------- Countdown ---------- */
  const countdown = document.getElementById('countdown');
  if (countdown) {
    const target  = new Date(countdown.dataset.date || '2026-01-07T18:45:00');
    const daysEl  = countdown.querySelector('.jours');
    const hoursEl = countdown.querySelector('.heures');
    const minsEl  = countdown.querySelector('.minutes');
    const secsEl  = countdown.querySelector('.secondes');

    const tick = () => {
      const now = new Date();
      let diff = Math.max(0, target - now);
      const d = Math.floor(diff / 86400000); diff -= d * 86400000;
      const h = Math.floor(diff / 3600000);   diff -= h * 3600000;
      const m = Math.floor(diff / 60000);     diff -= m * 60000;
      const s = Math.floor(diff / 1000);
      if (daysEl)  daysEl.textContent  = String(d);
      if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
      if (minsEl)  minsEl.textContent  = String(m).padStart(2, '0');
      if (secsEl)  secsEl.textContent  = String(s).padStart(2, '0');
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- Back-to-top + Music ---------- */
  const backBtn  = document.getElementById('scrollToTop');
  const music    = document.getElementById('backgroundMusic');
  const enterBtn = document.getElementById('enterSite');

  const toggleBack = () => { if(backBtn) backBtn.style.display = window.scrollY > 300 ? 'block' : 'none'; };
  toggleBack(); window.addEventListener('scroll', toggleBack);
  backBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  if (enterBtn && music) {
    music.loop = true; music.preload = 'auto';
    enterBtn.addEventListener('click', () => {
      music.volume = 0.35;
      const tryPlay = music.play();
      if (tryPlay && typeof tryPlay.catch === 'function') {
        tryPlay.catch(() => {
          const resume = () => {
            music.play().finally(() => {
              window.removeEventListener('scroll', resume);
              window.removeEventListener('touchstart', resume);
            });
          };
          window.addEventListener('scroll', resume, { once:true });
          window.addEventListener('touchstart', resume, { once:true });
        });
      }
    });
  }
  document.getElementById('musicToggle')?.remove();

  /* ---------- Event buttons ---------- */
  const calendarBtn = document.querySelector('.calendar-button');
  const wazeBtn     = document.getElementById('wazeBtn');
  const WAZE_URL = 'https://ul.waze.com/ul?ll=31.7515%2C34.9885&navigate=yes';
  if (wazeBtn) wazeBtn.href = WAZE_URL;

  calendarBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const title    = 'Houppa — Natanël & Ora';
    const details  = 'Kabalat Panim à 17h45 • Houppa à 18h45 précise';
    const location = 'אמרלד — הגן השקוף, בית שמש, ישראל';
    const tz    = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jerusalem';
    const start = new Date('2026-01-07T18:45:00');
    const end   = new Date('2026-01-07T22:45:00');

    const pad = (n) => String(n).padStart(2,'0');
    const fmtLocal = (d) => (d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+'T'+pad(d.getHours())+pad(d.getMinutes())+pad(d.getSeconds()));
    const dates = `${fmtLocal(start)}/${fmtLocal(end)}`;

    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.set('action','TEMPLATE');
    url.searchParams.set('text',title);
    url.searchParams.set('details',details);
    url.searchParams.set('location',location);
    url.searchParams.set('dates',dates);
    url.searchParams.set('ctz',tz);
    url.searchParams.set('sf','true');
    url.searchParams.set('output','xml');
    window.open(url.toString(), '_blank', 'noopener');
  });

  /* ---------- RSVP ---------- */
  const form            = document.getElementById('rsvpForm');
  const presenceSelect  = document.getElementById('presenceSelect');
  const comeTo          = document.getElementById('come_to');
  const preferenceSelect= document.getElementById('preferenceSelect');
  const nombreWrapper   = document.getElementById('nombre-wrapper');
  const nbInput         = document.querySelector('input[name="nb_personne"]');

  const assahaRadios    = document.querySelectorAll('input[name="assaha"]');
  const villeWrapper    = document.getElementById('villeAssahaWrapper');
  const citySelect      = villeWrapper?.querySelector('select');

  const okMsg           = document.getElementById('confirmation-message');
  const okMsgStrong     = okMsg?.querySelector('strong');
  const errMsg          = document.getElementById('error-message');

  const childrenSection  = document.getElementById('childrenSection');
  const kidsRadios       = document.querySelectorAll('input[name="has_kids"]');
  const kidsCountWrapper = document.getElementById('kidsCountWrapper');
  const kidsCountSelect  = document.getElementById('kidsCountSelect');
  const kidsList         = document.getElementById('kidsList');

  const SUBMIT_LOCK_KEY = 'rsvp_submitted';

  /* ---------- Lang packs ---------- */
  const FR = {
    hero:  { bride: 'Natanel', and: '&', groom: 'Ora' },
    names: { bride: 'Natanel', and: '&', groom: 'Ora' },
    enterBtn: 'Voir l’invitation',
    countdown: { days: 'Jours', hours: 'Heures', minutes: 'Minutes', seconds: 'Secondes' },
    houppaTitle: 'Houppa &amp; Soirée',
    invitationTop: 'Remercient <strong>Hachem</strong> d’avoir la joie de vous convier <br>au mariage de leurs enfants et petits-enfants,',
    invitationBottom: 'à la <strong>Houppa</strong> qui aura lieu le <span class="accent"><strong>7 janvier 2026 — 18 Tevet 5786.</strong></span>',
    reception: 'Ainsi qu’à la réception qui suivra.',
    placeLine: "אמרלד —הגן השקוף בית שמש, ישראל",
    timings:   '<span class="accent">Kabalat Panim à 17h45</span>, <span class="accent">Houppa à 18h45 précise</span>',
    dedic:     'Une pensée particulière pour nos chers grand parents : <br> Mme&nbsp;Ruth&nbsp;Harrouch, M.&nbsp;Serge&nbsp;Yossef&nbsp;Temim, et M.&nbsp;Samuel&nbsp;Haim&nbsp;Besnainou.',
    parentsLeft:  ['Mr &amp; Mme Dov et Sarah Harrouch','Mr Michel Harrouch','Mme Aline Temim'],
    parentsRight: ['Mr &amp; Mme Yossef et Nathalie Besnainou','Mr &amp; Mme Adolphe Mahlouf &amp; Mireille Tapiero','Mme Jasmine Besnainou'],
    nav: { accueil: 'Accueil', houppa: 'Houppa & Soirée', rsvp: 'RSVP' },
    rsvp: {
      title:'Confirmez votre présence',
      first:'Prénom *', last:'Nom *', email:'Votre email', tel:'Votre téléphone *',
      presenceLabel:'Je confirme ma présence', presenceYes:'Oui, je serai présent(e) 🎉', presenceNo:'Non, je ne peux pas venir 😢',
      comeTo:'Je viens pour :', houppaOnly:'Uniquement à la houppa', both:'Houppa & soirée',
      nb:'Nombre total de personnes (vous inclus) *',
      hint1:'Merci d’indiquer un seul nom et prénom ici.',
      shuttle:'Souhaitez-vous une navette ?', yes:'Oui', no:'Non',
      cityPlaceholder:'Depuis quelle ville ?', cityAshdod:'Ashdod', cityJerusalem:'Jérusalem',
      message:'Un Mazal Tov pour les mariés ?', submit:'Envoyer',
      kidsQuestion:'Des enfants vous accompagnent ?', kidsHowMany:'Combien d’enfants ?',
      kidsNote:"N’écrivez pas votre nom ici — seulement ceux qui vous accompagnent.",
      kidFirst: idx => `Prénom enfant ${idx}`,
      kidAge:   idx => `Âge enfant ${idx} (1–13)`,
      success:'Message envoyé avec succès 💌',
      errors:{
        all:'Merci de remplir les champs obligatoires.',
        first:'Prénom obligatoire.',
        last:'Nom obligatoire.',
        tel:'Téléphone obligatoire.',
        presence:'Veuillez indiquer votre présence.',
        comeTo:'Veuillez choisir “Houppa” ou “Houppa & soirée”.',
        nb:'Indiquez le nombre total de personnes (≥ 1).',
        shuttle:'Choisissez Oui/Non pour la navette.',
        city:'Précisez la ville de navette.',
        kidsCount:'Indiquez le nombre d’enfants.',
        kidAge:'Âge des enfants : 1 à 13 ans.',
      }
    }
  };

  const HE = {
    hero:  { bride: ' נתנאל', and: '-', groom: 'אורה מרים' },
    names: { bride: 'נתנאל', and: '&', groom: '& אורה מרים' },
    enterBtn: 'לצפייה בהזמנה',
    countdown: { days: 'ימים', hours: 'שעות', minutes: 'דקות', seconds: 'שניות' },
    houppaTitle: 'חופה',
    invitationTop: 'מודים לה׳ על הזכות לשמוח ולהזמינכם<br>לחתונת ילדיהם ונכדיהם,',
    invitationBottom: 'בחופה שתתקיים בע״ה ביום <span class="accent"><strong>7 בינואר 2026</strong></span> — <span class="accent"><strong>י״ח בטבת תשפ״ו</strong></span>.',
    reception: '',
    placeLine:  'אמרלד — הגן השקוף · בית שמש, ישראל',
    timings:    '<span class="accent">קבלת פנים 17:45</span> · <span class="accent">חופה 18:45 בדיוק</span>',
    dedic:      'אזכרה מיוחדת לסבינו היקרים: <br> גב׳ רות הרוש, מר סרג׳ יוסף תמם ומר שמואל חיים בזננו.',
    parentsLeft:  ['מר וד״ר דוב ושרה הרוש','מר מיכאל הרוש','גב׳ אלין תמים'],
    parentsRight: ['מר וגברת יוסף ונטלי בזננו','מר וגברת אדולף מַלְחוּף &amp; מרת מירייל טפיירו','גב׳ יסמין בזננו'],
    nav: { accueil: 'דף הבית', houppa: 'חופה', rsvp: 'אישור הגעה' },
    rsvp: {
      title:'אשרו הגעה',
      first:'שם פרטי *', last:'שם משפחה *', email:'האימייל שלכם', tel:'טלפון *',
      presenceLabel:'אישור הגעה', presenceYes:'כן, אגיע 🎉', presenceNo:'לא אוכל להגיע 😢',
      comeTo:'אני מגיע/ה ל־', houppaOnly:'לחופה בלבד', both:'חופה וערב',
      nb:'מספר נוכחים (כולל אותך) *',
      hint1:'נא להזין שם פרטי ושם משפחה אחד בלבד.',
      shuttle:'מעוניינים בהסעה?', yes:'כן', no:'לא',
      cityPlaceholder:'מאיזו עיר?', cityAshdod:'אשדוד', cityJerusalem:'ירושלים',
      message:'ברכת מזל טוב לזוג?', submit:'שליחה',
      kidsQuestion:'ילדים מגיעים איתכם?', kidsHowMany:'כמה ילדים?',
      kidsNote:'אל תכתבו כאן את השם שלכם — רק של המגיעים איתכם.',
      kidFirst: idx => `שם פרטי ילד ${idx}`,
      kidAge:   idx => `גיל ילד ${idx} (1–13)`,
      success:'ההודעה נשלחה בהצלחה 💌',
      errors:{
        all:'נא למלא את כל השדות החובה.',
        first:'שם פרטי חובה.',
        last:'שם משפחה חובה.',
        tel:'טלפון חובה.',
        presence:'נא לציין אם אתם מגיעים.',
        comeTo:'נא לבחור: לחופה בלבד / חופה וערב.',
        nb:'נא לציין מספר משתתפים (≥ 1).',
        shuttle:'נא לבחור אם צריך הסעה.',
        city:'נא לבחור עיר להסעה.',
        kidsCount:'נא לציין כמה ילדים.',
        kidAge:'גיל הילדים חייב להיות בין 1 ל־13.',
      }
    }
  };

  /* ---------- DOM map for i18n ---------- */
  const root = document.documentElement;
  const body = document.body;
  const card = document.getElementById('houppa-soiree');
  const rsvp = document.getElementById('formulaire');

  const el = {
    heroBride:  document.querySelector('#accueil .names .bride'),
    heroAnd:    document.querySelector('#accueil .names .et'),
    heroGroom:  document.querySelector('#accueil .names .groom'),
    enterBtn:   document.getElementById('enterSite'),
    cdDays:  document.querySelector('#countdown .jours + .label'),
    cdHours: document.querySelector('#countdown .heures + .label'),
    cdMins:  document.querySelector('#countdown .minutes + .label'),
    cdSecs:  document.querySelector('#countdown .secondes + .label'),
    houppaTitle:      document.getElementById('houppa_title'),
    invitationTop:    document.querySelector('.invitation-top'),
    invitationBottom: document.querySelector('.invitation-bottom'),
    reception:        document.getElementById('receptionLine'),
    placeLine:        document.querySelector('.place'),
    timings:          document.querySelector('.timings'),
    dedic:            document.querySelector('.dedic'),
    namesInline: document.getElementById('namesInline'),
    namesBride:  document.getElementById('namesInlineBride'),
    namesAnd:    document.getElementById('namesInlineAnd'),
    namesGroom:  document.getElementById('namesInlineGroom'),
    leftLines:  Array.from(document.querySelectorAll('.parents-grid .col:nth-child(1) .line')),
    rightLines: Array.from(document.querySelectorAll('.parents-grid .col:nth-child(2) .line')),
    navAccueil: document.getElementById('link_accueil'),
    navHouppa:  document.getElementById('link_houppa'),
    navRSVP:    document.getElementById('link_rsvp'),
    rsvpTitle:   document.querySelector('#formulaire h2'),
    firstName:   document.querySelector('input[name="first_name"]'),
    lastName:    document.querySelector('input[name="last_name"]'),
    email:       document.querySelector('input[name="email"]'),
    tel:         document.querySelector('input[name="tel"]'),
    presenceSel: presenceSelect,
    preferenceSel: preferenceSelect,
    nbInput:     nbInput,
    assahaLabel: document.querySelector('#assaha label'),
    assahaYes:   document.querySelector('input[name="assaha"][value="1"]')?.parentElement,
    assahaNo:    document.querySelector('input[name="assaha"][value="0"]')?.parentElement,
    kidsYes: document.querySelector('input[name="has_kids"][value="1"]')?.parentElement,
    kidsNo:  document.querySelector('input[name="has_kids"][value="0"]')?.parentElement,
    citySelect:  citySelect,
    hint1:       document.querySelector('.form-hint'),
    hint2:       document.getElementById('preventive_message_2'),
    submitBtn:   document.querySelector('.submit-button'),
    successMsg:  okMsgStrong,
    calBtn:      document.querySelector('.calendar-button'),
    wazeBtn:     document.getElementById('wazeBtn'),
    childrenSection,
    childrenLabel:   document.getElementById('childrenLabel'),
    kidsCountWrap:   kidsCountWrapper,
    kidsCountSelect: kidsCountSelect,
    kidsList:        kidsList,
  };

  /* ---------- Helpers ---------- */

  // 🔒 Remplace uniquement le DERNIER nœud texte d’un label, sans toucher aux <input>/<span> existants
  function setLabelTextSafe(labelEl, text, withLeadingSpace = true) {
    if (!labelEl) return;
    const desired = withLeadingSpace ? (' ' + text) : text;

    // Cherche un nœud texte existant en fin
    let textNode = null;
    const nodes = Array.from(labelEl.childNodes);
    for (let i = nodes.length - 1; i >= 0; i--) {
      if (nodes[i].nodeType === Node.TEXT_NODE) { textNode = nodes[i]; break; }
    }
    if (textNode) {
      textNode.nodeValue = desired;
    } else {
      labelEl.appendChild(document.createTextNode(desired));
    }
  }

  // Traduction Oui/Non sans écraser l’intérieur des labels
  function translateYesNoIn(container, yesTxt, noTxt){
    if (!container) return;
    container.querySelectorAll('label').forEach(lab => {
      // On lit le texte "visible" (sans casser la structure) et on décide
      const raw = (lab.textContent || '').trim().toLowerCase();
      if (raw === 'oui' || raw === 'yes') setLabelTextSafe(lab, yesTxt, true);
      if (raw === 'non' || raw === 'no')  setLabelTextSafe(lab, noTxt,  true);
      // Si ce sont déjà des radios stylés (input puis texte), on met à jour quand même le dernier nœud texte
      if (lab.querySelector('input[type="radio"]')) {
        const val = lab.querySelector('input[type="radio"]').value;
        if (val === '1') setLabelTextSafe(lab, yesTxt, true);
        if (val === '0') setLabelTextSafe(lab,  noTxt, true);
      }
    });
  }

  /* ---------- Helpers i18n ---------- */
  function setParents(lines, arr){ lines.forEach((n,i)=>{ if(arr[i]) n.innerHTML = arr[i]; }); }
  function setHero(p){
    if(el.heroBride) el.heroBride.textContent = p.hero.bride;
    if(el.heroAnd)   el.heroAnd.textContent   = p.hero.and;
    if(el.heroGroom) el.heroGroom.textContent = p.hero.groom;
  }
  function setCountdownLabels(p){
    if(el.cdDays)  el.cdDays.textContent  = p.countdown.days;
    if(el.cdHours) el.cdHours.textContent = p.countdown.hours;
    if(el.cdMins)  el.cdMins.textContent  = p.countdown.minutes;
    if(el.cdSecs)  el.cdSecs.textContent  = p.countdown.seconds;
  }
  function setNames(p){
    if (el.namesBride) {
      if (el.namesBride.firstChild) el.namesBride.firstChild.nodeValue = p.names.bride;
      else el.namesBride.textContent = p.names.bride;
    }
    if (el.namesAnd)   el.namesAnd.textContent   = p.names.and || '&';
    if (el.namesGroom) {
      if (el.namesGroom.firstChild) el.namesGroom.firstChild.nodeValue = p.names.groom;
      else el.namesGroom.textContent = p.names.groom;
    }
    if (el.namesInline) el.namesInline.dir = (p === HE) ? 'rtl' : 'ltr';
  }
  function setSubmitLabel(txt){
    if (!el.submitBtn) return;
    if (el.submitBtn.tagName.toLowerCase()==='input') el.submitBtn.value = txt;
    else el.submitBtn.textContent = txt;
  }

  function setRSVP(pack){
    const t=pack.rsvp;
    if(el.rsvpTitle) el.rsvpTitle.textContent=t.title;
    if(el.firstName) el.firstName.placeholder=t.first;
    if(el.lastName)  el.lastName.placeholder=t.last;
    if(el.email)     el.email.placeholder=t.email;
    if(el.tel)       el.tel.placeholder=t.tel;

    if(el.presenceSel){
      el.presenceSel.options.length=0;
      el.presenceSel.add(new Option(t.presenceLabel,'',true,true));
      el.presenceSel.options[0].disabled=true;
      el.presenceSel.add(new Option(t.presenceYes,'1'));
      el.presenceSel.add(new Option(t.presenceNo ,'0'));
    }
    if(el.preferenceSel){
      el.preferenceSel.options.length=0;
      el.preferenceSel.add(new Option(t.comeTo,'',true,true));
      el.preferenceSel.options[0].disabled=true;
      el.preferenceSel.add(new Option(t.houppaOnly,'0'));
      el.preferenceSel.add(new Option(t.both,'1'));
    }
    if(el.nbInput) el.nbInput.placeholder=t.nb;

    if(el.assahaLabel) el.assahaLabel.textContent=t.shuttle;

    // ✅ radios : on met à jour le TEXTE du label sans détruire l’input
    if (el.assahaYes) {
      const lab = el.assahaYes.querySelector('label');
      if (lab) setLabelTextSafe(lab, t.yes, true);
    }
    if (el.assahaNo) {
      const lab = el.assahaNo.querySelector('label');
      if (lab) setLabelTextSafe(lab, t.no, true);
    }

    if (el.citySelect){
      el.citySelect.options.length = 0;
      el.citySelect.add(new Option(t.cityPlaceholder, '', true, true));
      el.citySelect.options[0].disabled = true;
      el.citySelect.add(new Option(t.cityAshdod, 'ashdod'));
      el.citySelect.add(new Option(t.cityJerusalem, 'jerusalem'));
    }

    // Enfants: Oui/Non via setter SAFE
    if (el.kidsYes) {
      const lab = el.kidsYes.querySelector('label');
      if (lab) setLabelTextSafe(lab, t.yes, true);
    }
    if (el.kidsNo) {
      const lab = el.kidsNo.querySelector('label');
      if (lab) setLabelTextSafe(lab, t.no, true);
    }

    if(el.hint1) el.hint1.textContent=t.hint1;
    if(el.hint2) el.hint2.textContent=t.hint2 || '';
    if(el.successMsg) el.successMsg.textContent=t.success;
    setSubmitLabel(t.submit);

    const messageTa = document.querySelector('textarea[name="message"]');
    if (messageTa) messageTa.placeholder = t.message;

    const kidsLbl = document.getElementById('childrenLabel');
    if (kidsLbl) kidsLbl.textContent = t.kidsQuestion;
    const sel = el.kidsCountSelect;
    if (sel){
      const cur = sel.value;
      sel.options.length = 0;
      sel.add(new Option(t.kidsHowMany, '', true, true));
      sel.options[0].disabled = true;
      for (let i=1;i<=6;i++) sel.add(new Option(String(i), String(i)));
      if ([...sel.options].some(o=>o.value===cur)) sel.value = cur;
    }

    let kidsNote = document.getElementById('kidsNote');
    if (!kidsNote) {
      kidsNote = document.createElement('p');
      kidsNote.id = 'kidsNote';
      kidsNote.style.fontSize = '0.9em';
      kidsNote.style.opacity = '0.8';
      kidsNote.style.margin = '6px 0 0';
      (kidsCountWrapper || childrenSection || form).appendChild(kidsNote);
    }
    kidsNote.textContent = t.kidsNote;

    document.querySelectorAll('.kid-row').forEach((row, idx)=>{
      const i = idx+1;
      const f = row.querySelector('input[name^="kid_first_"]');
      const a = row.querySelector('input[name^="kid_age_"]');
      if (f) f.placeholder = t.kidFirst(i);
      if (a) a.placeholder = t.kidAge(i);
    });
  }

  /* ---------- UI toggles ---------- */
  const togglePresence = () => {
    const coming = presenceSelect?.value === '1';
    comeTo?.classList.toggle('hidden', !coming);
    nombreWrapper?.classList.toggle('hidden', !coming);
    childrenSection?.classList.toggle('hidden', !coming);
    if (!coming && childrenSection) {
      const no = document.querySelector('input[name="has_kids"][value="0"]');
      if (no) no.checked = true;
      kidsCountWrapper?.classList.add('hidden');
      kidsList?.classList.add('hidden');
      if (kidsList) kidsList.innerHTML = '';
      if (kidsCountSelect) kidsCountSelect.selectedIndex = 0;
    }
  };
  presenceSelect?.addEventListener('change', togglePresence);
  togglePresence();

  assahaRadios.forEach(r => r.addEventListener('change', () => {
    villeWrapper?.classList.toggle('hidden', r.value !== '1' || !r.checked);
  }));

  kidsRadios.forEach(r => r.addEventListener('change', () => {
    const yes = r.value === '1' && r.checked;
    kidsCountWrapper?.classList.toggle('hidden', !yes);
    kidsList?.classList.toggle('hidden', !yes);
    if (!yes && kidsList) {
      kidsList.innerHTML = '';
      if (kidsCountSelect) kidsCountSelect.selectedIndex = 0;
    }
  }));

  function tKid(which, i){
    const lang = document.documentElement.getAttribute('data-lang') === 'he' ? 'he' : 'fr';
    const pack = (lang === 'he') ? HE : FR;
    if (which === 'first') return pack.rsvp.kidFirst(i);
    if (which === 'age')   return pack.rsvp.kidAge(i);
    return '';
  }

  kidsCountSelect?.addEventListener('change', () => {
    const n = parseInt(kidsCountSelect.value || '0', 10);
    if (!kidsList) return;
    kidsList.innerHTML = '';
    for (let i = 1; i <= n; i++) {
      const row = document.createElement('div');
      row.className = 'kid-row';
      row.innerHTML = `
        <input type="text"   name="kid_first_${i}" placeholder="${tKid('first', i)}">
        <input type="number" name="kid_age_${i}"   min="1" max="13" step="1" placeholder="${tKid('age', i)}">
      `;
      row.querySelector('input[type="number"]').addEventListener('input', (ev)=>{
        const v = +ev.target.value;
        if (v<1) ev.target.value = 1;
        if (v>13) ev.target.value = 13;
      });
      kidsList.appendChild(row);
    }
    kidsList.classList.remove('hidden');
  });

  /* ---------- Envoi → Google Sheets + fallback mail ---------- */
  const SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxhLtwjLosdU8xKbeSSfK0q0cm0smEY1nsl1N16MqJvTruSJ5ZFuEsomYOBS4JrehLG/exec';

  function pack(){ return (document.documentElement.getAttribute('data-lang') === 'he') ? HE : FR; }
  function showError(msg){
    if (!errMsg) return alert(msg);
    errMsg.textContent = msg;
    errMsg.style.display = 'block';
  }
  function clearError(){ if(errMsg){ errMsg.style.display='none'; errMsg.textContent=''; } }

  function validate(){
    const t = pack().rsvp.errors;

    const first = (document.querySelector('input[name="first_name"]')?.value||'').trim();
    const last  = (document.querySelector('input[name="last_name"]')?.value||'').trim();
    const tel   = (document.querySelector('input[name="tel"]')?.value||'').trim();
    if (!first) return {ok:false,msg:t.first};
    if (!last)  return {ok:false,msg:t.last};
    if (!tel)   return {ok:false,msg:t.tel};

    const presVal = presenceSelect?.value||'';
    if (presVal!=='1' && presVal!=='0') return {ok:false,msg:t.presence};

    if (presVal==='1'){
      const pref = preferenceSelect?.value||'';
      if (pref!=='0' && pref!=='1') return {ok:false,msg:t.comeTo};

      const nb = +(nbInput?.value||0);
      if (!nb || nb<1) return {ok:false,msg:t.nb};

      const assaha = document.querySelector('input[name="assaha"]:checked')?.value;
      if (assaha!=='1' && assaha!=='0') return {ok:false,msg:t.shuttle};
      if (assaha==='1'){
        const v = citySelect?.value||'';
        if (!v) return {ok:false,msg:t.city};
      }

      const hasKids = document.querySelector('input[name="has_kids"]:checked')?.value;
      if (hasKids==='1'){
        const cnt = +(kidsCountSelect?.value||0);
        if (!cnt || cnt<1) return {ok:false,msg:t.kidsCount};
        const ages = [...document.querySelectorAll('#kidsList input[name^="kid_age_"]')].map(i=>+i.value||0);
        if (!ages.every(a=>a>=1 && a<=13)) return {ok:false,msg:t.kidAge};
      }
    }
    return {ok:true};
  }

  function lockForm(){
    sessionStorage.setItem(SUBMIT_LOCK_KEY,'1');
    if (el.submitBtn) { el.submitBtn.disabled = true; el.submitBtn.style.opacity = '0.6'; }
    [...form.elements].forEach(x=>x.disabled = true);
  }
  (function initLock(){
    if (sessionStorage.getItem(SUBMIT_LOCK_KEY) === '1' && form){
      lockForm();
      if (okMsg) okMsg.style.display = 'block';
    }
  })();

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const v = validate();
    if (!v.ok) { showError(v.msg || pack().rsvp.errors.all); return; }

    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    payload.lang = document.documentElement.getAttribute('data-lang') || 'fr';
    payload.user_agent = navigator.userAgent || '';

    const kids = [];
    document.querySelectorAll('#kidsList .kid-row').forEach(row => {
      const first = row.querySelector('input[name^="kid_first_"]')?.value?.trim();
      const age   = row.querySelector('input[name^="kid_age_"]')?.value?.trim();
      if (first || age) kids.push({ first, age });
    });
    payload.kids = kids;
    payload.kids_count = payload.kids_count || kids.length;
   
    console.log('Payload envoyé à Google Script:', payload); // 👈 ajoute cette ligne ici
    try {
     const res = await fetch(SHEET_WEBAPP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
     });
      const text = await res.text();
      let j = {}; try { j = JSON.parse(text); } catch {}
      if (res.ok && j.ok !== false) {
        if (okMsg) okMsg.style.display = 'block';
        lockForm();
        return;
      }
      throw new Error(`HTTP ${res.status} ${text}`);
    } catch (err) {
      console.error('Erreur fetch vers Google Script:', err);
      const lang = (payload.lang === 'he') ? 'he' : 'fr';
      const cityMap = (lang === 'he')
        ? { ashdod:'אשדוד', jerusalem:'ירושלים' }
        : { ashdod:'Ashdod', jerusalem:'Jérusalem' };

      const label = (k) => ({
        first_name: lang==='he'?'שם פרטי':'Prénom',
        last_name:  lang==='he'?'שם משפחה':'Nom',
        email:      'Email',
        tel:        lang==='he'?'טלפון':'Téléphone',
        presence:   lang==='he'?'נוכחות':'Présence',
        come_to:    lang==='he'?'אני מגיע/ה ל־':'Je viens pour',
        nb_personne:lang==='he'?'סה״כ משתתפים':'Nb total de personnes',
        assaha:     lang==='he'?'הסעה':'Navette',
        ville_assaha: lang==='he'?'עיר להסעה':'Ville navette',
        message:    lang==='he'?'הודעה':'Message',
      }[k] || k);

      const display = (k,v) => {
        if (k==='presence')  return v==='1' ? (lang==='he'?'כן':'Oui') : (lang==='he'?'לא':'Non');
        if (k==='come_to')   return v==='1' ? (lang==='he'?'חופה וערב':'Houppa & soirée') : (lang==='he'?'לחופה בלבד':'Uniquement houppa');
        if (k==='assaha')    return v==='1' ? (lang==='he'?'כן':'Oui') : (lang==='he'?'לא':'Non');
        if (k==='ville_assaha') return cityMap[v] || v;
        return v;
      };

      const lines = [];
      for (const [k,v] of Object.entries(payload)) {
        if (k==='kids' || k==='kids_count' || k==='lang' || k==='user_agent') continue;
        if (v != null && String(v).trim() !== '') lines.push(`${label(k)}: ${display(k,v)}`);
      }
      if (kids.length) {
        lines.push((lang==='he'?'ילדים':'Enfants') + ': ' +
          kids.map(k => `${k.first||''} (${k.age||''} ${lang==='he'?'שנים':'ans'})`).join(' | ')
        );
      }

      const EMAIL_TO = 'amzallaghillel@gmail.com';
      const subject  = encodeURIComponent('RSVP — Natanël & Ora');
      const bodyTxt  = encodeURIComponent(lines.join('\n'));
      window.location.href = `mailto:${EMAIL_TO}?subject=${subject}&body=${bodyTxt}`;
      if (okMsg) okMsg.style.display = 'block';
      lockForm();
    }
  });

  /* ---------- Switch langue ---------- */
  function setLang(lang){
    const P=(lang==='he')?HE:FR;

    // ✅ remplace le texte Oui/Non sans casser la structure
    translateYesNoIn(document.getElementById('assaha'),          P.rsvp.yes, P.rsvp.no);
    translateYesNoIn(document.getElementById('childrenSection'), P.rsvp.yes, P.rsvp.no);

    root.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang==='he'?'he':'fr');
    document.documentElement.setAttribute('dir',  lang==='he'?'rtl':'ltr');
    body.classList.toggle('he-mode', lang==='he');
    card?.classList.toggle('he-mode', lang==='he');
    rsvp?.classList.toggle('he-mode', lang==='he');

    if(el.enterBtn){ el.enterBtn.textContent=P.enterBtn; el.enterBtn.dir=(lang==='he')?'rtl':'ltr'; }

    setHero(P); setCountdownLabels(P); setNames(P);

    if(el.houppaTitle)   el.houppaTitle.innerHTML   = P.houppaTitle;
    if(el.invitationTop) el.invitationTop.innerHTML = P.invitationTop;
    if(el.invitationBottom) el.invitationBottom.innerHTML = P.invitationBottom;

    if (el.reception){
      if (P.reception && P.reception.trim()){ el.reception.textContent = P.reception; el.reception.style.display = ''; }
      else { el.reception.textContent = ''; el.reception.style.display = 'none'; }
    }

    if(el.placeLine) el.placeLine.innerHTML = P.placeLine;
    if(el.timings)   el.timings.innerHTML   = P.timings;
    if(el.dedic)     el.dedic.innerHTML     = P.dedic;

    setParents(el.leftLines,  P.parentsLeft);
    setParents(el.rightLines, P.parentsRight);

    if(el.navAccueil) el.navAccueil.textContent=P.nav.accueil;
    if(el.navHouppa)  el.navHouppa.textContent =P.nav.houppa;
    if(el.navRSVP)    el.navRSVP.textContent   =P.nav.rsvp;

    if(el.calBtn)  el.calBtn.textContent  = (lang==='he') ? '📅 הוסף ליומן' : '📅 Ajouter au calendrier';
    if(el.wazeBtn) el.wazeBtn.textContent = (lang==='he') ? 'פתח ב־Waze'   : 'Ouvrir dans Waze';

    setRSVP(P);

    const arc=document.getElementById('arc-title');
    if(arc && window.CircleType){ try{ new CircleType(arc).radius(600); }catch{} }
  }

  document.querySelectorAll('[data-lang-btn]').forEach(btn=>{
    btn.addEventListener('click', ()=> setLang(btn.dataset.langBtn));
  });
  setLang(document.documentElement.getAttribute('data-lang') || 'fr');
});

/* ---------- 100vh iOS ---------- */
function setVh(){ document.documentElement.style.setProperty('--vh', (window.innerHeight*0.01) + 'px'); }
setVh(); window.addEventListener('resize', setVh); window.addEventListener('orientationchange', setVh);

/* ---------- (Option) debug overflow ---------- */
function debugOverflow(){
  const w = document.documentElement.clientWidth;
  document.querySelectorAll('*').forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.right - w > 1){ el.style.outline = '2px solid red'; }
  });
}
// debugOverflow();
