// ref.mjs — RULES에서 쓰는 지표들의 설명/영향 사전
// 키는 RULES 안의 label과 100% 동일해야 합니다!
export const REFS = {
    "US S&P500 Futures (ES=F)": { m: "미국 S&P500 선물. 글로벌 위험자산 톤", i: "↑ 리스크온/주식 우호, ↓ 리스크오프" },
    "US Nasdaq Futures (NQ=F)": { m: "미국 나스닥100 선물. 성장/테크 톤", i: "↑ 성장·반도체·인터넷 우호" },
    "VIX (^VIX)": { m: "S&P500 변동성 지수", i: "↑ 공포·리스크오프(주식 역풍), ↓ 안정" },
    "Korea Volatility Proxy (KVIX*)": { m: "KS200 일변동성의 20일 실현변동성 근사", i: "↑ 국내 공포 확대(역풍), ↓ 안정" },
    "USD/KRW (KRW=X)": { m: "달러/원 환율", i: "↓ 원강세: 내수/여행 우호 · ↑ 원약세: 수출마진/방산 우호" },
    "US 10Y (^TNX)": { m: "미국 10년 금리(지수/10=%)", i: "↑ 성장/리츠 역풍·은행 우호, ↓ 반대" },
    "US Dollar Index (DX=F)": { m: "달러 인덱스", i: "↑ EM/원자재 역풍, ↓ EM·위험자산 우호" },
    "Philadelphia Semi (^SOX)": { m: "필라델피아 반도체 지수", i: "↑ 글로벌/한국 반도체 우호" },
    "USD/CNY (CNY=X)": { m: "달러/위안", i: "↓ 위안강세: 중국소비/화장품 우호" },
    "USD/JPY (JPY=X)": { m: "달러/엔", i: "↑ 엔약세: 니케이·수출 우호" },
    "Hang Seng Index (^HSI)": { m: "홍콩 항셍지수", i: "↑ 중국/홍콩 톤 개선" },
    "Nikkei 225 (^N225)": { m: "일본 니케이225", i: "↑ 일본 주식 톤 개선" },
    "KraneShares China Internet (KWEB)": { m: "중국 인터넷 ETF", i: "↑ 중국 소비·플랫폼 톤 개선" },
    "iShares China Large-Cap (FXI)": { m: "중국 대형주 ETF", i: "↑ 중국 전반 톤 개선" },

    "Rheinmetall (RHM.DE)": { m: "독일 방산 OEM", i: "↑ 글로벌 방산 모멘텀 강화" },
    "Lockheed Martin (LMT)": { m: "미국 방산 OEM", i: "↑ 글로벌 방산 모멘텀 강화" },
    "BAE Systems (BA.L)": { m: "영국 방산 OEM", i: "↑ 글로벌 방산 모멘텀 강화" },
    "US Aerospace & Defense ETF (ITA)": { m: "미 방산 ETF", i: "↑ 방산 섹터 톤 개선" },
    "DAX (^GDAXI)": { m: "독일 DAX", i: "↑ 유럽 경기/리스크 톤 개선" },

    "US Global Jets ETF (JETS)": { m: "글로벌 항공 ETF", i: "↑ 여객수요/여행 톤 개선" },
    "WTI Crude (CL=F)": { m: "WTI 유가", i: "↑ 항공/전력 비용↑(역풍), ↓ 비용↓(우호)" },
    "Brent Crude (BZ=F)": { m: "브렌트 유가", i: "↑ 오일/오프쇼어 투자 기대(+), 항공/전력(-)" },

    "Breakwave Dry Bulk ETF (BDRY)": { m: "건화물 운임 ETF", i: "↑ 해운 운임/조선 수주 톤 개선" },
    "Global Shipping ETF (BOAT)": { m: "글로벌 해운 ETF", i: "↑ 해운 업황 우호" },

    "Global X Lithium (LIT)": { m: "리튬·배터리 밸류체인", i: "↑ 2차전지 톤 개선" },
    "Albemarle (ALB)": { m: "리튬 생산", i: "↑ 배터리 소재 수익성/수요 개선" },
    "Copper Futures (HG=F)": { m: "구리 선물", i: "↑ 경기민감·철강·건설 우호" },
    "Tesla (TSLA)": { m: "테슬라", i: "↑ EV 심리 개선(2차전지 우호)" },

    "VanEck Semi (SMH)": { m: "글로벌 반도체 ETF", i: "↑ 반도체 톤 개선" },
    "NVIDIA (NVDA)": { m: "AI 대표주", i: "↑ 반도체/성장 심리 개선" },
    "TSMC (TSM)": { m: "파운드리 대장", i: "↑ 반도체 공급망 심리 개선" },

    "IG Corp Bond ETF (LQD)": { m: "미 IG 회사채 ETF", i: "↑ 신용스프레드 축소(금융여건 완화)" },
    "High Yield (HYG)": { m: "미 HY 회사채 ETF", i: "↑ 위험선호/신용여건 완화" },
    "Long Treasury (TLT)": { m: "미 장기채 ETF", i: "↑ 금리하락·리츠/성장 우호" },

    "Global Uranium (URA)": { m: "우라늄 ETF", i: "↑ 원자력 밸류체인 우호" },
    "Uranium Miners (URNM)": { m: "우라늄 광산 ETF", i: "↑ 원자력 밸류체인 우호" },
    "Cameco (CCJ)": { m: "우라늄 메이저", i: "↑ 원전 관련 모멘텀" },

    "Invesco Solar (TAN)": { m: "태양광 ETF", i: "↑ 재생에너지 톤 개선" },
    "iShares Clean Energy (ICLN)": { m: "클린에너지 ETF", i: "↑ 재생에너지 톤 개선" },
    "Financials (XLF)": { m: "미 금융 ETF", i: "↑ 은행 톤 개선" },
    "Vanguard REIT (VNQ)": { m: "미 리츠 ETF", i: "↑ 금리하락·부동산 우호" },

    "Invesco DB Agriculture (DBA)": { m: "농산물 선물 ETF", i: "↑ 비료 수요·가격 환경 우호" },
    "Corn (ZC=F)": { m: "옥수수 선물", i: "↑ 비료 수요/가격 환경 우호" },
    "Wheat (ZW=F)": { m: "밀 선물", i: "↑ 비료 수요/가격 환경 우호" },

    "Gold (GC=F)": { m: "금 선물", i: "↑ 금테마(제련·광업) 우호" },
    "Silver (SI=F)": { m: "은 선물", i: "↑ 귀금속 테마 우호" }
};
