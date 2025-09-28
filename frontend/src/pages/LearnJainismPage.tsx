import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Diamond, ScrollText, BookOpen, Hand, Users, Sparkles } from 'lucide-react';

const LearnJainismPage: React.FC = () => {

  const coreConcepts = [
    {
      title: 'Ahimsa (Non-Violence)',
      icon: <Hand className="h-6 w-6 text-red-600 fill-red-100" />,
      description: 'Abstain from causing harm to any living being in thought, word, or deed.',
      gradient: 'bg-gradient-to-br from-red-50 to-red-100/50',
    },
    {
      title: 'Aparigraha (Non-Possessiveness)',
      icon: <Users className="h-6 w-6 text-green-600 fill-green-100" />,
      description: 'Limit attachment to possessions to reduce greed and selfishness.',
      gradient: 'bg-gradient-to-br from-green-50 to-green-100/50',
    },
    {
      title: 'Anekantavada (Multiple Perspectives)',
      icon: <BookOpen className="h-6 w-6 text-blue-600 fill-blue-100" />,
      description: 'Truth can be seen from different viewpoints, promoting tolerance and understanding.',
      gradient: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
    },
  ];

  const threeJewels = [
    {
      jewel: 'Right Faith',
      meaning: 'Trust in the Truth',
      explanation: 'Belief in the fundamental truths of Jainism and trust in the path shown by enlightened beings.',
      color: 'text-yellow-600',
    },
    {
      jewel: 'Right Knowledge',
      meaning: 'Understanding Reality',
      explanation: 'Clear understanding of reality, including the relationship between soul and non-soul.',
      color: 'text-teal-600',
    },
    {
      jewel: 'Right Conduct',
      meaning: 'Ethical Living',
      explanation: 'Practicing ethical discipline through the Five Great Vows: non-violence, truthfulness, non-stealing, chastity, and non-possessiveness.',
      color: 'text-purple-600',
    },
  ];

  const nineTattvas = [
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

  return (
    <div className="min-h-screen pt-16 pb-24 bg-gradient-to-b from-yellow-50 via-white to-yellow-50">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Header Section */}
        <header className="text-center mb-20">
          <Badge variant="heritage" className="text-sm px-4 py-2 mb-3 shadow-sm bg-gradient-to-r from-yellow-200 to-yellow-100">
            Core Philosophy
          </Badge>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-foreground drop-shadow-md">
            Understanding Jainism
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A comprehensive guide to the essential tenets, ethical vows, and spiritual goals of Jainism.
          </p>
        </header>

        {/* What is Jainism Section */}
        <section className="mb-20 bg-white/80 dark:bg-gray-900/60 p-8 md:p-12 rounded-3xl shadow-xl backdrop-blur-md">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-center text-primary relative">
            What is Jainism?
          </h2>
          <div className="space-y-4 max-w-4xl mx-auto text-foreground text-lg leading-relaxed">
            <p>Jainism is an ancient Indian religion teaching spiritual purity and liberation through non-violence, truth, and self-discipline.</p>
            <p>It emphasizes ethical living, compassion for all beings, and personal responsibility for one’s actions.</p>
            
            <h3 className="font-semibold text-xl mt-4 text-primary">Core Beliefs:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Non-Violence (Ahimsa):</strong> Avoid harming any living being.</li>
              <li><strong>Non-Possessiveness (Aparigraha):</strong> Limit attachment to possessions.</li>
              <li><strong>Multiple Perspectives (Anekantavada):</strong> Accept that truth can be seen from different viewpoints.</li>
            </ul>

            <h3 className="font-semibold text-xl mt-4 text-primary">The Three Jewels:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Right Faith:</strong> Belief in Jain truths.</li>
              <li><strong>Right Knowledge:</strong> Understanding reality and the soul.</li>
              <li><strong>Right Conduct:</strong> Ethical living and following vows.</li>
            </ul>

            <h3 className="font-semibold text-xl mt-4 text-primary">Ethical Practices:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Do not harm living beings.</li>
              <li>Speak the truth.</li>
              <li>Avoid stealing.</li>
              <li>Practice chastity.</li>
              <li>Limit material possessions.</li>
            </ul>

            <h3 className="font-semibold text-xl mt-4 text-primary">Goal:</h3>
            <p>The ultimate goal is <strong>Liberation</strong> – freeing the soul from the cycle of birth and death and karma.</p>
          </div>
        </section>

        {/* The Three Jewels */}
        <section className="mb-20">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-10 text-center text-primary flex items-center justify-center">
            <Diamond className="h-7 w-7 mr-3 text-yellow-500" /> The Three Jewels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {threeJewels.map((jewel, index) => (
              <Card key={index} className={`shadow-xl hover:shadow-2xl border-t-4 ${jewel.color.replace('text', 'border')} transition-all duration-300 rounded-2xl`}>
                <CardHeader>
                  <CardTitle className={`font-serif text-2xl ${jewel.color}`}>
                    {jewel.jewel}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm font-semibold">({jewel.meaning})</p>
                </CardHeader>
                <CardContent className="text-foreground/90 text-base">
                  {jewel.explanation}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Core Ethical Principles */}
        <section className="mb-20">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-10 text-center text-foreground flex items-center justify-center">
            <Heart className="h-7 w-7 mr-3 text-red-600" /> Fundamental Ethical Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreConcepts.map((concept, index) => (
              <Card key={index} className={`shadow-md hover:shadow-lg ${concept.gradient} rounded-2xl transition-transform transform hover:-translate-y-1`}>
                <CardHeader>
                  <div className="flex items-center space-x-3 text-foreground/90">
                    {concept.icon}
                    <CardTitle className="font-serif text-xl">{concept.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-foreground/90 text-base">
                  {concept.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* The Nine Fundamentals */}
        <section className="mb-20">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-10 text-center text-primary flex items-center justify-center">
            <ScrollText className="h-7 w-7 mr-3 text-blue-500" /> The Nine Fundamentals
          </h2>
          <Card className="shadow-2xl p-6 md:p-10 rounded-3xl bg-white/80 dark:bg-gray-900/60 backdrop-blur-md">
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {nineTattvas.map((tattva, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Badge className="bg-primary hover:bg-primary/90 text-white flex-shrink-0 mt-1">
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-semibold text-foreground text-lg">{tattva.term}</p>
                    <p className="text-sm text-muted-foreground">{tattva.meaning}</p>
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
      The Ultimate Goal: Liberation
    </h3>
    <p className="text-white/90 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
      Liberation represents the complete freedom of the soul from the cycle of birth and death and the bondage of karma. 
      It is attained by following the path of Right Faith, Right Knowledge, and Right Conduct.
    </p>
  </CardContent>
</Card>

        </section>

      </div>
    </div>
  );
};

export default LearnJainismPage;
