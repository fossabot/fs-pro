console.log(process.argv);

const cp = require('child_process');

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

async function go() {
    try {
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

        await compiled();

        await test();

        add();

        commit();

        if (process.argv[3] !== '--no-push') {
            Push();
        }

        if (process.argv[2] !== '--save-git') {
            publish(process.argv[2]);
        } else {
            var newV = `${prev.num1}.${prev.num2}.${prev.num3}`

            json.version = newV;

            file.write(JSON.stringify(json));

            commit();
        }

    } catch (err) {
        console.log(err);
        restore()
    }
}


const compiled = () => {
    return new Promise((res, rej) => {
        cp.exec('tsc test --outdir out ', function (err, stdout, sterr) {
            if (err) {
                console.log(sterr);
                rej();
                return
            }
            cp.execSync('cd async && tsc index --outdir out && cd ..');
            console.log("---------- compiled the files ------------");
            res();
        });
    })
}

const test = () => {
    return new Promise((res, rej) => {
        cp.exec('npm test', function (err, stdout, sterr) {
            if (err) {
                console.log(sterr);
                rej();
                return
            }
            console.log(stdout);
            console.log('------------ tested ----------------------');
            res();
        });
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


function Push() {
    cp.execSync('git push github master');
    console.log("------------- pushed to github ------------");
}

function add() {
    cp.execSync('git add -A');
    console.log("----------- add the files to get ---------");
}

function commit() {
    cp.execSync('git commit -a -m \"Initial Commit\"');
    console.log("------------ commited the changes --------")
}

function publish(tag) {
    README.write(README.read().replace('/* :ver: */', newV));
    tag = tag.replace('--', '');
    if (tag) {
        cp.execSync(`npm publish --tag ${tag}`);
    } else {
        cp.execSync(`npm publish`);
    }
    console.log("------------- succesfly published ----------");
}
go();