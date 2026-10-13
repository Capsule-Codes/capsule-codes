"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useLanguage, useLocalePath } from "@/hooks/use-language";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();
  const localePath = useLocalePath();

  useEffect(() => {
    // Log the error to an error reporting service
    // console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-2xl">{t.errorPage.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {t.errorPage.message}
          </p>
          {error.message && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-mono text-foreground">
                {error.message}
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={() => reset()} className="flex-1">
              {t.errorPage.retry}
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = localePath("/"))}
              className="flex-1"
            >
              {t.errorPage.home}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
