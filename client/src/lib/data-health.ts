// 數字人生GPS - 健康提醒數據
// 所有資料來源：用戶上傳的PDF文件，不包含任何外部資料或推測

// 五行健康詳細對應（來自五行PDF）
export const WUXING_HEALTH_DETAIL: Record<string, {
  organs: string[];
  description: string;
}> = {
  "金": {
    organs: ["肺", "大腸", "呼吸系統", "皮膚"],
    description: "金主肺、大腸，需注意呼吸系統疾病（如哮喘、支氣管炎、鼻敏感）及大腸問題（腹瀉、便秘）"
  },
  "水": {
    organs: ["腎", "膀胱", "泌尿系統", "生殖系統", "骨骼"],
    description: "水主腎、膀胱，需注意腎臟、泌尿系統、生殖系統及骨骼方面的問題"
  },
  "火": {
    organs: ["心臟", "小腸", "心腦血管", "眼睛"],
    description: "火主心、小腸，需注意心腦血管疾病、高血壓、三高等問題"
  },
  "木": {
    organs: ["肝", "膽", "眼睛", "神經系統"],
    description: "木主肝、膽，需注意肝膽問題、眼睛疾病，也容易有糖尿病風險"
  },
  "土": {
    organs: ["脾", "胃", "消化系統", "免疫系統"],
    description: "土主脾、胃，需注意消化系統、免疫系統及甲狀腺方面的問題"
  }
};

// 聯合數字健康提示（來自聯合數字PDF）
// key為聯合數字，value為健康提示
export const COMBINED_HEALTH_WARNINGS: Record<string, {
  warning: string;
  severity: "high" | "medium" | "low";
}> = {
  "112": {
    warning: "呼吸系統疾病（哮喘、支氣管炎、鼻敏感）；大腸問題（腹瀉、便秘）",
    severity: "medium"
  },
  "121": {
    warning: "呼吸系統疾病（哮喘、支氣管炎、鼻敏感）；大腸問題（腹瀉、便秘）",
    severity: "medium"
  },
  "211": {
    warning: "呼吸系統疾病（哮喘、支氣管炎、鼻敏感）；大腸問題（腹瀉、便秘）",
    severity: "medium"
  },
  "123": {
    warning: "容易有心腦血管問題",
    severity: "medium"
  },
  "213": {
    warning: "容易有心腦血管問題",
    severity: "medium"
  },
  "191": {
    warning: "先天肝膽容易出問題，盡量少開車",
    severity: "high"
  },
  "911": {
    warning: "先天肝膽容易出問題，盡量少開車",
    severity: "high"
  },
  "279": {
    warning: "女性注意子宮、婦科、腎；男性注意腎、前列腺",
    severity: "medium"
  },
  "729": {
    warning: "女性注意子宮、婦科、腎；男性注意腎、前列腺",
    severity: "medium"
  },
  "281": {
    warning: "男性容易得腎臟、前列腺與骨科病；女性容易得婦科類、生殖系統方面的疾病",
    severity: "medium"
  },
  "821": {
    warning: "男性容易得腎臟、前列腺與骨科病；女性容易得婦科類、生殖系統方面的疾病",
    severity: "medium"
  },
  "336": {
    warning: "火氣較旺，注意心腦血管健康",
    severity: "medium"
  },
  "358": {
    warning: "數字3和8火氣較旺，注意心腦血管健康",
    severity: "medium"
  },
  "538": {
    warning: "數字3和8火氣較旺，注意心腦血管健康",
    severity: "medium"
  },
  "382": {
    warning: "心腦血管高發號；腫瘤高發風險",
    severity: "high"
  },
  "832": {
    warning: "心腦血管高發號；腫瘤高發風險",
    severity: "high"
  },
  "393": {
    warning: "腫瘤高發號碼，細胞分裂太快容易變異",
    severity: "high"
  },
  "933": {
    warning: "腫瘤高發號碼，細胞分裂太快容易變異",
    severity: "high"
  },
  "448": {
    warning: "木太旺，注意肝、膽、眼睛方面問題；容易有糖尿病、心腦血管問題",
    severity: "high"
  },
  "494": {
    warning: "三個木，注意肝、膽、眼睛容易出事",
    severity: "high"
  },
  "944": {
    warning: "三個木，注意肝、膽、眼睛容易出事",
    severity: "high"
  },
  "663": {
    warning: "金能量太旺，注意大腸及肺的調理",
    severity: "medium"
  },
  "696": {
    warning: "金能量太旺，注意大腸及肺的調理",
    severity: "medium"
  },
  "966": {
    warning: "金能量太旺，注意大腸及肺的調理",
    severity: "medium"
  },
  "887": {
    warning: "注意心腦血管方面的疾病（兩組大水火沖）",
    severity: "high"
  },
  "898": {
    warning: "心腦血管高發號，脾氣大容易鑽牛角尖",
    severity: "high"
  },
  "988": {
    warning: "心腦血管高發號，脾氣大容易鑽牛角尖",
    severity: "high"
  }
};

