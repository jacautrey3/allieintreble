"""
Allie in Treble — Inquiry Form Handler
Triggered by API Gateway (POST /inquiry).
Sends a notification email via Amazon SES.
"""

import json
import os
import logging
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

ses = boto3.client("ses", region_name=os.environ.get("SES_REGION", "us-east-1"))

NOTIFICATION_EMAIL = os.environ["NOTIFICATION_EMAIL"]
FROM_EMAIL         = os.environ["FROM_EMAIL"]

CORS_HEADERS = {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
}


def handler(event, context):
    # Handle CORS preflight
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    try:
        body    = json.loads(event.get("body") or "{}")
        name    = body.get("name",    "Unknown").strip()
        email   = body.get("email",   "").strip()
        phone   = body.get("phone",   "Not provided").strip() or "Not provided"
        level   = body.get("level",   "Not specified").strip() or "Not specified"
        message = body.get("message", "").strip()

        if not name or not email or not message:
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "Missing required fields"}),
            }

        email_body = (
            f"New lesson inquiry from allieintreble.com\n"
            f"{'=' * 48}\n\n"
            f"Name:              {name}\n"
            f"Email:             {email}\n"
            f"Phone:             {phone}\n"
            f"Experience Level:  {level}\n\n"
            f"Message:\n{message}\n\n"
            f"{'=' * 48}\n"
            f"Reply directly to {email} to respond."
        )

        ses.send_email(
            Source=FROM_EMAIL,
            Destination={"ToAddresses": [NOTIFICATION_EMAIL]},
            Message={
                "Subject": {"Data": f"New Lesson Inquiry from {name}"},
                "Body":    {"Text": {"Data": email_body}},
            },
            ReplyToAddresses=[email] if email else [],
        )

        logger.info("Inquiry sent from %s", email)
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"success": True}),
        }

    except ClientError as e:
        logger.error("SES error: %s", e.response["Error"]["Message"])
        return {
            "statusCode": 502,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Failed to send email"}),
        }
    except Exception as e:
        logger.error("Unexpected error: %s", str(e))
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Internal server error"}),
        }
