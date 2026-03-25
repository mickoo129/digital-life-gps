import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import { numberProfiles } from "@/lib/data-numbers";
import { lookupCombinedNumber } from "@/lib/data-combined";
import { WUXING_COLOR } from "@/lib/calculator";

type LookupResult =
  | { type: "single"; number: number }
  | { type: "combined"; key: string; content: string; health?: string }
  | { type: "notfound"; input: string };

export default function NumberLookup() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);

  const handleLookup = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Check single digit 1-9
    if (/^[1-9]$/.test(trimmed)) {
      setResult({ type: "single", number: parseInt(trimmed) });
      return;
    }

    // Check combined number (3 digits)
    if (/^\d{3}$/.test(trimmed)) {
      const reading = lookupCombinedNumber(trimmed);
      if (reading) {
        setResult({ type: "combined", key: trimmed, content: reading.content, health: reading.health });
      } else {
        setResult({ type: "notfound", input: trimmed });
      }
      return;
    }

    setResult({ type: "notfound", input: trimmed });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          {/* Input Section */}
          <Card className="mb-8 border-none shadow-md">
            <CardHeader>
              <CardTitle className="font-display text-xl">數字查詢</CardTitle>
              <p className="text-sm text-muted-foreground">
                輸入單一數字（1-9）查看號碼人特質，或輸入三位聯合數字查看解讀
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Label htmlFor="numberInput" className="text-sm text-muted-foreground mb-1 block">
                    數字
                  </Label>
                  <Input
                    id="numberInput"
                    type="text"
                    placeholder="例：7 或 213"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="font-mono text-lg"
                    onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                    maxLength={3}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleLookup}
                    className="bg-[#3B82C8] hover:bg-[#2D6BA3] text-white w-full sm:w-auto"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    查詢
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {result?.type === "single" && (() => {
            const profile = numberProfiles[result.number];
            if (!profile) return null;
            return (
              <div className="space-y-4">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span
                        className="w-14 h-14 rounded-xl flex items-center justify-center font-mono text-2xl font-bold text-white"
                        style={{ backgroundColor: WUXING_COLOR[profile.wuxing] }}
                      >
                        {profile.number}
                      </span>
                      <div>
                        <CardTitle className="font-display">{profile.number}號人 — {profile.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          五行：{profile.wuxing} | 心理需求：{profile.psychologicalNeed}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-1">內心數字</h4>
                      <p className="text-sm text-muted-foreground">{profile.innerNumber}：{profile.innerNumberMeaning}</p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-sm mb-2">冰山上（表面行為）</h4>
                      <p className="text-sm text-muted-foreground mb-1">
                        <span className="text-[#4A8C5C] font-medium">正面：</span>{profile.iceberg.above.positive}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="text-destructive font-medium">負面：</span>{profile.iceberg.above.negative}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">冰山下（內心）</h4>
                      <p className="text-sm text-muted-foreground mb-1">
                        <span className="text-[#4A8C5C] font-medium">正面：</span>{profile.iceberg.below.positive}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="text-destructive font-medium">負面：</span>{profile.iceberg.below.negative}
                      </p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-[#4A8C5C]">正面特質</h4>
                        <ul className="space-y-1">
                          {profile.positiveTraits.map((t, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                              <span className="text-[#4A8C5C] mt-0.5">●</span>{t}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-destructive">負面特質</h4>
                        <ul className="space-y-1">
                          {profile.negativeTraits.map((t, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                              <span className="text-destructive mt-0.5">●</span>{t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-sm mb-2">天賦人格</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.giftPersonality.map((g, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">{g}</span>
                        ))}
                      </div>
                    </div>
                    {profile.challenges.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium text-sm mb-2">潛在挑戰</h4>
                          <ul className="space-y-1">
                            {profile.challenges.map((c, i) => (
                              <li key={i} className="text-sm text-muted-foreground">{c}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                    {profile.missingEffect.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium text-sm mb-2">缺{profile.number}的影響</h4>
                          <ul className="space-y-1">
                            {profile.missingEffect.map((m, i) => (
                              <li key={i} className="text-sm text-muted-foreground">{m}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Sales Strategy */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-display text-base">成交攻略 — {profile.number}號人</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-medium text-sm mb-2">{profile.salesStrategy.title}</h4>
                    <ul className="space-y-2">
                      {profile.salesStrategy.steps.map((s, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="font-mono text-[#3B82C8] font-bold mt-0.5">{i + 1}.</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            );
          })()}

          {result?.type === "combined" && (
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-3">
                  <span className="font-mono text-2xl text-[#3B82C8]">{result.key}</span>
                  <span>聯合數字解讀</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{result.content}</p>
                  {result.health && (
                    <div className="mt-3 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs flex items-start gap-1.5">
                      <span className="shrink-0">⚕️</span>
                      <span className="whitespace-pre-line">{result.health}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {result?.type === "notfound" && (
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  「{result.input}」暫無解讀資料。請輸入1-9的單一數字，或文件中有記錄的三位聯合數字。
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Reference Grid */}
          {!result && (
            <div className="space-y-6">
              <h3 className="font-display text-lg font-medium">快速查詢 — 1-9號人</h3>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
                  const p = numberProfiles[n];
                  return (
                    <button
                      key={n}
                      onClick={() => { setInput(String(n)); setResult({ type: "single", number: n }); }}
                      className="p-4 rounded-xl border border-border hover:border-[#3B82C8]/50 hover:shadow-md transition-all text-left"
                    >
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg font-mono text-sm font-bold text-white mb-2"
                        style={{ backgroundColor: WUXING_COLOR[p.wuxing] }}
                      >
                        {n}
                      </span>
                      <p className="text-sm font-medium">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.wuxing}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
