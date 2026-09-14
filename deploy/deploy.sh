#!/usr/bin/env bash
# Met le site en ligne : commit + push GitHub, puis mise a jour du VPS.
# Usage : ./deploy/deploy.sh "message du commit"
set -euo pipefail

VPS="root@217.65.144.174"
KEY="$HOME/.ssh/vps1_ed25519"
DIR="/var/www/dentiste1"

cd "$(dirname "$0")/.."

MSG="${1:-Mise a jour du site}"

# Anti-cache : nouvelle version des liens CSS/JS a chaque deploiement,
# pour que les visiteurs recoivent tout de suite le nouveau style.
V="$(date +%Y%m%d%H%M%S)"
find . -name '*.html' -not -path './.git/*' -not -path './.playwright-mcp/*' -print0 \
  | xargs -0 sed -i '' -E "s#(/css/style\.css|/js/main\.js)(\?v=[0-9a-z]+)?\"#\1?v=$V\"#g"

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
