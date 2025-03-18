from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from .validators import validate_file_size, validate_file_extension
from django.core.exceptions import ValidationError

class UtilityFunctionTests(TestCase):
    def test_file_size_validation(self):
        # Create a file larger than max size (e.g., 6MB)
        large_file = SimpleUploadedFile(
            "large_file.txt",
            b"x" * (6 * 1024 * 1024),  # 6MB file
            content_type="text/plain"
        )
        
        with self.assertRaises(ValidationError):
            validate_file_size(large_file)

    def test_valid_file_size(self):
        small_file = SimpleUploadedFile(
            "small_file.txt",
            b"test content",
            content_type="text/plain"
        )
        
        # Should not raise any exception
        self.assertIsNone(validate_file_size(small_file))

    def test_file_extension_validation(self):
        invalid_file = SimpleUploadedFile(
            "test.exe",
            b"test content",
            content_type="application/x-msdownload"
        )
        
        with self.assertRaises(ValidationError):
            validate_file_extension(invalid_file)

    def test_valid_file_extension(self):
        valid_file = SimpleUploadedFile(
            "test.txt",
            b"test content",
            content_type="text/plain"
        )
        
        # Should not raise any exception
        self.assertIsNone(validate_file_extension(valid_file))