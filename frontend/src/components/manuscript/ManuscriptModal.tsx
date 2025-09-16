import React from 'react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import RequestAccessButton from './RequestAccessButton';
import {
  Calendar,
  User,
  BookOpen,
  Lock,
  UserPlus,
  Eye,
  Globe,
  Scroll,
} from 'lucide-react';

interface Manuscript {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  description: string;
  thumbnail: string;
  language: string;
  summary?: string;
  pages?: number;
  significance?: string;
}

interface ManuscriptModalProps {
  manuscript: Manuscript | null;
  isOpen: boolean;
  onClose: () => void;
}

const ManuscriptModal: React.FC<ManuscriptModalProps> = ({
  manuscript,
  isOpen,
  onClose,
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!manuscript) return null;

  // New logic for fine-grained access control
  const isResearcher = user?.role === 'researcher';
  const hasSpecificAccess = isResearcher && user?.approvedManuscripts.includes(manuscript.id);
  const canAccessFull = isAuthenticated && hasSpecificAccess;

  // Enhanced manuscript data for demonstration
  const enhancedData = {
    summary: manuscript.summary || `The ${manuscript.title} is a significant work in Jain literature, authored by ${manuscript.author}. This manuscript contains profound teachings on Jain philosophy, ethics, and spiritual practices. It represents an important contribution to understanding ancient Jain wisdom and continues to be studied by scholars worldwide.`,
    pages: manuscript.pages || Math.floor(Math.random() * 200) + 50,
    significance: manuscript.significance || "This manuscript is considered one of the foundational texts in Jain philosophy, offering insights into the principles of non-violence, truth, and spiritual liberation.",
    fullText: "Available to researchers only",
    annotations: Math.floor(Math.random() * 25) + 5,
    downloadable: canAccessFull,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl pr-8">
            {manuscript.title}
          </DialogTitle>
          <DialogDescription className="text-base">
            Explore this sacred manuscript from the Jain tradition
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={manuscript.thumbnail}
                alt={manuscript.title}
                className="w-full h-64 lg:h-80 object-cover"
              />
              {!canAccessFull && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Lock className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Full Resolution Available to Researchers</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-3 rounded-lg text-center">
                <Scroll className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-sm font-medium">{enhancedData.pages} Pages</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg text-center">
                <Eye className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-sm font-medium">{enhancedData.annotations} Annotations</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-4">
            {/* Metadata */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Author:</strong> {manuscript.author}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Period:</strong> {manuscript.date}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Language:</strong> {manuscript.language}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{manuscript.category}</Badge>
              </div>
            </div>

            <Separator />

            {/* Summary */}
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2">Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {enhancedData.summary}
              </p>
            </div>

            <Separator />

            {/* Historical Significance */}
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2">Historical Significance</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {enhancedData.significance}
              </p>
            </div>

            {/* Access Level Indicator */}
            <div className={`p-4 rounded-lg border-2 ${canAccessFull ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' : 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950'}`}>
              <div className="flex items-start space-x-3">
                {canAccessFull ? (
                  <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                ) : (
                  <Lock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">
                    {canAccessFull ? 'Full Access Available' : 'Limited Preview'}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {canAccessFull
                      ? 'You have full access to high-resolution images, annotations, and research tools.'
                      : 'Become a researcher to access high-resolution images, add annotations, and download manuscripts.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
          {canAccessFull ? (
            <>
              <Button asChild variant="hero" className="flex-1">
                <Link to={`/manuscript/${manuscript.id}`}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Open Full Manuscript
                </Link>
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close Preview
              </Button>
            </>
          ) : (
            <>
              {isAuthenticated ? (
                // New: "Request Access" button for logged-in researchers
                <RequestAccessButton manuscriptId={manuscript.id} />
              ) : (
                // Existing: "Join as Researcher" for non-authenticated users
                <>
                  <Button asChild variant="hero" className="flex-1">
                    <Link to="/signup">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join as Researcher
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/login">
                      Already have an account?
                    </Link>
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={onClose}>
                Close Preview
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManuscriptModal;