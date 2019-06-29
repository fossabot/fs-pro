var File = require('./out/src/index').File;

var file = new File('./package.json');

var json = JSON.parse(file.read());

var regex = /([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{1,2})/;

var match = json.version.match(regex);

var num1 = Number(match[1]);
var num2 = Number(match[2]);
var num3 = Number(match[3]);

var prev = { num1, num2, num3 };

num3++;
if (num3 > 9) {
    num3 = 0;
    num2++;
}
if (num2 > 9) {
    num2 = 0;
    num3++;
}

var newV = `${num1}.${num2}.${num3}`

json.version = newV;

file.write(JSON.stringify(json));

console.log(num1, num2, num3);

const cp = require('child_process');

cp.exec('npm test', function (err, stdout, sterr) {
    if (err) {
        process.stdout.write(sterr);
        console.log('------------- failed ------------------')
        return
    }
    process.stdout.write(stdout);
    try {
        go();
    } catch (err) {
        console.log('------------- failed ------------------')

        var newV = `${prev.num1}.${prev.num2}.${prev.num3}`

        json.version = newV;

        file.write(JSON.stringify(json));
    }
});
function go() {
    console.log('------------ tested ----------------------');
    cp.execSync('tsc test --outdir out ');
    console.log("---------- compiled the files ------------");
    cp.execSync('git add -A');
    console.log("----------- add the files to get ---------");
    cp.execSync('git commit -a -m \"Initial Commit\"');
    console.log("------------ commited the changes --------")
    cp.execSync('git push github master');
    console.log("------------- pushed to github ------------");
    cp.execSync('npm publish');
    console.log("------------- succesfly published ----------");
}