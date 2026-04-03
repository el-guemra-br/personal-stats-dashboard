$ErrorActionPreference = "Stop"

Write-Host "Running checks before deploy..."
npm run lint
npm run test
npm run build

Write-Host "Deploying to Vercel production..."
npx vercel --prod
