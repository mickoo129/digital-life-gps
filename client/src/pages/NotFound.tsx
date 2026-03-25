import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Compass } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full border-none shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-6">
            <Compass className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="font-display text-5xl font-bold text-foreground mb-2">404</h1>
          <h2 className="font-display text-lg font-medium text-foreground mb-2">頁面未找到</h2>
          <p className="text-sm text-muted-foreground mb-6">
            抱歉，您要找的頁面不存在。請返回首頁重新導航。
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            返回首頁
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
