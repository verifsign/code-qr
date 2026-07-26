"""Mapping des champs du CERFA 10103*14 (contrat d'apprentissage, FA13).

Le PDF officiel utilise des noms de champs génériques ("Zone de texte 8_42",
"Case #C3#A0 cocher 5_3"...). Ce module associe chaque clé sémantique du
dossier JSON au nom réel du champ dans le PDF.

Les noms ont été relevés sur la version 10103*14 (valable à partir du
01/07/2025), téléchargée depuis
https://www.formulaires.service-public.gouv.fr/gf/cerfa_10103.do
"""

CASE = "Case #C3#A0 cocher "  # préfixe des cases à cocher ("Case à cocher")
TXT = "Zone de texte "

# ---------------------------------------------------------------------------
# Champs texte : chemin pointé dans le dossier JSON -> nom du champ PDF
# ---------------------------------------------------------------------------
CHAMPS_TEXTE = {
    "modeContractuel": TXT + "8_54",

    # L'EMPLOYEUR
    "employeur.denomination": TXT + "8",
    "employeur.siret": TXT + "8_2",
    "employeur.typeEmployeur": TXT + "8_3",
    "employeur.employeurSpecifique": TXT + "8_4",
    "employeur.adresse.numero": TXT + "8_14",
    "employeur.adresse.voie": TXT + "8_13",
    "employeur.adresse.complement": TXT + "8_8",
    "employeur.adresse.codePostal": TXT + "8_9",
    "employeur.adresse.commune": TXT + "8_10",
    "employeur.telephone": TXT + "8_11",
    "employeur.courriel": TXT + "8_12",
    "employeur.codeApe": TXT + "8_7",
    "employeur.effectif": TXT + "8_5",
    "employeur.codeIdcc": TXT + "8_6",

    # L'APPRENTI(E)
    "apprenti.nomNaissance": TXT + "8_15",
    "apprenti.nomUsage": TXT + "8_16",
    "apprenti.prenom": TXT + "8_17",
    "apprenti.nir": TXT + "8_18",
    "apprenti.departementNaissance": TXT + "8_26",
    "apprenti.communeNaissance": TXT + "8_27",
    "apprenti.nationalite": TXT + "8_33",
    "apprenti.regimeSocial": TXT + "8_34",
    "apprenti.adresse.numero": TXT + "8_19",
    "apprenti.adresse.voie": TXT + "8_20",
    "apprenti.adresse.complement": TXT + "8_21",
    "apprenti.adresse.codePostal": TXT + "8_22",
    "apprenti.adresse.commune": TXT + "8_23",
    "apprenti.telephone": TXT + "8_24",
    "apprenti.courriel": TXT + "8_25",
    "apprenti.situationAvantContrat": TXT + "8_28",
    "apprenti.dernierDiplomePrepare": TXT + "8_29",
    "apprenti.derniereClasse": TXT + "8_30",
    "apprenti.intituleDernierDiplome": TXT + "8_31",
    "apprenti.diplomePlusEleve": TXT + "8_32",

    # Représentant légal (si apprenti mineur non émancipé)
    "representantLegal.nomPrenom": TXT + "8_35",
    "representantLegal.adresse.numero": TXT + "8_37",
    "representantLegal.adresse.voie": TXT + "8_36",
    "representantLegal.adresse.complement": TXT + "8_38",
    "representantLegal.adresse.codePostal": TXT + "8_39",
    "representantLegal.adresse.commune": TXT + "8_40",
    "representantLegal.courriel": TXT + "8_41",

    # LE MAÎTRE D'APPRENTISSAGE (n°1 et n°2)
    "maitresApprentissage.0.nomNaissance": TXT + "8_42",
    "maitresApprentissage.0.prenom": TXT + "8_43",
    "maitresApprentissage.0.courriel": TXT + "8_44",
    "maitresApprentissage.0.emploi": TXT + "8_45",
    "maitresApprentissage.0.diplome": TXT + "8_50",
    "maitresApprentissage.0.niveauDiplome": TXT + "8_52",
    "maitresApprentissage.1.nomNaissance": TXT + "8_46",
    "maitresApprentissage.1.prenom": TXT + "8_47",
    "maitresApprentissage.1.courriel": TXT + "8_48",
    "maitresApprentissage.1.emploi": TXT + "8_49",
    "maitresApprentissage.1.diplome": TXT + "8_51",
    "maitresApprentissage.1.niveauDiplome": TXT + "8_53",

    # LE CONTRAT
    "contrat.type": TXT + "8_71",
    "contrat.typeDerogation": TXT + "8_70",
    "contrat.numeroContratPrecedent": TXT + "8_55",
    "contrat.dureeHebdoHeures": TXT + "8_68",
    "contrat.dureeHebdoMinutes": TXT + "8_69",
    "contrat.caisseRetraite": TXT + "21_74",
    "contrat.avantages.autre": TXT + "21_79",

    # LA FORMATION
    "formation.diplomeVise": TXT + "8_77",
    "formation.denominationCfa": TXT + "8_99",
    "formation.intitulePrecis": TXT + "8_100",
    "formation.uaiCfa": TXT + "8_73",
    "formation.codeDiplome": TXT + "8_75",
    "formation.siretCfa": TXT + "8_74",
    "formation.codeRncp": TXT + "8_76",
    "formation.adresseCfa.numero": TXT + "8_79",
    "formation.adresseCfa.voie": TXT + "8_80",
    "formation.adresseCfa.complement": TXT + "8_81",
    "formation.adresseCfa.codePostal": TXT + "8_82",
    "formation.adresseCfa.commune": TXT + "8_78",
    "formation.dureeHeures": TXT + "21_80",
    "formation.heuresDistance": TXT + "8_102",
    "formation.lieuFormation.denomination": TXT + "8_101",
    "formation.lieuFormation.uai": TXT + "8_84",
    "formation.lieuFormation.siret": TXT + "8_83",
    "formation.lieuFormation.adresse.numero": TXT + "8_86",
    "formation.lieuFormation.adresse.voie": TXT + "8_87",
    "formation.lieuFormation.adresse.complement": TXT + "8_88",
    "formation.lieuFormation.adresse.codePostal": TXT + "8_89",
    "formation.lieuFormation.adresse.commune": TXT + "8_85",

    "signature.faitA": TXT + "8_90",
}

