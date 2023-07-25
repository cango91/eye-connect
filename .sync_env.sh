#!/bin/bash

# Replace 'YOUR_APP_NAME' with your actual Heroku app name
APP_NAME="eye-connect"

# Path to your .env file
ENV_FILE="src/.env"

# Read each line from the .env file and set the environment variable in Heroku
while IFS= read -r line || [[ -n "$line" ]]; do
    # Check if the line is not empty and is not a comment (starts with '#')
    if [[ -n "$line" && ! "$line" =~ ^\# ]]; then
        # Split the line into key and value
        key=$(echo "$line" | cut -d= -f1)
        value=$(echo "$line" | cut -d= -f2-)
        
        # Set the environment variable in Heroku
        heroku config:set "$key=$value" --app "$APP_NAME"
        
        # Print the environment variable that was set (for visual confirmation)
        echo "Set $key=$value in Heroku."
    fi
done < "$ENV_FILE"