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
    ]
};