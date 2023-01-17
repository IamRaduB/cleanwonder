# CleanWonder
Improving communication between patients and physicians

## Description
The application aims to improve the patient-physician experience as the patient going through any type of medical intervention.
The doctor component offers doctors an administration platform for their patients, where they can:
- onboard patients
- define treatment plans
- define treatment templates
- see current status of patient treatment plans
- plan appointments

The patient portal guide the patient through their medical journey, by providing them with an easy-to-use
portal where they can:
- view their entire treatment process
- see a timeline of the upcoming steps 
- get notified of next steps
- upload media files, documentation
- request appointments

## Technical details
The application is split into 3 distinct parts:
1. Practitioner portal
2. Patient portal
3. Core

### Tech stack:
1. FE portals: Angular + TailwindCSS
2. Core: NestJS + MikroORM + MySQL + ImageKit
3. Infrastructure: Google Cloud Platform