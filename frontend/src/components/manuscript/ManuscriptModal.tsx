import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { manuscriptService } from "@/services/manuscriptService";
import {
  BookOpen,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Lock,
  UserPlus,
  Globe,
  Scroll,
  Trash2,
  AlertTriangle,
} from "lucide-react";

interface Manuscript {
  _id: string;
  title: string;
  author?: string;
  category: string;
  createdAt: string;
  description: string;
  files: string[];
  language?: string;
  uploadType: "normal" | "detailed";
  period?: string;
}

interface ManuscriptModalProps {
  manuscript: Manuscript | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void; 
}

const BASE_URL = 'http://localhost:4000/';

const ManuscriptModal: React.FC<ManuscriptModalProps> = ({
  manuscript,
  isOpen,
  onClose,
  onDelete,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!manuscript) return null;

  const isAdmin = user?.role === "admin";
  const isResearcher = user?.role === "researcher";
  
  // ✅ Approved researchers now get full access
  const canAccessFull = isAdmin || (isAuthenticated && isResearcher && user?.isApproved);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? manuscript.files.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === manuscript.files.length - 1 ? 0 : prev + 1
    );
  };

  const confirmDelete = () => setShowDeleteConfirm(true);

  const executeDelete = async () => {
    if (!manuscript?._id) return;

    try {
      setIsDeleting(true);
      await manuscriptService.deleteManuscript(manuscript._id);
      if (onDelete) onDelete(manuscript._id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to delete manuscript");
    } finally {
      setIsDeleting(false);
    }
  };

  const enhancedData = {
    summary:
      manuscript.description ||
      `The ${manuscript.title} is a significant work, containing profound teachings on philosophy and spiritual practices.`,
    significance:
      "This manuscript is a foundational text, offering insights into ancient principles and wisdom.",
  };

  const rawFilePath = manuscript.files[currentIndex];
  const currentImageUrl = rawFilePath 
      ? `${BASE_URL}${rawFilePath.replace(/^\/+/, '')}`
      : '/placeholder.svg';

  return (
    <>
      {/* --------------------------------------------------- */}
      {/* 1. Main Manuscript Modal */}
      {/* --------------------------------------------------- */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl pr-8">
              {manuscript.title}
            </DialogTitle>
            <DialogDescription className="text-base">
              Explore this manuscript from the {manuscript.language || "ancient"} tradition
            </DialogDescription>
            <div className="flex items-center mt-2 space-x-2">
              <Badge variant="secondary">
                {manuscript.category || "Uncategorized"}
              </Badge>
              {manuscript.language && (
                <Badge variant="outline">{manuscript.language}</Badge>
              )}
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={currentImageUrl}
                  alt={`Image ${currentIndex + 1} of ${manuscript.title}`}
                  className="w-full h-64 lg:h-80 object-cover"
                />
                {/* Lock overlay only for unapproved researchers on detailed uploads */}
                {manuscript.uploadType === "detailed" && !canAccessFull && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Lock className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">
                        Full Access Available to Approved Researchers
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Controls */}
                {manuscript.files.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white"
                      onClick={handlePrev}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white"
                      onClick={handleNext}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                      {manuscript.files.map((_, idx) => (
                        <span
                          key={idx}
                          className={`h-2 w-2 rounded-full transition-colors ${
                            idx === currentIndex
                              ? "bg-primary"
                              : "bg-muted-foreground/70"
                          }`}
                          onClick={() => setCurrentIndex(idx)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-3 rounded-lg text-center">
                  <Scroll className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-sm font-medium">{manuscript.files.length} Pages</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg text-center">
                  <Globe className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-sm font-medium">{manuscript.language || "Unknown"}</p>
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
                    <strong>Uploaded On:</strong>{" "}
                    {new Date(manuscript.createdAt).toLocaleDateString()}
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

              {/* Significance */}
              <div>
                <h3 className="font-serif text-lg font-semibold mb-2">Significance</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {enhancedData.significance}
                </p>
              </div>

              {/* Access Level Indicator */}
              <div
                className={`p-4 rounded-lg border-2 ${
                  canAccessFull
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                    : "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {canAccessFull ? (
                    <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  ) : (
                    <Lock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">
                      {canAccessFull ? "Full Access Available" : "Limited Preview"}
                    </h4>
                    <p className={`text-xs leading-snug ${
                      isAdmin
                        ? "font-bold text-red-700 dark:text-red-400"
                        : "text-muted-foreground"
                    }`}>
                      {isAdmin
                        ? "You are viewing as Administrator, accessing all features."
                        : canAccessFull
                        ? "You have full access to high-resolution images, annotations, and research tools."
                        : "Full access requires an approved Researcher account."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
            {isAdmin ? (
              <>
                <Button asChild variant="hero" className="flex-1">
                  <Link to={`/admin/edit-manuscript/${manuscript._id}`}>Edit Manuscript</Link>
                </Button>
                <Button variant="destructive" disabled={isDeleting} onClick={confirmDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            ) : canAccessFull ? (
              <>
                <Button asChild variant="hero" className="flex-1">
                  <Link to={`/manuscript/${manuscript._id}`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Open Full Manuscript
                  </Link>
                </Button>
                <Button variant="outline" onClick={onClose}>Close Preview</Button>
              </>
            ) : (
              <>
                {isAuthenticated ? (
                  <Button asChild variant="hero" className="flex-1">
                    <Link to="/upgrade-to-researcher">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Upgrade to Researcher
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
                      <Link to="/login">Already have an account?</Link>
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={onClose}>Close Preview</Button>
              </>
            )}
          </DialogFooter>

          {/* Additional Info for Non-Researchers */}
          {!canAccessFull && !isAdmin && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h4 className="font-serif font-semibold mb-2">Researcher Benefits</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Access to high-resolution manuscript images</li>
                <li>• Add and view scholarly annotations</li>
                <li>• Download manuscripts for research</li>
                <li>• Contribute to the preservation effort</li>
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* --------------------------------------------------- */}
      {/* 2. Delete Confirmation Dialog */}
      {/* --------------------------------------------------- */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex items-center text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <DialogTitle className="font-serif text-xl font-semibold">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete the manuscript: "{manuscript.title}"?
            </DialogDescription>
            <DialogDescription className="text-xs font-medium text-destructive">
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end pt-4">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={executeDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : <><Trash2 className="h-4 w-4 mr-2" /> Delete Permanently</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManuscriptModal;
