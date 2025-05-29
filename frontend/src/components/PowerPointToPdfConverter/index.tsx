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

  const handleChooseFile = (file: File) => {
    setFile(file);
    setCurrentStep('CONVERT');
  };

  const handleConvertComplete = (url: string) => {
    setUrl(url);
    setCurrentStep('DOWNLOAD');
  };

  const handleDownload = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleReset = () => {
    setFile(null);
    setCurrentStep('CHOOSE_FILE');
  };

  switch (currentStep) {
    case 'CHOOSE_FILE':
      return <ChooseFileStep onChooseFile={handleChooseFile} />;
    case 'CONVERT':
      return (
        <ConvertFileStep
          file={file}
          onCancel={handleReset}
          onConvertComplete={handleConvertComplete}
        />
      );
    case 'DOWNLOAD':
      return (
        <DownloadFileStep
          onConvertAnother={handleReset}
          onDownload={handleDownload}
        />
      );
  }
};
