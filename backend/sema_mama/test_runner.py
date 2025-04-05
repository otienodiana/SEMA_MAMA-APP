from django.test.runner import DiscoverRunner
import unittest
import time

class CategoryTestRunner(DiscoverRunner):
    def build_suite(self, test_labels=None, extra_tests=None, **kwargs):
        if test_labels is None:
            test_labels = []
        suite = super().build_suite(test_labels)
        if extra_tests:
            for test in extra_tests:
                suite.addTest(test)
        return suite

    def run_suite(self, suite, **kwargs):
        categories = {
            'Unit Tests': [],
            'Validation Tests': [],
            'Integration Tests': [],
            'Functional Tests': [],
            'System Tests': []
        }

        # Classify tests
        for test in suite._tests:
            test_name = test.__class__.__name__
            if 'Validation' in test_name:
                categories['Validation Tests'].append(test)
            elif 'Integration' in test_name:
                categories['Integration Tests'].append(test)
            elif 'Functional' in test_name:
                categories['Functional Tests'].append(test)
            elif 'System' in test_name:
                categories['System Tests'].append(test)
            else:
                categories['Unit Tests'].append(test)

        print("\n=== Test Results by Category ===\n")
        total_time = 0
        total_tests = 0
        total_failures = 0

        for category, tests in categories.items():
            if tests:
                print(f"\n{category}:")
                print("-" * 40)
                start_time = time.time()
                
                test_suite = unittest.TestSuite(tests)
                result = unittest.TextTestRunner(verbosity=2).run(test_suite)
                
                total_tests += result.testsRun
                total_failures += len(result.failures) + len(result.errors)
                
                category_time = time.time() - start_time
                total_time += category_time
                print(f"\nTime: {category_time:.3f}s")

        print(f"\nTotal tests: {total_tests}")
        print(f"Total failures: {total_failures}")
        print(f"Total time: {total_time:.3f}s")

        return super().run_suite(suite, **kwargs)

    def get_resultclass(self):
        return unittest.TextTestResult
