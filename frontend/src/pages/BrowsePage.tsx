import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ManuscriptCard from '@/components/manuscript/ManuscriptCard';
import ManuscriptModal from '@/components/manuscript/ManuscriptModal';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

interface Manuscript {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  description: string;
  thumbnail: string;
  language: string;
}

const BrowsePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data - replace with actual API calls
  const mockManuscripts: Manuscript[] = [
    {
      id: '1',
      title: 'Kalpa Sutra',
      author: 'Acharya Bhadrabahu',
      category: 'Philosophy',
      date: '4th Century BCE',
      description: 'The Kalpa Sutra is a Jain text containing the biographies of the Jain Tirthankaras, most notably Parshva and Mahavira.',
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
      language: 'Sanskrit'
    },
    {
      id: '2',
      title: 'Acharanga Sutra',
      author: 'Lord Mahavira',
      category: 'Scripture',
      date: '6th Century BCE',
      description: 'The first agama of the 12 main agamas, containing the fundamental teachings of Lord Mahavira.',
      thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      language: 'Prakrit'
    },
    {
      id: '3',
      title: 'Tattvartha Sutra',
      author: 'Umaswami',
      category: 'Philosophy',
      date: '2nd Century CE',
      description: 'A foundational text that systematically presents the essential principles of Jainism.',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      language: 'Sanskrit'
    },
    {
      id: '4',
      title: 'Bhagavati Sutra',
      author: 'Various Acharyas',
      category: 'Scripture',
      date: '3rd Century BCE',
      description: 'The largest and most important of the twelve Jain agamas, containing teachings on various aspects of Jain doctrine.',
      thumbnail: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
      language: 'Prakrit'
    },
    {
      id: '5',
      title: 'Uttaradhyayana Sutra',
      author: 'Multiple Authors',
      category: 'Ethics',
      date: '4th Century BCE',
      description: 'Collection of teachings covering ethics, conduct, and spiritual practices.',
      thumbnail: 'https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?w=400',
      language: 'Prakrit'
    },
    {
      id: '6',
      title: 'Samavayanga Sutra',
      author: 'Ancient Acharyas',
      category: 'Mathematics',
      date: '2nd Century BCE',
      description: 'A mathematical and philosophical text dealing with numerical categorizations.',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
      language: 'Sanskrit'
    }
  ];

  const categories = ['all', 'Philosophy', 'Scripture', 'Ethics', 'Mathematics', 'Art', 'Literature'];
  const languages = ['all', 'Sanskrit', 'Prakrit', 'Hindi', 'Gujarati', 'Tamil'];

  useEffect(() => {
    // Simulate API loading
    setIsLoading(true);
    setTimeout(() => {
      setManuscripts(mockManuscripts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredManuscripts = manuscripts.filter((manuscript) => {
    const matchesSearch = manuscript.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         manuscript.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         manuscript.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || manuscript.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'all' || manuscript.language === selectedLanguage;

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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Browse Manuscripts
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover our collection of {manuscripts.length} digitized Jain manuscripts
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search & Filter
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
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by title, author, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
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

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing {filteredManuscripts.length} of {manuscripts.length} manuscripts
            </p>
            {(selectedCategory !== 'all' || selectedLanguage !== 'all' || searchQuery) && (
              <div className="flex items-center space-x-2">
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="flex items-center">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedLanguage !== 'all' && (
                  <Badge variant="secondary" className="flex items-center">
                    {selectedLanguage}
                    <button
                      onClick={() => setSelectedLanguage('all')}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Manuscripts Grid */}
        {filteredManuscripts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground mb-4">
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No manuscripts found</h3>
                <p>Try adjusting your search terms or filters</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedLanguage('all');
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredManuscripts.map((manuscript) => (
              <ManuscriptCard 
                key={manuscript.id} 
                manuscript={manuscript} 
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        )}

        {/* Manuscript Modal */}
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