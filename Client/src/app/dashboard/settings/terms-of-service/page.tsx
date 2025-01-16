"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import "react-quill/dist/quill.snow.css";
import { BASE_URL } from "@/app/utils/constants";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const EnhancedTermsOfService = () => {
  const [content, setContent] = useState("");
  const [versions, setVersions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const { toast } = useToast();

  // Fetch the latest version of the terms when the component mounts
  useEffect(() => {
    fetchLatestTerms();
  }, []);

  const fetchLatestTerms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/documents/latest`);
      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
        setVersions(data.versions);
      } else {
        throw new Error("Failed to fetch the latest terms");
      }
    } catch (error) {
      console.error("Error fetching latest terms:", error);
      toast({
        title: "Error",
        description: "Failed to load the latest terms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      const blob = new Blob([content], { type: "text/plain" }); // Create a .txt file from content
      formData.append("document", blob, "terms_of_service.txt");
      formData.append("content", content); // Append content as fallback
  
      const response = await fetch(`${BASE_URL}/api/documents`, {
        method: "POST",
        body: formData, // Send as FormData
      });
  
      if (response.ok) {
        const updatedVersions = await response.json();
        setVersions(updatedVersions);
        toast({
          title: "Success",
          description: "Document saved successfully",
        });
      } else {
        throw new Error("Failed to save the document");
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving the document",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  // Debounce function for auto-save
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Auto-save functionality
  const autoSave = useCallback(
    debounce(() => {
      handleSave();
    }, 5000),
    []
  );

  const handleContentChange = (value: string) => {
    setContent(value);
    autoSave();
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="mt-4">
          <Card>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-96">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <ReactQuill
                  value={content}
                  onChange={handleContentChange}
                  theme="snow"
                  className="h-92"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardContent className="prose max-w-none p-4">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="flex justify-between items-center">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 mt-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Document"
          )}
        </Button>
        <span className="text-sm text-gray-500">
          {versions.length > 0 && `Latest version: ${versions[versions.length - 1]}`}
        </span>
      </div>
      {versions.length > 1 && (
        <Alert>
          <AlertTitle>Version History</AlertTitle>
          <AlertDescription>
            {versions.slice(0, 5).map((version, index) => (
              <div key={index} className="text-sm">
                Version {versions.length - index}: {version}
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EnhancedTermsOfService;

