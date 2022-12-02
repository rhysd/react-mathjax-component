#!/bin/bash

set -e -o pipefail

if [ ! -d .git ]; then
    echo 'This script must be run from root of repository: bash ./playground/deploy.bash' 1>&2
    exit 1
fi

echo "Ensuring gh-pages branch is up-to-date"
git fetch -u origin gh-pages:gh-pages

sha="$(git rev-parse HEAD)"
echo "Deploying playground from ${sha}"

npm run build
npm run bundle

files=(
    index.html
    bundle.js
    style.css
    bulma.min.css
)

mkdir ./.tmp

for f in "${files[@]}"; do
    cp "./demo/${f}" ./.tmp/
done

echo 'Switching to gh-pages branch'
git checkout gh-pages

for f in "${files[@]}"; do
    cp "./.tmp/${f}" ./
    git add "./${f}"
done

rm -rf ./.tmp

echo 'Making commit for new deploy'
git commit -m "deploy from ${sha}"

echo 'Done.'
