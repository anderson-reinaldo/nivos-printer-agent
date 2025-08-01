#!/bin/bash

# Navigate to the project directory
cd "$(dirname "$0")/.."

# Build the application
tsc

# Start the application in production mode
node dist/app.js