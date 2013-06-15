TMPDIR=`mktemp -d`
amassite amassite/ $TMPDIR -C
cd ..
git checkout ghpages
