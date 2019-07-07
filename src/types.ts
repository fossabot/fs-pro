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

export type callback = (value: string, lineNumber: number) => string | undefined;

export type FileWatchCallBack = (currentStatus: Status, prevStatus: Status) => undefined;

export type accessMode = 'execute' | 'write' | 'read' | 'all'
