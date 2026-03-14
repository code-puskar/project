from app.utils.ai_validator import validate_issue_content

test_cases = [
    ("Garbage", "hgghwefe"),
    ("Pothole", "huge hole in the middle of the road near school"),
    ("Other", "asdf 123"),
    ("Garbage", "There is a pile of trash near the park entrance."),
    ("Streetlight", "hello how are you"),
]

for issue_type, desc in test_cases:
    print(f"\n{'='*50}")
    print(f"Testing: [{issue_type}] '{desc}'")
    is_valid, reason = validate_issue_content(desc, issue_type)
    status = "✅ VALID" if is_valid else "❌ INVALID"
    print(f"Result: {status}")
    if reason:
        print(f"Reason: {reason}")
