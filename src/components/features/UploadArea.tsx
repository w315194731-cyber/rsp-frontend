import React, { useCallback, useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Loader } from 'lucide-react';

type UploadAreaState = 'idle' | 'drag-over' | 'uploading' | 'done';

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  uploadProgress?: number;   // 0–100
  status?: UploadAreaState;
  totalFiles?: number;
  uploadedCount?: number;
}

/**
 * UploadArea — drag-and-drop + click-to-upload.
 * States: idle, drag-over, uploading, done.
 */
export function UploadArea({
  onFilesSelected,
  accept = '.jpg,.jpeg,.png,.webp,.cr2,.nef,.arw',
  multiple = true,
  disabled = false,
  uploadProgress,
  status: externalStatus,
  totalFiles = 0,
  uploadedCount = 0,
}: UploadAreaProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isUploading = externalStatus === 'uploading';
  const isDone = externalStatus === 'done';

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length > 0) onFilesSelected(files);
      // reset so same file can be re-selected
      e.target.value = '';
    },
    [onFilesSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        /\.(jpe?g|png|webp|cr2|nef|arw)$/i.test(f.name)
      );
      if (files.length > 0) onFilesSelected(files);
    },
    [disabled, onFilesSelected]
  );

  const status = externalStatus ?? (dragOver ? 'drag-over' : isDone ? 'done' : 'idle');

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center gap-3
        min-h-[200px] rounded-radius-lg border-2 border-dashed
        transition-all duration-base ease-out cursor-pointer select-none
        ${status === 'drag-over'
          ? 'border-brand bg-brand-subtle scale-[1.01]'
          : status === 'uploading'
          ? 'border-border-strong bg-bg-surface cursor-wait'
          : status === 'done'
          ? 'border-semantic-success bg-semantic-success/5'
          : 'border-border-default bg-bg-surface hover:border-border-strong'
        }
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => !isUploading && !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Upload area"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
      />

      {isUploading ? (
        <>
          <Loader size={40} className="text-brand animate-spin" />
          <p className="text-text-secondary text-sm">
            Uploading {uploadedCount}/{totalFiles}...
          </p>
          {uploadProgress !== undefined && (
            <div className="w-48 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
              <div
                className="h-full bg-brand transition-all duration-base ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </>
      ) : isDone ? (
        <>
          <div className="w-10 h-10 rounded-full bg-semantic-success/20 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10l4 4 8-8" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-text-secondary text-sm">{totalFiles} file{totalFiles !== 1 ? 's' : ''} uploaded</p>
        </>
      ) : (
        <>
          <div className={`p-3 rounded-full ${dragOver ? 'bg-brand/20' : 'bg-bg-elevated'}`}>
            {dragOver
              ? <ImageIcon size={40} className="text-brand" />
              : <Upload size={40} className="text-text-muted" />
            }
          </div>
          <p className="text-text-primary text-base font-medium">
            {dragOver ? 'Drop files here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-text-muted text-xs">Supports JPG, PNG, WEBP, RAW（CR2/NEF/ARW）</p>
        </>
      )}
    </div>
  );
}