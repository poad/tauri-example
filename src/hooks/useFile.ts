import { invoke } from '@tauri-apps/api/tauri';

// eslint-disable-next-line no-unused-vars
type ErrorHandler = (error: string) => void;

interface LoadReaponse {
  error: boolean;
  message: string;
  contents: string;
}

const useFile = (onError: ErrorHandler) => {
  const readTextFileFromAppDir = async () => {
    return invoke<LoadReaponse>('load')
      .then(({ error, message, contents }) => {
        if (error) {
          onError(message);
          return '';
        }
        return contents;
      })
      .catch(onError);
  };

  const writeTextFileToAppDir = async (contents: string) => {
    invoke('save', {
      body: {
        contents,
      },
    }).catch(onError);
  };

  return {
    readTextFileFromAppDir,
    writeTextFileToAppDir,
  };
};

export default useFile;
