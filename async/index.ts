import { File as SyncFile, Dir as SyncDir } from "../src/index"

class File extends SyncFile {
    constructor(name: string, trak: boolean = true) {
        super(name, trak);
        // @ts-ignore
        var file = new SyncFile(name, false);
        //@ts-ignore
        for (const key in this.__proto__) {
            //@ts-ignore
            this.__proto__[key] = (p1, p2, p3) =>
                new Promise((res, rej) => {
                    try {
                        var data = file[key](p1, p2, p3);
                        res(data);
                    } catch (err) {
                        rej(err);
                    }
                })
        }
    }
}

class Dir extends SyncDir {
    constructor(name: string, trak: boolean = true) {
        super(name, trak);
        // @ts-ignore
        var dir = new SyncDir(name, false);

        //@ts-ignore
        for (const key in this.__proto__) {
            //@ts-ignore
            this.__proto__[key] = (p1, p2, p3) =>
                new Promise((res, rej) => {
                    try {
                        var data = dir[key](p1, p2, p3);
                        res(data);
                    } catch (err) {
                        rej(err);
                    }
                })
        }
    }
}

export { File, Dir }

module.exports = { File, Dir };