def build_full_name(first_name: str = "", last_name: str = "") -> str:
    return f"{first_name or ''} {last_name or ''}".strip()