import React from "react";
import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background py-20">
      <div className="text-center max-w-md mx-auto px-4">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
        <h1 className="text-4xl font-bold font-serif text-foreground mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg" className="h-14 px-8">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
