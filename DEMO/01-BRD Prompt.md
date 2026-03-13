I want to build a BRD. Create the file in the root folder - REQUIREMENTS.md. Add reference to it in the README.md file. 

I want seperate entries for features (create them as appropriate). Add top of the requirement file a check list of items completed so that I can track it easily. 

number features to be 0X0 so that if we insert new ones we dont have to renumber all

here is what I thinking for this project.

The concept is deceptively simple. "Be white, be bright."
use The Screen Wake Lock API to keep the screen from going dark after inactivity
PWA so that users can install it and open it directly
github pages is good to start. perhaps laster, will use a domain or part of a bigger domain.
I want preferences to be stored in local storage. 
I want to have multiple profiles with names and each having its own settings
I want a share button to share a particular profile via url request parameter - override or load settings param and removed from url afterward.
each profile should have parameters such as light color, brightness, color ring format (full, circle - with inner and outer radius, border - with inner and outer radius, etc.)
I want full screen toggle button - next to the gear button
all settings are displayed by colicking on a very small gear box in the top right corner which will open a modal to make changes. changes such as temperature, brightness, format, radiuses, etc should be automatically applied and preferences should always be saved on the fly in localstorage. no apply button needed. live changes. 

use the following technology stack: Vite + React 19 + TypeScript + Tailwind CSS + shadcn/ui + Radix UI + React Router v7 + Zustand (localStorage) + React Hook Form + Zod + Vitest + React Testing Library + Playwright + ESLint + Prettier + npm

I will build the project locally and I will commit the /dist folder which will be the folder served in github pages
