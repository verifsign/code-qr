# MHC Medical Health and Care — Site vitrine Phase 1

Site vitrine pour **mhcmedical.fr** — matériel médical à Marseille, tiers payant intégral.

## Pages

| Page | Fichier |
|------|---------|
| Accueil | `index.html` |
| Comment ça marche | `comment-ca-marche.html` |
| Nos équipements | `nos-equipements.html` |
| Professionnels de santé | `professionnels-sante.html` |
| Le magasin | `le-magasin.html` |
| Contact | `contact.html` |
| Mentions légales | `mentions-legales.html` |
| Politique de confidentialité | `politique-confidentialite.html` |
| Cookies | `cookies.html` |
| Réclamations et matériovigilance | `reclamations.html` |

## Prévisualisation locale

```bash
cd mhcmedical
npx serve . -p 4173
# Ouvrir http://localhost:4173
```

## Déploiement OVH

1. Uploader le contenu du dossier `mhcmedical/` à la racine du domaine `mhcmedical.fr`
2. Configurer le domaine dans l'espace client OVH
3. Vérifier que `index.html` est la page par défaut

## À compléter avant mise en ligne

- [ ] Capital social et numéro de TVA intracommunautaire (mentions légales)
- [ ] Nom du directeur de publication
- [ ] Contact matériovigilance dédié
- [ ] Photos devanture et équipe
- [ ] Backend formulaire de contact (actuellement ouvre le client mail)

## Coordonnées intégrées

- **Téléphone :** 07 77 77 89 47
- **Email :** contact@mhcmedical.fr
- **Adresse :** 185 avenue de Saint Louis, 13015 Marseille
