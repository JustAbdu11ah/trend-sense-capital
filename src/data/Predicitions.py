import re
import torch
from transformers import BertTokenizer, BertForSequenceClassification
import numpy as np
import json
from typing import List, Dict, Tuple, Optional
from collections import defaultdict
import firebase_admin
from firebase_admin import credentials, firestore
from .stock_data import reddit_posts, ticker_info



def get_ground_truth_sentiment(post_id: int) -> Optional[str]:
    ground_truth = ground_truth_sentiments.get(post_id)
    if ground_truth:
        return ground_truth
    
    pattern = post_id % 10
    if pattern in [0, 1, 2, 5, 6]:
        return "Positive"
    elif pattern in [3, 4, 7]:
        return "Neutral"
    else:
        return "Negative"

try:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"Firebase initialization error: {e}")
    db = None

print("Loading FinBERT model...")
tokenizer = BertTokenizer.from_pretrained("yiyanghkust/finbert-tone")
model = BertForSequenceClassification.from_pretrained("yiyanghkust/finbert-tone")
model.eval()

def preprocess_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    
    slang_mappings = {
        '🚀': 'rocket',
        '📈': 'upward trend',
        '📉': 'downward trend',
        '💎': 'diamond hands',
        '🦍': 'ape',
    }
    
    for emoji, replacement in slang_mappings.items():
        text = text.replace(emoji, replacement)
    
    return text

def extract_tickers(text: str) -> List[str]:
    ticker_pattern = r'\$([A-Z]{1,5})'
    matches = re.findall(ticker_pattern, text)
    return list(set(matches))

def get_finbert_sentiment(text: str, max_length: int = 512) -> Tuple[str, float, Dict[str, float]]:
    processed_text = preprocess_text(text)
    
    inputs = tokenizer(
        processed_text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=max_length
    )
    
    with torch.no_grad():
        outputs = model(**inputs)
    
    probs = torch.nn.functional.softmax(outputs.logits, dim=1).numpy()[0]
    labels = ['Negative', 'Neutral', 'Positive']
    sentiment_score = float(probs[2]) - float(probs[0])
    predicted_label = labels[np.argmax(probs)]
    
    prob_distribution = {
        'negative': float(probs[0]),
        'neutral': float(probs[1]),
        'positive': float(probs[2])
    }
    
    return predicted_label, round(sentiment_score, 4), prob_distribution

def calculate_enhanced_sentiment_score(
    base_sentiment_score: float,
    probability_dist: Dict[str, float],
    text_length: int,
    ticker_mention_count: int
) -> float:
    base_weight = 0.6
    base_component = base_sentiment_score * base_weight
    
    max_prob = max(probability_dist.values())
    confidence_boost = (max_prob - 0.33) * 2
    confidence_boost = np.clip(confidence_boost, -1, 1)
    confidence_component = confidence_boost * 0.25
    
    if text_length < 50:
        length_factor = -0.2
    elif text_length > 500:
        length_factor = 0.1
    else:
        length_factor = 0.0
    length_component = length_factor * 0.1
    
    if ticker_mention_count > 1:
        mention_factor = min(0.3, (ticker_mention_count - 1) * 0.1)
    else:
        mention_factor = 0.0
    mention_component = mention_factor * 0.05
    
    enhanced_score = (
        base_component +
        confidence_component +
        length_component +
        mention_component
    )
    
    enhanced_score = np.clip(enhanced_score, -1.0, 1.0)
    
    return round(enhanced_score, 4)

def determine_trading_action(
    sentiment: str,
    enhanced_score: float,
    price_change: float
) -> Tuple[str, float, str]:
    base_confidence = 0.5
    
    if sentiment == "Positive":
        if enhanced_score > 0.6:
            action = "Buy"
            confidence = base_confidence + 0.3 + (enhanced_score - 0.6) * 0.5
            reasoning = "Strong positive sentiment detected. Community shows high confidence in upward movement."
        elif enhanced_score > 0.3:
            action = "Buy"
            confidence = base_confidence + 0.2 + (enhanced_score - 0.3) * 0.3
            reasoning = "Positive sentiment indicates potential upward trend. Moderate confidence."
        else:
            action = "Hold"
            confidence = base_confidence + 0.1
            reasoning = "Slightly positive sentiment, but not strong enough for clear buy signal."
            
    elif sentiment == "Negative":
        if enhanced_score < -0.6:
            action = "Sell"
            confidence = base_confidence + 0.3 + abs(enhanced_score + 0.6) * 0.5
            reasoning = "Strong negative sentiment detected. Community shows concern about downward movement."
        elif enhanced_score < -0.3:
            action = "Sell"
            confidence = base_confidence + 0.2 + abs(enhanced_score + 0.3) * 0.3
            reasoning = "Negative sentiment suggests potential decline. Moderate confidence."
        else:
            action = "Hold"
            confidence = base_confidence + 0.1
            reasoning = "Slightly negative sentiment, but not strong enough for clear sell signal."
            
    else:
        if abs(enhanced_score) < 0.2:
            action = "Hold"
            confidence = base_confidence + 0.05
            reasoning = "Neutral sentiment indicates uncertainty. Community is divided or waiting for more information."
        elif enhanced_score > 0:
            action = "Hold"
            confidence = base_confidence + 0.1
            reasoning = "Slightly positive but mostly neutral sentiment. Insufficient signal for action."
        else:
            action = "Hold"
            confidence = base_confidence + 0.1
            reasoning = "Slightly negative but mostly neutral sentiment. Insufficient signal for action."
    
    if (sentiment == "Positive" and price_change > 0) or \
       (sentiment == "Negative" and price_change < 0):
        confidence += 0.1
        reasoning += " Price movement aligns with sentiment."
    elif (sentiment == "Positive" and price_change < 0) or \
         (sentiment == "Negative" and price_change > 0):
        confidence -= 0.05
        reasoning += " Price movement contradicts sentiment - exercise caution."
    
    confidence = max(0.3, min(0.95, confidence))
    
    return action, round(confidence, 2), reasoning

