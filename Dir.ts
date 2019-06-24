import File from './File';
import * as fs from 'fs';
import * as path from 'path';
import getSize from './getSize';

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

    updateStatus() {
        var status = fs.lstatSync(this.path);
        this.size = getSize(status.size);
        this.accessedAt = status.atime;
        this.modifiedAt = status.mtime;
        this.changedAt = status.ctime;
        this.createdAt = status.birthtime;
        this.deviceID = status.dev;
    }

    foreachFile(func: callback) {
        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i] instanceof Dir) {
                this.files[i].foreachFile(func);
            } else {
                this.files[i] = func(this.files[i]);
            }
        }
        this.files.filter(item => item != null);
        this.updateStatus();
    }

    foreachDir(func: (dir: Dir) => any) {
        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i] instanceof Dir) {
                this.files[i].foreachDir(func);
                this.files[i] = func(this.files[i]);
            }
        }
        this.updateStatus();
    }

    foreach(func: (fileOrDir: File | Dir) => any) {
        for (let i = 0; i < this.files.length; i++) {
            this.files[i] = func(this.files[i]);
        }
        this.updateStatus();
    }

    delete() {
        this.foreach(thing => thing.delete());
        try { fs.rmdirSync(this.path) } catch (err) { }
        this.files = null;
        this.size = null;
    }

    createFile(name) {
        this.files.push(new File(path.join(this.name, name)));
        this.updateStatus();
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

    deleteFile(name) {
        var file = this.files.filter(item => item.baseName === name)[0];
        file.delete();
        this.files = this.files.filter(item => item.baseName !== name);
        this.updateStatus();
    }

    deleteEvery(name: string) {
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
    }

    filter(func: (thing: File | Dir) => boolean) {
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
    }

    watch(func: DirWatchCallBack) {
        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i] instanceof Dir) {
                this.files[i].watch(func);
            } else {
                let file = this.files[i];
                file.watch(() => func(file));
            }
        }
    }

    moveTo(dist) {
        var thisDir = new Dir(this.name);
        this.copyTo(dist);
        thisDir.delete();
        this.path = path.resolve(path.join(dist, this.name));
        this.updateStatus();
    }

    copyTo(dist) {
        var p = path.resolve(path.join(dist, this.name));
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
        this.copyFilesTo(path.join(dist, this.name));
    }

    copyFilesTo(dist) {
        var p = path.resolve(dist);
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
        this.path = p;
        this.updateStatus();
        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i] instanceof Dir) {
                this.files[i].copyFilesTo(path.join(dist, this.files[i].name));
            } else {
                this.files[i].copyTo(dist);
            }
        }
        this.updateStatus();
    }

    rename(newName) {
        fs.renameSync(this.path, path.resolve(newName));
        this.name = newName;
        this.path = path.resolve(newName);
        this.updateStatus();
    }

    clear() {
        this.foreach(thing => thing.delete());
        this.files = [];
        this.size = getSize(0);
    }

    relativePath() {
        return path.relative('.', this.path);
    }

    createDir(name) {
        this.files.push(new Dir(path.join(this.name, name)));
        this.updateStatus();
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
}
