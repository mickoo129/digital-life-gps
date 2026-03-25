// 數字人生GPS 計算邏輯
// 所有資料來源：用戶上傳的PDF文件，不包含任何外部資料或推測

// =============================================
// 數字五行對應（來自五行PDF）
// 1,6=金  2,7=水  3,8=火  4,9=木  5=土
// =============================================
export const WUXING_MAP: Record<number, string> = {
  1: "金", 2: "水", 3: "火", 4: "木", 5: "土",
  6: "金", 7: "水", 8: "火", 9: "木"
};

export const WUXING_COLOR: Record<string, string> = {
  "金": "#C9A84C",
  "水": "#4A90D9",
  "火": "#E85D04",
  "木": "#2D6A4F",
  "土": "#8B5E3C"
};

// 五行相生：金生水、水生木、木生火、火生土、土生金
// 五行相剋：金剋木、木剋土、土剋水、水剋火、火剋金

// 以自身五行為中心的五行關係表（來自五行PDF）
const WUXING_RELATIONS: Record<string, {
  self: string;
  child: string;   // 子女/錢財：自身所生
  career: string;  // 事業/伴侶：自身所剋
  ghost: string;   // 官鬼/疾病：剋自身
  parent: string;  // 父母/貴人：生自身
}> = {
  "金": { self: "金", child: "水", career: "木", ghost: "火", parent: "土" },
  "水": { self: "水", child: "木", career: "火", ghost: "土", parent: "金" },
  "火": { self: "火", child: "土", career: "金", ghost: "水", parent: "木" },
  "木": { self: "木", child: "火", career: "土", ghost: "金", parent: "水" },
  "土": { self: "土", child: "金", career: "水", ghost: "木", parent: "火" }
};

// 五行健康對應（來自五行PDF）
const WUXING_HEALTH: Record<string, string[]> = {
  "金": ["肺部", "呼吸系統", "皮膚", "大腸"],
  "水": ["腎臟", "泌尿系統", "生殖系統", "骨骼"],
  "火": ["心臟", "心腦血管", "小腸", "眼睛"],
  "木": ["肝臟", "膽囊", "筋骨", "神經系統"],
  "土": ["脾胃", "消化系統", "免疫系統", "甲狀腺"]
};

// =============================================
// 倒正三角計算方法（來自倒正三角計算方法PDF）
// =============================================

// 數字相加取個位（如果結果>9則繼續相加直到個位）
function addDigits(a: number, b: number): number {
  let sum = a + b;
  while (sum > 9) {
    sum = Math.floor(sum / 10) + (sum % 10);
  }
  return sum;
}

export interface TriangleResult {
  // 原始8個數字（DD MM YYYY）
  raw: number[];
  // 倒三角（從上到下）
  // 頂行4個：I, J, K, L
  I: number; J: number; K: number; L: number;
  // 中行2個：M, N
  M: number; N: number;
  // 主性格：O（佔60%）
  O: number;
  // 正三角（從主性格往下）
  Q: number;  // 左下 ☆ = N+O
  P: number;  // 右下 ☆ = M+O
  R: number;  // 中下 = Q+P
  // 底行（早年 S,T,U、中年 QRP、晚年 V,W,X）
  S: number; T: number; U: number;  // 早年 21-40歲
  V: number; W: number; X: number;  // 晚年 61歲後
  // 所有16個數字（用於五行計算）
  all16: number[];
}

export function calculateTriangle(dateStr: string): TriangleResult | null {
  let day: number, month: number, year: number;
  
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    year = parseInt(parts[0]);
    month = parseInt(parts[1]);
    day = parseInt(parts[2]);
  } else if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    day = parseInt(parts[0]);
    month = parseInt(parts[1]);
    year = parseInt(parts[2]);
  } else {
    return null;
  }
  
  if (!day || !month || !year) return null;
  
  // 拆分為8個數字：DD MM YYYY
  const d1 = Math.floor(day / 10);
  const d2 = day % 10;
  const m1 = Math.floor(month / 10);
  const m2 = month % 10;
  const y1 = Math.floor(year / 1000);
  const y2 = Math.floor((year % 1000) / 100);
  const y3 = Math.floor((year % 100) / 10);
  const y4 = year % 10;
  
  const raw = [d1, d2, m1, m2, y1, y2, y3, y4];
  
  // === 倒三角計算 ===
  // 頂行：相鄰兩數相加
  const I = addDigits(raw[0], raw[1]); // A+B
  const J = addDigits(raw[2], raw[3]); // C+D
  const K = addDigits(raw[4], raw[5]); // E+F
  const L = addDigits(raw[6], raw[7]); // G+H
  
  // 中行：頂行相鄰兩數相加
  const M = addDigits(I, J);
  const N = addDigits(K, L);
  
  // 主性格：中行兩數相加
  const O = addDigits(M, N);
  
  // === 正三角計算（從主性格往下展開）===
  // Q = N + O（左下 ☆）
  const Q = addDigits(N, O);
  // P = M + O（右下 ☆）
  const P = addDigits(M, O);
  // R = Q + P（中下）
  const R = addDigits(Q, P);
  
  // === 底行 ===
  // 早年 21-40歲：S = I+M, T = J+M, U = S+T
  const S = addDigits(I, M);
  const T = addDigits(J, M);
  const U = addDigits(S, T);
  
  // 晚年 61歲後：V = K+N, W = L+N, X = V+W
  const V = addDigits(K, N);
  const W = addDigits(L, N);
  const X = addDigits(V, W);
  
  // 所有16個數字（倒三角7個 + 正三角9個）
  // 倒三角7個 = I, J, K, L, M, N, O
  // 正三角9個 = Q, P, R, S, T, U, V, W, X
  const all16 = [I, J, K, L, M, N, O, Q, P, R, S, T, U, V, W, X];
  
  return {
    raw, I, J, K, L, M, N, O, Q, P, R, S, T, U, V, W, X, all16
  };
}

