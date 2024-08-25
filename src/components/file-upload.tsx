'use client';

import { X } from 'lucide-react';

import { UploadDropzone } from '@/lib/uploadthing';

import Image from 'next/image';
type FileUploadProps = {
  endpoint: 'messageFile' | 'serverImage';
  value: string;
  onChange: (url?: string) => void;
};
export default function FileUpload({
  endpoint,
  onChange,
  value,
}: FileUploadProps) {
  const fileType = value?.split('.').pop();
  if (value && fileType !== 'pdf') {
    return (
      <div className="relative h-20 w-20">
        <Image className="rounded-full" fill src={value} alt="upload" />
        <button
          onClick={() => onChange('')}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <div>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => console.error(error.message)}
      />
    </div>
  );
}
