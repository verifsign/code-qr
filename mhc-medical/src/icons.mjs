/* Icônes SVG en ligne (trait, hérité de currentColor).
   aria-hidden car purement décoratives — le sens est porté par le texte. */

const wrap = (paths) =>
  `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;

export const icons = {
  phone: wrap('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7A2 2 0 0 1 22 16.9z"/>'),
  clock: wrap('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  pin: wrap('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'),
  mail: wrap('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  arrow: wrap('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
  patient: wrap('<circle cx="12" cy="7" r="3.2"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/><path d="M12 10.2v4M10 12.2h4"/>'),
  aidant: wrap('<circle cx="8" cy="8" r="2.6"/><circle cx="16.5" cy="9" r="2.2"/><path d="M3 20a5 5 0 0 1 10 0"/><path d="M13.5 20a4 4 0 0 1 7.5-1.9"/>'),
  pro: wrap('<path d="M9 4h6v3H9z"/><rect x="4" y="7" width="16" height="13" rx="2"/><path d="M12 11v5M9.5 13.5h5"/>'),
  shield: wrap('<path d="M12 3 5 6v5c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6z"/><path d="m9.2 12 1.9 1.9 3.7-3.8"/>'),
  card: wrap('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/>'),
  hand: wrap('<path d="M18 11V7a1.6 1.6 0 0 0-3.2 0M14.8 11V5.2a1.6 1.6 0 0 0-3.2 0V11M11.6 11V6.5a1.6 1.6 0 0 0-3.2 0V13"/><path d="M8.4 13l-1.7-1.7A1.6 1.6 0 0 0 4.4 13.6L8 18.5A5 5 0 0 0 12 21h1a5 5 0 0 0 5-5v-5"/>'),
  store: wrap('<path d="M4 9 5 4h14l1 5"/><path d="M4 9h16v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-4-2z"/><path d="M5 11v9h14v-9"/><path d="M10 20v-5h4v5"/>'),
  wheelchair: wrap('<circle cx="12" cy="4.5" r="1.6"/><path d="M11 7v5h4l2 4"/><path d="M11 12a5 5 0 1 0 4.4 7.4"/><path d="M16 20h3"/>'),
  bed: wrap('<path d="M3 8v11M3 12h18v7M21 19v-4a3 3 0 0 0-3-3"/><circle cx="7.5" cy="10.5" r="1.5"/>'),
  bath: wrap('<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M6 12V6a2 2 0 0 1 2-2 2 2 0 0 1 2 2"/><path d="M9 6h2"/><path d="M6 19l-1 2M18 19l1 2"/>'),
  cup: wrap('<path d="M6 8h11v4a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5z"/><path d="M17 9h2a2 2 0 0 1 0 4h-2"/><path d="M8 4v2M11 3v3M14 4v2"/>'),
  monitor: wrap('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M6 10h3l1.5-2.5L13 13l1.2-3H18"/><path d="M9 20h6M12 16v4"/>'),
  check: wrap('<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.3 2.3L15.5 9.5"/>'),
  doc: wrap('<path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 16h6"/>'),
  chat: wrap('<path d="M4 5h16v11H9l-4 3v-3H4z"/><path d="M8 9h8M8 12h5"/>'),
};
