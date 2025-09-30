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

// Supporter Images
import hathkargaImage from '@/assets/supporters/hathkargha.webp';
import shantiDharaImage from '@/assets/supporters/shanti-dhara.webp';
import aashishJainImage from '@/assets/supporters/aashish-jain.webp';
import arhamDhyanYogaImage from '@/assets/supporters/अर्हं ध्यान योग.png';

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
  title: language === 'en' ? 'Manuscript Preservation – A Spiritual Vow' : 'पांडुलिपि संरक्षण – एक आध्यात्मिक संकल्प',
  description: language === 'en'
    ? `“This heritage of knowledge is not just words on paper, but nectar that illuminates the soul.”

The Indian Acharya tradition has always been a priceless repository of knowledge, penance, and culture. The life of Acharya Shri Vidyasagar Ji Maharaj is an unparalleled story of penance, sacrifice, and public welfare. Inspired by him, innumerable welfare activities continue in various fields.

The Acharya’s literary endeavors give us guidance today through immortal works like Mookmati, Swapnil, and Anubhuti. His teachings indicate that ancient Jain Acharyas conducted deep research not only in religion, but also in Ayurveda, philosophy, logic, grammar, and literature, creating invaluable classical texts.

From these sacred inspirations, we have initiated the divine work of manuscript preservation and publication. Our resolve is not just to safeguard these texts, but also to transmit the knowledge, science, and culture contained within to future generations. This effort is not only preservation, but also a spiritual practice and an unwavering vow to protect culture.

Currently, Acharya Shri Samaysagar Ji Maharaj guides us on this sacred path with his divine grace, while Shri 108 Pranamy Sagar Ji, the proponent of Arham Yoga, provided initial support to this holy initiative.`
    : `“ज्ञान की यह धरोहर केवल कागज़ पर अंकित शब्द नहीं, अपितु आत्मा को आलोकित करने वाला अमृत है।”

भारतीय आचार्य परंपरा सदैव से ज्ञान, तप और संस्कृति की अमूल्य निधि रही है। आचार्य श्री विद्यासागर जी महाराज का जीवन तप, त्याग और लोककल्याण की अनुपम गाथा है। उनकी प्रेरणा से असंख्य क्षेत्रों में जनकल्याणकारी कार्य सतत् संपन्न हो रहे हैं।

आचार्य श्री की साहित्य साधना मूकमाटी, स्वप्नील, अनुभूति जैसे अमर ग्रंथों के रूप में आज भी हमें मार्गदर्शन देती है। उनके वचनों में स्पष्ट संकेत मिलता है कि प्राचीन जैन आचार्यों ने केवल धर्म ही नहीं, अपितु आयुर्वेद, दर्शन, न्याय, व्याकरण और साहित्य जैसे विषयों पर गहन अनुसंधान कर अमूल्य शास्त्रीय ग्रंथों की रचना की।

इन्हीं पावन प्रेरणाओं से हमने पांडुलिपि संरक्षण एवं प्रकाशन का दिव्य कार्य प्रारंभ किया है। हमारा संकल्प मात्र इन ग्रंथों को सुरक्षित रखना ही नहीं, बल्कि उनमें निहित विज्ञान, संस्कृति और जीवनोपयोगी ज्ञान को भावी पीढ़ियों तक पहुँचाना है। यह प्रयास केवल संरक्षण नहीं, बल्कि एक आध्यात्मिक साधना और संस्कृति रक्षा का अटूट व्रत है।

वर्तमान में आचार्य श्री समयसागर जी महाराज अपनी दिव्य कृपा से इस पावन मार्ग पर हमारा मार्गदर्शन कर रहे हैं, वहीं अर्हम योग के प्रणेता श्री 108 प्रणम्य सागर जी महाराज ने इस पवित्र अभियान को प्रारंभिक सहयोग प्रदान किया।`,
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

  const supporters = [
    {
      name: 'हथकरघा',
      descriptionHi: 'आचार्य महाराज की प्रेरणा से प्रारंभ एक आत्मनिर्भरता आंदोलन, जिसने ग्रामोद्योग, स्वदेशी परंपरा और रोज़गार को नया जीवन दिया।',
      descriptionEn: 'An initiative inspired by Acharya Maharaj to revive village industries, indigenous traditions, and employment.',
      image: hathkargaImage
    },
    {
      name: 'शांति धारा',
      descriptionHi: 'प्राचीन भारतीय संस्कृति के करुणा-संस्कारों को पुनर्जीवित करने का एक अनुपम प्रयास है, जो समाज में दया, शांति और अध्यात्म का अमृत संचार करता है।',
      descriptionEn: 'A unique effort to revive the compassionate values of ancient Indian culture, spreading peace and spirituality.',
      image: shantiDharaImage
    },
    {
      name: 'C.A. Aashish Jain',
      descriptionHi: 'हमारे हमेशा के समर्थक 🌟',
      descriptionEn: 'Our all-time supporter 🌟',
      image: aashishJainImage
    },
    {
      name: 'अर्हं ध्यान योग',
      descriptionHi: 'अर्हं ध्यान योग, भारतीय श्रमण सिद्धांतों "ध्यान योग" की सबसे प्राचीन योग तकनीक है। यह मुनि श्री प्रणम्य सागर जी महाराज द्वारा प्रतिपादित अग्रणी योग संस्थानों में से एक है और भारत सरकार के आयुष मंत्रालय द्वारा मान्यता प्राप्त है।',
      descriptionEn: 'One of the oldest meditation institutions based on the ancient Indian "Dhyan Yoga" principles, recognized by the Ministry of AYUSH.',
      image: arhamDhyanYogaImage
    }
  ];

  const handleCardClick = (manuscript: any) => {
    setSelectedManuscript(manuscript);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
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

 {/* Supporters Section */}
<section className="py-12 lg:py-16 bg-muted/20">
  <div className="container mx-auto px-4">
    <div className="text-center mb-8">
      <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">
        {language === 'en' ? 'Our Supporters' : 'सहयोगकर्ता'}
      </h2>
      <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
        {language === 'en'
          ? 'We are grateful to the following organizations and individuals for their support.'
          : 'हम अपने निम्नलिखित संस्थाओं और व्यक्तियों के समर्थन के लिए आभारी हैं।'}
      </p>
    </div>

    <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-4 items-center justify-items-center">
      <img src={hathkargaImage} alt="हथकरघा" className="h-16 object-contain" />
      <img src={shantiDharaImage} alt="शांति धारा" className="h-16 object-contain" />
      <img src={aashishJainImage} alt="C.A. Aashish Jain" className="h-16 object-contain" />
      <img src={arhamDhyanYogaImage} alt="अर्हं ध्यान योग" className="h-24 object-contain" />
      {/* Add more supporters here */}
    </div>
  </div>
</section>

    </div>
  );
};

export default HomePage;
