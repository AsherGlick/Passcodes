TMPDIR=`mktemp -u`
./git-new-workdir . $TMPDIR gh-pages
git pull
amassite amassite/ $TMPDIR -C
cd $TMPDIR
git add *
git commit
git push
rm -r $TMPDIR