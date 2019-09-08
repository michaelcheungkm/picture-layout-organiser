echo "Evaluating absolute working directory"
wd=$(cat .config/directory.txt | envsubst)
echo "$wd" > ".config/absoluteDirectory.txt"

bash ./serveData.sh
