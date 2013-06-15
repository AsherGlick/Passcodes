TMPDIR=`mktemp -d`
amassite amassite/ $TMPDIR -C
echo "$TMPDIR"
read -p "Commit Message " MESSAGE 
cd ..
git checkout gh-pages
#git add *
git status
#git commit -m "$MESSAGE"
git checkout master
cd Web