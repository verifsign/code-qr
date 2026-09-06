# Mise en ligne sur OVH — mhcmedical.fr

Guide pas à pas pour publier le site.

## Ce qu'il faut avoir

- Un hébergement web OVH actif (offre Perso, Pro ou Performance)
- Le domaine **mhcmedical.fr** pointant vers cet hébergement
- Identifiants FTP ou accès au **Gestionnaire de fichiers** OVH

---

## Méthode 1 — Gestionnaire de fichiers OVH (la plus simple)

1. Connectez-vous sur [https://www.ovh.com/manager/](https://www.ovh.com/manager/)
2. **Hébergements** → sélectionnez votre hébergement
3. Onglet **Multisite** → vérifiez que `mhcmedical.fr` pointe vers le dossier `www` ou `mhcmedical.fr`
4. Onglet **FTP-SSH** → cliquez **Accéder au gestionnaire de fichiers**
5. Ouvrez le dossier racine du site (`www` ou le dossier du domaine)
6. **Supprimez** les fichiers par défaut (`index.html` OVH, etc.) s'il y en a
7. Uploadez **tout le contenu** du dossier `mhcmedical/` :
   - Glissez-déposez les fichiers et dossiers
   - **Important :** `index.html` doit être à la racine, pas dans un sous-dossier `mhcmedical/`

### Structure attendue à la racine

```
www/
  index.html          ← page d'accueil
  contact.html
  css/
  js/
  assets/
  equipements/
  aidant/
  .htaccess
  robots.txt
  sitemap.xml
  ...
```

8. Attendez 2–5 minutes, puis ouvrez **https://mhcmedical.fr**

---

## Méthode 2 — FTP (FileZilla)

| Paramètre | Valeur |
|---|---|
| Hôte | `ftp.cluster0XX.hosting.ovh.net` (voir espace client OVH) |
| Utilisateur | Votre identifiant FTP |
| Mot de passe | Votre mot de passe FTP |
| Port | 21 (ou 22 en SFTP) |

1. Connectez-vous avec FileZilla
2. Côté distant : ouvrez `www/` (ou dossier du domaine)
3. Côté local : ouvrez le dossier `mhcmedical/` du projet
4. Sélectionnez tout le contenu local → glissez vers le serveur
5. Vérifiez que `.htaccess` est bien uploadé (fichiers cachés visibles dans FileZilla)

---

## Méthode 3 — Archive ZIP

Un fichier `mhcmedical-site.zip` est fourni dans le projet. Sur OVH :

1. Uploadez le ZIP dans le gestionnaire de fichiers
2. Décompressez-le **dans** le dossier racine du site
3. Déplacez le contenu à la racine si nécessaire
4. Supprimez le ZIP

---

## Vérifications après mise en ligne

- [ ] https://mhcmedical.fr s'affiche correctement
- [ ] http://mhcmedical.fr et http://www.mhcmedical.fr redirigent vers https://mhcmedical.fr
- [ ] Le téléphone **07 77 77 89 47** est cliquable sur mobile
- [ ] Les photos (devanture, mobilité) s'affichent
- [ ] https://mhcmedical.fr/le-magasin.html fonctionne
- [ ] https://mhcmedical.fr/equipements/mobilite.html fonctionne
- [ ] La page 404 s'affiche sur une URL inexistante
- [ ] Le bandeau cookies apparaît à la première visite
- [ ] Le formulaire de contact envoie un email (test depuis une adresse externe)

---

## Formulaire de contact — SMTP

1. Dans l'espace client OVH, créez l'adresse **contact@mhcmedical.fr** (MX Plan ou Email Pro)
2. Sur le serveur, copiez `contact-config.example.php` en `contact-config.php`
3. Renseignez le mot de passe SMTP dans `contact-config.php`
4. Testez l'envoi depuis https://mhcmedical.fr/contact.html

Paramètres OVH habituels :

| Paramètre | Valeur |
|---|---|
| Serveur SMTP | `ssl0.ovh.net` |
| Port | `465` (SSL) ou `587` (TLS) |
| Utilisateur | `contact@mhcmedical.fr` |
| Mot de passe | Mot de passe de la boîte mail |

Sans `contact-config.php` configuré, le site retombe sur `mail()` (moins fiable).

---

## Assistant IA (chat gratuit)

Le site inclut un assistant maison relié à **Google Gemini** (clé API gratuite).

### Activation (5 minutes)

1. Créez une clé gratuite sur [Google AI Studio](https://aistudio.google.com/apikey)
2. Sur le serveur OVH, copiez `chat-config.example.php` en **`chat-config.php`** (à la racine du site)
3. Collez votre clé API dans `chat-config.php`
4. Vérifiez que `enabled` est à `true`
5. Ouvrez le site, acceptez les cookies : le bouton 💬 apparaît en bas à droite

### Fichiers concernés

| Fichier | Rôle |
|---|---|
| `chat-config.php` | Clé API (secret, non versionné) |
| `api/chat.php` | Point d'entrée JSON |
| `lib/gemini.php` | Appel API côté serveur |
| `js/chat.js` | Widget dans le navigateur |

### Limites du gratuit

- Quotas Google AI Studio (suffisant pour un site vitrine)
- Limite anti-abus : ~30 messages/heure par visiteur
- L'assistant ne remplace pas un conseil médical — il oriente vers le **07 77 77 89 47**

Sans `chat-config.php`, le bouton chat n'apparaît pas (ou répond « appelez-nous »).

### Formulaire prescripteurs

La page **Professionnels de santé** inclut un formulaire de demande d'équipement (`prescripteur.php`). Il utilise la même configuration SMTP que `contact-config.php`.

---

## SPF et DKIM (indispensable pour éviter le spam)

Dans OVH → **Noms de domaine** → `mhcmedical.fr` → **Zone DNS** :

1. **SPF** — enregistrement TXT sur `@` (ou compléter l'existant) :
   ```
   v=spf1 include:mx.ovh.com -all
   ```
   (Adapter si vous utilisez un autre fournisseur mail.)

2. **DKIM** — OVH le propose dans la configuration de la messagerie (Email → DKIM). Activez-le et ajoutez l'enregistrement TXT fourni par OVH.

3. Attendez la propagation DNS (quelques heures), puis testez avec [mail-tester.com](https://www.mail-tester.com).

---

## DNS (si le domaine ne répond pas)

Dans l'espace client OVH → **Noms de domaine** → `mhcmedical.fr` → **Zone DNS** :

| Type | Sous-domaine | Cible |
|---|---|---|
| A | @ | IP de l'hébergement OVH |
| A | www | IP de l'hébergement OVH |

Ou utilisez les enregistrements fournis par OVH lors de l'attachement domaine ↔ hébergement.

---

## Après la mise en ligne

1. **Google Business** — créer la fiche « MHC Medical Health and Care » avec la même adresse et téléphone
2. **Google Search Console** — ajouter le site et soumettre `sitemap.xml`
3. **Mentions légales** — compléter capital social, TVA, directeur de publication
4. **Ancien site** — configurer des redirections 301 si un ancien domaine existait

---

## Support

- OVH : 1007 ou [help.ovh.com](https://help.ovh.com)
- Contenu du site : modifier les fichiers HTML ou relancer `node scripts/build-pages.mjs`
