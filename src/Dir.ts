import File from './File';
import * as fs from 'fs';
import * as path from 'path';
import { convertSize } from 'convert-size';

type DirWatchCallBack = (file: File) => undefined;
type callback = (file: File) => File;

export default class Dir {
    public files: any[] = [];
    public path: string;
    public name: string;
    public size: string;
    public accessedAt: Date;
    public modifiedAt: Date;
    public changedAt: Date;
    public createdAt: Date;
    public deviceID: number;
    public trak: boolean;

    constructor(name: string, trak: boolean = true) {
        this.path = path.resolve(name);
        this.name = path.parse(this.path).base;
        this.trak = trak;
        if (fs.existsSync(this.path)) {
            const arr = fs.readdirSync(this.path);
            for (const item of arr) {
                // @ts-ignore
                var p = path.join(name, item);
                if (fs.lstatSync(p).isDirectory()) {
                    this.files.push(new Dir(p, trak))
                } else {
                    const file = new File(p, trak);
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
    public static multiple(dirs: string[], trak: boolean = true): Dir[] {
        let arr = [];
        for (let item of dirs) {
            arr.push(new Dir(item, trak));
        }
        return arr;
    }

    public reTrak(): void {
        this.foreachFile(file => {
            file.trak = true;
            return file;
        });
        this.trak = false
    }

    public unTrak(): void {
        this.foreachFile(file => {
            file.trak = true;
            return file;
        });
        this.trak = false
    }

    /**
     * this method will move the files inside the dir to 
     * @param {string} dist the dist
     */
    public moveFilesTo(dist: string): void {
        this.copyFilesTo(dist);
        this.delete();
        fs.mkdirSync(this.path);
    }
    /**
     * will move the file from the dist to 
     * the dir
     * @param {string} dist the dist you want to getthe files from
     */
    public moveFilesFrom(dist: string): void {
        const dir = new Dir(dist);
        dir.moveFilesTo(this.path);
    }
    /**
     * will copy the file from the dist to the dir
     * @param {string} dist the dist you want to get the files from
     */
    public copyFilesFrom(dist: string) {
        const dir = new Dir(dist);
        dir.copyFilesTo(this.path);
    }
    /**
     * will loop throw every single file in the dir
     * and apply the callback to it
     * @param {callback} func the callback function
     */
    public foreachFile(func: callback): Dir {
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
     * @param {(dir: Dir) => any} func the callback function and the method will
     * pass in to it every single dir
     */
    public foreachDir(func: (dir: Dir) => any): Dir {
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
     * @param {(fileOrDir: File | Dir) => any} func a function that will passed in to it a file or a dir
     */
    public foreach(func: (fileOrDir: File | Dir) => any): Dir {
        for (let i = 0; i < this.files.length; i++) {
            this.files[i] = func(this.files[i]);
        }
        this.updateStatus();
        return this;
    }
    /**
     * this method wil delete the dir no mater it's empty or not
     */
    public delete(): void {
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
    public deleteContainer(): void {
        this.moveFilesTo('./');
        this.delete();
    }
    /**
     * this method will create a file in the dir
     * @param {string} name the name of the file
     */
    public createFile(name: string): File {
        var newFile = new File(path.join(this.name, name), this.trak);
        this.files.push(newFile);
        this.updateStatus();
        return newFile;
    }
    /**
     * the method will get the file with the the name
     * if there is a lot of files with the same name
     * the method will return the first match
     * @param {string} name the of the file you want to get
     */
    public getFile(name: string): File {
        var files: File[];
        this.foreachFile(file => {
            if (file.baseName === name) {
                files.push(file);
            }
            return file;
        });
        return files[0];
    }
    /**
     * this method will get all of the files with the name
     * @param {String} name the name
     */
    public getFiles(name: String): File[] {
        var files = [];
        this.foreachFile(file => {
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
     * @param {String} name the name of the file you want to delete
     */
    public deleteFile(name: string): Dir {
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
     * @param {string} name the name you want to delete
     */
    public deleteEvery(name: string): Dir {
        if (name.indexOf('*') !== -1) {
            const regex = /\*/g;
            name = name.replace(/\./g, '\\.');
            let match = regex.exec(name);
            let pI = 0;
            let str = '';
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
                return file;
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
     * @param {string} dist the dist that you want to move the file to it
     */
    public moveTo(dist: string): Dir {
        var thisDir = new Dir(this.name);
        this.copyTo(dist);
        thisDir.delete();
        this.path = path.resolve(path.join(dist, this.name));
        this.updateStatus();
        return this;
    }
    /**
     * this method will copy the dir to the dist passed in
     * @param {string} dist the dist
     */
    public copyTo(dist: string): Dir {
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
     * @param {string} dist the dist you want to copy the files to
     */
    public copyFilesTo(dist: string): Dir {
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
     * @param {string} newName the new name of the dir
     */
    public rename(newName: string): Dir {
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
    public clear(): Dir {
        this.foreach(thing => thing.delete());
        this.files = [];
        this.size = convertSize(0);
        return this;
    }
    /**
     * this method return the relative path of the dir
     */
    public relativePath(): string {
        return path.relative('.', this.path);
    }
    /**
     * this method will create a dir inside the dir
     * @param {string} name the name of the dir you want to create
     */
    public createDir(name: string): Dir {
        var newDir = new Dir(path.join(this.name, name), this.trak);
        this.files.push(newDir);
        this.updateStatus();
        return newDir;
    }
    /**
     * this method will find the dirs that matches the 
     * name passed in and return the first one 
     * @param {string} name the name of the dir you want to get
     */
    public getDir(name: string): Dir {
        const dirs: Dir[] = [];
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
     * @param {string} name the name of the dirs you want to get
     */
    public getDirs(name: string): Dir[] {
        const dirs: Dir[] = [];
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
     * @param {(thing: File | Dir) => boolean} func a function that will passed in to it
     * every single file or dir in the dir
     */
    public filter(func: (thing: File | Dir) => boolean): Dir {
        const newFiles = [];
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
     * @param {DirWatchCallBack} func the callback
     */
    public watch(func: DirWatchCallBack): void {
        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i] instanceof Dir) {
                this.files[i].watch(func);
            } else {
                const file = this.files[i];
                file.watch(() => func(file));
            }
        }
    }

    private updateStatus(): void {
        var status = fs.lstatSync(this.path);
        this.size = convertSize(status.size);
        this.accessedAt = status.atime;
        this.modifiedAt = status.mtime;
        this.changedAt = status.ctime;
        this.createdAt = status.birthtime;
        this.deviceID = status.dev;
    }
}
