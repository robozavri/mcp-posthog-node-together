#!/bin/bash

# Deployment script for MCP Server on remote server

set -e

REMOTE_HOST="${1:-your-remote-server.com}"
REMOTE_USER="${2:-root}"
REMOTE_PATH="/opt/mcp-server"

echo "🚀 Deploying MCP Server to $REMOTE_HOST..."

# Create remote directory
echo "📁 Creating remote directory..."
ssh $REMOTE_USER@$REMOTE_HOST "mkdir -p $REMOTE_PATH"

# Copy files to remote server
echo "📤 Copying files to remote server..."
scp docker-compose.yml $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/
scp -r caddy/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/
scp env.example $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/.env

# Build and start on remote server
echo "🔨 Building and starting services on remote server..."
ssh $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_PATH && \
    docker-compose pull && \
    docker-compose up -d --build"

echo "✅ Deployment completed!"
echo "🌐 MCP Server should be available at:"
echo "   - Direct: http://$REMOTE_HOST:3000"
echo "   - Via Caddy: http://$REMOTE_HOST:8080"
echo ""
echo "📊 Check status:"
echo "   ssh $REMOTE_USER@$REMOTE_HOST 'cd $REMOTE_PATH && docker-compose ps'"
