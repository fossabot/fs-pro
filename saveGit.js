const cp = require('child_process');

cp.execSync('git add -A');
console.log("----------- add the files to get ---------");
cp.execSync('git commit -a -m \"Initial Commit\"');
console.log("------------ commited the changes --------")
cp.execSync('git push github master');
console.log("------------- pushed to github ------------");