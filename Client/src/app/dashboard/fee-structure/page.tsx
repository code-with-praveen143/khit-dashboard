"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  FileSpreadsheet,
  Upload,
  X,
  CloudOff,
  CheckCircle2,
  Loader2,
} from "lucide-react"; // Import a spinner icon
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useUploadStudents } from "@/app/hooks/feeupload/useUploadStudents";

const FeeStructureUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading spinner
  const { mutate: uploadFile, isError, isSuccess, reset } = useUploadStudents();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setShowConfirmDialog(true);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
  });

  const handleDownloadSample = () => {
    const link = document.createElement("a");
    link.href = "../sample-fee-structure.xlsx";
    link.download = "sample-document.xlsx";
    link.click();
  };

  const handleUpload = () => {
    if (selectedFile) {
      setIsLoading(true); // Show spinner on upload start
      uploadFile(selectedFile, {
        onSettled: () => {
          setIsLoading(false); // Hide spinner after upload completes
          setShowConfirmDialog(false); // Close dialog
        },
      });
    }
  };

  const handleRetry = () => {
    reset();
    setSelectedFile(null);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="mb-4">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold mb-6">Successfully Uploaded</h3>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="mb-4">
          <CloudOff className="w-16 h-16 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Something went wrong, Please try again
        </h3>
        <Button
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-50"
          onClick={handleRetry}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-[28px] font-[800px] mb-6 pl-2">
        Student Onboarding
      </h1>
      <div className="bg-white rounded-lg shadow"></div>
      <div className="relative p-6">
        <Button
          variant="outline"
          className="absolute top-4 right-4"
          onClick={handleDownloadSample}
        >
          Sample Excel Format
        </Button>

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-primary"
          )}
        >
          <input {...getInputProps()} />
          <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">
            Drag & Drop your excel sheet
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            or click to select a file
          </p>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>

        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Upload</DialogTitle>
              <DialogDescription>
                Are you sure you want to upload {selectedFile?.name}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {isLoading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FeeStructureUpload;
