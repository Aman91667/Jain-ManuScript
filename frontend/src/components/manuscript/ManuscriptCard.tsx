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
  uploadType: 'normal' | 'detailed'; // normal = Public, detailed = Researcher
}

interface ManuscriptCardProps {
  manuscript: Manuscript;
  onCardClick: (manuscript: Manuscript) => void;
  isAdmin?: boolean; // for admin-only badge
}

const BASE_URL = 'http://localhost:4000/';

const ManuscriptCard: React.FC<ManuscriptCardProps> = ({ manuscript, onCardClick, isAdmin }) => {
  const imageSrc =
    manuscript.thumbnail
      ? `${BASE_URL}${manuscript.thumbnail.replace(/^\/+/, '')}`
      : manuscript.files && manuscript.files.length > 0
      ? `${BASE_URL}${manuscript.files[0].replace(/^\/+/, '')}`
      : '/placeholder.svg';

  // Badge for manuscript type
  const typeBadge = manuscript.uploadType === 'normal' ? 'Public' : 'Researcher';
  const typeBadgeColor =
    manuscript.uploadType === 'normal'
      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';

  return (
    <Card
      className="manuscript-card group h-full cursor-pointer flex flex-col shadow hover:shadow-lg transition-shadow rounded-lg overflow-hidden"
      onClick={() => onCardClick(manuscript)}
    >
      {/* CardHeader */}
      <CardHeader className="p-0 relative">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={imageSrc}
            alt={manuscript.title}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-background/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 backdrop-blur px-2 py-1 text-xs font-medium rounded">
              {manuscript.category || 'Uncategorized'}
            </Badge>
          </div>
          {/* Type Badge */}
          <div className="absolute top-2 right-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded ${typeBadgeColor}`}>
              {typeBadge}
            </span>
          </div>
          {/* Admin-only label */}
          {isAdmin && (
            <div className="absolute bottom-2 right-2">
              <Badge variant="destructive" className="text-xs px-2 py-1">
                Admin Only
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      {/* CardContent */}
      <CardContent className="p-4 flex-grow">
        <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-2 text-gray-900 dark:text-gray-100">
          {manuscript.title}
        </h3>

        <div className="space-y-2 mb-3 text-gray-600 dark:text-gray-300 text-sm">
          {manuscript.author && (
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span>{manuscript.author}</span>
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{new Date(manuscript.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-3 mb-3">
          {manuscript.description}
        </p>

        {manuscript.language && (
          <Badge variant="outline" className="text-xs">
            {manuscript.language}
          </Badge>
        )}
      </CardContent>

      {/* CardFooter */}
      <CardFooter className="p-4 pt-0">
        <Button variant="default" className="w-full flex items-center justify-center gap-2">
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ManuscriptCard;
