import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ManuscriptModal from '@/components/manuscript/ManuscriptModal';
import { BookOpen, Heart, Users, Scroll, ArrowRight, Star } from 'lucide-react';
import heroImage from '@/assets/hero-manuscripts.jpg';
import kalpaSutraThumb from '@/assets/kalpa-sutra.png'; // Adjust path based on exact file structure
import acharangaSutraThumb from '@/assets/achranga-sutra.png'; 
import tattvarthaSutraThumb from '@/assets/tattvartha-sutra.png'; 


const HomePage: React.FC = () => {
  const [selectedManuscript, setSelectedManuscript] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Mock featured manuscripts
const featuredManuscripts = [
  {
    id: '1',
    title: 'ज्वर त्रिशंति',
    author: 'ज्वर त्रिशंति',
    category: 'Philosophy',
    // Use the imported variable
    thumbnail: kalpaSutraThumb, 
    language: 'Sanskrit'
  },
  {
    id: '2',
    title: 'आचारांग सूत्र',
    author: 'भगवान महावीर',
    category: 'Scripture',
    // Use the imported variable
    thumbnail: acharangaSutraThumb, 
    language: 'Prakrit'
  },
  {
    id: '3',
    title: 'पथ्यापथ्य',
    author: 'पथ्यापथ्य ',
    category: 'Philosophy',
    // Use the imported variable
    thumbnail: tattvarthaSutraThumb, 
    language: 'Sanskrit'
  }
];

// ... rest of your code that uses featuredManuscripts

  const bentoCards = [
    {
      title: 'Jain History',
      description: 'Explore 2,500 years of Jain heritage and the lives of 24 Tirthankaras',
      icon: <Scroll className="h-8 w-8" />,
      className: 'md:col-span-2 md:row-span-2',
      gradient: 'bg-gradient-saffron'
    },
    {
      title: 'Core Principles',
      description: 'Ahimsa, Satya, and the path to liberation',
      icon: <Heart className="h-6 w-6" />,
      className: 'md:col-span-1',
      gradient: 'bg-gradient-maroon'
    },
    {
      title: 'Prosperity & Culture',
      description: 'Rich traditions in art, literature, and philosophy',
      icon: <Star className="h-6 w-6" />,
      className: 'md:col-span-1',
      gradient: 'bg-gradient-gold'
    },
    {
      title: 'Global Community',
      description: 'Connecting Jain scholars and practitioners worldwide',
      icon: <Users className="h-6 w-6" />,
      className: 'md:col-span-2',
      gradient: 'bg-gradient-parchment border border-accent/20'
    }
  ];

  const handleCardClick = (manuscript: any) => {
    setSelectedManuscript(manuscript);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedManuscript(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Ancient Jain Manuscripts"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-parchment/80" />
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground">
            Preserving Sacred
            <span className="block text-primary">Jain Heritage</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover ancient wisdom through digitally preserved manuscripts, 
            fostering research and spiritual growth for future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="lg" className="btn-hover">
              <Link to="/browse">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Manuscripts
              </Link>
            </Button>
<Button asChild variant="heritage" size="lg" className="btn-hover">
  <Link to="/LearnJainismPage"> 
    Learn About Jainism
    <ArrowRight className="ml-2 h-5 w-5" />
  </Link>
</Button>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              The Essence of Jainism
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Understanding the profound teachings and cultural richness of one of the world's oldest religions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {bentoCards.map((card, index) => (
              <Card
                key={index}
                className={`bento-card ${card.className} ${card.gradient} text-white border-0 relative overflow-hidden`}
              >
                <CardHeader className="relative z-10">
                  <div className="flex items-center space-x-3 mb-2">
                    {card.icon}
                    <CardTitle className="font-serif text-xl">
                      {card.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-white/90">{card.description}</p>
                </CardContent>
                <div className="absolute inset-0 bg-black/20" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Manuscripts */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Featured Manuscripts
              </h2>
              <p className="text-muted-foreground text-lg">
                Explore some of our most treasured digital collections
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link to="/browse">
                View All Manuscripts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredManuscripts.map((manuscript) => (
              <Card key={manuscript.id} className="manuscript-card group cursor-pointer" onClick={() => handleCardClick(manuscript)}>
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={manuscript.thumbnail}
                      alt={manuscript.title}
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                        {manuscript.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-serif text-lg font-semibold mb-2">
                    {manuscript.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    by {manuscript.author}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {manuscript.language}
                    </Badge>
          
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-parchment border border-accent/20 text-center p-8 lg:p-12">
            <CardContent className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold">
                Join Our Research Community
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Become part of a global community dedicated to preserving and studying Jain manuscripts. 
                Contribute to research, add annotations, and help preserve this sacred heritage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="hero" size="lg">
                  <Link to="/signup">Join as Researcher</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Manuscript Modal */}
      <ManuscriptModal
        manuscript={selectedManuscript}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default HomePage;