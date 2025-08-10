// items.mjs — lists/objects only (tickers, sectors, rules, trust)

export const TICKERS = {
  // Korea indices
  "KOSPI (^KS11)": "^KS11",
  "KOSDAQ (^KQ11)": "^KQ11",
  "KOSPI200 (^KS200)": "^KS200",

  // Asia indices
  "Hang Seng Index (^HSI)": "^HSI",
  "Nikkei 225 (^N225)": "^N225",

  // Korea local risk proxy (computed)
  "Korea Volatility Proxy (KVIX*)": "__KVIX__",

  // Global risk / FX / rates / commodities
  "US S&P500 Futures (ES=F)": "ES=F",
  "US Nasdaq Futures (NQ=F)": "NQ=F",
  "VIX (^VIX)": "^VIX",
  "Philadelphia Semi (^SOX)": "^SOX",
  "USD/KRW (KRW=X)": "KRW=X",
  "US 10Y (^TNX)": "^TNX",    // index/10 = %
  "US Dollar Index (DX=F)": "DX=F",
  "WTI Crude (CL=F)": "CL=F",
  "US NatGas (NG=F)": "NG=F",

  // China proxies for cosmetics / HSI rules
  "iShares China Large-Cap (FXI)": "FXI",
  "KraneShares China Internet (KWEB)": "KWEB",

  // Global thematics used in sector rules
  "Rheinmetall (RHM.DE)": "RHM.DE",
  "Lockheed Martin (LMT)": "LMT",
  "BAE Systems (BA.L)": "BA.L",
  "US Aerospace & Defense ETF (ITA)": "ITA",

  "US Global Jets ETF (JETS)": "JETS",

  "Global X Lithium (LIT)": "LIT",
  "Albemarle (ALB)": "ALB",
  "Copper Futures (HG=F)": "HG=F",
  "Tesla (TSLA)": "TSLA",

  "Breakwave Dry Bulk ETF (BDRY)": "BDRY",

  "VanEck Semi (SMH)": "SMH",
  "NVIDIA (NVDA)": "NVDA",
  "TSMC (TSM)": "TSM",

  "Consumer Discretionary (XLY)": "XLY",

  "IG Corp Bond ETF (LQD)": "LQD",
  "High Yield (HYG)": "HYG",
  "Long Treasury (TLT)": "TLT",
  "Brent Crude (BZ=F)": "BZ=F",
  "USD/CNY (CNY=X)": "CNY=X",
  "USD/JPY (JPY=X)": "JPY=X",
  "DAX (^GDAXI)": "^GDAXI",

  // Added for nuclear
  "Global Uranium (URA)": "URA",
  "Uranium Miners (URNM)": "URNM",
  "Cameco (CCJ)": "CCJ",

  // Korea sector constituents (subset)
  "Samsung Electronics (005930.KS)": "005930.KS",
  "SK hynix (000660.KS)": "000660.KS",
  "DB HiTek (000990.KS)": "000990.KS",

  "Hanwha Aerospace (012450.KS)": "012450.KS",
  "LIG Nex1 (079550.KS)": "079550.KS",
  "Korea Aerospace (047810.KS)": "047810.KS",

  "Hana Tour (039130.KQ)": "039130.KQ",
  "Modetour (080160.KQ)": "080160.KQ",
  "Hotel Shilla (008770.KS)": "008770.KS",
  "Korean Air (003490.KS)": "003490.KS",
  "Asiana Airlines (020560.KS)": "020560.KS",

  "Hyundai Motor (005380.KS)": "005380.KS",
  "Kia (000270.KS)": "000270.KS",
  "Hyundai Mobis (012330.KS)": "012330.KS",

  "HD Korea Shipbuild. (009540.KS)": "009540.KS",
  "Hanwha Ocean (042660.KS)": "042660.KS",
  "Hyundai Heavy Ind. (329180.KS)": "329180.KS",
  "Samsung Heavy Ind. (010140.KS)": "010140.KS",

  "LG Energy Solution (373220.KS)": "373220.KS",
  "Samsung SDI (006400.KS)": "006400.KS",
  "SK Innovation (096770.KS)": "096770.KS",
  "POSCO Future M (003670.KS)": "003670.KS",
  "Ecopro BM (247540.KQ)": "247540.KQ",
  "Ecopro (086520.KQ)": "086520.KQ",

  // Korea cosmetics (new)
  "Amorepacific (090430.KS)": "090430.KS",
  "LG H&H (051900.KS)": "051900.KS",
  "Cosmax (192820.KS)": "192820.KS",
  "Korea Kolmar (161890.KS)": "161890.KS",

  "KEPCO (015760.KS)": "015760.KS",
  "KEPCO KPS (051600.KS)": "051600.KS",
  "KEPCO E&C (052690.KQ)": "052690.KQ",
  "Doosan Enerbility (034020.KS)": "034020.KS",

  // --- New globals for added sectors ---
  "VanEck Steel (SLX)": "SLX",
  "Global Shipping ETF (BOAT)": "BOAT",
  "Invesco Solar (TAN)": "TAN",
  "iShares Clean Energy (ICLN)": "ICLN",
  "Financials (XLF)": "XLF",
  "Vanguard REIT (VNQ)": "VNQ",
  "Invesco DB Agriculture (DBA)": "DBA",
  "Corn (ZC=F)": "ZC=F",
  "Wheat (ZW=F)": "ZW=F",
  "Gold (GC=F)": "GC=F",
  "Silver (SI=F)": "SI=F",

  // --- Korea constituents for new sectors ---
  "POSCO Holdings (005490.KS)": "005490.KS",
  "Hyundai Steel (004020.KS)": "004020.KS",

  "HMM (011200.KS)": "011200.KS",
  "Pan Ocean (028670.KS)": "028670.KS",

  "Hanwha Solutions (009830.KS)": "009830.KS",
  "CS Wind (112610.KS)": "112610.KS",

  "KB Financial (105560.KS)": "105560.KS",
  "Shinhan Financial (055550.KS)": "055550.KS",
  "Hana Financial (086790.KS)": "086790.KS",

  "NAVER (035420.KS)": "035420.KS",
  "Kakao (035720.KS)": "035720.KS",

  "Hyundai E&C (000720.KS)": "000720.KS",
  "GS E&C (006360.KS)": "006360.KS",
  "Lotte REIT (330590.KS)": "330590.KS",

  "Namhae Chemical (025860.KS)": "025860.KS",
  "KG Chemical (001390.KS)": "001390.KS",
  "Chobi (001550.KS)": "001550.KS",

  "Korea Zinc (010130.KS)": "010130.KS",
  "Young Poong (000670.KS)": "000670.KS",
};

