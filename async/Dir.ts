import { Dir as SyncDir } from "../src/index";

class Dir extends SyncDir {
    constructor(name: string, trak: boolean = true) {
        super(name, trak);
        // @ts-ignore
        const dir = new SyncDir(name, false);

        //@ts-ignore
        for (const key in this.__proto__) {
            //@ts-ignore
            this.__proto__[key] = (p1, p2, p3) =>
                new Promise((res, rej) => {
                    try {
                        const data = dir[key](p1, p2, p3);
                        res(data);
                    } catch (err) {
                        rej(err);
                    }
                })
        }
    }
}

export default Dir;
