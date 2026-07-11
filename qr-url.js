(function (root) {
  "use strict";

  function toB64Url(data) {
    var json = typeof data === "string" ? data : JSON.stringify(data);
    var binary;

    if (typeof TextEncoder !== "undefined") {
      var bytes = new TextEncoder().encode(json);
      binary = "";
      for (var i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    } else {
      binary = unescape(encodeURIComponent(json));
    }

    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  function buildVerificationUrl(baseUrl, data) {
    var cleanBase = String(baseUrl || "").replace(/#.*$/, "");
    return cleanBase + "#d=" + toB64Url(data);
  }

  function buildVerificationUrlFromCrmId(baseUrl, documentId) {
    var cleanBase = String(baseUrl || "").replace(/[?#].*$/, "");
    return cleanBase + "?id=" + encodeURIComponent(documentId);
  }

  var api = {
    toB64Url: toB64Url,
    buildVerificationUrl: buildVerificationUrl,
    buildVerificationUrlFromCrmId: buildVerificationUrlFromCrmId
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.QrVerificationUrl = api;
})(typeof window !== "undefined" ? window : globalThis);