export const SECTORS = {
  "KOSPI 지수": ["KOSPI (^KS11)"],
  "KOSDAQ 지수": ["KOSDAQ (^KQ11)"],
  "홍콩 항셍지수": ["Hang Seng Index (^HSI)"],
  "일본 니케이225": ["Nikkei 225 (^N225)"],
  "한국 화장품": ["Amorepacific (090430.KS)", "LG H&H (051900.KS)", "Cosmax (192820.KS)", "Korea Kolmar (161890.KS)"],
  "한국 방산": ["Hanwha Aerospace (012450.KS)", "LIG Nex1 (079550.KS)", "Korea Aerospace (047810.KS)"],
  "한국 여행": ["Hana Tour (039130.KQ)", "Modetour (080160.KQ)", "Hotel Shilla (008770.KS)", "Korean Air (003490.KS)", "Asiana Airlines (020560.KS)"],
  "한국 자동차": ["Hyundai Motor (005380.KS)", "Kia (000270.KS)", "Hyundai Mobis (012330.KS)"],
  "한국 조선": ["HD Korea Shipbuild. (009540.KS)", "Hanwha Ocean (042660.KS)", "Hyundai Heavy Ind. (329180.KS)", "Samsung Heavy Ind. (010140.KS)"],
  "한국 2차전지": ["LG Energy Solution (373220.KS)", "Samsung SDI (006400.KS)", "SK Innovation (096770.KS)", "POSCO Future M (003670.KS)", "Ecopro BM (247540.KQ)", "Ecopro (086520.KQ)"],
  "한국 전력": ["KEPCO (015760.KS)", "KEPCO KPS (051600.KS)"],
  "한국 원자력": ["Doosan Enerbility (034020.KS)", "KEPCO E&C (052690.KQ)", "KEPCO KPS (051600.KS)"],
  "한국 반도체": ["Samsung Electronics (005930.KS)", "SK hynix (000660.KS)", "DB HiTek (000990.KS)"],

  // New sectors
  "한국 철강": ["POSCO Holdings (005490.KS)", "Hyundai Steel (004020.KS)"],
  "한국 해운": ["HMM (011200.KS)", "Pan Ocean (028670.KS)"],
  "한국 재생에너지": ["Hanwha Solutions (009830.KS)", "CS Wind (112610.KS)"],
  "한국 은행": ["KB Financial (105560.KS)", "Shinhan Financial (055550.KS)", "Hana Financial (086790.KS)"],
  "한국 인터넷": ["NAVER (035420.KS)", "Kakao (035720.KS)"],
  "한국 건설/리츠": ["Hyundai E&C (000720.KS)", "GS E&C (006360.KS)", "Lotte REIT (330590.KS)"],
  "한국 비료": ["Namhae Chemical (025860.KS)", "KG Chemical (001390.KS)", "Chobi (001550.KS)"],
  "한국 금테마": ["Korea Zinc (010130.KS)", "Young Poong (000670.KS)"],
};

