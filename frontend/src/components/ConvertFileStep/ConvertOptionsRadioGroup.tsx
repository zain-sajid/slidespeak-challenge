import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const options = [
  {
    value: 'pdf',
    label: 'Convert to PDF',
    description: 'Best quality, retains images and other assets.',
  },
];

export const ConvertOptionsRadioGroup = () => {
  return (
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
            <span className="text-sm text-blue-700">{option.description}</span>
          </div>
        </Label>
      ))}
    </RadioGroup>
  );
};
