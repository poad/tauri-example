import {
  writeFile,
  Dir,
  readDir,
  createDir,
  readTextFile,
} from '@tauri-apps/api/fs';
import { dataDir } from '@tauri-apps/api/path';
import { useState, useCallback } from 'react';

const useFile = () => {
  const [dataDirPath, setAppDirPath] = useState('');
  const loadAppDirPath = useCallback(
    async () => setAppDirPath(await dataDir()),
    []
  );

  loadAppDirPath();

  const readTextFileFromAppDir = async (file: string) => {
    return readTextFile(`${dataDirPath}/${file}`);
  };

  const writeTextFileToAppDir = async (file: string, contents: string) => {
    try {
      await readDir(dataDirPath);
    } catch (err) {
      await createDir(dataDirPath, { recursive: true });
    }
    await writeFile(
      {
        path: `${dataDirPath}/${file}`,
        contents,
      },
      {
        dir: Dir.Data,
      }
    );
  };

  return {
    dataDirPath,
    readTextFileFromAppDir,
    writeTextFileToAppDir,
  };
};

export default useFile;
