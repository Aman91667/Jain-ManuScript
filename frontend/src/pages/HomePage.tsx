import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Heart, Users, Scroll, ArrowRight, Star } from 'lucide-react';
import heroImage from '@/assets/hero-manuscripts.jpg';
import kalpaSutraThumb from '@/assets/kalpa-sutra.png';
import acharangaSutraThumb from '@/assets/achranga-sutra.png'; 
import tattvarthaSutraThumb from '@/assets/tattvartha-sutra.png'; 

const HomePage: React.FC = () => {
  const [selectedManuscript, setSelectedManuscript] = useState<any>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');

  const featuredManuscripts = [
    { id: '1', title: 'ज्वर त्रिशंति', author: 'ज्वर त्रिशंति', category: 'Philosophy', thumbnail: kalpaSutraThumb, language: 'Sanskrit' },
    { id: '2', title: 'आचारांग सूत्र', author: 'भगवान महावीर', category: 'Scripture', thumbnail: acharangaSutraThumb, language: 'Prakrit' },
    { id: '3', title: 'पथ्यापथ्य', author: 'पथ्यापथ्य', category: 'Philosophy', thumbnail: tattvarthaSutraThumb, language: 'Sanskrit' }
  ];

  const bentoCards = [
    {
      title: language === 'en' ? 'Jain History' : 'जैन इतिहास',
      description: language === 'en'
        ? 'Explore 2,500 years of Jain heritage and the lives of 24 Tirthankaras'
        : '2,500 वर्षों की जैन विरासत और 24 तीर्थंकरों के जीवन की गाथा का अन्वेषण करें',
      icon: <Scroll className="h-8 w-8" />,
      className: 'md:col-span-2 md:row-span-2',
      gradient: 'bg-gradient-saffron'
    },
    {
      title: language === 'en' ? 'Core Principles' : 'मूल सिद्धांत',
      description: language === 'en'
        ? 'Ahimsa, Satya, and the path to liberation'
        : 'अहिंसा, सत्य और मोक्ष के मार्ग का पालन',
      icon: <Heart className="h-6 w-6" />,
      className: 'md:col-span-1',
      gradient: 'bg-gradient-maroon'
    },
    {
      title: language === 'en' ? 'Prosperity & Culture' : 'संस्कृति और समृद्धि',
      description: language === 'en'
        ? 'Rich traditions in art, literature, and philosophy'
        : 'कला, साहित्य और दर्शन में जैन परंपराओं की समृद्धि',
      icon: <Star className="h-6 w-6" />,
      className: 'md:col-span-1',
      gradient: 'bg-gradient-gold'
    },
    {
      title: language === 'en' ? 'Global Community' : 'वैश्विक समुदाय',
      description: language === 'en'
        ? 'Connecting Jain scholars and practitioners worldwide'
        : 'दुनियाभर के जैन विद्वानों और अनुयायियों के साथ जुड़ें',
      icon: <Users className="h-6 w-6" />,
      className: 'md:col-span-2',
      gradient: 'bg-gradient-parchment border border-accent/20'
    }
  ];

  const handleCardClick = (manuscript: any) => {
    setSelectedManuscript(manuscript);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // optional: scroll to detail section
  };

  return (
    <div className="min-h-screen relative">
      {/* Language Switch */}
      <div className="absolute top-4 right-4 z-50">
        <Button size="sm" variant="outline" onClick={toggleLanguage}>
          {language === 'en' ? 'हिंदी' : 'English'}
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative pt-8 pb-20 lg:pt-16 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Ancient Jain Manuscripts" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-parchment/80" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground">
            {language === 'en' ? 'Preserving Sacred' : 'पवित्र जैन धरोहर का संरक्षण'}
            <span className="block text-primary">
              {language === 'en' ? 'Jain Heritage' : 'जैन धरोहर'}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {language === 'en'
              ? 'Discover ancient wisdom through digitally preserved manuscripts, fostering research and spiritual growth for future generations.'
              : 'प्राचीन पांडुलिपियों के माध्यम से ज्ञान की इस अमूल्य विरासत की खोज करें। शोध और आध्यात्मिक उन्नति को अगले पीढ़ियों के लिए सहेजें।'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="lg" className="btn-hover">
              <Link to="/browse">
                <BookOpen className="mr-2 h-5 w-5" />
                {language === 'en' ? 'Browse Manuscripts' : 'पांडुलिपियाँ देखें'}
              </Link>
            </Button>
            <Button asChild variant="heritage" size="lg" className="btn-hover">
              <Link to="/LearnJainismPage">
                {language === 'en' ? 'Learn About Jainism' : 'जैन धर्म के गहन शिक्षाओं के बारे में जानें'}
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
              {language === 'en' ? 'The Essence of Jainism' : 'जैन धर्म का सार'}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {language === 'en'
                ? "Understanding the profound teachings and cultural richness of one of the world's oldest religions"
                : "विश्व के सबसे प्राचीन धर्मों में से एक की गहन शिक्षाओं और सांस्कृतिक समृद्धि को समझें।"}
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
                    <CardTitle className="font-serif text-xl">{card.title}</CardTitle>
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
                {language === 'en' ? 'Featured Manuscripts' : 'प्रमुख पांडुलिपियाँ'}
              </h2>
              <p className="text-muted-foreground text-lg">
                {language === 'en'
                  ? 'Explore some of our most treasured digital collections'
                  : 'हमारी संग्रहालय की कुछ सबसे मूल्यवान डिजिटल पांडुलिपियों की खोज करें'}
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link to="/browse">
                {language === 'en' ? 'View All Manuscripts' : 'सभी पांडुलिपियाँ देखें'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredManuscripts.map((manuscript) => (
              <Card
                key={manuscript.id}
                className="manuscript-card group cursor-pointer"
                onClick={() => handleCardClick(manuscript)}
              >
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
                  <h3 className="font-serif text-lg font-semibold mb-2">{manuscript.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">by {manuscript.author}</p>
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

      {/* Dynamic Manuscript Detail Section */}
      {selectedManuscript && (
        <section className="py-16 lg:py-24 bg-muted/10">
          <div className="container mx-auto px-4">
            <Card className="p-6 lg:p-12">
              <CardHeader className="mb-4">
                <h2 className="font-serif text-3xl md:text-4xl font-bold">{selectedManuscript.title}</h2>
                <p className="text-muted-foreground text-sm">
                  by {selectedManuscript.author} | {selectedManuscript.language} | {selectedManuscript.category}
                </p>
              </CardHeader>
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={selectedManuscript.thumbnail}
                  alt={selectedManuscript.title}
                  className="w-full md:w-1/3 h-auto object-cover rounded-lg"
                />
                <CardContent className="md:w-2/3">
                  <p className="text-muted-foreground text-lg">
                    {/* Meaningful description */}
                    {language === 'en'
                      ? 'This manuscript is a precious window into the philosophy, teachings, and cultural legacy of Jainism. Explore its wisdom and reflect upon its eternal values.'
                      : 'यह पांडुलिपि जैन धर्म के दर्शन, शिक्षाओं और सांस्कृतिक विरासत की अमूल्य झलक प्रस्तुत करती है। इसकी गहनता को समझें और इसके शाश्वत मूल्यों पर चिंतन करें।'}
                  </p>
                </CardContent>
              </div>
              <div className="mt-4 text-right">
                <Button size="sm" variant="outline" onClick={() => setSelectedManuscript(null)}>
                  {language === 'en' ? 'Close' : 'बंद करें'}
                </Button>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-parchment border border-accent/20 text-center p-8 lg:p-12">
            <CardContent className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold">
                {language === 'en' ? 'Join Our Research Community' : 'हमारे शोध समुदाय में शामिल हों'}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {language === 'en'
                  ? 'Become part of a global community dedicated to preserving and studying Jain manuscripts. Contribute to research, add annotations, and help preserve this sacred heritage.'
                  : 'जैन पांडुलिपियों के संरक्षण और अध्ययन के लिए समर्पित वैश्विक समुदाय का हिस्सा बनें। शोध में योगदान दें, टिप्पणियाँ जोड़ें और इस पवित्र विरासत को संरक्षित करने में मदद करें।'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="hero" size="lg">
                  <Link to="/signup">{language === 'en' ? 'Join as Researcher' : 'शोधकर्ता के रूप में शामिल हों'}</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">{language === 'en' ? 'Contact Us' : 'संपर्क करें'}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
