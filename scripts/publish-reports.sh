#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Git repo bulunamadi. Once bu klasoru bir GitHub reposuna bagla."
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "origin remote tanimli degil. Once GitHub remote'unu ekle."
  exit 1
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [[ -z "$BRANCH" || "$BRANCH" == "HEAD" ]]; then
  echo "Detached HEAD uzerindesin. Push icin bir branch sec."
  exit 1
fi

if [[ -z "$(git status --short -- dailytrend dailyjava)" ]]; then
  echo "Yayinlanacak yeni radar degisikligi yok."
  exit 0
fi

git add dailytrend dailyjava

if git diff --cached --quiet; then
  echo "Stage edilecek yeni radar degisikligi yok."
  exit 0
fi

npm run build

STAMP="${1:-$(date +%F)}"
git commit -m "content: publish daily radar reports ${STAMP}"
git push origin "$BRANCH"