export const LEADERS = {
  "한국 반도체": ["Samsung Electronics (005930.KS)", "SK hynix (000660.KS)"],
  "한국 전력": ["KEPCO (015760.KS)"],
  "한국 원자력": ["Doosan Enerbility (034020.KS)", "KEPCO E&C (052690.KQ)"],
  "한국 자동차": ["Hyundai Motor (005380.KS)", "Kia (000270.KS)"],
  "한국 조선": ["HD Korea Shipbuild. (009540.KS)", "Samsung Heavy Ind. (010140.KS)"],
  "한국 2차전지": ["LG Energy Solution (373220.KS)", "Samsung SDI (006400.KS)"],
  "한국 여행": ["Korean Air (003490.KS)", "Hotel Shilla (008770.KS)"],
  "한국 방산": ["Hanwha Aerospace (012450.KS)"],
  "한국 화장품": ["Amorepacific (090430.KS)", "LG H&H (051900.KS)"],

  // New leaders
  "한국 철강": ["POSCO Holdings (005490.KS)", "Hyundai Steel (004020.KS)"],
  "한국 해운": ["HMM (011200.KS)", "Pan Ocean (028670.KS)"],
  "한국 재생에너지": ["Hanwha Solutions (009830.KS)", "CS Wind (112610.KS)"],
  "한국 은행": ["KB Financial (105560.KS)", "Shinhan Financial (055550.KS)"],
  "한국 인터넷": ["NAVER (035420.KS)", "Kakao (035720.KS)"],
  "한국 건설/리츠": ["Hyundai E&C (000720.KS)", "GS E&C (006360.KS)"],
  "한국 비료": ["Namhae Chemical (025860.KS)", "KG Chemical (001390.KS)"],
  "한국 금테마": ["Korea Zinc (010130.KS)", "Young Poong (000670.KS)"],
};

