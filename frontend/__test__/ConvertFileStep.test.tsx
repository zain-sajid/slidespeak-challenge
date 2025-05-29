import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConvertFileStep } from '@/components/ConvertFileStep';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ConvertFileStep', () => {
  const mockOnConvertComplete = jest.fn();
  const mockOnCancel = jest.fn();

  const dummyFile = new File(['test'], 'test.pptx', {
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders placeholder when no file is selected', () => {
    render(
      <ConvertFileStep
        file={null}
        onConvertComplete={mockOnConvertComplete}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByText(/no file selected/i)).toBeInTheDocument();
    expect(
      screen.getByText(/please select a file to convert/i)
    ).toBeInTheDocument();
  });

  it('renders file info and convert button', () => {
    render(
      <ConvertFileStep
        file={dummyFile}
        onConvertComplete={mockOnConvertComplete}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByText(/test\.pptx/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /convert/i })
    ).toBeInTheDocument();
  });

  it('calls axios.post on convert and shows uploading state', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { task_id: '123' },
    });

    render(
      <ConvertFileStep
        file={dummyFile}
        onConvertComplete={mockOnConvertComplete}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /convert/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(screen.getByText(/uploading your file/i)).toBeInTheDocument();
    });
  });
});
