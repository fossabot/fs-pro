import * as fs from 'fs';
import * as path from 'path';
import Dir from './Dir';
import { convertStatus } from "convert-status";
import chardet = require('chardet');
import encoding = require('encoding');

type callback = (value: string, lineNumber: number) => string | undefined;

type Mode = 'none' | 'read write execute' | 'read write' |
    'all' | 'read execute' | 'write execute' |
    'read only' | 'write only' | 'execute only' | number;

type FileWatchCallBack = (currentStatus, prevStatus) => void;

type accessMode = 'execute' | 'write' | 'read' | 'all'

// @ts-ignore
export class File {
    /** the name of the file without the extension */
    public name: string;
    /** the absoulte path for the file */
    public path: string;
    /** the encoding of the file the default is utf8 */
    public encoding: string;
    /** the file as a buffer */
    public buffer: Buffer;
    /** the content of the file */
    public content: any;
    /** the lines of the file */
    public lines: any[];
    /** the line count of the file */
    public lineCount: any;
    /** the size of the file */
    public size: any;
    /** the time when the file is last accessed */
    public accessedAt: Date;
    /** the time when the file is last modified */
    public modifiedAt: Date;
    /** the time when the file changed at */
    public changedAt: Date;
    /** the time when the file was crteae */
    public createdAt: Date;
    /** the device id */
    public deviceID: number;
    /** it's true when the file is writeable */
    public isWriteable: boolean;
    /** it's readable when the file is Readable */
    public isReadable: boolean;
    /** it's true when the file is Excutable */
    public isExecuteable: boolean;
    /** the Dirname fo the file */
    public dirName: string;
    /** the Root of the file */
    public root: string;
    /** the Extension of the file */
    public ext: string;
    /** the file name of the file inculding the Ext */
    public baseName: string;
    /** it's true when the file is others Executeable */
    public isOtherExecuteable: boolean;
    /** it's true when the file is others Readable */
    public isOtherReadable: boolean;
    /** it's true when the file is others writeable */
    public isOtherWriteable: boolean;
    /** it's true when the file is group Executeable */
    public isGroupExecuteable: boolean;
    /** it's true when the file is group Readable */
    public isGroupReadable: boolean;
    /** it's true when the file is group Writable */
    public isGroupWriteable: boolean;
    /** it's true when the file is owner Readable */
    public isOwnerReadable: boolean;
    /** it's true when the file is owner writeable */
    public isOwnerWriteable: boolean;
    /**it's true when the file is owner Executeable */
    public isOwnerExecuteable: boolean;
    /** the size of each block in the file  */
    public blockSize: number;
    /** the block count in the fike */
    public blocks: number;
    /** it's true when the file is a Blocked Deviced */
    public isBlockDevice: boolean;
    /** it's true when the file is a Character Device */
    public isCharacterDevice: boolean;
    /** it's true when the file is a  Symbolic Link */
    public isSymbolicLink: boolean;
    /** it's true when the file is FIFO */
    public isFIFO: boolean;
    /** it's true when the file is a Socket */
    public isSocket: boolean;
    /** the Device Identifier of the file */
    public deviceIdentifier: number;
    /** the groupIdentifier of the file */
    public groupIdentifier: number;
    /** the Inode of the file */
    public Inode: number;
    /** the Hard Links of the file */
    public hardLinks: number;
    /** the User Identifier of the file */
    public userIdentifier: number;
    /** when it's true it will keep trak of some attrs like content */
    public trak: boolean;

