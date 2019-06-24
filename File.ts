import * as fs from 'fs';
import * as path from 'path';
import getSize from './getSize';

type callback = (value: any, lineNumber: number) => any;

type Mode = 'none' | 'read write execute' | 'read write' | 'all' | 'read execute' | 'write execute' | 'read only' | 'write only' | 'execute only' | number;

type FileWatchCallBack = (currentStatus, prevStatus) => any;

type accessMode = 'execute' | 'write' | 'read' | 'all'

// @ts-ignore
export default class File {
    name: string;
    path: string;
    enconding: any;
    buffer: Buffer;
    content: any;
    lines: any[];
    lineCount: any;
    size: any;
    accessedAt: Date;
    modifiedAt: Date;
    changedAt: Date;
    createdAt: Date;
    deviceID: number;
    isWriteable: boolean;
    isReadable: boolean;
    isExecuteable: boolean;
    dirName: string;
    root: string;
    ext: string;
    baseName: string;
    constructor(name, enconding?) {
        this.setPath(path.resolve(name));
        this.enconding = enconding || 'utf-8';
        if (fs.existsSync(this.path)) {
            try {
                this.buffer = fs.readFileSync(this.path);
            } catch (err) {
                if (err.code === 'EISDIR') {
                    throw new Error('this path is not a file')
                } else {
                    throw err;
                }
            }
            this.content = this.buffer.toString();
            this.lines = this.content.split('\n');
            this.lineCount = this.lines.length;
            this.editStatus();
        } else {
            this.setDefault();
            fs.writeFileSync(this.path, '');
            this.editStatus();
        }
    }
    private setPath(dist) {
        this.path = dist;
        var obj = path.parse(this.path);
        this.baseName = obj.base;
        this.name = obj.name;
        this.dirName = obj.dir;
        this.root = obj.root;
        this.ext = obj.ext.replace('.', '');
    }
    moveTo(dist) {
        this.copyTo(dist);
        this.delete(true);
        this.setPath(path.resolve(path.join(dist, this.baseName)));
        this.editStatus();
    }
    relativePath() {
        return path.relative('.', this.path);
    }
    private editStatus() {
        const status = this.status();
        this.size = getSize(status.size);
        this.accessedAt = status.atime;
        this.modifiedAt = status.mtime;
        this.changedAt = status.ctime;
        this.createdAt = status.birthtime;
        this.deviceID = status.dev;
        this.isWriteable = this.testAccess('write');
        this.isReadable = this.testAccess('read');
        this.isExecuteable = this.testAccess('execute');
    }
    private status(): fs.Stats {
        const stat = fs.statSync(this.path);
        return stat;
    }
    chmod(mode: Mode): void {
        let code = 0;
        if (mode === 'read write execute' || mode === 'all') code = 7;
        if (mode === 'read write') code = 6;
        if (mode === 'read execute') code = 5;
        if (mode === 'read only') code = 4;
        if (mode === 'write execute') code = 3;
        if (mode === 'write only') code = 2;
        if (mode === 'execute only') code = 1;
        if (mode === 'none') code = 0;
        fs.chmodSync(this.path, code);
    }
    testAccess(mode: accessMode): boolean {
        var code = 7;
        if (mode === 'all' || !mode) {
            code = 7;
        }
        if (mode === 'write') {
            code = fs.constants.W_OK;
        }
        if (mode === 'read') {
            code = fs.constants.R_OK
        }
        if (mode === 'execute') {
            code = fs.constants.X_OK
        }
        try {
            fs.accessSync(this.path, code);
            return true
        } catch (err) {
            return false;
        }
    }
    copy(dist): void {
        fs.copyFileSync(this.path, dist);
    }
    copyTo(dist): void {
        fs.copyFileSync(this.path, path.join(dist, this.baseName));
        this.editStatus();
    }
    getContentFrom(dist: string | File | Buffer): void {
        if (dist instanceof String) {
            var distFile = new File(dist);
            this.write(distFile.content);
        }
        if (dist instanceof File) {
            this.write(dist.read());
        }
        if (dist instanceof Buffer) {
            this.write(dist);
        }
    }
    appendContentFrom(dist: String | File | Buffer) {
        if (typeof dist === 'string') {
            var distFile = new File(dist);
            console.log(distFile);
            this.append(distFile.content);
        }
        if (dist instanceof File) {
            this.append(dist.read());
        }
        if (dist instanceof Buffer) {
            this.append(dist);
        }
    }
    private setDefault(): void {
        this.content = '';
        this.buffer = Buffer.alloc(0);
        this.lineCount = 0;
        this.lines = ['']
    }
    delete(set?): void {
        try {
            fs.unlinkSync(this.path);
            set ? null : this.setDefault()
        } catch (err) {
            throw err
        }
    }
    append(content: Buffer | string): void {
        if (content instanceof Buffer) {
            content = content.toString();
        }
        try {
            fs.appendFileSync(this.path, content, { encoding: this.enconding });
            this.content += content;
            this.lines = this.content.split('\n');
            this.lineCount = this.lines.length;
            this.buffer = Buffer.alloc(0);
            this.editStatus();
        } catch (err) {
            throw err
        }
    }
    clear(): void {
        try {
            fs.writeFileSync(this.path, '');
            this.content = '';
            this.lines = [''];
            this.lineCount = this.lines.length;
            this.buffer = Buffer.alloc(0);
            this.editStatus();
        } catch (err) {
            throw err
        }
    }
    write(content: Buffer | string): void {
        try {
            fs.writeFileSync(this.path, content, { encoding: this.enconding });
            if (content instanceof Buffer) {
                this.content = content.toString();
                this.buffer = content;
            } else {
                this.content = content;
                this.lines = this.content.split('\n');
                this.lineCount = this.lines.length;
                this.buffer = new Buffer(content, this.enconding);
                this.editStatus();
            }
        } catch (err) {
            throw err;
        }
    }
    read(): any {
        try {
            var data = fs.readFileSync(this.path);
            this.content = data.toString();
            this.buffer = data;
            return this.content;
        } catch (err) {
            throw err;
        }
    }
    Lines(): any[] {
        try {
            return fs.readFileSync(this.path, this.enconding).toString().split('\n')
        } catch (err) {
            throw err;
        }
    }
    readLines(func: callback): void {
        try {
            var arr = fs.readFileSync(this.path, this.enconding).toString().split('\n')
        } catch (err) {
            throw err;
        }
        for (let i = 0; i < arr.length; i++) {
            arr[i] = func(arr[i], i);
        }
        arr.filter(item => item != null);
        var content = arr.join('');
        try {
            fs.writeFileSync(this.path, content);
            this.content = content;
            this.lines = this.content.split('\n');
            this.lineCount = this.lines.length;
            this.buffer = new Buffer(this.content, this.enconding);
        } catch (err) {
            throw err;
        }
    }
    refresh() {
        this.read();
        this.editStatus();
    }
    rename(newName: string) {
        fs.renameSync(this.path, newName);
        this.name = newName;
    }
    watch(func: FileWatchCallBack) {
        fs.watchFile(this.path, (curr, prev) => {
            this.refresh();
            func(convertStatus(curr), convertStatus(prev));
        });
    }
}

interface Status {
    size: string,
    accessedAt: Date,
    modifiedAt: Date,
    changedAt: Date,
    createdAt: Date,
    deviceID: number
}


function convertStatus(status: fs.Stats): Status {
    var size = getSize(status.size);
    var accessedAt = status.atime;
    var modifiedAt = status.mtime;
    var changedAt = status.ctime;
    var createdAt = status.birthtime;
    var deviceID = status.dev;
    return { size, accessedAt, modifiedAt, changedAt, createdAt, deviceID }
}
