#!/bin/bash

# Define color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting last deploy.${NC}"
# Change the current directory to the most recent directory in the "releases" folder
cd "$(ls -td releases/*/ | head -1)"
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to navigate to the most recent directory in the 'releases' folder${NC}"
    exit 1
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

if [ ! -f "$DIR/.env" ]; then
    echo -e "${RED}.env file does not exist in the current directory${NC}"
    exit 1
elif [ ! -r "$DIR/.env" ]; then
    echo -e "${RED}.env file is not readable${NC}"
    exit 1
else
    # Automatically export all variables
    set -a 
    # Get the directory of the current script

    # Load environment variables from the .env file in the script's directory
    source "$DIR/.env"
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to load environment variables from the .env file${NC}"
        exit 1
    fi

    # Stop automatically exporting variables
    set +a 
fi



# Delete the PM2 process with the name specified by the PROJECT_NAME environment variable
pm2 delete ${PROJECT_NAME} || true && pm2 start ecosystem.config.js
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to delete the PM2 process${NC}"
    exit 1
fi

echo -e "${GREEN}Script execution completed.${NC}"