// 查找聯合數字的健康提示
export function getCombinedHealthWarning(numStr: string): { warning: string; severity: "high" | "medium" | "low" } | null {
  // 直接查找
  if (COMBINED_HEALTH_WARNINGS[numStr]) {
    return COMBINED_HEALTH_WARNINGS[numStr];
  }
  return null;
}

// 13組聯合數字的位置名稱和說明
export const COMBINED_POSITION_LABELS: {
  key: string;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  { key: "fatherGene", label: "1. 父基因（事業）", shortLabel: "父基因", description: "來自父親的基因影響，與事業發展相關" },
  { key: "motherGene", label: "2. 母基因（婚姻）", shortLabel: "母基因", description: "來自母親的基因影響，與婚姻感情相關" },
  { key: "mainChar", label: "3. 主性格（佔60%）", shortLabel: "主性格", description: "核心性格特質，佔整體性格60%" },
  { key: "lifeProcess1", label: "4. 人生過程1", shortLabel: "過程1", description: "人生發展的第一階段過程" },
  { key: "lifeProcess2", label: "5. 人生過程2", shortLabel: "過程2", description: "人生發展的第二階段過程" },
  { key: "children", label: "6. 子女/下屬（中年41-60歲）", shortLabel: "子女下屬", description: "中年時期的子女和下屬關係" },
  { key: "careerProcess1", label: "7. 事業1", shortLabel: "事業1", description: "事業發展的第一階段" },
  { key: "careerProcess2", label: "8. 事業2", shortLabel: "事業2", description: "事業發展的第二階段" },
  { key: "workFriends", label: "9. 當下朋友（早年21-40歲）", shortLabel: "當下朋友", description: "早年時期的工作夥伴和朋友關係" },
  { key: "marriageProcess1", label: "10. 婚姻1", shortLabel: "婚姻1", description: "婚姻感情的第一階段" },
  { key: "marriageProcess2", label: "11. 婚姻2", shortLabel: "婚姻2", description: "婚姻感情的第二階段" },
  { key: "lateLife", label: "12. 財健子（晚年61歲後）", shortLabel: "財健子", description: "晚年時期的財富、健康和子女" },
  { key: "hiddenCode", label: "13. 隱藏號碼", shortLabel: "隱藏號", description: "MNO疊加的隱藏密碼" },
];

// 特殊位置的健康提示
// 第6組（子女/下屬QPR）出現393/933 → 惡性子宮肌瘤（女性）
// 第6/9/12組（七魄外面）出現393/933 → 惡性腫瘤高發
export const SPECIAL_POSITION_HEALTH: Record<string, {
  positions: number[];  // 第幾組（1-based）
  numbers: string[];
  warning: string;
}[]> = {
  "tumor": [
    {
      positions: [6, 9, 12],
      numbers: ["393", "933"],
      warning: "七魄外面出現393/933，容易有惡性腫瘤高發"
    },
    {
      positions: [6],
      numbers: ["393", "933"],
      warning: "第6組（子女/下屬）出現393/933，女性需特別注意惡性子宮肌瘤"
    }
  ]
};
