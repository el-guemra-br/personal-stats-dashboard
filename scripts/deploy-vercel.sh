#!/usr/bin/env bash
set -euo pipefail

echo "Running checks before deploy..."
npm run lint
npm run test
npm run build

echo "Deploying to Vercel production..."
npx vercel --prod
