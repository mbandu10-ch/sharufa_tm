#!/bin/bash

# Configuration
PROJECT_ROOT=$(pwd)
DEPLOY_DIR="$PROJECT_ROOT/deploy"
STANDALONE_DIR="$PROJECT_ROOT/.next/standalone"

echo "🚀 Préparation du ZIP COMPLET (Optimisé Linux/o2switch)..."

# 0. Nettoyage initial
rm -f "$PROJECT_ROOT/deploy-sharufa.zip"
rm -rf "$DEPLOY_DIR"

# 1. Génération Prisma (CRUCIAL : Télécharge les versions Linux pour le build)
echo "💎 Génération du client Prisma avec binaryTargets..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la génération Prisma. Arrêt."
    exit 1
fi

# 2. Build de l'application
echo "📦 Build de l'application Next.js..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build. Arrêt."
    exit 1
fi

# 3. Création du dossier de déploiement
echo "📂 Organisation des fichiers (INCLUT node_modules)..."
mkdir -p "$DEPLOY_DIR"

# 4. Copie des fichiers standalone (Inclut node_modules déjà optimisé)
if [ -d "$STANDALONE_DIR" ]; then
    cp -r "$STANDALONE_DIR/." "$DEPLOY_DIR/"
    
    # On ajoute le fichier .env local au déploiement au cas où (optionnel mais utile)
    if [ -f "$PROJECT_ROOT/.env" ]; then
        cp "$PROJECT_ROOT/.env" "$DEPLOY_DIR/"
    fi

    # Next.js standalone ne copie pas public et static automatiquement
    echo "🖼 Copie des assets statiques..."
    mkdir -p "$DEPLOY_DIR/public"
    cp -r "$PROJECT_ROOT/public/." "$DEPLOY_DIR/public/"
    
    mkdir -p "$DEPLOY_DIR/.next/static"
    cp -r "$PROJECT_ROOT/.next/static/." "$DEPLOY_DIR/.next/static/"
    
    echo "✅ Fichiers organisés"
else
    echo "❌ Dossier standalone non trouvé. Vérifiez la config Next.js."
    exit 1
fi

# 5. Création du ZIP
echo "🤐 Création de l'archive COMPLETE deploy-sharufa.zip..."
cd "$DEPLOY_DIR"
zip -r ../deploy-sharufa.zip .
cd "$PROJECT_ROOT"

echo "----------------------------------------------------------"
echo "✨ TERMINÉ ! Téléversez 'deploy-sharufa.zip' sur o2switch."
echo "----------------------------------------------------------"
echo "💡 ÉTAPES SUR o2switch :"
echo "1. Videz 'sharufa_app' sur le serveur."
echo "2. Téléversez et extrayez ce nouveau ZIP."
echo "3. NE FAITES PAS 'NPM INSTALL' (Tout est déjà dedans)."
echo "4. Cliquez sur 'RESTART'."
echo "----------------------------------------------------------"
