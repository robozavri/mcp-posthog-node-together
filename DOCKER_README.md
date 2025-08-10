# MCP Server Docker Deployment

ეს README აღწერს როგორ გადავიტანოთ MCP Server Docker კონტეინერში და დავუკავშირდეთ PostHog-ის Caddy-ს.

## 🏗️ არქიტექტურა

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MCP Client    │    │   Caddy Proxy   │    │  MCP Server    │
│                 │────│                 │────│                 │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              │
                       ┌─────────────────┐
                       │   PostHog       │
                       │   Network       │
                       └─────────────────┘
```

## 📋 მოთხოვნები

- Docker და Docker Compose
- Remote server PostHog-ით გაშვებული
- SSH წვდომა remote server-ზე

## 🚀 სწრაფი დაწყება

### 1. ლოკალური Build

```bash
# Build Docker image
./build.sh

# ან ხელით
docker build -t mcp-server:latest .
```

### 2. Remote Server-ზე Deploy

```bash
# Deploy to remote server
./deploy.sh your-remote-server.com root

# ან ხელით
scp docker-compose.yml root@your-remote-server.com:/opt/mcp-server/
scp -r caddy/ root@your-remote-server.com:/opt/mcp-server/
ssh root@your-remote-server.com "cd /opt/mcp-server && docker-compose up -d"
```

## ⚙️ კონფიგურაცია

### Environment Variables

```bash
# Copy example file
cp env.example .env

# Edit configuration
nano .env
```

### Caddy Configuration

Edit `caddy/Caddyfile` to match your domain:

```caddy
mcp.yourdomain.com {
    reverse_proxy mcp-server:3000
    # ... other settings
}
```

### PostHog Network

Make sure the network name in `docker-compose.yml` matches your PostHog setup:

```yaml
networks:
  posthog-network:
    external: true
    name: posthog_default  # Change this to match your setup
```

## 🔧 სერვისები

### MCP Server
- **Port**: 3000
- **Health Check**: `/manifest` endpoint
- **Dependencies**: PostHog network

### Caddy Proxy
- **Ports**: 80 (HTTP), 443 (HTTPS)
- **Function**: Reverse proxy to MCP Server
- **CORS**: Enabled for MCP clients

## 📊 მონიტორინგი

### Status Check

```bash
# Check running containers
docker-compose ps

# Check logs
docker-compose logs mcp-server
docker-compose logs caddy-mcp

# Health check
curl http://localhost:3000/manifest
```

### Troubleshooting

```bash
# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Check network connectivity
docker network ls
docker network inspect posthog_default

# View container details
docker inspect mcp-server
```

## 🌐 Endpoints

- **MCP Server**: `http://your-domain:3000`
- **Via Caddy**: `http://your-domain:8080` ან `https://your-domain:8443`
- **Manifest**: `http://your-domain:3000/manifest`
- **SSE**: `http://your-domain:3000/mcp/events`

## 🔒 უსაფრთხოება

- Non-root user in container
- Health checks enabled
- CORS configured for MCP clients
- Network isolation via Docker networks

## 📝 შენიშვნები

1. **Network Name**: Make sure `posthog_default` matches your actual PostHog network
2. **Ports**: Adjust ports if they conflict with existing services
3. **Domain**: Update Caddyfile with your actual domain
4. **SSL**: Caddy will auto-generate SSL certificates for HTTPS

## 🆘 Support

თუ პრობლემები გაქვთ:

1. Check Docker logs: `docker-compose logs`
2. Verify network connectivity: `docker network inspect`
3. Test endpoints manually: `curl http://localhost:3000/manifest`
4. Check PostHog network: `docker network ls | grep posthog`
