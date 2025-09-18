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
  Search,
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

const ManuscriptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [textZoom, setTextZoom] = useState(100);
  const [showMetadata, setShowMetadata] = useState(true);

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500 dark:text-gray-400" />
      </div>
    );
  }

  if (error || !manuscript) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <FileText className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {error ? 'Error Loading Manuscript' : 'Manuscript Not Found'}
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 dark:bg-gray-950 dark:text-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Library
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6 bg-gray-300 dark:bg-gray-600" />
            <div>
              <h1 className="max-w-2xl truncate text-xl font-semibold text-gray-900 dark:text-gray-100">
                {manuscript.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                by **{manuscript.author}** • {manuscript.period}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMetadata(!showMetadata)}
              className="text-gray-600 dark:text-gray-400"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              {showMetadata ? 'Hide' : 'Show'} Details
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-400">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tools
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 bg-white dark:bg-gray-800 border dark:border-gray-700">
                <div className="space-y-1">
                  <Button asChild variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <a
                      href={`http://localhost:4000${manuscript.files[activeImageIndex]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Full Image
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-12">
          {/* Main Content Area */}
          <div
            className={cn(
              'space-y-8 transition-all duration-300 md:col-span-3 lg:col-span-9',
              { 'md:col-span-4 lg:col-span-10': !showMetadata }
            )}
          >
            {/* Manuscript Images */}
            <Card className="rounded-xl border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <CardHeader className="bg-gray-50/50 flex flex-row items-center justify-between rounded-t-xl border-b border-gray-200 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center space-x-3">
                  <Image className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Original Manuscript Pages
                  </CardTitle>
                  <Badge variant="outline" className="ml-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                    {manuscript.files.length} pages
                  </Badge>
                </div>
                <Badge variant="secondary" className="px-3 py-1 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
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
                          <div className="relative rounded-lg bg-gray-100 shadow-inner dark:bg-gray-800">
                            <img
                              src={`http://localhost:4000${file}`}
                              alt={`Manuscript page ${index + 1}`}
                              className="mx-auto h-auto max-h-[700px] w-full object-contain p-4"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </div>
                </Carousel>
                {/* Page Thumbnails */}
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {manuscript.files.map((file, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={cn(
                        'h-16 w-12 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all hover:border-indigo-400 dark:hover:border-indigo-300',
                        {
                          'border-indigo-500 ring-2 ring-indigo-200 dark:border-indigo-400 dark:ring-indigo-700':
                            activeImageIndex === index,
                          'border-gray-200 dark:border-gray-700': activeImageIndex !== index,
                        }
                      )}
                    >
                      <img
                        src={`http://localhost:4000${file}`}
                        alt={`Page ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Research Content */}
            <Card className="rounded-xl border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <CardHeader className="flex flex-row items-center justify-between rounded-t-xl border-b border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Research & Commentary
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="group text-gray-600 dark:text-gray-400"
                    onClick={() => setTextZoom(Math.max(80, textZoom - 10))}
                    disabled={textZoom <= 80}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[3rem] text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    {textZoom}%
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="group text-gray-600 dark:text-gray-400"
                    onClick={() => setTextZoom(Math.min(150, textZoom + 10))}
                    disabled={textZoom >= 150}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6 bg-gray-300 dark:bg-gray-600" />
                  <Button
                    variant="outline"
                    size="sm"
                    className="group text-gray-600 dark:text-gray-400"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  className={cn('bg-white dark:bg-gray-900', {
                    'fixed inset-0 z-50 overflow-auto': isFullscreen,
                  })}
                >
                  <div
                    className={cn('p-8 transition-all duration-300', {
                      'max-w-4xl mx-auto p-12': isFullscreen,
                    })}
                  >
                    {/* The `description` from the backend is rendered here */}
                    <div
                      className="prose prose-lg max-w-none font-serif leading-relaxed text-gray-800 dark:text-gray-200 dark:prose-invert"
                      style={{ fontSize: `${textZoom}%` }}
                      dangerouslySetInnerHTML={{ __html: manuscript.description }}
                    />
                  </div>

                  {isFullscreen && (
                    <Button
                      className="fixed right-6 top-6 z-60 shadow-lg text-gray-600 dark:text-gray-400"
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

          {/* Sidebar */}
          {showMetadata && (
            <div
              className={cn(
                'space-y-6 transition-all duration-300 md:col-span-1 lg:col-span-3',
                {
                  'md:col-span-0 lg:col-span-2': !showMetadata,
                }
              )}
            >
              <div className="sticky top-24 space-y-6">
                <Card className="rounded-xl border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                  <CardHeader className="border-b border-gray-200 p-4 dark:border-gray-700">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Manuscript Details
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                      Key metadata and context.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                        <div>
                          <p className="font-semibold">Author</p>
                          <p>{manuscript.author}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                        <div>
                          <p className="font-semibold">Period</p>
                          <p>{manuscript.period}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                        <div>
                          <p className="font-semibold">Language</p>
                          <p>{manuscript.language}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                        <div>
                          <p className="font-semibold">Category</p>
                          <p>{manuscript.category}</p>
                        </div>
                      </div>
                    </div>
                    <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />
                    <div>
                      <div className="mb-2 flex items-center space-x-2">
                        <Tag className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Keywords
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {manuscript.keywords.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
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