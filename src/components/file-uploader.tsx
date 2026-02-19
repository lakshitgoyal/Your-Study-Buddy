'use client';

import React, { useRef } from 'react';
import { Upload, File, X, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
  isUploading: boolean;
  isUploaded: boolean;
  file: File | null;
}

export default function FileUploader({
  onFileChange,
  onUpload,
  isUploading,
  isUploaded,
  file,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    onFileChange(selectedFile);
  };

  const handleClearFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        className="hidden"
      />
      {!file && (
        <Button variant="outline" className="w-full" onClick={handleFileSelect}>
          <Upload className="mr-2 h-4 w-4" />
          Select File
        </Button>
      )}

      {file && (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-md border border-border bg-muted p-2 text-sm">
            <div className="flex items-center gap-2 truncate">
              <File className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
              <span className="truncate text-muted-foreground">{file.name}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleClearFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={onUpload} disabled={isUploading || isUploaded} className="w-full">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : isUploaded ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Ready to Chat
              </>
            ) : (
              'Upload and Process'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
