# WhatsApp Group Invitation Website

## Overview
This is a static HTML website that displays a WhatsApp group invitation page. The website features:
- Responsive design with mobile-first approach
- Dynamic content loading (profile images, group names, member counts)
- WhatsApp-themed styling with animations
- Integration with external services for redirects

## Recent Changes
- **2025-09-09**: Initial setup in Replit environment
  - Created Node.js HTTP server for static file serving
  - Configured workflow for port 5000 with proper caching headers
  - Set up deployment configuration for autoscale

## Project Architecture
- **Frontend**: Single HTML file (`index.html`) with embedded CSS and JavaScript
- **Backend**: Simple Node.js HTTP server (`server.js`) for static file serving
- **Deployment**: Configured for autoscale deployment on Replit

## Technical Details
- **Language**: HTML, CSS, JavaScript (frontend), Node.js (server)
- **Port**: 5000 (configured for Replit environment)
- **Caching**: Disabled for proper iframe functionality in Replit
- **Responsive**: Mobile-optimized with breakpoints for different screen sizes

## Features
- Dynamic random selection of group names and profile images
- Animated UI elements with CSS animations
- Google Analytics integration
- External link redirects for WhatsApp groups and app downloads

## Dependencies
- Node.js 20 (for HTTP server)
- No additional npm packages required