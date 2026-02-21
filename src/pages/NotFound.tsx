import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
        <Card className="w-full rounded-2xl border-border bg-background/40 backdrop-blur">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card/60">
                <TriangleAlert className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">404</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Страница не найдена:{" "}
                  <span className="text-foreground">{location.pathname}</span>
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button
                className="h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate("/")}
              >
                На главную
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-xl border-border bg-background/40"
                onClick={() => navigate(-1)}
              >
                Назад
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;