import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Eye } from 'lucide-react';

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

interface ManuscriptCardProps {
  manuscript: Manuscript;
  onCardClick: (manuscript: Manuscript) => void;
}

const ManuscriptCard: React.FC<ManuscriptCardProps> = ({ manuscript, onCardClick }) => {
  return (
    <Card
        className="manuscript-card group h-full cursor-pointer"
        onClick={() => onCardClick(manuscript)}
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
        <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-2">
          {manuscript.title}
        </h3>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="h-3 w-3 mr-1" />
            <span>{manuscript.author}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{manuscript.date}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {manuscript.description}
        </p>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {manuscript.language}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {/* The onClick handler for the button is now removed to avoid conflicts */}
        <Button
            variant="manuscript"
            className="w-full"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ManuscriptCard;