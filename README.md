# pro-fs
[![npm version](https://img.shields.io/static/v1.svg?label=npm%20version&message=1.0.0&color=green)](https://www.npmjs.com/package/pro-fs)
[![LICENSE](https://img.shields.io/static/v1.svg?label=LICENSE&message=MIT&color=green)](https://github.com/AliBasicCoder/pro-fs/blob/master/LICENSE)

pro-fs is a package to work with files and dir more easly

# working with Files
## examles
```js
const { File } = require('pro-fs');
// or
import { File } from 'pro-fs';

// if the file don't exits it will create it
// if it exits it will get all of it's information 
var file = new File('something.txt')
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
### addContentFrom ( path: string )
```js
// to add some file content to the file
this.addContentFrom('$filePath');
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
### clear
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
# working with Dirs
## examles
```js
const { Dir } = require('pro-fs');
// or
import { Dir } from 'pro-fs';

// if the file don't exits it will create it
// if it exits it will get all of it's information 
var dir = new dir('something')
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
   console.log(`the changed file path is ${file.path}`) 
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
fs.foreachDir(function(dir){
    console.log(dir.path)
});
```
### foreachFile(func: (File: File) => any)
```js
// this method will loop throw every single file in the dir
fs.forforeachFile(function(file){
    console.log(file.createdAt.toUTCString());
})
```
### createFile( fileName: string )
```js
// this method will create a file in the dir
fs.createFile('$fileName')
```
### getFile( fileName: string ):File
```js
// this method will loops throw all the files and 
// return the first match
var file = dir.getFile('$fileName')
```
### getFiles( fileName: string ): File[]
```js
// this method will loops throw all the files and 
// return all the matchs as an array
var file = dir.getFiles('$name')
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