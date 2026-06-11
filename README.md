# F* Smashing — Ιστοσελίδα / Website

Μονοσέλιδη (one-page) ιστοσελίδα για το **F\* Smashing**, burgerhouse στον Χολαργό, Αθήνα.
Στατικό site — **χωρίς build, χωρίς dependencies**. Απλώς άνοιξε το `index.html`.

A single-page website for **F\* Smashing**, a burgerhouse in Cholargos, Athens.
Pure static site — **no build step, no dependencies**. Just open `index.html`.

---

## 📁 Δομή / Structure

```
f-smashing/
├── index.html          # Όλο το περιεχόμενο (στα Ελληνικά)
├── styles.css          # Σχεδιασμός & responsive
├── script.js           # Animations & interactions
├── assets/
│   ├── logo-mark.svg     # Λογότυπο (κρεμ, διάφανο φόντο) — navbar/footer
│   ├── logo-emblem.svg   # Λογότυπο με μπορντό δίσκο — favicon/preloader
│   ├── logo-burgundy.svg # Λογότυπο σε μπορντό — για ανοιχτά φόντα
│   └── _gen_logo.py      # Script που παρήγαγε τα SVG (προαιρετικό)
└── README.md
```

## ▶️ Πώς να το δεις / How to run
Διπλό κλικ στο `index.html`. Για τοπικό server (συνιστάται για τον χάρτη):
```bash
python -m http.server 8000   # μετά: http://localhost:8000
```

---

## ✏️ Τι να αλλάξεις πριν τη δημοσίευση / Customize before launch

| # | Τι | Πού |
|---|----|-----|
| 1 | **Πραγματικό λογότυπο** | Αντικατέστησε τα `assets/logo-*.svg` με το αρχείο σου (κράτα τα ίδια ονόματα), ή άλλαξε τα `src` στο `index.html`. |
| 2 | **Φωτογραφίες** | Τώρα φορτώνουν δείγματα από Unsplash. Αντικατέστησε τα URL με δικές σου φωτό των burgers (ιδανικά τοπικά στον `assets/`). Δες `class="ph"` στο `index.html`. |
| 3 | **Διεύθυνση / τηλέφωνο / email** | Αναζήτησε `Μεσογείων`, `210 65 00 000`, `hello@fsmashing.gr` στο `index.html`. |
| 4 | **Ωράριο** | Ενότητα `#hours` στο `index.html` (η σημερινή μέρα φωτίζεται αυτόματα). |
| 5 | **Μενού & τιμές** | Ενότητα `<section ... id="menu">`. |
| 6 | **Σύνδεσμοι delivery** | Άλλαξε τα `href="#"` στις κάρτες efood / Wolt / BOX (ενότητα `#delivery`). |
| 7 | **Social media** | `href="#"` στο footer (Instagram / Facebook / TikTok). |
| 8 | **Χάρτης** | Το `<iframe>` δείχνει «Χολαργός». Βάλε την ακριβή διεύθυνση από Google Maps → Share → Embed. |

### 📨 Φόρμα κρατήσεων / Reservation form
Η φόρμα κάνει **client-side validation** και δείχνει μήνυμα επιτυχίας, αλλά **δεν στέλνει** email από μόνη της (στατικό site). Για να λαμβάνεις τα αιτήματα, σύνδεσέ την με μία υπηρεσία:

- **[Formspree](https://formspree.io)** ή **[Web3Forms](https://web3forms.com)** (ευκολότερο): πρόσθεσε `action="https://..."` και `method="POST"` στο `<form id="reserveForm">`.
- Ή σύνδεση με δικό σου backend / Google Sheets.

---

## ✅ Τι περιλαμβάνει / Features
- 🎬 Elegant scroll-reveal animations (IntersectionObserver), hero parallax, μετρητές, infinite marquee — όλα σε `transform/opacity` για ομαλότητα σε κάθε συσκευή.
- ♿ Προσβασιμότητα: σημασιολογικό HTML, focus states, aria-labels, πλοήγηση με πληκτρολόγιο, σεβασμός `prefers-reduced-motion`.
- 📱 Πλήρως responsive (375 / 768 / 1024 / 1440px) με mobile menu.
- 🖼️ Lightbox gallery, tabbed menu, φόρμα με validation.
- 🛟 Αν αποτύχει μια εικόνα, εμφανίζεται κομψό fallback αντί για «σπασμένη» φωτό.

## 🎨 Brand palette
Μπορντό `#5E1619` · Κρεμ `#EFE7D9` · Ember `#DB8A2E` · Κάρβουνο `#17110E`
Fonts: **Oswald** (τίτλοι) + **Inter** (κείμενο) + **Playfair Display** (accents) — με πλήρη υποστήριξη ελληνικών.
