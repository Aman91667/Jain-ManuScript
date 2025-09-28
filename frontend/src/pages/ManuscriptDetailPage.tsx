import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { manuscriptService } from '@/services/manuscriptService';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import {
    ArrowLeft,
    BookOpen,
    ExternalLink,
    FileText,
    Image,
    Maximize2,
    ZoomIn,
    ZoomOut,
    Copy,
    Calendar,
    User,
    Globe,
    Tag,
    Loader2,
    X,
    PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Manuscript {
    _id: string;
    title: string;
    description: string;
    category: string;
    language: string;
    period: string;
    author: string;
    keywords: string[];
    files: string[];
    uploadType: 'normal' | 'detailed';
    uploadedBy: string;
}

// --- CONSTANTS & UTILITIES ---

const FILE_BASE_URL = 'http://localhost:4000';

const isFileImage = (fileName: string): boolean => {
    return !!fileName.match(/\.(jpg|jpeg|png|gif|webp|tiff|bmp)$/i);
};

const getAbsoluteFileUrl = (filePath: string): string => {
    const cleanPath = filePath.replace(/^\/+/, '');
    return `${FILE_BASE_URL}/${cleanPath}`;
};

// Error SVG (Using Tailwind's semantic 'destructive' color)
const FileTextSvg = `<svg class="lucide-file-text h-4 w-4 text-destructive" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><line x1="10" x2="14" y1="12" y2="12"></line><line x1="10" x2="14" y1="16" y2="16"></line></svg>`;


const ManuscriptDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();
    const [manuscript, setManuscript] = useState<Manuscript | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [textZoom, setTextZoom] = useState(100);
    const [showMetadata, setShowMetadata] = useState(true); // State to control sidebar visibility

    useEffect(() => {
        const fetchManuscript = async () => {
            if (!id) {
                setError('Manuscript ID is missing.');
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const data = await manuscriptService.getManuscriptById(id);
                setManuscript(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch manuscript.');
                toast({
                    title: 'Error',
                    description: 'Failed to load manuscript details.',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchManuscript();
    }, [id, toast]);

    const handleCopyCitation = () => {
        if (manuscript) {
            const citation = `${manuscript.author}. ${manuscript.title}. ${manuscript.period}, [${manuscript.files.length} pages]. Digital Collection.`;
            navigator.clipboard.writeText(citation).then(() => {
                toast({
                    title: 'Copied!',
                    description: 'Citation copied to clipboard.',
                });
            });
        }
    };
    
    // Utility to handle image load errors for the main viewer
    const handleMainImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        const container = target.parentElement;
        if (container) {
            target.style.display = 'none'; 
            // Using semantic colors for error text/container
            container.innerHTML = `<div class="flex flex-col items-center justify-center h-full w-full p-12 text-center text-destructive">
                <FileText className="h-10 w-10 mb-2" /> 
                <p class="font-semibold">Image Failed to Load</p>
                <p class="text-sm text-muted-foreground">The file exists but could not be accessed. Check server logs.</p>
            </div>`;
        }
    };


    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !manuscript) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                    <h2 className="mb-2 text-2xl font-semibold text-foreground">
                        {error ? 'Error Loading Manuscript' : 'Manuscript Not Found'}
                    </h2>
                    <p className="mb-6 text-muted-foreground">
                        {error || "The manuscript you're looking for doesn't exist."}
                    </p>
                    <Button asChild variant="outline">
                        <Link to="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Library
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        // Main page background: bg-background (Set to deep black/darkest gray in config)
        <div className="min-h-screen bg-background font-sans text-foreground">
            {/* Header */}
            <div className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center space-x-4">
                        <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                            <Link to="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Library
                            </Link>
                        </Button>
                        <Separator orientation="vertical" className="h-6 bg-border" />
                        <div>
                            <h1 className="max-w-2xl truncate text-xl font-semibold text-foreground">
                                {manuscript.title}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                by **{manuscript.author}** • {manuscript.period}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowMetadata(!showMetadata)}
                            className="text-muted-foreground"
                        >
                            <BookOpen className="mr-2 h-4 w-4" />
                            {showMetadata ? 'Hide' : 'Show'} Details
                        </Button>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="text-muted-foreground">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Tools
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-2 bg-popover border-border">
                                <div className="space-y-1">
                                    <Button asChild variant="ghost" className="w-full justify-start text-popover-foreground hover:bg-accent">
                                        <a
                                            href={getAbsoluteFileUrl(manuscript.files[activeImageIndex])}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            View Full Image
                                        </a>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-popover-foreground hover:bg-accent"
                                        onClick={handleCopyCitation}
                                    >
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copy Citation
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* 12-column grid container */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-12">
                    {/* Main Content Area: Now expands to 12 columns when metadata is hidden */}
                    <div
                        className={cn(
                            'space-y-8 transition-all duration-300 md:col-span-4 lg:col-span-9', // Default width
                            { 'lg:col-span-12': !showMetadata } // <--- CRITICAL CHANGE: Go full width (12) when hidden
                        )}
                    >
                        {/* Manuscript Images Card */}
                        <Card className="rounded-xl border-border bg-card shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between rounded-t-xl border-b border-border bg-muted/30 p-4">
                                <div className="flex items-center space-x-3">
                                    <Image className="h-5 w-5 text-muted-foreground" />
                                    <CardTitle className="text-xl font-bold text-foreground">
                                        Original Manuscript Pages
                                    </CardTitle>
                                    <Badge variant="outline" className="ml-2 border-border text-muted-foreground">
                                        {manuscript.files.length} pages
                                    </Badge>
                                </div>
                                <Badge variant="secondary" className="px-3 py-1 bg-secondary text-secondary-foreground">
                                    Page {activeImageIndex + 1} of {manuscript.files.length}
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-4">
                                <Carousel
                                    className="w-full"
                                    onSelect={(index) => setActiveImageIndex(index || 0)}
                                >
                                    <div className="relative">
                                        <CarouselContent>
                                            {manuscript.files.map((file, index) => (
                                                <CarouselItem key={index}>
                                                    <div className="relative rounded-lg bg-accent shadow-inner flex items-center justify-center min-h-[500px]">
                                                        {isFileImage(file) ? (
                                                            <img
                                                                src={getAbsoluteFileUrl(file)}
                                                                alt={`Manuscript page ${index + 1}`}
                                                                className="mx-auto h-auto max-h-[700px] w-full object-contain p-4"
                                                                onError={handleMainImageError}
                                                            />
                                                        ) : (
                                                            <div className='flex flex-col items-center justify-center p-12 text-center text-muted-foreground'>
                                                                <FileText className="h-10 w-10 mb-2" />
                                                                <p className="font-semibold">Document View Required</p>
                                                                <p className="text-sm">This file is a non-image format (e.g., PDF) and cannot be previewed directly.</p>
                                                                <Button 
                                                                    asChild 
                                                                    variant="outline" 
                                                                    size="sm" 
                                                                    className='mt-3 border-border text-muted-foreground hover:bg-accent'
                                                                >
                                                                    <a 
                                                                        href={getAbsoluteFileUrl(file)} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer" 
                                                                        className="text-muted-foreground hover:text-foreground"
                                                                    >
                                                                        Open Document <ExternalLink className="ml-2 h-4 w-4" />
                                                                    </a>
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious className="left-2" />
                                        <CarouselNext className="right-2" />
                                    </div>
                                </Carousel>
                                {/* Page Thumbnails - Neutral Border for active state */}
                                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                                    {manuscript.files.map((file, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImageIndex(index)}
                                            className={cn(
                                                'h-16 w-12 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all',
                                                {
                                                    'border-ring ring-2 ring-ring/20':
                                                        activeImageIndex === index,
                                                    'border-border': activeImageIndex !== index,
                                                },
                                                'hover:border-ring/60' 
                                            )}
                                        >
                                            {isFileImage(file) ? (
                                                <img
                                                    src={getAbsoluteFileUrl(file)}
                                                    alt={`Page ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        const container = target.parentElement;
                                                        if (container) {
                                                            target.style.display = 'none';
                                                            container.innerHTML = `<div class="h-full w-full flex items-center justify-center bg-accent">${FileTextSvg}</div>`;
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-accent">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Research Content Card */}
                        <Card className="rounded-xl border-border bg-card shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between rounded-t-xl border-b border-border bg-muted/30 p-4">
                                <div className="flex items-center space-x-3">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <CardTitle className="text-xl font-bold text-foreground">
                                        Research & Commentary
                                    </CardTitle>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="group text-muted-foreground"
                                        onClick={() => setTextZoom(Math.max(80, textZoom - 10))}
                                        disabled={textZoom <= 80}
                                    >
                                        <ZoomOut className="h-4 w-4" />
                                    </Button>
                                    <span className="min-w-[3rem] text-center text-sm font-medium text-muted-foreground">
                                        {textZoom}%
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="group text-muted-foreground"
                                        onClick={() => setTextZoom(Math.min(150, textZoom + 10))}
                                        disabled={textZoom >= 150}
                                    >
                                        <ZoomIn className="h-4 w-4" />
                                    </Button>
                                    <Separator orientation="vertical" className="h-6 bg-border" />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="group text-muted-foreground"
                                        onClick={() => setIsFullscreen(!isFullscreen)}
                                    >
                                        <Maximize2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div
                                    className={cn('bg-card', {
                                        'fixed inset-0 z-50 overflow-auto': isFullscreen,
                                    })}
                                >
                                    <div
                                        className={cn('p-8 transition-all duration-300', {
                                            'max-w-4xl mx-auto p-12': isFullscreen,
                                        })}
                                    >
                                        <div
                                            className="prose prose-lg max-w-none font-serif leading-relaxed text-foreground dark:prose-invert"
                                            style={{ fontSize: `${textZoom}%` }}
                                            dangerouslySetInnerHTML={{ __html: manuscript.description }}
                                        />
                                    </div>

                                    {isFullscreen && (
                                        <Button
                                            className="fixed right-6 top-6 z-60 shadow-lg text-muted-foreground"
                                            onClick={() => setIsFullscreen(false)}
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Exit Fullscreen
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar: Only renders when showMetadata is true */}
                    {showMetadata && (
                        <div
                            // CRITICAL CHANGE: Removed the unnecessary conditional class here
                            className={'space-y-6 transition-all duration-300 md:col-span-4 lg:col-span-3'} 
                        >
                            <div className="sticky top-24 space-y-6">
                                <Card className="rounded-xl border-border bg-card shadow-lg">
                                    <CardHeader className="border-b border-border p-4">
                                        <CardTitle className="text-xl font-bold text-foreground">
                                            Manuscript Details
                                        </CardTitle>
                                        <CardDescription className="text-sm text-muted-foreground">
                                            Key metadata and context.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="space-y-4 text-sm text-foreground">
                                            <div className="flex items-center space-x-3">
                                                <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                                <div>
                                                    <p className="font-semibold">Author</p>
                                                    <p>{manuscript.author}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                                <div>
                                                    <p className="font-semibold">Period</p>
                                                    <p>{manuscript.period}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Globe className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                                <div>
                                                    <p className="font-semibold">Language</p>
                                                    <p>{manuscript.language}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <BookOpen className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                                <div>
                                                    <p className="font-semibold">Category</p>
                                                    <p>{manuscript.category}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Separator className="my-4 bg-border" />
                                        <div>
                                            <div className="mb-2 flex items-center space-x-2">
                                                <Tag className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                                <p className="text-sm font-semibold text-foreground">
                                                    Keywords
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {manuscript.keywords.map((keyword, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className="text-xs bg-secondary text-secondary-foreground"
                                                    >
                                                        {keyword}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManuscriptDetailPage;