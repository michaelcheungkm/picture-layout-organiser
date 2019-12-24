#!/usr/bin/env bash
PORT=$((PORT_BASE+1))

# If directory does not exist, create it and change to it
cd $DATA_DIRECTORY &> /dev/null || { mkdir $DATA_DIRECTORY && echo "Creating directory: $DATA_DIRECTORY" && cd $DATA_DIRECTORY; }
echo "Switching to directory: $wd"

# Serve the files
http-server --cors -p $PORT
