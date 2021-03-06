# fs-pro

[![npm](https://img.shields.io/npm/v/fs-pro.svg)](https://www.npmjs.com/package/fs-pro)
[![GitHub](https://img.shields.io/github/license/AliBasicCoder/fs-pro.svg)](https://github.com/AliBasicCoder/fs-pro/)
[![npm bundle size](https://img.shields.io/bundlephobia/min/fs-pro.svg?style=plastic)](https://bundlephobia.com/result?p=fs-pro@latest)
[![npm](https://img.shields.io/npm/dm/fs-pro.svg)](https://www.npmjs.com/package/fs-pro)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FAliBasicCoder%2Ffs-pro.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FAliBasicCoder%2Ffs-pro?ref=badge_shield)

fs-pro is a package to work with files and dir more easly

## installtion
``` bash
npm i fs-pro
```
## what's new 

### resolver
this class will help you get info of a path

``` js
// this method will get you the info of a file or dir 
var info = resolver.Info('some.txt');
info.isFile === true
// the method will see if the path if the file it
// will return a File else if will return a Dir
var fileOrDir = resolver.resolve('something.txt');

if(fileOrDir instanceof File){
    fileOrDir.write('hello world');
} else {
    fileOrDir.createFile('some.txt');
}
```

## async

now you can use the whole package with promisess
``` js
const { File } = require('fs-pro/async');
// or
import { File } from 'fs-pro/async';

async function run(){
    try {
        var file = new File('some.txt');
        await file.write('hello world');
        console.log(await file.read());
        // => hello world
    } catch(err){
        console.log(err);
    }
}
run()

```

## working with Files
### the file class attr

| attr          | type                                                                                                                          | decription                                                        |
| :----------:  | :------------------------------------------------------------------------------------------------------------------------:    |  :------------------------------------------------------------:   |
| name          | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=String&color=brightgreen)         | the name of the file with out the ext                             |
| path          | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=String&color=brightgreen)         | the absloute path of the file                                     |
| encoding      | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=BufferEncoding&color=red)         | the encoding of the file                                          |
| trak          | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=Boolean&color=blue)               | will update the buffer, content, lines and lineCout attrs if true |  
| buffer        | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=Buffer&color=orange)              | the buffer version of the file                                    |
| content       | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=String&color=brightgreen)         | the content of the file                                           |
| lines         | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=String%5B%20%5D&color=green)      | the lines of the file as an arr                                   |
| lineCount     | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=Number&color=yellow)              | how many lines in the file                                        |
| size          | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=String&color=brightgreen)         | the size of the file as  1kb 1mb and so on                        |
| accessedAt    | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=Date&color=9cf)                   | the date when the file is last accseed                            |
| modifiedAt    | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=Date&color=9cf)                   | the date when the file was last modified                          |
| changedAt     | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=Date&color=9cf)                   | the date when the file was last changed                           |
| createdAt     | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=Date&color=9cf)                   | the date when the filewas created                                 |
| deviceID      | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=Number&color=yellow)              |  the device id                                                    |
| isWriteable   | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=Boolean&color=blue)               | it's true when the file is writeable                              |
| isReadable    | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=Boolean&color=blue)               | it's true when the file is readable                               |
| isExecuteable | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=Boolean&color=blue)               | it's true when the file is executeable                            |
| dirName       | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=String&color=brightgreen)         | the dir name of the file                                          |
| root          | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=String&color=brightgreen)         | the root of the file                                              |
| ext           | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=String&color=brightgreen)         | the extension of the file                                         |
| baseName      | ![<div style="display:none;"></div>](https://img.shields.io/static/v1.svg?label=%20&message=String&color=brightgreen)         | the name with extion of the file                                  |

NOTE: changing any of this attrs will not efect the file
please use the methods bellow

## examples
```js
const { File } = require('fs-pro');
// or
import { File } from 'fs-pro';

// if the file don't exits it will create it
// if it exits it will get all of it's information 
var file = new File('something.txt')

```

### methods mixing
```js
// you can call methods like this
file
    .write('hello wolrd')
    .append('\n test')
    .copyTo('dist')
```
### File.multiple( files: string[] ):File[]
``` js
// getting the files as a File array
var files = File.multiple(['./package.json', './package-lock.json']);
var json = [];
// looping throw them
files.forEach(file => {
    // getting the json of the file
    json.push(JSON.parse(file.content));
});
// console log it
console.log(json);
```
### rename( newName: string )
```js
// it will rename the file
file.rename('$newName')
```
### write ( toWrite: Buffer | String )
```js
// to write to it
file.write('hello world');
// or
file.write(new Buffer('hello world'))
```
### append ( toAppend: Buffer | String )
```js
// to append
file.append('hello world');
// or
file.append(new Buffer('hello world'))
```
### read()
``` js
// to read
var content = file.read();
```
### Lines()
``` js
// to get the lines as an array
var lines = file.Lines();
```
### getContentFrom(dist: string | File | Buffer): void
```js
// this method will copy some file content to the file
file.getContentFrom('$filePath');
```
### appendContentFrom ( path: string )
```js
// to add some file content to the file
file.appendContentFrom('$filePath');
```
### readLines ((lineText, lineNumber) => any)
```js
// to loop throw it's lines
file.readLines(function(lineText, lineNumber){
    // removes the a's from even lines 
    // and emoves the b's from od lines
    if(lineNumber % 2 === 0){
        return lineText.replace(/a/g, '');
    } else {
        return lineText.replace(/b/g, '');
    }
})
```
### clear( )
``` js
// to clear the files
file.clear();
```
### copy ( dist: string )
```js
// to copy it with a different name
file.copy('$dist/$newName.ext')
```
### copyTo( dist: string )
```js
// to copy it with the same name
file.copyTo('$dist');
```
### move( dist: string )
``` js
// to move it with the same name
file.move('$dist/$newName.ext')
```
### moveTo( dist: string )
``` js
// to move it with a different name
file.moveTo('$dist')
```
### refresh()
```js
// to refresh file data
file.refresh();
```
### relativePath()
```js
// will return the realtive path
var rPath = file.relativePath()
```
### fileStatus
```js
// to get the file status
const { accessedAt,
        modifiedAt,
        changedAt,
        createdAt,
        deviceID } = file
// NOTE: if the file is changed without using any of the methods
// you should call
file.editStatus()
```
### chmod( code: number )
```js
// to change file access permition
file.chmod(code);
```
### testAccess( permistion: 'execute' | 'write' | 'read' | 'all' )
```js
// to test access permition
file.testAccess(permistion);
```
### watch((currentStatus, prevStatus) => any)
```js
// to watch th file
file.watch((currentStatus, prevStatus) => {
    // wathever you want
})
```
### <div style="color:#dcdcaa;display:inline">delete</div>()
```js
// to delete the file
file.delete();
```
### <div style="color:#dcdcaa;display:inline">parent</div>(<div style="color:#9cdcfe;display:inline">parent</div>: <div style="color:#52c94e;display:inline">Dir</div> | <div style="color:#52c94e;display:inline">string</div>)
```js
// to move the file to a dir 
const { File, Dir } = require('fs-pro');

var file = new File('something.txt');

// a way
var dir = new Dir('test')

file.parent(dir);

// another way
file.parent('test');

```
### parentDir()
``` js
// this method will return the parent dir of the file
// as an Dir object every thing about that below
var dir = file.parentDir();
```
### convertEncoding( newEncoding )
``` js
file.convertEncoding('ascii');
```
## working with Dirs

## Dir class attr
| attr       | type         | decription                                 |
| :--------: | :----:       |  :--------:                                |
| files      | any          | an array of the dir and files i n the dir  |
| path       | string       | the absoulte path of the path              |
| name       | string       | the name of the dir                        |
| size       | string       | the size of the dir                        | 
| accessedAt | Date         | the date when the dir is last accssed      |
| modifiedAt | Date         | the date when the dir is last moddifed     |
| changedAt  | Date         | the date when the dir is last changed      |
| createdAt  | Date         | the date when the dir is created           |
| deviceID   | number       | the device ID                              |
## example
```js
const { Dir } = require('fs-pro');
// or
import { Dir } from 'fs-pro';

// if the file don't exits it will create it
// if it exits it will get all of it's information 
var dir = new dir('something')
```
### method mixing
```js
// just as file you can mix about 75% of the methods below
// the 25% is methods for delete and to get a file and so on
// you should alawas return the file or it will delete it  
dir
    .foreachFile(file => { console.log(file.path); return file; })
    .copyTo('dist') // and so on
```
### Dir.multiple( dirs: string[] ): Dir[]
```js
var dirs = Dir.multiple(['test', 'test1', 'test2']);

dirs.forEach(dir => console.log(dir.path));
```
### delete( )
```js
// it will delete the dir no matter it's empty or not
dir.delete()
```
### clear()
```js
// it will delete every thing in the dir except the dir
dir.clear()
```
### copyTo(dist: string) 
```js
// it will copy the dir to the dist
dir.copyTo('$dist')
```
### moveTo(dist: string)
``` js
// it will move the dir to the dist
dir.moveTo('$dist')
```
### copyFilesTo( dist: string )
``` js
// it will copy it's files and dir to the dist
// BUT not the dir
dir.copyFilesTo('$dist') 
``` 
### copyFilesFrom( dist: string )
```js
// it will get the files from anther dir and copy it
// to the dir
dir.copyFilesFrom('$dist');
```
### moveFilesTo( dist: string )
``` js
// it will move it's files and dir to the dist
// BUT not the dir
dir.moveFilesTo('$dist'); 
``` 
### moveFilesFrom( dist: string )
```js
// it will get the files from anther dir and move it
// to the dir
dir.copyFilesFrom('$dist');
```
### deleteContainer()
``` js
// this method will delete the dir BUT it will 
// leaves the file alone or with other words
// it will move every file and dir to ./
dir.deleteContainer();
```
### rename( newName: string  )
```js
// it will rename the dir
dir.rename('$newName')
```
### watch( callback :(file: File) => any )
```js
// it will watch every single file in the dir
dir.watch(changedFile => {
   // the function will path the hole file that is changed
   console.log(`the changed file path is ${changedFile.path}`) 
});
```
### filter( func: ( fileOrDir: File | Dir ) => any )
```js
// this method will pass in evry single thing in the 
// dir no mater it's a file or a dir
dir.filter(function(thing){
    // filtering any thing that it's name is less than 4 char
    if(thing.name.length > 3){
        return true
    } else {
        return false
    }
});
```
### foreach( func: ( fileOrDir: File | Dir ) => any )
```js
// this method will loop throw evert file or dir in the main
// dir not any thing in it's sub dir
dir.foreach(function(thing){
    console.log(thing.name);
});
```
### foreachDir(func: (dir: Dir) => any)
```js
// this method will loop throw every single dir 
// in the dir
dir.foreachDir(function(dir){
    console.log(dir.path)
});
```
### foreachFile(func: (File: File) => any)
```js
// this method will loop throw every single file in the dir
dir.forforeachFile(function(file){
    console.log(file.createdAt.toUTCString());
})
```
### createFile( fileName: string )
```js
// this method will create a file in the dir
var newFile = dir.createFile('$fileName'); // and you can work with file as you want

newFile.write('hello world');
```
### createDir( dirname: stirng )
```js
var newDir = dir.createDir('new_dir');

var newDirPath = newDir.path;

console.log(newDirPath);
```
### getFile( fileName: string ):File
```js
// this method will loops throw all the dir and 
// return the first match
var file = dir.getFile('$fileName')
```
### getFiles( fileName: string ): File[]
```js
// this method will loops throw all the files and 
// return all the matchs as an array
var files = dir.getFiles('$name')
```
### getDir( dirName:string )
```js
// this method will loops throw all the Dirs and 
// return all the matchs as an array
var dir = dir.getDir('$name')
```
### getDirs( dirName:string )
```js
// this method will loops throw all the Dirs and 
// return all the matchs as an array
var dirs = dir.getDirs('$name')
```
### deleteEvery( match: string )
```js
// this method will delete what every will be passed in
// for example
dir.deleteEvery('*.txt'); // will delete every single text file in the dir

dir.deleteEvery('dumy') // will delete every single thing called dumy
```
### updateStatus( )
```js
// will update the dir status
dir.updateStatus();
const { accessedAt,
        modifiedAt,
        changedAt,
        createdAt,
        deviceID } = dir
```
### relativePath( )
```js
// will return the realtive path
var rPath = dir.relativePath()
```

## License

MIT License

Copyright (c) 2019 AliBasicCoder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FAliBasicCoder%2Ffs-pro.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FAliBasicCoder%2Ffs-pro?ref=badge_large)