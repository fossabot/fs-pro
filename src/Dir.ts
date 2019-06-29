import File from './File';
import * as fs from 'fs';
import * as path from 'path';
import { convertSize } from 'convert-size';

type DirWatchCallBack = (file: File) => any;
type callback = (file: File) => any;

export default class Dir {
    files: any[] = [];
    path: string;
    name: string;
    size: string;
    accessedAt: Date;
    modifiedAt: Date;
    changedAt: Date;
    createdAt: Date;
    deviceID: number;
    trak: boolean;

    constructor(name: string, trak: boolean = true) {
        this.path = path.resolve(name);
        this.name = path.parse(this.path).base;
        this.trak = trak;
        if (fs.existsSync(this.path)) {
            var arr = fs.readdirSync(this.path);
            for (let item of arr) {
                // @ts-ignore
                var p = path.join(name, item);
                if (fs.lstatSync(p).isDirectory()) {
                    this.files.push(new Dir(p, trak))
                } else {
                    var file = new File(p, trak);
                    this.files.push(file);
                }
            }
        } else {
            fs.mkdirSync(this.path);
        }
        this.updateStatus();
    }
    reTrak(): void {
        this.foreachFile(file => file.trak = true);
        this.trak = false
    }
    unTrak(): void {
        this.foreachFile(file => file.trak = false);
        this.trak = false
    }
    /**
    * @param dirs the dirs names
    */
    public static multiple(dirs: string[], trak: boolean = true): Dir[] {
        let arr = [];
        for (let item of dirs) {
            arr.push(new Dir(item, trak));
        }
        return arr;
    }

