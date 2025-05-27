'use client';

import { useState } from 'react';
import { ChooseFileStep } from '@/components/ChooseFileStep';
import { ConvertFileStep } from '@/components/ConvertFileStep';
import { DownloadFileStep } from '@/components/DownloadFileStep';

export type Step = 'CHOOSE_FILE' | 'CONVERT' | 'DOWNLOAD';

export const PowerPointToPdfConverter = () => {
  const [currentStep, setCurrentStep] = useState<Step>('DOWNLOAD');
  const [file, setFile] = useState<File | null>(null);

  const onChooseFile = (file: File) => {
    setFile(file);
    setCurrentStep('CONVERT');
  };

  const onCancel = () => {
    setFile(null);
    setCurrentStep('CHOOSE_FILE');
  };

  switch (currentStep) {
    case 'CHOOSE_FILE':
      return <ChooseFileStep onChooseFile={onChooseFile} />;
    case 'CONVERT':
      return <ConvertFileStep file={file} onCancel={onCancel} />;
    case 'DOWNLOAD':
      return <DownloadFileStep onCancel={onCancel} />;
  }
};
