(function () {
  var els = {
    apiKey: document.getElementById("apiKey"),
    alerts: document.getElementById("alerts"),
    form: document.getElementById("docForm"),
    id: document.getElementById("id"),
    statut: document.getElementById("statut"),
    org: document.getElementById("org"),
    beneficiaire: document.getElementById("beneficiaire"),
    doc: document.getElementById("doc"),
    sha: document.getElementById("sha"),
    signers: document.getElementById("signers"),
    addSigner: document.getElementById("addSigner"),
    submitBtn: document.getElementById("submitBtn"),
    resetBtn: document.getElementById("resetBtn"),
    qrResult: document.getElementById("qrResult"),
    list: document.getElementById("list"),
    refreshList: document.getElementById("refreshList"),
  };

  var editingId = null; // null = création, sinon PUT sur cet id

  els.apiKey.value = sessionStorage.getItem("qrAdminApiKey") || "";
  els.apiKey.addEventListener("input", function () {
    sessionStorage.setItem("qrAdminApiKey", els.apiKey.value);
  });

  function esc(x) {
    return String(x == null ? "" : x)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function alert(kind, message) {
    els.alerts.innerHTML = '<div class="alert ' + kind + '">' + esc(message) + "</div>";
  }

  function clearAlert() {
    els.alerts.innerHTML = "";
  }

  function addSignerRow(values) {
    values = values || {};
    var row = document.createElement("div");
    row.className = "signer-row";
    row.innerHTML =
      '<input placeholder="Nom" class="s-n" value="' + esc(values.n || "") + '">' +
      '<input placeholder="Rôle (ex: Stagiaire)" class="s-r" value="' + esc(values.r || "") + '">' +
      '<input placeholder="Date/heure signée (ex: 11/05/2026 à 16:30)" class="s-d" value="' + esc(values.d || "") + '">' +
      '<button type="button" class="btn-ghost remove">✕</button>';
    row.querySelector(".remove").addEventListener("click", function () {
      row.remove();
    });
    els.signers.appendChild(row);
  }

  els.addSigner.addEventListener("click", function () {
    addSignerRow();
  });

  function collectSigners() {
    return Array.prototype.slice.call(els.signers.querySelectorAll(".signer-row")).map(function (row) {
      return {
        n: row.querySelector(".s-n").value.trim(),
        r: row.querySelector(".s-r").value.trim(),
        d: row.querySelector(".s-d").value.trim(),
      };
    }).filter(function (s) { return s.n; });
  }

  function resetForm() {
    editingId = null;
    els.form.reset();
    els.id.disabled = false;
    els.signers.innerHTML = "";
    addSignerRow();
    els.submitBtn.textContent = "Créer le document";
    els.qrResult.innerHTML = "";
    clearAlert();
  }

  els.resetBtn.addEventListener("click", resetForm);

  function apiFetch(url, options) {
    options = options || {};
    options.headers = Object.assign({}, options.headers, {
      "x-api-key": els.apiKey.value,
    });
    return fetch(url, options).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (body) {
        if (!res.ok) {
          var msg = (body && (body.error || (body.errors && body.errors.join(", ")))) || ("Erreur HTTP " + res.status);
          throw new Error(msg);
        }
        return body;
      });
    });
  }

  els.form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearAlert();

    if (!els.apiKey.value) {
      alert("error", "Renseigne d'abord ta clé API.");
      return;
    }

    var payload = {
      org: els.org.value.trim() || undefined,
      doc: els.doc.value.trim() || undefined,
      beneficiaire: els.beneficiaire.value.trim() || undefined,
      statut: els.statut.value,
      sha: els.sha.value.trim() || undefined,
      signers: collectSigners(),
    };

    var request;
    if (editingId) {
      request = apiFetch("/api/documents/" + encodeURIComponent(editingId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      if (els.id.value.trim()) payload.id = els.id.value.trim();
      request = apiFetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    request
      .then(function (body) {
        alert("success", editingId ? "Document mis à jour." : "Document créé.");
        showQr(body.document.id, body.verificationUrl);
        editingId = body.document.id;
        els.id.value = body.document.id;
        els.id.disabled = true;
        els.submitBtn.textContent = "Mettre à jour le document";
        loadList();
      })
      .catch(function (err) {
        alert("error", err.message);
      });
  });

  function showQr(id, verificationUrl) {
    els.qrResult.innerHTML =
      "<h2>QR code de vérification</h2>" +
      '<div class="qr-preview">' +
      '<img src="/api/documents/' + encodeURIComponent(id) + '/qr.png?size=400" alt="QR code">' +
      "<div>" +
      '<div class="kv"><div class="k">Lien</div><div class="v"><a href="' + esc(verificationUrl) + '" target="_blank" rel="noopener">' + esc(verificationUrl) + "</a></div></div>" +
      '<div class="toolbar">' +
      '<a class="btn-secondary" style="text-decoration:none;display:inline-block;" href="/api/documents/' + encodeURIComponent(id) + '/qr.png?size=1024" download="qr-' + esc(id) + '.png">Télécharger le PNG (haute résolution, pour intégration dans le PDF)</a>' +
      '<a class="btn-ghost" style="text-decoration:none;display:inline-block;" href="/api/documents/' + encodeURIComponent(id) + '/qr.svg" download="qr-' + esc(id) + '.svg">Télécharger le SVG</a>' +
      "</div>" +
      "</div>" +
      "</div>";
  }

  function loadList() {
    if (!els.apiKey.value) {
      els.list.innerHTML = '<div class="note">Renseigne ta clé API puis clique sur « Actualiser la liste ».</div>';
      return;
    }
    apiFetch("/api/documents")
      .then(function (docs) {
        if (!docs.length) {
          els.list.innerHTML = '<div class="note">Aucun document pour le moment.</div>';
          return;
        }
        els.list.innerHTML = docs
          .map(function (d) {
            return (
              '<div class="list-item" data-id="' + esc(d.id) + '">' +
              "<div>" +
              '<div class="name">' + esc(d.beneficiaire || d.doc || d.id) + "</div>" +
              '<div class="role">' + esc(d.org || "") + (d.statut ? " · " + esc(d.statut) : "") + "</div>" +
              '<div class="id">' + esc(d.id) + "</div>" +
              "</div>" +
              '<div class="toolbar">' +
              '<button type="button" class="btn-secondary edit">Modifier</button>' +
              '<button type="button" class="btn-ghost qr">QR</button>' +
              '<button type="button" class="btn-danger del">Supprimer</button>' +
              "</div>" +
              "</div>"
            );
          })
          .join("");

        Array.prototype.slice.call(els.list.querySelectorAll(".list-item")).forEach(function (item) {
          var id = item.getAttribute("data-id");
          var record = docs.find(function (d) { return d.id === id; });

          item.querySelector(".edit").addEventListener("click", function () {
            editingId = id;
            els.id.value = id;
            els.id.disabled = true;
            els.org.value = record.org || "";
            els.beneficiaire.value = record.beneficiaire || "";
            els.doc.value = record.doc || "";
            els.statut.value = record.statut || "Terminé";
            els.sha.value = record.sha || "";
            els.signers.innerHTML = "";
            (record.signers || []).forEach(addSignerRow);
            if (!record.signers || !record.signers.length) addSignerRow();
            els.submitBtn.textContent = "Mettre à jour le document";
            window.scrollTo({ top: 0, behavior: "smooth" });
          });

          item.querySelector(".qr").addEventListener("click", function () {
            showQr(id, location.origin + "/v/" + encodeURIComponent(id));
            window.scrollTo({ top: els.qrResult.offsetTop, behavior: "smooth" });
          });

          item.querySelector(".del").addEventListener("click", function () {
            if (!confirm("Supprimer définitivement le document " + id + " ?")) return;
            apiFetch("/api/documents/" + encodeURIComponent(id), { method: "DELETE" })
              .then(function () {
                alert("success", "Document supprimé.");
                loadList();
              })
              .catch(function (err) {
                alert("error", err.message);
              });
          });
        });
      })
      .catch(function (err) {
        els.list.innerHTML = '<div class="note">Impossible de charger la liste : ' + esc(err.message) + "</div>";
      });
  }

  els.refreshList.addEventListener("click", loadList);

  resetForm();
  loadList();
})();
