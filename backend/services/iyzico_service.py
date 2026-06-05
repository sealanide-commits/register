import os
import hashlib
import hmac
import base64
import json
import httpx
from datetime import datetime
from typing import Dict, Optional

IYZICO_API_KEY = os.getenv("IYZICO_API_KEY", "")
IYZICO_SECRET_KEY = os.getenv("IYZICO_SECRET_KEY", "")
IYZICO_BASE_URL = os.getenv("IYZICO_BASE_URL", "https://sandbox-api.iyzipay.com")
TEST_MODE = os.getenv("TEST_MODE", "true").lower() == "true"


def _generate_auth_header(request_body: str) -> str:
    random_str = base64.b64encode(os.urandom(12)).decode()
    payload = f"apiKey:{IYZICO_API_KEY}&randomKey:{random_str}&signature:{_sign(random_str, request_body)}"
    return f"IYZWSv2 {base64.b64encode(payload.encode()).decode()}"


def _sign(random_str: str, body: str) -> str:
    data = IYZICO_SECRET_KEY + random_str + body
    return base64.b64encode(
        hmac.new(IYZICO_SECRET_KEY.encode(), data.encode(), hashlib.sha256).digest()
    ).decode()


async def create_payment_form(
    user_id: int,
    package_id: str,
    amount_tl: float,
    buyer_name: str,
    buyer_email: str,
    callback_url: str,
) -> Dict:
    if TEST_MODE or not IYZICO_API_KEY:
        return {
            "status": "success",
            "checkoutFormContent": None,
            "token": f"test_token_{user_id}_{package_id}_{int(datetime.now().timestamp())}",
            "test_mode": True,
        }

    payload = {
        "locale": "tr",
        "conversationId": f"mistikai_{user_id}_{package_id}",
        "price": str(int(amount_tl)),
        "paidPrice": str(int(amount_tl)),
        "currency": "TRY",
        "basketId": f"basket_{user_id}",
        "paymentGroup": "PRODUCT",
        "callbackUrl": callback_url,
        "enabledInstallments": [1, 2, 3, 6, 9],
        "buyer": {
            "id": str(user_id),
            "name": buyer_name.split()[0] if buyer_name else "User",
            "surname": buyer_name.split()[-1] if buyer_name and len(buyer_name.split()) > 1 else "User",
            "email": buyer_email or f"user{user_id}@mistikai.com",
            "identityNumber": "11111111111",
            "registrationAddress": "Türkiye",
            "city": "Istanbul",
            "country": "Turkey",
        },
        "shippingAddress": {
            "contactName": buyer_name or "User",
            "city": "Istanbul",
            "country": "Turkey",
            "address": "Türkiye",
        },
        "billingAddress": {
            "contactName": buyer_name or "User",
            "city": "Istanbul",
            "country": "Turkey",
            "address": "Türkiye",
        },
        "basketItems": [
            {
                "id": package_id,
                "name": f"MistikAI {package_id}",
                "category1": "Dijital Hizmet",
                "itemType": "VIRTUAL",
                "price": str(int(amount_tl)),
            }
        ],
    }

    body = json.dumps(payload)
    headers = {
        "Authorization": _generate_auth_header(body),
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{IYZICO_BASE_URL}/payment/iyzipos/checkoutform/initialize/auth/ecom",
            content=body,
            headers=headers,
        )
        return response.json()


async def verify_payment_token(token: str) -> Dict:
    if TEST_MODE or token.startswith("test_token_"):
        return {"status": "success", "paymentStatus": "SUCCESS", "test_mode": True}

    payload = json.dumps({"locale": "tr", "token": token})
    headers = {
        "Authorization": _generate_auth_header(payload),
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{IYZICO_BASE_URL}/payment/iyzipos/checkoutform/auth/ecom/detail",
            content=payload,
            headers=headers,
        )
        return response.json()