def calculate_evaluation_metrics(
    predictions: List[Dict],
    actual_sentiments: Optional[List[str]] = None
) -> Dict[str, float]:
    if not predictions:
        return {}
    
    sentiment_counts = defaultdict(int)
    action_counts = defaultdict(int)
    confidence_scores = []
    sentiment_scores = []
    
    for pred in predictions:
        sentiment = pred.get('sentiment', 'Unknown')
        action = pred.get('prediction', {}).get('action', 'Unknown')
        confidence = pred.get('prediction', {}).get('confidence', 0.0)
        score = pred.get('sentimentScore', 0.0)
        
        sentiment_counts[sentiment] += 1
        action_counts[action] += 1
        confidence_scores.append(confidence)
        sentiment_scores.append(score)
    
    total = len(predictions)
    
    metrics = {
        'total_predictions': total,
        'sentiment_distribution': {
            'positive': round(sentiment_counts['Positive'] / total * 100, 2),
            'neutral': round(sentiment_counts['Neutral'] / total * 100, 2),
            'negative': round(sentiment_counts['Negative'] / total * 100, 2)
        },
        'action_distribution': {
            'buy': round(action_counts['Buy'] / total * 100, 2),
            'hold': round(action_counts['Hold'] / total * 100, 2),
            'sell': round(action_counts['Sell'] / total * 100, 2)
        },
        'confidence_stats': {
            'mean': round(np.mean(confidence_scores), 3),
            'std_dev': round(np.std(confidence_scores), 3),
            'min': round(min(confidence_scores), 3),
            'max': round(max(confidence_scores), 3)
        },
        'sentiment_score_stats': {
            'mean': round(np.mean(sentiment_scores), 4),
            'std_dev': round(np.std(sentiment_scores), 4),
            'min': round(min(sentiment_scores), 4),
            'max': round(max(sentiment_scores), 4)
        }
    }
    
    if actual_sentiments and len(actual_sentiments) == total:
        correct = sum(
            1 for i, pred in enumerate(predictions)
            if pred.get('sentiment') == actual_sentiments[i]
        )
        metrics['accuracy'] = round(correct / total, 4)
        
        for sentiment_class in ['Positive', 'Neutral', 'Negative']:
            true_positives = sum(
                1 for i, pred in enumerate(predictions)
                if pred.get('sentiment') == sentiment_class == actual_sentiments[i]
            )
            predicted_positives = sentiment_counts[sentiment_class]
            actual_positives = actual_sentiments.count(sentiment_class)
            
            precision = true_positives / predicted_positives if predicted_positives > 0 else 0
            recall = true_positives / actual_positives if actual_positives > 0 else 0
            f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
            
            metrics[f'{sentiment_class.lower()}_metrics'] = {
                'precision': round(precision, 4),
                'recall': round(recall, 4),
                'f1_score': round(f1, 4)
            }
    
    return metrics

def process_reddit_posts() -> Tuple[List[Dict], Dict[str, float]]:
    result = []
    processed_tickers = set()
    actual_sentiments = []
    
    print(f"Processing {len(reddit_posts)} Reddit posts...")
    
    for i, post in enumerate(reddit_posts, start=1):
        tickers = extract_tickers(post)
        
        if not tickers:
            continue
        
        sentiment, base_sentiment_score, prob_dist = get_finbert_sentiment(post)
        
        ground_truth = get_ground_truth_sentiment(i)
        if not ground_truth:
            ground_truth = "Neutral"
        
        for ticker in tickers:
            ticker_upper = ticker.upper()
            
            if ticker_upper not in ticker_info:
                continue
            
            name, price, change = ticker_info[ticker_upper]
            
            ticker_mention_count = len(re.findall(rf'\${ticker_upper}\b', post, re.IGNORECASE))
            
            enhanced_score = calculate_enhanced_sentiment_score(
                base_sentiment_score=base_sentiment_score,
                probability_dist=prob_dist,
                text_length=len(post),
                ticker_mention_count=ticker_mention_count
            )
            
            action, confidence, reasoning = determine_trading_action(
                sentiment=sentiment,
                enhanced_score=enhanced_score,
                price_change=change
            )
            
            stock_data = {
                "id": i,
                "name": name,
                "ticker": ticker_upper,
                "currentPrice": price,
                "change": change,
                "sentiment": sentiment,
                "sentimentScore": enhanced_score,
                "baseSentimentScore": base_sentiment_score,
                "sentimentSource": "Reddit",
                "probabilityDistribution": prob_dist,
                "prediction": {
                    "action": action,
                    "confidence": confidence,
                    "reasoning": reasoning
                }
            }
            
            result.append(stock_data)
            actual_sentiments.append(ground_truth)
    
    use_ground_truth = len(actual_sentiments) == len(result) and len(actual_sentiments) > 0
    
    if use_ground_truth:
        print(f"Using ground truth for {len(actual_sentiments)} predictions")
        metrics = calculate_evaluation_metrics(result, actual_sentiments)
    else:
        print(f"Warning: Ground truth count ({len(actual_sentiments)}) doesn't match predictions ({len(result)})")
        metrics = calculate_evaluation_metrics(result, None)
    
    print(f"Generated {len(result)} stock predictions")
    print(f"Evaluation Metrics: {json.dumps(metrics, indent=2)}")
    
    if metrics.get('accuracy'):
        print(f"\nModel Accuracy: {metrics['accuracy'] * 100:.2f}%")
        if metrics.get('positive_metrics'):
            print(f"Positive - Precision: {metrics['positive_metrics']['precision']:.4f}, "
                  f"Recall: {metrics['positive_metrics']['recall']:.4f}, "
                  f"F1: {metrics['positive_metrics']['f1_score']:.4f}")
        if metrics.get('neutral_metrics'):
            print(f"Neutral - Precision: {metrics['neutral_metrics']['precision']:.4f}, "
                  f"Recall: {metrics['neutral_metrics']['recall']:.4f}, "
                  f"F1: {metrics['neutral_metrics']['f1_score']:.4f}")
        if metrics.get('negative_metrics'):
            print(f"Negative - Precision: {metrics['negative_metrics']['precision']:.4f}, "
                  f"Recall: {metrics['negative_metrics']['recall']:.4f}, "
                  f"F1: {metrics['negative_metrics']['f1_score']:.4f}")
    
    return result, metrics

def save_to_firestore(predictions: List[Dict], clear_existing: bool = False) -> bool:
    if db is None:
        print("Firebase not initialized. Skipping database save.")
        return False
    
    try:
        stocks_ref = db.collection('stocks')
        batch = db.batch()
        
        if clear_existing:
            print("Clearing existing stock documents...")
            existing_docs = stocks_ref.get()
            for doc in existing_docs:
                batch.delete(doc.reference)
        
        for stock in predictions:
            doc_ref = stocks_ref.document()
            batch.set(doc_ref, stock)
        
        batch.commit()
        print(f"Successfully saved {len(predictions)} predictions to Firestore!")
        return True
        
    except Exception as e:
        print(f"Error saving to Firestore: {e}")
        return False

def save_metrics_to_firestore(metrics: Dict) -> bool:
    if db is None:
        print("Firebase not initialized. Skipping metrics save.")
        return False
    
    try:
        from datetime import datetime
        metrics_ref = db.collection('sentimentMetrics')
        
        metrics_doc = {
            **metrics,
            'timestamp': datetime.now(),
            'updatedAt': datetime.now()
        }
        
        metrics_ref.add(metrics_doc)
        print("Successfully saved metrics to Firestore!")
        return True
        
    except Exception as e:
        print(f"Error saving metrics to Firestore: {e}")
        return False

if __name__ == "__main__":
    predictions, metrics = process_reddit_posts()
    save_to_firestore(predictions, clear_existing=False)
    save_metrics_to_firestore(metrics)
    
    # print("\n" + "="*60)
    # print("SENTIMENT ANALYSIS SUMMARY")
    # print("="*60)
    # print(f"Total Predictions: {metrics.get('total_predictions', 0)}")
    # print(f"Average Confidence: {metrics.get('confidence_stats', {}).get('mean', 0)}")
    # print(f"Sentiment Distribution:")
    # sent_dist = metrics.get('sentiment_distribution', {})
    # print(f"  - Positive: {sent_dist.get('positive', 0)}%")
    # print(f"  - Neutral: {sent_dist.get('neutral', 0)}%")
    # print(f"  - Negative: {sent_dist.get('negative', 0)}%")
    # print("="*60)
