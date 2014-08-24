#! /bin/sh
##################################### ABOUT ####################################
# This file takes the svg 'icon.svg' and generates png images of different     #
# sizes for the different passcodes applications                               #
################################################################################


GITROOT=`git rev-parse --show-toplevel`;

# Generate Android Icons
rsvg-convert --width 512 --height 512 icon.svg --output "$GITROOT/source/Android/ic_launcher-web.png"
rsvg-convert --width 94 --height 94 icon.svg --output "$GITROOT/source/Android/res/drawable-xhdpi/ic_launcher.png"
rsvg-convert --width 72 --height 72 icon.svg --output "$GITROOT/source/Android/res/drawable-hdpi/ic_launcher.png"
rsvg-convert --width 48 --height 48 icon.svg --output "$GITROOT/source/Android/res/drawable-mdpi/ic_launcher.png"
rsvg-convert --width 36 --height 36 icon.svg --output "$GITROOT/source/Android/res/drawable-ldpi/ic_launcher.png"

# Generate Chrome Addon Icons
rsvg-convert --width 16 --height 16 icon.svg --output "$GITROOT/source/ChromeExtention/icon-16.png"
rsvg-convert --width 48 --height 48 icon.svg --output "$GITROOT/source/ChromeExtention/icon-48.png"
rsvg-convert --width 128 --height 128 icon.svg --output "$GITROOT/source/ChromeExtention/icon-128.png"

# TODO: Generate favicons