import re
from typing import Dict, List, Tuple

import requests
import yfinance as yf


REDDIT_URL = "https://www.reddit.com/r/WallStreetBets/.json"
USER_AGENT = "TrendSenseCapitalBot/0.1 (by u/your_username)"


def fetch_reddit_data(limit: int = 100) -> Tuple[List[str], List[str]]:
   
    headers = {"User-Agent": USER_AGENT}
    params = {"limit": limit}

    response = requests.get(REDDIT_URL, headers=headers, params=params, timeout=10)
    response.raise_for_status()

    data = response.json()
    children = data.get("data", {}).get("children", [])

    reddit_posts: List[str] = []
    tickers_set = set()

    for child in children:
        post_data = child.get("data", {})
        title = post_data.get("title", "") or ""
        selftext = post_data.get("selftext", "") or ""

        # Combine title and body text
        text = title.strip()
        if selftext.strip():
            text = f"{title.strip()} {selftext.strip()}"

        if not text:
            continue

        # Find patterns like $AAPL, $TSLA, etc.
        found = re.findall(r"\$[A-Za-z]{1,5}", text)
        if not found:
            continue

        reddit_posts.append(text)
        for t in found:
            tickers_set.add(t.replace("$", "").upper())

    tickers = sorted(tickers_set)
    return reddit_posts, tickers


def fetch_ticker_info(tickers: List[str]) -> Dict[str, Tuple[str, float, float]]:
    
    result: Dict[str, Tuple[str, float, float]] = {}

    for symbol in tickers:
        try:
            ticker = yf.Ticker(symbol)

            # Try fast_info first for speed
            fast = getattr(ticker, "fast_info", None)
            price = None
            prev_close = None

            if fast:
                price = float(fast.get("last_price") or fast.get("lastPrice") or 0.0)
                prev_close = float(fast.get("previous_close") or fast.get("previousClose") or 0.0)

            # Fallback using history if fast_info is missing or zero
            if not price or not prev_close:
                hist = ticker.history(period="2d")
                if not hist.empty:
                    price = float(hist["Close"].iloc[-1])
                    if len(hist) > 1:
                        prev_close = float(hist["Close"].iloc[-2])
                    else:
                        prev_close = price

            if price is None or prev_close is None:
                continue

            change = round(price - prev_close, 2)

            info = ticker.info or {}
            name = info.get("shortName") or info.get("longName") or symbol

            result[symbol] = (name, round(price, 2), change)

        except Exception:
            # Skip tickers we can't resolve fully
            continue

    return result


def generate_python_literals(limit: int = 100) -> str:
   
    posts, tickers = fetch_reddit_data(limit=limit)
    ticker_data = fetch_ticker_info(tickers)

    lines: List[str] = []

    # reddit_posts
    lines.append("reddit_posts = [")
    for p in posts:
        lines.append(f"    {p!r},")
    lines.append("]")
    lines.append("")

    # ticker_info with REAL values (only for tickers we could resolve)
    lines.append("ticker_info = {")
    for symbol, (name, price, change) in sorted(ticker_data.items()):
        lines.append(f'    "{symbol}": ({name!r}, {price}, {change}),')
    lines.append("}")
    lines.append("")

    return "\n".join(lines)


if __name__ == "__main__":
    # When run as a script, print out Python code you can paste into stock_data.py
    python_code = generate_python_literals(limit=100)
    print(python_code)


