import { File, Dir } from './index';

export interface Status {
    size: string;
    accessedAt: Date,
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

export type readLinesCallback = (value: string, lineNumber: number) => string | undefined;

export type FileWatchCallBack = (currentStatus: Status, prevStatus: Status) => undefined;

export type accessMode = 'execute' | 'write' | 'read' | 'all'

export type DirWatchCallBack = (file: File) => undefined;

export type callback = (file: File) => File;

export type foreachCallback = (fileOrDir: File | Dir) => any;

export type foreachDirCallback = (dir: Dir) => Dir | undefined;

export type DataLink = string | File | Buffer;

export type filterCallback = (thing: File | Dir) => boolean;