import { render, screen, fireEvent } from '@testing-library/react';
import { DownloadFileStep } from '@/components/DownloadFileStep';

describe('DownloadFileStep', () => {
  const mockOnDownload = jest.fn();
  const mockOnConvertAnother = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders success message and buttons', () => {
    render(
      <DownloadFileStep onDownload={mockOnDownload} onConvertAnother={mockOnConvertAnother} />
    );

    expect(
      screen.getByText(/file converted successfully/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /convert another/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /download/i })
    ).toBeInTheDocument();
  });

  it('calls onConvertAnother when "Convert another" is clicked', () => {
    render(
      <DownloadFileStep onDownload={mockOnDownload} onConvertAnother={mockOnConvertAnother} />
    );

    fireEvent.click(screen.getByRole('button', { name: /convert another/i }));
    expect(mockOnConvertAnother).toHaveBeenCalledTimes(1);
  });

  it('calls onDownload when "Download" is clicked', () => {
    render(
      <DownloadFileStep onDownload={mockOnDownload} onConvertAnother={mockOnConvertAnother} />
    );

    fireEvent.click(screen.getByRole('button', { name: /download/i }));
    expect(mockOnDownload).toHaveBeenCalledTimes(1);
  });
});
