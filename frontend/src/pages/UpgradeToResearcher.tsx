import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';

// NOTE: This is a standalone, self-contained component for demonstration.
// All styles are applied using Tailwind CSS classes directly on the elements.

// Mock data and services to allow the component to run as a single file.
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
};

const useAuth = () => ({ user: mockUser });

const useToast = () => {
  return {
    toast: (options) => {
      console.log('Toast:', options);
      alert(options.description);
    },
  };
};

const authService = {
  applyForResearcherStatus: (formData) => {
    console.log('Submitting application:', formData);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Application submitted successfully. Awaiting admin approval.' });
      }, 1500);
    });
  },
};

// Mock useNavigate to prevent the "used outside of <Router>" error
const useNavigate = () => {
  return (path) => {
    console.log(`Navigation simulated to: ${path}`);
    alert(`Application submitted! Navigating to dashboard.`);
  };
};

const UpgradeToResearcher = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    researchDescription: '',
    idProofFile: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phoneNumber || !formData.researchDescription || !formData.idProofFile) {
      toast({ title: "Validation Error", description: "Please fill in all fields and upload your ID proof.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await authService.applyForResearcherStatus(formData);
      toast({
        title: "Application Submitted!",
        description: "Your request is awaiting admin approval.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Application Failed",
        description: error.message || "Unable to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center py-12 px-4 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center mb-6">
            <h1 className="font-serif text-3xl font-bold text-gray-900">Upgrade to Researcher</h1>
            <p className="mt-2 text-sm text-gray-500">
              Submit your application to become part of our research community.
            </p>
          </div>
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-700">Full Name</label>
                <p className="text-sm text-gray-500">{user?.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-700">Email</label>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium leading-none text-gray-700">Phone Number</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 9876543210"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="researchDescription" className="text-sm font-medium leading-none text-gray-700">Research Description</label>
                <textarea
                  id="researchDescription"
                  name="researchDescription"
                  className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Briefly describe your area of research."
                  value={formData.researchDescription}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="idProof" className="text-sm font-medium leading-none text-gray-700">ID Proof (e.g., University ID)</label>
                <input
                  id="idProof"
                  name="idProofFile"
                  type="file"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={handleChange}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none w-full h-12 bg-blue-600 text-white shadow-md hover:bg-blue-700" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Submit Application
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeToResearcher;
