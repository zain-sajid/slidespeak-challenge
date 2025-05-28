export const formatFileSize = (size: number) => {
  // Less than 0.1 KB
  if (size < 102.4) {
    return `${size} B`;
  }

  // Less than 0.1 MB
  if (size < 1024 * 102.4) {
    return `${(size / 1024).toFixed(2)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(2)} MB`;
};
