import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { PdfIcon } from '@/icons/PdfIcon';
import { SuccessCircleIcon } from '@/icons/SuccessCircleIcon';

type DownloadFileStepProps = {
  onDownload: () => void;
  onConvertAnother: () => void;
};

export const DownloadFileStep: FC<DownloadFileStepProps> = ({
  onDownload,
  onConvertAnother,
}) => {
  return (
    <div className="p-6 flex flex-col gap-4 shadow-md rounded-2xl">
      <div className="flex flex-col gap-3">
        <div className="p-4 border border-gray-300 rounded-lg flex flex-col items-center gap-6">
          <div className="relative">
            <PdfIcon />
            <SuccessCircleIcon className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2" />
          </div>
          <p className="text-lg text-gray-900 font-semibold">
            File converted successfully!
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          size="lg"
          variant="outline"
          className="w-full font-semibold"
          onClick={onConvertAnother}
        >
          Convert another
        </Button>
        <Button size="lg" className="w-full font-semibold" onClick={onDownload}>
          Download
        </Button>
      </div>
    </div>
  );
};
