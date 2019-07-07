import { convertStatus } from "convert-status";
import { statSync } from "fs";
import { resolve } from "path";
import { File, Dir } from "./index";

export class resolver {

    public static getInfo(path: string) {
        const stat = convertStatus(statSync(resolve(path)));
        return stat;
    }

    public static resolve(path: string) {
        if (statSync(resolve(path)).isDirectory()) {
            return new Dir(path);
        } else {
            return new File(path);
        }
    }
}
