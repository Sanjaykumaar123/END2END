import random
import re

class ThreatIntelService:
    def __init__(self):
        # In a real scenario, load models here:
        # self.ai_detector = pipeline("text-classification", model="roberta-base-openai-detector")
        pass

    async def detect_ai_generated(self, text: str) -> float:
        # Improved heuristic simulation
        text_lower = text.lower()
        score = 0.0
        
        # 1. AI Phrases
        ai_phrases = ["as an AI language model", "regenerate response", "I cannot fulfill", "based on my training"]
        if any(phrase in text_lower for phrase in ai_phrases):
            return 99.9
            
        # 2. Structural Patterns (Formal, repetitive)
        words = text.split()
        if len(words) > 30:
            avg_word_len = sum(len(w) for w in words) / len(words)
            if avg_word_len > 6: # overly complex vocabulary?
                score += 30
            if text.count(",") > 5 and text.count(".") < 2: # run-on formal?
                score += 20
                
        # 3. Urgency / Emotion (AI is usually neutral)
        urgency_words = ["immediate", "urgent", "asap", "critical", "severe"]
        if any(w in text_lower for w in urgency_words):
            score -= 20 # Human messages are often urgent
            
        # Default randomness + base
        base = random.uniform(5.0, 20.0)
        final_score = base + score
        return min(max(final_score, 0.0), 100.0)

    async def detect_opsec_risk(self, text: str) -> str:
        text_lower = text.lower()
        
        # 1. Critical Geo-spatial Data (Regex)
        # Matches: 34.05N, 118.24W or similar
        coord_pattern = re.compile(r'\d{1,3}\.\d+[NS],\s*\d{1,3}\.\d+[EW]')
        if coord_pattern.search(text):
            return "HIGH"

        # 2. Military Time / Specific Dates
        # Matches: 1400 hours, 14:00Z
        time_pattern = re.compile(r'\d{4}\s*hours|\d{2}:\d{2}Z')
        if time_pattern.search(text):
            return "SENSITIVE"

        # 3. Keyword Analysis
        critical = ["bomb", "attack", "kill", "assassinate", "terrorism", "explosive", "weapon", "hostage", "nuclear"]
        sensitive = ["deployment", "location", "alpha", "bravo", "classified", "operation", "extract", "rendezvous"]
        
        if any(w in text_lower for w in critical):
            return "HIGH"
            
        count = sum(1 for w in sensitive if w in text_lower)
        if count >= 2:
            return "SENSITIVE"
            
        return "SAFE"

    async def detect_phishing(self, text: str) -> str:
        text_lower = text.lower()
        
        # 1. Suspicious Actions
        actions = ["click here", "login", "password", "verify account", "urgent action", "update payment"]
        if any(s in text_lower for s in actions):
            return "HIGH"
            
        # 2. Suspicious Domains (Regex primitive)
        # Matches http://bit.ly/... or raw IP
        suspicious_urls = re.compile(r'http[s]?://(?:\d{1,3}\.|bit\.ly|tinyurl)')
        if suspicious_urls.search(text):
            return "HIGH"
            
        # 3. PII Request
        pii_request = ["ssn", "social security", "credit card", "bank account"]
        if any(p in text_lower for p in pii_request):
            return "MODERATE"
            
        return "LOW"

    async def scan_message(self, text: str) -> dict:
        ai_score = await self.detect_ai_generated(text)
        opsec_risk = await self.detect_opsec_risk(text)
        phishing_risk = await self.detect_phishing(text)
        
        explanation = []
        if ai_score > 70:
            explanation.append("High probability of AI generation detected.")
        if opsec_risk != "SAFE":
            explanation.append(f"OPSEC Risk detected: {opsec_risk}")
        if phishing_risk != "LOW":
            explanation.append(f"Phishing Risk detected: {phishing_risk}")
            
        if not explanation:
            explanation.append("Message appears safe.")

        return {
            "ai_score": round(ai_score, 2),
            "opsec_risk": opsec_risk,
            "phishing_risk": phishing_risk,
            "explanation": " | ".join(explanation)
        }

threat_intel_service = ThreatIntelService()

async def scan_message(text: str) -> dict:
    return await threat_intel_service.scan_message(text)
