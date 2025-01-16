'use client'

import { BASE_URL } from "@/app/utils/constants"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Check, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

const LogoChanger = () => {
  const [logo, setLogo] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogo(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!logo) {
      toast({
        title: "Error!",
        description: "Please select a logo file to upload.",
        duration: 5000,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append("logo", logo)

    try {
      const response = await fetch(`${BASE_URL}/api/upload/logo`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })
      
      if (!response.ok) {
        throw new Error("Failed to upload the logo")
      }

      toast({
        title: "Success!",
        description: "Logo uploaded successfully.",
        duration: 5000,
      })
      setLogo(null)
      setPreviewUrl(null)
    } catch (error) {
      console.error("Error uploading logo:", error)
      toast({
        title: "Error!",
        description: "Failed to upload the logo. Please try again.",
        duration: 5000,
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Logo Changer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="logo-upload" className="text-sm font-medium">
              Upload Logo
            </Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="logo-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {previewUrl ? (
                    <motion.img
                      src={previewUrl}
                      alt="Logo preview"
                      className="w-32 h-32 object-contain mb-4"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  )}
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG or JPG (MAX. 800x400px)</p>
                </div>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <AnimatePresence>
            {logo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                Selected file: {logo.name}
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            type="submit"
            className="w-full"
            disabled={!logo || isUploading}
          >
            {isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default LogoChanger

