#!/usr/bin/env bash
PORT=8000

# Set working directory variable to that described in directory.txt
wd=$(cat directory.txt | envsubst)

# If directory does not exist, create it and change to it
cd $wd &> /dev/null || { mkdir $wd && echo "Creating directory: $wd" && cd $wd; }
echo "Switching to directory: $wd"

# Serve the files
http-server -p $PORT
