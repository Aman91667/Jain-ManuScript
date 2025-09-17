import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ManuscriptCard from '@/components/manuscript/ManuscriptCard';
import ManuscriptModal from '@/components/manuscript/ManuscriptModal';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { manuscriptService } from '@/services/manuscriptService';

interface Manuscript {
  _id: string;
  title: string;
  author?: string;
  category: string;
  createdAt: string;
  description: string;
  thumbnail?: string;
  files: string[];
  language?: string;
  uploadType: 'normal' | 'detailed';
  isApproved: boolean;
}

const BrowsePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['all', 'Philosophy', 'Scripture', 'Ethics', 'Mathematics', 'Art', 'Literature'];
  const languages = ['all', 'Sanskrit', 'Prakrit', 'Hindi', 'Gujarati', 'Tamil'];

  useEffect(() => {
    const fetchManuscripts = async () => {
      setIsLoading(true);
      try {
        const data = await manuscriptService.getManuscripts();
        console.log("Fetched manuscripts:", data);
        setManuscripts(data);
      } catch (err: any) {
        console.error("Error fetching manuscripts:", err);
        setError("Failed to fetch manuscripts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchManuscripts();
  }, []);

  const filteredManuscripts = manuscripts.filter((manuscript) => {
    const title = manuscript.title?.toLowerCase() || '';
    const author = manuscript.author?.toLowerCase() || '';
    const description = manuscript.description?.toLowerCase() || '';
    const category = manuscript.category?.toLowerCase() || '';
    const language = manuscript.language?.toLowerCase() || '';

    const search = searchQuery.toLowerCase();
    const selectedCat = selectedCategory.toLowerCase();
    const selectedLang = selectedLanguage.toLowerCase();

    const matchesSearch =
      title.includes(search) || author.includes(search) || description.includes(search);

    const matchesCategory =
      selectedCat === 'all' || !category || category === selectedCat;

    const matchesLanguage =
      selectedLang === 'all' || !language || language === selectedLang;

    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const handleCardClick = (manuscript: Manuscript) => {
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

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-6 text-center">
          <CardContent>
            <p className="text-red-500 font-semibold">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
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
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Browse Manuscripts
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover our collection of {manuscripts.length} digitized Jain manuscripts
          </p>
        </div>

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

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
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
                    {languages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language === 'all' ? 'All Languages' : language}
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
        />
      </div>
    </div>
  );
};

export default BrowsePage;
