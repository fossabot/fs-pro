# fs-pro
[![npm version](https://img.shields.io/static/v1.svg?label=npm%20version&message=1.0.8&color=green)](https://www.npmjs.com/package/fs-pro)
[![LICENSE](https://img.shields.io/static/v1.svg?label=LICENSE&message=MIT&color=green)](https://github.com/AliBasicCoder/fs-pro/blob/master/LICENSE)

fs-pro is a package to work with files and dir more easly

# installtion
```
npm i fs-pro
```

# working with Files
## the file class attr

| attr       | type         | decription                                 |
| :--------: | :----:       |  :--------:                                |
| name       | string       | the name of the file with out the ext      |
| path       | string       | the absloute path of the file              |
|  enconding | string       |      the encoding of the file              |
| buffer     | Buffer       | the buffer version of the file             |
| content    | string       | the content of the file                    |
| lines      | string[]     | the lines of the file as an arr            |
| lineCount  | number       | how many lines in the file                 |
| size       | string       | the size of the file as  1kb 1mb and so on |
| accessedAt | Date         | the date when the file is last accseed     |
| modifiedAt | Date         | the date when the file was last modified   |
| changedAt  | Date         | the date when the file was last changed    |
| createdAt  | Date         | the date when the filewas created          |
| deviceID   | number       | the device id                              |
| isWriteable| boolean      | it's true when the file is writeable       |
| isReadable | boolean      | it's true when the file is readable        |
| isExecuteable |  boolean  | it's true when the file is executeable     |
| dirName    | string       | the dir name of the file                   |
| root       | string       | the root of the file                       |
| ext        | string       | the extension of the file                  |
| baseName   | string       | the name with extion of the file           |

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
### clear()
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
### chmod( code: 'none' | 'read write execute' | 'read write' | 'all' | 'read execute' | 'write execute' | 'read only' | 'write only' | 'execute only' | number )
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
### delete()
```js
// to delete the file
file.delete();
```
### parent( parent: Dir | string )
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
# working with Dirs
## Dir class attr
| attr       | type         | decription                                 |
| :--------: | :----:       |  :--------:                                |
| files      | any[]        | an array of the dir and files i n the dir  |
| path       | string       | the absoulte path of the path              |
| name       | string       | the name of the dir                        |
| size       | string       | the size of the dir                        | 
| accessedAt | Date         | the date when the dir is last accssed      |
| modifiedAt | Date         | the date when the dir is last moddifed     |
| changedAt  | Date         | the date when the dir is last changed      |
| createdAt  | Date         | the date when the dir is created           |
| deviceID   | number       | the device ID                              |
## examples
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
dir
    .foreachFile(function(file){
        console.log(file.path)
    })
    .copyTo('dist') // and so on
```
### delete()
```js
// it will delete the dir no matter it's empty or not
dir.delete()
```
### clear()
```js
// it will delete every thing in the dir except the dir
dir.clear()
```
### copyTo( dist: string ) 
```js
// it will copy the dir to the dist
dir.copyTo('$dist')
```
### moveTo( dist: string )
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
### rename( newName: string )
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
### updateStatus()
```js
// will update the dir status
dir.updateStatus();
const { accessedAt,
        modifiedAt,
        changedAt,
        createdAt,
        deviceID } = dir
```
### relativePath()
```js
// will return the realtive path
var rPath = dir.relativePath()
```

# License

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