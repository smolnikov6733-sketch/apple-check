#!/usr/bin/env bash
set -e

# Простой deploy на GitHub Pages (gh-pages branch)
# Требования: git установлен, репозиторий и remote origin настроены

BUILD_DIR="./"
TMP_DIR="/tmp/apple-check-gh-pages"

echo "Подготавливаю временную папку $TMP_DIR"
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"

echo "Копирую файлы"
cp -r $BUILD_DIR/* "$TMP_DIR/"

pushd "$TMP_DIR" >/dev/null
git init
git add .
git commit -m "Deploy apple-check static site"
git branch -M gh-pages
git remote add origin $(git -C "$BUILD_DIR" remote get-url origin || echo "")
if [ -z "$(git -C "$BUILD_DIR" remote get-url origin 2>/dev/null)" ]; then
  echo "Remote origin не найден в локальном репозитории. Откройте ваш проект и добавьте remote origin перед использованием этого скрипта."
  exit 1
fi
git push -f origin gh-pages
popd >/dev/null

echo "Опубликовано в ветке gh-pages на origin (если origin настроен)."
