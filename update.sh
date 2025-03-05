#!/bin/bash

echo "Starting update: $(date)" >> update.log

echo "Stopping backend..." >> update.log
pm2 stop backend
if [ $? -ne 0 ]; then
    echo "Failed to stop backend" >> update.log
    exit 1
fi

sleep 2  # Ensure the backend has fully stopped

# Proceed with the update process
cd
cd git/PoseidonPath
echo "Pulling latest code..." >> update.log
git pull origin main
if [ $? -ne 0 ]; then
    echo "Failed to pull latest code" >> update.log
    exit 1
fi

# Build Project
echo "Building Project..." >> update.log
make clean
make -j4
if [ $? -ne 0 ]; then
    echo "Build failed" >> update.log
    exit 1
fi

# Start Backend
echo "Starting backend..." >> update.log
pm2 start backend
if [ $? -ne 0 ]; then
    echo "Failed to start backend" >> update.log
    exit 1
fi

echo "Update completed: $(date)" >> update.log
exit 0
