import sys

try:
    import reportlab
    print("REPORTLAB_INSTALLED")
except ImportError:
    print("NO_REPORTLAB")

try:
    import fpdf
    print("FPDF_INSTALLED")
except ImportError:
    print("NO_FPDF")
