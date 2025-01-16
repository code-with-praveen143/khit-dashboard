"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/app/utils/constants";
import { Loader2 } from "lucide-react";

export function Footer() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchDocumentContent = async (type: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/documents/all`);
      if (response.ok) {
        const data = await response.json();
        const document = data.find((doc: any) => doc.type === type);
        setDialogContent(document ? document.content : "No content available.");
        setDialogTitle(type === "terms_of_service" ? "Terms of Service" : "Privacy Policy");
        setIsDialogOpen(true);
      } else {
        setDialogContent("Failed to load document.");
        setDialogTitle(type === "terms_of_service" ? "Terms of Service" : "Privacy Policy");
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching document content:", error);
      setDialogContent("An error occurred while fetching the document.");
      setDialogTitle(type === "terms_of_service" ? "Terms of Service" : "Privacy Policy");
      setIsDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const openDialog = (type: string) => {
    fetchDocumentContent(type);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogContent("");
  };

  return (
    <>
      <footer className="border-t bg-background">
        <div className="container mx-auto flex flex-wrap items-center justify-between py-4 px-4 sm:px-6 lg:px-8 lg:pl-64">
          {/* Left Section - Footer Text */}
          <p className="text-sm text-muted-foreground mb-2 sm:mb-0 text-center sm:text-left w-full sm:w-auto">
            © 2024 College Admin. All rights reserved.
          </p>

          {/* Right Section - Links */}
          <div className="flex items-center justify-center space-x-4 w-full sm:w-auto">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => openDialog("terms_of_service")}
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => openDialog("privacy_policy")}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* Dialog for Terms of Service and Privacy Policy */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="relative overflow-y-auto h-[70vh] p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: dialogContent }}
                className="prose max-w-none"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={closeDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
