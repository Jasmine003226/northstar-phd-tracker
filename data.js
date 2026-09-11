const ARCHIVED_UNVERIFIED_PROJECTS = [
  {
    id: "dtu-wind-vacancies", title: "风能与能源系统博士机会（持续关注）", institution: "Technical University of Denmark · DTU Wind and Energy Systems", country: "丹麦", city: "Roskilde / Lyngby", lab: "DTU Wind and Energy Systems", topics: ["浮式风电", "气动弹性", "风机载荷"], deadline: null, firstSeen: "2026-09-09", match: 94, status: "开放状态待逐岗核验", verified: true, sourceType: "机构官方招聘入口", source: "https://www.dtu.dk/english/about/job-and-career/vacant-positions", summary: "DTU 官方职位入口。该机构的风能与能源系统研究与浮式风机、载荷及气动弹性高度相关；具体博士岗位、导师和截止日期须以入口中的当日职位为准。", requirements: ["具体项目要求：来源未说明", "学位与语言要求：来源未说明"], fit: ["OpenFAST/QBlade 全耦合建模直接相关", "频域响应与疲劳载荷经验高度相关", "海洋湍流研究可形成明确研究衔接"]
  },
  {
    id: "ntnu-phd-vacancies", title: "海洋技术与浮式风电博士机会（持续关注）", institution: "Norwegian University of Science and Technology · NTNU", country: "挪威", city: "Trondheim", lab: "Department of Marine Technology / NOWITECH ecosystem", topics: ["海洋结构", "浮式风机", "系泊动力学"], deadline: null, firstSeen: "2026-09-09", match: 91, status: "开放状态待逐岗核验", verified: true, sourceType: "学校官方招聘入口", source: "https://www.ntnu.edu/vacancies", summary: "NTNU 官方职位入口。海洋技术、浮式结构与海上风能方向和你的船舶与海洋工程背景相符；当前具体招聘信息需在官方入口逐项确认。", requirements: ["具体项目要求：来源未说明", "导师：来源未说明", "截止日期：来源未说明"], fit: ["浮式平台六自由度与系泊响应高度匹配", "气动-水动-伺服-弹性耦合经验可直接迁移", "具备疲劳载荷与长期风况加权经验"]
  },
  {
    id: "tudelft-vacancies", title: "海上风能与航空弹性博士机会（持续关注）", institution: "Delft University of Technology", country: "荷兰", city: "Delft", lab: "Faculty of Aerospace Engineering / Civil Engineering and Geosciences", topics: ["风能", "气动弹性", "结构动力学"], deadline: null, firstSeen: "2026-09-09", match: 88, status: "开放状态待逐岗核验", verified: true, sourceType: "学校官方招聘入口", source: "https://www.tudelft.nl/en/about-tu-delft/working-at-tu-delft/search-jobs", summary: "TU Delft 官方招聘入口。风能、结构动力学和海洋工程相关博士岗位与现有数值模拟研究存在交叉。", requirements: ["具体项目要求：来源未说明", "导师：来源未说明", "截止日期：来源未说明"], fit: ["大容量柔性叶片结构建模相关", "BEM、非定常气动与耦合仿真经验匹配", "代码间验证方法具有可复用性"]
  },
  {
    id: "tu-berlin-qblade", title: "风能系统与 QBlade 相关博士机会（持续关注）", institution: "Technische Universität Berlin", country: "德国", city: "Berlin", lab: "Chair of Fluid Dynamics / QBlade research ecosystem", topics: ["QBlade", "风机气动", "非线性结构"], deadline: null, firstSeen: "2026-09-09", match: 96, status: "开放状态待逐岗核验", verified: true, sourceType: "学校官方岗位入口", source: "https://www.tu.berlin/en/working-at-tu-berlin/job-postings", summary: "TU Berlin 官方岗位入口。QBlade 源自该校相关研究团队，你已有直接的软件与非线性 Timoshenko 梁模型研究经验。当前是否存在对应博士空缺需在官方入口核验。", requirements: ["具体项目要求：来源未说明", "导师：来源未说明", "截止日期：来源未说明"], fit: ["已有 QBlade 深度使用与代码对比成果", "理解非线性 Timoshenko 梁及弯扭耦合", "可延展至 LLFVW、BeamDyn 或更高保真模型"]
  },
  {
    id: "strathclyde-vacancies", title: "海上可再生能源博士机会（持续关注）", institution: "University of Strathclyde", country: "英国", city: "Glasgow", lab: "Naval Architecture, Ocean & Marine Engineering", topics: ["海洋工程", "海上风电", "结构可靠性"], deadline: null, firstSeen: "2026-09-09", match: 84, status: "开放状态待逐岗核验", verified: true, sourceType: "学校官方职位入口", source: "https://www.strath.ac.uk/workwithus/vacancies/", summary: "学校官方职位入口。其船舶、海洋与海洋工程学科与用户的硕士专业及浮式风机研究方向相关。", requirements: ["具体项目要求：来源未说明", "资金与国际生资格：来源未说明", "截止日期：来源未说明"], fit: ["船舶与海洋工程教育背景吻合", "掌握平台运动、系泊和疲劳载荷分析", "有大型浮式风机完整系统研究经历"]
  },
  {
    id: "euraxess-search", title: "欧洲浮式风电博士岗位聚合检索", institution: "EURAXESS · European Commission", country: "欧洲多国", city: "来源未说明", lab: "来源未说明", topics: ["岗位聚合", "海上风电", "博士招聘"], deadline: null, firstSeen: "2026-09-09", match: 78, status: "检索入口可用", verified: true, sourceType: "欧盟官方科研岗位平台", source: "https://euraxess.ec.europa.eu/jobs/search", summary: "欧盟 EURAXESS 官方科研职位检索入口，用于每日发现跨欧洲的新发布博士岗位。具体信息以每条岗位的原始学校或机构页面为准。", requirements: ["具体项目要求：来源未说明", "导师：来源未说明", "截止日期：来源未说明"], fit: ["覆盖国家广，适合作为每日发现源", "需用关键词进一步过滤并回溯原始机构页面"]
  }
];
// Only direct, currently accessible vacancy-detail pages belong here.
// Institution homepages, search pages and expired/404 pages must stay out.
const PROJECTS = [];
const PROFILE = { topics: ["浮式海上风机", "海洋低频湍流", "耦合动力学", "结构与疲劳载荷", "大型柔性叶片"], tools: ["OpenFAST", "QBlade", "ROSCO", "MoorDyn", "Welch PSD", "Rainflow / DEL", "Weibull 长期加权"] };
const SEARCH_LOGS = [
  {date:"2026-09-11", time:"当前", found:9, added:0, duplicates:0, closed:6, note:"清除全部非岗位详情入口和 404 链接；岗位列表仅接受可打开的具体职位页面"},
  {date:"2026-09-09", time:"16:30", found:6, added:0, duplicates:0, closed:6, note:"原候选来源未达到具体岗位验证标准，已从申请列表撤下"}
];
const SAVED_SOURCES = [
  ["EURAXESS","欧盟科研岗位平台","https://euraxess.ec.europa.eu/jobs/search"],
  ["ScholarshipDB","博士奖学金与职位检索","https://scholarshipdb.net/"],
  ["University Positions","欧洲高校职位聚合","https://universitypositions.eu/"],
  ["Academic Positions","学术职位平台","https://academicpositions.com/"],
  ["AcademicTransfer","荷兰高校与研究机构","https://www.academictransfer.com/en/"],
  ["DAAD","德国奖学金与博士信息","https://www.daad.de/en/studying-in-germany/scholarships/"],
  ["GERiT","德国研究机构目录","https://www.gerit.org/en/"],
  ["Max Planck","德国马普学会","https://www.mpg.de/en"],
  ["Jobbnorge","挪威高校招聘平台","https://www.jobbnorge.no/search/en"]
];
