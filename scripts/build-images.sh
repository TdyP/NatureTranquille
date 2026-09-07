#!/bin/bash

# NatureTranquille - Build Docker Images Script
# Ce script génère les images Docker pour la production SANS lancer les conteneurs.
# Usage: ./scripts/build-images.sh [export|export-gz]
#   - Sans argument : build seulement
#   - Avec "export" : build + exporte dans un fichier tar (compatible docker load)
#   - Avec "export-gz" : build + exporte dans un fichier tar.gz

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Image names and tags
BACKEND_IMAGE="naturetranquille-backend"
FRONTEND_IMAGE="naturetranquille-frontend"
IMAGE_TAG="latest"

export_image() {
    local compress="$1"
    local output_file="naturetranquille-images.tar"
    
    if [ "$compress" = "gz" ]; then
        output_file="naturetranquille-images.tar.gz"
    fi

    log_info "Exporting Docker images to $output_file..."
    
    cd "$PROJECT_DIR"
    
    # Export BOTH images in a SINGLE docker save command (compatible with docker load)
    if [ "$compress" = "gz" ]; then
        docker save "$BACKEND_IMAGE:$IMAGE_TAG" "$FRONTEND_IMAGE:$IMAGE_TAG" | gzip > "$output_file"
        log_info "Images exported to: $output_file"
        log_info "To load on VPS: gunzip -c $output_file | docker load"
    else
        docker save "$BACKEND_IMAGE:$IMAGE_TAG" "$FRONTEND_IMAGE:$IMAGE_TAG" -o "$output_file"
        log_info "Images exported to: $output_file"
        log_info "To load on VPS: docker load -i $output_file"
    fi
}

main() {
    cd "$PROJECT_DIR"
    
    log_info "Building production Docker images..."
    
    # Build backend TypeScript first
    log_info "Building backend TypeScript..."
    cd backend
    npm run build
    cd ..
    
    # Build Docker images with explicit tags
    log_info "Building Docker images with tags..."
    
    # Backend
    log_info "Building backend image..."
    docker build \
        -f backend/Dockerfile.prod \
        -t "$BACKEND_IMAGE:$IMAGE_TAG" \
        -t "$BACKEND_IMAGE:prod" \
        ./backend
    
    # Frontend
    # NEXT_PUBLIC_* vars are inlined at build time; forward them from the
    # environment (loaded from .env) as build-args.
    log_info "Building frontend image..."
    docker build \
        -f frontend/Dockerfile.prod \
        -t "$FRONTEND_IMAGE:$IMAGE_TAG" \
        -t "$FRONTEND_IMAGE:prod" \
        --build-arg "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" \
        --build-arg "NEXT_PUBLIC_MAPLIBRE_STYLE=${NEXT_PUBLIC_MAPLIBRE_STYLE}" \
        --build-arg "NEXT_PUBLIC_UMAMI_WEBSITE_ID=${NEXT_PUBLIC_UMAMI_WEBSITE_ID}" \
        --build-arg "NEXT_PUBLIC_UMAMI_SCRIPT_URL=${NEXT_PUBLIC_UMAMI_SCRIPT_URL}" \
        ./frontend
    
    log_info "Build completed successfully!"
    log_info ""
    log_info "Images created:"
    log_info "  - $BACKEND_IMAGE:$IMAGE_TAG"
    log_info "  - $FRONTEND_IMAGE:$IMAGE_TAG"
    
    # Check if export is requested
    if [ "$1" = "export" ]; then
        export_image
    elif [ "$1" = "export-gz" ]; then
        export_image "gz"
    else
        log_info ""
        log_info "To export images for VPS deployment:"
        log_info "  ./scripts/build-images.sh export      # Creates naturetranquille-images.tar (docker load compatible)"
        log_info "  ./scripts/build-images.sh export-gz  # Creates naturetranquille-images.tar.gz"
    fi
}

# Run main
main "$@"
