#!/bin/bash
# ─────────────────────────────────────────────────────────
# NAVACLAW-AI — GCP Deployment Script
# Target: nava-web-server-e2-small (us-central1-a)
# Domain: navaclaw.com
# Author: Frank Van Laarhoven
# ─────────────────────────────────────────────────────────

set -euo pipefail

# Config
PROJECT_ID="project-1fa64e91-d51b-4ea2-a9d"
ZONE="us-central1-a"
INSTANCE="nava-web-server-e2-small"
REPO="https://github.com/FrankAsanteVanLaarhoven/NavaClaw.git"
DEPLOY_DIR="/opt/navaclaw"
DOMAIN="navaclaw.com"

echo "╔══════════════════════════════════════════╗"
echo "║   NAVACLAW-AI DEPLOYMENT                 ║"
echo "║   Target: $INSTANCE                      ║"
echo "║   Domain: $DOMAIN                        ║"
echo "╚══════════════════════════════════════════╝"

# ── Step 1: SSH into GCP instance and deploy ──
echo ""
echo "▸ Deploying to GCP instance..."

gcloud compute ssh "$INSTANCE" \
  --zone="$ZONE" \
  --project="$PROJECT_ID" \
  --command="
    set -euo pipefail
    
    echo '▸ [1/5] Installing dependencies...'
    sudo apt-get update -qq
    sudo systemctl enable docker
    sudo systemctl start docker
    
    echo '▸ [2/5] Cloning/pulling NavaClaw...'
    if [ -d '$DEPLOY_DIR' ]; then
      cd $DEPLOY_DIR
      sudo git pull origin main
    else
      sudo git clone $REPO $DEPLOY_DIR
      cd $DEPLOY_DIR
    fi
    
    echo '▸ [3/5] Cleaning up overlapping containers...'
    if [ -d "$DEPLOY_DIR" ]; then
      cd $DEPLOY_DIR
      sudo docker compose down --remove-orphans 2>/dev/null || true
    fi
    
    echo '▸ [4/5] Creating production env...'
    if [ ! -f "$DEPLOY_DIR/.env.production" ]; then
      sudo tee $DEPLOY_DIR/.env.production > /dev/null << 'ENVEOF'
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://navaclaw.com
NEXT_PUBLIC_API_URL=https://navaclaw.com/api
ENVEOF
    fi
    
    echo '▸ [5/5] Building and starting containers...'
    cd $DEPLOY_DIR
    echo '  - Cleaning up Docker disk space...'
    sudo docker system prune -af --volumes || true
    sudo docker compose build --no-cache navaclaw-web
    sudo docker compose up -d
    
    echo '▸ [Verifying]...'
    sleep 5
    sudo docker compose ps
    
    echo ''
    echo '═══════════════════════════════════════'
    echo '  NAVACLAW-AI deployed to NPM network!'
    echo '  Ensure NPM routes to navaclaw-web:8080'
    echo '═══════════════════════════════════════'
  "

echo ""
echo "▸ Deployment complete."
