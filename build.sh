#!/bin/bash

# Build script for MCP Server Docker image

set -e

echo "🚀 Building MCP Server Docker image..."

# Build the Docker image
docker build -t mcp-server:latest .

echo "✅ Docker image built successfully!"
echo "📦 Image: mcp-server:latest"

# Optional: Tag for registry
# docker tag mcp-server:latest your-registry.com/mcp-server:latest

echo "🎯 To run the server:"
echo "   docker-compose up -d"
echo ""
echo "🎯 To push to registry:"
echo "   docker push your-registry.com/mcp-server:latest"
