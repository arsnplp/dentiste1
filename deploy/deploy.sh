#!/usr/bin/env bash
# Met le site en ligne : commit + push GitHub, puis mise a jour du VPS.
# Usage : ./deploy/deploy.sh "message du commit"
set -euo pipefail

VPS="root@217.65.144.174"
KEY="$HOME/.ssh/vps1_ed25519"
DIR="/var/www/dentiste1"

cd "$(dirname "$0")/.."

MSG="${1:-Mise a jour du site}"
git add -A
if ! git diff --cached --quiet; then
  git commit -m "$MSG"
fi
git push origin main

ssh -i "$KEY" -o IdentitiesOnly=yes "$VPS" "
  set -e
  cd $DIR
  git fetch --quiet origin main
  git reset --hard origin/main
  chown -R www-data:www-data $DIR
  echo \"VPS a jour : \$(git log -1 --format='%h %s')\"
"

echo "En ligne : https://dentiste1.nairox.fr"