# ---------------------------------------------------------------------------
# Dates : chemin pointé -> (champ jour, champ mois, champ année)
# ---------------------------------------------------------------------------
CHAMPS_DATE = {
    "apprenti.dateNaissance": (TXT + "21_7", TXT + "21_8", TXT + "21_9"),
    "maitresApprentissage.0.dateNaissance": (TXT + "21_4", TXT + "21_5", TXT + "21_6"),
    "maitresApprentissage.1.dateNaissance": (TXT + "21", TXT + "21_2", TXT + "21_3"),
    "contrat.dateConclusion": (TXT + "21_16", TXT + "21_17", TXT + "21_18"),
    "contrat.dateDebutExecution": (TXT + "21_19", TXT + "21_20", TXT + "21_21"),
    "contrat.dateDebutFormationPratique": (TXT + "21_22", TXT + "21_23", TXT + "21_24"),
    "contrat.dateEffetAvenant": (TXT + "21_13", TXT + "21_14", TXT + "21_15"),
    "contrat.dateFin": (TXT + "21_10", TXT + "21_11", TXT + "21_12"),
    "formation.dateDebutFormation": (TXT + "21_25", TXT + "21_26", TXT + "21_27"),
    "formation.dateFinEpreuves": (TXT + "21_28", TXT + "21_29", TXT + "21_30"),
}

