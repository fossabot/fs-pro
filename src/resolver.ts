import { convertStatus } from "convert-status";
import { statSync } from "fs";
import { resolve } from "path";
import { File, Dir } from "./index";
import { Status } from "./types";

export class resolver {
    /** 
     * this method will get you the info of a file or dir 
     * @param {string} path the path
     */
    public static Info(path: string): Status {
        const stat = convertStatus(statSync(resolve(path)));
        return stat;
    }
    /**
     * the method will see if the path if the file it
     * will return a File else if will return a Dir
     * @param path the path
     */
    public static resolve(path: string): File | Dir {
        if (statSync(resolve(path)).isDirectory()) {
            return new Dir(path);
        } else {
            return new File(path);
        }
    }
}
