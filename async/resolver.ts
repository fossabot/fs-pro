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
    public static Info(_path: string): Promise<Status> {
        return new Promise((res, rej) => {
            try {
                res(convertStatus(fs.statSync(path.resolve(_path))));
            } catch (err) {
                rej(err);
            }
        });
    }
    /**
     * the method will see if the path if the file it
     * will return a File else if will return a Dir
     * @param path the path
     */
    public static resolve(_path: string): Promise<File | Dir> {
        return new Promise((res, rej) => {
            try {
                if (fs.statSync(path.resolve(_path)).isDirectory()) {
                    res(new Dir(_path));
                } else {
                    res(new File(_path));
                }
            } catch (err) {
                rej(err);
            }
        })
    }
}