import { render, screen, fireEvent } from '@testing-library/react';
import { DownloadFileStep } from '@/components/DownloadFileStep';

describe('DownloadFileStep', () => {
  const mockOnDownload = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders success message and buttons', () => {
    render(
      <DownloadFileStep onDownload={mockOnDownload} onCancel={mockOnCancel} />
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

  it('calls onCancel when "Convert another" is clicked', () => {
    render(
      <DownloadFileStep onDownload={mockOnDownload} onCancel={mockOnCancel} />
    );

    fireEvent.click(screen.getByRole('button', { name: /convert another/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onDownload when "Download" is clicked', () => {
    render(
      <DownloadFileStep onDownload={mockOnDownload} onCancel={mockOnCancel} />
    );

    fireEvent.click(screen.getByRole('button', { name: /download/i }));
    expect(mockOnDownload).toHaveBeenCalledTimes(1);
  });
});
