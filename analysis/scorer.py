def extract_numeric(value):
    import re
    if not value:
        return None
    numbers = re.findall(r'\d+\.?\d*', str(value))
    return float(numbers[0]) if numbers else None

def score_phones(phone1, phone2):
    scores = {
        phone1["name"]: {},
        phone2["name"]: {}
    }

    comparisons = [
        {
            "category": "Battery",
            "spec": "Type",
            "higher_is_better": True,
            "label": "battery"
        },
        {
            "category": "Display",
            "spec": "Size",
            "higher_is_better": True,
            "label": "display"
        },
        {
            "category": "Body",
            "spec": "Weight",
            "higher_is_better": False,
            "label": "weight"
        }
    ]

    for comp in comparisons:
        cat = comp["category"]
        spec = comp["spec"]
        label = comp["label"]

        val1 = extract_numeric(phone1["specs"].get(cat, {}).get(spec))
        val2 = extract_numeric(phone2["specs"].get(cat, {}).get(spec))

        if val1 is None or val2 is None:
            continue

        if comp["higher_is_better"]:
            winner = phone1["name"] if val1 > val2 else phone2["name"]
        else:
            winner = phone1["name"] if val1 < val2 else phone2["name"]

        scores[phone1["name"]][label] = val1
        scores[phone2["name"]][label] = val2
        scores["winner_" + label] = winner

    return scores