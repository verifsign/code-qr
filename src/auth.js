export function requireApiKey(req, res, next) {
  const expected = process.env.API_KEY;
  if (!expected || expected === "change-moi-avec-une-vraie-cle-secrete") {
    return res.status(500).json({
      error:
        "Le serveur n'a pas de API_KEY configurée (ou utilise encore la valeur d'exemple). Définis une vraie valeur dans .env avant de créer des documents.",
    });
  }

  const provided = req.get("x-api-key");
  if (!provided || provided !== expected) {
    return res.status(401).json({ error: "Clé API manquante ou invalide (en-tête x-api-key)." });
  }

  next();
}
