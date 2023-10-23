import { useCallback, useState } from 'react';
import useBooleanState from './useBooleanState';
import uploadImage from '@/utils/uploadImage';

export default function useImageUploader() {
  const [src, setSrc] = useState<string>();
  const [isUploading, startUploading, finishUploading] = useBooleanState();
  const [uploadError, setUploadError] = useState(false);

  const onChangeImage = useCallback(
    async (file?: File, onUploaded?: (url?: string) => Promise<void>) => {
      if (!file) return;

      startUploading();
      try {
        const url = await uploadImage(file);
        setSrc(url);
        if (url) {
          onUploaded && (await onUploaded(url));
          finishUploading();
          setUploadError(false);
          return url;
        } else {
          throw Error();
        }
      } catch {
        setUploadError(true);
        setSrc(undefined);
        finishUploading();
        return undefined;
      }
    },
    [finishUploading, startUploading]
  );

  return { src, setSrc, isUploading, uploadError, onChangeImage };
}
