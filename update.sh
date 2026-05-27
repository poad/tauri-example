#!/bin/sh

CUR=$(pwd)

CURRENT=$(cd "$(dirname "$0")" || exit;pwd)
echo "${CURRENT}"

cd "${CURRENT}" || exit
git pull --prune
result=$?
if [ $result -ne 0 ]; then
  cd "${CUR}" || exit
  exit $result
fi

cd "${CURRENT}" || exit
result=$?
if [ $result -ne 0 ]; then
  cd "${CUR}" || exit
  exit $result
fi
echo ""
pwd
if ! (disable-checkout-persist-credentials &&npx pnpm@latest self-update && pnpm install -r && pnpm up -r && pnpm audit --fix override && pnpm up -r && pnpm lint && pnpm build && pnpm install -r --no-frozen-lockfile); then
  cd "${CUR}" || exit
  exit 1
fi

if ! (cd "${CURRENT}"/src-tauri || exit && cargo update); then
  cd "${CUR}" || exit
  exit $result
fi
echo ""
pwd

if ! (cd "${CURRENT}" || exit && pnpm build && pnpm tauri build --ci && git commit -am "Bumps node modules" && git push); then
  cd "${CUR}" || exit
  exit 1
fi

cd "${CUR}" || exit
