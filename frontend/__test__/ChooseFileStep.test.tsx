import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { ChooseFileStep } from '@/components/ChooseFileStep';

describe('ChooseFileStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload UI elements', () => {
    render(<ChooseFileStep onChooseFile={jest.fn()} />);
    expect(screen.getByText(/Choose file/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Drag and drop a PowerPoint file to convert to PDF/i)
    ).toBeInTheDocument();
  });

  it('calls onChooseFile when a single file is dropped', async () => {
    const mockOnChoose = jest.fn();
    render(<ChooseFileStep onChooseFile={mockOnChoose} />);

    const input = document.querySelector('input[type="file"]')!;
    const file = new File(['dummy'], 'test.pptx', {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });

    await act(async () => {
      fireEvent.change(input, {
        target: { files: [file] },
      });
    });

    expect(mockOnChoose).toHaveBeenCalledWith(file);
  });
});
