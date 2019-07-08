import { Dir as SyncDir } from "../src/index";

export class Dir extends SyncDir {
    constructor(name: string, trak?: boolean) {
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
    public static multiple(dirs: string[], trak?: boolean): Dir[] {
        const arr = [];
        for (const item of dirs) {
            arr.push(new Dir(item, trak));
        }
        return arr;
    }
}
