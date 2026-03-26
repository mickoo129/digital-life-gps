import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Heart, Briefcase, Users, TrendingUp, ShieldAlert, Sparkles, Eye, Clock, Activity } from "lucide-react";
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

// --- 子組件：三角圖表 (保留你原本的樣式) ---
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
        {[I, J, K, L].map((n, i) => (<div key={i} className="flex flex-col items-center">{numCell(n)}<span className="text-[9px] text-muted-foreground mt-0.5">{['I ☆', 'J', 'K', 'L ☆'][i]}</span></div>))}
      </div>
      <div className="flex gap-3 sm:gap-4">
        {[M, N].map((n, i) => (<div key={i} className="flex flex-col items-center">{numCell(n)}<span className="text-[9px] text-muted-foreground mt-0.5">{['M', 'N'][i]}</span></div>))}
      </div>
      <div className="flex flex-col items-center">{numCell(O, WUXING_COLOR[WUXING_MAP[O]] + "30")}<span className="text-[9px] text-muted-foreground mt-0.5">O 主性格</span></div>
      <Separator className="my-2 w-48" />
      <div className="text-xs text-muted-foreground font-medium">▲ 正三角</div>
      <div className="flex gap-8 sm:gap-12">
        <div className="flex flex-col items-center gap-1">{starCell(Q)}<span className="text-[10px] text-muted-foreground">Q ☆左</span></div>
        <div className="flex flex-col items-center gap-1">{starCell(P)}<span className="text-[10px] text-muted-foreground">P ☆右</span></div>
      </div>
      <div className="flex flex-col items-center gap-1">{starCell(R)}<span className="text-[10px] text-muted-foreground">R</span></div>
    </div>
  );
}

function WuxingBar({ label, value, maxVal, color, wuxing }: { label: string; value: number; maxVal: number; color: string; wuxing: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm w-28 text-right text-muted-foreground">{label}（{wuxing}）</span>
      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
          style={{ width: `${Math.max((value / Math.max(maxVal, 1)) * 100, 8)}%`, backgroundColor: color }}>
          <span className="text-xs font-bold text-white">{value}</span>
        </div>
      </div>
    </div>
  );
}

// --- 核心健康分析函數：加入詳細診斷邏輯 ---
function analyzeHealth(triangle: TriangleResult, combined: any, wuxing: any, waterFireClash: number) {
  const warnings: { category: string; severity: "high" | "medium" | "low"; message: string }[] = [];
  const selfWx = wuxing.selfWuxing;
  const selfDetail = WUXING_HEALTH_DETAIL[selfWx];

  // 1. 官鬼位診斷 (重點加強)
  const ghostWx = wuxing.wuxingRelations.ghost;
  if (ghostWx === "金") {
    warnings.push({
      category: "官鬼疾病位", severity: "high",
      message: `官鬼疾病位為「金」（刀的磁場），有把刀對住健康位。身為「${selfWx}」型人，需特別注意${selfDetail.organs.join("、")}方面的問題。`
    });
  } else if (wuxing.ghostCount === 0) {
    warnings.push({
      category: "官鬼疾病位", severity: "high",
      message: `官鬼疾病位能量為 0（能量缺失），突發性身體問題風險高。主性格「${selfWx}」需注意${selfDetail.organs.join("、")}。`
    });
  }

  // 2. 393/933 腫瘤風險碼診斷
  COMBINED_POSITION_LABELS.forEach(pos => {
    const num = combined[pos.key];
    if (num === "393" || num === "933") {
      let extra = "需留意腫瘤高發風險。";
      if (pos.key === "children") extra = "40多歲突發性惡性子宮肌瘤風險極高。";
      warnings.push({ category: `高危聯合碼 (${pos.label})`, severity: "high", message: `${num}：${extra}` });
    } else {
      const hw = getCombinedHealthWarning(num);
      if (hw) warnings.push({ category: "聯合數字", severity: hw.severity, message: `${pos.label}(${num})：${hw.warning}` });
    }
  });

  // 3. 五行平衡檢查
  if (wuxing.counts["土"] === 0 && wuxing.counts["金"] >= 5) {
    warnings.push({ category: "五行特殊組合", severity: "high", message: "土缺且金過旺（≥5），容易有糖尿病風險。" });
  }

  return { warnings };
}

