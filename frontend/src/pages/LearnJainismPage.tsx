import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Diamond, ScrollText, BookOpen, Hand, Users, Sparkles, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

const LearnJainismPage: React.FC = () => {
  // 1. STATE FOR LANGUAGE SWITCH
  const [language, setLanguage] = useState('hi'); // 'hi' for Hindi, 'en' for English

  // 2. TOGGLE FUNCTION
  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === 'hi' ? 'en' : 'hi'));
  };
  
  // Helper function for simple string translation
  const t = (hindi, english) => {
    return language === 'hi' ? hindi : english;
  };

  // 3. HINDI AND ENGLISH DATA STRUCTURES

  // Data for the Core Ethical Principles
  const coreConceptsHi = [
    {
      title: 'अहिंसा (Non-Violence)',
      description: 'मन, वचन या कर्म से किसी भी जीव को नुकसान पहुँचाने से बचें।',
      icon: <Hand className="h-6 w-6 text-red-600 dark:text-red-400 fill-red-100 dark:fill-red-900/20" />,
      gradient: 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/40 dark:to-red-800/30',
    },
    {
      title: 'अपरिग्रह (Non-Possessiveness)',
      description: 'लोभ और स्वार्थ को कम करने के लिए संपत्ति के प्रति आसक्ति को सीमित करें।',
      icon: <Users className="h-6 w-6 text-green-600 dark:text-green-400 fill-green-100 dark:fill-green-900/20" />,
      gradient: 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/40 dark:to-green-800/30',
    },
    {
      title: 'अनेकान्तवाद (Multiple Perspectives)',
      description: 'सत्य को विभिन्न दृष्टिकोणों से देखा जा सकता है, जो सहिष्णुता और समझ को बढ़ावा देता है।',
      icon: <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 fill-blue-100 dark:fill-blue-900/20" />,
      gradient: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/40 dark:to-blue-800/30',
    },
  ];

  const coreConceptsEn = [
    {
      title: 'Ahimsa (Non-Violence)',
      description: 'Abstain from causing harm to any living being in thought, word, or deed.',
      icon: <Hand className="h-6 w-6 text-red-600 dark:text-red-400 fill-red-100 dark:fill-red-900/20" />,
      gradient: 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/40 dark:to-red-800/30',
    },
    {
      title: 'Aparigraha (Non-Possessiveness)',
      description: 'Limit attachment to possessions to reduce greed and selfishness.',
      icon: <Users className="h-6 w-6 text-green-600 dark:text-green-400 fill-green-100 dark:fill-green-900/20" />,
      gradient: 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/40 dark:to-green-800/30',
    },
    {
      title: 'Anekantavada (Multiple Perspectives)',
      description: 'Truth can be seen from different viewpoints, promoting tolerance and understanding.',
      icon: <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 fill-blue-100 dark:fill-blue-900/20" />,
      gradient: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/40 dark:to-blue-800/30',
    },
  ];

  // Data for The Three Jewels
  const threeJewelsHi = [
    {
      jewel: 'सम्यक श्रद्धा',
      meaning: 'सत्य में विश्वास',
      explanation: 'जैन धर्म के मूलभूत सत्यों में विश्वास और प्रबुद्ध पुरुषों द्वारा दिखाए गए मार्ग पर भरोसा।',
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      jewel: 'सम्यक ज्ञान',
      meaning: 'वास्तविकता को समझना',
      explanation: 'वास्तविकता की स्पष्ट समझ, जिसमें आत्मा और अनात्मा के बीच का संबंध भी शामिल है।',
      color: 'text-teal-600 dark:text-teal-400',
    },
    {
      jewel: 'सम्यक आचरण',
      meaning: 'नैतिक जीवन',
      explanation: 'पाँच महाव्रतों के माध्यम से नैतिक अनुशासन का अभ्यास: अहिंसा, सत्य, अस्तेय, सतीत्व और अपरिग्रह।',
      color: 'text-purple-600 dark:text-purple-400',
    },
  ];
  
  const threeJewelsEn = [
    {
      jewel: 'Right Faith',
      meaning: 'Trust in the Truth',
      explanation: 'Belief in the fundamental truths of Jainism and trust in the path shown by enlightened beings.',
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      jewel: 'Right Knowledge',
      meaning: 'Understanding Reality',
      explanation: 'Clear understanding of reality, including the relationship between soul and non-soul.',
      color: 'text-teal-600 dark:text-teal-400',
    },
    {
      jewel: 'Right Conduct',
      meaning: 'Ethical Living',
      explanation: 'Practicing ethical discipline through the Five Great Vows: non-violence, truthfulness, non-stealing, chastity, and non-possessiveness.',
      color: 'text-purple-600 dark:text-purple-400',
    },
  ];

  // Data for The Nine Fundamentals (Tattvas)
  const nineTattvasHi = [
    { term: 'आत्मा', meaning: 'जीव' },
    { term: 'अनात्मा', meaning: 'निर्जीव पदार्थ' },
    { term: 'कर्म का अंतर्वाह', meaning: 'कर्म का आत्मा में प्रवेश' },
    { term: 'कर्म का बंधन', meaning: 'कर्म का आत्मा से लगाव' },
    { term: 'पुण्य', meaning: 'शुभ कर्म' },
    { term: 'पाप', meaning: 'बुरा कर्म' },
    { term: 'कर्म का निरोध', meaning: 'नए कर्म को बंधन से रोकना' },
    { term: 'कर्म का त्याग', meaning: 'पुराने कर्मों का उन्मूलन' },
    { term: 'मुक्ति', meaning: 'जन्म-मरण के चक्र से मुक्ति' },
  ];
  
  const nineTattvasEn = [
    { term: 'Soul', meaning: 'Living Being' },
    { term: 'Non-Soul', meaning: 'Non-Living Substance' },
    { term: 'Inflow of Karma', meaning: 'Karma entering the soul' },
    { term: 'Bondage of Karma', meaning: 'Attachment of karma to the soul' },
    { term: 'Merit', meaning: 'Good Karma' },
    { term: 'Sin', meaning: 'Bad Karma' },
    { term: 'Stopping Karma', meaning: 'Preventing new karma from binding' },
    { term: 'Shedding Karma', meaning: 'Eliminating old karma' },
    { term: 'Liberation', meaning: 'Freedom from cycle of birth and death' },
  ];

  // Dynamically select the correct arrays
  const coreConcepts = language === 'hi' ? coreConceptsHi : coreConceptsEn;
  const threeJewels = language === 'hi' ? threeJewelsHi : threeJewelsEn;
  const nineTattvas = language === 'hi' ? nineTattvasHi : nineTattvasEn;


  return (
    <div className="min-h-screen pt-16 pb-24 bg-gradient-to-b from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Language Switch Button */}
        <div className="text-right mb-4">
            {/* Assuming 'Button' is a custom component, replace with a standard button if needed */}
            <Button 
                onClick={toggleLanguage} 
                variant="outline" 
                className="bg-white/70 dark:bg-gray-700/70 border-yellow-500/50 hover:bg-yellow-100 dark:hover:bg-gray-800 text-foreground dark:text-gray-100"
            >
                <Languages className="h-4 w-4 mr-2" />
                {language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
            </Button>
        </div>


        {/* Header Section */}
        <header className="text-center mb-20">
          <Badge variant="heritage" className="text-sm px-4 py-2 mb-3 shadow-sm bg-gradient-to-r from-yellow-200 to-yellow-100 dark:from-yellow-700 dark:to-yellow-600 text-foreground dark:text-gray-100">
            {t('मुख्य दर्शन', 'Core Philosophy')}
          </Badge>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-foreground dark:text-white drop-shadow-md">
            {t('जैन धर्म को समझना', 'Understanding Jainism')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t(
              'जैन धर्म के आवश्यक सिद्धांतों, नैतिक व्रतों और आध्यात्मिक लक्ष्यों के लिए एक व्यापक मार्गदर्शिका।', 
              'A comprehensive guide to the essential tenets, ethical vows, and spiritual goals of Jainism.'
            )}
          </p>
        </header>

        {/* What is Jainism Section */}
        <section className="mb-20 bg-white/80 dark:bg-gray-900/60 p-8 md:p-12 rounded-3xl shadow-xl backdrop-blur-md transition-colors duration-500">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-center text-primary dark:text-yellow-300 relative">
            {t('जैन धर्म क्या है?', 'What is Jainism?')}
          </h2>
          <div className="space-y-4 max-w-4xl mx-auto text-foreground dark:text-gray-200 text-lg leading-relaxed">
            <p>
              {t(
                'जैन धर्म एक प्राचीन भारतीय धर्म है जो अहिंसा, सत्य और आत्म-अनुशासन के माध्यम से आध्यात्मिक शुद्धता और मुक्ति की शिक्षा देता है।', 
                'Jainism is an ancient Indian religion teaching spiritual purity and liberation through non-violence, truth, and self-discipline.'
              )}
            </p>
            <p>
              {t(
                'यह नैतिक जीवन, सभी प्राणियों के प्रति करुणा और अपने कार्यों के लिए व्यक्तिगत ज़िम्मेदारी पर ज़ोर देता है।', 
                'It emphasizes ethical living, compassion for all beings, and personal responsibility for one’s actions.'
              )}
            </p>

            <h3 className="font-semibold text-xl mt-4 text-primary dark:text-yellow-300">
              {t('मुख्य मान्यताएँ:', 'Core Beliefs:')}
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>{t('अहिंसा:', 'Non-Violence (Ahimsa):')}</strong> {t('किसी भी जीव को नुकसान पहुँचाने से बचें।', 'Avoid harming any living being.')}</li>
              <li><strong>{t('अपरिग्रह:', 'Non-Possessiveness (Aparigraha):')}</strong> {t('संपत्ति के प्रति आसक्ति को सीमित करें।', 'Limit attachment to possessions.')}</li>
              <li><strong>{t('विविध दृष्टिकोण (अनेकान्तवाद):', 'Multiple Perspectives (Anekantavada):')}</strong> {t('स्वीकार करें कि सत्य को विभिन्न दृष्टिकोणों से देखा जा सकता है।', 'Accept that truth can be seen from different viewpoints.')}</li>
            </ul>

            <h3 className="font-semibold text-xl mt-4 text-primary dark:text-yellow-300">
              {t('त्रिरत्न:', 'The Three Jewels:')}
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>{t('सम्यक श्रद्धा:', 'Right Faith:')}</strong> {t('जैन सत्यों में विश्वास।', 'Belief in Jain truths.')}</li>
              <li><strong>{t('सम्यक ज्ञान:', 'Right Knowledge:')}</strong> {t('वास्तविकता और आत्मा को समझना।', 'Understanding reality and the soul.')}</li>
              <li><strong>{t('सम्यक आचरण:', 'Right Conduct:')}</strong> {t('नैतिक जीवन और व्रतों का पालन।', 'Ethical living and following vows.')}</li>
            </ul>

            <h3 className="font-semibold text-xl mt-4 text-primary dark:text-yellow-300">
              {t('नैतिक आचरण:', 'Ethical Practices:')}
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>{t('जीवों को नुकसान न पहुँचाएँ।', 'Do not harm living beings.')}</li>
              <li>{t('सत्य बोलें।', 'Speak the truth.')}</li>
              <li>{t('चोरी से बचें।', 'Avoid stealing.')}</li>
              <li>{t('पवित्रता का पालन करें।', 'Practice chastity.')}</li>
              <li>{t('भौतिक संपत्ति को सीमित करें।', 'Limit material possessions.')}</li>
            </ul>

            <h3 className="font-semibold text-xl mt-4 text-primary dark:text-yellow-300">
              {t('लक्ष्य:', 'Goal:')}
            </h3>
            <p>
              {t(
                'परम लक्ष्य ', 
                'The ultimate goal is '
              )}
              <strong>{t('मुक्ति', 'Liberation')}</strong> 
              {t(
                ' है – आत्मा को जन्म-मृत्यु और कर्म के चक्र से मुक्त करना।', 
                ' – freeing the soul from the cycle of birth and death and karma.'
              )}
            </p>
          </div>
        </section>

        {/* The Three Jewels */}
        <section className="mb-20">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-10 text-center flex items-center justify-center text-primary dark:text-yellow-300">
            <Diamond className="h-7 w-7 mr-3 text-yellow-500 dark:text-yellow-400" /> {t('त्रिरत्न', 'The Three Jewels')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {threeJewels.map((jewel, index) => (
              <Card key={index} className={`shadow-xl hover:shadow-2xl border-t-4 ${jewel.color.replace('text', 'border')} transition-all duration-300 rounded-2xl bg-white/90 dark:bg-gray-800/60`}>
                <CardHeader>
                  <CardTitle className={`font-serif text-2xl ${jewel.color}`}>
                    {jewel.jewel}
                  </CardTitle>
                  <p className="text-muted-foreground dark:text-gray-300 text-sm font-semibold">({jewel.meaning})</p>
                </CardHeader>
                <CardContent className="text-foreground/90 dark:text-gray-200 text-base">
                  {jewel.explanation}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Core Ethical Principles */}
        <section className="mb-20">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-10 text-center flex items-center justify-center text-foreground dark:text-white">
            <Heart className="h-7 w-7 mr-3 text-red-600 dark:text-red-400" /> {t('मौलिक नैतिक सिद्धांत', 'Fundamental Ethical Principles')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreConcepts.map((concept, index) => (
              <Card key={index} className={`shadow-md hover:shadow-lg ${concept.gradient} rounded-2xl transition-transform transform hover:-translate-y-1`}>
                <CardHeader>
                  <div className="flex items-center space-x-3 text-foreground/90 dark:text-gray-200">
                    {concept.icon}
                    <CardTitle className="font-serif text-xl">{concept.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-foreground/90 dark:text-gray-200 text-base">
                  {concept.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* The Nine Fundamentals */}
        <section className="mb-20">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-10 text-center flex items-center justify-center text-primary dark:text-yellow-300">
            <ScrollText className="h-7 w-7 mr-3 text-blue-500 dark:text-blue-400" /> {t('नौ मूल सिद्धांत', 'The Nine Fundamentals')}
          </h2>
          <Card className="shadow-2xl p-6 md:p-10 rounded-3xl bg-white/80 dark:bg-gray-900/60 backdrop-blur-md transition-colors duration-500">
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {nineTattvas.map((tattva, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Badge className="bg-primary hover:bg-primary/90 text-white flex-shrink-0 mt-1">
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-semibold text-foreground dark:text-gray-200 text-lg">{tattva.term}</p>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">{tattva.meaning}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Callout: Liberation */}
        <section className="mt-20">
          <Card className="bg-gradient-to-r from-red-800 to-red-600 text-white text-center p-10 md:p-16 shadow-2xl rounded-3xl">
            <CardContent className="space-y-6">
              <Sparkles className="h-12 w-12 mx-auto text-yellow-300" />
              <h3 className="font-serif text-3xl md:text-4xl font-bold">
                {t('परम लक्ष्य: मुक्ति', 'The Ultimate Goal: Liberation')}
              </h3>
              <p className="text-white/90 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
                {t(
                  'मुक्ति, जन्म-मरण के चक्र और कर्म के बंधन से आत्मा की पूर्ण मुक्ति का प्रतिनिधित्व करती है। यह सम्यक् श्रद्धा, सम्यक् ज्ञान और सम्यक् आचरण के मार्ग पर चलकर प्राप्त होती है।', 
                  'Liberation represents the complete freedom of the soul from the cycle of birth and death and the bondage of karma. It is attained by following the path of Right Faith, Right Knowledge, and Right Conduct.'
                )}
              </p>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
};

export default LearnJainismPage;