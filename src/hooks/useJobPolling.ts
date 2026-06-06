import { useState, useEffect, useRef, useCallback } from 'react';
import type { JobStatusResponse } from '../lib/api';
import { pollJobStatus } from '../lib/api';

export type EditorJobStatus = 'uploading' | 'queued' | 'processing' | 'done' | 'failed';

export interface EditorJob {
  id: string;
  status: EditorJobStatus;
  progress: number;
  total?: number;
  processed?: number;
  output_urls?: string[];
  error?: string;
}

interface UseJobPollingOptions {
  intervalMs?: number;
  onComplete?: (urls: string[]) => void;
  onError?: (err: string) => void;
}

/**
 * Polls a job until it reaches done/failed.
 * Returns the live job state.
 */
export function useJobPolling(
  jobId: string | null,
  options: UseJobPollingOptions = {}
) {
  const { intervalMs = 2000, onComplete, onError } = options;
  const [job, setJob] = useState<EditorJob | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (!jobId) return;

    let cancelled = false;

    pollJobStatus(
      jobId,
      (status: JobStatusResponse) => {
        if (cancelled || !mountedRef.current) return;
        const s = status.status as EditorJobStatus;
        setJob({
          id: status.job_id,
          status: s,
          progress: status.progress ?? 0,
          total: status.total,
          processed: status.processed,
          output_urls: status.output_urls ?? [],
          error: status.error,
        });
      },
      intervalMs
    )
      .then((final) => {
        if (cancelled || !mountedRef.current) return;
        onComplete?.(final.output_urls ?? []);
      })
      .catch((err: unknown) => {
        if (cancelled || !mountedRef.current) return;
        const msg = err instanceof Error ? err.message : String(err);
        setJob({ id: jobId, status: 'failed', error: msg, progress: 0 });
        onError?.(msg);
      });

    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
  }, [jobId, intervalMs, onComplete, onError]);

  return job;
}

/**
 * Manages a list of jobs in the editor.
 */
export function useEditorJobs() {
  const [jobs, setJobs] = useState<EditorJob[]>([]);

  const addJob = useCallback((job: EditorJob) => {
    setJobs((prev) => [...prev, job]);
  }, []);

  const updateJob = useCallback((updated: EditorJob) => {
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
  }, []);

  const removeJob = useCallback((id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }, []);

  const clearAll = useCallback(() => setJobs([]), []);

  return { jobs, addJob, updateJob, removeJob, clearAll };
}