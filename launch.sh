npm run build --prefix frontend;

screen -S "plo-backend" -d -m npm start --prefix backend;
screen -S "plo-frontend" -d -m serve -p 3000 frontend/build;

echo "Application launched";
echo "Run screen -r \"plo-backend\" and screen -r \"plo-frontend\" to reattach the detached terminals"
