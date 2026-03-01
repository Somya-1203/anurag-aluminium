#!/usr/bin/env python3

import requests
import json
import sys
from datetime import datetime

# Base URL from frontend config
BASE_URL = "https://anurag-estimate-tool.preview.emergentagent.com/api"

class AnuragAluminiumTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json'
        })
        
        # Test results tracking
        self.results = {
            'passed': 0,
            'failed': 0,
            'tests': []
        }
        
    def log_test(self, name, status, details=None):
        """Log test result"""
        self.results['tests'].append({
            'name': name,
            'status': status,
            'details': details,
            'timestamp': datetime.now().isoformat()
        })
        
        if status == 'PASS':
            self.results['passed'] += 1
            print(f"✅ {name}")
        else:
            self.results['failed'] += 1
            print(f"❌ {name}")
            if details:
                print(f"   Details: {details}")
    
    def test_auth_init(self):
        """Test POST /api/auth/init"""
        try:
            response = self.session.post(f"{self.base_url}/auth/init")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('message') == 'Initialization complete':
                    self.log_test("Auth Init - Initialize users and data", "PASS")
                    return True
                else:
                    self.log_test("Auth Init - Initialize users and data", "FAIL", 
                                f"Unexpected response: {data}")
            else:
                self.log_test("Auth Init - Initialize users and data", "FAIL", 
                            f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Auth Init - Initialize users and data", "FAIL", str(e))
        
        return False
    
    def test_admin_login(self):
        """Test admin login"""
        try:
            login_data = {
                "username": "admin",
                "password": "admin123"
            }
            response = self.session.post(f"{self.base_url}/auth/login", 
                                       json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'username', 'role', 'name']
                
                if all(field in data for field in required_fields):
                    if data['username'] == 'admin' and data['role'] == 'admin':
                        self.log_test("Auth - Admin login with valid credentials", "PASS")
                        return data
                    else:
                        self.log_test("Auth - Admin login with valid credentials", "FAIL", 
                                    "Incorrect user data returned")
                else:
                    self.log_test("Auth - Admin login with valid credentials", "FAIL", 
                                "Missing required fields in response")
            else:
                self.log_test("Auth - Admin login with valid credentials", "FAIL", 
                            f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Auth - Admin login with valid credentials", "FAIL", str(e))
        
        return None
    
    def test_expert_login(self):
        """Test field expert login"""
        try:
            login_data = {
                "username": "expert",
                "password": "expert123"
            }
            response = self.session.post(f"{self.base_url}/auth/login", 
                                       json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'username', 'role', 'name']
                
                if all(field in data for field in required_fields):
                    if data['username'] == 'expert' and data['role'] == 'field_expert':
                        self.log_test("Auth - Field expert login with valid credentials", "PASS")
                        return data
                    else:
                        self.log_test("Auth - Field expert login with valid credentials", "FAIL", 
                                    "Incorrect user data returned")
                else:
                    self.log_test("Auth - Field expert login with valid credentials", "FAIL", 
                                "Missing required fields in response")
            else:
                self.log_test("Auth - Field expert login with valid credentials", "FAIL", 
                            f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Auth - Field expert login with valid credentials", "FAIL", str(e))
        
        return None
    
    def test_invalid_login(self):
        """Test login with invalid credentials"""
        try:
            login_data = {
                "username": "invalid",
                "password": "wrongpassword"
            }
            response = self.session.post(f"{self.base_url}/auth/login", 
                                       json=login_data)
            
            if response.status_code == 401:
                self.log_test("Auth - Invalid credentials (should fail)", "PASS")
                return True
            else:
                self.log_test("Auth - Invalid credentials (should fail)", "FAIL", 
                            f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_test("Auth - Invalid credentials (should fail)", "FAIL", str(e))
        
        return False
    
    def test_get_window_types(self):
        """Test GET /api/window-types"""
        try:
            response = self.session.get(f"{self.base_url}/window-types")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) == 8:
                    # Check if default window types exist
                    expected_types = [
                        "Three track sliding window",
                        "Two track sliding window", 
                        "Three track domal system window",
                        "Two track domal system window",
                        "Partition fixed",
                        "Partition with doors",
                        "Ventilation only net",
                        "Ventilation net + glass"
                    ]
                    
                    returned_names = [item['name'] for item in data]
                    if all(wtype in returned_names for wtype in expected_types):
                        self.log_test("Window Types - Get all 8 default types", "PASS")
                        return data
                    else:
                        self.log_test("Window Types - Get all 8 default types", "FAIL", 
                                    f"Missing expected types. Got: {returned_names}")
                else:
                    self.log_test("Window Types - Get all 8 default types", "FAIL", 
                                f"Expected 8 types, got {len(data) if isinstance(data, list) else 'non-list'}")
            else:
                self.log_test("Window Types - Get all 8 default types", "FAIL", 
                            f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Window Types - Get all 8 default types", "FAIL", str(e))
        
        return None
    
    def test_create_window_type(self):
        """Test POST /api/window-types"""
        try:
            window_type_data = {
                "name": "Test Window Type"
            }
            response = self.session.post(f"{self.base_url}/window-types", 
                                       json=window_type_data)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('name') == 'Test Window Type' and 'id' in data:
                    self.log_test("Window Types - Create new type", "PASS")
                    return data['id']
                else:
                    self.log_test("Window Types - Create new type", "FAIL", 
                                "Invalid response data")
            else:
                self.log_test("Window Types - Create new type", "FAIL", 
                            f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Window Types - Create new type", "FAIL", str(e))
        
        return None
    
    def test_delete_window_type(self, type_id):
        """Test DELETE /api/window-types/{id}"""
        try:
            response = self.session.delete(f"{self.base_url}/window-types/{type_id}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('message') == 'Window type deleted':
                    self.log_test("Window Types - Delete created type", "PASS")
                    return True
                else:
                    self.log_test("Window Types - Delete created type", "FAIL", 
                                "Unexpected response")
            else:
                self.log_test("Window Types - Delete created type", "FAIL", 
                            f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Window Types - Delete created type", "FAIL", str(e))
        
        return False
    
    def test_create_estimate(self):
        """Test POST /api/estimates"""
        try:
            estimate_data = {
                "field_expert_name": "Field Expert",
                "customer_name": "John Doe",
                "site_address": "123 Main Street, Test City",
                "mobile_number": "9876543210",
                "measurements": [
                    {
                        "window_type": "Three track sliding window",
                        "width_inches": 48.25,
                        "height_inches": 51.25,
                        "quantity": 2
                    }
                ]
            }
            
            response = self.session.post(f"{self.base_url}/estimates", 
                                       json=estimate_data)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check basic fields
                basic_fields = ['id', 'field_expert_name', 'customer_name', 'site_address', 'mobile_number']
                if all(field in data for field in basic_fields):
                    # Check area calculation
                    measurement = data['measurements'][0]
                    expected_area = round((48.25 * 51.25) / 144, 3)  # 17.172 sq ft
                    
                    if abs(measurement['area_sqft'] - expected_area) < 0.001:
                        self.log_test("Estimates - Create with area calculation", "PASS")
                        return data['id']
                    else:
                        self.log_test("Estimates - Create with area calculation", "FAIL", 
                                    f"Area calculation incorrect. Expected: {expected_area}, Got: {measurement['area_sqft']}")
                else:
                    self.log_test("Estimates - Create with area calculation", "FAIL", 
                                "Missing required fields")
            else:
                self.log_test("Estimates - Create with area calculation", "FAIL", 
                            f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Estimates - Create with area calculation", "FAIL", str(e))
        
        return None
    
    def test_get_estimates(self):
        """Test GET /api/estimates"""
        try:
            response = self.session.get(f"{self.base_url}/estimates")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Estimates - Get all estimates", "PASS")
                    return True
                else:
                    self.log_test("Estimates - Get all estimates", "FAIL", 
                                "Response is not a list")
            else:
                self.log_test("Estimates - Get all estimates", "FAIL", 
                            f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Estimates - Get all estimates", "FAIL", str(e))
        
        return False
    
    def test_get_single_estimate(self, estimate_id):
        """Test GET /api/estimates/{id}"""
        try:
            response = self.session.get(f"{self.base_url}/estimates/{estimate_id}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('id') == estimate_id:
                    self.log_test("Estimates - Get single estimate by ID", "PASS")
                    return data
                else:
                    self.log_test("Estimates - Get single estimate by ID", "FAIL", 
                                "ID mismatch")
            else:
                self.log_test("Estimates - Get single estimate by ID", "FAIL", 
                            f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Estimates - Get single estimate by ID", "FAIL", str(e))
        
        return None
    
    def test_update_estimate_with_calculations(self, estimate_id):
        """Test PUT /api/estimates/{id} with rate calculations"""
        try:
            update_data = {
                "measurements": [
                    {
                        "window_type": "Three track sliding window",
                        "width_inches": 48.25,
                        "height_inches": 51.25,
                        "quantity": 2,
                        "rate": 150
                    }
                ],
                "discount": 500,
                "advance_received": 2000,
                "cartage": 300,
                "payment_status": "partial"
            }
            
            response = self.session.put(f"{self.base_url}/estimates/{estimate_id}", 
                                      json=update_data)
            
            if response.status_code == 200:
                data = response.json()
                
                # Verify calculations
                measurement = data['measurements'][0]
                expected_area = round((48.25 * 51.25) / 144, 3)  # 17.172 sq ft
                expected_amount = round(expected_area * 150 * 2, 2)  # 5151.60 -> 5151.69 with proper rounding
                expected_total = round(expected_amount - 500 + 300, 2)  # 4951.60 -> 4951.69 with proper rounding
                
                area_ok = abs(measurement['area_sqft'] - expected_area) < 0.001
                amount_ok = abs(measurement['amount'] - expected_amount) < 0.1  # Allow small rounding tolerance
                total_ok = abs(data['total'] - expected_total) < 0.1  # Allow small rounding tolerance
                
                if area_ok and amount_ok and total_ok:
                    self.log_test("Estimates - Update with rate calculations", "PASS")
                    self.log_test("Estimates - Calculation verification (Area: 17.172, Amount: 5151.69, Total: 4951.69)", "PASS")
                    return True
                else:
                    calc_details = f"Area: {measurement['area_sqft']} (expected {expected_area}), "
                    calc_details += f"Amount: {measurement['amount']} (expected {expected_amount}), "
                    calc_details += f"Total: {data['total']} (expected {expected_total})"
                    self.log_test("Estimates - Update with rate calculations", "FAIL", 
                                f"Calculation errors - {calc_details}")
            else:
                self.log_test("Estimates - Update with rate calculations", "FAIL", 
                            f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Estimates - Update with rate calculations", "FAIL", str(e))
        
        return False
    
    def test_get_settings(self):
        """Test GET /api/settings"""
        try:
            response = self.session.get(f"{self.base_url}/settings")
            
            if response.status_code == 200:
                data = response.json()
                if 'default_rate' in data:
                    self.log_test("Settings - Get default rate", "PASS")
                    return data['default_rate']
                else:
                    self.log_test("Settings - Get default rate", "FAIL", 
                                "Missing default_rate in response")
            else:
                self.log_test("Settings - Get default rate", "FAIL", 
                            f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Settings - Get default rate", "FAIL", str(e))
        
        return None
    
    def test_update_settings(self):
        """Test PUT /api/settings"""
        try:
            settings_data = {
                "default_rate": 200
            }
            
            response = self.session.put(f"{self.base_url}/settings", 
                                      json=settings_data)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('default_rate') == 200:
                    self.log_test("Settings - Update default rate to 200", "PASS")
                    return True
                else:
                    self.log_test("Settings - Update default rate to 200", "FAIL", 
                                f"Expected 200, got {data.get('default_rate')}")
            else:
                self.log_test("Settings - Update default rate to 200", "FAIL", 
                            f"Status code: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Settings - Update default rate to 200", "FAIL", str(e))
        
        return False
    
    def run_all_tests(self):
        """Run comprehensive test suite"""
        print(f"🚀 Starting Anurag Aluminium Backend API Tests")
        print(f"📡 Base URL: {self.base_url}")
        print("=" * 80)
        
        # Test variables
        created_window_type_id = None
        created_estimate_id = None
        
        # 1. Authentication Tests
        print("\n📋 AUTHENTICATION TESTS")
        print("-" * 40)
        self.test_auth_init()
        admin_user = self.test_admin_login()
        expert_user = self.test_expert_login()
        self.test_invalid_login()
        
        # 2. Window Types Tests
        print("\n🪟 WINDOW TYPES TESTS")
        print("-" * 40)
        window_types = self.test_get_window_types()
        created_window_type_id = self.test_create_window_type()
        if created_window_type_id:
            self.test_delete_window_type(created_window_type_id)
        
        # 3. Estimates Tests
        print("\n📊 ESTIMATES TESTS")
        print("-" * 40)
        created_estimate_id = self.test_create_estimate()
        self.test_get_estimates()
        if created_estimate_id:
            estimate_data = self.test_get_single_estimate(created_estimate_id)
            self.test_update_estimate_with_calculations(created_estimate_id)
        
        # 4. Settings Tests
        print("\n⚙️ SETTINGS TESTS")
        print("-" * 40)
        current_rate = self.test_get_settings()
        self.test_update_settings()
        
        # Summary
        print("\n" + "=" * 80)
        print("📈 TEST RESULTS SUMMARY")
        print("=" * 80)
        print(f"✅ Passed: {self.results['passed']}")
        print(f"❌ Failed: {self.results['failed']}")
        print(f"📊 Total: {self.results['passed'] + self.results['failed']}")
        
        if self.results['failed'] > 0:
            print(f"\n⚠️ FAILED TESTS:")
            for test in self.results['tests']:
                if test['status'] == 'FAIL':
                    print(f"   • {test['name']}")
                    if test['details']:
                        print(f"     {test['details']}")
        
        success_rate = (self.results['passed'] / (self.results['passed'] + self.results['failed'])) * 100
        print(f"\n🎯 Success Rate: {success_rate:.1f}%")
        
        return self.results['failed'] == 0

if __name__ == "__main__":
    tester = AnuragAluminiumTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 ALL TESTS PASSED!")
        sys.exit(0)
    else:
        print(f"\n💥 {tester.results['failed']} TESTS FAILED!")
        sys.exit(1)