import { File as SyncFile } from "../src/index";

export class File extends SyncFile {
    constructor(name: string, trak?: boolean) {
        super(name, trak);
        // @ts-ignore
        const file = new SyncFile(name, false);
        //@ts-ignore
        for (const key in this.__proto__) {
            //@ts-ignore
            this.__proto__[key] = (p1, p2, p3) =>
                new Promise((res, rej) => {
                    try {
                        const data = file[key](p1, p2, p3);
                        res(data);
                    } catch (err) {
                        rej(err);
                    }
                })
        }
    }
}

