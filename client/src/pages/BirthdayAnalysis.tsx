import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Heart, Briefcase, Users, TrendingUp, Sparkles, Eye, Clock, Activity, ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  calculateTriangle, calculateCombinedNumbers, calculateWuxing,
  calculateWaterFireClash, calculateMissingNumbers, calculateFlowYear,
  WUXING_MAP, WUXING_COLOR, type TriangleResult
} from "@/lib/calculator";
import { numberProfiles } from "@/lib/data-numbers";
import { lookupCombinedNumber } from "@/lib/data-combined";
import { flowYearData } from "@/lib/data-flowyear";
import { getCombinedHealthWarning, WUXING_HEALTH_DETAIL, COMBINED_POSITION_LABELS } from "@/lib/data-health";

// --- 子組件：三角圖表 ---
function TriangleDiagram({ t }: { t: TriangleResult }) {
  const { raw, I, J, K, L, M, N, O, Q, P, R, S, T, U, V, W, X } = t;
  const numCell = (n: number, highlight?: string) => (
    <span className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full font-mono text-base sm:text-lg font-bold"
      style={{
        backgroundColor: highlight || WUXING_COLOR[WUXING_MAP[n]] + "20",
        color: WUXING_COLOR[WUXING_MAP[n]] || "#666",
        border: `2px solid ${WUXING_COLOR[WUXING_MAP[n]] || "#ccc"}`
      }}>{n}</span>
  );
  const starCell = (n: number) => (
    <span className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-mono text-base sm:text-lg font-bold bg-blue-100/50 text-blue-700 border-2 border-blue-300/50">{n}</span>
  );

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <div className="text-xs text-muted-foreground mb-1">原始數字：{raw.join(" ")}</div>
      <div className="text-xs text-muted-foreground font-medium">▼ 倒三角</div>
      <div className="flex gap-3 sm:gap-4">
        {[I, J, K, L].map((n, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {numCell(n)}
            <span className="text-[9px] text-muted-foreground mt-0.5">{['I ☆', 'J', 'K', 'L ☆'][idx]}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-3 sm:gap-4">
        {[M, N].map((n, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {numCell(n)}
            <span className="text-[9px] text-muted-foreground mt-0.5">{['M', 'N'][idx]}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center">
        {numCell(O, WUXING_COLOR[WUXING_MAP[O]] + "30")}
        <span className="text-[9px] text-muted-foreground mt-0.5">O 主性格</span>
      </div>
      <Separator className="my-2 w-48" />
      <div className="text-xs text-muted-foreground font-medium">▲ 正三角</div>
      <div className="flex gap-8 sm:gap-12">
        <div className="flex flex-col items-center gap-1">{starCell(Q)}<span className="text-[10px] text-muted-foreground">Q ☆左</span></div>
        <div className="flex flex-col items-center gap-1">{starCell(P)}<span className="text-[10px] text-muted-foreground">P ☆右</span></div>
      </div>
      <div className="flex flex-col items-center gap-1">{starCell(R)}<span className="text-[10px] text-muted-foreground">R</span></div>
      <Separator className="my-2 w-48" />
      <div className="flex gap-2 sm:gap-6 mt-2 text-center">
        <div className="flex flex-col items-center">
          <div className="flex gap-1">{[S, T, U].map((n, i) => <span key={i} className="w-7 h-7 rounded bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold">{n}</span>)}</div>
          <span className="text-[10px] mt-1">早年 (21-40)</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex gap-1">{[Q, P, R].map((n, i) => <span key={i} className="w-7 h-7 rounded bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center text-xs font-bold">{n}</span>)}</div>
          <span className="text-[10px] mt-1">中年 (41-60)</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex gap-1">{[V, W, X].map((n, i) => <span key={i} className="w-7 h-7 rounded bg-green-50 border border-green-200 text-green-700 flex items-center justify-center text-xs font-bold">{n}</span>)}</div>
          <span className="text-[10px] mt-1">晚年 (61+)</span>
        </div>
      </div>
    </div>
  );
}

function WuxingBar({ label, value, maxVal, color, wuxing }: { label: string; value: number; maxVal: number; color: string; wuxing: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-24 text-right text-muted-foreground">{label}({wuxing})</span>
      <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
          style={{ width: `${Math.max((value / Math.max(maxVal, 1)) * 100, 8)}%`, backgroundColor: color }}>
          <span className="text-[10px] font-bold text-white">{value}</span>
        </div>
      </div>
    </div>
  );
}

// --- 核心邏輯：健康分析 ---
function analyzeHealth(
  triangle: TriangleResult,
  combined: ReturnType<typeof calculateCombinedNumbers>,
  wuxing: ReturnType<typeof calculateWuxing>,
  waterFireClash: number
) {
  const warnings: { category: string; severity: "high" | "medium" | "low"; message: string }[] = [];

  // 1. 官鬼位邏輯
  const ghostWx = wuxing.wuxingRelations.ghost;
  const selfWx = wuxing.selfWuxing;
  const selfDetail = WUXING_HEALTH_DETAIL[selfWx];
  if (ghostWx === "金" || wuxing.ghostCount === 0) {
    warnings.push({
      category: "官鬼疾病位",
      severity: "high",
      message: `官鬼疾病位(${ghostWx})風險較高。主性格五行為「${selfWx}」，需特別注意${selfDetail.organs.join("、")}。`
    });
  }

  // 2. 五行差值
  const careerDiff = Math.abs(wuxing.selfCount - wuxing.careerCount);
  if (careerDiff === 0 || careerDiff === 3) {
    warnings.push({
      category: "五行差值",
      severity: careerDiff === 0 ? "high" : "medium",
      message: `自身與事業/伴侶差值為 ${careerDiff}，注意${WUXING_HEALTH_DETAIL[wuxing.wuxingRelations.career].organs.join("、")}健康。`
    });
  }

  // 3. 聯合數字 & 特殊腫瘤碼 393/933
  const combinedEntries = COMBINED_POSITION_LABELS.map(pos => ({ label: pos.label, num: (combined as any)[pos.key], key: pos.key }));
  combinedEntries.forEach(entry => {
    const hw = getCombinedHealthWarning(entry.num);
    if (hw) {
      let extra = "";
      if ((entry.num === "393" || entry.num === "933") && (entry.key === "children" || entry.key === "workFriends" || entry.key === "lateLife")) {
        extra = "【重點提醒：突發性惡性肌瘤/腫瘤高發風險】";
      }
      warnings.push({ category: "聯合數字", severity: hw.severity, message: `${entry.label}(${entry.num}): ${hw.warning} ${extra}` });
    }
  });

  return warnings;
}

export default function BirthdayAnalysis() {
  const [dateInput, setDateInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    if (!dateInput) return setError("請輸入出生日期");
    const triangle = calculateTriangle(dateInput);
    if (!triangle) return setError("日期格式不正確");
    
    const combined = calculateCombinedNumbers(triangle);
    const wuxing = calculateWuxing(triangle.O, triangle.all16);
    const healthWarnings = analyzeHealth(triangle, combined, wuxing, calculateWaterFireClash(triangle));
    
    setResult({
      triangle, combined, wuxing, healthWarnings,
      missingNumbers: calculateMissingNumbers(triangle),
      flowYear: calculateFlowYear(dateInput)
    });
  };

  const profile = result ? numberProfiles[result.triangle.O] : null;

  return (
    <div className="min-h-screen bg-background pb-10">
      <Navbar />
      <div className="container max-w-3xl py-8">
        <Card className="mb-8 border-none shadow-md">
          <CardHeader><CardTitle>輸入出生日期</CardTitle></CardHeader>
          <CardContent className="flex gap-3">
            <Input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} className="font-mono" />
            <Button onClick={handleCalculate} className="bg-blue-600 hover:bg-blue-700 text-white">計算</Button>
          </CardContent>
          {error && <p className="text-destructive text-center pb-4 text-sm">{error}</p>}
        </Card>

        {result && profile && (
          <Tabs defaultValue="triangle" className="space-y-6">
            <TabsList className="grid grid-cols-6 w-full h-auto flex-wrap">
              {['triangle', 'personality', 'combined', 'wuxing', 'health', 'flowyear'].map(tab => (
                <TabsTrigger key={tab} value={tab} className="text-[10px] sm:text-xs py-2">
                  {tab === 'triangle' ? '三角圖' : tab === 'personality' ? '主性格' : tab === 'combined' ? '聯合數' : tab === 'wuxing' ? '五行' : tab === 'health' ? '健康' : '流年'}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="triangle"><Card className="border-none shadow-sm"><CardContent><TriangleDiagram t={result.triangle} /></CardContent></Card></TabsContent>

            <TabsContent value="personality">
              <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: WUXING_COLOR[profile.wuxing] }}>{profile.number}</div>
                  <div><CardTitle>{profile.number}號人 - {profile.title}</CardTitle><p className="text-xs text-muted-foreground">五行：{profile.wuxing}</p></div>
                </CardHeader>
                <CardContent className="text-sm space-y-4">
                  <div><h4 className="font-bold">內心數字 {profile.innerNumber}</h4><p>{profile.innerNumberMeaning}</p></div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div><h4 className="text-green-600 font-bold">正面特質</h4><ul className="list-disc list-inside text-xs">{profile.positiveTraits.map((t:any, i:any) => <li key={i}>{t}</li>)}</ul></div>
                    <div><h4 className="text-red-600 font-bold">負面特質</h4><ul className="list-disc list-inside text-xs">{profile.negativeTraits.map((t:any, i:any) => <li key={i}>{t}</li>)}</ul></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="combined">
              <div className="space-y-2">
                {COMBINED_POSITION_LABELS.map((pos) => {
                  const num = (result.combined as any)[pos.key];
                  const info = lookupCombinedNumber(num);
                  return (
                    <Card key={pos.key} className="border-none shadow-sm overflow-hidden">
                      <div className="p-3 flex justify-between items-center bg-muted/30">
                        <span className="text-xs font-bold">{pos.label}</span>
                        <span className="font-mono text-blue-600 font-bold">{num}</span>
                      </div>
                      <CardContent className="p-3 text-xs text-muted-foreground">
                        <p className="mb-1 italic">{pos.description}</p>
                        <p className="text-foreground">{info?.content || "暫無解讀"}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="wuxing">
               <Card className="border-none shadow-sm">
                  <CardHeader><CardTitle className="text-sm">五行能量分佈 (自身: {result.wuxing.selfWuxing})</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {['self', 'child', 'career', 'ghost', 'parent'].map(key => (
                      <WuxingBar 
                        key={key}
                        label={key === 'self' ? '自身' : key === 'child' ? '子女' : key === 'career' ? '事業' : key === 'ghost' ? '官鬼' : '父母'}
                        value={(result.wuxing as any)[key + 'Count']}
                        maxVal={10}
                        color={WUXING_COLOR[(result.wuxing.wuxingRelations as any)[key]]}
                        wuxing={(result.wuxing.wuxingRelations as any)[key]}
                      />
                    ))}
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="health">
              <div className="space-y-4">
                {/* 1. 自動警告卡片 */}
                {result.healthWarnings.map((w: any, i: any) => (
                  <Card key={i} className={`border-l-4 ${w.severity === 'high' ? 'border-l-red-500 bg-red-50' : 'border-l-orange-500 bg-orange-50'}`}>
                    <CardContent className="p-4 flex gap-3">
                      <ShieldAlert className={w.severity === 'high' ? 'text-red-500' : 'text-orange-500'} />
                      <div><p className="text-[10px] font-bold uppercase">{w.category}</p><p className="text-sm">{w.message}</p></div>
                    </CardContent>
                  </Card>
                ))}

                {/* 2. 五行詳細養生建議 (這是你說原本不見了的部分) */}
                <Card className="border-none shadow-sm bg-blue-50/50">
                  <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Activity className="w-4 h-4 text-blue-600" /> 五行詳細養生建議 ({result.wuxing.selfWuxing})</CardTitle></CardHeader>
                  <CardContent className="text-sm space-y-3">
                    <p className="font-bold text-blue-800">主要器官：{WUXING_HEALTH_DETAIL[result.wuxing.selfWuxing].organs.join("、")}</p>
                    <p className="text-muted-foreground leading-relaxed">{WUXING_HEALTH_DETAIL[result.wuxing.selfWuxing].description}</p>
                    <div className="mt-2 p-3 bg-white rounded-md border border-blue-100 text-xs text-muted-foreground">
                      <p className="font-bold text-blue-700 mb-1">💡 生活建議：</p>
                      針對「{result.wuxing.selfWuxing}」屬性，平日應注意睡眠充足，避免過度勞累影響{WUXING_HEALTH_DETAIL[result.wuxing.selfWuxing].organs[0]}功能。
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="flowyear">
              <Card className="border-none shadow-sm">
                <CardHeader><CardTitle>流年分析 ({result.flowYear.year}年)</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl font-bold text-blue-600">{result.flowYear.flowYear}</div>
                    <div className="text-sm font-medium">{flowYearData[result.flowYear.flowYear]?.title}</div>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{flowYearData[result.flowYear.flowYear]?.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}