# GateAPI - Enterprise Security Firewall for OpenClaw

Stop your OpenClaw agent from executing dangerous commands, spending money, 
or taking irreversible actions without your explicit approval.

## Why you need this
By default, OpenClaw has unrestricted access to your system. 
One hallucination can delete your files, send emails to wrong people, 
or make unauthorized API calls. GateAPI puts YOU back in control.

## Features
- Block dangerous bash commands (rm -rf, drop table, etc.)
- Require human approval for high-risk actions via Telegram or email
- Real-time audit log of every action your agent attempts
- Visual dashboard to manage all your agent rules

## Setup (2 minutes)
1. Go to https://agent-gate-rho.vercel.app and create a free account
2. Create an Agent and copy your API key
3. Add 2 lines to your OpenClaw config (see below)

## Installation
clawhub install gateapi

## Usage
import { withGateAPI } from '@gateapi/openclaw-guard';
const securedAgent = withGateAPI(myAgent, {
  apiKey: "your_api_key_from_dashboard",
  endpoint: process.env.GATEAPI_ENDPOINT || "https://agent-gate-rho.vercel.app"
});

## Dashboard
Manage all your agent rules at: https://agent-gate-rho.vercel.app
