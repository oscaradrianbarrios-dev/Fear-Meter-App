#!/usr/bin/env python3
"""
Backend API Testing for Fear Meter Application
Tests the FastAPI backend endpoints to ensure they're working correctly.
"""

import requests
import json
import sys
from datetime import datetime

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

def test_backend_apis():
    """Test all backend API endpoints"""
    
    backend_url = get_backend_url()
    if not backend_url:
        print("❌ FAILED: Could not get backend URL from frontend/.env")
        return False
    
    api_base = f"{backend_url}/api"
    print(f"Testing backend APIs at: {api_base}")
    print("=" * 60)
    
    all_tests_passed = True
    
    # Test 1: Root endpoint
    try:
        print("🔍 Testing GET /api/ (root endpoint)...")
        response = requests.get(f"{api_base}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("✅ PASSED: Root endpoint working correctly")
            else:
                print(f"❌ FAILED: Unexpected response data: {data}")
                all_tests_passed = False
        else:
            print(f"❌ FAILED: Root endpoint returned status {response.status_code}")
            all_tests_passed = False
    except Exception as e:
        print(f"❌ FAILED: Root endpoint error: {e}")
        all_tests_passed = False
    
    # Test 2: Create status check (POST)
    try:
        print("\n🔍 Testing POST /api/status (create status check)...")
        test_data = {"client_name": "fear_meter_test_client"}
        response = requests.post(f"{api_base}/status", 
                               json=test_data, 
                               headers={"Content-Type": "application/json"},
                               timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "id" in data and "client_name" in data and "timestamp" in data:
                if data["client_name"] == "fear_meter_test_client":
                    print("✅ PASSED: Status check creation working correctly")
                    print(f"   Created status check with ID: {data['id']}")
                else:
                    print(f"❌ FAILED: Incorrect client_name in response: {data}")
                    all_tests_passed = False
            else:
                print(f"❌ FAILED: Missing required fields in response: {data}")
                all_tests_passed = False
        else:
            print(f"❌ FAILED: Status check creation returned status {response.status_code}")
            print(f"   Response: {response.text}")
            all_tests_passed = False
    except Exception as e:
        print(f"❌ FAILED: Status check creation error: {e}")
        all_tests_passed = False
    
    # Test 3: Get status checks (GET)
    try:
        print("\n🔍 Testing GET /api/status (get status checks)...")
        response = requests.get(f"{api_base}/status", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"✅ PASSED: Status check retrieval working correctly")
                print(f"   Retrieved {len(data)} status check(s)")
                if len(data) > 0:
                    # Check if our test data is in the results
                    test_found = any(item.get("client_name") == "fear_meter_test_client" for item in data)
                    if test_found:
                        print("   ✅ Test data found in results")
                    else:
                        print("   ⚠️  Test data not found in results (may be expected)")
            else:
                print(f"❌ FAILED: Expected list response, got: {type(data)}")
                all_tests_passed = False
        else:
            print(f"❌ FAILED: Status check retrieval returned status {response.status_code}")
            print(f"   Response: {response.text}")
            all_tests_passed = False
    except Exception as e:
        print(f"❌ FAILED: Status check retrieval error: {e}")
        all_tests_passed = False
    
    print("\n" + "=" * 60)
    if all_tests_passed:
        print("🎉 ALL BACKEND TESTS PASSED")
        return True
    else:
        print("💥 SOME BACKEND TESTS FAILED")
        return False

if __name__ == "__main__":
    success = test_backend_apis()
    sys.exit(0 if success else 1)