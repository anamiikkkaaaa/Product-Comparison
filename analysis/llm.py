import os
from groq import Groq
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent / ".env")

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_verdict(phone1_name, phone2_name, scores, user_preference):
    prompt = f"""
    You are a helpful phone comparison expert.
    
    A user wants to compare {phone1_name} vs {phone2_name}.
    
    Here are the scores:
    {scores}
    
    The user's preference is: {user_preference}
    
    Based on the scores and the user's preference, give a clear and concise 
    recommendation on which phone is better for them and why.
    Keep it under 150 words. Be direct and specific.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content
