export PORT_BASE=8008
export DATA_DIRECTORY=~/.plo/

bash ./serveData.sh & nodemon index.js &
