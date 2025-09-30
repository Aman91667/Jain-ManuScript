import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const UploadManuscriptPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [uploadType, setUploadType] = useState<'normal' | 'detailed'>('normal');
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    language: '',
    period: '',
    author: '',
    keywords: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return <div>Loading...</div>;

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8">
          <CardTitle className="text-xl font-serif">Not Authorized</CardTitle>
          <CardDescription>You do not have permission to access this page.</CardDescription>
          <Button className="mt-4" onClick={() => navigate('/')}>Go Back</Button>
        </Card>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const handleInputChange = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      toast({ title: 'Error', description: 'Title is required.', variant: 'destructive' });
      return;
    }

    if (files.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one file.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');

      const apiUrl = 'http://localhost:4000/api/manuscripts/';
      const form = new FormData();

      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value);
      });

      // Append upload type and visibility automatically
      form.append('uploadType', uploadType);
      form.append('visibility', uploadType === 'detailed' ? 'researcher' : 'public');

      // Append files
      files.forEach(file => form.append('files', file));

      await axios.post(apiUrl, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast({ title: 'Success', description: 'Manuscript uploaded successfully.' });
      setFiles([]);
      setFormData({ title: '', description: '', category: '', language: '', period: '', author: '', keywords: '' });
      setUploadType('normal');
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast({ title: 'Error', description: error?.response?.data?.message || error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/admin/dashboard')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Admin Dashboard
        </Button>

        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Upload Manuscript</h1>
        <p className="text-muted-foreground text-lg">Add new manuscripts to the collection</p>

        {/* Upload Type */}
        <Card className="my-6">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Select Upload Type</CardTitle>
            <CardDescription>Choose how you want to process this manuscript</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className={`cursor-pointer transition-colors ${uploadType === 'normal' ? 'ring-2 ring-primary' : ''}`} onClick={() => setUploadType('normal')}>
              <CardHeader>
                <CardTitle className="text-lg">Normal Upload</CardTitle>
                <CardDescription>Standard manuscript upload for general browsing</CardDescription>
              </CardHeader>
            </Card>
            <Card className={`cursor-pointer transition-colors ${uploadType === 'detailed' ? 'ring-2 ring-primary' : ''}`} onClick={() => setUploadType('detailed')}>
              <CardHeader>
                <CardTitle className="text-lg">Researcher Upload</CardTitle>
                <CardDescription>Detailed manuscript with multiple files and metadata</CardDescription>
              </CardHeader>
            </Card>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">{uploadType === 'normal' ? 'Normal' : 'Detailed'} Manuscript Upload</CardTitle>
            <CardDescription>Fill in details and upload files</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="files">Manuscript Files {uploadType === 'detailed' && '(Multiple files allowed)'}</Label>
                <Input id="files" type="file" multiple={uploadType === 'detailed'} accept=".pdf,.jpg,.jpeg,.png,.tiff" onChange={handleFileChange} />
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {files.map((file, i) => (
                      <Badge key={i} variant="secondary" className="flex items-center gap-2">
                        {file.name} <X className="h-3 w-3 cursor-pointer" onClick={() => removeFile(i)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" value={formData.title} onChange={e => handleInputChange('title', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={value => handleInputChange('category', value)}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>{['Philosophy','Scripture','Ethics','Mathematics','Art','Literature'].map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={formData.language} onValueChange={value => handleInputChange('language', value)}>
                    <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                    <SelectContent>{['Sanskrit','Prakrit','Hindi','Gujarati','Tamil'].map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} rows={4} />
              </div>

              {uploadType === 'detailed' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="period">Time Period</Label>
                    <Input id="period" value={formData.period} onChange={e => handleInputChange('period', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author/Scribe</Label>
                    <Input id="author" value={formData.author} onChange={e => handleInputChange('author', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input id="keywords" value={formData.keywords} onChange={e => handleInputChange('keywords', e.target.value)} />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  <Upload className="h-4 w-4 mr-2" /> {isSubmitting ? 'Uploading...' : 'Upload Manuscript'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/admin/dashboard')}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadManuscriptPage;
