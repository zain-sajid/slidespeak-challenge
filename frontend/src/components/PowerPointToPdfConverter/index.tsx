'use client';

import { useState } from 'react';
import { ChooseFileStep } from '@/components/ChooseFileStep';
import { ConvertFileStep } from '@/components/ConvertFileStep';
import { DownloadFileStep } from '@/components/DownloadFileStep';

export type Step = 'CHOOSE_FILE' | 'CONVERT' | 'DOWNLOAD';

export const PowerPointToPdfConverter = () => {
  const [currentStep, setCurrentStep] = useState<Step>('CHOOSE_FILE');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const onChooseFile = (file: File) => {
    setFile(file);
    setCurrentStep('CONVERT');
  };

  const onConvert = (url: string) => {
    setUrl(url);
    setCurrentStep('DOWNLOAD');
  };

  const onDownload = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const onCancel = () => {
    setFile(null);
    setCurrentStep('CHOOSE_FILE');
  };

  switch (currentStep) {
    case 'CHOOSE_FILE':
      return <ChooseFileStep onChooseFile={onChooseFile} />;
    case 'CONVERT':
      return (
        <ConvertFileStep
          file={file}
          onCancel={onCancel}
          onConvert={onConvert}
        />
      );
    case 'DOWNLOAD':
      return <DownloadFileStep onCancel={onCancel} onDownload={onDownload} />;
  }
};
