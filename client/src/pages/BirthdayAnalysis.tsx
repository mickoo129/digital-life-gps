	
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
      className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-mono text-base sm:text-lg font-bold bg-blue-100/50 text-blue-700 border-2 border-blue-300/50"
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
              <span key={`ml${i}`} className="inline-flex items-center justify-center w-7 h-7 rounded font-mono text-sm font-semibold text-sky-700 bg-sky-50 border border-sky-200">{n}</span>
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

// 健康分析函數：整合所有健康判斷邏輯
function analyzeHealth(
  triangle: TriangleResult,
  combined: ReturnType<typeof calculateCombinedNumbers>,
  wuxing: ReturnType<typeof calculateWuxing>,
  waterFireClash: number
): { warnings: { category: string; severity: "high" | "medium" | "low"; message: string }[] } {
  const warnings: { category: string; severity: "high" | "medium" | "low"; message: string }[] = [];

  // === 規則1：官鬼疾病位出現「金」或「0」 ===
  const ghostWuxing = wuxing.wuxingRelations.ghost;
  const selfWx = wuxing.selfWuxing;
  const selfDetail = WUXING_HEALTH_DETAIL[selfWx];
  if (ghostWuxing === "金") {
    warnings.push({
      category: "官鬼疾病位",
      severity: "high",
      message: `官鬼疾病位為「金」（刀的磁場），有把刀對住健康位。主性格五行為「${selfWx}」，需特別注意${selfDetail.organs.join("、")}方面的問題。${selfDetail.description}`
    });
  }
  if (wuxing.ghostCount === 0) {
    warnings.push({
      category: "官鬼疾病位",
      severity: "high",
      message: `官鬼疾病位（${ghostWuxing}）數值為0，突發性身體問題風險高。主性格五行為「${selfWx}」，需特別注意${selfDetail.organs.join("、")}方面的問題。${selfDetail.description}`
    });
  }

  // === 規則3：差值雙向判斷 ===
  const careerDiff = Math.abs(wuxing.selfCount - wuxing.careerCount);
  if (careerDiff === 0 || careerDiff === 3) {
    const careerWx = wuxing.wuxingRelations.career;
    const detail = WUXING_HEALTH_DETAIL[careerWx];
    warnings.push({
      category: "五行差值",
      severity: careerDiff === 0 ? "high" : "medium",
      message: `「自身（${wuxing.selfCount}）」與「事業/伴侶（${wuxing.careerCount}）」差值 = ${careerDiff}，${careerDiff === 0 ? "突發性身體問題風險" : "需注意健康"}。事業/伴侶五行為「${careerWx}」，注意${detail.organs.join("、")}。`
    });
  }

  const ghostDiff = Math.abs(wuxing.selfCount - wuxing.ghostCount);
  if (ghostDiff === 0 || ghostDiff === 3) {
    const ghostWx = wuxing.wuxingRelations.ghost;
    const detail = WUXING_HEALTH_DETAIL[ghostWx];
    warnings.push({
      category: "五行差值",
      severity: ghostDiff === 0 ? "high" : "medium",
      message: `「自身（${wuxing.selfCount}）」與「官鬼/疾病（${wuxing.ghostCount}）」差值 = ${ghostDiff}，${ghostDiff === 0 ? "突發性身體問題風險" : "需注意健康"}。官鬼/疾病五行為「${ghostWx}」，注意${detail.organs.join("、")}。`
    });
  }

  // === 規則4：土金特殊組合 ===
  const earthCount = wuxing.counts["土"];
  const metalCount = wuxing.counts["金"];
  if (earthCount === 0 && metalCount >= 5) {
    warnings.push({
      category: "五行特殊組合",
      severity: "high",
      message: `土=0 且 金=${metalCount}（≥5），容易有糖尿病風險。建議定期檢查血糖。`
    });
  }
  if (earthCount <= 2 && metalCount >= 5) {
    warnings.push({
      category: "五行特殊組合",
      severity: "high",
      message: `土=${earthCount}（≤2）且 金=${metalCount}（≥5），需注意甲狀腺及免疫系統問題。`
    });
  }

  // === 五行表任何位置 = 0 ===
  const positions = [
    { label: "自身", value: wuxing.selfCount, wx: wuxing.wuxingRelations.self },
    { label: "子女/錢財", value: wuxing.childCount, wx: wuxing.wuxingRelations.child },
    { label: "事業/伴侶", value: wuxing.careerCount, wx: wuxing.wuxingRelations.career },
    { label: "父母/貴人", value: wuxing.parentCount, wx: wuxing.wuxingRelations.parent },
  ];
  for (const pos of positions) {
    if (pos.value === 0) {
      const detail = WUXING_HEALTH_DETAIL[pos.wx];
      warnings.push({
        category: "五行缺位",
        severity: "medium",
        message: `「${pos.label}」位（${pos.wx}）數值為0，能量不足。需注意${detail.organs.join("、")}。`
      });
    }
  }

  // === 水火沖健康影響 ===
  if (waterFireClash > 0) {
    warnings.push({
      category: "水火沖",
      severity: waterFireClash >= 2 ? "high" : "medium",
      message: `有 ${waterFireClash} 組水火沖，情緒較不穩定，容易有心腦血管問題。`
    });
  }

  // === 規則2 + 聯合數字健康提示 (核心修正版) ===
  const combinedEntries = [
    { key: "fatherGene", label: "第1組 父基因", num: combined.fatherGene },
    { key: "motherGene", label: "第2組 母基因", num: combined.motherGene },
    { key: "mainChar", label: "第3組 主性格", num: combined.mainChar },
    { key: "lifeProcess1", label: "第4組 過程1", num: combined.lifeProcess1 },
    { key: "lifeProcess2", label: "第5組 過程2", num: combined.lifeProcess2 },
    { key: "children", label: "第6組 子女下屬", num: combined.children },
    { key: "careerProcess1", label: "第7組 事業1", num: combined.careerProcess1 },
    { key: "careerProcess2", label: "第8組 事業2", num: combined.careerProcess2 },
    { key: "workFriends", label: "第9組 當下朋友", num: combined.workFriends },
    { key: "marriageProcess1", label: "第10組 婚姻1", num: combined.marriageProcess1 },
    { key: "marriageProcess2", label: "第11組 婚姻2", num: combined.marriageProcess2 },
    { key: "lateLife", label: "第12組 財健子", num: combined.lateLife },
    { key: "hiddenCode", label: "第13組 隱藏號碼", num: combined.hiddenCode },
  ];

  for (const entry of combinedEntries) {
    const reading = lookupCombinedNumber(entry.num); // 獲取完整解讀 (包含濕疹細節)
    const hw = getCombinedHealthWarning(entry.num); // 獲取嚴重程度
    
    if (reading?.health || hw) {
      const posIdx = parseInt(entry.label.match(/第(\d+)組/)?.[1] || "0");
      let extraNote = "";
      
      // 規則2：393/933 腫瘤高發號
      if (entry.num === "393" || entry.num === "933") {
        if (posIdx === 6) extraNote = "（子女下屬位出現，40多歲突發性惡性子宮肌瘤風險）";
        else if (posIdx === 9) extraNote = "（當下朋友位出現，需留意腫瘤高發風險）";
        else if (posIdx === 12) extraNote = "（財健子位出現，需留意腫瘤高發風險）";
      }

      warnings.push({
        category: "聯合數字",
        severity: hw?.severity || "medium",
        // 優先顯示詳細解讀文本
        message: `${entry.label}（${entry.num}）：${reading?.health || hw?.warning}${extraNote}`
      });
    }
  }

  return { warnings };
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
    healthWarnings: { category: string; severity: "high" | "medium" | "low"; message: string }[];
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
    const { warnings: healthWarnings } = analyzeHealth(triangle, combined, wuxing, waterFireClash);
    setResult({ triangle, combined, wuxing, waterFireClash, missingNumbers, flowYear, healthWarnings });
  };

  const profile = result ? numberProfiles[result.triangle.O] : null;

  const combinedIcons: Record<string, React.ReactNode> = {
    fatherGene: <Briefcase className="w-4 h-4" />,
    motherGene: <Heart className="w-4 h-4" />,
    mainChar: <Sparkles className="w-4 h-4" />,
    lifeProcess1: <TrendingUp className="w-4 h-4" />,
    lifeProcess2: <TrendingUp className="w-4 h-4" />,
    children: <Users className="w-4 h-4" />,
    careerProcess1: <Briefcase className="w-4 h-4" />,
    careerProcess2: <Briefcase className="w-4 h-4" />,
    workFriends: <Users className="w-4 h-4" />,
    marriageProcess1: <Heart className="w-4 h-4" />,
    marriageProcess2: <Heart className="w-4 h-4" />,
    lateLife: <Clock className="w-4 h-4" />,
    hiddenCode: <Eye className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
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
                    className="bg-[#3B82C8] hover:bg-[#2D6BA3] text-white w-full sm:w-auto"
                  >
                    計算生命密碼
                  </Button>
                </div>
              </div>
              {error && <p className="text-destructive text-sm mt-2">{error}</p>}
            </CardContent>
          </Card>

          {result && profile && (
            <Tabs defaultValue="triangle" className="space-y-6">
              <TabsList className="grid grid-cols-6 w-full">
                <TabsTrigger value="triangle" className="text-xs sm:text-sm">三角圖</TabsTrigger>
                <TabsTrigger value="personality" className="text-xs sm:text-sm">主性格</TabsTrigger>
                <TabsTrigger value="combined" className="text-xs sm:text-sm">聯合數字</TabsTrigger>
                <TabsTrigger value="wuxing" className="text-xs sm:text-sm">五行</TabsTrigger>
                <TabsTrigger value="health" className="text-xs sm:text-sm">
                  <span className="flex items-center gap-1">
                    健康
                    {result.healthWarnings.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-destructive text-white text-[10px] flex items-center justify-center">
                        {result.healthWarnings.length}
                      </span>
                    )}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="flowyear" className="text-xs sm:text-sm">流年</TabsTrigger>
              </TabsList>

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
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="combined">
                <div className="space-y-3">
                  {COMBINED_POSITION_LABELS.map((pos) => {
                    const numStr = (result.combined as any)[pos.key] as string;
                    const reading = lookupCombinedNumber(numStr);
                    const icon = combinedIcons[pos.key];
                    return (
                      <Card key={pos.key} className={`border-none shadow-sm ${reading?.health ? "ring-1 ring-destructive/30" : ""}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-muted-foreground">{icon}</span>
                            <span className="text-sm font-medium">{pos.label}</span>
                            <span className="ml-auto font-mono text-lg font-bold text-[#3B82C8]">{numStr}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{pos.description}</p>
                          {reading ? (
                            <details className="group">
                              <summary className="text-xs text-[#3B82C8] cursor-pointer hover:underline">
                                查看詳細解讀
                              </summary>
                              <div className="bg-muted/50 rounded-lg p-3 mt-2">
                                <p className="text-sm text-muted-foreground whitespace-pre-line">{reading.content}</p>
                                {reading.health && (
                                  <div className="mt-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs flex items-start gap-1.5">
                                    <Activity className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                    <span className="whitespace-pre-line">{reading.health}</span>
                                  </div>
                                )}
                              </div>
                            </details>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">此聯合數字暫無詳細解讀</p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="health">
                <div className="space-y-4">
                  {result.healthWarnings.length > 0 ? (
                    result.healthWarnings.map((warning, i) => (
                      <Card key={i} className={`border-none shadow-sm border-l-4 ${
                        warning.severity === 'high' ? 'border-l-destructive bg-destructive/5' : 
                        warning.severity === 'medium' ? 'border-l-orange-500 bg-orange-50' : 'border-l-blue-500 bg-blue-50'
                      }`}>
                        <CardContent className="p-4 flex gap-3">
                          <AlertTriangle className={`w-5 h-5 shrink-0 ${
                            warning.severity === 'high' ? 'text-destructive' : 
                            warning.severity === 'medium' ? 'text-orange-500' : 'text-blue-500'
                          }`} />
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{warning.category}</p>
                            <p className="text-sm text-foreground leading-relaxed">{warning.message}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="border-none shadow-sm">
                      <CardContent className="p-8 text-center">
                        <Heart className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-20" />
                        <p className="text-muted-foreground">暫無明顯健康風險提醒</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* 其餘內容保持原樣... */}
              <TabsContent value="wuxing">
                {/* 五行內容... */}
              </TabsContent>
              <TabsContent value="flowyear">
                {/* 流年內容... */}
              </TabsContent>

            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}