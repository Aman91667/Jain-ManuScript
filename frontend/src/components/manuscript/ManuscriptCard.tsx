import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Eye } from 'lucide-react';

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
}

interface ManuscriptCardProps {
  manuscript: Manuscript;
  onCardClick: (manuscript: Manuscript) => void;
}

const BASE_URL = 'http://localhost:4000/'; // Backend URL

const ManuscriptCard: React.FC<ManuscriptCardProps> = ({ manuscript, onCardClick }) => {
  const imageSrc =
    manuscript.thumbnail
      ? `${BASE_URL}${manuscript.thumbnail.replace(/^\/+/, '')}`
      : manuscript.files && manuscript.files.length > 0
      ? `${BASE_URL}${manuscript.files[0].replace(/^\/+/, '')}`
      : '/placeholder.svg';

  return (
    // 1. Add 'flex' and 'flex-col' to make the Card a column-based flex container
    //    and ensure it takes the full available height ('h-full').
    <Card 
      className="manuscript-card group h-full cursor-pointer flex flex-col" 
      onClick={() => onCardClick(manuscript)}
    >
      
      {/* CardHeader: Stays at the top */}
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={imageSrc}
            alt={manuscript.title}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur">
              {manuscript.category || 'Uncategorized'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* CardContent: Uses 'flex-grow' to consume all remaining space, 
          pushing the footer to the bottom. */}
      <CardContent className="p-4 flex-grow">
        <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-2">{manuscript.title}</h3>

        <div className="space-y-2 mb-3">
          {manuscript.author && (
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="h-3 w-3 mr-1" />
              <span>{manuscript.author}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{new Date(manuscript.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {manuscript.description}
        </div>

        {manuscript.language && <Badge variant="outline" className="text-xs">{manuscript.language}</Badge>}
      </CardContent>

      {/* CardFooter: Stays fixed at the bottom */}
      <CardFooter className="p-4 pt-0">
        <Button variant="default" className="w-full">
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ManuscriptCard;