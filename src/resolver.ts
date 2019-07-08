import { convertStatus } from "convert-status";
import * as fs from "fs";
import * as path from "path";
import { File, Dir } from "./index";
import { Status } from "./types";

export class resolver {
    /** 
     * this method will get you the info of a file or dir 
     * @param {string} path the path
     */
    public static Info(_path: string): Status {
        const stat = convertStatus(fs.statSync(path.resolve(_path)));
        return stat;
    }
    /**
     * the method will see if the path if the file it
     * will return a File else if will return a Dir
     * @param path the path
     */
    public static resolve(_path: string): File | Dir {
        if (fs.statSync(path.resolve(_path)).isDirectory()) {
            return new Dir(_path);
        } else {
            return new File(_path);
        }
    }
}
