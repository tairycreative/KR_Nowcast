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
    "US 10Y (^TNX)": "^TNX",
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
    "Young Poong (000670.KS)": "000670.KS"
};