export const RULES = {
  "KOSPI 지수": [
    { label: "US S&P500 Futures (ES=F)", w: 1.0, note: "글로벌 톤" },
    { label: "VIX (^VIX)", w: 0.8, invert: true, note: "변동성" },
    { label: "Korea Volatility Proxy (KVIX*)", w: 0.5, invert: true, note: "국내 공포(근사)" },
    { label: "USD/KRW (KRW=X)", w: 0.6, invert: true, note: "원강세 우호" },
    { label: "US 10Y (^TNX)", w: 0.5, invert: true, note: "금리" },
    { label: "US Dollar Index (DX=F)", w: 0.4, invert: true, note: "달러" },
    { label: "Philadelphia Semi (^SOX)", w: 0.2, note: "반도체 영향" }
  ],
  "KOSDAQ 지수": [
    { label: "US Nasdaq Futures (NQ=F)", w: 1.2, note: "성장주 톤" },
    { label: "Philadelphia Semi (^SOX)", w: 0.9, note: "반도체" },
    { label: "Korea Volatility Proxy (KVIX*)", w: 0.7, invert: true, note: "국내 공포(근사)" },
    { label: "US 10Y (^TNX)", w: 0.6, invert: true, note: "금리" },
    { label: "VIX (^VIX)", w: 0.5, invert: true, note: "변동성" },
    { label: "USD/KRW (KRW=X)", w: 0.4, invert: true, note: "원강세 우호" }
  ],
  "홍콩 항셍지수": [
    { label: "US S&P500 Futures (ES=F)", w: 0.8, note: "글로벌" },
    { label: "VIX (^VIX)", w: 0.6, invert: true },
    { label: "USD/CNY (CNY=X)", w: 0.8, invert: true, note: "위안 강세" },
    { label: "US Dollar Index (DX=F)", w: 0.6, invert: true, note: "달러" },
    { label: "KraneShares China Internet (KWEB)", w: 0.6 },
    { label: "iShares China Large-Cap (FXI)", w: 0.6 }
  ],
  "일본 니케이225": [
    { label: "USD/JPY (JPY=X)", w: 1.0, note: "엔 약세 우호" },
    { label: "US S&P500 Futures (ES=F)", w: 0.6 },
    { label: "VIX (^VIX)", w: 0.5, invert: true },
    { label: "US Dollar Index (DX=F)", w: 0.3 },
    { label: "US 10Y (^TNX)", w: 0.2 }
  ],
  "한국 화장품": [
    { label: "USD/CNY (CNY=X)", w: 0.9, invert: true, note: "위안 강세 우호" },
    { label: "USD/KRW (KRW=X)", w: 0.6, invert: true, note: "원강세 우호" },
    { label: "Korea Volatility Proxy (KVIX*)", w: 0.3, invert: true, note: "국내 리스크" },
    { label: "Hang Seng Index (^HSI)", w: 0.6, note: "중국/홍콩 톤" },
    { label: "KraneShares China Internet (KWEB)", w: 0.5, note: "중국 소비" },
    { label: "iShares China Large-Cap (FXI)", w: 0.4 },
    { label: "US Dollar Index (DX=F)", w: 0.3, invert: true }
  ],
  "한국 방산": [
    { label: "Rheinmetall (RHM.DE)", w: 1.1, note: "유럽 방산" },
    { label: "Lockheed Martin (LMT)", w: 0.7, note: "미 방산" },
    { label: "BAE Systems (BA.L)", w: 0.7, note: "영국 방산" },
    { label: "US Aerospace & Defense ETF (ITA)", w: 0.5, note: "ETF" },
    { label: "DAX (^GDAXI)", w: 0.3, note: "유럽 리스크" },
    { label: "VIX (^VIX)", w: 0.3, note: "리스크" },
    { label: "USD/KRW (KRW=X)", w: 0.2, note: "원약세 수출 우호" }
  ],
  "한국 여행": [
    { label: "US Global Jets ETF (JETS)", w: 0.8, note: "항공" },
    { label: "USD/KRW (KRW=X)", w: 0.8, invert: true, note: "원강세 우호" },
    { label: "WTI Crude (CL=F)", w: 0.8, invert: true, note: "유류비" },
    { label: "Korea Volatility Proxy (KVIX*)", w: 0.3, invert: true, note: "국내 리스크" },
    { label: "USD/CNY (CNY=X)", w: 0.3, invert: true, note: "중국소비" },
    { label: "USD/JPY (JPY=X)", w: 0.2, invert: true, note: "일본소비" },
    { label: "US S&P500 Futures (ES=F)", w: 0.3 }
  ],
  "한국 자동차": [
    { label: "USD/KRW (KRW=X)", w: 0.8, note: "수출" },
    { label: "US S&P500 Futures (ES=F)", w: 0.4 },
    { label: "US Nasdaq Futures (NQ=F)", w: 0.2 }
  ],
  "한국 조선": [
    { label: "Breakwave Dry Bulk ETF (BDRY)", w: 1.0, note: "운임" },
    { label: "Brent Crude (BZ=F)", w: 0.3, note: "오프쇼어" },
    { label: "USD/KRW (KRW=X)", w: 0.5, note: "수출" },
    { label: "US S&P500 Futures (ES=F)", w: 0.2 }
  ],
  "한국 2차전지": [
    { label: "Global X Lithium (LIT)", w: 1.0, note: "리튬" },
    { label: "Tesla (TSLA)", w: 0.6, note: "EV" },
    { label: "Albemarle (ALB)", w: 0.6, note: "리튬 생산" },
    { label: "Copper Futures (HG=F)", w: 0.2, note: "구리" },
    { label: "US 10Y (^TNX)", w: 0.5, invert: true, note: "금리" }
  ],
  "한국 전력": [
    { label: "US NatGas (NG=F)", w: 1.0, invert: true, note: "연료비" },
    { label: "US 10Y (^TNX)", w: 0.8, invert: true, note: "금리" },
    { label: "IG Corp Bond ETF (LQD)", w: 0.5, note: "크레딧" },
    { label: "Long Treasury (TLT)", w: 0.3, note: "장기채" }
  ],
  "한국 원자력": [
    { label: "Global Uranium (URA)", w: 1.0 },
    { label: "Uranium Miners (URNM)", w: 0.8 },
    { label: "Cameco (CCJ)", w: 0.8 },
    { label: "US 10Y (^TNX)", w: 0.2, invert: true }
  ],
  "한국 반도체": [
    { label: "Philadelphia Semi (^SOX)", w: 1.2 },
    { label: "NVIDIA (NVDA)", w: 0.6 },
    { label: "TSMC (TSM)", w: 0.5 },
    { label: "VanEck Semi (SMH)", w: 0.2 },
    { label: "USD/KRW (KRW=X)", w: 0.6 },
    { label: "US 10Y (^TNX)", w: 0.4, invert: true },
    { label: "US Nasdaq Futures (NQ=F)", w: 0.4 }
  ],

  // New sector rules
  "한국 철강": [
    { label: "VanEck Steel (SLX)", w: 1.0 },
    { label: "Copper Futures (HG=F)", w: 0.6 },
    { label: "US Dollar Index (DX=F)", w: 0.5, invert: true },
    { label: "USD/CNY (CNY=X)", w: 0.5, invert: true }
  ],
  "한국 해운": [
    { label: "Global Shipping ETF (BOAT)", w: 1.0 },
    { label: "Breakwave Dry Bulk ETF (BDRY)", w: 0.8 },
    { label: "Brent Crude (BZ=F)", w: 0.6, invert: true },
    { label: "USD/CNY (CNY=X)", w: 0.4, invert: true }
  ],
  "한국 재생에너지": [
    { label: "Invesco Solar (TAN)", w: 1.0 },
    { label: "iShares Clean Energy (ICLN)", w: 0.6 },
    { label: "US 10Y (^TNX)", w: 0.7, invert: true },
    { label: "US Dollar Index (DX=F)", w: 0.4, invert: true }
  ],
  "한국 은행": [
    { label: "US 10Y (^TNX)", w: 1.0 },
    { label: "Financials (XLF)", w: 0.6 },
    { label: "High Yield (HYG)", w: 0.4 }
  ],
  "한국 인터넷": [
    { label: "US Nasdaq Futures (NQ=F)", w: 1.1 },
    { label: "US 10Y (^TNX)", w: 0.7, invert: true },
    { label: "KraneShares China Internet (KWEB)", w: 0.5 },
    { label: "US Dollar Index (DX=F)", w: 0.3, invert: true }
  ],
  "한국 건설/리츠": [
    { label: "US 10Y (^TNX)", w: 1.0, invert: true },
    { label: "Vanguard REIT (VNQ)", w: 0.6 },
    { label: "Copper Futures (HG=F)", w: 0.3 }
  ],
  "한국 비료": [
    { label: "Invesco DB Agriculture (DBA)", w: 0.9 },
    { label: "Corn (ZC=F)", w: 0.4 },
    { label: "Wheat (ZW=F)", w: 0.4 },
    { label: "US NatGas (NG=F)", w: 0.6, invert: true }
  ],
  "한국 금테마": [
    { label: "Gold (GC=F)", w: 1.0 },
    { label: "US 10Y (^TNX)", w: 0.6, invert: true },
    { label: "US Dollar Index (DX=F)", w: 0.6, invert: true }
  ],
};

export const TRUST = {
  "KOSPI 지수": "중간",
  "KOSDAQ 지수": "중간",
  "홍콩 항셍지수": "중간",
  "일본 니케이225": "중간",
  "한국 화장품": "중간",
  "한국 반도체": "높음",
  "한국 전력": "높음",
  "한국 자동차": "높음",
  "한국 방산": "중간",
  "한국 2차전지": "중간",
  "한국 여행": "중간",
  "한국 조선": "중간",
  "한국 원자력": "중간",

  // New trust tiers
  "한국 철강": "중간",
  "한국 해운": "중간",
  "한국 재생에너지": "중간",
  "한국 은행": "높음",
  "한국 인터넷": "중간",
  "한국 건설/리츠": "중간",
  "한국 비료": "중간",
  "한국 금테마": "중간",
};
