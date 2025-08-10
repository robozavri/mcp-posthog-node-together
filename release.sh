name=predictx
user=admin
host=193.180.215.35
server_address=admin@193.180.215.35
#domain=talent-radar.work.gd  on https://freedomain.one/

server=false
client=false
admin=false

for i in "$@"; do
case $i in
  --server)
  server=true
  shift
  ;;
  --client)
  client=true
  shift
  ;;
  -s|--start)
  start=true
  shift
  ;;
  -b|--build)
  build=true
  shift
  ;;
  *)
  ;;
esac
done

if [ "$server" == false ] && [ "$client" == false ] && [ "$admin" == false ]; then
  server=true
  client=true
  admin=true
fi



# server build and release
if [ "$server" == true ]; then
  start_script="export NODE_ENV=production && forever start ~/$name/server/dist/server.js"
  if [ -z "$start" ]; then
    start_script="forever restartall"
  fi

  if [ "$build" = "true" ]; then
    cd server
    npm i
    npm run build
    cd ..
  fi

# from sale.hub with pnpm
  # ssh $server_address "mkdir -p $name && cd $name && rm -rf server/dist && rm -rf server/package.json"
  ssh $server_address "mkdir -p $name && cd $name && rm -rf posthog-mcp/dist"
  rsync -avr ./dist $server_address:$name/posthog-mcp
  # rsync -avr ./dist/index.js $server_address:$name/posthog-mcp/dist/index.js
  # rsync -avr ./dist/.env $server_address:$name/posthog-mcp/dist/.env
  # ssh $server_address ". .nvm/nvm.sh && cd ~/$name/server && ${start_script}"

  # rsync -avr server/node_modules $server_address:$name/posthog-mcp
  rsync -avr ./package.json $server_address:$name/posthog-mcp
  # ssh $server_address ". .nvm/nvm.sh && cd ~/$name/server && npm i"
  # ssh $server_address ". .nvm/nvm.sh && cd ~/$name/server && pnpm install"
  # ssh $server_address ". .nvm/nvm.sh && cd ~/$name/server && npm i --legacy-peer-deps --omit=dev"
  # ssh $server_address ". .nvm/nvm.sh && cd ~/$name/server && npm i --legacy-peer-deps && ${start_script}"


fi