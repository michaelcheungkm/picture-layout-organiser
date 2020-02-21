npm run build --prefix frontend;

npm start --prefix backend &>/dev/null &
serve -p 3000 frontend/build &>/dev/null &
