#! /bin/sh
GITROOT=`git rev-parse --show-toplevel`;
echo $GITROOT

# Generate Firefox Icons
rsvg-convert --width 94 --height 94 icon.svg --output "$GITROOT/source/94.png"