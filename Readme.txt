# Higgsfield Clone

A functional recreation of the core Higgsfield experience, built as part of the 8x Engineering Assignment.

**Live:** https://higgsfieldclone-five.vercel.app/

## Overview

The goal of this project was not to reproduce every feature available in Higgsfield, but to identify and rebuild its most important product flows within the assignment timeframe.

I focused on four areas:

- **Explore** — a media-rich discovery experience inspired by Higgsfield's homepage.
- **Image Generation** — a functional AI image generation workflow backed by Cloudflare Workers AI.
- **Video Generation** — a scoped interactive prototype of the video creation workflow.
- **Assets** — persistent local history for generated images.

The application was built after researching the live Higgsfield product and using those observations to prioritize layout, interaction patterns, and feature scope.

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Cloudflare Workers AI
- FLUX.1 Schnell
- IndexedDB
- Vercel

## Image Generation

Image generation is fully functional.

The client sends a typed generation request to a Next.js API route, which validates the request and communicates with Cloudflare Workers AI using `FLUX.1 Schnell`.

The basic flow is:

`Image Workspace → API Route → Cloudflare Workers AI → FLUX → Result → Assets`

Users can configure the supported generation settings, generate multiple images, regenerate results, and access successful generations from the Assets page.

Cloudflare credentials remain server-side and are never exposed to the browser.

## Assets

Successful image generations are stored locally using IndexedDB.

Each generation preserves:

- Prompt
- Model
- Generation settings
- Timestamp
- Generated outputs

IndexedDB was chosen instead of `localStorage` after testing real generated images. Base64 image payloads quickly exceeded practical `localStorage` limits, so the persistence layer was migrated while preserving the existing generation model and UI.

Assets therefore persist across refreshes in the same browser without requiring authentication or a database.

## Video Generation

The Video workspace recreates the main interaction pattern of Higgsfield's video creation experience, including:

- Reference image upload
- Prompt input
- Aspect ratio selection
- Duration selection
- Generating state
- Result state
- Generate Again flow

Video generation is intentionally implemented as a **demo workflow rather than a real AI video API**.

I chose not to introduce a paid video provider or unnecessary GPU/backend infrastructure solely for the assignment. The video workflow is kept behind a typed `generateVideo()` boundary so a real provider can replace the demo implementation without redesigning the UI.

## Explore

The Explore page recreates the media-heavy discovery experience of Higgsfield with:

- Featured creative tools
- Trending & Discover content
- Models & Creative Tools
- Image and video previews
- Responsive layouts

Media assets were optimized specifically for their display sizes to keep the page responsive without removing the visual density of the original experience.

## Architecture

The project intentionally keeps infrastructure small.

There is no authentication, external database, billing system, or background job infrastructure. These were outside the core product flows I chose to prioritize for the assignment.

The main boundaries are:

- UI components for product interactions
- Typed generation request/result models
- Server-side image provider integration
- Client-side IndexedDB persistence
- Isolated demo provider for video generation

This keeps the application easy to understand while allowing individual providers or persistence mechanisms to be replaced later.

## Running Locally
npm run dev
Install dependencies:
npm install
For Production build:
npm run build
npm start

#Intentional Scope Decisions
Given the assignment timeframe, I prioritized complete and coherent workflows over reproducing every Higgsfield feature.
Features intentionally left out include authentication, billing, teams, Marketing Studio, Cinema Studio, advanced editing, motion control, video persistence, and a full model/effects catalog.
The Image workflow received the deepest implementation because it represents the core create → generate → result → save experience. Video was kept as a clearly scoped prototype rather than presenting simulated output as real AI generation.

#AI-Assisted Development:
AI tools were used throughout research, implementation, debugging, and iteration.
Agent interactions required for the assignment are preserved in .agent-logs/. The logs were captured during development rather than reconstructed afterward.
AI-generated suggestions were treated as implementation assistance rather than automatically accepted output. Changes were manually tested, including generation behavior, persistence, responsive layouts, production builds, and the deployed application.

#Deployment
The application is deployed on Vercel.
Cloudflare credentials are configured as server-side environment variables in production and are not included in the repository.

Live application: https://higgsfieldclone-five.vercel.app/