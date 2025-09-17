import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  User, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Lock, 
  UserPlus, 
  Eye,
  Globe,
  Scroll
} from 'lucide-react';

interface Manuscript {
  _id: string;
  title: string;
  author?: string;
  category: string;
  createdAt: string;
  description: string;
  files: string[];
  language?: string;
  uploadType: 'normal' | 'detailed';
  period?: string;
}

interface ManuscriptModalProps {
  manuscript: Manuscript | null;
  isOpen: boolean;
  onClose: () => void;
}

const ManuscriptModal: React.FC<ManuscriptModalProps> = ({ manuscript, isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!manuscript) return null;
  
  const isResearcher = user?.role === 'researcher' || user?.role === 'admin';
  const canAccessFull = isAuthenticated && isResearcher && manuscript.uploadType === 'detailed';
  
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? manuscript.files.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === manuscript.files.length - 1 ? 0 : prev + 1));
  };
  
  // Placeholder data for demonstration, as these fields are not in your backend model
  const enhancedData = {
    summary: manuscript.description || `The ${manuscript.title} is a significant work, containing profound teachings on philosophy and spiritual practices.`,
    significance: "This manuscript is a foundational text, offering insights into ancient principles and wisdom.",
  };
  
  const thumbnail = manuscript.files[0] ? `http://localhost:4000${manuscript.files[0]}` : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl pr-8">
            {manuscript.title}
          </DialogTitle>
          <DialogDescription className="text-base">
            Explore this manuscript from the {manuscript.language || 'ancient'} tradition
          </DialogDescription>
          
          {/* ✅ CORRECTED: Moved the badges outside of DialogDescription */}
          <div className="flex items-center mt-2 space-x-2">
            <Badge variant="secondary">{manuscript.category || 'Uncategorized'}</Badge>
            {manuscript.language && <Badge variant="outline">{manuscript.language}</Badge>}
          </div>

        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Image Section with Carousel */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={`http://localhost:4000${manuscript.files[currentIndex]}`}
                alt={`Image ${currentIndex + 1} of ${manuscript.title}`}
                className="w-full h-64 lg:h-80 object-cover"
              />
              {manuscript.uploadType === 'detailed' && !canAccessFull && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Lock className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Full Access Available to Researchers</p>
                  </div>
                </div>
              )}
              {manuscript.files.length > 1 && (
                <>
                  <Button variant="ghost" className="absolute left-0 top-1/2 -translate-y-1/2 p-2" onClick={handlePrev}>
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button variant="ghost" className="absolute right-0 top-1/2 -translate-y-1/2 p-2" onClick={handleNext}>
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                    {manuscript.files.map((_, idx) => (
                      <span key={idx} className={`h-2 w-2 rounded-full ${idx === currentIndex ? 'bg-primary' : 'bg-muted-foreground'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Quick Stats (modified to use available data) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-3 rounded-lg text-center">
                <Scroll className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-sm font-medium">{manuscript.files.length} Pages</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg text-center">
                <Globe className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-sm font-medium">{manuscript.language || "Unknown"} </p>
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
                  <strong>Author:</strong> {manuscript.author || "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Uploaded On:</strong> {new Date(manuscript.createdAt).toLocaleDateString()}
                </span>
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
              <h3 className="font-serif text-lg font-semibold mb-2">Significance</h3>
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
                <Link to={`/manuscript/${manuscript._id}`}>
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
                <Button asChild variant="hero" className="flex-1">
                  <Link to="/upgrade-to-researcher">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Become a Researcher
                  </Link>
                </Button>
              ) : (
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

        {/* Additional Info for Non-Researchers */}
        {!canAccessFull && (
          <div className="mt-4 p-4 bg-gradient-parchment rounded-lg">
            <h4 className="font-serif font-semibold mb-2">Researcher Benefits</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Access to high-resolution manuscript images</li>
              <li>• Add and view scholarly annotations</li>
              <li>• Download manuscripts for research</li>
              <li>• Contribute to the preservation effort</li>
              <li>• Connect with global research community</li>
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ManuscriptModal;