import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Heart, Briefcase, Users, TrendingUp, ShieldAlert, Sparkles, Eye, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  calculateTriangle, calculateCombinedNumbers, calculateWuxing,
  calculateWaterFireClash, calculateMissingNumbers, calculateFlowYear,
  WUXING_MAP, WUXING_COLOR, type TriangleResult
} from "@/lib/calculator";
import { numberProfiles } from "@/lib/data-numbers";
import { lookupCombinedNumber } from "@/lib/data-combined";
import { flowYearData } from "@/lib/data-flowyear";

function TriangleDiagram({ t }: { t: TriangleResult }) {
  const { raw, I, J, K, L, M, N, O, Q, P, R, S, T, U, V, W, X } = t;

  const numCell = (n: number, highlight?: string) => (
    <span
      className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full font-mono text-base sm:text-lg font-bold"
      style={{
        backgroundColor: highlight || WUXING_COLOR[WUXING_MAP[n]] + "20",
        color: WUXING_COLOR[WUXING_MAP[n]] || "#666",
        border: `2px solid ${WUXING_COLOR[WUXING_MAP[n]] || "#ccc"}`
      }}
    >
      {n}
    </span>
  );

  const starCell = (n: number) => (
    <span
      className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-mono text-base sm:text-lg font-bold bg-amber-100/50 text-amber-700 border-2 border-amber-300/50"
    >
      {n}
    </span>
  );

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      {/* Raw numbers */}
      <div className="text-xs text-muted-foreground mb-1">
        原始數字：{raw.join(" ")}
      </div>

      {/* 倒三角 */}
      <div className="text-xs text-muted-foreground font-medium">▼ 倒三角</div>
      <div className="flex gap-3 sm:gap-4">
        <div className="flex flex-col items-center">
          {numCell(I)}
          <span className="text-[9px] text-muted-foreground mt-0.5">I ☆</span>
        </div>
        <div className="flex flex-col items-center">
          {numCell(J)}
          <span className="text-[9px] text-muted-foreground mt-0.5">J</span>
        </div>
        <div className="flex flex-col items-center">
          {numCell(K)}
          <span className="text-[9px] text-muted-foreground mt-0.5">K</span>
        </div>
        <div className="flex flex-col items-center">
          {numCell(L)}
          <span className="text-[9px] text-muted-foreground mt-0.5">L ☆</span>
        </div>
      </div>
      <div className="flex gap-3 sm:gap-4">
        <div className="flex flex-col items-center">
          {numCell(M)}
          <span className="text-[9px] text-muted-foreground mt-0.5">M</span>
        </div>
        <div className="flex flex-col items-center">
          {numCell(N)}
          <span className="text-[9px] text-muted-foreground mt-0.5">N</span>
        </div>
      </div>
      <div className="flex flex-col items-center">
        {numCell(O, WUXING_COLOR[WUXING_MAP[O]] + "30")}
        <span className="text-[9px] text-muted-foreground mt-0.5">O 主性格</span>
      </div>
      <div className="text-xs text-muted-foreground">主性格 {O}號（佔60%）</div>

      <Separator className="my-2 w-48" />

      {/* 正三角 */}
      <div className="text-xs text-muted-foreground font-medium">▲ 正三角</div>
      <div className="flex gap-8 sm:gap-12">
        <div className="flex flex-col items-center gap-1">
          {starCell(Q)}
          <span className="text-[10px] text-muted-foreground">Q ☆左</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          {starCell(P)}
          <span className="text-[10px] text-muted-foreground">P ☆右</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        {starCell(R)}
        <span className="text-[10px] text-muted-foreground">R</span>
      </div>

      {/* 底行 */}
      <Separator className="my-2 w-48" />
      <div className="flex gap-2 sm:gap-6 mt-2 text-center">
        <div className="flex flex-col items-center">
          <div className="flex gap-1">
            {[S, T, U].map((n, i) => (
              <span key={`e${i}`} className="inline-flex items-center justify-center w-7 h-7 rounded font-mono text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200">{n}</span>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground mt-1">早年 21-40歲</span>
          <span className="text-[9px] text-muted-foreground">S T U</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex gap-1">
            {[Q, P, R].map((n, i) => (
              <span key={`ml${i}`} className="inline-flex items-center justify-center w-7 h-7 rounded font-mono text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200">{n}</span>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground mt-1">中年 41-60歲</span>
          <span className="text-[9px] text-muted-foreground">Q P R</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex gap-1">
            {[V, W, X].map((n, i) => (
              <span key={`l${i}`} className="inline-flex items-center justify-center w-7 h-7 rounded font-mono text-sm font-semibold text-green-700 bg-green-50 border border-green-200">{n}</span>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground mt-1">晚年 61歲後</span>
          <span className="text-[9px] text-muted-foreground">V W X</span>
        </div>
      </div>
    </div>
  );
}

function WuxingBar({ label, value, maxVal, color, wuxing }: { label: string; value: number; maxVal: number; color: string; wuxing: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm w-28 text-right text-muted-foreground">{label}（{wuxing}）</span>
      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
          style={{ width: `${Math.max((value / Math.max(maxVal, 1)) * 100, 8)}%`, backgroundColor: color }}
        >
          <span className="text-xs font-bold text-white">{value}</span>
        </div>
      </div>
    </div>
  );
}

export default function BirthdayAnalysis() {
  const [dateInput, setDateInput] = useState("");
  const [result, setResult] = useState<{
    triangle: TriangleResult;
    combined: ReturnType<typeof calculateCombinedNumbers>;
    wuxing: ReturnType<typeof calculateWuxing>;
    waterFireClash: number;
    missingNumbers: number[];
    flowYear: { flowYear: number; year: number };
  } | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    if (!dateInput) {
      setError("請輸入出生日期");
      return;
    }
    const triangle = calculateTriangle(dateInput);
    if (!triangle) {
      setError("日期格式不正確，請使用 YYYY-MM-DD 格式");
      return;
    }
    const combined = calculateCombinedNumbers(triangle);
    const wuxing = calculateWuxing(triangle.O, triangle.all16);
    const waterFireClash = calculateWaterFireClash(triangle);
    const missingNumbers = calculateMissingNumbers(triangle);
    const flowYear = calculateFlowYear(dateInput);
    setResult({ triangle, combined, wuxing, waterFireClash, missingNumbers, flowYear });
  };

  const profile = result ? numberProfiles[result.triangle.O] : null;

  const combinedLabels: { key: string; label: string; icon: React.ReactNode }[] = [
    { key: "fatherGene", label: "1. 父基因（事業）IJM", icon: <Briefcase className="w-4 h-4" /> },
    { key: "motherGene", label: "2. 母基因（婚姻）KLN", icon: <Heart className="w-4 h-4" /> },
    { key: "mainChar", label: "3. 主性格（60%）MNO", icon: <Sparkles className="w-4 h-4" /> },
    { key: "lifeProcess1", label: "4. 人生過程 MOP", icon: <TrendingUp className="w-4 h-4" /> },
    { key: "lifeProcess2", label: "5. 人生過程 NOQ", icon: <TrendingUp className="w-4 h-4" /> },
    { key: "children", label: "6. 子女/下屬 QPR（中年41-60歲）", icon: <Users className="w-4 h-4" /> },
    { key: "careerProcess1", label: "7. 事業過程 IMS", icon: <Briefcase className="w-4 h-4" /> },
    { key: "careerProcess2", label: "8. 事業過程 JMT", icon: <Briefcase className="w-4 h-4" /> },
    { key: "workFriends", label: "9. 工作/朋友 STU（早年21-40歲）", icon: <Users className="w-4 h-4" /> },
    { key: "marriageProcess1", label: "10. 婚姻過程 KNV", icon: <Heart className="w-4 h-4" /> },
    { key: "marriageProcess2", label: "11. 婚姻過程 LNW", icon: <Heart className="w-4 h-4" /> },
    { key: "lateLife", label: "12. 晚年 VWX（61歲後）", icon: <Clock className="w-4 h-4" /> },
    { key: "hiddenCode", label: "13. 隱藏號碼", icon: <Eye className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          {/* Input Section */}
          <Card className="mb-8 border-none shadow-md">
            <CardHeader>
              <CardTitle className="font-display text-xl">輸入出生日期</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Label htmlFor="birthdate" className="text-sm text-muted-foreground mb-1 block">
                    出生日期
                  </Label>
                  <Input
                    id="birthdate"
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="font-mono"
                    onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleCalculate}
                    className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto"
                  >
                    計算生命密碼
                  </Button>
                </div>
              </div>
              {error && <p className="text-destructive text-sm mt-2">{error}</p>}
            </CardContent>
          </Card>

          {/* Results */}
          {result && profile && (
            <Tabs defaultValue="triangle" className="space-y-6">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="triangle" className="text-xs sm:text-sm">三角圖</TabsTrigger>
                <TabsTrigger value="personality" className="text-xs sm:text-sm">主性格</TabsTrigger>
                <TabsTrigger value="combined" className="text-xs sm:text-sm">聯合數字</TabsTrigger>
                <TabsTrigger value="wuxing" className="text-xs sm:text-sm">五行</TabsTrigger>
                <TabsTrigger value="flowyear" className="text-xs sm:text-sm">流年</TabsTrigger>
              </TabsList>

              {/* Tab 1: Triangle */}
              <TabsContent value="triangle">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-display">倒正三角圖</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TriangleDiagram t={result.triangle} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 2: Personality */}
              <TabsContent value="personality">
                <div className="space-y-4">
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <span
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-mono text-2xl font-bold text-white"
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
                          <span className="text-green-600 font-medium">正面：</span>{profile.iceberg.above.positive}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="text-destructive font-medium">負面：</span>{profile.iceberg.above.negative}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">冰山下（內心）</h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          <span className="text-green-600 font-medium">正面：</span>{profile.iceberg.below.positive}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="text-destructive font-medium">負面：</span>{profile.iceberg.below.negative}
                        </p>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2 text-green-600">正面特質</h4>
                          <ul className="space-y-1">
                            {profile.positiveTraits.map((t, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                                <span className="text-green-600 mt-0.5">●</span>{t}
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
                            <span key={i} className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">{g}</span>
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
                    </CardContent>
                  </Card>

                  {/* Missing Numbers */}
                  {result.missingNumbers.length > 0 && (
                    <Card className="border-none shadow-sm">
                      <CardHeader>
                        <CardTitle className="font-display text-base flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          倒三角缺數分析
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {result.missingNumbers.map(n => (
                            <span key={n} className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive font-mono font-bold text-sm">
                              缺 {n}
                            </span>
                          ))}
                        </div>
                        <div className="space-y-3">
                          {result.missingNumbers.map(n => {
                            const p = numberProfiles[n];
                            if (!p || !p.missingEffect.length) return null;
                            return (
                              <div key={n} className="text-sm">
                                <span className="font-medium">缺{n}（{p.wuxing}）：</span>
                                <span className="text-muted-foreground">{p.missingEffect.join("；")}</span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}

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
                            <span className="font-mono text-amber-600 font-bold mt-0.5">{i + 1}.</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tab 3: Combined Numbers */}
              <TabsContent value="combined">
                <div className="space-y-4">
                  {combinedLabels.map(({ key, label, icon }) => {
                    const numStr = (result.combined as any)[key] as string;
                    const reading = lookupCombinedNumber(numStr);
                    return (
                      <Card key={key} className="border-none shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-muted-foreground">{icon}</span>
                            <span className="text-sm font-medium">{label}</span>
                            <span className="ml-auto font-mono text-lg font-bold text-amber-600">{numStr}</span>
                          </div>
                          {reading ? (
                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-sm text-muted-foreground whitespace-pre-line">{reading.content}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">此聯合數字暫無詳細解讀</p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Tab 4: Wuxing */}
              <TabsContent value="wuxing">
                <div className="space-y-4">
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="font-display text-base">
                        五行分析（自身：{result.wuxing.selfWuxing}）
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        16個數字的五行統計：
                      </div>
                      {(() => {
                        const maxVal = Math.max(
                          result.wuxing.selfCount,
                          result.wuxing.childCount,
                          result.wuxing.careerCount,
                          result.wuxing.ghostCount,
                          result.wuxing.parentCount
                        );
                        return (
                          <div className="space-y-2">
                            <WuxingBar label="自身" value={result.wuxing.selfCount} maxVal={maxVal}
                              color={WUXING_COLOR[result.wuxing.wuxingRelations.self]} wuxing={result.wuxing.wuxingRelations.self} />
                            <WuxingBar label="子女/錢財" value={result.wuxing.childCount} maxVal={maxVal}
                              color={WUXING_COLOR[result.wuxing.wuxingRelations.child]} wuxing={result.wuxing.wuxingRelations.child} />
                            <WuxingBar label="事業/伴侶" value={result.wuxing.careerCount} maxVal={maxVal}
                              color={WUXING_COLOR[result.wuxing.wuxingRelations.career]} wuxing={result.wuxing.wuxingRelations.career} />
                            <WuxingBar label="官鬼/疾病" value={result.wuxing.ghostCount} maxVal={maxVal}
                              color={WUXING_COLOR[result.wuxing.wuxingRelations.ghost]} wuxing={result.wuxing.wuxingRelations.ghost} />
                            <WuxingBar label="父母/貴人" value={result.wuxing.parentCount} maxVal={maxVal}
                              color={WUXING_COLOR[result.wuxing.wuxingRelations.parent]} wuxing={result.wuxing.wuxingRelations.parent} />
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>

                  {/* Water Fire Clash */}
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="font-display text-base">水火沖</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-3xl font-bold ${result.waterFireClash > 0 ? 'text-destructive' : 'text-green-600'}`}>
                          {result.waterFireClash}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {result.waterFireClash === 0
                            ? "沒有水火沖"
                            : `有 ${result.waterFireClash} 組水火沖，情緒較不穩定，影響婚姻、貴人、財富，容易有心腦血管問題`}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Health Warnings */}
                  {result.wuxing.healthWarnings.length > 0 && (
                    <Card className="border-none shadow-sm border-l-4 border-l-destructive">
                      <CardHeader>
                        <CardTitle className="font-display text-base flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-destructive" />
                          健康警示
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {result.wuxing.healthWarnings.map((w, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                              {w}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Tab 5: Flow Year */}
              <TabsContent value="flowyear">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-display text-base">
                      {result.flowYear.year}年 流年運程
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="w-14 h-14 rounded-xl flex items-center justify-center font-mono text-2xl font-bold text-white"
                        style={{ backgroundColor: WUXING_COLOR[WUXING_MAP[result.flowYear.flowYear]] }}
                      >
                        {result.flowYear.flowYear}
                      </span>
                      <div>
                        <p className="font-medium">流年 {result.flowYear.flowYear}</p>
                        <p className="text-sm text-muted-foreground">
                          五行：{WUXING_MAP[result.flowYear.flowYear]}
                        </p>
                      </div>
                    </div>
                    {flowYearData[result.flowYear.flowYear] ? (
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {flowYearData[result.flowYear.flowYear]}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">此流年暫無詳細解讀</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
