import { Link } from "wouter";
import { Calendar, Hash, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
        <div className="container relative">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A96E]/10 text-[#C9A96E] text-sm font-medium mb-6">
              <Compass className="w-4 h-4" />
              數字人生GPS
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-4">
              解讀你的
              <span className="text-[#C9A96E]">生命密碼</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              透過出生日期的數字組合，探索你的性格特質、五行分析、聯合數字解讀、流年運程及成交攻略。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/analysis">
                <Button size="lg" className="gap-2 bg-[#C9A96E] hover:bg-[#B8944D] text-white w-full sm:w-auto">
                  <Calendar className="w-5 h-5" />
                  輸入出生日期
                </Button>
              </Link>
              <Link href="/lookup">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Hash className="w-5 h-5" />
                  數字查詢
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-card">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-[#C9A96E]/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-[#C9A96E]" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">倒正三角計算</h3>
                <p className="text-sm text-muted-foreground">
                  根據出生日期計算倒三角和正三角，得出主性格、聯合數字等完整生命密碼。
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-card">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-[#3B6B9C]/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#3B6B9C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2 C12 2 7 8 7 12 C7 16 12 22 12 22 C12 22 17 16 17 12 C17 8 12 2 12 2" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                  </svg>
                </div>
                <h3 className="font-display text-lg font-bold mb-2">五行分析</h3>
                <p className="text-sm text-muted-foreground">
                  金水火木土五行統計，分析自身、子女、事業、官鬼、父母五個位置的平衡。
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-card">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-[#4A8C5C]/10 flex items-center justify-center mx-auto mb-4">
                  <Hash className="w-6 h-6 text-[#4A8C5C]" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">聯合數字</h3>
                <p className="text-sm text-muted-foreground">
                  81組聯合數字的完整解讀，了解每組數字背後的含義和能量。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Five Elements Preview */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-bold mb-2">五行對應</h2>
            <p className="text-muted-foreground">每個數字都有其對應的五行屬性</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {[
              { nums: "1・6", wx: "金", color: "#C9A96E", bg: "rgba(201,169,110,0.1)" },
              { nums: "2・7", wx: "水", color: "#3B6B9C", bg: "rgba(59,107,156,0.1)" },
              { nums: "3・8", wx: "火", color: "#C75B39", bg: "rgba(199,91,57,0.1)" },
              { nums: "4・9", wx: "木", color: "#4A8C5C", bg: "rgba(74,140,92,0.1)" },
              { nums: "5", wx: "土", color: "#9C7B4A", bg: "rgba(156,123,74,0.1)" },
            ].map(({ nums, wx, color, bg }) => (
              <div
                key={wx}
                className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl"
                style={{ backgroundColor: bg }}
              >
                <span className="font-mono text-2xl font-bold" style={{ color }}>{nums}</span>
                <span className="text-sm font-medium" style={{ color }}>{wx}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p>數字人生GPS — 所有解讀資料均來自授權教材</p>
        </div>
      </footer>
    </div>
  );
}
