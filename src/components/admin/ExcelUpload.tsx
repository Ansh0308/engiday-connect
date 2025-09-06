import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { Upload, FileSpreadsheet } from 'lucide-react'

interface ExcelUploadProps {
  onUploadComplete: () => void
}

export function ExcelUpload({ onUploadComplete }: ExcelUploadProps) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
      ]
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please select an Excel file (.xlsx or .xls)",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select an Excel file to upload",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const { data, error } = await supabase.functions.invoke('parse-excel', {
        body: formData
      })

      if (error) {
        console.error('Upload error:', error)
        toast({
          title: "Upload Failed",
          description: "Failed to process the Excel file",
          variant: "destructive",
        })
        return
      }

      if (data.success) {
        toast({
          title: "Upload Successful",
          description: data.message,
        })
        
        if (data.errors && data.errors.length > 0) {
          toast({
            title: "Processing Warnings",
            description: `${data.errors.length} rows had issues. Check console for details.`,
            variant: "destructive",
          })
          console.warn('Processing errors:', data.errors)
        }

        setSelectedFile(null)
        onUploadComplete()
      } else {
        toast({
          title: "Processing Failed",
          description: data.error || "Failed to process student data",
          variant: "destructive",
        })
        
        if (data.details) {
          console.error('Processing details:', data.details)
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "Upload Error",
        description: "An error occurred while uploading the file",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Student Data Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Excel File Format Requirements:</h4>
          <ul className="text-sm space-y-1">
            <li>• Column 1: <strong>GR Number</strong> (Required)</li>
            <li>• Column 2: <strong>Name</strong> (Required)</li>
            <li>• Column 3: <strong>Email</strong> (Required - must be @marwadiuniversity.ac.in)</li>
            <li>• Column 4: <strong>Class</strong> (Required)</li>
            <li>• Column 5: <strong>Semester</strong> (Required - 1 to 8)</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="excel-file">Select Excel File</Label>
          <Input
            id="excel-file"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </div>

        {selectedFile && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm">
              <strong>Selected file:</strong> {selectedFile.name}
            </p>
            <p className="text-sm text-gray-600">
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || uploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Processing...' : 'Upload and Process Excel File'}
        </Button>
      </CardContent>
    </Card>
  )
}