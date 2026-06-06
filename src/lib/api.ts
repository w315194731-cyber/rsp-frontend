// API client for RSP backend
const API_BASE = import.meta.env.VITE_API_URL ?? 'https://api.rsp.example.com';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UploadResponse {
  job_id: string;
  status: 'queued';
  filename: string;
}

export interface JobStatusResponse {
  job_id: string;
  status: 'queued' | 'processing' | 'done' | 'failed';
  progress?: number;       // 0–100
  total?: number;          // total images
  processed?: number;       // images processed so far
  output_urls?: string[];  // available when done
  error?: string;
  created_at: string;
  updated_at: string;
}

// ─── API Methods ─────────────────────────────────────────────────────────────

/**
 * Upload one or more images. Returns a job_id for polling.
 */
export async function uploadImages(
  files: File[],
  onProgress?: (loaded: number, total: number) => void
): Promise<UploadResponse[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/api/v1/upload`);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(e.loaded, e.total);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(Array.isArray(data) ? data : [data]);
        } catch {
          reject(new Error('Invalid JSON response from upload'));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
    xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

    xhr.send(formData);
  });
}

/**
 * Poll job status until done/failed.
 */
export async function pollJobStatus(
  jobId: string,
  onProgress?: (status: JobStatusResponse) => void,
  intervalMs = 2000
): Promise<JobStatusResponse> {
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}`);
        if (!res.ok) throw new Error(`Status poll failed: ${res.status}`);
        const data: JobStatusResponse = await res.json();
        onProgress?.(data);

        if (data.status === 'done' || data.status === 'failed') {
          resolve(data);
        } else {
          setTimeout(tick, intervalMs);
        }
      } catch (err) {
        reject(err);
      }
    };
    tick();
  });
}

/**
 * Get download URL for a single output file.
 */
export function getDownloadUrl(jobId: string, filename: string): string {
  return `${API_BASE}/api/v1/jobs/${jobId}/download?filename=${encodeURIComponent(filename)}`;
}

/**
 * Download a single file via anchor click.
 */
export function downloadFile(url: string, filename: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

/**
 * Trigger batch zip download.
 */
export function downloadBatchZip(jobId: string): void {
  window.open(`${API_BASE}/api/v1/jobs/${jobId}/download`, '_blank');
}