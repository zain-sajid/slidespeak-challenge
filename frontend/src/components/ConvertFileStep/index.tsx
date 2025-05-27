import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatFileSize } from '@/utils/file-size';
import { LoadingIndicatorIcon } from '@/icons/LoadingIndicatorIcon';
import { LoadingCircleIcon } from '@/icons/LoadingCircleIcon';
import axios from 'axios';

type ConvertFileStepProps = {
  file: File | null;
  onConvert: (url: string) => void;
  onCancel: () => void;
};

type UploadResponse = {
  message: string;
  url: string | null;
};

const options = [
  {
    value: 'high-compression',
    label: 'High Compression',
    description: 'Smallest file size, standard quality.',
  },
];

export const ConvertFileStep: FC<ConvertFileStepProps> = ({
  file,
  onConvert,
  onCancel,
}) => {
  const [isConverting, setIsConverting] = useState(false);

  const onCompress = async () => {
    setIsConverting(true);

    const formData = new FormData();
    if (!file) {
      return;
    }
    formData.append('file', file);

    const response = await axios.post<UploadResponse>(
      'http://127.0.0.1:8000/convert',
      formData
    );

    setIsConverting(false);
    if (response.data.url) {
      onConvert(response.data.url);
    }
  };

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
          <h1 className="font-semibold text-lg text-gray-800">{file.name}</h1>
          <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
        </div>
      </div>

      {isConverting ? (
        <div className="rounded-xl border border-gray-300 p-4 flex items-center gap-2">
          <LoadingCircleIcon className="animate-spin" />
          <span className="text-sm text-gray-700">
            Compressing your file...
          </span>
        </div>
      ) : (
        <RadioGroup defaultValue={options[0].value}>
          {options.map((option) => (
            <Label
              key={option.value}
              htmlFor={option.value}
              className="w-full p-4 flex gap-2 cursor-pointer bg-blue-25 border-2 border-blue-200 rounded-xl"
            >
              <RadioGroupItem value={option.value} id={option.value} />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm leading-4 text-blue-800">
                  {option.label}
                </span>
                <span className="text-sm text-blue-700">
                  {option.description}
                </span>
              </div>
            </Label>
          ))}
        </RadioGroup>
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
          onClick={onCompress}
          disabled={isConverting}
        >
          {isConverting ? (
            <LoadingIndicatorIcon className="animate-spin" />
          ) : (
            'Compress'
          )}
        </Button>
      </div>
    </div>
  );
};