// =============================================
// 聯合數字計算（13組）
// 來自倒正三角計算方法PDF的定義
// =============================================
export interface CombinedNumbers {
  fatherGene: string;     // 1. 父基因（事業）：I, J, M
  motherGene: string;     // 2. 母基因（婚姻）：K, L, N
  mainChar: string;       // 3. 主性格（60%）：M, N, O
  lifeProcess1: string;   // 4. 人生過程：M, O, P
  lifeProcess2: string;   // 5. 人生過程：N, O, Q
  children: string;       // 6. 子女/下屬（中年41-60歲）：Q, P, R
  careerProcess1: string; // 7. 事業過程：I, M, S
  careerProcess2: string; // 8. 事業過程：J, M, T
  workFriends: string;    // 9. 工作/朋友（早年21-40歲）：S, T, U
  marriageProcess1: string; // 10. 婚姻過程：K, N, V
  marriageProcess2: string; // 11. 婚姻過程：L, N, W
  lateLife: string;       // 12. 晚年（61歲後）：V, W, X
  hiddenCode: string;     // 13. 隱藏號碼：MNO疊加
}

export function calculateCombinedNumbers(t: TriangleResult): CombinedNumbers {
  const { I, J, K, L, M, N, O, Q, P, R, S, T, U, V, W, X } = t;
  
  // 第13組隱藏號碼：MNO + MNO 疊加
  const h1 = addDigits(M, M);
  const h2 = addDigits(N, N);
  const h3 = addDigits(O, O);
  
  return {
    fatherGene: `${I}${J}${M}`,         // 1. 父基因（事業）
    motherGene: `${K}${L}${N}`,          // 2. 母基因（婚姻）
    mainChar: `${M}${N}${O}`,            // 3. 主性格（60%）
    lifeProcess1: `${M}${O}${P}`,        // 4. 人生過程
    lifeProcess2: `${N}${O}${Q}`,        // 5. 人生過程
    children: `${Q}${P}${R}`,            // 6. 子女/下屬（中年）
    careerProcess1: `${I}${M}${S}`,      // 7. 事業過程
    careerProcess2: `${J}${M}${T}`,      // 8. 事業過程
    workFriends: `${S}${T}${U}`,         // 9. 工作/朋友（早年）
    marriageProcess1: `${K}${N}${V}`,    // 10. 婚姻過程
    marriageProcess2: `${L}${N}${W}`,    // 11. 婚姻過程
    lateLife: `${V}${W}${X}`,            // 12. 晚年
    hiddenCode: `${h1}${h2}${h3}`        // 13. 隱藏號碼
  };
}

// =============================================
// 五行分析（16個數字）
// =============================================
export interface WuxingAnalysis {
  selfWuxing: string;
  counts: Record<string, number>;
  selfCount: number;
  childCount: number;
  careerCount: number;
  ghostCount: number;
  parentCount: number;
  healthWarnings: string[];
  wuxingRelations: {
    self: string;
    child: string;
    career: string;
    ghost: string;
    parent: string;
  };
}

export function calculateWuxing(mainNumber: number, all16: number[]): WuxingAnalysis {
  const selfWuxing = WUXING_MAP[mainNumber];
  const relations = WUXING_RELATIONS[selfWuxing];
  
  // 統計16個數字中各五行的數量
  const counts: Record<string, number> = { "金": 0, "水": 0, "火": 0, "木": 0, "土": 0 };
  for (const n of all16) {
    if (n >= 1 && n <= 9) {
      counts[WUXING_MAP[n]]++;
    }
  }
  
  const selfCount = counts[relations.self];
  const childCount = counts[relations.child];
  const careerCount = counts[relations.career];
  const ghostCount = counts[relations.ghost];
  const parentCount = counts[relations.parent];
  
  // 健康警示：自身與事業/伴侶或自身與官鬼/疾病差距=3或=0
  const healthWarnings: string[] = [];
  
  const ghostWuxing = relations.ghost;
  const selfWuxingHealth = WUXING_HEALTH[selfWuxing];
  
  // 條件1：|自身 - 事業/伴侶| = 3 或 = 0
  const careerDiff = Math.abs(selfCount - careerCount);
  if (careerDiff === 3 || careerDiff === 0) {
    healthWarnings.push(`事業/伴侶位（${relations.career}）失衡，需注意${WUXING_HEALTH[relations.career].join("、")}問題`);
  }
  
  // 條件2：|自身 - 官鬼/疾病| = 3 或 = 0
  const ghostDiff = Math.abs(selfCount - ghostCount);
  if (ghostDiff === 3 || ghostDiff === 0) {
    healthWarnings.push(`官鬼/疾病位（${ghostWuxing}）失衡，需注意${WUXING_HEALTH[ghostWuxing].join("、")}問題`);
  }
  
  // 條件3：官鬼/疾病 = 金 → 注意主性格所屬健康問題
  if (ghostWuxing === "金") {
    healthWarnings.push(`官鬼/疾病位為金，需特別注意${selfWuxingHealth.join("、")}問題`);
  }
  
  return {
    selfWuxing,
    counts,
    selfCount,
    childCount,
    careerCount,
    ghostCount,
    parentCount,
    healthWarnings,
    wuxingRelations: relations
  };
}

// =============================================
// 水火沖計算（來自五行PDF）
// 水火沖：在倒三角中結構相鄰的位置，水(2,7)和火(3,8)相鄰
// =============================================
export function calculateWaterFireClash(t: TriangleResult): number {
  const { I, J, K, L, M, N, O } = t;
  
  const isWater = (n: number) => n === 2 || n === 7;
  const isFire = (n: number) => n === 3 || n === 8;
  const isClash = (a: number, b: number) => (isWater(a) && isFire(b)) || (isFire(a) && isWater(b));
  
  // 相鄰位置對（只看倒三角中的結構相鄰，M和N之間不算相鄰）
  // 頂行橫向: I-J, J-K, K-L
  // 頂行到中行斜向: I-M, J-M, K-N, L-N
  // 中行到底點斜向: M-O, N-O
  // 共9對相鄰關係
  const adjacentPairs: [number, number][] = [
    [I, J], [J, K], [K, L],
    [I, M], [J, M],
    [K, N], [L, N],
    [M, O], [N, O]
  ];
  
  let count = 0;
  for (const [a, b] of adjacentPairs) {
    if (isClash(a, b)) count++;
  }
  
  return count;
}

// =============================================
// 缺數計算（只用倒三角7個數字 I,J,K,L,M,N,O 中缺少的數字）
// =============================================
export function calculateMissingNumbers(t: TriangleResult): number[] {
  const triangle7 = [t.I, t.J, t.K, t.L, t.M, t.N, t.O];
  const present = new Set(triangle7.filter(n => n >= 1 && n <= 9));
  const missing: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (!present.has(i)) missing.push(i);
  }
  return missing;
}

// =============================================
// 流年計算（來自流年PDF）
// 流年 = 出生日期 + 出生月份 + 當年年份（倒三角計算）
// =============================================
export function calculateFlowYear(birthDate: string, targetYear?: number): {
  flowYear: number;
  year: number;
} {
  const year = targetYear || new Date().getFullYear();
  
  let day: number, month: number;
  if (birthDate.includes('-')) {
    const parts = birthDate.split('-');
    month = parseInt(parts[1]);
    day = parseInt(parts[2]);
  } else {
    const parts = birthDate.split('/');
    day = parseInt(parts[0]);
    month = parseInt(parts[1]);
  }
  
  // 流年計算：出生日 + 出生月 + 當年年份（各數字相加到個位）
  const d1 = Math.floor(day / 10);
  const d2 = day % 10;
  const m1 = Math.floor(month / 10);
  const m2 = month % 10;
  const y1 = Math.floor(year / 1000);
  const y2 = Math.floor((year % 1000) / 100);
  const y3 = Math.floor((year % 100) / 10);
  const y4 = year % 10;
  
  const raw = [d1, d2, m1, m2, y1, y2, y3, y4];
  
  const I = addDigits(raw[0], raw[1]);
  const J = addDigits(raw[2], raw[3]);
  const K = addDigits(raw[4], raw[5]);
  const L = addDigits(raw[6], raw[7]);
  const M_val = addDigits(I, J);
  const N_val = addDigits(K, L);
  const O_val = addDigits(M_val, N_val);
  
  return { flowYear: O_val, year };
}
