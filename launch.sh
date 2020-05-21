npm run build --prefix frontend;

tmux new -d -s "plo-backend" "npm start --prefix backend";
tmux new -d -s "plo-frontend" "serve -p 3000 frontend/build";

echo "Application launched";
echo "Run `tmux a -t plo-backend` and `tmux a -t plo-frontend` to reattach the detached terminals"