export default function BirthdayAnalysis() {
  const [dateInput, setDateInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    if (!dateInput) return setError("請輸入出生日期");
    const triangle = calculateTriangle(dateInput);
    if (!triangle) return setError("日期格式錯誤");
    const combined = calculateCombinedNumbers(triangle);
    const wuxing = calculateWuxing(triangle.O, triangle.all16);
    const { warnings: healthWarnings } = analyzeHealth(triangle, combined, wuxing, calculateWaterFireClash(triangle));
    
    setResult({
      triangle, combined, wuxing, healthWarnings,
      waterFireClash: calculateWaterFireClash(triangle),
      missingNumbers: calculateMissingNumbers(triangle),
      flowYear: calculateFlowYear(dateInput)
    });
  };

  const profile = result ? numberProfiles[result.triangle.O] : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container py-8 max-w-3xl mx-auto">
        {/* Input Section */}
        <Card className="mb-8 border-none shadow-md">
          <CardHeader><CardTitle className="font-display text-xl">輸入出生日期</CardTitle></CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Label className="text-sm text-muted-foreground mb-1 block">出生日期</Label>
              <Input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
            </div>
            <Button onClick={handleCalculate} className="bg-[#3B82C8] mt-auto">計算生命密碼</Button>
          </CardContent>
        </Card>

        {result && profile && (
          <Tabs defaultValue="triangle" className="space-y-6">
            <TabsList className="grid grid-cols-6 w-full overflow-x-auto">
              <TabsTrigger value="triangle">三角圖</TabsTrigger>
              <TabsTrigger value="personality">主性格</TabsTrigger>
              <TabsTrigger value="combined">聯合碼</TabsTrigger>
              <TabsTrigger value="wuxing">五行</TabsTrigger>
              <TabsTrigger value="health" className="bg-red-50">健康</TabsTrigger>
              <TabsTrigger value="flowyear">流年</TabsTrigger>
            </TabsList>

            <TabsContent value="triangle"><Card className="p-4"><TriangleDiagram t={result.triangle} /></Card></TabsContent>
            
            <TabsContent value="personality">
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{backgroundColor: WUXING_COLOR[profile.wuxing]}}>{profile.number}</div>
                  <div><CardTitle>{profile.number}號人 — {profile.title}</CardTitle><p className="text-sm text-muted-foreground">五行：{profile.wuxing}</p></div>
                </div>
                <Separator />
                <p className="text-sm"><strong>內心需求：</strong>{profile.psychologicalNeed}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><h4 className="text-sm font-bold text-green-600">正面特質</h4><ul className="text-xs list-disc pl-4">{profile.positiveTraits.map((t:any, i:any)=><li key={i}>{t}</li>)}</ul></div>
                  <div><h4 className="text-sm font-bold text-red-600">負面特質</h4><ul className="text-xs list-disc pl-4">{profile.negativeTraits.map((t:any, i:any)=><li key={i}>{t}</li>)}</ul></div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="combined">
              <div className="space-y-3">
                {COMBINED_POSITION_LABELS.map(pos => (
                  <Card key={pos.key} className="p-4 flex justify-between items-center">
                    <div><p className="text-xs text-muted-foreground">{pos.label}</p><p className="font-bold">{result.combined[pos.key]}</p></div>
                    <p className="text-xs max-w-[200px] text-right">{lookupCombinedNumber(result.combined[pos.key])?.content || "能量平穩"}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="wuxing">
              <Card className="p-4 space-y-4">
                {['self', 'child', 'career', 'ghost', 'parent'].map(k => (
                  <WuxingBar key={k} label={k==='self'?'自身':k==='child'?'子女/錢財':k==='career'?'事業/伴侶':k==='ghost'?'官鬼/疾病':'父母/貴人'} 
                    value={result.wuxing[k+'Count']} maxVal={10} color={WUXING_COLOR[result.wuxing.wuxingRelations[k]]} wuxing={result.wuxing.wuxingRelations[k]} />
                ))}
              </Card>
            </TabsContent>

            <TabsContent value="health">
              <div className="space-y-4">
                {result.healthWarnings.map((w: any, i: number) => (
                  <Card key={i} className={`border-none p-4 ${w.severity === 'high' ? 'bg-red-50 ring-1 ring-red-200' : 'bg-orange-50'}`}>
                    <div className="flex gap-3">
                      <ShieldAlert className={w.severity === 'high' ? 'text-red-600' : 'text-orange-500'} />
                      <div>
                        <p className="text-xs font-bold text-slate-500">{w.category}</p>
                        <p className={`text-sm ${w.severity === 'high' ? 'font-bold' : ''}`}>{w.message}</p>
                      </div>
                    </div>
                  </Card>
                ))}
                <Card className="p-4 bg-blue-50">
                  <p className="text-xs font-bold text-blue-800 mb-1">五行本質：{result.wuxing.selfWuxing}人</p>
                  <p className="text-xs text-blue-700">{WUXING_HEALTH_DETAIL[result.wuxing.selfWuxing].description}</p>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="flowyear">
              <Card className="p-6">
                <CardTitle className="text-lg mb-4">2026 流年分析：{result.flowYear.flowYear} 號年</CardTitle>
                <p className="text-sm whitespace-pre-line text-muted-foreground">
                  {flowYearData[result.flowYear.flowYear] || "目前尚無此流年詳細解說。"}
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}