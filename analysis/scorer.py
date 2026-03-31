import re

def extract_numeric(value):
    if not value:
        return None
    numbers = re.findall(r'\d+\.?\d*', str(value))
    return float(numbers[0]) if numbers else None

def normalise(val, min_val, max_val):
    if max_val == min_val:
        return 50
    return round((val - min_val) / (max_val - min_val) * 100, 1)

def score_phones(phone1, phone2):
    scores = {
        phone1["name"]: {},
        phone2["name"]: {}
    }

    comparisons = [
        {"category": "Battery", "spec": "Type", "higher_is_better": True, "label": "battery"},
        {"category": "Display", "spec": "Size", "higher_is_better": True, "label": "display"},
        {"category": "Body", "spec": "Weight", "higher_is_better": False, "label": "weight"}
    ]

    for comp in comparisons:
        cat = comp["category"]
        spec = comp["spec"]
        label = comp["label"]

        cat_data1 = phone1["specs"].get(cat) or {}
        cat_data2 = phone2["specs"].get(cat) or {}

        val1 = extract_numeric(cat_data1.get(spec))
        val2 = extract_numeric(cat_data2.get(spec))

        if val1 is None or val2 is None:
            continue

        min_val = min(val1, val2)
        max_val = max(val1, val2)

        score1 = normalise(val1, min_val, max_val)
        score2 = normalise(val2, min_val, max_val)

        if not comp["higher_is_better"]:
            score1 = 100 - score1
            score2 = 100 - score2

        winner = phone1["name"] if score1 > score2 else phone2["name"]

        scores[phone1["name"]][label] = score1
        scores[phone2["name"]][label] = score2
        scores["winner_" + label] = winner

    return scores