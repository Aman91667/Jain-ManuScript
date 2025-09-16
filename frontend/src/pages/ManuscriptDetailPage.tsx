import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import HelpForm from '@/components/common/HelpForm';

const ManuscriptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Mock manuscript data (in a real app, this would be fetched from the backend)
  const manuscript = {
    id: id,
    title: 'Kalpa Sutra',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    description: 'The Kalpa Sutra is a Jain text containing the biographies of the Jain Tirthankaras...'
  };

  if (!manuscript) {
    return <div>Manuscript not found.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost">
            <Link to="/researcher/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsHelpModalOpen(true)}>
              <Mail className="h-4 w-4 mr-2" />
              Contact Admin
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <h1 className="font-serif text-3xl font-bold mb-4">{manuscript.title}</h1>
            <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
              <img
                src={manuscript.image}
                alt={manuscript.title}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-muted-foreground">{manuscript.description}</p>
          </CardContent>
        </Card>
      </div>

      {/* Help Form Modal */}
      <HelpForm isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} manuscriptId={manuscript.id} />
    </div>
  );
};

export default ManuscriptDetailPage;