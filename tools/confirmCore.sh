#! /bin/sh
################################# CONFIRM CORE #################################
# This script runs a diff on the javascript core libraries to make sure that   #
# they are all the same and generating the same hashed values if any are       #
# different is yells and screams it's head off! (or something like that )      #
################################################################################


# ../source/Core/core.js                  # the main file to compare against
# ../source/ChromeExtention/core.js       #
# ../source/Web/amassite/core.js          #
# ../source/FirefoxExtention/data/core.js #

# Get the top level directory for this git repo
GITROOT=`git rev-parse --show-toplevel`


# Diff all of the files to see if any are off
diff $GIT_ROOT/source/Core/core.js $GITROOT/source/ChromeExtention/core.js
diff $GIT_ROOT/source/Core/core.js $GITROOT/source/Web/amassite/core.js
diff $GIT_ROOT/source/Core/core.js $GITROOT/source/FirefoxExtention/data/core.js
