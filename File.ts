import * as fs from 'fs';
import * as path from 'path';
import Dir from './Dir';
import { convertSize } from 'convert-size';
const chardet = require('chardet');

type callback = (value: any, lineNumber: number) => any;

type Mode = 'none' | 'read write execute' | 'read write' | 'all' | 'read execute' | 'write execute' | 'read only' | 'write only' | 'execute only' | number;

type FileWatchCallBack = (currentStatus, prevStatus) => any;

type accessMode = 'execute' | 'write' | 'read' | 'all'

type WriteStreamOptions = {
    flags?: string,
    encoding?: string,
    fd?: number,
    mode?: number,
    autoClose?: boolean,
    start?: number
}

type ReadStreamOptions = {
    flags?: string,
    encoding?: string,
    fd?: number,
    mode?: number,
    autoClose?: boolean,
    start?: number,
    end?: number,
    hightWaterMark?: number
}


// @ts-ignore
export default class File {
    /** the name of the file without the extension */
    name: string;
    /** the absoulte path for the file */
    path: string;
    /** the encoding of the file the default is utf8 */
    enconding: any;
    /** the file as a buffer */
    buffer: Buffer;
    /** the content of the file */
    content: any;
    /** the lines of the file */
    lines: any[];
    /** the line count of the file */
    lineCount: any;
    /** the size of the file */
    size: any;
    /** the time when the file is last accessed */
    accessedAt: Date;
    /** the time when the file is last modified */
    modifiedAt: Date;
    /** the time when the file changed at */
    changedAt: Date;
    /** the time when the file was crteae */
    createdAt: Date;
    /** the device id */
    deviceID: number;
    /** it's true when the file is writeable */
    isWriteable: boolean;
    /** it's readable when the file is readable */
    isReadable: boolean;
    /** it's true when the file is excutable */
    isExecuteable: boolean;
    /** the dirname fo the file */
    dirName: string;
    /** the root of the file */
    root: string;
    /** the extension of the file */
    ext: string;
    /** the name of the file with the extension */
    baseName: string;
    /**
     * the constructor will check if the file you want 
     * extits if extits it will create it if not
     * it will create it
     * @param name the name of the file you want
     * @param enconding the encoding of the file 
     * you want and it efict only if the file don't exits 
     */
    constructor(name, enconding?) {
        this.setPath(path.resolve(name));
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
            if (chardet.detect(this.buffer) !== 'binary') {
                this.enconding = 'utf8'
            } else {
                this.enconding = 'binary'
            }
        } else {
            this.setDefault();
            fs.writeFileSync(this.path, '');
            this.editStatus();
            if (enconding) {
                if (Buffer.isEncoding(enconding)) {
                    this.enconding = enconding;
                } else {
                    throw new Error('Invalid Encoding')
                }
            } else {
                this.enconding = 'utf8'
            }
        }
    }
    /**
     * this method will get the files you want to
     * work with as an array
     * @param files the files you want to work with
     */
    public static multiple(files: string[]): File[] {
        var arr = [];
        for (let item of files) {
            arr.push(new File(item));
        }
        return arr;
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
    /**
     * this method will move you file to the dist you pass in
     * @param dist the dist that you want the file to be moved to
     */
    moveTo(dist) {
        this.copyTo(dist);
        this.delete(true);
        this.setPath(path.resolve(path.join(dist, this.baseName)));
        this.editStatus();
    }
    /**
     * this method will reutrn the relative path of the file
     */
    relativePath() {
        return path.relative('.', this.path);
    }
    private editStatus() {
        const status = this.status();
        this.size = convertSize(status.size);
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
    /**
     * this methods will change the mode of the file
     * @param mode the mode code
     */
    chmod(mode: number): File {
        fs.chmodSync(this.path, mode);
        this.editStatus();
        return this;
    }
    /**
     * this method will test the access you want
     * the default is 'read write execute'
     * @param mode the mode you want to test
     */
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
    /**
     * this method will copy the file file to with a differnt
     * name 
     * @param dist the dist you want to copy the file to it should like this 'dist/newName'
     */
    copy(dist): File {
        fs.copyFileSync(this.path, dist);
        return this;
    }
    /**
     * this method will copy the file to the dist with the same name
     * @param dist the dist you want to copy the file to 
     */
    copyTo(dist): File {
        fs.copyFileSync(this.path, path.join(dist, this.baseName));
        this.editStatus();
        return this;
    }
    /**
     * this methods will copy the conent of another file to the file
     * NOTE: it will overwrite the file if you dont that
     * use appendContentFrom()
     * @param dist the path of the file you want to get the conent from
     */
    getContentFrom(dist: string | File | Buffer): File {
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
        return this;
    }
    /**
     * this method will of append another file content to the file
     * @param dist the path of the file the you wanna append from
     */
    appendContentFrom(dist: String | File | Buffer): File {
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
        return this;
    }
    private setDefault(): void {
        this.content = '';
        this.buffer = Buffer.alloc(0);
        this.lineCount = 0;
        this.lines = ['']
    }
    /**
     * this method will delete the file
     * @param set ignore this passing any thing could cause errors
     */
    delete(set?): File {
        try {
            fs.unlinkSync(this.path);
            set ? null : this.setDefault()
        } catch (err) {
            throw err
        }
        return this;
    }
    /**
     * this method will append to the file what ever
     * is passed in if you wanna append another file content
     * use appendContentFrom()
     * @param content the content you wanna append
     */
    append(content: Buffer | string): File {
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
        return this;
    }
    /**
     * this method will clear the file
     */
    clear(): File {
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
        return this;
    }
    /**
     * this method will write to write to the file what if is passed
     * in
     * NOTE: this method will overwrite file content
     * @param content the content you want to append
     */
    write(content: Buffer | string): File {
        try {
            fs.writeFileSync(this.path, content, { encoding: this.enconding });
            if (content instanceof Buffer) {
                this.content = content.toString();
                this.buffer = content;
            } else {
                this.content = content;
                this.lines = this.content.split('\n');
                this.lineCount = this.lines.length;
                this.buffer = Buffer.from(content, this.enconding);
                this.editStatus();
            }
        } catch (err) {
            throw err;
        }
        return this;
    }
    /**
     * this method will read the file content and return it
     */
    read(): any {
        try {
            var data = fs.readFileSync(this.path);
            try {
                this.content = data.toString();
            } catch (err) {
                this.content = '';
            }
            this.buffer = data;
            return this.content;
        } catch (err) {
            throw err;
        }
    }
    /**
     * this will 
     */
    Lines(): any[] {
        try {
            return this.read().toString().split('\n')
        } catch (err) {
            throw err;
        }
    }
    /**
     * this method will loop throw the file lines
     * and apply a function passed in to it
     * @param func a function that will passed in to it the line text and 
     * the line number
     */
    readLines(func: callback): File {
        try {
            var arr = this.read().toString().split('\n')
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
            this.buffer = Buffer.from(this.content, this.enconding);
        } catch (err) {
            throw err;
        }
        return this;
    }

    refresh() {
        this.read();
        this.editStatus();
    }
    /**
     * this method will rename the file 
     * @param newName the new name
     */
    rename(newName: string) {
        fs.renameSync(this.path, newName);
        this.name = newName;
    }
    /**
     * this function will wacth the file and pass in
     * to the callback the status of the file currently and previously
     * @param func the callback
     */
    watch(func: FileWatchCallBack) {
        fs.watchFile(this.path, (curr, prev) => {
            this.refresh();
            func(convertStatus(curr), convertStatus(prev));
        });
    }
    /**
     * will move to the dir that passed in
     * @param dir the dir could be a Dir object or a path for it
     */
    parent(dir: Dir | string) {
        if (dir instanceof Dir) {
            this.moveTo(dir.relativePath());
        } else {
            var newDir = new Dir(dir);
            this.moveTo(newDir.relativePath());
        }
    }
    /**
     * this method will return the parent dir of the File
     */
    parentDir(): Dir {
        return new Dir(this.path);
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
    var size = convertSize(status.size);
    var accessedAt = status.atime;
    var modifiedAt = status.mtime;
    var changedAt = status.ctime;
    var createdAt = status.birthtime;
    var deviceID = status.dev;
    return { size, accessedAt, modifiedAt, changedAt, createdAt, deviceID }
}
