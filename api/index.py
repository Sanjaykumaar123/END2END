from fastapi import FastAPI
import sys
import os

# Add backend directory to sys.path so we can import app package
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from app.main import app

# This allows Vercel to find the FastAPI instance for serverless execution
# The handler is automatically detected if 'app' is exposed
