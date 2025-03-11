import { invoke } from '@tauri-apps/api/core';

interface LoadReaponse {
  error: boolean;
  message: string;
  contents: string;
}

interface SaveReaponse {
  error: boolean;
  message: string;
}

function useFile() {
  async function readTextFile(): Promise<string> {
    const response = await invoke<LoadReaponse>('load');
    if (response.error) {
      throw new Error(response.message);
    }
    return response.contents;
  };

  async function writeTextFile(contents: string): Promise<void> {
    const response = await invoke<SaveReaponse>('save', {
      body: {
        contents,
      },
    });
    if (response.error) {
      throw new Error(response.message);
    }
    return undefined;
  };

  return {
    readTextFile,
    writeTextFile,
  };
};

export default useFile;
