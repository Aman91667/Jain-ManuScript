import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

const UploadManuscriptPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    language: '',
    description: '',
    summary: '',
    significance: '',
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [manuscriptFiles, setManuscriptFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailFile(e.target.files?.[0] || null);
  };

  const handleManuscriptFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManuscriptFiles(e.target.files);
  };

  const handleSubmit = async (isPublic: boolean) => {
    if (!formData.title || !thumbnailFile) {
      toast({ title: "Validation Error", description: "Title and Thumbnail are required.", variant: "destructive" });
      return;
    }

    // Additional validation for researcher upload
    if (!isPublic && (!manuscriptFiles || manuscriptFiles.length === 0)) {
        toast({ title: "Validation Error", description: "Manuscript pages are required for detailed upload.", variant: "destructive" });
        return;
    }

    setIsLoading(true);
    const apiEndpoint = isPublic ? '/api/manuscripts/upload/public' : '/api/manuscripts/upload/detailed';
    
    // We will implement the actual API call in the next step
    console.log(`Submitting to ${isPublic ? 'Public' : 'Detailed'} endpoint...`);
    
    try {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('category', formData.category);
        data.append('language', formData.language);
        data.append('description', formData.description);
        data.append('summary', formData.summary);
        if (thumbnailFile) {
            data.append('thumbnail', thumbnailFile);
        }
        if (manuscriptFiles) {
            for (let i = 0; i < manuscriptFiles.length; i++) {
                data.append('manuscriptPages', manuscriptFiles[i]);
            }
        }
        
        // This is a placeholder for the actual fetch call
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            body: data,
            // Headers for authorization will be needed here
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        toast({
            title: "Upload Successful!",
            description: `The manuscript has been uploaded to the ${isPublic ? 'public' : 'researcher'} page.`,
        });

    } catch (error) {
        toast({
            title: "Upload Failed",
            description: "An error occurred during upload. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Upload New Manuscript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" value={formData.author} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="philosophy">Philosophy</SelectItem>
                    <SelectItem value="scripture">Scripture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input id="language" name="language" value={formData.language} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Public Summary</Label>
                <Textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} placeholder="A short summary for public view" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="The full research description" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail Image</Label>
                  <Input id="thumbnail" type="file" onChange={handleThumbnailChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manuscriptFiles">Manuscript Pages (Photos)</Label>
                  <Input id="manuscriptFiles" type="file" multiple onChange={handleManuscriptFilesChange} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-end space-x-4">
          <Button onClick={() => handleSubmit(true)} disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload to Public Page"}
          </Button>
          <Button onClick={() => handleSubmit(false)} disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload to Researcher Page"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadManuscriptPage;