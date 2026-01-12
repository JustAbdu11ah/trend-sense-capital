import tweepy
import re
import pandas as pd
from collections import Counter
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# ==========================================
# CONFIGURATION
# ==========================================
# Set this to False if you have valid API keys
USE_MOCK_DATA = True 

# Twitter API V2 Credentials (Required if USE_MOCK_DATA = False)
BEARER_TOKEN = "YOUR_BEARER_TOKEN_HERE"

# Search settings
SEARCH_QUERY = "#stocks OR #investing OR #trading OR #stockmarket -is:retweet lang:en"
MAX_TWEETS = 100

def get_twitter_client():
    """Authenticates with Twitter API v2."""
    return tweepy.Client(bearer_token=BEARER_TOKEN)

def get_tweets(client, query, max_results):
    """Fetches tweets using API or returns mock data for testing."""
    if USE_MOCK_DATA:
        print("⚠️ USING MOCK DATA (Set USE_MOCK_DATA=False to use API)...")
        return [
            "I believe $TSLA is going to skyrocket after the earnings call! #bullish",
            "Market is crashing, selling all my $AAPL and $MSFT. Terrible news.",
            "$NVDA is unstoppable, AI is the future! Buying more.",
            "Why is $TSLA dropping so hard? This is painful.",
            "Just bought some $AMD and $NVDA. Semi-conductors are strong.",
            "$GME is back? Not touching that with a ten foot pole.",
            "Solid performance by $AAPL today despite the market dip.",
            "Shorting $SPY, the economic data looks weak.",
            "Can't believe $NVDA hit another all time high!",
            "$COIN looks risky right now with regulations looming."
        ]
    
    # Real API Fetching
    try:
        tweets_data = []
        # Paginator handles fetching more than the limit of one request
        for tweet in tweepy.Paginator(client.search_recent_tweets, query=query,
                                      tweet_fields=['context_annotations', 'created_at'],
                                      max_results=min(max_results, 100)).flatten(limit=max_results):
            tweets_data.append(tweet.text)
        return tweets_data
    except Exception as e:
        print(f"Error fetching tweets: {e}")
        return []

def extract_tickers(text):
    """Finds stock tickers starting with $ (e.g., $AAPL) using Regex."""
    # Regex looks for $ followed by 1-5 letters
    return re.findall(r'\$[A-Za-z]{1,5}\b', text.upper())

def analyze_market_sentiment(tweets):
    """
    Parses tweets to find top stocks and calculates their average sentiment.
    """
    analyzer = SentimentIntensityAnalyzer()
    
    stock_stats = {} # Structure: {'$AAPL': {'mentions': 0, 'sentiment_sum': 0}}
    
    print(f"Processing {len(tweets)} tweets...")
    
    for tweet in tweets:
        sentiment_score = analyzer.polarity_scores(tweet)['compound']
        tickers = extract_tickers(tweet)
        
        # If multiple tickers are in one tweet, we apply the tweet's sentiment to all of them
        # (A simplification, but effective for broad trends)
        for ticker in set(tickers): # set() avoids double counting if mentioned twice in one tweet
            if ticker not in stock_stats:
                stock_stats[ticker] = {'mentions': 0, 'sentiment_sum': 0.0}
            
            stock_stats[ticker]['mentions'] += 1
            stock_stats[ticker]['sentiment_sum'] += sentiment_score

    # Convert to List for DataFrame
    data = []
    for ticker, stats in stock_stats.items():
        avg_sentiment = stats['sentiment_sum'] / stats['mentions']
        data.append({
            'Stock': ticker,
            'Mentions': stats['mentions'],
            'Avg_Sentiment': round(avg_sentiment, 3),
            'Sentiment_Label': get_sentiment_label(avg_sentiment)
        })
    
    return data

def get_sentiment_label(score):
    if score >= 0.05: return "Bullish 🟢"
    if score <= -0.05: return "Bearish 🔴"
    return "Neutral ⚪"

# ==========================================
# MAIN EXECUTION
# ==========================================
if __name__ == "__main__":
    client = None
    if not USE_MOCK_DATA:
        client = get_twitter_client()

    # 1. Get Tweets
    raw_tweets = get_tweets(client, SEARCH_QUERY, MAX_TWEETS)

    # 2. Analyze
    if raw_tweets:
        results = analyze_market_sentiment(raw_tweets)
        
        # 3. Display Results
        if results:
            df = pd.DataFrame(results)
            # Sort by Mentions (Volume) to get "Top" stocks
            top_stocks = df.sort_values(by='Mentions', ascending=False).reset_index(drop=True)
            
            print("\n=== TOP STOCKS BY DISCUSSION VOLUME ===")
            print(top_stocks.to_string(index=False))
            
            # Optional: Visualize top 5
            # top_stocks.head(5).plot.bar(x='Stock', y='Mentions')
        else:
            print("No stock symbols found in the fetched tweets.")
    else:
        print("No tweets retrieved.")