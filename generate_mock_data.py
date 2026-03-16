import sys
import pandas as pd
import random
import logging

# ==============================================================================
# TITRE       : Génération de Données Mock - Graphe Relationnel
# AUTEUR      : Adam Beloucif
# DATE        : 2026-03-16
# DESCRIPTION : Ce script génère un fichier Excel contenant des données 
#               factices de relations entre individus pour l'application de graphe.
# PRATIQUES   : Logging professionnel, encodage UTF-8, structure propre.
# ==============================================================================

# Forcer l'encodage
sys.stdout.reconfigure(encoding='utf-8')

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%H:%M:%S'
)

def generer_donnees():
    """
    Génère les individus et leurs relations aléatoires, puis exporte en Excel.
    """
    logging.info("🚀 Démarrage de la génération des données...")

    # ══════════════════════════════════════════════════════════
    # TRAVAIL 1 : Création des Noeuds (Individus)
    # ──────────────────────────────────────────────────────────
    garcons = ["Lucas", "Hugo", "Arthur", "Leo", "Louis", "Raphael", "Gabriel", "Jules", "Adam", "Maxime", "Tom", "Paul", "Antoine", "Alexandre"]
    filles = ["Emma", "Jade", "Louise", "Alice", "Chloe", "Lina", "Lea", "Manon", "Rose", "Anna", "Ines", "Camille", "Sarah", "Julia"]

    personnes = []
    
    # On attribue un ID unique G_x pour les garçons et F_x pour les filles
    for i, nom in enumerate(garcons):
        personnes.append({"id": f"G{i}", "nom": nom, "genre": "Garçon"})
    for i, nom in enumerate(filles):
        personnes.append({"id": f"F{i}", "nom": nom, "genre": "Fille"})

    random.shuffle(personnes)
    logging.info(f"✅ {len(personnes)} individus générés au total.")

    # ══════════════════════════════════════════════════════════
    # TRAVAIL 2 : Création des Liens (Relations)
    # ──────────────────────────────────────────────────────────
    types_relations = ["Ont couché ensemble", "Se sont embrassé", "Sont sortie ensemble"]
    relations = []
    
    # On génère un nombre aléatoire de relations pour peupler le graphe
    nb_relations_a_generer = 70
    
    for _ in range(nb_relations_a_generer):
        source = random.choice(personnes)
        target = random.choice(personnes)
        
        # On évite qu'une personne ait une relation avec elle-même
        if source["id"] != target["id"]:
            rel_type = random.choice(types_relations)
            
            # Pour éviter les doublons A->B et B->A, on trie par ID
            # Cela garantit l'unicité des relations non-orientées
            id1, id2 = sorted([source["id"], target["id"]])
            
            # Retrouver les objets correspondants après le tri
            p1 = next(p for p in personnes if p["id"] == id1)
            p2 = next(p for p in personnes if p["id"] == id2)
            
            relations.append({
                "Source_ID": p1["id"],
                "Source_Nom": p1["nom"],
                "Source_Genre": p1["genre"],
                "Target_ID": p2["id"],
                "Target_Nom": p2["nom"],
                "Target_Genre": p2["genre"],
                "Type_Relation": rel_type
            })

    # Convertir en DataFrame pandas
    df = pd.DataFrame(relations)
    
    # Supprimer les doublons exacts (même paire, même type de relation)
    df = df.drop_duplicates(subset=["Source_ID", "Target_ID", "Type_Relation"])
    logging.info(f"📊 {len(df)} relations uniques générées.")

    # ══════════════════════════════════════════════════════════
    # TRAVAIL 3 : Export Excel
    # ──────────────────────────────────────────────────────────
    output_file = "relations_data.xlsx"
    df.to_excel(output_file, index=False)
    logging.info(f"📦 Fichier '{output_file}' sauvegardé avec succès.")
    logging.info("✅ Génération terminée.")

if __name__ == "__main__":
    generer_donnees()