# ---------------------------------------------------------------------------
# Montants : chemin pointé -> (champ euros, champ centimes)
# ---------------------------------------------------------------------------
CHAMPS_MONTANT = {
    "contrat.salaireBrutMensuel": (TXT + "8_72", TXT + "21_73"),
    "contrat.avantages.nourriture": (TXT + "21_75", TXT + "21_76"),
    "contrat.avantages.logement": (TXT + "21_77", TXT + "21_78"),
}

# ---------------------------------------------------------------------------
# Cases Oui / Non : chemin pointé (booléen) -> (case Oui, case Non)
# ---------------------------------------------------------------------------
CHAMPS_OUI_NON = {
    "apprenti.sportifHautNiveau": (CASE + "5", CASE + "5_2"),
    "apprenti.travailleurHandicape": (CASE + "5_3", CASE + "5_4"),
    "apprenti.equivalenceJeunes": (CASE + "5_5", CASE + "5_6"),
    "apprenti.extensionBoe": (CASE + "5_7", CASE + "5_8"),
    "apprenti.projetCreationEntreprise": (CASE + "5_9", CASE + "5_10"),
    "contrat.travauxDangereux": (CASE + "5_13", CASE + "5_14"),
    "formation.cfaEntreprise": (CASE + "5_11", CASE + "5_12"),
}

# ---------------------------------------------------------------------------
# Cases simples : chemin pointé (booléen) -> case à cocher
# ---------------------------------------------------------------------------
CHAMPS_CASE = {
    "employeur.attestationRegimeAssuranceChomage": CASE + "2_2",
    "attestations.maitreApprentissageEligible": CASE + "6",
    "formation.cfaEstLieuFormation": CASE + "7",
    "attestations.piecesJustificatives": CASE + "8",
}

# Type d'employeur : "prive" ou "public"
CASE_EMPLOYEUR_PRIVE = CASE + "1"
CASE_EMPLOYEUR_PUBLIC = CASE + "2"

# Sexe de l'apprenti : "M" ou "F"
CASE_SEXE_M = CASE + "3"
CASE_SEXE_F = CASE + "4"

# ---------------------------------------------------------------------------
# Rémunération (4 années x 2 périodes)
# Chaque entrée : (du_j, du_m, du_a, au_j, au_m, au_a, pourcentage, reference)
# reference = "SMIC" ou "SMC"
# ---------------------------------------------------------------------------
REMUNERATION = {
    (1, 1): (TXT + "21_81", TXT + "21_82", TXT + "21_83",
             TXT + "21_84", TXT + "21_85", TXT + "21_86",
             TXT + "8_95", TXT + "8_96"),
    (1, 2): (TXT + "21_87", TXT + "21_88", TXT + "21_89",
             TXT + "21_90", TXT + "21_91", TXT + "21_92",
             TXT + "8_97", TXT + "8_98"),
    (2, 1): (TXT + "21_37", TXT + "21_38", TXT + "21_39",
             TXT + "21_40", TXT + "21_41", TXT + "21_42",
             TXT + "8_56", TXT + "8_57"),
    (2, 2): (TXT + "21_43", TXT + "21_44", TXT + "21_45",
             TXT + "21_46", TXT + "21_47", TXT + "21_48",
             TXT + "8_58", TXT + "8_59"),
    (3, 1): (TXT + "21_49", TXT + "21_50", TXT + "21_51",
             TXT + "21_52", TXT + "21_53", TXT + "21_54",
             TXT + "8_60", TXT + "8_61"),
    (3, 2): (TXT + "21_55", TXT + "21_56", TXT + "21_57",
             TXT + "21_58", TXT + "21_59", TXT + "21_60",
             TXT + "8_62", TXT + "8_63"),
    (4, 1): (TXT + "21_61", TXT + "21_62", TXT + "21_63",
             TXT + "21_64", TXT + "21_65", TXT + "21_66",
             TXT + "8_64", TXT + "8_65"),
    (4, 2): (TXT + "21_67", TXT + "21_68", TXT + "21_69",
             TXT + "21_70", TXT + "21_71", TXT + "21_72",
             TXT + "8_66", TXT + "8_67"),
}
