import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type PowerPointToPdfConverterProps = {};

const options = [
  {
    value: 'high-compression',
    label: 'High Compression',
    description: 'Smallest file size, standard quality.',
  },
];

export const PowerPointToPdfConverter: FC<
  PowerPointToPdfConverterProps
> = () => {
  return (
    <div className="p-6 flex flex-col gap-4 shadow-md rounded-2xl">
      <div className="flex flex-col gap-3">
        <div className="p-4 border border-gray-300 rounded-xl shadow-md flex flex-col items-center">
          <h1 className="font-semibold text-lg text-gray-800">
            Digital Marketing.pptx
          </h1>
          <p className="text-sm text-gray-600">3.88 MB</p>
        </div>
      </div>

      <RadioGroup defaultValue={options[0].value}>
        {options.map((option) => (
          <Label
            key={option.value}
            htmlFor={option.value}
            className="w-full p-4 flex gap-2 cursor-pointer bg-blue-25 border-2 border-blue-200 rounded-md"
          >
            <RadioGroupItem value={option.value} id={option.value} />
            <div className="flex flex-col gap-1">
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

      <div className="flex gap-3">
        <Button variant="outline" className="grow">
          Cancel
        </Button>
        <Button className="grow">Convert</Button>
      </div>
    </div>
  );
};
