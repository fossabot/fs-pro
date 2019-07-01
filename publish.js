var File = require('./out/src/index').File;

var file = new File('./package.json');

var README = new File('./README.md');

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

README.write(README.read().replace('/* :ver: */', newV));


console.log(num1, num2, num3);

const cp = require('child_process');

const compiled = () => {
    cp.exec('tsc test --outdir out ', function (err, stdout, sterr) {
        if (err) {
            console.log(sterr);
            console.log("--------------- failed ---------------------");
            restore();
            return
        }
        console.log(stdout);
        console.log("---------- compiled the files ------------");
        test();
    });
}

const test = () => {
    cp.exec('npm test', function (err, stdout, sterr) {
        if (err) {
            console.log(sterr);
            console.log("--------------- failed ---------------------");
            restore();
            return
        }
        console.log(stdout);
        console.log('------------ tested ----------------------');
        go();
    });
}

function restore() {

    var newV = `${prev.num1}.${prev.num2}.${prev.num3}`

    README.write(
        README.read()
            .replace(`?label=npm%20version&message=${num1}.${num2}.${num3}`,
                `?label=npm%20version&message=/* :ver: */`)
    );

    json.version = newV;

    file.write(JSON.stringify(json));

    console.log("--------------- failed ---------------------");
}

function go() {
    try {
        cp.execSync('git add -A');
        console.log("----------- add the files to get ---------");
        cp.execSync('git commit -a -m \"Initial Commit\"');
        console.log("------------ commited the changes --------")
        cp.execSync('git push github master');
        console.log("------------- pushed to github ------------");
        cp.execSync('npm publish');
        console.log("------------- succesfly published ----------");
    } catch (err) { restore() }
}

compiled();