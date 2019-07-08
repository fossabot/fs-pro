declare module "fs-pro" {

    import * as fs from 'fs';
    import * as path from 'path';
    import { convertStatus } from "convert-status";
    import { convertSize } from "convert-size";
    import chardet = require("chardet");
    import encoding = require("encoding");

    interface Status {
        size: string;
        accessedAt: Date;
        modifiedAt: Date;
        changedAt: Date;
        createdAt: Date;
        deviceID: number;
        isOtherExecuteable: boolean;
        isOtherReadable: boolean;
        isOtherWriteable: boolean;
        isGroupExecuteable: boolean;
        isGroupReadable: boolean;
        isGroupWriteable: boolean;
        isOwnerReadable: boolean;
        isOwnerWriteable: boolean;
        isOwnerExecuteable: boolean;
        blockSize: number;
        blocks: number;
        isFile: boolean;
        isDirectory: boolean;
        isBlockDevice: boolean;
        isCharacterDevice: boolean;
        isSymbolicLink: boolean;
        isFIFO: boolean;
        isSocket: boolean;
        deviceIdentifier: number;
        groupIdentifier: number;
        Inode: number;
        hardLinks: number;
        userIdentifier: number;
    }

    type readLinesCallback = (value: string, lineNumber: number) => string | undefined;

    type FileWatchCallBack = (currentStatus: Status, prevStatus: Status) => undefined;

    type accessMode = 'execute' | 'write' | 'read' | 'all'

    type DirWatchCallBack = (file: File) => undefined;

    type callback = (file: File) => File;

    type foreachCallback = (fileOrDir: File | Dir) => any;

    type foreachDirCallback = (dir: Dir) => Dir | undefined;

    type DataLink = string | File | Buffer;

    type filterCallback = (thing: File | Dir) => boolean;

    class File {
        /** the name of the file without the extension */
        public name: string;
        /** the absoulte path for the file */
        public path: string;
        /** the encoding of the file the default is utf8 */
        public encoding: string;
        /** the file as a buffer */
        public buffer: Buffer;
        /** the content of the file */
        public content: string;
        /** the lines of the file */
        public lines: string[];
        /** the line count of the file */
        public lineCount: number;
        /** the size of the file */
        public size: string;
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

        constructor(name: string, trak?: boolean, enconding?: BufferEncoding)
        /**
        * this method will get the files you want to
        * work with as an array
        * @param {string[]} files the files you want to work with
        * @param {boolean} trak the trak of all of them
        */
        public static multiple(files: string[], trak: boolean): File[]
        /**
        * this method will move you file to the dist you pass in        
        * @param {string} dist the dist that you want the file to be moved to
        */
        public moveTo(dist: string): void
        /**
        * this method will reutrn the relative path of the file
        */
        public relativePath(): string
        /**
        * this methods will change the mode of the file
        * @param {number} mode the mode code
        */
        public chmod(mode: number): File
        /**
        * this method will test the access you want
        * the default is 'read write execute'
        * @param {accessMode | number} mode the mode you want to test
        */
        public testAccess(mode: accessMode | number): boolean
        /**
         * this method will copy the file file to with a differnt
         * name 
         * @param {string} dist the dist you want to copy the file to it should like this 'dist/newName'
         */
        public copy(dist: string): File
        /**
        * this method will copy the file to the dist with the same name
        * @param {string} dist the dist you want to copy the file to 
        */
        public copyTo(dist: string): File
        /**
        * this methods will copy the conent of another file to the file
        * NOTE: it will overwrite the file if you dont that
        * use appendContentFrom()
        * @param {DataLink} dist the path of the file you want to get the conent from
        */
        public getContentFrom(dist: DataLink): File
        /**
         * this method will of append another file content to the file
         * @param {DataLink} dist the path of the file the you wanna append from
         */
        public appendContentFrom(dist: DataLink): File
        /**
         * this method will delete the file
         * @param {boolean} set ignore this passing any thing could cause errors
         */
        public delete(set?: boolean): File
        /**
         * this method will append to the file what ever
         * is passed in if you wanna append another file content
         * use appendContentFrom()
         * @param {string | Buffer} content the content you wanna append
         */
        public append(content: Buffer | string): File
        /**
        * this method will clear the file
        */
        public clear(): File
        /**
         * this method will write to write to the file what if is passed
         * in
         * NOTE: this method will overwrite file content
         * @param {string | Buffer} content the content you want to append
         */
        public write(content: Buffer | string): File
        /**
         * this method will read the file content and return it
         */
        public read(): string | Buffer
        /**
        * this will 
        */
        public Lines(): string[]
        /**
         * this method will loop throw the file lines
         * and apply a function passed in to it
         * @param {readLinesCallback} func a function that will passed in to it the line text and 
         * the line number
         */
        public readLines(func: readLinesCallback): File
        /**
         * this method will refresh the all the 
         * attr in the file no mater what trak attr is 
         */
        public refresh(): void
        /**
         * this method will rename the file 
         * @param {string} newName the new name
         */
        public rename(newName: string): void
        /**
         * this function will wacth the file and pass in
         * to the callback the status of the file currently and previously
         * @param {FileWatchCallBack} func the callback
         */
        public watch(func: FileWatchCallBack): void
        /**
         * will move to the dir that passed in
         * @param {Dir| string} dir the dir could be a Dir status or a path for it
         */
        public parent(dir: Dir | string): void
        /**
         * this method will return the parent dir of the File
         */
        public parentDir(): Dir
        /**
         * this method will convert the file encoding
         * @param {BufferEncoding} newEncoding the new eoding
         */
        public convertEncoding(newEncoding: BufferEncoding): void
        /** if the file is json it will parse it and return it */
        public toJson(): {}
    }

    class Dir {
        public files: any[];
        public path: string;
        public name: string;
        public size: string;
        public accessedAt: Date;
        public modifiedAt: Date;
        public changedAt: Date;
        public createdAt: Date;
        public deviceID: number;
        public trak: boolean;

        constructor(name: string, trak?: boolean)
        /**
        * @param dirs the dirs names
        */
        public static multiple(dirs: string[], trak?: boolean): Dir[]

        public reTrak(): void

        public unTrak(): void
        /**
         * this method will move the files inside the dir to 
         * @param {string} dist the dist
         */
        public moveFilesTo(dist: string): void
        /**
         * will move the file from the dist to 
         * the dir
         * @param {string} dist the dist you want to getthe files from
         */
        public moveFilesFrom(dist: string): void
        /**
         * will copy the file from the dist to the dir
         * @param {string} dist the dist you want to get the files from
         */
        public copyFilesFrom(dist: string): void
        /**
         * will loop throw every single file in the dir
         * and apply the callback to it
         * @param {callback} func the callback function
         */
        public foreachFile(func: callback): Dir
        /**
         * this method will loop throw every single 
         * dir in the dir
         * @param {foreachDirCallback} func the callback function and the method will
         * pass in to it every single dir
         */
        public foreachDir(func: foreachDirCallback): Dir
        /**
         * this method will loop throw the files in the first level
         * or in the dir not in any in it"s sub dirs
         * @param {foreachCallback} func a function that will passed in to it a file or a dir
         */
        public foreach(func: foreachCallback): Dir
        /**
         * this method wil delete the dir no mater it"s empty or not
         */
        public delete(): void
        /**
         * this method will delete the dir but not the files
         * or with other words it will just move all 
         * the files a level up
         */
        public deleteContainer(): void
        /**
         * this method will create a file in the dir
         * @param {string} name the name of the file
         */
        public createFile(name: string): File
        /**
         * the method will get the file with the the name
         * if there is a lot of files with the same name
         * the method will return the first match
         * @param {string} name the of the file you want to get
         */
        public getFile(name: string): File
        /**
         * this method will get all of the files with the name
         * @param {string} name the name
         */
        public getFiles(name: string): File[]
        /**
         * will delete a file with name that have been passed in
         * and if there multimple files with the same name will
         * delete the first match
         * @param {String} name the name of the file you want to delete
         */
        public deleteFile(name: string): Dir
        /**
         * this method will delete every thing with the name
         * passed in BUT if the name is something like *.txt
         * it delete every single FILE that mathes the name
         * @param {string} name the name you want to delete
         */
        public deleteEvery(name: string): Dir
        /**
         * this method will move the dir and every thing in it
         * to th dist
         * @param {string} dist the dist that you want to move the file to it
         */
        public moveTo(dist: string): Dir
        /**
         * this method will copy the dir to the dist passed in
         * @param {string} dist the dist
         */
        public copyTo(dist: string): Dir
        /**
         * this method will copy the files in the dir
         * and NOT the dir it self to the dist passed in
         * @param {string} dist the dist you want to copy the files to
         */
        public copyFilesTo(dist: string): Dir
        /**
         * this method renames the dir to the name passed in
         * @param {string} newName the new name of the dir
         */
        public rename(newName: string): Dir
        /**
         * this method delete every thing in the dir and
         * NOT the dir it self
         */
        public clear(): Dir
        /**
         * this method return the relative path of the dir
         */
        public relativePath(): string
        /**
         * this method will create a dir inside the dir
         * @param {string} name the name of the dir you want to create
         */
        public createDir(name: string): Dir
        /**
         * this method will find the dirs that matches the 
         * name passed in and return the first one 
         * @param {string} name the name of the dir you want to get
         */
        public getDir(name: string): Dir
        /**
         * this method will find every single dir mathes the name 
         * and return thoose as an array
         * @param {string} name the name of the dirs you want to get
         */
        public getDirs(name: string): Dir[]
        /**
         * this method will loop throw every file and dir
         * in the dir and pass that in to the function that
         * have been passed in if it return false it will
         * delete the file or dir
         * @param {filterCallback} func a function that will passed in to it
         * every single file or dir in the dir
         */
        public filter(func: filterCallback): Dir
        /**
         * the method will watch every single file in the dir
         * and when a file is modified it will pass in
         * that file to the callback
         * @param {DirWatchCallBack} func the callback
         */
        public watch(func: DirWatchCallBack): void
    }

    class resolver {
        /** 
         * this method will get you the info of a file or dir 
         * @param {string} path the path
         */
        public static Info(path: string): Status
        /**
         * the method will see if the path if the file it
         * will return a File else if will return a Dir
         * @param path the path
         */
        public static resolve(path: string): File | Dir
    }
}