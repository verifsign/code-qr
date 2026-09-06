(function () {
  'use strict';

  var COOKIE_KEY = 'mhc_cookie_consent';
  var STORAGE_KEY = 'mhc_chat_history';
  var cfg = window.MHC || {};

  var root = document.getElementById('mhc-chat');
  if (!root) return;

  var panel = document.getElementById('chat-panel');
  var toggle = document.getElementById('chat-toggle');
  var closeBtn = document.getElementById('chat-close');
  var messagesEl = document.getElementById('chat-messages');
  var form = document.getElementById('chat-form');
  var input = document.getElementById('chat-input');
  var consentEl = document.getElementById('chat-consent');
  var sendBtn = form ? form.querySelector('[type="submit"]') : null;

  var base = document.documentElement.getAttribute('data-base') || '';
  var apiUrl = base + 'api/chat.php';
  var history = [];
  var busy = false;

  function cookiesAccepted() {
    return localStorage.getItem(COOKIE_KEY) === 'accepted';
  }

  function loadHistory() {
    try {
      var saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      var parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        history = parsed;
      }
    } catch (e) {
      history = [];
    }
  }

  function saveHistory() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-8)));
    } catch (e) {
      /* ignore */
    }
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderMessages() {
    if (!messagesEl) return;
    if (!history.length) {
      messagesEl.innerHTML =
        '<div class="chat-msg chat-msg--bot">' +
          '<p>Bonjour ! Je peux répondre aux questions sur le magasin, les horaires, le tiers payant et le parcours patient.</p>' +
          '<p class="chat-msg__note">Je ne remplace pas un conseil médical. Urgence : <strong>15</strong>.</p>' +
        '</div>';
      return;
    }

    messagesEl.innerHTML = history.map(function (item) {
      var cls = item.role === 'user' ? 'chat-msg chat-msg--user' : 'chat-msg chat-msg--bot';
      return '<div class="' + cls + '"><p>' + escapeHtml(item.content) + '</p></div>';
    }).join('');
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function setBusy(state) {
    busy = state;
    if (sendBtn) sendBtn.disabled = state;
    if (input) input.disabled = state;
    root.classList.toggle('is-busy', state);
  }

  function addMessage(role, content) {
    history.push({ role: role, content: content });
    saveHistory();
    renderMessages();
  }

  function updateConsentState() {
    var allowed = cookiesAccepted();
    root.classList.toggle('is-locked', !allowed);
    if (consentEl) {
      consentEl.hidden = allowed;
    }
    if (form) {
      form.hidden = !allowed;
    }
    if (allowed) {
      root.hidden = false;
    }
  }

  function openPanel() {
    if (!panel || !toggle) return;
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    root.classList.add('is-open');
    if (cookiesAccepted() && input) {
      input.focus();
    }
  }

  function closePanel() {
    if (!panel || !toggle) return;
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    root.classList.remove('is-open');
    toggle.focus();
  }

  function sendMessage(text) {
    if (!text || busy || !cookiesAccepted()) return;

    addMessage('user', text);
    setBusy(true);

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        history: history.slice(0, -1),
      }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.data && result.data.ok && result.data.reply) {
          addMessage('assistant', result.data.reply);
          return;
        }
        var fallback = (result.data && result.data.message)
          || 'Désolé, je ne peux pas répondre pour le moment. Appelez le ' + (cfg.phone || '07 77 77 89 47') + '.';
        addMessage('assistant', fallback);
      })
      .catch(function () {
        addMessage('assistant', 'Connexion impossible. Appelez le ' + (cfg.phone || '07 77 77 89 47') + '.');
      })
      .finally(function () {
        setBusy(false);
        if (input) {
          input.value = '';
          input.focus();
        }
      });
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      if (root.classList.contains('is-open')) {
        closePanel();
      } else {
        openPanel();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closePanel);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!input) return;
      var text = input.value.trim();
      if (!text) return;
      sendMessage(text);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('is-open')) {
      closePanel();
    }
  });

  document.addEventListener('mhc:cookies-accepted', updateConsentState);
  document.addEventListener('mhc:cookies-refused', updateConsentState);

  loadHistory();
  renderMessages();
  updateConsentState();

  if (cookiesAccepted()) {
    root.hidden = false;
  }
})();
