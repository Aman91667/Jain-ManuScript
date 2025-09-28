import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, UploadCloud, FileText } from 'lucide-react';
import axios from 'axios';

// Assuming correct imports for UI components and services
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

// --- INTERFACES & TYPES ---

interface FormState {
    title: string;
    description: string;
    category: string;
    language: string;
    period: string;
    author: string;
    keywords: string; // Stored as a comma-separated string based on your UploadPage
    status: string;
    uploadType: 'normal' | 'detailed'; // Note: This maps to 'visibility' on the backend
}

interface ExistingFileState {
    name: string;
    path: string; // The URL path returned from the server (e.g., /uploads/file.jpg)
    url: string; // Full URL for preview (e.g., http://localhost:4000/uploads/file.jpg)
    isMarkedForDeletion: boolean;
}

// --- CONSTANTS ---

// Assuming the API base URL is the same as your upload page
const API_BASE_URL = 'http://localhost:4000/api/manuscripts';
const FILE_BASE_URL = 'http://localhost:4000'; // Base URL for existing file previews

// --- UTILITY FOR IMAGE LOGIC (NEW) ---

/**
 * Utility function to check if a file name indicates a common image format.
 */
const isFileImage = (fileName: string): boolean => {
    // Extended to include common image and document formats.
    return !!fileName.match(/\.(jpg|jpeg|png|gif|webp|tiff|bmp)$/i);
};

// --- COMPONENT START ---

const EditManuscriptPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    // State for form data
    const [formData, setFormData] = useState<FormState>({
        title: '', description: '', category: '', language: '', period: '', author: '', keywords: '', status: 'active', uploadType: 'normal'
    });
    
    // State for managing files
    const [existingFiles, setExistingFiles] = useState<ExistingFileState[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);

    // UI states
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // --- DATA FETCHING AND INITIALIZATION ---

    useEffect(() => {
        const fetchManuscript = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const token = localStorage.getItem('authToken');
                if (!token) throw new Error('User not authenticated');

                const response = await axios.get(`${API_BASE_URL}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const data = response.data;

                // 1. Initialize Form State
                const currentKeywords = (data.keywords || []).join(', '); // Convert array back to string
                const currentUploadType = data.visibility === 'researcher' ? 'detailed' : 'normal';

                setFormData({
                    title: data.title ?? '',
                    description: data.description ?? '',
                    category: data.category ?? '',
                    language: data.language ?? '',
                    period: data.period ?? '',
                    author: data.author ?? '',
                    status: data.status ?? 'active',
                    keywords: currentKeywords,
                    uploadType: currentUploadType
                });

                // 2. Initialize Existing Files State
                const initialFiles: ExistingFileState[] = (data.files ?? []).map((path: string) => ({
                    name: path.split('/').pop() || 'Existing File',
                    path: path,
                    url: `${FILE_BASE_URL}${path.startsWith('/') ? path : '/' + path}`, // Ensures clean URL construction
                    isMarkedForDeletion: false,
                }));
                setExistingFiles(initialFiles);

            } catch (error: any) {
                toast({ title: 'Error', description: error.message || 'Failed to load manuscript.', variant: 'destructive' });
                navigate('/admin');
            } finally {
                setIsLoading(false);
            }
        };

        fetchManuscript();
    }, [id, navigate, toast]);

    // --- HANDLERS ---

    const handleInputChange = (field: keyof FormState, value: string | 'normal' | 'detailed') => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewFiles(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const removeNewFile = (index: number) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    };

    const toggleDeleteExistingFile = (index: number) => {
        setExistingFiles(prev => 
            prev.map((file, i) => 
                i === index ? { ...file, isMarkedForDeletion: !file.isMarkedForDeletion } : file
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setIsSaving(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('User not authenticated');

            const endpoint = `${API_BASE_URL}/${id}`;
            const formDataToSend = new FormData();

            // 1. Append text/metadata fields
            Object.entries(formData).forEach(([key, value]) => {
                // Backend might expect 'visibility' instead of 'uploadType'
                if (key === 'uploadType') {
                    const visibility = value === 'detailed' ? 'researcher' : 'public';
                    formDataToSend.append('visibility', visibility);
                } else {
                    formDataToSend.append(key, value);
                }
            });

            // 2. Handle EXISTING files to keep
            const filesToKeep = existingFiles
                .filter(f => !f.isMarkedForDeletion)
                .map(f => f.path); // Send back the server path only
            
            // NOTE: Assuming your backend is set up to handle this field name for updates
            formDataToSend.append('existingFiles', JSON.stringify(filesToKeep)); 

            // 3. Handle NEW files
            newFiles.forEach(file => {
                formDataToSend.append('files', file); // 'files' is the key your backend uses
            });
            
            // IMPORTANT: Use PUT or PATCH for updates, not POST
            await axios.put(endpoint, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast({ title: 'Success', description: 'Manuscript updated successfully!', variant: 'default' });
            navigate(`/manuscript/${id}`); 
        } catch (error: any) {
            console.error('Failed to update manuscript:', error);
            toast({ title: 'Error', description: error?.response?.data?.message || 'Failed to save manuscript.', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    // --- RENDER ---

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
                    <p className="text-muted-foreground font-medium">Loading manuscript details...</p>
                </div>
            </div>
        );
    }
    
    // Ensure the form doesn't display if the ID is missing after load
    if (!id) return null;


    return (
        <div className="min-h-screen bg-background">
            <header className="py-4 border-b bg-white shadow-sm">
                <div className="container mx-auto px-4 max-w-7xl">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="text-lg">
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back
                    </Button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-serif font-bold mb-6">Edit Manuscript: {formData.title}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* 1. MANUSCRIPT DETAILS CARD */}
                    <Card>
                        <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input 
                                    id="title" 
                                    value={formData.title} 
                                    onChange={e => handleInputChange('title', e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea 
                                    id="description" 
                                    value={formData.description} 
                                    onChange={e => handleInputChange('description', e.target.value)} 
                                    rows={4} 
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. CLASSIFICATION & ACCESS CARD */}
                    <Card>
                        <CardHeader><CardTitle>Classification & Access</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={formData.category} onValueChange={value => handleInputChange('category', value)}>
                                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                    <SelectContent>
                                        {['Philosophy','Scripture','Ethics','Mathematics','Art','Literature'].map(cat => 
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <Select value={formData.language} onValueChange={value => handleInputChange('language', value)}>
                                    <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                                    <SelectContent>
                                        {['Sanskrit','Prakrit','Hindi','Gujarati','Tamil'].map(lang => 
                                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Access Type</Label>
                                <Select value={formData.uploadType} onValueChange={(value: 'normal' | 'detailed') => handleInputChange('uploadType', value)}>
                                    <SelectTrigger><SelectValue placeholder="Select access" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="normal">Normal (Public Preview)</SelectItem>
                                        <SelectItem value="detailed">Detailed (Researcher Only)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={value => handleInputChange('status', value)}>
                                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. DETAILED METADATA (Conditional based on your upload page) */}
                    {formData.uploadType === 'detailed' && (
                        <Card>
                            <CardHeader><CardTitle>Detailed Metadata</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="period">Time Period</Label>
                                    <Input id="period" value={formData.period} onChange={e => handleInputChange('period', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="author">Author/Scribe</Label>
                                    <Input id="author" value={formData.author} onChange={e => handleInputChange('author', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="keywords">Keywords (Comma Separated)</Label>
                                    <Input id="keywords" value={formData.keywords} onChange={e => handleInputChange('keywords', e.target.value)} />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* 4. FILE MANAGEMENT CARD */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Manuscript Files</CardTitle>
                            <CardDescription>Manage existing pages and upload replacements or new pages.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            
                            {/* Existing Files Preview/Delete */}
                            <div className="space-y-3 border-b pb-4">
                                <h3 className="text-lg font-semibold">Existing Pages ({existingFiles.filter(f => !f.isMarkedForDeletion).length} to keep)</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {existingFiles.map((file, index) => (
                                        <div 
                                            key={index} 
                                            className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                                                file.isMarkedForDeletion ? 'border-red-500 opacity-50' : 'border-gray-200 hover:border-primary'
                                            }`}
                                        >
                                            <div className="h-32 w-full flex items-center justify-center bg-gray-100">
                                                {/* --- START OF UPDATED IMAGE LOGIC BLOCK --- */}
                                                {isFileImage(file.name) ? (
                                                    <img
                                                        src={file.url}
                                                        alt={file.name}
                                                        className="h-full w-full object-cover"
                                                        // Fallback logic: If image fails to load, replace the element with the icon/text fallback
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            const container = target.parentElement;
                                                            if (container) {
                                                                // Hide the broken image element
                                                                target.style.display = 'none';
                                                                // Inject the FileText icon with a red tint for visual error feedback
                                                                container.innerHTML = `<svg class="lucide-file-text h-8 w-8 text-red-500" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><line x1="10" x2="14" y1="12" y2="12"></line><line x1="10" x2="14" y1="16" y2="16"></line></svg>`;
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                                )}
                                                {/* --- END OF UPDATED IMAGE LOGIC BLOCK --- */}
                                            </div>
                                            
                                            <div className="p-2 text-center bg-white border-t">
                                                <p className="text-xs truncate font-medium">{file.name}</p>
                                            </div>

                                            <Button
                                                type="button"
                                                variant={file.isMarkedForDeletion ? 'secondary' : 'destructive'}
                                                size="icon"
                                                className="absolute top-1 right-1 h-6 w-6"
                                                onClick={() => toggleDeleteExistingFile(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>

                                            {file.isMarkedForDeletion && (
                                                <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                                                    <span className="text-white font-bold text-sm">MARKING FOR DELETION</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {existingFiles.length === 0 && (
                                        <p className="col-span-4 text-center text-muted-foreground">No existing files.</p>
                                    )}
                                </div>
                            </div>

                            {/* New Files Upload and Preview */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold">Upload New Pages</h3>
                                <Input 
                                    id="new-files" 
                                    type="file" 
                                    multiple 
                                    accept=".pdf,.jpg,.jpeg,.png,.tiff" 
                                    onChange={handleNewFileChange} 
                                />
                                {newFiles.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {newFiles.map((file, i) => (
                                            <Badge key={i} variant="default" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600">
                                                {file.name} 
                                                <X className="h-3 w-3 cursor-pointer" onClick={() => removeNewFile(i)} />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 5. ACTION BUTTONS */}
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving} className="px-8">
                            <Save className="h-4 w-4 mr-2" /> 
                            {isSaving ? 'Saving Changes...' : 'Save Manuscript'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditManuscriptPage;