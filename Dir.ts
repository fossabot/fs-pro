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

    constructor(name) {
        this.path = path.resolve(name);
        this.name = path.parse(this.path).base;
        if (fs.existsSync(this.path)) {
            var arr = fs.readdirSync(this.path);
            for (let item of arr) {
                // @ts-ignore
                var p = path.join(name, item);
                if (fs.lstatSync(p).isDirectory()) {
                    this.files.push(new Dir(p))
                } else {
                    var file = new File(p);
                    this.files.push(file);
                }
            }
        } else {
            fs.mkdirSync(this.path);
        }
        this.updateStatus();
    }
    /**
    * @param dirs the dirs names
    */
    public static multiple(dirs: string[]): Dir[] {
        let arr = [];
        for (let item of dirs) {
            arr.push(new Dir(item));
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
    
    foreach(func: (fileOrDir: File | Dir) => any): Dir {
        for (let i = 0; i < this.files.length; i++) {
            this.files[i] = func(this.files[i]);
        }
        this.updateStatus();
        return this;
    }

    delete(): void {
        this.foreach(thing => thing.delete());
        try { fs.rmdirSync(this.path) } catch (err) { }
        this.files = [];
        this.size = convertSize(0);
    }

    deleteContainer() {
        this.moveFilesTo('./');
        this.delete();
    }

    createFile(name): File {
        var newFile = new File(path.join(this.name, name));
        this.files.push(newFile);
        this.updateStatus();
        return newFile;
    }

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

    deleteFile(name): Dir {
        var file = this.files.filter(item => item.baseName === name)[0];
        file.delete();
        this.files = this.files.filter(item => item.baseName !== name);
        this.updateStatus();
        return this;
    }

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

    moveTo(dist): Dir {
        var thisDir = new Dir(this.name);
        this.copyTo(dist);
        thisDir.delete();
        this.path = path.resolve(path.join(dist, this.name));
        this.updateStatus();
        return this;
    }

    copyTo(dist): Dir {
        var p = path.resolve(path.join(dist, this.name));
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
        this.copyFilesTo(path.join(dist, this.name));
        return this;
    }

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

    rename(newName): Dir {
        fs.renameSync(this.path, path.resolve(newName));
        this.name = newName;
        this.path = path.resolve(newName);
        this.updateStatus();
        return this;
    }

    clear(): Dir {
        this.foreach(thing => thing.delete());
        this.files = [];
        this.size = convertSize(0);
        return this;
    }

    relativePath(): string {
        return path.relative('.', this.path);
    }

    createDir(name): Dir {
        var newDir = new Dir(path.join(this.name, name));
        this.files.push(newDir);
        this.updateStatus();
        return newDir;
    }

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
