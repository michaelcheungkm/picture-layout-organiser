export PORT_BASE=8008
export DATA_DIRECTORY=~/.plo/

# Export
if [ $1 == "--export" ]; then
  # Only proceed if this will not override an existing export
  if test -f "export.zip"; then
    echo "Cannot create export as export.zip already exists"
    exit 1
  fi

  # Only proceed if this does not override an existing directory
  mkdir export
  if [ $? != 0 ]; then
    echo "Cannot create export as export working directory already exists"
    exit 2
  fi

  # At this point there are no name clashes
  cd export
  mongoexport --collection=users --db=pictureLayoutOrganiser --out=users.json;
  mongoexport --collection=content --db=pictureLayoutOrganiser --out=content.json;
  cp -r "$DATA_DIRECTORY" "./media";
  cd ..;
  zip -r "export.zip" "export"
  echo "Exported to plo-export.zip";

  # Cleanup
  rm -rf "export/"

  exit 0;
fi


# Import
if [ $1 == "--import" ]; then
  echo "will import $2";
  exit 0;
fi


# Default run
bash ./serveData.sh & nodemon index.js &