    constructor(name: string, trak: boolean = true, enconding?: BufferEncoding) {
        this.setPath(path.resolve(name));
        this.trak = trak;
        if (fs.existsSync(this.path) && trak) {

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
            var encode = chardet.detect(this.buffer);
            this.encoding = encode;
            return;
        }
        if (fs.existsSync(this.path) && !trak) {
            this.encoding = 'UTF-8';
            this.setDefault();
            return;
        }
        this.setDefault();
        fs.writeFileSync(this.path, '');
        this.editStatus();
        if (enconding) {
            if (Buffer.isEncoding(enconding)) {
                this.encoding = enconding;
            } else {
                throw new Error('Invalid Encoding')
            }
        } else {
            this.encoding = 'UTF-8'
        }
    }
    /**
     * this method will get the files you want to
     * work with as an array
     * @param files the files you want to work with
     */
    public static multiple(files: string[], trak: boolean = true): File[] {
        var arr = [];
        for (let item of files) {
            arr.push(new File(item, trak));
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
        this.isWriteable = this.testAccess('write');
        this.isReadable = this.testAccess('read');
        this.isExecuteable = this.testAccess('execute');
        const status = convertStatus(this.status());
        for (const key in status) {
            if (status.hasOwnProperty(key) && key !== 'isDirectory' && key != 'isFile') {
                let element = status[key];
                this[key] = element;
            }
        }
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
    testAccess(mode: accessMode | number): boolean {
        var code;
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
            fs.accessSync(this.path, code || mode);
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
        if (typeof dist === 'string') {
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
            fs.appendFileSync(this.path, content);
            if (this.trak) {
                this.content += content;
                this.lines = this.content.split('\n');
                this.lineCount = this.lines.length;
                this.buffer = Buffer.from(this.content);
            }
            this.encoding = chardet.detect(this.buffer);
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
            fs.writeFileSync(this.path, content);
            if (this.trak) {
                if (content instanceof Buffer) {
                    this.content = content.toString();

                    this.buffer = content;
                } else {
                    this.content = content;
                    this.lines = this.content.split('\n');
                    this.lineCount = this.lines.length;
                    this.buffer = Buffer.from(content);
                    this.encoding = chardet.detect(this.buffer);
                    this.editStatus();
                }
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
            this.encoding = chardet.detect(data);
            this.buffer = data;
            this.editStatus();
            try {
                this.content = data.toString();
                return this.content;
            } catch (err) {
                return data;
            }
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
            arr[i] = func(arr[i], i) + '\n';
        }
        arr.filter(item => item != null);
        var content = arr.join('');
        try {
            fs.writeFileSync(this.path, content);
            this.content = content;
            this.lines = this.content.split('\n');
            this.lineCount = this.lines.length;
            this.buffer = Buffer.from(this.content);
            this.editStatus();
        } catch (err) {
            throw err;
        }
        return this;
    }
    /**
     * this method will refresh the all the 
     * attr in the file no mater what trak attr is 
     */
    refresh() {
        if (this.trak) {
            this.trak = true;
            this.read();
            this.trak = false;
        } else { this.read() }
        this.editStatus();
        this.encoding = chardet.detect(this.buffer);
    }
    /**
     * this method will rename the file 
     * @param newName the new name
     */
    rename(newName: string, noExt?) {
        fs.renameSync(this.path, newName);
        this.setPath(path.resolve(newName));
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
     * @param dir the dir could be a Dir status or a path for it
     */
    parent(dir: Dir | string) {
        if (dir instanceof Dir) {
            this.moveTo(dir.relativePath());
        } else {
            var p = path.resolve(dir);
            this.moveTo(p);
        }
    }

    /**
     * this method will return the parent dir of the File
     */
    parentDir(): Dir {
        return new Dir(this.path);
    }
    /**
     * this method will convert the file encoding
     * @param newEncoding the new eoding
     */
    convertEncoding(newEncoding: BufferEncoding) {
        if (!Buffer.isEncoding(newEncoding)) {
            throw new Error('Invalid Encoding');
        }
        try {
            if (!this.trak) {
                var encode = chardet.detect(Buffer.from(this.read()), { sampleSize: 32 });
                this.encoding = encode;
            }
            const newBuffer = encoding.convert(this.buffer, this.encoding, newEncoding, true);
            this.write(newBuffer);
            this.buffer = newBuffer;
            this.content = this.buffer.toString();
            this.encoding = newEncoding;
            this.editStatus();
        } catch (err) {
            throw err
        }
    }
    /** if the file is json it will parse it and return it */
    toJson(): Object {
        const con = this.read();
        try {
            return JSON.parse(con);
        } catch (err) {
            throw err
        }
    }
}

export default File;