    private updateStatus() {
        var status = fs.lstatSync(this.path);
        this.size = convertSize(status.size);
        this.accessedAt = status.atime;
        this.modifiedAt = status.mtime;
        this.changedAt = status.ctime;
        this.createdAt = status.birthtime;
        this.deviceID = status.dev;
    }
    /**
     * this method will move the files inside the dir to 
     * @param dist the dist
     */
    moveFilesTo(dist) {
        this.copyFilesTo(dist);
        this.delete();
        fs.mkdirSync(this.path);
    }
    /**
     * will move the file from the dist to 
     * the dir
     * @param dist the dist you want to getthe files from
     */
    moveFilesFrom(dist) {
        var dir = new Dir(dist);
        dir.moveFilesTo(this.path);
    }
    /**
     * will copy the file from the dist to the dir
     * @param dist the dist you want to get the files from
     */
    copyFilesFrom(dist) {
        var dir = new Dir(dist);
        dir.copyFilesTo(this.path);
    }
    /**
     * will loop throw every single file in the dir
     * and apply the callback to it
     * @param func the callback function
     */
    foreachFile(func: callback): Dir {
        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i] instanceof Dir) {
                this.files[i].foreachFile(func);
            } else {
                this.files[i] = func(this.files[i]);
            }
        }
        this.files.filter(item => item != null);
        this.updateStatus();
        return this;
    }
    /**
     * this method will loop throw every single 
     * dir in the dir
     * @param func the callback function and the method will
     * pass in to it every single dir
     */
    foreachDir(func: (dir: Dir) => any): Dir {
        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i] instanceof Dir) {
                this.files[i].foreachDir(func);
                this.files[i] = func(this.files[i]);
            }
        }
        this.updateStatus();
        return this;
    }
    /**
     * this method will loop throw the files in the first level
     * or in the dir not in any in it's sub dirs
     * @param func a function that will passed in to it a file or a dir
     */
    foreach(func: (fileOrDir: File | Dir) => any): Dir {
        for (let i = 0; i < this.files.length; i++) {
            this.files[i] = func(this.files[i]);
        }
        this.updateStatus();
        return this;
    }
    /**
     * this method wil delete the dir no mater it's empty or not
     */
    delete(): void {
        this.foreach(thing => thing.delete());
        try { fs.rmdirSync(this.path) } catch (err) { }
        this.files = [];
        this.size = convertSize(0);
    }
    /**
     * this method will delete the dir but not the files
     * or with other words it will just move all 
     * the files a level up
     */
    deleteContainer() {
        this.moveFilesTo('./');
        this.delete();
    }
    /**
     * this method will create a file in the dir
     * @param name the name of the file
     */
    createFile(name): File {
        var newFile = new File(path.join(this.name, name), this.trak);
        this.files.push(newFile);
        this.updateStatus();
        return newFile;
    }
    /**
     * the method will get the file with the the name
     * if there is a lot of files with the same name
     * the method will return the first match
     * @param name the of the file you want to get
     */
    getFile(name): File {
        var files: File[];
        this.foreachFile(function (file) {
            if (file.baseName === name) {
                files.push(file);
            }
            return file;
        });
        return files[0];
    }
    /**
     * this method will get all of the files with the name
     * @param name the name
     */
    getFiles(name): File[] {
        var files = [];
        this.foreachFile(function (file) {
            if (file.baseName === name) {
                files.push(file);
            }
            return file;
        });
        return files;
    }
    /**
     * will delete a file with name that have been passed in
     * and if there multimple files with the same name will
     * delete the first match
     * @param name the name of the file you want to delete
     */
    deleteFile(name): Dir {
        var file = this.files.filter(item => item.baseName === name)[0];
        this.files = this.files.filter(item => item === file);
        file.delete();
        this.updateStatus();
        return this;
    }
    /**
     * this method will delete every thing with the name
     * passed in BUT if the name is something like *.txt
     * it delete every single FILE that mathes the name
     * @param name the name you want to delete
     */
    deleteEvery(name: string): Dir {
        if (name.indexOf('*') !== -1) {
            var regex = /\*/g;
            name = name.replace(/\./g, '\\.');
            var match = regex.exec(name);
            var pI = 0;
            var str = '';
            while (match) {
                str += name.substring(pI, match['index']);
                str += '[^.]';
                pI = match['index'] + 1;
                match = regex.exec(name);
            }
            str += name.substring(pI);
            var newRegex = new RegExp(str, 'g');
            this.foreachFile(file => {
                if (newRegex.test(file.baseName)) {
                    file.delete();
                }
            });
        } else {
            this.filter(thing => thing.name !== name);
        }
        this.updateStatus();
        return this;
    }
    /**
     * this method will move the dir and every thing in it
     * to th dist
     * @param dist the dist that you want to move the file to it
     */
    moveTo(dist): Dir {
        var thisDir = new Dir(this.name);
        this.copyTo(dist);
        thisDir.delete();
        this.path = path.resolve(path.join(dist, this.name));
        this.updateStatus();
        return this;
    }
    /**
     * this method will copy the dir to the dist passed in
     * @param dist the dist
     */
    copyTo(dist): Dir {
        var p = path.resolve(path.join(dist, this.name));
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
        this.copyFilesTo(path.join(dist, this.name));
        return this;
    }
    /**
     * this method will copy the files in the dir
     * and NOT the dir it self to the dist passed in
     */
    copyFilesTo(dist): Dir {
        var p = path.resolve(dist);
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
        this.updateStatus();
        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i] instanceof Dir) {
                this.files[i].copyFilesTo(path.join(dist, this.files[i].name));
            } else {
                this.files[i].copyTo(dist);
            }
        }
        this.updateStatus();
        return this;
    }
    /**
     * this method renames the dir to the name passed in
     * @param newName the new name of the dir
     */
    rename(newName): Dir {
        fs.renameSync(this.path, path.resolve(newName));
        this.name = newName;
        this.path = path.resolve(newName);
        this.updateStatus();
        return this;
    }
    /**
     * this method delete every thing in the dir and
     * NOT the dir it self
     */
    clear(): Dir {
        this.foreach(thing => thing.delete());
        this.files = [];
        this.size = convertSize(0);
        return this;
    }
    /**
     * this method return the relative path of the dir
     */
    relativePath(): string {
        return path.relative('.', this.path);
    }
    /**
     * this method will create a dir inside the dir
     * @param name the name of the dir you want to create
     */
    createDir(name): Dir {
        var newDir = new Dir(path.join(this.name, name), this.trak);
        this.files.push(newDir);
        this.updateStatus();
        return newDir;
    }
    /**
     * this method will find the dirs that matches the 
     * name passed in and return the first one 
     * @param name the name of the dir you want to get
     */
    getDir(name): Dir {
        var dirs: Dir[];
        this.foreachDir(function (dir) {
            if (dir.name === name) {
                dirs.push(dir);
            }
            return dir;
        });
        return dirs[0];
    }
    /**
     * this method will find every single dir mathes the name 
     * and return thoose as an array
     * @param name the name of the dirs you want to get
     */
    getDirs(name): Dir[] {
        var dirs: Dir[];
        this.foreachDir(function (dir) {
            if (dir.name === name) {
                dirs.push(dir);
            }
            return dir;
        });
        return dirs;
    }
    /**
     * this method will loop throw every file and dir
     * in the dir and pass that in to the function that
     * have been passed in if it return false it will
     * delete the file or dir
     * @param func a function that will passed in to it 
     * every single file or dir in the dir
     */
    filter(func: (thing: File | Dir) => boolean): Dir {
        var newFiles = [];
        for (let i = 0; i < this.files.length; i++) {
            if (func(this.files[i])) {
                if (this.files[i] instanceof Dir) {
                    this.files[i].filter(func);
                }
                newFiles.push(this.files[i]);
            } else {
                this.files[i].delete();
            }
        }
        this.files = newFiles;
        this.updateStatus();
        return this;
    }
    /**
     * the method will watch every single file in the dir
     * and when a file is modified it will pass in
     * that file to the callback
     * @param func the callback
     */
    watch(func: DirWatchCallBack): void {
        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i] instanceof Dir) {
                this.files[i].watch(func);
            } else {
                let file = this.files[i];
                file.watch(() => func(file));
            }
        }
    }
}
