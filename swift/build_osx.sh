#!/usr/bin/env bash

set -e 

echo "This script will build TrustLine on OSX. It will require a password to move frameworks to the correct location."
echo "This script assumes you have carthage and xcodebuild installed."

echo "Building dependencies"
carthage update --platform macOS

echo "Building binary"
xcodebuild -scheme Trustline

echo "Moving frameworks"
sudo mv Carthage/Build/Mac/Criollo.framework /Library/Frameworks/