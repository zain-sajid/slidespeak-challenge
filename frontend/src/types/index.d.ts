export type UploadResponse = {
  message: string;
  task_id: string;
};

export type TaskStatus = 'PENDING' | 'SUCCESS' | 'FAILURE' | 'REVOKED';

export type ConvertStatus = 'UPLOADING' | TaskStatus;

export type TaskResponse = {
  status: TaskStatus;
  result: string;
};
