#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

echo "Installing Node.js dependencies..."
npm ci --legacy-peer-deps

echo "Building React frontend..."
npm run build

echo "Build complete. Output in 'build' directory."
