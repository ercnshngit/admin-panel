#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e
export LC_ALL=C


set -a # automatically export all variables
source .env
set +a # stop automatically exporting variables

# Set the build directory
export BUILD_DIR="releases/$(date +'%Y%m%d%H%M%S')"

# Define colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Define messages
SUCCESS_MSG="${GREEN}Operation completed successfully.${NC}"
FAILURE_MSG="${RED}Operation failed.${NC}"

# Define functions
create_directory() {
    local dir=$1
    mkdir -p $dir
    echo -e $SUCCESS_MSG
}

change_directory() {
    local dir=$1
    cd $dir
    echo -e $SUCCESS_MSG
}

remove_old_releases() {
    ls -t | tail -n +3 | xargs rm -rf --
    echo -e $SUCCESS_MSG
}

copy_files() {
    local src=$1
    local dest=$2
    cp -f -r $src $dest
    echo -e $SUCCESS_MSG
}

run_build() {
    NODE_OPTIONS="--max_old_space_size=1024" npm run build
    echo -e $SUCCESS_MSG
}

# Run the 'erc-build' script
echo -e "${GREEN}Running the 'erc-build' script...${NC}"
create_directory "releases"
change_directory "releases"
remove_old_releases

FILE_COUNT=$(ls -1 | wc -l) 
if [ "$FILE_COUNT" -le 1 ]; then 
    export LAST_DEPLOY_FOLDER=""
else 
    export LAST_DEPLOY_FOLDER="releases/$(ls -t | head -n +1)/"
fi 
echo ${LAST_DEPLOY_FOLDER} 
cd ../ 

run_build

# Run the 'copy-files' script
echo -e "${GREEN}Running the 'copy-files' script...${NC}"
copy_files "./${BUILD_DIR}/static" "./${BUILD_DIR}/standalone/${BUILD_DIR}"
copy_files "./public" "./${BUILD_DIR}/standalone"
copy_files "./ecosystem.config.js" "./${BUILD_DIR}/standalone"
copy_files "./private_key.pem" "./${BUILD_DIR}/standalone"

# perl -i -pe '
#     s/
#         \\.catch\\(err\\) => \\\\{/
#         \\.then\\(\\) => \\\\{  # Escape the braces here
#             \\n      console.log\\(\"Server started\"\\);
#             \\n    if\\(process.send\\)\\{
#                 \\n        process.send\\(\"ready\"\\);
#                 \\n         process.send\\(\"ready\"\\);
#                 \\n      \\}
#             \\n    \\}
#         \\n    .catch\\(err\\) => \\\\{  # And here
#     /gx' ./${BUILD_DIR}/standalone/server.js
# echo -e $SUCCESS_MSG
# Run the 'erc-start' script
echo -e "${GREEN}Running the 'erc-start' script...${NC}"

find "./${BUILD_DIR}" -depth -mindepth 1 -maxdepth 1 ! -name 'standalone' -exec rm -rf {} \;
mv  "./${BUILD_DIR}/standalone/"* "./${BUILD_DIR}/"
mv  "./${BUILD_DIR}/standalone/.env" "./${BUILD_DIR}/"

change_directory "./${BUILD_DIR}"

create_directory "logs"

