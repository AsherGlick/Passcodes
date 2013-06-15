TMPDIR=`mktemp -d`
amassite amassite/ $TMPDIR -C
echo "$TMPDIR"
cd ..
git checkout gh-pages
