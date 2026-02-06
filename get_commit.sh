#!/bin/bash

OUTPUT_DIR="./DOC"
OUTPUT_FILE="$OUTPUT_DIR/JNR.csv"

# Check Git
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "Erreur : Pas un dépôt Git."
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

# Header du CSV
echo "Hash;Date;Auteur;Email;Sujet;Description" > "$OUTPUT_FILE"

# Extraction directe sans boucle complexe pour éviter les erreurs "ambiguous argument"
# On utilise --pretty=format avec des points-virgules directement.
# %h  : Hash
# %ad : Date
# %an : Nom
# %ae : Email
# %s  : Sujet
# %b  : Body (Description)
git log --since="2026-02-06 08:00:00" --until="2026-02-06 11:30:00" \
    --date=iso \
    --pretty=format:"%h;%ad;%an;%ae;%s;%b" >> "$OUTPUT_FILE"

# Petit fix : git log peut laisser des sauts de ligne dans le CSV à cause du body (%b).
# Si tu veux un CSV parfaitement propre sur une seule ligne par commit :
# sed -i ':a;N;$!ba;s/\n / /g' "$OUTPUT_FILE" 

echo "Terminé ! Infos extraites dans $OUTPUT_FILE"