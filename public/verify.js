(function () {
  function esc(x) {
    return String(x == null ? "" : x)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function idFromPath() {
    var m = location.pathname.match(/\/v\/([^/]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  var card = document.getElementById("card");
  var id = idFromPath();

  if (!id) {
    card.innerHTML =
      '<div class="err">Aucun identifiant de document dans le lien.<br>Cette page s\'ouvre en scannant le QR code imprimé sur un document.</div>';
    return;
  }

  fetch("/api/documents/" + encodeURIComponent(id))
    .then(function (res) {
      if (res.status === 404) throw new Error("NOT_FOUND");
      if (!res.ok) throw new Error("SERVER_ERROR");
      return res.json();
    })
    .then(render)
    .catch(function (err) {
      if (err && err.message === "NOT_FOUND") {
        card.innerHTML =
          '<div class="err">Aucun document ne correspond à cet identifiant.<br>Le lien est peut-être erroné ou le document a été retiré.</div>';
      } else {
        card.innerHTML =
          '<div class="err">Impossible de vérifier ce document pour le moment.<br>Réessaie dans un instant.</div>';
      }
    });

  function render(data) {
    var sigs = (data.signers || [])
      .map(function (s) {
        return (
          '<div class="sig"><div class="top"><div>' +
          '<div class="name">' + esc(s.n) + "</div>" +
          '<div class="role">' + esc(s.r || "") + "</div></div>" +
          '<span class="chip">&#10003; Signé</span></div>' +
          '<div class="when">Signé le <b>' + esc(s.d || "—") + "</b></div></div>"
        );
      })
      .join("");

    var html =
      '<div class="head">' +
      "<h1>Vérification de document</h1>" +
      "<p>Informations enregistrées lors de la signature</p>" +
      (data.statut
        ? '<div class="status"><span class="dot"></span> Statut : ' + esc(data.statut) + "</div>"
        : "") +
      "</div>" +
      '<div class="body">' +
      '<div class="kv"><div class="k">Identifiant</div><div class="v">' + esc(data.id || "—") + "</div></div>" +
      (data.org
        ? '<div class="kv"><div class="k">Émis par</div><div class="v">' + esc(data.org) + "</div></div>"
        : "") +
      (data.doc
        ? '<div class="kv"><div class="k">Document</div><div class="v">' + esc(data.doc) + "</div></div>"
        : "") +
      (data.beneficiaire
        ? '<div class="kv"><div class="k">Bénéficiaire</div><div class="v">' + esc(data.beneficiaire) + "</div></div>"
        : "") +
      (data.createdAt
        ? '<div class="kv"><div class="k">Créé le</div><div class="v">' + esc(formatDate(data.createdAt)) + "</div></div>"
        : "") +
      "<h2>Signataires</h2>" +
      (sigs || '<div class="err">Aucun signataire enregistré pour ce document.</div>') +
      (data.sha
        ? '<h2>Empreinte SHA-256 du document</h2><div class="mono">' + esc(data.sha) + "</div>" +
          '<div class="note">Empreinte du fichier PDF final, calculée et transmise par l\'organisme émetteur après la signature. Pour vérifier l\'intégrité : calcule le SHA-256 du fichier PDF que tu détiens et compare-le à cette valeur.</div>'
        : "") +
      (data.dataHash
        ? '<h2>Empreinte des données de signature</h2><div class="mono">' + esc(data.dataHash) + "</div>" +
          '<div class="note">Empreinte calculée sur les informations ci-dessus (identifiant, signataires, dates). Elle permet de détecter une modification de ces données après leur enregistrement, mais ne porte pas sur le contenu du PDF lui-même.</div>'
        : "") +
      '<div class="foot">' +
      "Cette page affiche les informations enregistrées" +
      (data.org ? ' par <span class="brand">' + esc(data.org) + "</span>" : "") +
      " au moment de la signature du document. " +
      "Elle ne constitue pas, à elle seule, une signature électronique qualifiée au sens du règlement (UE) n°910/2014 (eIDAS) et ne remplace pas une vérification cryptographique indépendante du fichier." +
      "</div>" +
      "</div>";

    card.innerHTML = html;
    document.title = "Vérification — " + (data.id || "document");
  }

  function formatDate(iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      return d.toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
    } catch (e) {
      return iso;
    }
  }
})();
