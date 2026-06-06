/**
 * EditorPage — RSP AI background removal tool.
 *
 * Flow: Idle → Uploading → Processing → Done → Results Grid
 * Supports: drag-and-drop upload, click upload, batch processing,
 * individual preview (Modal), individual download, batch ZIP download.
 */
import { useCallback, useState } from 'react';
import { UploadArea } from '../components/features/UploadArea';
import { Modal } from '../components/ui/Modal';
import { ToastContainer, useToast } from '../components/ui/Toast';
import { ProgressBar, ProcessingStatus } from '../components/ui/ProgressBar';
import {
  Upload,
  Download,
  RotateCcw,
  Image as ImageIcon,
  X,
  CheckCircle,
  Loader,
} from 'lucide-react';
import {
  uploadImages,
  pollJobStatus,
  getDownloadUrl,
  downloadFile,
  downloadBatchZip,
  type UploadResponse,
  type JobStatusResponse,
} from '../lib/api';
import { cn } from '../lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

type PageState = 'idle' | 'uploading' | 'processing' | 'done' | 'failed';

interface ResultItem {
  id: string;
  url: string;          // output image URL
  filename: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ImageCardProps {
  result: ResultItem;
  onPreview: (item: ResultItem) => void;
  onDownload: (item: ResultItem) => void;
  onRemove: (item: ResultItem) => void;
}

function ImageCard({ result, onPreview, onDownload, onRemove }: ImageCardProps) {
  return (
    <div className="group relative rounded-radius-lg overflow-hidden bg-bg-surface border border-border-subtle hover:border-border-strong transition-all duration-base ease-out">
      {/* Thumbnail */}
      <button
        onClick={() => onPreview(result)}
        className="w-full aspect-square overflow-hidden bg-bg-elevated block"
      >
        <img
          src={result.url}
          alt={result.filename}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow ease-out"
          loading="lazy"
        />
      </button>

      {/* Overlay with actions */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg-base/90 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-fast">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary truncate max-w-[60%]" title={result.filename}>
            {result.filename}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => onPreview(result)}
              className="p-1.5 rounded-radius-md bg-bg-elevated/80 hover:bg-bg-overlay text-text-secondary hover:text-text-primary transition-colors"
              title="Preview"
            >
              <ImageIcon size={14} />
            </button>
            <button
              onClick={() => onDownload(result)}
              className="p-1.5 rounded-radius-md bg-bg-elevated/80 hover:bg-bg-overlay text-text-secondary hover:text-text-primary transition-colors"
              title="Download"
            >
              <Download size={14} />
            </button>
            <button
              onClick={() => onRemove(result)}
              className="p-1.5 rounded-radius-md bg-bg-elevated/80 hover:bg-bg-overlay text-text-secondary hover:text-semantic-error transition-colors"
              title="Remove"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PreviewModalProps {
  item: ResultItem | null;
  open: boolean;
  onClose: () => void;
  onDownload: (item: ResultItem) => void;
}

function PreviewModal({ item, open, onClose, onDownload }: PreviewModalProps) {
  if (!item) return null;
  return (
    <Modal open={open} onClose={onClose} title={item.filename} size="wide">
      <div className="flex flex-col gap-4">
        <div className="rounded-radius-lg overflow-hidden bg-bg-elevated">
          <img
            src={item.url}
            alt={item.filename}
            className="w-full max-h-[60vh] object-contain"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted truncate">{item.filename}</span>
          <button
            onClick={() => onDownload(item)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-radius-md text-sm font-medium',
              'bg-brand hover:bg-brand-hover text-white',
              'transition-all duration-fast ease-out',
              'active:scale-95'
            )}
          >
            <Download size={15} />
            Download
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main EditorPage ──────────────────────────────────────────────────────────

export default function EditorPage() {
  const [pageState, setPageState] = useState<PageState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0); // 0-100
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobProgress, setJobProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [previewItem, setPreviewItem] = useState<ResultItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { toasts, addToast, dismissToast } = useToast();

  // ── File handling ─────────────────────────────────────────────────────────

  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    setPageState('uploading');
    setUploadProgress(0);
    setError(null);
    setResults([]);

    try {
      // Upload with XHR progress tracking
      const uploadRes: UploadResponse[] = await uploadImages(
        files,
        (loaded, total) => {
          setUploadProgress(total > 0 ? Math.round((loaded / total) * 100) : 0);
        }
      );

      if (uploadRes.length === 0) throw new Error('No job returned from server');

      const firstJob = uploadRes[0];
      setJobId(firstJob.job_id);
      setTotalCount(files.length);
      setProcessedCount(0);
      setPageState('processing');

      // Poll job status until done/failed
      const finalStatus: JobStatusResponse = await pollJobStatus(
        firstJob.job_id,
        (status) => {
          setJobProgress(status.progress ?? 0);
          if (status.processed !== undefined) setProcessedCount(status.processed);
        },
        2000
      );

      if (finalStatus.status === 'done' && finalStatus.output_urls) {
        const newResults: ResultItem[] = finalStatus.output_urls.map((url, i) => ({
          id: `result-${i}`,
          url,
          filename: files[i]?.name ?? `image-${i + 1}.png`,
        }));
        setResults(newResults);
        setPageState('done');
        addToast({
          variant: 'success',
          title: 'Processing complete',
          message: `${newResults.length} images ready for download.`,
        });
      } else if (finalStatus.status === 'failed') {
        throw new Error(finalStatus.error ?? 'Processing failed');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setPageState('failed');
      addToast({ variant: 'error', title: 'Upload failed', message: msg });
    }
  }, [addToast]);

  // ── Preview ──────────────────────────────────────────────────────────────

  const openPreview = useCallback((item: ResultItem) => {
    setPreviewItem(item);
    setPreviewOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
    setTimeout(() => setPreviewItem(null), 250); // wait for exit anim
  }, []);

  // ── Download ─────────────────────────────────────────────────────────────

  const handleDownload = useCallback(
    (item: ResultItem) => {
      if (!jobId) return;
      const url = getDownloadUrl(jobId, item.filename);
      downloadFile(url, item.filename);
    },
    [jobId]
  );

  const handleBatchDownload = useCallback(() => {
    if (!jobId) return;
    downloadBatchZip(jobId);
  }, [jobId]);

  // ── Reset ────────────────────────────────────────────────────────────────

  const handleReset = useCallback(() => {
    setPageState('idle');
    setUploadProgress(0);
    setJobId(null);
    setJobProgress(0);
    setProcessedCount(0);
    setTotalCount(0);
    setResults([]);
    setError(null);
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col">
      {/* Page header */}
      <div className="border-b border-border-subtle bg-bg-surface/80 backdrop-blur-sm sticky top-[60px] z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Smart Editor</h1>
            <p className="text-sm text-text-muted mt-0.5">
              {pageState === 'idle' && 'Upload your images to remove backgrounds'}
              {pageState === 'uploading' && 'Uploading images...'}
              {pageState === 'processing' && `Processing ${processedCount}/${totalCount}...`}
              {pageState === 'done' && `${results.length} images ready`}
              {pageState === 'failed' && 'Processing failed'}
            </p>
          </div>

          {/* Top-right actions */}
          <div className="flex items-center gap-2">
            {pageState === 'done' && results.length > 0 && (
              <button
                onClick={handleBatchDownload}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-radius-md text-sm font-medium',
                  'bg-brand hover:bg-brand-hover text-white',
                  'transition-all duration-fast ease-out',
                  'active:scale-95'
                )}
              >
                <Download size={15} />
                Download ZIP
              </button>
            )}
            {(pageState === 'done' || pageState === 'failed') && (
              <button
                onClick={handleReset}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-radius-md text-sm font-medium',
                  'border border-border-default text-text-secondary',
                  'hover:border-border-strong hover:text-text-primary',
                  'bg-bg-surface transition-all duration-fast',
                  'active:scale-95'
                )}
              >
                <RotateCcw size={15} />
                New Batch
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        {/* Progress section (shown while uploading or processing) */}
        {(pageState === 'uploading' || pageState === 'processing') && (
          <div className="mb-8 animate-fade-up">
            <div className="bg-bg-surface border border-border-subtle rounded-radius-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <Loader size={20} className="text-brand animate-spin shrink-0" />
                <span className="text-text-primary font-medium">
                  {pageState === 'uploading' ? 'Uploading images...' : 'AI is processing your images...'}
                </span>
              </div>

              {pageState === 'uploading' ? (
                <ProgressBar value={uploadProgress} label="Upload progress" />
              ) : (
                <>
                  <ProgressBar
                    value={jobProgress}
                    label="Processing progress"
                    variant={jobProgress >= 100 ? 'success' : 'default'}
                  />
                  <div className="mt-3">
                    <ProcessingStatus
                      processed={processedCount}
                      total={totalCount}
                      message={processedCount > 0 ? `Processed ${processedCount} of ${totalCount} images...` : 'Initializing...'}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Error banner */}
        {pageState === 'failed' && error && (
          <div className="mb-8 animate-fade-up bg-semantic-error/10 border border-semantic-error/30 rounded-radius-xl p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-semantic-error/20 shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-semantic-error">
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-text-primary font-medium">Processing failed</p>
                <p className="text-sm text-text-secondary mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload area — shown in idle state or after reset */}
        {pageState === 'idle' && (
          <div className="animate-fade-up">
            <UploadArea
              onFilesSelected={handleFilesSelected}
              accept=".jpg,.jpeg,.png,.webp,.cr2,.nef,.arw"
              multiple
            />
          </div>
        )}

        {/* Results grid — shown when done */}
        {pageState === 'done' && results.length > 0 && (
          <div className="animate-fade-up">
            {/* Success banner */}
            <div className="flex items-center gap-3 mb-6 p-4 bg-semantic-success/10 border border-semantic-success/30 rounded-radius-lg">
              <CheckCircle size={20} className="text-semantic-success shrink-0" />
              <p className="text-sm text-text-primary font-medium">
                {results.length} images processed successfully.{' '}
                {results.length === 1 ? 'Click the image to preview' : 'Hover over an image to reveal actions'}.
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((item) => (
                <ImageCard
                  key={item.id}
                  result={item}
                  onPreview={openPreview}
                  onDownload={handleDownload}
                  onRemove={(r) => setResults((prev) => prev.filter((x) => x.id !== r.id))}
                />
              ))}
            </div>

            {/* Mobile: sticky bottom bar for batch download */}
            <div className="sticky bottom-6 mt-6 flex justify-center lg:hidden">
              <button
                onClick={handleBatchDownload}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-radius-lg text-sm font-semibold',
                  'bg-brand hover:bg-brand-hover text-white shadow-lg',
                  'transition-all duration-fast ease-out',
                  'active:scale-95'
                )}
              >
                <Download size={16} />
                Download All as ZIP
              </button>
            </div>
          </div>
        )}

        {/* Empty state for done with no results */}
        {pageState === 'done' && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up">
            <div className="p-4 rounded-full bg-bg-surface mb-4">
              <ImageIcon size={32} className="text-text-muted" />
            </div>
            <p className="text-text-primary font-medium">No images to display</p>
            <p className="text-sm text-text-muted mt-1">Try uploading a new batch</p>
            <button
              onClick={handleReset}
              className={cn(
                'mt-4 flex items-center gap-2 px-4 py-2 rounded-radius-md text-sm font-medium',
                'border border-border-default text-text-secondary',
                'hover:border-border-strong hover:text-text-primary',
                'bg-bg-surface transition-all duration-fast'
              )}
            >
              <Upload size={15} />
              Upload new images
            </button>
          </div>
        )}
      </div>

      {/* Preview modal */}
      <PreviewModal
        item={previewItem}
        open={previewOpen}
        onClose={closePreview}
        onDownload={handleDownload}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
