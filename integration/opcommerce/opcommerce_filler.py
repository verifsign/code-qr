"""
Automatisation du portail OPCOMMERCE via Playwright.

Remplit et soumet les formulaires CERFA :
  - PDC  : Plan de Développement des Compétences
  - Pro-A: Reconversion ou Promotion par Alternance
  - Apprentissage / Contrat FA
  - AFPR : Action de Formation Préalable au Recrutement

Pré-requis ::

    pip install playwright
    playwright install chromium

Utilisation rapide ::

    from integration.opcommerce import OpcommerceFiller

    filler = OpcommerceFiller(
        login="mon.email@entreprise.fr",
        password="motdepasse",
        headless=True,          # False pour voir le navigateur
    )
    result = filler.fill(payload)   # payload issu de CerfaMapper.map()
    print(result)
"""
from __future__ import annotations

import os
import time
from typing import Any

PORTAIL_URL = "https://portail.opcommerce.fr"
LOGIN_URL   = f"{PORTAIL_URL}/login"


class OpcommerceFiller:
    """
    Remplit les formulaires CERFA sur le portail OPCOMMERCE.

    Paramètres
    ----------
    login : str
        Adresse email du compte OPCOMMERCE (ou variable d'env OPCOMMERCE_LOGIN).
    password : str
        Mot de passe (ou variable d'env OPCOMMERCE_PASSWORD).
    headless : bool
        True = navigateur invisible (production), False = visible (débogage).
    slow_mo : int
        Délai en ms entre chaque action (utile pour débogage, défaut 0).
    screenshot_dir : str | None
        Dossier où enregistrer les captures d'écran des étapes / erreurs.
    dry_run : bool
        Si True, remplit le formulaire mais N'ENVOIE PAS (pas de clic final).
    """

    def __init__(
        self,
        login: str | None = None,
        password: str | None = None,
        headless: bool = True,
        slow_mo: int = 0,
        screenshot_dir: str | None = None,
        dry_run: bool = False,
    ):
        self.login = login or os.environ.get("OPCOMMERCE_LOGIN", "")
        self.password = password or os.environ.get("OPCOMMERCE_PASSWORD", "")
        self.headless = headless
        self.slow_mo = slow_mo
        self.screenshot_dir = screenshot_dir
        self.dry_run = dry_run

        if not self.login or not self.password:
            raise ValueError(
                "Identifiants OPCOMMERCE manquants. "
                "Définissez OPCOMMERCE_LOGIN et OPCOMMERCE_PASSWORD "
                "ou passez login/password au constructeur."
            )

    # ------------------------------------------------------------------
    # Point d'entrée principal
    # ------------------------------------------------------------------

    def fill(self, payload: dict[str, Any]) -> dict[str, Any]:
        """
        Ouvre le navigateur, se connecte, remplit et (optionnellement) soumet
        le formulaire CERFA correspondant au payload.

        Retourne un dict avec :
        - ``success`` (bool)
        - ``reference`` (str | None) : numéro de dossier OPCOMMERCE si soumis
        - ``screenshot`` (str | None) : chemin de la capture d'écran finale
        - ``erreur`` (str | None) : message d'erreur en cas d'échec
        """
        try:
            from playwright.sync_api import sync_playwright
        except ImportError as exc:
            raise ImportError(
                "Playwright non installé. Exécutez : pip install playwright && playwright install chromium"
            ) from exc

        result: dict[str, Any] = {
            "success": False,
            "reference": None,
            "screenshot": None,
            "erreur": None,
        }

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=self.headless, slow_mo=self.slow_mo)
            context = browser.new_context(
                locale="fr-FR",
                timezone_id="Europe/Paris",
            )
            page = context.new_page()

            try:
                self._authenticate(page)
                self._navigate_to_new_demande(page, payload)

                type_cerfa = payload.get("type_cerfa", "PDC")
                fill_method = {
                    "PDC":          self._fill_pdc,
                    "PRO_A":        self._fill_pro_a,
                    "APPRENTISSAGE": self._fill_apprentissage,
                    "AFPR":         self._fill_afpr,
                }.get(type_cerfa, self._fill_pdc)

                fill_method(page, payload)

                if not self.dry_run:
                    reference = self._submit(page, payload)
                    result["reference"] = reference
                    result["success"] = True
                else:
                    result["success"] = True
                    result["erreur"] = "dry_run : formulaire rempli mais non soumis"

                result["screenshot"] = self._screenshot(page, f"cerfa_{type_cerfa}_final")

            except Exception as exc:
                result["erreur"] = str(exc)
                result["screenshot"] = self._screenshot(page, "cerfa_erreur")
                raise
            finally:
                context.close()
                browser.close()

        return result

    # ------------------------------------------------------------------
    # Authentification
    # ------------------------------------------------------------------

    def _authenticate(self, page) -> None:
        page.goto(LOGIN_URL, wait_until="networkidle")
        self._screenshot(page, "01_login")

        # Champ email
        page.locator("input[type='email'], input[name='email'], input[name='username']"
                     ).first.fill(self.login)
        # Champ mot de passe
        page.locator("input[type='password']").first.fill(self.password)
        # Bouton connexion
        page.locator(
            "button[type='submit'], input[type='submit'], "
            "button:has-text('Connexion'), button:has-text('Se connecter')"
        ).first.click()

        page.wait_for_load_state("networkidle")
        self._screenshot(page, "02_apres_login")

        if "login" in page.url.lower() or "connexion" in page.url.lower():
            raise RuntimeError(
                "Échec de connexion OPCOMMERCE. "
                "Vérifiez login/password et l'URL du portail."
            )

    # ------------------------------------------------------------------
    # Navigation vers la création d'une nouvelle demande
    # ------------------------------------------------------------------

    def _navigate_to_new_demande(self, page, payload: dict) -> None:
        type_cerfa = payload.get("type_cerfa", "PDC")

        # Tenter de trouver le lien "Nouvelle demande" ou équivalent
        try:
            page.locator(
                "a:has-text('Nouvelle demande'), "
                "button:has-text('Nouvelle demande'), "
                "a:has-text('Créer'), "
                "a:has-text('Demande de prise en charge')"
            ).first.click(timeout=10_000)
        except Exception:
            # Fallback : navigation directe via URL
            urls_par_type = {
                "PDC":           f"{PORTAIL_URL}/demandes/pdc/nouvelle",
                "PRO_A":         f"{PORTAIL_URL}/demandes/pro-a/nouvelle",
                "APPRENTISSAGE": f"{PORTAIL_URL}/demandes/apprentissage/nouvelle",
                "AFPR":          f"{PORTAIL_URL}/demandes/afpr/nouvelle",
            }
            page.goto(
                urls_par_type.get(type_cerfa, f"{PORTAIL_URL}/demandes/nouvelle"),
                wait_until="networkidle",
            )

        page.wait_for_load_state("networkidle")
        self._screenshot(page, "03_nouvelle_demande")

    # ------------------------------------------------------------------
    # Remplissage PDC (Plan de Développement des Compétences)
    # ------------------------------------------------------------------

    def _fill_pdc(self, page, payload: dict) -> None:
        """Remplit le formulaire PDC, étape par étape."""
        self._screenshot(page, "04_pdc_debut")

        # ---- Bloc Organisme de formation ----
        self._fill_field(page, [
            "input[name*='organisme'], input[placeholder*='organisme de formation']",
            "#organisme_nom, #of_nom",
        ], payload.get("organisme_nom", ""))

        self._fill_field(page, [
            "input[name*='nda'], input[placeholder*='numéro déclaration']",
            "#nda, #of_nda",
        ], payload.get("organisme_nda", ""))

        self._fill_field(page, [
            "input[name*='siret_of'], input[name*='organisme_siret']",
            "#siret_organisme",
        ], payload.get("organisme_siret", ""))

        # ---- Bloc Formation ----
        self._fill_field(page, [
            "input[name*='intitule'], input[name*='titre'], textarea[name*='formation']",
            "#titre_formation, #intitule_formation",
        ], payload.get("titre_formation", ""))

        self._fill_field(page, [
            "input[name*='date_debut'], input[name*='dateDebut']",
            "#date_debut",
        ], payload.get("date_debut", ""))

        self._fill_field(page, [
            "input[name*='date_fin'], input[name*='dateFin']",
            "#date_fin",
        ], payload.get("date_fin", ""))

        self._fill_field(page, [
            "input[name*='heures'], input[name*='duree']",
            "#nb_heures, #duree_heures",
        ], str(payload.get("nb_heures", "")))

        self._fill_field(page, [
            "input[name*='cout'], input[name*='montant']",
            "#cout_pedagogique, #montant",
        ], str(payload.get("cout_pedagogique", "")))

        # ---- Bloc Employeur ----
        self._fill_field(page, [
            "input[name*='raison_sociale'], input[name*='entreprise']",
            "#employeur_raison_sociale, #raison_sociale",
        ], payload.get("employeur_raison_sociale", ""))

        self._fill_field(page, [
            "input[name*='siret_employeur'], input[name*='siret']",
            "#siret_employeur, #siret",
        ], payload.get("employeur_siret", ""))

        self._fill_field(page, [
            "input[name*='adresse_employeur'], input[name*='adresse']",
            "#adresse_employeur",
        ], payload.get("employeur_adresse", ""))

        self._fill_field(page, [
            "input[name*='cp'], input[name*='code_postal']",
            "#cp_employeur, #code_postal",
        ], payload.get("employeur_cp", ""))

        self._fill_field(page, [
            "input[name*='ville_employeur'], input[name*='commune']",
            "#ville_employeur, #ville",
        ], payload.get("employeur_ville", ""))

        # ---- Bloc Stagiaire ----
        self._fill_field(page, [
            "input[name*='nom_stagiaire'], input[name*='nom_salarie']",
            "#nom_stagiaire, #salarie_nom",
        ], payload.get("stagiaire_nom", ""))

        self._fill_field(page, [
            "input[name*='prenom_stagiaire'], input[name*='prenom_salarie']",
            "#prenom_stagiaire, #salarie_prenom",
        ], payload.get("stagiaire_prenom", ""))

        self._fill_field(page, [
            "input[name*='date_naissance'], input[name*='naissance']",
            "#date_naissance, #naissance",
        ], payload.get("stagiaire_naissance", ""))

        self._fill_field(page, [
            "input[name*='emploi'], input[name*='poste']",
            "#emploi_occupe, #poste",
        ], payload.get("stagiaire_emploi", ""))

        self._screenshot(page, "05_pdc_rempli")

    # ------------------------------------------------------------------
    # Remplissage Pro-A
    # ------------------------------------------------------------------

    def _fill_pro_a(self, page, payload: dict) -> None:
        self._fill_pdc(page, payload)  # mêmes blocs de base

        self._fill_field(page, [
            "input[name*='tuteur_nom']", "#tuteur_nom",
        ], payload.get("tuteur_nom", ""))

        self._fill_field(page, [
            "input[name*='tuteur_prenom']", "#tuteur_prenom",
        ], payload.get("tuteur_prenom", ""))

        self._fill_field(page, [
            "input[name*='type_contrat']", "#type_contrat",
        ], payload.get("stagiaire_contrat_type", ""))

        self._screenshot(page, "05_proa_rempli")

    # ------------------------------------------------------------------
    # Remplissage Apprentissage
    # ------------------------------------------------------------------

    def _fill_apprentissage(self, page, payload: dict) -> None:
        self._fill_pdc(page, payload)  # blocs communs

        self._fill_field(page, [
            "input[name*='maitre_apprentissage_nom']", "#maitre_nom",
        ], payload.get("maitre_apprentissage_nom", ""))

        self._fill_field(page, [
            "input[name*='maitre_apprentissage_prenom']", "#maitre_prenom",
        ], payload.get("maitre_apprentissage_prenom", ""))

        self._fill_field(page, [
            "input[name*='diplome'], input[name*='certification']",
            "#diplome_prepare",
        ], payload.get("diplome_prepare", ""))

        self._fill_field(page, [
            "input[name*='niveau_diplome'], select[name*='niveau']",
            "#niveau_diplome",
        ], payload.get("niveau_diplome", ""))

        self._fill_field(page, [
            "input[name*='idcc'], input[name*='convention_collective']",
            "#idcc",
        ], payload.get("employeur_idcc", ""))

        self._screenshot(page, "05_apprentissage_rempli")

    # ------------------------------------------------------------------
    # Remplissage AFPR
    # ------------------------------------------------------------------

    def _fill_afpr(self, page, payload: dict) -> None:
        self._fill_pdc(page, payload)

        self._fill_field(page, [
            "input[name*='poste_vise'], input[name*='emploi_vise']",
            "#poste_vise",
        ], payload.get("poste_vise", ""))

        self._screenshot(page, "05_afpr_rempli")

    # ------------------------------------------------------------------
    # Soumission du formulaire
    # ------------------------------------------------------------------

    def _submit(self, page, payload: dict) -> str | None:
        """Clique sur Envoyer et récupère le numéro de dossier OPCOMMERCE."""
        page.locator(
            "button[type='submit']:has-text('Envoyer'), "
            "button[type='submit']:has-text('Valider'), "
            "button[type='submit']:has-text('Soumettre'), "
            "input[type='submit']"
        ).first.click()

        page.wait_for_load_state("networkidle")
        self._screenshot(page, "06_apres_soumission")

        # Tentative d'extraction du numéro de référence
        try:
            ref_el = page.locator(
                "[class*='reference'], [class*='numero-dossier'], "
                "[id*='reference'], strong:has-text('N°')"
            ).first
            if ref_el.is_visible(timeout=5_000):
                return ref_el.inner_text().strip()
        except Exception:
            pass

        # Fallback : chercher dans le texte de la page
        content = page.content()
        import re
        m = re.search(r"(?:N°|numéro|référence)[^\d]*(\d{6,})", content, re.I)
        if m:
            return m.group(1)

        return None

    # ------------------------------------------------------------------
    # Utilitaires
    # ------------------------------------------------------------------

    def _fill_field(self, page, selectors: list[str], value: str) -> bool:
        """
        Essaie plusieurs sélecteurs CSS et remplit le premier trouvé.
        Retourne True si un champ a été rempli.
        """
        if not value:
            return False
        for sel in selectors:
            try:
                el = page.locator(sel).first
                if el.count() and el.is_visible(timeout=3_000):
                    tag = el.evaluate("el => el.tagName.toLowerCase()")
                    if tag == "select":
                        el.select_option(label=value)
                    else:
                        el.triple_click()
                        el.fill(value)
                    return True
            except Exception:
                continue
        return False

    def _screenshot(self, page, name: str) -> str | None:
        if not self.screenshot_dir:
            return None
        os.makedirs(self.screenshot_dir, exist_ok=True)
        path = os.path.join(
            self.screenshot_dir, f"{name}_{int(time.time())}.png"
        )
        try:
            page.screenshot(path=path, full_page=True)
            return path
        except Exception:
            return None
