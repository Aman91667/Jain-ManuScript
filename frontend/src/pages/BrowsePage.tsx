import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import ManuscriptCard from '@/components/manuscript/ManuscriptCard';
import ManuscriptModal from '@/components/manuscript/ManuscriptModal';
import { manuscriptService, Manuscript as ServiceManuscript } from '@/services/manuscriptService';
import { useAuth } from '@/contexts/AuthContext';

const BrowsePage: React.FC = () => {
    const { user } = useAuth();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
    const [viewType, setViewType] = useState<'all' | 'public' | 'researcher'>('all'); // Only for admin
    const [manuscripts, setManuscripts] = useState<ServiceManuscript[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedManuscript, setSelectedManuscript] = useState<ServiceManuscript | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const categories = ['all', 'Philosophy', 'Scripture', 'Ethics', 'Mathematics', 'Art', 'Literature'];
    const languages = ['all', 'Sanskrit', 'Prakrit', 'Hindi', 'Gujarati', 'Tamil'];

    // Fetch manuscripts
    useEffect(() => {
        const fetchManuscripts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let fetchedManuscripts: ServiceManuscript[] = [];

                if (user?.role === 'admin') {
                    // Admin sees all manuscripts
                    fetchedManuscripts = await manuscriptService.getAllManuscripts();
                } else if (user?.role === 'researcher' && user.isApproved) {
                    // Approved Researcher sees only Researcher-level manuscripts
                    fetchedManuscripts = await manuscriptService.getResearcherManuscripts();
                } else {
                    // Normal user, unapproved researcher, or unauthenticated sees only Public manuscripts
                    fetchedManuscripts = await manuscriptService.getPublicManuscripts();
                }

                setManuscripts(fetchedManuscripts);
            } catch (err: any) {
                console.error('Error fetching manuscripts:', err);
                setError(err.message || 'Failed to fetch manuscripts.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchManuscripts();
    }, [user]); // Re-fetch when user object (e.g., login/logout) changes

    // Filter manuscripts by search, category, and language
    const filteredManuscripts = manuscripts.filter((m) => {
        const title = m.title?.toLowerCase() || '';
        const author = m.author?.toLowerCase() || '';
        const description = m.description?.toLowerCase() || '';
        const category = m.category?.toLowerCase() || '';
        const language = m.language?.toLowerCase() || '';
        const type = m.uploadType;

        const search = searchQuery.toLowerCase();
        const selectedCat = selectedCategory.toLowerCase();
        const selectedLang = selectedLanguage.toLowerCase();

        const matchesSearch = title.includes(search) || author.includes(search) || description.includes(search);
        const matchesCategory = selectedCat === 'all' || category === selectedCat;
        const matchesLanguage = selectedLang === 'all' || language === selectedLang;

        // Admin view filter: filters the already fetched 'all' list
        const matchesType =
            user?.role === 'admin'
                ? viewType === 'all'
                    ? true
                    : viewType === 'public'
                    ? type === 'normal'
                    : type === 'detailed'
                : true; // For non-admins, the fetching logic already determined the type, so this is always true

        return matchesSearch && matchesCategory && matchesLanguage && matchesType;
    });

    const handleCardClick = (manuscript: ServiceManuscript) => {
        setSelectedManuscript(manuscript);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedManuscript(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="p-6 text-center">
                    <CardContent>
                        <p className="text-blue-500 font-semibold">Please login to access manuscripts</p>
                        <Button onClick={() => (window.location.href = '/login')} className="mt-4">
                            Login / Sign Up
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Browse Manuscripts</h1>
                    <p className="text-muted-foreground text-lg">
                        Discover our collection of {manuscripts.length} digitized Jain manuscripts
                    </p>
                </div>

                {/* Admin toggle: Allows admin to switch between Public and Researcher views */}
                {user.role === 'admin' && (
                    <div className="flex items-center space-x-4 mb-6">
                        <span className="font-medium text-sm">Show:</span>
                        <Button
                            variant={viewType === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewType('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={viewType === 'public' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewType('public')}
                        >
                            Public
                        </Button>
                        <Button
                            variant={viewType === 'researcher' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewType('researcher')}
                        >
                            Researcher
                        </Button>
                    </div>
                )}
                
                {/* Researcher Info message */}
                {user.role === 'researcher' && user.isApproved && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-6 font-medium">
                        You are viewing Researcher-level manuscripts (Type: Detailed).
                    </p>
                )}


                {/* Search & Filters */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center">
                                <Search className="h-5 w-5 mr-2" /> Search & Filter
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className="md:hidden"
                            >
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search by title, author, or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div
                            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${
                                showFilters ? 'block' : 'hidden md:grid'
                            }`}
                        >
                            <div>
                                <label className="text-sm font-medium mb-2 block">Category</label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat === 'all' ? 'All Categories' : cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Language</label>
                                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Languages" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map((lang) => (
                                            <SelectItem key={lang} value={lang}>
                                                {lang === 'all' ? 'All Languages' : lang}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('all');
                                        setSelectedLanguage('all');
                                    }}
                                    className="w-full"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {filteredManuscripts.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">No manuscripts found</h3>
                            <p>Try adjusting your search terms or filters</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredManuscripts.map((manuscript) => (
                            <ManuscriptCard
                                key={manuscript._id}
                                manuscript={manuscript}
                                onCardClick={handleCardClick}
                            />
                        ))}
                    </div>
                )}

                <ManuscriptModal
                    manuscript={selectedManuscript}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onDelete={(deletedId: string) =>
                        setManuscripts((prev) => prev.filter((m) => m._id !== deletedId))
                    }
                />
            </div>
        </div>
    );
};

export default BrowsePage;