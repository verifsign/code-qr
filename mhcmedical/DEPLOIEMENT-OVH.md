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
- [ ] Le téléphone **07 77 77 89 47** est cliquable sur mobile
- [ ] Les photos (devanture, mobilité) s'affichent
- [ ] https://mhcmedical.fr/le-magasin.html fonctionne
- [ ] https://mhcmedical.fr/equipements/mobilite.html fonctionne
- [ ] La page 404 s'affiche sur une URL inexistante
- [ ] Le bandeau cookies apparaît à la première visite

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
