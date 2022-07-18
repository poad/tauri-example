import { invoke } from '@tauri-apps/api/tauri';

// eslint-disable-next-line no-unused-vars
type ErrorHandler = (error: string) => void;

interface LoadReaponse {
  error: boolean;
  message: string;
  contents: string;
}

const useFile = (onError: ErrorHandler) => {
  const readTextFile = async () => {
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

  const writeTextFile = async (contents: string) => {
    invoke('save', {
      body: {
        contents,
      },
    }).catch(onError);
  };

  return {
    readTextFile,
    writeTextFile,
  };
};

export default useFile;
