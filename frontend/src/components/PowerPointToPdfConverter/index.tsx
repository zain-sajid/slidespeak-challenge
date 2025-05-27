'use client';

import { useState } from 'react';
import { ChooseFileStep } from '@/components/ChooseFileStep';
import { ConvertFileStep } from '@/components/ConvertFileStep';

export type Step = 'CHOOSE_FILE' | 'CONVERT' | 'DOWNLOAD';

export const PowerPointToPdfConverter = () => {
  const [currentStep, setCurrentStep] = useState<Step>('CHOOSE_FILE');
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
  }
};
