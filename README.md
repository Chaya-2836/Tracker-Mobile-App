# Engagement Tracker Mobile App

A mobile-first dashboard for tracking engagement trends (clicks, impressions, conversions) in real time – built for AppsFlyer's internal use.

## Overview

The app provides an intuitive and accessible way to monitor engagement volume directly from mobile devices, removing the need to rely on heavy dashboards like Looker.  
It enables early detection of anomalies, potential fraud, and improves decision-making by offering fast visual insights.

## Core Features

- Real-time metrics: Clicks and impressions from the last 24 hours
- Seven-day trend charts for clicks and impressions
- Custom alerts when volume thresholds are exceeded (e.g. 70B+ clicks)
- Drill-down into:
  - Top media sources, agencies, and apps by engagement volume
  - Traffic breakdown by app, media source, and agency
  - Conversion volume per app/source
- Lightweight and intuitive visual dashboard for everyday use

## Filtering Capabilities

Supports optional filters for focused trend analysis:
- App ID, Media Source (pid), Agency (af_prt)
- Platform (iOS/Android), Link Type (Single / Multi)
- Trusted / Integrated statuses
- Templates, Shortlinks, and additional filters (based on EDP Looker Trends documentation)

## Tech Stack

- Frontend: React Native (Expo)
- Backend: Node.js (Express)
- Data Source: Google BigQuery
- Push Notifications: Custom trigger system
- State Management: React Hooks
- Version Control: Git (GitHub)

## Status

This app is under active development and is intended for internal use only.  
Feedback and suggestions are welcome.
