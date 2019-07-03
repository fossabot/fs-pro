import File from './File';
import Dir from './Dir';

import { File as AsyncFile, Dir as AsyncDir } from '../async/index';

var Async = {
		File: AsyncFile,
		Dir: AsyncDir
	}

export { File, Dir, Async };

module.exports = { 
	File,
	Dir,
	Async
}