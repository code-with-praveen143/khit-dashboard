import { auth_token } from "@/app/@types/data";
import { useMutation } from "@tanstack/react-query";

export function useUploadStudents() {
    return useMutation({
      mutationFn: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
  
        
        const response = await fetch(
          "http://localhost:5001/api/students/upload-students",
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${auth_token}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to upload students");
        }
  
        const data = await response.json();
        return data;
      },
    });
  }
  