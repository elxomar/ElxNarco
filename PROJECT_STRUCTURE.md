# Narco Life RPG - Project Structure

This project is organized into three main directories:

## /frontend
React + Vite + TailwindCSS application for the user interface

## /backend  
Express API server and AWS Lambda function handlers

## /infrastructure
AWS Amplify configuration and deployment settings

## Getting Started

1. Install dependencies in each directory
2. Configure AWS services (Cognito, DynamoDB, Lambda)
3. Deploy using AWS Amplify

## Development Workflow

- Frontend development: `cd frontend && npm run dev`
- Backend development: `cd backend && npm run dev`
- Deploy: Use AWS Amplify CI/CD pipeline