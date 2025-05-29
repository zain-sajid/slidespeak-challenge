import axios from 'axios';
import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/utils/file-size';
import { LoadingIndicatorIcon } from '@/icons/LoadingIndicatorIcon';
import { useInterval } from 'usehooks-ts';
import { useToast } from '@/hooks/use-toast';
import { ConvertStatus, TaskResponse, UploadResponse } from '@/types';
import { ConvertOptionsRadioGroup } from '@/components/ConvertFileStep/ConvertOptionsRadioGroup';

type ConvertFileStepProps = {
  file: File | null;
  onConvert: (url: string) => void;
  onCancel: () => void;
};

export const ConvertFileStep: FC<ConvertFileStepProps> = ({
  file,
  onConvert,
  onCancel,
}) => {
  const [status, setStatus] = useState<ConvertStatus | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const isConverting = status === 'PENDING' || status === 'UPLOADING';

  const { toast } = useToast();

  const handleConvert = () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to convert',
        variant: 'error',
      });
      return;
    }

    setStatus('UPLOADING');

    const formData = new FormData();
    formData.append('file', file);

    axios
      .post<UploadResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            setUploadProgress(Math.round((progressEvent.progress ?? 0) * 100));
          },
        }
      )
      .then((response) => {
        setStatus('PENDING');
        setTaskId(response.data.task_id);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: 'Uh oh! Something went wrong.',
          description:
            error.response?.data?.detail ??
            'There was a problem uploading your file.',
          variant: 'error',
        });
        setStatus(null);
      });
  };

  useInterval(
    () => {
      axios
        .get<TaskResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/task/${taskId}`
        )
        .then((response) => {
          setStatus(response.data.status);

          if (response.data.status === 'SUCCESS') {
            onConvert(response.data.result);
          } else if (response.data.status === 'FAILURE') {
            console.error(response.data.result);
            toast({
              title: 'Uh oh! Something went wrong.',
              description: 'Failed to convert your file.',
              variant: 'error',
            });
          }
        })
        .catch((error) => {
          console.error(error);
          toast({
            title: 'Uh oh! Something went wrong.',
            description:
              error.response?.data?.detail ??
              'There was a problem converting your file.',
            variant: 'error',
          });
          setStatus(null);
        });
    },
    status === 'PENDING' && taskId ? 2000 : null
  );

  if (!file) {
    return (
      <div className="p-6 flex flex-col gap-4 shadow-md rounded-2xl">
        <div className="flex flex-col gap-3">
          <div className="p-4 border border-gray-300 rounded-xl shadow-md flex flex-col items-center">
            <h1 className="font-semibold text-lg text-gray-800">
              No file selected
            </h1>
            <p className="text-sm text-gray-600">
              Please select a file to convert
            </p>
          </div>
        </div>

        <Button className="grow" onClick={onCancel}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-4 shadow-md rounded-2xl">
      <div className="flex flex-col gap-3">
        <div className="p-4 border border-gray-300 rounded-lg flex flex-col items-center gap-1">
          <h1 className="font-semibold text-lg text-gray-800 line-clamp-2 text-center">
            {file.name}
          </h1>
          <p className="text-sm text-gray-600  text-center">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>

      {isConverting ? (
        <div className="rounded-xl border border-gray-300 p-4 flex items-center gap-2">
          <div className="size-7 animate-spin-pretty rounded-full border-4 border-solid border-t-blue-500" />
          <span className="text-sm text-gray-700">
            {status === 'UPLOADING'
              ? `Uploading your file (${uploadProgress}%)... `
              : `Converting your file...`}
          </span>
        </div>
      ) : (
        <ConvertOptionsRadioGroup />
      )}

      <div className="flex gap-3">
        <Button
          size="lg"
          variant="outline"
          className="w-full font-semibold"
          onClick={onCancel}
          disabled={isConverting}
        >
          Cancel
        </Button>
        <Button
          size="lg"
          className="w-full font-semibold"
          onClick={handleConvert}
          disabled={isConverting}
        >
          {isConverting ? (
            <LoadingIndicatorIcon className="animate-spin" />
          ) : (
            'Convert'
          )}
        </Button>
      </div>
    </div>
  );
};
