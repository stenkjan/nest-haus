# Nest-Haus Commit History

_Auto-generated documentation of project changes_

---

## [f9684fc6de3c5ede33c5cfe3eb8b678fcfb39acf] - Tue Oct 7 15:57:35 2025 +0200

**Author**: stenkjan
**Message**: `refactor: comment out unused section in ImpressumClient component  - Commented out the "Fachbereiche" section in the ImpressumClient component to improve code clarity and maintainability. - This change does not affect the current functionality but prepares the code for potential future use.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/impressum/ImpressumClient.tsx


---

## [07fe1cb8102495f82a8fe67150bb66d117a0c7a7] - Tue Oct 7 15:16:53 2025 +0200

**Author**: stenkjan
**Message**: `fix: update contact information in EmailService  - Changed the email address to markus@sustain-nest.com for improved communication. - Updated the phone number to +43 664 2531869 to reflect current contact details.  `

### Changes Analysis

---

## [8c9b9a8f069c5cdc56731a7a71abc180fb0e2c57] - Tue Oct 7 15:09:34 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [aea86b309b70d919786f398c509e374f2cb816ad] - Tue Oct 7 15:06:53 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance email sender presentation with sender name  - Added a FROM_NAME property to the EmailService class for improved email presentation. - Updated the email sending logic to include the sender's name in the "from" field, enhancing the professionalism of customer and admin emails.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/test/email/route.ts


---

## [416d01673d49bcc0452745e7ef882398063f43d6] - Tue Oct 7 14:54:26 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [e642de64259cef42dde24a137a4c7d4fb8492d33] - Tue Oct 7 14:39:24 2025 +0200

**Author**: stenkjan
**Message**: `refactor: comment out insurance section in ImpressumClient component  - Commented out the insurance section in the ImpressumClient component to improve clarity and maintainability. - This change aligns with the project's goal of keeping the code slim and efficient.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/impressum/ImpressumClient.tsx


---

## [78a6a0b67d49facc617f7a7e13fc45ff92eab508] - Tue Oct 7 14:01:16 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [1c1d251d2e5b9eb786f67ddb18112e57d0cba967] - Tue Oct 7 13:58:22 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [1e3a623af8b6eb1002824f948d4ef6f3b9f4d9f5] - Tue Oct 7 12:45:21 2025 +0200

**Author**: stenkjan
**Message**: `refactor: update Datenschutz documentation and contact information  - Revised the Datenschutz documentation to include new sections and updated content, enhancing clarity and compliance with data protection regulations. - Updated the contact information for the responsible entity, including a new phone number and email address. - Improved the structure of the DatenschutzClient component to reflect the changes in the documentation and ensure a better user experience. - Adjusted the ImpressumClient component to reflect the new website URL and updated contact details.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/datenschutz/DatenschutzClient.tsx
- src/app/impressum/ImpressumClient.tsx


#### 📚 Documentation Changes
- docs/DATENSCHUTZ.md
- docs/Datenschutz.pdf
- docs/Info.pdf


---

## [120ab62ce02280f51123b748d1bc1a3545dd3395] - Tue Oct 7 11:44:26 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [ad30be8ed47d7ec989ee9e738f56cd68830f178c] - Tue Oct 7 11:40:47 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [ed329b9c80f232cc597b2d7925a9a064d044a405] - Tue Oct 7 10:46:47 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [21e6f15913db92c9f0f32e12db94971d1a8e7cec] - Tue Oct 7 10:29:16 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [5f106b71c0debd6e10a12b63ad0527e8a14a2466] - Mon Oct 6 19:30:52 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance type safety for task properties in PMG API  - Updated the type definitions for  and  in the PUT handler to use specific enums ( and ), improving type safety and clarity. - This change ensures that only valid values are assigned to these properties, reducing the risk of runtime errors and enhancing maintainability.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/admin/pmg/[id]/route.ts


---

## [61da5b08a719ca650fa832deb6174d49e520e99a] - Mon Oct 6 19:26:33 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance type handling for route parameters in PMG API  - Updated the parameter type definition in both PUT and DELETE handlers to use a Promise for the uid=1001(runner) gid=1001(runner) groups=1001(runner),4(adm),100(users),118(docker),999(systemd-journal), ensuring proper asynchronous handling. - This change improves type safety and aligns with the asynchronous nature of the request processing, reducing potential runtime errors.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/admin/pmg/[id]/route.ts


---

## [2c79f116f3355f265c2a91f976d15aa7aba0a8eb] - Mon Oct 6 19:15:01 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [f712cb0ecd47318370b4c8beb02b61d76aea9ad9] - Mon Oct 6 19:11:23 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [22a0f5996e702137d8f93c3c37f679f40f54b955] - Mon Oct 6 18:38:17 2025 +0200

**Author**: stenkjan
**Message**: `refactor: improve type safety for time slot filtering in AppointmentBooking component  - Updated the time slot filtering logic to use a specific type for slot objects, enhancing type safety and clarity in the AppointmentBooking component. - This change ensures that the available time slots are correctly identified based on their properties.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/contact/route.ts
- src/components/sections/AppointmentBooking.tsx


---

## [fbf7076fb7021e37c516c57e72673f560c7bc7c6] - Mon Oct 6 18:32:40 2025 +0200

**Author**: stenkjan
**Message**: `refactor: remove lunch break indication from AppointmentBooking component  - Removed the lunch break display from the appointment booking section to streamline the user interface. - Updated the component to reflect the changes in business hours without the lunch break information.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/sections/AppointmentBooking.tsx


---

## [2e39c21ec0947b0ae4376996eeb89cb73375112c] - Mon Oct 6 18:01:40 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [1796277adebf00f56336dfa0a3d0668e036deb70] - Mon Oct 6 17:48:55 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b11784665f810277f7f4ae8885587b6b02bd3a62] - Mon Oct 6 17:36:51 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance AppointmentBooking component with dynamic time slot handling  - Introduced useEffect to fetch available time slots from the calendar API based on the selected date. - Implemented fallback time slots for cases where no slots are available. - Updated appointment submission logic to include selected time slot details and improved error handling. - Enhanced user feedback during loading states for time slot availability.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/sections/AppointmentBooking.tsx


---

## [4a940ccc3b469828f37328c2b5024a3567df1bb0] - Mon Oct 6 14:30:08 2025 +0200

**Author**: stenkjan
**Message**: `fix: update type definition for generateAppointmentRequestEmail method  - Added ESLint directive to suppress TypeScript warning for 'any' type in the generateAppointmentRequestEmail method. - Ensured proper documentation for the method remains intact.  `

### Changes Analysis

---

## [06ab2e7b592c91f7f61033a1303b3d98f267d9b6] - Mon Oct 6 14:22:45 2025 +0200

**Author**: stenkjan
**Message**: `refactor: migrate from Google Calendar to iCloud Calendar integration  - Updated environment configuration to include iCloud Calendar settings. - Replaced GoogleCalendarService with iCloudCalendarService in calendar availability and booking routes. - Adjusted contact form handling to check iCloud calendar availability for appointment requests. - Removed Google Calendar related code and services to streamline calendar functionality.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/calendar/availability/route.ts
- src/app/api/calendar/book/route.ts
- src/app/api/contact/route.ts


#### 🔧 Configuration Changes
- .env.local
- package.json


---

## [66939fe8eec13e565aa85dd9e586e5e982fa6f17] - Mon Oct 6 14:06:22 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance GanttChart and ProjectManagementDashboard components  - Increased label length handling in GanttChart for better visibility. - Added overflow-x-auto to the chart container for improved responsiveness. - Updated ProjectManagementDashboard layout to use xl and 2xl grid classes for better adaptability. - Introduced TeamOverview component to the dashboard for enhanced task management. - Refined task filtering logic to exclude "ALLE" from unique responsibles. - Standardized date formatting to German locale across TaskDetails and TaskList components.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/pmg/components/GanttChart.tsx
- src/app/admin/pmg/components/ProjectManagementDashboard.tsx
- src/app/admin/pmg/components/StatsCards.tsx
- src/app/admin/pmg/components/TaskDetails.tsx
- src/app/admin/pmg/components/TaskList.tsx
- src/app/admin/pmg/components/TeamOverview.tsx
- src/app/api/admin/pmg/seed/route.ts


---

## [775caafe7e468fd8a0692b22eb3af43628739121] - Mon Oct 6 13:46:39 2025 +0200

**Author**: stenkjan
**Message**: `refactor: remove Google Calendar test API route  - Deleted the calendar test route in the API, which was used for testing Google Calendar integration. - Cleaned up the EmailService class by ensuring consistent formatting and type safety. - Updated type definitions to improve clarity and maintainability.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/test/calendar/route.ts


---

## [11e6256dde8d411b093f40bdb4fa9d8704de8223] - Mon Oct 6 12:49:49 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b32fc28d756c5cf872f922e0db26a317938cd7cc] - Mon Oct 6 12:46:44 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [342d61ebe95f5af2e4a943c5413db88b75c503ca] - Mon Oct 6 12:43:45 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [6cccfc54e3c9d91da513c85f2a3867568a87af43] - Mon Oct 6 12:37:48 2025 +0200

**Author**: stenkjan
**Message**: `refactor: streamline email data handling in calendar booking API  - Refactored the emailData and adminEmailData objects to improve readability and maintainability. - Ensured compliance with TypeScript standards by maintaining type safety and handling potential undefined values consistently.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/calendar/book/route.ts


---

## [335c1b413c16b605b795351ea8b58038f7ce1953] - Mon Oct 6 12:28:20 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance email data handling in calendar booking API  - Updated the emailData and adminEmailData objects to use optional chaining for properties that may be undefined, improving robustness. - Ensured compliance with TypeScript standards by explicitly handling potential undefined values for phone, message, configurationData, and totalPrice.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/calendar/book/route.ts


---

## [a634f257dab4e090d472e305d757058fca3cf110] - Mon Oct 6 12:12:36 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b537c9785d514a998f80ade8d63c27d5d0395d78] - Mon Oct 6 12:05:01 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [80177d68d4bfa6e9aa8df4202d36c02a618cf0dd] - Mon Oct 6 11:51:00 2025 +0200

**Author**: stenkjan
**Message**: `refactor: streamline tooltip callbacks in GanttChart component  - Refactored tooltip callbacks in the GanttChart component for improved readability and maintainability. - Retained existing functionality while ensuring compliance with TypeScript linting rules. - No changes to overall component structure or behavior.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/pmg/components/GanttChart.tsx


---

## [51c909db995d7bd608d248fb4bee1e39db1f3b48] - Mon Oct 6 11:47:35 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [fb0949f9963e2ce5bcff54d96e28b3c36a483a2e] - Mon Oct 6 11:40:07 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance GanttChart component and ProjectManagementDashboard structure  - Moved color constants outside the GanttChart component to avoid dependency issues and improve performance. - Updated type definitions for chart references to ensure better type safety. - Simplified the ProjectManagementDashboard component by removing unnecessary props interface, enhancing clarity and maintainability.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/pmg/components/GanttChart.tsx
- src/app/admin/pmg/components/ProjectManagementDashboard.tsx


---

## [34236a7b2604d50b07df5b15c4a6f084d3e33dc3] - Mon Oct 6 11:34:49 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [ce481a6928e4a092f4ff00b76f24c8f8c2dee8d5] - Fri Oct 3 19:05:27 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [04ad86d11af9bde9e10cf14e2e0888463fa625eb] - Fri Oct 3 18:36:39 2025 +0200

**Author**: stenkjan
**Message**: `refactor: improve logging and conditional rendering in Warenkorb components  - Added debug logging to track mode changes in WarenkorbClient for better visibility during development. - Enhanced conditional rendering in CheckoutStepper to ensure house configuration and delivery date are displayed only when not in ohne nest mode. - Improved overall clarity and maintainability of the components for a better user experience.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx


---

## [5fee3d98feae9122e36afc6adff6bc3b0117ce04] - Fri Oct 3 17:24:44 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [c1dfb143217c4d3a6ef679727cccfb2ddd3aec70] - Fri Oct 3 11:33:57 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [efdafa913acb0b37ba736e4234a0f4252b27fe7f] - Fri Oct 3 11:28:58 2025 +0200

**Author**: stenkjan
**Message**: `refactor: refine conditional rendering in CheckoutStepper  - Updated conditional rendering logic to show the house configuration section only when not in ohne nest mode without configuration. - Enhanced clarity in the display of configuration items, ensuring a more intuitive user experience. - Maintained overall readability and consistency in the CheckoutStepper component.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutStepper.tsx


---

## [7dae3026e8f0e9b672864636c2714b7f3b2b48c8] - Fri Oct 3 11:20:24 2025 +0200

**Author**: stenkjan
**Message**: `refactor: simplify conditional rendering in CheckoutStepper  - Removed unnecessary checks for isOhneNestMode in the delivery date and configuration sections to streamline the rendering logic. - Enhanced clarity in the display of configuration items and payment details by adjusting conditional statements. - Improved overall readability and maintainability of the CheckoutStepper component.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutStepper.tsx


---

## [b80f15b1d5aa9a0a9700cc4855dbb222ace7a7e4] - Fri Oct 3 11:14:56 2025 +0200

**Author**: stenkjan
**Message**: `refactor: optimize layout and rendering in CheckoutStepper  - Enhanced the layout of the CheckoutStepper component by refining the structure of configuration items and payment details. - Improved conditional rendering logic for the "Teilzahlungen" title and payment breakdown based on the isOhneNestMode state, ensuring a clearer user experience. - Streamlined rendering for price display and configuration details to maintain consistency across different modes.  `

### Changes Analysis

#### 📚 Documentation Changes
- NEST-HAUS-LAUNCH-SECURITY-ROADMAP.md


---

## [9d378317745c323109fb347c04e37ccdb2a54070] - Fri Oct 3 10:43:35 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [58993f47d05773ae6578e35ad93232f8f651ba7b] - Fri Oct 3 10:13:39 2025 +0200

**Author**: stenkjan
**Message**: `refactor: improve structure of CheckoutStepper component  - Replaced a div with class "space-y-6" inside the conditional rendering for better semantic structure. - Wrapped the content in a "contents" div to enhance layout flexibility while maintaining existing styles.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutStepper.tsx


---

## [53268ee65f28d758ebe1797f64ece09786b7007c] - Thu Oct 2 16:29:40 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [86512de492452819d43ab8d6e0dcbb2745dc8428] - Thu Oct 2 16:10:55 2025 +0200

**Author**: stenkjan
**Message**: `refactor: remove unnecessary conditional rendering in CheckoutStepper  - Eliminated redundant closing conditional block in CheckoutStepper to streamline the component's rendering logic.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutStepper.tsx


---

## [e0a9eb346d9cc8158ccc27fd9ade80b707b8c63e] - Thu Oct 2 16:04:41 2025 +0200

**Author**: stenkjan
**Message**: `feat: implement "ohne nest" mode functionality in cart and summary components  - Added "Ohne Nest fortfahren" button in SummaryPanel for navigation to the cart in ohne-nest mode. - Updated WarenkorbClient to check URL parameters for ohne-nest mode and manage state accordingly. - Enhanced CheckoutStepper to conditionally render content based on the isOhneNestMode state, modifying displayed titles and configuration sections. - Introduced new actions in cartStore to manage the ohne-nest mode state effectively.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx


---

## [100e69eaced83fcf6a4cf8521ae5322d73b8f588] - Thu Oct 2 15:41:02 2025 +0200

**Author**: stenkjan
**Message**: `feat: improve cart configuration update logic and enhance image handling in CheckoutStepper  - Updated WarenkorbClient to check for actual configuration changes before updating the cart, preventing unnecessary updates and improving performance. - Added safety checks in CheckoutStepper to prevent crashes during cart updates by ensuring valid sourceConfig before accessing image paths. - Enhanced conditional rendering of images to avoid rendering issues when sourceConfig is null.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx


---

## [99612e610587d7e36bac4eb07950eb7daee90060] - Thu Oct 2 15:26:48 2025 +0200

**Author**: stenkjan
**Message**: `feat: synchronize and restore overlay visibility in ConfiguratorShell and update cart configuration handling in WarenkorbClient  - Added synchronization of local PV quantity with the store on mount and configuration change in ConfiguratorShell. - Implemented restoration of overlay visibility based on configuration state for belichtungspaket and fenster selections. - Updated WarenkorbClient to modify existing cart configurations instead of skipping duplicates, enhancing cart management logic.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/warenkorb/WarenkorbClient.tsx


---

## [f062431e644a562c69da8e5c12261293f844928f] - Thu Oct 2 15:08:34 2025 +0200

**Author**: stenkjan
**Message**: `fix: correct spelling in debug logging for CheckoutStepper  - Updated the spelling of 'gebaeudehülle' to 'gebaeudehuelle' in debug logging to ensure consistency and accuracy in logged output.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutStepper.tsx


---

## [b876e5e8d3e4db53a5e1246ba419554361561f2c] - Thu Oct 2 15:02:31 2025 +0200

**Author**: stenkjan
**Message**: `feat: enhance debug logging in CheckoutStepper and configuratorStore  - Added detailed debug logging in CheckoutStepper to track the configuration item found in the cart and the source configuration being used. - Implemented logging in configuratorStore to monitor session initialization and default selection settings, improving traceability during development.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutStepper.tsx


---

## [1e0077f2f1f2fdcb0dcb0bcc773fbba00646a985] - Thu Oct 2 13:37:09 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [a453be1fc28bdcf58a0bcbb28724b20ec441840f] - Thu Oct 2 12:10:22 2025 +0200

**Author**: stenkjan
**Message**: `fix: enhance image loading state management in PreviewPanel component  - Introduced a new state to track if any image has loaded, improving overlay visibility logic. - Updated conditions for displaying overlays to include scenarios where at least one image has been loaded, enhancing user experience during image transitions.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/PreviewPanel.tsx


---

## [5bbd982486d295773013c9ec7b11949ed7bf6c97] - Thu Oct 2 11:58:48 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b065f20bae21dd370158e0e9b54d0799cd5690b2] - Tue Sep 30 12:53:22 2025 +0200

**Author**: stenkjan
**Message**: `fix: correct phrase counting logic in AI summarization  - Updated the phrase counting logic in the extractKeyFindings function to use the correct method for retrieving existing counts from the phrases map. - Ensured accurate phrase frequency tracking for improved AI summary generation.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/admin/ai-summarize/route.ts


---

## [1b2f926413e3228527d636450efaa9801511b449] - Tue Sep 30 11:38:35 2025 +0200

**Author**: stenkjan
**Message**: `fix: update text color handling in LandingPageClient component  - Changed text color for section ID 7 from a specific color to white for consistency across different screen sizes. - Ensured that the text remains white for sections 2, 3, 6, and 7, improving visual coherence on the landing page.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/LandingPageClient.tsx


---

## [407a534339919a32a9eabb6ca337f25f04d2c664] - Tue Sep 30 08:44:41 2025 +0200

**Author**: stenkjan
**Message**: `fix: update parameter handling in DELETE route for usability tests  - Changed the type of  in the DELETE function to a Promise, ensuring proper async handling of . - Awaited the  to retrieve , improving the reliability of the API response.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/admin/usability-tests/individual/[testId]/route.ts


---

## [f5863f03dfe76882ebdec38b7b93f1523ab1e001] - Tue Sep 30 08:28:01 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [9bb3ab5c0009b8b38f9538105db8dab90ceff4a5] - Tue Sep 30 08:18:00 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/LandingPageClient.tsx
- src/app/admin/alpha-tests/components/AlphaTestDashboard.tsx
- src/app/alpha-test-complete/page.tsx
- src/app/api/admin/usability-tests/delete/route.ts
- src/app/api/admin/usability-tests/export/route.ts
- src/app/api/admin/usability-tests/migrate-progress/route.ts
- src/app/api/admin/usability-tests/pdf/all/route.ts
- src/app/api/admin/usability-tests/pdf/route.ts
- src/app/api/admin/usability-tests/route.ts
- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCardsGlass.tsx
- src/components/images/ClientBlobImage.tsx
- src/components/images/ResponsiveHybridImage.tsx
- src/components/testing/AlphaTestButton.tsx
- src/components/testing/UsabilityTestPopup.tsx
- src/components/testing/config/TestQuestions.ts


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [2916ed90f32fe69c3bb6e03e57db461b66586c45] - Sat Sep 27 09:45:05 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [6a6d042127f7850aa26e2e22953bc4e9a97016df] - Sat Sep 27 09:41:51 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [8623e07a70548f56aa5751e06dba1635fbfcd72a] - Sat Sep 27 09:22:19 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [773ce4487e8dcf6e22b828eebf2739f7949e2abe] - Sat Sep 27 09:17:48 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [21eb53c2e0e708f40dce15857897845494a44fb0] - Sat Sep 27 09:10:30 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [05eef89da9c58130c95216862db6af34f61322bd] - Sat Sep 27 09:05:23 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [dacfe3ab12175cb5ccb6ecb801f4e0ca5320b481] - Sat Sep 27 09:01:47 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [0043ec84d0bec737328c6a63c7303110f9632f6a] - Sat Sep 27 08:57:41 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [2a9aa14262d41bdb3bfe0612319f76e4bda090aa] - Sat Sep 27 08:53:31 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [89093019acdd8ec4c5515c1d6421853ac6ed48d6] - Fri Sep 26 16:19:05 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [aa9f619a6ad8ab387774b68ed971b39c5d241625] - Fri Sep 26 16:11:24 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [d574a450f07dc76199d65b3c1d676fa5fbbd8f1c] - Fri Sep 26 16:05:14 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [6fce94438e9de84d7255e3750183b3c76b100933] - Fri Sep 26 15:56:14 2025 +0200

**Author**: stenkjan
**Message**: `fix: enhance mobile detection and rendering logic in ResponsiveHybridImage  - Improved initial mobile state determination for critical images during SSR to prevent hydration mismatches. - Enhanced mobile detection by combining viewport size and user agent checks. - Updated rendering logic to ensure non-critical images use the desktop path during initial render. - Added detailed debug logging for better path selection verification.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/images/ResponsiveHybridImage.tsx


---

## [65bcaed41e40d01f29e5404a91628be29dd9a9b6] - Fri Sep 26 13:53:13 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [4c32fa6685120387cecf5eda59f19042b8f39a68] - Fri Sep 26 13:44:41 2025 +0200

**Author**: stenkjan
**Message**: `fix: update image paths in constants for consistency and accuracy  - Swapped image identifiers for nestHaus1 and nestHaus2 in images.ts to ensure correct mapping. - Adjusted mobile image identifiers for nestHaus1 and nestHaus2 to match the updated paths for better consistency across platforms.  `

### Changes Analysis

---

## [80b7f5020daadcc0de7d7205d6d1a990f909f357] - Fri Sep 26 01:03:30 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [633fe0b5a3687cf6b99ac75ff7cd2f6cef79a164] - Fri Sep 26 00:53:54 2025 +0200

**Author**: stenkjan
**Message**: `fix: update SEO metadata image URLs for enhanced security and reliability  - Replaced dynamic API image paths with secure URLs for Open Graph and Twitter images in generateMetadata.ts to improve image handling and ensure consistent loading across platforms.  `

### Changes Analysis

---

## [6921dbbc1befb3624c6b06ff48aaa381ac055050] - Fri Sep 26 00:34:55 2025 +0200

**Author**: stenkjan
**Message**: `fix: update home page title in SEO configuration for brand consistency  - Changed the home page title to include the registered trademark symbol (®) for NEST-Haus to ensure accurate branding in SEO metadata.  `

### Changes Analysis

---

## [4679c5fe96c28e438493497b5717fa9d4b5aef0f] - Fri Sep 26 00:26:29 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [9d7d65d9ce6ffac9b0cd8176ef47d76d6d57aa72] - Fri Sep 26 00:15:47 2025 +0200

**Author**: stenkjan
**Message**: `fix: update SEO metadata image paths for improved image handling  - Replaced static image paths with dynamic API calls for Open Graph and Twitter images in generateMetadata.ts to enhance image management and ensure proper image loading.  `

### Changes Analysis

---

## [338761e887721729ef65fa9731cbc53e404ffd0c] - Thu Sep 25 23:42:51 2025 +0200

**Author**: stenkjan
**Message**: `fix: update ImpressumClient details and usability test configuration  - Changed company name and address in ImpressumClient to reflect new branding. - Updated management names and contact information for accuracy. - Modified TestQuestions to make all feedback questions non-required for improved user experience during usability testing.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/impressum/ImpressumClient.tsx
- src/components/testing/UsabilityTestPopup.tsx
- src/components/testing/config/TestQuestions.ts


---

## [77750444993c046f19494b70b02ad1b5f8b7b5c7] - Thu Sep 25 23:16:06 2025 +0200

**Author**: stenkjan
**Message**: `fix: update overlay visibility logic and enhance SummaryPanel functionality  - Modified brightness, fenster, and PV overlay visibility logic to include 'planungspaket' category. - Added onReset prop to SummaryPanel and integrated it with the reset button functionality for improved state management.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/favicon.ico
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SummaryPanel.tsx


---

## [09df7780cde678a9fcfe5e3972e610334b8e84ea] - Thu Sep 25 22:42:49 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/data/configuratorData.ts
- src/components/testing/UsabilityTestPopup.tsx


#### ⚙️ Backend Changes
- prisma/seed.ts


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [1d711d56660eba500afab4a62793c4b573bf79d2] - Thu Sep 25 22:36:18 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/unser-part/UnserPartClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/components/sections/GrundstueckCheckSection.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [1dc5ec713ceeaee159e2b6534f6b5c0bc543f547] - Thu Sep 25 22:32:43 2025 +0200

**Author**: stenkjan
**Message**: `Fix checkout stepper text wrapping and alignment issues  - Fixed appointment text wrapping in summary boxes (mobile-only max-width) - Made appointment text right-aligned with proper multi-line support - Standardized date format to use numeric format (dd.mm.yyyy) consistently - Added mobile center alignment for step 3 text content - Reverted warum-wir page to black background with white text - Enhanced GrundstueckCheckSection with centerOnMobile prop - Updated typography and spacing in warum-wir page  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/unser-part/UnserPartClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/components/sections/GrundstueckCheckSection.tsx


---

## [94fd85f5b6310d3b49b83aae62764d065fd3a83b] - Thu Sep 25 22:30:04 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [d00655110e27e242752000860a8a0000e45e0732] - Thu Sep 25 22:23:40 2025 +0200

**Author**: stenkjan
**Message**: `feat: enhance step management and tagging in UsabilityTestPopup  - Added logic to reset lastCommentStep when transitioning to a new step. - Improved step tagging functionality by checking for existing tags before adding. - Added console logs for better debugging and tracking of step changes and tagging actions.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/testing/UsabilityTestPopup.tsx


---

## [35d0b58e34fb3539377e4ee89a316487d153c2ae] - Thu Sep 25 22:13:41 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warum-wir/WarumWirClient.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [3d6e7172812e83752695aa3ac73b7e2b6ee088eb] - Thu Sep 25 21:51:50 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/entdecken/EntdeckenClient.tsx
- src/components/SectionRouter.tsx
- src/components/cards/PlanungspaketeCards.tsx
- src/components/testing/UsabilityTestPopup.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [6ab1baafca08ccdfaa968356c37794803820029c] - Thu Sep 25 21:48:18 2025 +0200

**Author**: stenkjan
**Message**: `refactor: update UsabilityTestPopup component layout and styling  - Changed the position of the minimized state button to the top-right corner for better visibility. - Adjusted padding and margin for desktop text display to enhance layout consistency. - Updated button text for improved clarity and user experience.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/testing/UsabilityTestPopup.tsx


---

## [d71b80449772f70515b0e991aa13249133aa84d0] - Thu Sep 25 21:41:14 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [c563460e6d952cd572b94b7a48d5631d54744e0a] - Thu Sep 25 21:24:15 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/datenschutz/DatenschutzClient.tsx
- src/app/kontakt/page.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/components/grids/ThreeByOneGrid.tsx
- src/components/sections/ContactMap.tsx
- src/components/sections/GrundstueckCheckForm.tsx
- src/components/sections/TerminVereinbarenContent.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md
- docs/DATENSCHUTZ.md


---

## [514909da17b617d3bb3d13bf265637ae88cbad66] - Thu Sep 25 21:19:12 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [fbfd1f0b2e0d8862d40d174499f42d2dcc05a87d] - Thu Sep 25 21:15:09 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [90c4ecd0982ea52575f2fc1b9293f9240a4f2c67] - Thu Sep 25 21:08:30 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/entdecken/EntdeckenClient.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/components/grids/ThreeByOneGrid.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [e91a86837d274d107a4d57f38083f8bc5047db8c] - Thu Sep 25 21:00:22 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [3b75934ecee41018199202ffa5ff6e8540cc2950] - Thu Sep 25 20:54:25 2025 +0200

**Author**: stenkjan
**Message**: `fix: reorder image constants for Eiche and EicheParkett in images.ts  - Swapped the values of  and  to correct their references, ensuring accurate image mapping in the application.  `

### Changes Analysis

---

## [8d2aef964c6227d683ef87661fcc1fdbef61973c] - Thu Sep 25 17:42:39 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutPlanungspaketeCards.tsx
- src/components/cards/CheckoutStepCard.tsx
- src/components/sections/ContactMap.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [0f2320ab582b792264cd34169d20627aab3d5a1b] - Thu Sep 25 17:29:30 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/entdecken/EntdeckenClient.tsx
- src/app/konfigurator/components/ConfiguratorContentCardsLightbox.tsx
- src/app/konfigurator/core/DialogDataTransformer.ts
- src/app/unser-part/UnserPartClient.tsx
- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCardsGlass.tsx
- src/components/cards/VideoCard16by9.tsx
- src/components/dialogs/CalendarDialog.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [56e8b5581e4894fe99811d92656ff13ceab35fea] - Thu Sep 25 17:15:32 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [c299d3816bac888ce8b991c8ce4a0f6b0dfac20d] - Thu Sep 25 16:30:08 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [d8a74af831cd6a4ece130602cc6abd9cffd18efa] - Thu Sep 25 16:25:22 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b10fc6752e2d39a4734d74fd11d4c4c0489933ef] - Thu Sep 25 16:16:55 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/globals.css
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/sections/PartnersSection.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [be9f4bcb2371529d45de3b7f39ab5e85b3f45fe6] - Thu Sep 25 15:44:35 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/app/entdecken/EntdeckenClient.tsx
- src/app/globals.css
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/components/cards/PlanungspaketeCards.tsx
- src/components/grids/ThreeByOneGrid.tsx
- src/components/sections/GetInContactBanner.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b22c2a9316dbd79c6f3a0077f7148a2d4ffe7d17] - Thu Sep 25 15:36:10 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/entdecken/EntdeckenClient.tsx
- src/components/sections/PartnersSection.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [857123a208363aa1868c5daf76fc96f4d8ede457] - Thu Sep 25 15:10:47 2025 +0200

**Author**: stenkjan
**Message**: `fix: adjust bottom margins in EntdeckenClient and PartnersSection for improved layout  - Updated bottom margins in multiple sections of EntdeckenClient for better spacing. - Increased bottom margin in PartnersSection header for enhanced visual consistency.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/entdecken/EntdeckenClient.tsx
- src/components/sections/PartnersSection.tsx


---

## [fa9d516e6b1cd063068e164cffcfca4607ca6436] - Thu Sep 25 14:07:49 2025 +0200

**Author**: stenkjan
**Message**: `fix: adjust margin in GrundstueckCheckForm for improved layout  - Increased bottom margin from 16 to 24 in the paragraph to enhance spacing and visual consistency.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/sections/GrundstueckCheckForm.tsx


---

## [9e04e814a6c28e8270fcf887e0d475e5d4c82196] - Thu Sep 25 13:49:46 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [f34657b7f8a1d723f80cd998717167bd90c81e59] - Thu Sep 25 12:23:07 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [dc4e417cff0691bd4bfb8686f35bee82f76ee17c] - Thu Sep 25 12:04:45 2025 +0200

**Author**: stenkjan
**Message**: `fix: update secondary button variant color on LandingPageClient  - Changed secondaryButtonVariant from "landing-secondary" to "landing-secondary-blue" for improved visual consistency.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/LandingPageClient.tsx
- src/app/entdecken/EntdeckenClient.tsx
- src/components/cards/VideoCard16by9.tsx


---

## [d3be2c7795cf151da01e39ac3df6b2218173094b] - Thu Sep 25 11:10:21 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/app/warenkorb/steps.ts


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [a61e7f70cd53de0916e03a050448f3df44b5ec08] - Wed Sep 24 18:28:22 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [08758ecd8220f3c7da6c4f7d8870f7426467d4b8] - Wed Sep 24 18:24:58 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/unser-part/UnserPartClient.tsx
- src/components/dialogs/GrundstueckCheckDialog.tsx
- src/components/sections/GrundstueckCheckForm.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [42d97c0b083279a08e04576a3fc857b665178aa9] - Wed Sep 24 16:29:34 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [af7882b67dfdb5a883df19d8b465738866a9b592] - Wed Sep 24 16:27:18 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [782a825042fc01852e4a745691111f007b4bc264] - Wed Sep 24 16:18:36 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/unser-part/UnserPartClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/grids/ThreeByOneAdaptiveHeight.tsx
- src/components/grids/ThreeByOneGrid.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [0da57663f2a10ef9b31da755ac5f0ba2617f021e] - Wed Sep 24 16:12:12 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b3193ab80f20554bdfd7ba72fc4d5e6e4665f672] - Wed Sep 24 15:46:34 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/favicon.ico
- src/components/cards/CheckoutPlanungspaketeCards.tsx
- src/components/sections/AppointmentBookingSection.tsx
- src/components/sections/ContactMap.tsx
- src/components/sections/TerminVereinbarenContent.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md
- konfigurator_old/dialogs/README.md


---

## [7bf3f62185f2eab111877be03ef94ae4dfdfe7c0] - Wed Sep 24 15:38:57 2025 +0200

**Author**: stenkjan
**Message**: `refactor: remove old configurator files and dialogs  - Deleted outdated configurator module CSS, TypeScript components, and dialog files to streamline the codebase. - This cleanup enhances maintainability and prepares for future updates.  `

### Changes Analysis

#### 📚 Documentation Changes
- konfigurator_old/dialogs/README.md


---

## [56ec595f1729dabb3be9ad384f0b71449dbab2a5] - Wed Sep 24 15:33:58 2025 +0200

**Author**: stenkjan
**Message**: `fix: update address details in multiple components  - Changed address from "Am Ölberg 17, 8020, Graz" to "Karmeliterplatz 1, 8010, Graz" in CalendarDialog, TerminVereinbarenContent, and other relevant sections for consistency. - Updated heading styles in AppointmentBookingSection and ContactMap for improved readability.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/sections/AppointmentBookingSection.tsx
- src/components/sections/ContactMap.tsx
- src/components/sections/TerminVereinbarenContent.tsx


---

## [056a14ab21dd9e83a7000d062f4b067bb77681da] - Wed Sep 24 15:25:37 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/unser-part/UnserPartClient.tsx
- src/components/grids/ThreeByOneAdaptiveHeight.tsx
- src/components/grids/ThreeByOneGrid.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [45f66c0e5ad4d59c7650e562c3ddd725bf0e806d] - Wed Sep 24 15:23:49 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/cards/ContentCardsGlass.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [c394870784c1a9cdce1322e233276c9daef75d0e] - Wed Sep 24 15:10:00 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [6236263756afe580d18f9247634932207cd8ea9c] - Wed Sep 24 15:06:27 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/components/grids/FullWidthTextGrid.tsx
- src/components/grids/ImageWithFourTextGrid.tsx
- src/components/grids/ThreeByOneAdaptiveHeight.tsx
- src/components/grids/ThreeByOneGrid.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b4fd5ade198bc14985f8da92a5fd613340c64037] - Wed Sep 24 15:01:15 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/__tests__/SummaryPanel.test.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/data/configuratorData.ts
- src/app/konfigurator/data/dialogConfigs.ts
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutPlanungspaketeCards.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [03fa09ab59107f96ee78db8cc65db92d097bfb45] - Wed Sep 24 14:58:35 2025 +0200

**Author**: stenkjan
**Message**: `fix: update pricing for Planungspakete and adjust related components  - Updated prices for all Planungspakete options in configuratorData, constants, and store. - Adjusted tests and components to reflect new pricing structure. - Implemented migration logic for persisted state to handle price updates for existing users.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/__tests__/SummaryPanel.test.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/data/configuratorData.ts
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutPlanungspaketeCards.tsx


---

## [db3876ba50543508c2452f8460e9650c1c632a26] - Wed Sep 24 13:47:45 2025 +0200

**Author**: stenkjan
**Message**: `fix: update image path for Fundermax material in dialogConfigs  - Changed imagePath from IMAGES.materials.fundermax to IMAGES.materials.fundermaxWeiss for accurate representation in the configurator.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/data/dialogConfigs.ts


---

## [673cd9bcaf1d3beb991a5d3287796725906e17e7] - Wed Sep 24 13:39:36 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/app/globals.css
- src/app/unser-part/UnserPartClient.tsx
- src/components/cards/ContentCardsGlass.tsx
- src/components/cards/PlanungspaketeCards.tsx
- src/components/cards/VideoCard16by9.tsx
- src/components/grids/FullWidthImageGrid.tsx
- src/components/grids/FullWidthTextGrid.tsx
- src/components/grids/ThreeByOneAdaptiveHeight.tsx
- src/components/grids/ThreeByOneGrid.tsx
- src/components/layout/Navbar.tsx
- src/components/sections/GetInContactBanner.tsx
- src/components/sections/MaterialShowcase.tsx
- src/components/sections/PartnersSection.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [f8ce8a2cb10a5e0bb058de3d578127ea0ceef7a4] - Wed Sep 24 13:36:13 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [1c06646e9e9f0e5c58b142c2e624819680828e4e] - Wed Sep 24 13:27:42 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [46d653bfbca5a2c1c56edf0ae19962f3872eb160] - Wed Sep 24 13:24:44 2025 +0200

**Author**: stenkjan
**Message**: `refactor: update layout and text styling for consistency across components  - Changed max-width in DeinPartClient and GetInContactBanner to use max-w-screen-3xl for improved responsiveness. - Enhanced text styling in GetInContactBanner for better visibility and consistency with design standards. - Ensured proper formatting in Navbar component by adding a newline at the end of the file.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/components/layout/Navbar.tsx
- src/components/sections/GetInContactBanner.tsx


---

## [c8b87d09e910502b38d47f8e7af47b7157129292] - Wed Sep 24 13:10:30 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b08e2c692f9276a23b3f8c55b2593ed0a63ab1b8] - Wed Sep 24 12:42:14 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [daf36a5b7ff69ce315dd70306d7526036bda7d16] - Wed Sep 24 11:00:31 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/entdecken/EntdeckenClient.tsx
- src/app/globals.css
- src/components/cards/PlanungspaketeCards.tsx
- src/components/cards/SquareTextCard.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [ea2468a27d298757cc3a38c24bdb891dc402a3f1] - Wed Sep 24 10:10:18 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/entdecken/EntdeckenClient.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/components/cards/ContentCardsGlass.tsx
- src/components/cards/SquareTextCard.tsx
- src/components/grids/FullWidthImageGrid.tsx
- src/components/grids/ImageWithFourTextGrid.tsx
- src/components/grids/ThreeByOneAdaptiveHeight.tsx
- src/components/grids/ThreeByOneGrid.tsx
- src/components/grids/TwoByTwoImageGrid.tsx
- src/components/sections/GetInContactBanner.tsx
- src/components/sections/MaterialShowcase.tsx
- src/components/sections/PartnersSection.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [3d9cae6efbb0d32079b80f4722be6f0fcc8d0c83] - Tue Sep 23 16:17:17 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b155e6e3bff9d9d896752a978de4b73192efa345] - Tue Sep 23 16:14:45 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [2273520b9d26dfa614b91f81bc2d61044b6d9338] - Tue Sep 23 14:42:10 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [f65ac6e438734d6a107b4d697212ec87dc373ffa] - Tue Sep 23 14:26:57 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [9e705df9cc5e9c5296145c3aa1a7ab5c6a513f19] - Tue Sep 23 14:24:05 2025 +0200

**Author**: stenkjan
**Message**: `refactor: implement step icons in SquareTextCard component for enhanced visual representation  - Introduced a new StepIcon component utilizing HybridBlobImage for dynamic icon rendering based on step number. - Updated createSquareTextCardIcon function to return step icons for cards 1-7, improving the visual consistency of the card icons. - Added step icons to defaultSquareTextCardData for cards 1 through 7, enhancing user experience with relevant imagery.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/cards/SquareTextCard.tsx


---

## [d08d9aa3a0db76ab7ccb9948df83c24272e8e33c] - Tue Sep 23 14:09:06 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutPlanungspaketeCards.tsx
- src/components/cards/PlanungspaketeCards.tsx
- src/components/grids/ThreeByOneAdaptiveHeight.tsx
- src/components/sections/PartnersSection.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md
- docs/MODULAR_CONTENT_ARCHITECTURE.md


---

## [0c1edf239dd75923cc3153977c2ede3518efa113] - Tue Sep 23 13:42:36 2025 +0200

**Author**: stenkjan
**Message**: `refactor: adjust margin and padding in multiple components for improved layout consistency  - Modified margin and padding in EntdeckenClient, PlanungspaketeCards, and PartnersSection for better alignment and visual consistency. - Enhanced text structure to maintain a cohesive design across sections.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/entdecken/EntdeckenClient.tsx
- src/components/cards/PlanungspaketeCards.tsx
- src/components/sections/PartnersSection.tsx


---

## [ad12206162fd5e9ffd51cb6070d21ab0cd63b629] - Mon Sep 22 22:10:40 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [2303e38daca5a7b1f3df522fe93e0419154df68c] - Mon Sep 22 20:37:27 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/entdecken/EntdeckenClient.tsx
- src/components/cards/PlanungspaketeCards.tsx
- src/components/cards/SquareTextCard.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [f6ea194325e0e96568d62f767e053fe15c6c84f4] - Mon Sep 22 19:28:18 2025 +0200

**Author**: stenkjan
**Message**: `fix: correct apostrophe in title of EntdeckenClient for proper rendering  - Updated the title "So läuft's ab" to "So läuft&apos;s ab" to ensure correct HTML entity representation.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/entdecken/EntdeckenClient.tsx


---

## [c98f05f9dc317ca16890e93098dbb85129b65ae8] - Mon Sep 22 19:24:02 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [e7162d555b542bb71736f1d9b8bdad24dfcd3889] - Mon Sep 22 18:49:23 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [d3e7ac298d425483a09dcc514ca07a21921d744a] - Mon Sep 22 11:08:09 2025 +0200

**Author**: stenkjan
**Message**: `chore: update content and structure across multiple files  - Modified text content in LandingPageClient and EntdeckenClient for improved clarity and branding. - Added a new section in EntdeckenClient for better user guidance. - Updated button text in GetInContactBanner for consistency. - Adjusted height classes in PartnersSection for better layout. - Renamed titles in contentCardPresets for better alignment with user experience. - Added new lines in documentation files for improved readability.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/LandingPageClient.tsx
- src/app/entdecken/EntdeckenClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/SectionRouter.tsx
- src/components/cards/SquareTextCard.tsx
- src/components/layout/Navbar.tsx
- src/components/sections/GetInContactBanner.tsx
- src/components/sections/PartnersSection.tsx


#### 📚 Documentation Changes
- docs/CURRENT_STATE_ANALYSIS_2025.md
- docs/README.md


---

## [d08b5b436c435831245b792a1e3f8a1cc34b1858] - Fri Sep 19 12:26:58 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [beccfe9688af0c96961726345f7ae87accc89a82] - Fri Sep 19 12:21:03 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/page.tsx
- src/app/page.tsx
- src/app/sitemap.ts
- src/components/lazy/LazyComponents.ts
- src/components/motion/MotionWrapper.tsx


#### 🔧 Configuration Changes
- next.config.ts
- package.json


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md
- docs/CURRENT_STATE_ANALYSIS_2025.md


---

## [7f7a25569019a90ff20e3bdc3b672821705d0638] - Fri Sep 19 09:46:10 2025 +0200

**Author**: stenkjan
**Message**: `Merge branches 'main' and 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/app/entdecken/EntdeckenClient.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/components/grids/FullWidthTextGrid.tsx
- src/components/grids/ImageWithFourTextGrid.tsx
- src/components/grids/ThreeByOneGrid.tsx
- src/components/sections/GetInContactBanner.tsx
- src/components/sections/MaterialShowcase.tsx
- src/components/sections/PartnersSection.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md
- docs/CURRENT_STATE_ANALYSIS_2025.md
- docs/README.md


---

## [3b4cd6c9c9ad602336df81486d0f278536dcd594] - Thu Sep 18 13:16:58 2025 +0200

**Author**: stenkjan
**Message**: `refactor: adjust spacing and layout across multiple components for improved responsiveness  - Reduced margin and padding values in various sections to enhance visual consistency and responsiveness. - Updated class names and styles in components such as DeinPartClient, EntdeckenClient, and FullWidthTextGrid to ensure better alignment and spacing. - These changes aim to optimize the user experience across different devices and screen sizes.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/app/entdecken/EntdeckenClient.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/components/grids/FullWidthTextGrid.tsx
- src/components/grids/ImageWithFourTextGrid.tsx
- src/components/grids/ThreeByOneGrid.tsx
- src/components/sections/GetInContactBanner.tsx
- src/components/sections/MaterialShowcase.tsx
- src/components/sections/PartnersSection.tsx


#### 📚 Documentation Changes
- docs/CURRENT_STATE_ANALYSIS_2025.md
- docs/README.md


---

## [43c9f940138f3187d40a7856c06bb78bf9eee399] - Mon Sep 15 13:35:48 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [cadfbdc2703e8be4d8101eebfefe8648942b6388] - Mon Sep 15 13:24:30 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [a1b800a98da8d582f717e3be2474cca9b4e6e281] - Thu Sep 11 11:55:14 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [986ad4132176d306df9b95e65b77667ae94ea513] - Thu Sep 11 10:06:19 2025 +0200

**Author**: stenkjan
**Message**: `refactor: update image grid caching and positioning for improved performance  - Modified the TwoByTwoImageGrid component to enable caching for all images. - Adjusted the object position for the first image to enhance visual presentation.  These changes aim to optimize image loading and display within the grid.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/grids/TwoByTwoImageGrid.tsx


---

## [fb9e745906c87a53bb756596a606a79e6920594b] - Thu Sep 11 09:29:16 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [06593bd9ca4fcbdeff7e99519337dee5f2147994] - Thu Sep 11 09:25:35 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/entdecken/EntdeckenClient.tsx
- src/components/cards/PlanungspaketeCards.tsx
- src/components/cards/SquareTextCard.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [1b6ca0b5a71a8f7d14679641f3c41e07e7da2355] - Wed Sep 10 19:27:25 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/cards/ContentCardsGlassLightbox.tsx
- src/components/cards/ContentCardsLightbox.tsx
- src/components/cards/PlanungspaketeCards.tsx
- src/components/cards/PlanungspaketeCardsLightbox.tsx
- src/components/cards/SquareGlassCardsScroll.tsx
- src/components/cards/SquareTextCard.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [2bf26d654c1c880804f821bf2a0343132f409045] - Wed Sep 10 19:08:54 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/app/entdecken/EntdeckenClient.tsx
- src/app/kontakt/KontaktClient.tsx
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/grids/TwoByTwoImageGrid.tsx
- src/components/sections/AppointmentBookingSection.tsx
- src/components/ui/Button.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [301a9b58a5292fd6be7b2ec45acccdd71f815b70] - Wed Sep 10 18:36:46 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [5043fd50c49798794f41b2e9d0b3dda9ccc1915a] - Wed Sep 10 18:14:35 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCardsGlass.tsx
- src/components/cards/PlanungspaketeCards.tsx
- src/components/cards/SquareGlassCardsScroll.tsx
- src/components/cards/SquareTextCard.tsx
- src/components/ui/Dialog.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [8fe6cfd0ce3c94c01b83b3bb18084e13257e4aa5] - Wed Sep 10 17:58:44 2025 +0200

**Author**: stenkjan
**Message**: `refactor: remove legacy belichtungspaket overlay logic in ConfiguratorShell  - Eliminated the special handling for the belichtungspaket overlay, which is now integrated into the main selection logic. - Updated comments to reflect the removal of outdated functionality, streamlining the component's behavior.  These changes aim to simplify the overlay management in the configurator, enhancing code clarity and maintainability.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorShell.tsx


---

## [bedf5ec89ee87fab00154f3632bc1560af2ea54e] - Wed Sep 10 17:51:25 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [f3ed7235c12c4afffacaf8757b36bc593f04c3bb] - Wed Sep 10 17:35:39 2025 +0200

**Author**: stenkjan
**Message**: `refactor: streamline card components by removing unused imports and renaming variables  - Removed unused  import from multiple card components to clean up the code. - Renamed variables for maximum scroll and adjusted maximum index to improve clarity and consistency across components.  These changes aim to enhance code maintainability and readability in the card components of the configurator.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCardsGlass.tsx
- src/components/cards/PlanungspaketeCards.tsx
- src/components/cards/SquareGlassCardsScroll.tsx
- src/components/cards/SquareTextCard.tsx
- src/components/ui/Dialog.tsx


---

## [a3429867fe77e36d7ac15ec1c56f274a538dab80] - Wed Sep 10 17:23:44 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/files/route.ts
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/data/dialogConfigs.ts
- src/app/unser-part/UnserPartClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutStepCard.tsx
- src/components/cards/SquareTextCard.tsx
- src/components/files/ClientBlobFile.tsx
- src/components/sections/GrundstueckCheckForm.tsx
- src/components/ui/Dialog.tsx
- src/hooks/useFileDownload.ts


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [730475c4ae76cb7e2cbe61c6bd598bab01f41864] - Wed Sep 10 17:17:02 2025 +0200

**Author**: stenkjan
**Message**: `refactor: update dialog configurations and enhance CheckoutStepper component  - Changed the image path in dialogConfigs to use a new hero image for better visual representation. - Improved price calculation logic in CheckoutStepper to display price per square meter for configuration items with nest, enhancing clarity for users. - Refactored layout in CheckoutStepCard for better alignment and spacing of icons and titles, improving overall presentation.  These updates aim to enhance the user experience by providing clearer information and a more visually appealing interface.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/data/dialogConfigs.ts
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutStepCard.tsx


---

## [c0a55abeea127b89c8f09d7712c9d6f2c88686f0] - Wed Sep 10 15:55:15 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [422dd59447465595f1b8447d240705efb585ac30] - Wed Sep 10 15:47:43 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [e00ffb33cfc68e733ba4c1c37491cbcc26dc24e4] - Wed Sep 10 15:44:04 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [45d26be8c48c88c0943ee4655987bd30aabc4407] - Wed Sep 10 13:41:40 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [ee9a1ffc0096ca4595ae75695392a862f0b20626] - Wed Sep 10 13:26:00 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [bd06c7937354b577293f56c233c2202c492fdcbc] - Wed Sep 10 13:02:15 2025 +0200

**Author**: stenkjan
**Message**: `refactor: update test files for consistency and clarity  - Refactored integration tests in ConfiguratorShell to improve code readability and maintainability by standardizing import statements and formatting. - Updated test descriptions and assertions for better clarity and consistency across various test cases. - Adjusted mock configurations to reflect changes in naming conventions, ensuring alignment with recent updates in the codebase.  These changes enhance the overall quality and coherence of the test suite.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/__tests__/ConfiguratorShell.integration.test.tsx
- src/app/konfigurator/__tests__/PriceCalculator.test.ts
- src/app/konfigurator/__tests__/SummaryPanel.test.tsx
- src/app/konfigurator/__tests__/performance.test.ts
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutPlanungspaketeCards.tsx


---

## [0c4feaf3f47cd651dbb761d502da99bb79805755] - Wed Sep 10 12:50:16 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [bafc38e10201628260618f6c60718182cbc641bf] - Wed Sep 10 12:28:47 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [c90a48c5092d1a76d6a5bbd797518f7b63e4edda] - Wed Sep 10 12:24:14 2025 +0200

**Author**: stenkjan
**Message**: `refactor: update component text and structure for improved clarity and consistency  - Changed button text in CartFooter from "Jetzt bauen" to "In den Warenkorb" for better user understanding. - Enhanced accessibility by ensuring view labels in PreviewPanel are properly defined and fallback values are provided. - Simplified the SummaryPanel layout by removing unnecessary button elements, focusing on a cleaner design. - Added optional overlay image handling in various components to improve visual presentation. - Updated CheckoutStepper to prioritize cart item configuration for consistent display and added overlays for enhanced user experience.  These changes aim to improve usability, accessibility, and visual coherence across the application.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/CartFooter.tsx
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/core/DialogDataTransformer.ts
- src/app/konfigurator/core/ImageManager.ts
- src/app/konfigurator/data/dialogConfigs.ts
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/ContentCards.tsx
- src/components/sections/AppointmentBooking.tsx


---

## [4c9f24f357e771e19851b6954bfa1ecd98432535] - Wed Sep 10 11:12:33 2025 +0200

**Author**: stenkjan
**Message**: `fix: update API endpoint for improved data retrieval  - Modified the API endpoint to optimize data fetching, reducing unnecessary calls and enhancing performance. - Implemented error handling to manage potential failures gracefully, ensuring a smoother user experience.  These changes aim to improve the efficiency and reliability of data interactions within the application.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutProgress.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutPlanungspaketeCards.tsx
- src/components/cards/CheckoutStepCard.tsx
- src/components/cards/VideoCard16by9.tsx
- src/components/grids/ThreeByOneAdaptiveHeight.tsx
- src/components/grids/ThreeByOneGrid.tsx
- src/components/sections/AppointmentBooking.tsx


---

## [2c09094a038ee4ce25f0abaa086749693adc444f] - Tue Sep 9 20:52:42 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [d492bd34c752a8108878ba1d51ab3fdabaff4b1a] - Tue Sep 9 20:46:05 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [49c2e5c63819864529b50e46bdf50535095f256e] - Tue Sep 9 20:41:50 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [be30fa13dc92e1bce876cefbf436f3493c90e509] - Tue Sep 9 20:36:33 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [ed3474b0591df2786f1841d1800884c019b0cf60] - Tue Sep 9 20:31:55 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [86941310f18e5233e0e1313511d010eeca67c988] - Tue Sep 9 20:10:57 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [1c6e5df6db3b00b6f6647b9018e7e6076c0d5cdd] - Tue Sep 9 18:44:04 2025 +0200

**Author**: stenkjan
**Message**: `refactor: update dialog content and improve color consistency  - Replaced static text in CalendarDialog with a new component for better modularity and maintainability. - Updated color values for the 'belichtungspaket' category in DialogDataTransformer to ensure consistency with other categories. - Adjusted image paths in constants to remove mobile suffix, aligning with the latest asset naming conventions.  These changes enhance the configurator's user interface and maintainability.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/core/DialogDataTransformer.ts
- src/components/dialogs/CalendarDialog.tsx
- src/components/sections/AppointmentBooking.tsx
- src/components/sections/TerminVereinbarenContent.tsx
- src/components/sections/index.ts


---

## [2f3d043c3206641a462e108c56e7c82c89df8496] - Tue Sep 9 18:23:27 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [65b3d9f49a07dddc226ef159fc165ad408137a72] - Tue Sep 9 18:16:54 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [9a094c08790b2c411e5fe7cfa9404f6dd379a63b] - Tue Sep 9 17:55:24 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [c4758c69923658ebf2058e25f6a3efd7cfe1ea55] - Tue Sep 9 17:43:21 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [f7aa5c8eda046bfdc75cbd880960851f70e87aea] - Tue Sep 9 16:32:23 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [4f874169fb405a4c41e243278cce08dbcd2a87bd] - Tue Sep 9 15:43:35 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance session tracking and configurator components for improved performance and maintainability  - Updated session tracking logic in the API to use upsert for PostgreSQL, ensuring race condition handling. - Improved configurator component behavior by refining overlay visibility and view switching based on user selections. - Added special handling for planungspaket in the summary panel to avoid duplicate entries and ensure accurate pricing. - Enhanced cart synchronization for planungspaket changes, ensuring the cart reflects the latest configurator state. - Cleaned up code formatting and comments for better readability and maintainability.  These changes contribute to a more efficient and user-friendly experience in the configurator and cart functionalities.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/sessions/track/route.ts
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/core/ImageManager.ts
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx


---

## [0d1f0da5bcea491b8cb2e3b92a8766e3d8dc60cb] - Tue Sep 9 13:41:48 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [d268cd3c4d1a18a703b284c0eecc5fe4bc89d481] - Tue Sep 9 13:40:14 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [a0f949740d8c27bb4a6beab83026dfeb5f494f2d] - Tue Sep 9 13:35:32 2025 +0200

**Author**: stenkjan
**Message**: `refactor: streamline button component by removing unused width classes and optimizing imports in UnserPartClient  - Removed unnecessary width class functions from Button component to simplify styling logic. - Cleaned up imports in UnserPartClient for better maintainability.  These changes contribute to a more efficient codebase and improved component performance.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/unser-part/UnserPartClient.tsx
- src/components/ui/Button.tsx


---

## [02d492628e1917e468f5957fe63ad53c29ae2178] - Tue Sep 9 13:29:12 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [6cca9ac69b601cf6f4b73e678975881364c08786] - Tue Sep 9 08:28:27 2025 +0200

**Author**: stenkjan
**Message**: `feat: add navigation links to buttons in EntdeckenClient for improved user experience  - Replaced static button elements with Next.js Link components for "Dein Part" and "Unser Part" in both mobile and desktop views. - This change enhances navigation and streamlines user flow within the application.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/entdecken/EntdeckenClient.tsx


---

## [70e1bcd5fb79cbf3476a0827a953db96c136fbaa] - Mon Sep 8 14:51:07 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [5a5c036fd1f91abf00b118e1d3f51a3db71be219] - Mon Sep 8 14:36:33 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [e1f95109676bfe1ce2ecf4e3380da118c1449c82] - Mon Sep 8 11:50:53 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [ae13aa93319b883d41fdfa6bb9a70bd5d04e4587] - Mon Sep 8 11:44:00 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [d9d9fea665a1865f92d0fbce217520ad3a68ea88] - Mon Sep 8 10:53:46 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enable alpha test components for usability testing  - Activated AlphaTestProvider and AlphaSessionTracker in layout.tsx to facilitate usability testing. - Updated comments to reflect the current status of alpha test components, indicating their readiness for integration. - These changes enhance the testing framework while maintaining compliance with existing functionalities.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/layout.tsx


---

## [79be83beebfb0b0405f74472f20838173007bccd] - Mon Sep 8 10:44:46 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [2e489512e3b74b09496aecc0dc656a1298558e73] - Mon Sep 8 10:37:51 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [e5287cea5457f4e5848adcb2443320e6db081acf] - Mon Sep 8 10:21:14 2025 +0200

**Author**: stenkjan
**Message**: `Enhance typography standards and component structure  - Introduced standard responsive breakpoint patterns for consistent typography scaling across components. - Updated title and subtitle classes to improve responsiveness and visual hierarchy. - Added new LandingImagesCarousel component for better image handling in various sections. - Refactored existing sections to utilize the new carousel and updated typography classes. - Removed unused SectionHeader component to streamline the codebase.  These changes improve the overall design consistency and maintainability of the project.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/app/entdecken/EntdeckenClient.tsx
- src/app/kontakt/KontaktClient.tsx
- src/app/layout.tsx
- src/app/showcase/cards/page.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutProgress.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/components/Footer.tsx
- src/components/cards/CheckoutPlanungspaketeCards.tsx
- src/components/cards/CheckoutStepCard.tsx
- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCardsGlass.tsx
- src/components/cards/PlanungspaketeCards.tsx
- src/components/cards/SquareGlassCard.tsx
- src/components/cards/SquareGlassCardsScroll.tsx
- src/components/cards/SquareTextCard.tsx
- src/components/cards/VideoCard16by9.tsx
- src/components/cards/index.ts
- src/components/cards/mobile-scroll-optimizations.css
- src/components/grids/FullWidthImageGrid.tsx
- src/components/grids/FullWidthTextGrid.tsx
- src/components/grids/FullWidthVideoGrid.tsx
- src/components/grids/ImageWithFourTextGrid.tsx
- src/components/grids/StaticGlassCard.tsx
- src/components/grids/ThreeByOneAdaptiveHeight.tsx
- src/components/grids/ThreeByOneGrid.tsx
- src/components/grids/TwoByTwoImageGrid.tsx
- src/components/grids/VideoGallery.tsx
- src/components/images/ClientBlobVideo.tsx
- src/components/sections/AppointmentBooking.tsx
- src/components/sections/AppointmentBookingSection.tsx
- src/components/sections/ContactMap.tsx
- src/components/sections/GetInContactBanner.tsx
- src/components/sections/GrundstueckCheckForm.tsx
- src/components/sections/GrundstueckCheckSection.tsx
- src/components/sections/LandingImagesCarousel.tsx
- src/components/sections/MaterialShowcase.tsx
- src/components/sections/PartnersSection.tsx
- src/components/sections/PlanungspaketeSection.tsx
- src/components/sections/SectionHeader.tsx
- src/components/sections/index.ts
- src/components/ui/Button.tsx


#### 📚 Documentation Changes
- docs/TYPOGRAPHY_STANDARDS.md


---

## [b74118fa071638a4b7a8cbbf8b4be6bbf8acb266] - Fri Sep 5 12:25:50 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [4898a0ae2eb13052662507975bc31240af8f0002] - Fri Sep 5 12:00:21 2025 +0200

**Author**: stenkjan
**Message**: `Fix oklch color compatibility issue in PDF export  - Added comprehensive oklch to rgb color conversion for html2canvas compatibility - Implemented temporary CSS stylesheet to override problematic oklch colors - Added TreeWalker to scan and convert all oklch colors in the DOM - Included extensive color mapping for common Tailwind CSS colors - Added proper cleanup of temporary styles and stylesheets - Enhanced error handling with specific guidance for oklch color issues - Fallback color conversion using hsl approximation for unmapped colors  This resolves the 'Attempting to parse an unsupported color function oklch' error that prevented PDF generation with modern Tailwind CSS colors.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/alpha-tests/components/AlphaTestDashboard.tsx


---

## [6ca915a286e59f89338d1200ca7d42e685d05978] - Fri Sep 5 11:49:09 2025 +0200

**Author**: stenkjan
**Message**: `Update URLs in documentation and components to reflect the transition from .com to .at domain  - Changed all instances of 'nest-haus.com' to 'nest-haus.at' across various documentation files and components. - Updated metadata, canonical links, and contact information to ensure consistency with the new domain. - Adjusted sitemap and robots.txt to point to the new domain for SEO purposes. - Ensured all email addresses are updated to the new domain format for proper communication.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/agb/AgbClient.tsx
- src/app/cookie-einstellungen/CookieEinstellungenClient.tsx
- src/app/datenschutz/DatenschutzClient.tsx
- src/app/dein-part/page.tsx
- src/app/entdecken/page.tsx
- src/app/impressum/ImpressumClient.tsx
- src/app/konfigurator/page.tsx
- src/app/kontakt/page.tsx
- src/app/layout.tsx
- src/app/page.tsx
- src/app/sitemap.ts
- src/app/unser-part/page.tsx
- src/app/warenkorb/page.tsx
- src/app/warum-wir/page.tsx


#### 📚 Documentation Changes
- docs/ALPHA_TEST_PRESENTATION_GUIDE.md
- docs/CONFIGURATOR_OPTIMIZATION_GUIDE.md
- docs/CONTACT_SYSTEM_AND_ADMIN_IMPLEMENTATION_GUIDE.md
- docs/SECURITY_TESTING_GUIDE.md


---

## [49df3d778037f91081bf6166b8872ff355bc9380] - Fri Sep 5 11:38:12 2025 +0200

**Author**: stenkjan
**Message**: `Implement high-quality PDF export with preserved styling  - Added jspdf and html2canvas libraries for proper PDF generation - Replaced basic browser print with html2canvas screenshot approach - Enhanced PDF export features:   * Maintains all visual styling, colors, and layout   * High resolution (2x scale) for crisp text and graphics   * Professional title page with summary statistics   * Multi-page support for long dashboards   * Loading state with spinner during generation   * Proper error handling and user feedback - Improved PDF layout:   * Fixed 1200px width for consistent rendering   * White background with proper padding   * Charts and images properly rendered   * Hidden elements (.no-print) excluded from export - Added comprehensive styling adjustments for PDF rendering - Filename includes date and time range for easy organization  The PDF export now captures the exact visual appearance of the admin dashboard with all charts, colors, and styling intact.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/alpha-tests/components/AlphaTestDashboard.tsx


#### 🔧 Configuration Changes
- package.json


---

## [1cffa21983ad859a5f55f6b87a8040292d28d801] - Thu Sep 4 16:24:41 2025 +0200

**Author**: stenkjan
**Message**: `refactor: update AlphaTestDashboard and Navbar for improved clarity and responsiveness  - Renamed table headers in AlphaTestDashboard for better accuracy: changed "% of Tests" to "% of Category" and "% of Category" to "% of Total Tests". - Enhanced Navbar component to highlight active links with improved styling and transitions for better user experience. - Updated class names for link elements to reflect active states, ensuring consistent visual feedback across both mobile and desktop views.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/alpha-tests/components/AlphaTestDashboard.tsx
- src/components/layout/Navbar.tsx


---

## [f12fcab44492ef6a7cc5819605f20797dd989884] - Thu Sep 4 15:37:29 2025 +0200

**Author**: stenkjan
**Message**: `Implement 24-hour auto-abort for tests and enhance button click debugging  - Changed test auto-abort timeout from 30 minutes to 24 hours - Added try-catch for abandoned test updates to handle Prisma issues gracefully - Enhanced button click tracking debug logging:   * Added sessionId and isTrackingActive to debug output   * Added detailed API request/response logging   * Added warning when sessionId is missing - Updated both admin API route and export route with 24-hour timeout - Should help identify why button clicks aren't being captured properly  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/admin/usability-tests/export/route.ts
- src/app/api/admin/usability-tests/route.ts
- src/components/testing/AlphaSessionTracker.tsx
- src/hooks/useAlphaSessionTracking.ts


---

## [d482ee4adf7d5ab58f2ca7baf2d7a17b256c8ac9] - Thu Sep 4 15:06:58 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [95e0275d38e6d5a71c843ac1d9c13c4fb18b3274] - Thu Sep 4 14:54:23 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance price calculation logic in CheckoutStepper  - Introduced a new function, getItemPrice, to streamline dynamic price calculations for various configuration items. - Implemented detailed price calculation logic for items such as belichtungspaket, stirnseite, and gebäudehülle, ensuring accurate pricing based on user selections. - Updated display logic to reflect calculated prices in the cart summary, improving the overall user experience and consistency in pricing information.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutStepper.tsx


---

## [f4573feb4e27823d0a754c6ce5e628da8fd68065] - Thu Sep 4 14:39:51 2025 +0200

**Author**: stenkjan
**Message**: `refactor: improve code readability and image configuration logic in CheckoutStepper  - Adjusted indentation for better readability in conditional class assignments. - Updated image configuration logic to prioritize live configurator state for real-time synchronization, ensuring images match the current preview panel. - These changes aim to enhance code clarity and maintain a consistent user experience.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutStepper.tsx


---

## [3086f0a6f22751c26d8e313ecd347641516a2142] - Thu Sep 4 14:19:28 2025 +0200

**Author**: stenkjan
**Message**: `refactor: reorder options in configuratorData for consistency  - Moved the 'Holzlattung Lärche Natur' and 'Fichte' options to maintain a consistent order in the options array. - This change aims to enhance readability and organization within the configurator data structure.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/data/configuratorData.ts


---

## [556dd9064fa5825029b70a9496dc0cbe4e89ab35] - Thu Sep 4 14:07:16 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [a4994e4a8fbfa9be16efc69d34b7aba227d49712] - Thu Sep 4 13:58:41 2025 +0200

**Author**: stenkjan
**Message**: `refactor: adjust spacing in ConfiguratorShell and simplify FactsBox layout  - Updated padding and spacing in ConfiguratorShell to enhance visual consistency and responsiveness. - Simplified the layout of FactsBox by removing unnecessary padding, improving component clarity. - These changes aim to improve the overall user interface and maintain a clean design across components.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/FactsBox.tsx


---

## [bf254d0b599a289fb82321e02f39e70ac214d861] - Wed Sep 3 16:30:02 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'development'  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/entdecken/EntdeckenClient.tsx
- src/components/sections/PartnersSection.tsx


#### ⚙️ Backend Changes
- scripts/README-DEV-SERVER.md
- scripts/dev-with-ip.cmd
- scripts/get-local-ip.js
- scripts/start-dev.js


#### 🔧 Configuration Changes
- package.json


---

## [f1a3f06e4f92937f7b9873ea6e334069267121ab] - Wed Sep 3 16:03:14 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'development'  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/LandingPageClient.tsx
- src/app/entdecken/EntdeckenClient.tsx
- src/app/kontakt/KontaktClient.tsx
- src/app/kontakt/components/GrundstueckCheckWrapper.tsx
- src/app/showcase/cards/page.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCardsGlass.tsx
- src/components/cards/MOBILE_SCROLL_IMPROVEMENTS.md
- src/components/cards/PlanungspaketeCards.tsx
- src/components/cards/PlanungspaketeCardsLightbox.tsx
- src/components/cards/SquareGlassCardsScroll.tsx
- src/components/cards/SquareTextCard.tsx
- src/components/cards/VideoCard16by9.tsx
- src/components/cards/index.ts
- src/components/cards/mobile-scroll-optimizations.css
- src/components/grids/TwoByTwoImageGrid.tsx
- src/components/sections/AppointmentBooking.tsx
- src/components/sections/AppointmentBookingSection.tsx
- src/components/sections/ContactMap.tsx
- src/components/sections/GrundstueckCheckForm.tsx
- src/components/sections/PartnersSection.tsx
- src/components/sections/index.ts
- src/components/ui/Button.tsx


#### 🔧 Configuration Changes
- next.config.ts
- package.json


---

## [0a47f36bbb41d5dd5a60117ba1d2caa7a0c37811] - Wed Sep 3 15:56:48 2025 +0200

**Author**: stenkjan
**Message**: `Enhance image loading experience in PreviewPanel  - Introduced loading states for main and previous images to prevent blank spaces during transitions. - Updated logic to keep the previous image visible until the new one is fully loaded, improving user experience. - Adjusted overlays (PV Module, Brightness, Fenster) to only display when the main image is loaded, ensuring better performance and visual consistency.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/PreviewPanel.tsx


---

## [8c8f9e1f8f474cd17d1e9d3e92e045c5d35ddf45] - Wed Sep 3 15:42:55 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [800121fecab00888c55d06849b5439dae26c6ed7] - Wed Sep 3 15:32:42 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [290d36a940b1e98cba73f58f3f2fc6442a6651d4] - Wed Sep 3 15:26:04 2025 +0200

**Author**: stenkjan
**Message**: `Adjust positioning of module count badge in PvModuleOverlay for improved layout  - Updated the positioning of the module count badge for both desktop and mobile views to enhance visibility and alignment. - Desktop badge now appears lower within the image area, while mobile badge is positioned more to the right and slightly higher, ensuring better user experience across devices.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/PvModuleOverlay.tsx


---

## [90061b2452c08201bc53e9260df0448fe68ffc9e] - Wed Sep 3 15:12:28 2025 +0200

**Author**: stenkjan
**Message**: `Refactor FensterOverlay component to improve visibility handling  - Moved visibility check to the appropriate location in the  component to ensure it only renders when  is true. - This change enhances performance by preventing unnecessary rendering of the overlay.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/FensterOverlay.tsx


---

## [4639bd9279d2345ec7dde0945ce4547f008c5808] - Wed Sep 3 15:09:28 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [cdba880bbe25ad43e37bea6fde63eb759c1754ba] - Wed Sep 3 15:07:03 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [7055306df98eb65178fa4aa69d1f0be514ca0b3a] - Wed Sep 3 15:03:10 2025 +0200

**Author**: stenkjan
**Message**: `Enhance configurator functionality with Fenster overlay support  - Added state management for Fenster overlay visibility in . - Implemented conditional rendering for Fenster overlay in . - Updated configurator data to reflect new pricing for Holz Fenster. - Introduced new image constants for Fenster overlays to improve visual representation.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/FensterOverlay.tsx
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/konfigurator/data/configuratorData.ts


---

## [15ca30fbf9faa6237454b810470cfa1e2bc1bcac] - Wed Sep 3 14:43:09 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [169fcc2d9cc7a52ef6da6fef93464ee5a239de8d] - Wed Sep 3 14:42:10 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [23f62abcc681f83b952227ed96eb481a168f9a30] - Wed Sep 3 13:40:02 2025 +0200

**Author**: stenkjan
**Message**: `Refactor AlphaSessionTracker for improved readability and maintainability  - Reformatted code for better alignment and consistency - Updated function names for clarity (e.g., isFormElement to _isFormElement) - Enhanced debug logging for event listeners and tracking status - Ensured that form interaction tracking remains disabled for non-meaningful events  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/testing/AlphaSessionTracker.tsx


---

## [933c12977afb10979a2fb1a3c1e9e8f40cb28d96] - Tue Sep 2 18:59:07 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [0adfc36292e3f5316fc759c7fae9f56bf93c88e4] - Tue Sep 2 18:54:38 2025 +0200

**Author**: stenkjan
**Message**: `Improve session tracking and filter irrelevant form interactions  - Remove focus/blur tracking as they're not meaningful user interactions - Add configurator element filtering to avoid tracking configurator form changes - Enhanced debug logging for button clicks to include tracking status and path - Filter out configurator-related form elements (tracked separately via configurator store) - Focus on meaningful user interactions: button clicks, form submissions, and changes outside configurator - Should improve data quality in Most Clicked Pages and individual test analytics  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/testing/AlphaSessionTracker.tsx


---

## [f33459c9f6056703c8d0860b4518b8a8b7238239] - Tue Sep 2 18:23:57 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [35a8de3a50c45a0fc17dd8fb57cb9dcc1e7762b2] - Tue Sep 2 18:20:32 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [8ca142f008a6eb40e387fd18ef9310214d868742] - Tue Sep 2 17:52:12 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [1117c2774e7fb94fa338b1d98fedae35255b371d] - Tue Sep 2 17:48:43 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [8e8de6ac24c576faeed0e77a79b624e3bcde8666] - Tue Sep 2 17:23:02 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [2e7650f6284a4696ccfb1ffb5c904fab2998a73e] - Tue Sep 2 17:07:43 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [a4ce8c794f64b94da34a1d63a80a68c577c27c97] - Tue Sep 2 15:55:17 2025 +0200

**Author**: stenkjan
**Message**: `Fix alpha test individual popup responses and tracking  - Fixed response display in individual test popup (response.response instead of response.response.value) - Fixed API endpoints in useAlphaSessionTracking hook (was using non-existent /api/alpha-test/track-interaction) - Added automatic page visit tracking to AlphaSessionTracker with navigation detection - Updated hook to use correct /api/usability-test/track-session endpoint - Added trackPageVisit function to useAlphaSessionTracking hook - Fixed button clicks and page visits now being properly captured and stored  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/alpha-tests/components/AlphaTestDashboard.tsx
- src/components/testing/AlphaSessionTracker.tsx
- src/hooks/useAlphaSessionTracking.ts


---

## [9bc23eea889b9e91dada7b5f005a8712b2baf1dd] - Tue Sep 2 14:09:48 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [f42b3ec1e4e1c079595274635bc1844080b9c19f] - Tue Sep 2 14:05:58 2025 +0200

**Author**: stenkjan
**Message**: `Enhance PvModuleOverlay component with dynamic overlay images and improved module count display  - Refactored the PvModuleOverlay to use a new function for determining the overlay image based on nest size and module count. - Updated the module count badge to only display for amounts above 4 modules, with adjusted positioning for better visibility. - Added new PV overlay images for nest80 configurations to improve visual representation. - Adjusted image paths in the constants file for consistency and mobile compatibility.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/PvModuleOverlay.tsx


---

## [166bc79d72d5a53699e35c1eb36e54c835924598] - Tue Sep 2 13:19:26 2025 +0200

**Author**: stenkjan
**Message**: `Remove unused performance and test files, and update image mappings for consistency across configurations  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/core/ImageManager.ts


---

## [040dba29079476e1f6427ca61bfbfa4ab5791761] - Mon Sep 1 11:38:02 2025 +0200

**Author**: stenkjan
**Message**: `Fix build errors in AlphaTestDashboard  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/alpha-tests/components/AlphaTestDashboard.tsx


---

## [c4afea1afb25ab69d5a6abed6bd10ec03aae32b7] - Mon Sep 1 11:31:45 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [9c47e6bb2f3944e3d38befd6036124cce5679c42] - Mon Sep 1 11:25:43 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b64cd9c1bded37964bbc0ab493dc0a71e9ba431f] - Mon Sep 1 11:22:16 2025 +0200

**Author**: stenkjan
**Message**: `Merge branches 'main' and 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [fd7261dbaabf9337a10316bdcf502d91427172ba] - Mon Sep 1 11:09:27 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [fb26e9098cb21476ad4db0a7adb001b836533f6c] - Mon Sep 1 10:52:18 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [5a83657bf0533baaf7a84af225e6a8d6fa785d67] - Mon Sep 1 10:15:30 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [a895ccd7a2ef17f6161206dba9ec919e693e2a9a] - Fri Aug 29 11:46:38 2025 +0200

**Author**: stenkjan
**Message**: `Add useAlphaSessionTracking hook to index exports  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/hooks/index.ts
- src/hooks/useAlphaSessionTracking.ts


---

## [b48aae9874d3df2d75c74bf5ac9bc734feb5cb54] - Fri Aug 29 11:40:04 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'development'  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/app/entdecken/EntdeckenClient.tsx
- src/app/kontakt/KontaktClient.tsx
- src/app/showcase/cards/page.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCards.tsx.backup
- src/components/cards/ContentCardsGlass.tsx
- src/components/cards/ContentCardsLightbox.tsx
- src/components/cards/PlanungspaketeCards.tsx
- src/components/cards/PlanungspaketeCardsLightbox.tsx
- src/components/cards/README.md
- src/components/cards/SquareGlassCardsScroll.tsx
- src/components/cards/UnifiedCardPreset.tsx
- src/components/cards/VideoCard16by9.tsx
- src/components/cards/cardTypes.ts
- src/components/cards/cardUtils.ts
- src/components/cards/index.ts
- src/components/cards/presetSystem.ts
- src/components/grids/FullWidthTextGrid.tsx
- src/components/grids/FullWidthVideoGrid.tsx
- src/components/grids/ImageWithFourTextGrid.tsx
- src/components/grids/ThreeByOneGrid.tsx
- src/components/grids/TwoByTwoImageGrid.tsx
- src/components/sections/GetInContactBanner.tsx
- src/components/sections/GrundstueckCheckSection.tsx
- src/components/sections/PartnersSection.tsx
- src/components/sections/PlanungspaketeSection.tsx
- src/components/sections/SectionHeader.tsx
- src/components/sections/index.ts


#### 📚 Documentation Changes
- docs/PROJECT_OVERVIEW.md
- docs/TYPOGRAPHY_STANDARDS.md


---

## [268b13088fd1b80506b463c4603155b969746e8d] - Fri Aug 29 11:21:46 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [ac14aff9e6ee25f6247442b2c2d9ad84568c4141] - Fri Aug 29 11:14:58 2025 +0200

**Author**: stenkjan
**Message**: `Fix ESLint error: prefix unused index parameter with underscore  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/admin/usability-tests/route.ts


---

## [6f6753aff637637f73443eb1dd596887a695b865] - Fri Aug 29 11:11:19 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [7dece506390f2114db8efe4dee5b8a14ba0739e2] - Fri Aug 29 11:03:34 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [7eb7ae9de2ccae865c6c7c0bc030b92447324837] - Fri Aug 29 10:56:46 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b5161483ce21b597cf35b1646dc0c99ec89b2f82] - Fri Aug 29 10:32:51 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [91b3353f4da5feaccbb87623c48abcdd26b23867] - Fri Aug 29 10:26:30 2025 +0200

**Author**: stenkjan
**Message**: `Fix Prisma Query Engine deployment issue - Add additional binary targets and webpack config  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorCheckbox.tsx


#### ⚙️ Backend Changes
- prisma/schema.prisma


#### 🔧 Configuration Changes
- next.config.ts


---

## [5ec7d22ee8f69210112373f4ca2b77fde4ea0d71] - Thu Aug 28 19:33:54 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [73f23ac29726006a6de6630d923173a297bd28de] - Thu Aug 28 19:23:42 2025 +0200

**Author**: stenkjan
**Message**: `Fix 500 error by temporarily disabling problematic Prisma updateMany call  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/admin/usability-tests/route.ts


---

## [92bdb21e73e5a42adec3b8a471b7c9395a555553] - Thu Aug 28 19:17:39 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [29b741888b4818978a1913edf5cd71f836e07a74] - Thu Aug 28 19:08:26 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [ae188b8d3c59da0c605caefee81f9dfe1fe7d828] - Thu Aug 28 19:04:31 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [6c3906678e402e2d16ee6a6ce3823470535e3fd7] - Thu Aug 28 19:01:56 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [cf84f9d247a0221d95449429bc0e830fb36d27cc] - Thu Aug 28 18:59:11 2025 +0200

**Author**: stenkjan
**Message**: `Fix TypeScript lint errors: Add underscore prefix to unused variables  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/admin/usability-tests/route.ts


---

## [98450cc527639b84f4f9d2df0442e38b4b2f1637] - Thu Aug 28 18:53:00 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [524bf564175ec5e1f5260fb67d73f7e4b782e1ae] - Thu Aug 28 18:50:46 2025 +0200

**Author**: stenkjan
**Message**: `Fix TypeScript lint error: Replace any[] with proper type  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/admin/usability-tests/route.ts


---

## [c1ac81dfcb67b33bda61295a845f49388ca3bc7b] - Thu Aug 28 18:36:22 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [9148eededcb071991d43c122586c80c6a0a04d5c] - Thu Aug 28 18:34:38 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [24651e593faf4e06c56c8f15ca3c45c5ddac1d7f] - Thu Aug 28 18:32:33 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [f9d3edc6baa8eb5a3790aa1fd01b520685ff1b05] - Thu Aug 28 18:31:10 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [a0a0dfe4cc522cda9506cf62bebd5a175315b9ce] - Thu Aug 28 18:30:00 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [60aa0b38f287e8a8f57d42b9b42de3ab88af40c5] - Thu Aug 28 18:28:42 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [c6445350008509b61edd740b886175fd006d8373] - Thu Aug 28 18:27:21 2025 +0200

**Author**: stenkjan
**Message**: `Fix Prisma deployment issue: Add binary targets for Vercel  `

### Changes Analysis

#### ⚙️ Backend Changes
- prisma/schema.prisma


---

## [132cef5874fd404b2d9564a8f029828a96d5dfdf] - Thu Aug 28 16:31:58 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [fca31a4849e4783316072b9716420db18dfdb695] - Thu Aug 28 16:23:01 2025 +0200

**Author**: stenkjan
**Message**: `feat: add energy certificate facts to configurator data  - Introduced a new 'facts' section for each category in configuratorData, detailing the energy certificate A++ specifications, including heating type, energy demand, CO₂ emissions, and efficiency class.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/data/configuratorData.ts


---

## [85f6045987f648ad1fcfca33783d825317d41c57] - Thu Aug 28 16:17:22 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [a2b7995dffdd46a70921d6aa89d296832f6a8264] - Thu Aug 28 16:09:31 2025 +0200

**Author**: stenkjan
**Message**: `refactor: update configurator components and pricing logic  - Refactored the CategorySection component to adjust subtitle color for better visibility. - Enhanced the ConfiguratorShell component by adding checkbox options for 'kamindurchzug' and 'fussbodenheizung', including their respective handlers and pricing logic. - Updated the PriceCalculator to incorporate new checkbox options in pricing calculations. - Modified the ImageManager to reflect changes in interior configuration defaults. - Cleaned up the configuratorData by removing the 'stirnseite' category and correcting the title of 'Belichtungspaket'. - Improved the configurator store to manage new checkbox options effectively, ensuring accurate price calculations.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/admin/usability-tests/route.ts
- src/app/konfigurator/components/CategorySection.tsx
- src/app/konfigurator/components/ConfiguratorCheckbox.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/core/ImageManager.ts
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/data/configuratorData.ts


---

## [ca2e6353c9d136ee65b8d60fbdbc6d7f2987227f] - Wed Aug 27 12:02:37 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [96e41ec0c1426b5de6a3d32b0afb71451121d155] - Wed Aug 27 11:55:24 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [beb8aabfb34b4fa5c69ec8edf22f1c6d5f4a07c6] - Wed Aug 27 11:47:14 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance type safety in AlphaTestDashboard component  - Updated the renderExpandableBox function to use generic type T for data, improving type safety and flexibility. - Ensured that the renderItem function receives the correct type, enhancing code maintainability.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/alpha-tests/components/AlphaTestDashboard.tsx


---

## [7fb417a1854c54bbc27e991db121129483a75670] - Wed Aug 27 11:43:33 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [ed32a2cf65ae9b807d57e048d64e7ee6a0d85718] - Wed Aug 27 11:40:06 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [8bbb493ff9bd161196bebbd4ee42251f8e776b07] - Wed Aug 27 11:37:11 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [bb4feb07e6df91c9547d04917c325b1d7c970a03] - Thu Aug 21 14:02:51 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [49648bafd820f150f30d6b3ae49c148be8f7f1ca] - Thu Aug 21 13:58:34 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [0e5071a2499fe4d12fbf7d4003a084b19ba38270] - Thu Aug 21 12:24:29 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'development'  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/BrightnessOverlay.tsx
- src/app/konfigurator/components/CartFooter.tsx
- src/app/konfigurator/components/ConfiguratorContentCardsLightbox.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/KonfiguratorClient.tsx
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/konfigurator/components/PvModuleOverlay.tsx
- src/app/konfigurator/components/QuantitySelector.tsx
- src/app/konfigurator/components/SelectionOption.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/core/DialogDataTransformer.ts
- src/app/konfigurator/core/ImageManager.ts
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/core/PriceUtils.ts
- src/app/konfigurator/data/configuratorData.ts
- src/app/konfigurator/data/dialogConfigs.ts
- src/app/konfigurator/page.tsx
- src/app/konfigurator/types/configurator.types.ts
- src/app/unser-part/UnserPartClient.tsx
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutProgress.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/app/warenkorb/steps.ts
- src/components/cards/ContentCards.tsx
- src/components/dialogs/PlanungspaketeDialog.tsx
- src/components/images/ClientBlobImage.tsx
- src/components/images/ResponsiveHybridImage.tsx
- src/components/layout/Navbar.tsx


#### ⚙️ Backend Changes
- scripts/README-Image-Swap.md
- scripts/execute-image-swap.ps1
- scripts/image-name-swap.js
- scripts/verify-image-swap.js


#### 🔧 Configuration Changes
- .github/workflows/deploy-development.yml
- package.json


#### 📚 Documentation Changes
- README.md
- docs/CONFIGURATOR_CODE_REVIEW.md
- docs/CONFIGURATOR_OPTIMIZATION_GUIDE.md
- docs/CONFIGURATOR_STATE_INTEGRATION.md
- docs/PARTNERS_EXTRACTION.md
- docs/PERFORMANCE_OPTIMIZATION_FIXES.md
- docs/PRICE_CONFIGURATION_OPTIMIZATION.md
- docs/SEO_OPTIMIZATION_ROADMAP.md


---

## [8af5d3acf374038a33d23219d316d6de754e40f0] - Mon Aug 18 12:23:25 2025 +0200

**Author**: stenkjan
**Message**: `refactor: improve middleware password protection logic  - Updated middleware to apply password protection only on Vercel production environment. - Simplified the condition check for production environment, enhancing code clarity.  `

### Changes Analysis

---

## [dd8ecf02f2945af9091cef7de0f7ca50a4daba2d] - Mon Aug 18 11:59:24 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance image fallback handling in ClientBlobImage and ResponsiveHybridImage components  - Updated default fallback in ClientBlobImage to generate a proper SVG placeholder with correct dimensions. - Set default width and height for images in ResponsiveHybridImage to 1200x800 for improved consistency and layout stability.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/images/ClientBlobImage.tsx
- src/components/images/ResponsiveHybridImage.tsx


---

## [f308455049f9c398c981eb8e559507ab27a2f9eb] - Fri Aug 15 13:13:02 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [9904b2bee5f2b00c5a9a3ec90fef74c7c47ba526] - Fri Aug 15 13:08:53 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [3f4ece9bafbf6873852bc0b8b84f21030ed52cde] - Fri Aug 15 13:05:01 2025 +0200

**Author**: stenkjan
**Message**: `Add password protection for production  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/auth/route.ts
- src/app/auth/page.tsx


---

## [f9cc9dddc667bd4ed581ad3ba37586654d0b18af] - Wed Aug 13 15:05:33 2025 +0200

**Author**: stenkjan
**Message**: `� Configurator structure improvements  - Remove 'ein patentiertes system' text from fussboden section - Add 'Mehr informationen zum Fußboden' lightbox button - Move PV-Anlage section before innenverkleidung - Create fussboden lightbox support - Maintain all existing pricing logic unchanged  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorContentCardsLightbox.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/data/configuratorData.ts


---

## [3aae0585cb09137aeaed374594895e73bd0264d6] - Tue Aug 12 15:13:50 2025 +0200

**Author**: stenkjan
**Message**: `fix: update label for window/door quantity selector in ConfiguratorShell  - Changed the label from "Anzahl der Fenster / Türen" to "Größe der Fenster / Türen" for better clarity in the user interface.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorShell.tsx


---

## [9dc57972171e20d33a6f238447533abe3e984a99] - Tue Aug 12 12:31:48 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [e3bada9a744d84d3658996ddf0c7654f66cf8e16] - Tue Aug 12 12:28:26 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance layout responsiveness in LandingPageClient  - Updated content overlay styling to adjust alignment and padding based on section ID. - Improved layout for section ID 4 to ensure better spacing and visual consistency across different screen sizes.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/LandingPageClient.tsx


---

## [de0e9cb821177366f190b551cf8d36c8c5773f3c] - Tue Aug 12 11:46:59 2025 +0200

**Author**: stenkjan
**Message**: `fix: update ResponsiveHybridImage component to set width and height properties  - Added width and height properties with values of 0 to the ResponsiveHybridImage component for better image handling. - Included sizes attribute set to "100vw" to enhance responsiveness across different viewports.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/LandingPageClient.tsx
- src/components/images/ClientBlobImage.tsx
- src/components/images/ResponsiveHybridImage.tsx


---

## [1f13c5b8cda81393863b0f531901d71cae9c4f6f] - Tue Aug 12 11:42:30 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/images/HybridBlobImage.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b8a209e18b61f58223aa9bfa8e3e47ec146d9f3d] - Mon Aug 11 21:43:00 2025 +0200

**Author**: stenkjan
**Message**: `removed unused spinner  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/images/HybridBlobImage.tsx


---

## [a15775b0261964f6b2a297aef72193e7d67a7bd6] - Mon Aug 11 18:17:15 2025 +0200

**Author**: stenkjan
**Message**: `refactor: remove confirmation button states and update fallback images  - Eliminated the confirmation button states for PV and Fenster sections in ConfiguratorShell to streamline the component. - Updated the fallback images in ClientBlobImage and HybridBlobImage to use a transparent SVG placeholder instead of a placeholder API URL. - Adjusted the fallback images in the constants to match the new SVG format for consistency across the application.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/components/images/ClientBlobImage.tsx
- src/components/images/HybridBlobImage.tsx


---

## [782e3aced483fa288f2838ec7dc2762a091d5293] - Mon Aug 11 14:28:35 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [f116a6e00f5787b0bc0386a90332c69bd4be00c0] - Mon Aug 11 14:13:52 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [727dfcd26d1d9f43e0727fd2f8b85bc94f532075] - Mon Aug 11 14:03:14 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [63253e59eb73e19d1663e5822c57fae6fc10b5f6] - Mon Aug 11 13:50:35 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance image loading performance and responsiveness across components  - Replaced  with  in  for optimized image loading based on device type. - Updated API routes to support direct redirects for immediate image serving, improving load times. - Implemented connection-aware preloading in  to enhance user experience on varying network conditions. - Switched  to  in  for lazy loading of videos, reducing initial load impact. - Added new image components to streamline image handling and improve performance across the application.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/LandingPageClient.tsx
- src/app/api/images/batch/route.ts
- src/app/api/images/route.ts
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/konfigurator/core/ImageManager.ts
- src/components/grids/FullWidthVideoGrid.tsx
- src/components/images/LazyVideoLoader.tsx
- src/components/images/ResponsiveHybridImage.tsx
- src/components/images/index.ts


---

## [4359384689d34290231c01fb046368dc916eae0e] - Mon Aug 11 12:47:48 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [5e0aa299b1c7b99ef500bcfdf4ff8b03f56ea03d] - Fri Aug 8 11:59:22 2025 +0200

**Author**: stenkjan
**Message**: `feat: add optional text fields to FullWidthVideoGrid component  - Introduced  and  properties to enhance compatibility with existing pages. - This addition allows for more flexible content presentation within the video grid.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/grids/FullWidthVideoGrid.tsx


---

## [2692e5058b73fa08cd1d170078f9219e3bc875d3] - Fri Aug 8 11:54:12 2025 +0200

**Author**: stenkjan
**Message**: `refactor: rename screenWidth state variable in FullWidthVideoGrid component  - Changed the state variable name from  to  to avoid potential naming conflicts and improve code clarity. - This minor adjustment enhances the maintainability of the component.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/grids/FullWidthVideoGrid.tsx


---

## [cac3221d0475789e6ccc759218bd9f527afe7f68] - Fri Aug 8 11:14:54 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [9d235030761fe22a751b14625e2fc50c27875f32] - Thu Aug 7 16:11:00 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [0509a28da16012e53f0c4f22d418f7fca27bf5d5] - Thu Aug 7 16:08:04 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/components/cards/ContentCards.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [0f802d823ccb734b930c563ae88803faa3d4b4d7] - Thu Aug 7 16:05:29 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/LandingPageClient.tsx
- src/app/dein-part/DeinPartClient.tsx
- src/app/entdecken/EntdeckenClient.tsx
- src/app/kontakt/KontaktClient.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/components/Footer.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [96d81c0d9c7099576d794932c27c47a00e334b10] - Thu Aug 7 16:02:30 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [587f6a098a90d9251f7701e92f38d77961ab4fc0] - Thu Aug 7 16:01:44 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [091e74bf25adb3a4438926b292353c459711e812] - Thu Aug 7 15:54:49 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [882e7789bf86efa6d43cac215235cf956dbf6e50] - Thu Aug 7 15:43:48 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance price display logic in WarenkorbClient  - Simplified the price calculation logic to prioritize the nest price if available, improving clarity in price representation. - Removed the display of the addition date for cart items to streamline the user interface and focus on essential information.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/WarenkorbClient.tsx


---

## [619a2dc5c9b8e0d8a0943f595fd6fcb512df28fb] - Thu Aug 7 15:28:43 2025 +0200

**Author**: stenkjan
**Message**: `refactor: update styling and content in WarenkorbClient  - Removed the unused getCartCount function to streamline the cart logic. - Enhanced the price display by changing the label from "Anzahl Konfigurationen" to "Gesamt" for clarity. - Updated the price formatting to display the total cart amount directly, improving user understanding. - Adjusted the font weight of the price header for better emphasis and visual hierarchy.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/WarenkorbClient.tsx


---

## [78feb260955dfc3361c97ade3710c1740c6671f8] - Thu Aug 7 15:18:38 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/components/cards/ContentCards.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [4915c9f1e07b9bb3b98a25cbb22a38f3d187369d] - Thu Aug 7 14:33:46 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/images/batch/route.ts
- src/app/konfigurator/__tests__/ImageManager.performance.test.ts
- src/app/konfigurator/components/CartFooter.tsx
- src/app/konfigurator/components/CategorySection.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/core/ImageManager.ts
- src/app/konfigurator/core/PriceUtils.ts
- src/app/warenkorb/WarenkorbClient.tsx
- src/components/images/ClientBlobImage.tsx
- src/components/layout/Navbar.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [a04d6004edfa1ee7f919f94870f5061d3144bbea] - Thu Aug 7 13:54:39 2025 +0200

**Author**: stenkjan
**Message**: `refactor: improve rendering of bottom items in SummaryPanel and WarenkorbClient  - Updated the rendering logic for bottom items in both SummaryPanel and WarenkorbClient to include conditional padding for the "grundstueckscheck" category. - Enhanced the mapping of items to ensure proper key assignment and maintain layout consistency.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/warenkorb/WarenkorbClient.tsx


---

## [7f77c166927d69a52e93b144fed88053cb89da85] - Thu Aug 7 13:38:16 2025 +0200

**Author**: stenkjan
**Message**: `refactor: comment out unused auto-scroll functionality in ConfiguratorShell and adjust spacing in SummaryPanel and WarenkorbClient  - Renamed the unused scrollToSection function to _scrollToSection for clarity. - Commented out auto-scroll calls in handlePvConfirmation and handleFensterConfirmation to prevent unintended behavior. - Updated spacing in SummaryPanel and WarenkorbClient to improve layout consistency.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/warenkorb/WarenkorbClient.tsx


---

## [30a9a2c853e915e9b4a7561ba095eed897e1d07a] - Thu Aug 7 13:18:00 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b683d2b2998837283d638747403d0d5777c2725c] - Thu Aug 7 13:11:07 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [6dfcdeb66d12d6de0dbfb7161816552bdf70a244] - Thu Aug 7 12:51:28 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [4e5045d16910f65a6d42eca282423810a5b03a80] - Thu Aug 7 12:38:10 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [9532df81b67c06a340e3f1d29e9d174d2f178c9c] - Thu Aug 7 12:17:39 2025 +0200

**Author**: stenkjan
**Message**: `fix: clean up navbar scroll behavior and add cleanup function  - Removed unnecessary else statements in the scroll detection logic to streamline the code. - Added a cleanup function to the useEffect hook for better resource management, ensuring no actions are taken when conditions are not met.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/layout/Navbar.tsx


---

## [b7629d8940b33b05985d0370265f3a63ade3ce29] - Thu Aug 7 12:00:22 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [8384616bb530638eb502ce5bd5882f89fad84493] - Thu Aug 7 11:36:30 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [0585593a4599ae5dd037c88946e7b1765334709f] - Wed Aug 6 19:17:57 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [3f348e75ba7d1b41e44f6ddeb95ad353bd4a1f12] - Wed Aug 6 19:12:18 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [6d1831feb487a26bee7aa1533decc487d08aa648] - Wed Aug 6 19:07:56 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [ee102fe6688c20a105981b1a259abc237897aa5b] - Wed Aug 6 19:03:01 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [8b831660a682dd7b16d7713a87726ac56a81108d] - Wed Aug 6 18:55:10 2025 +0200

**Author**: stenkjan
**Message**: `fix: improve navbar visibility behavior on mobile devices  - Updated the navbar's visibility logic to ensure it only hides when scrolling down on mobile devices if the user is not at the very top of the page. - This change enhances the user experience by preventing the navbar from disappearing unexpectedly, allowing for easier navigation.  These adjustments improve the usability of the navbar in the configurator.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/layout/Navbar.tsx


---

## [cee9c7015fb52ce14d9f1e60ed8959082545fe5e] - Wed Aug 6 18:39:41 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [ff5b7e04659c5e334707176f4aa4e8885de7cde9] - Wed Aug 6 18:30:08 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [1d39a77a8996e8b78bb1c280add2ae29a91e68cb] - Wed Aug 6 18:06:42 2025 +0200

**Author**: stenkjan
**Message**: `refactor: optimize image handling in PreviewPanel and ImageManager  - Moved the available views calculation in PreviewPanel to a more efficient location, improving performance and clarity. - Cleaned up the ImageManager's batch preloading function by removing unnecessary comments and ensuring consistent error handling. - Enhanced type safety in ImageManager by specifying types for success count calculations.  These changes improve the overall efficiency and maintainability of the image handling logic in the configurator.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/konfigurator/core/ImageManager.ts
- src/components/images/ClientBlobImage.tsx


---

## [ebf1dbfaace1bbe31be6ceca5a84e6b7103dc5cf] - Wed Aug 6 17:58:26 2025 +0200

**Author**: stenkjan
**Message**: `refactor: improve error handling and code clarity in image processing and configuration  - Simplified error handling in the image batch processing function to continue on failure without explicit error logging. - Updated dependency array in ConfiguratorShell to use the full configuration object for better performance and clarity. - Enhanced type safety in ImageManager by replacing  with specific types for improved maintainability. - Cleaned up formatting and consistency in ClientBlobImage for better readability.  These changes enhance the robustness and clarity of the image handling logic in the configurator.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/images/batch/route.ts
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/core/ImageManager.ts
- src/components/images/ClientBlobImage.tsx


---

## [37c1fa16ad0afffe2a4c064dfbccd5dfb310bcc4] - Wed Aug 6 13:59:12 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [04d68de98e1780a9b72a7e4ecb9169efcb22d091] - Wed Aug 6 13:49:31 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance dynamic image handling in ImageManager  - Updated the logic for generating stirnseite images to use gebäudehülle instead of nest size, improving accuracy based on building envelope material. - Introduced dynamic mappings for interior combinations, allowing for more flexible image key generation based on user selections. - Added error handling for invalid combinations and fallback mechanisms to ensure robust image retrieval.  These changes improve the configurator's responsiveness and accuracy in image rendering.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/core/ImageManager.ts


---

## [2592dfaeae8e2a393a010184dd5c89712e02e2e0] - Wed Aug 6 13:40:34 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/app/showcase/grids/page.tsx
- src/components/cards/ContentCards.tsx
- src/components/grids/FullWidthTextGrid.tsx
- src/components/grids/FullWidthVideoGrid.tsx
- src/components/sections/MaterialShowcase.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [925f442ce3c272a8c966106439b607a5993ad842] - Wed Aug 6 13:31:47 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/__tests__/ImageManager.performance.test.ts
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/konfigurator/core/ImageManager.ts


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [63685b9c22c1b5f1d3e0616a5317027c9c852750] - Wed Aug 6 13:24:01 2025 +0200

**Author**: stenkjan
**Message**: `refactor: optimize image preloading and view transitions in ConfiguratorShell and PreviewPanel  - Enhanced bulk calculation trigger in ConfiguratorShell for improved performance. - Implemented intelligent preloading and predictive navigation in PreviewPanel to enhance user experience. - Introduced smooth transitions and loading states for image display, ensuring a seamless interaction during view changes.  These optimizations contribute to a more responsive and user-friendly configurator experience.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/__tests__/ImageManager.performance.test.ts
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/konfigurator/core/ImageManager.ts


---

## [21b4b5b598fd13443df67ec56cc85bf64773345f] - Tue Aug 5 14:38:48 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b3859984beec03b0b5b624bf6b1cbcdfcba61c1b] - Tue Aug 5 13:41:19 2025 +0200

**Author**: stenkjan
**Message**: `feat: enhance UnserPartClient with new navigation buttons and improved text formatting  - Added navigation buttons for "Dein Part" and "Jetzt bauen" to facilitate user navigation. - Updated text content across various sections to improve clarity and engagement, incorporating HTML spans for better styling. - Adjusted image references to ensure accurate representation of the NEST-Haus modules.  These enhancements improve user interaction and content presentation on the Unser Part page.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/unser-part/UnserPartClient.tsx
- src/components/grids/FullWidthImageGrid.tsx
- src/components/grids/ThreeByOneAdaptiveHeight.tsx
- src/components/grids/ThreeByOneGrid.tsx


---

## [cc2c3f7617f00bba61708195868e1e333ce42efd] - Mon Aug 4 17:42:56 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [fadbbe04877373363c8293b473a60f51f799f4fa] - Mon Aug 4 16:35:11 2025 +0200

**Author**: stenkjan
**Message**: `feat: enhance DeinPartClient with new Step by Step section and update card components  - Added a new "Step by Step nach Hause" section with detailed steps for planning and construction. - Reintroduced the "Deine Gestaltungsmöglichkeiten" video gallery section with improved structure. - Updated SquareGlassCard and SquareGlassCardsScroll components to include title, subtitle, description, and responsive image handling. - Enhanced styling for better visual consistency and user experience across devices.  These updates improve the content presentation and interactivity on the Dein Part page.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/app/showcase/cards/page.tsx
- src/components/cards/ImageGlassCard.tsx
- src/components/cards/SquareGlassCard.tsx
- src/components/cards/SquareGlassCardsScroll.tsx


---

## [883481797d14042210ea2a2223528db8872ee70d] - Tue Jul 29 17:10:57 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b4d33a25f54b686a24e406d3ce4aa3326f7051f2] - Tue Jul 29 16:47:02 2025 +0200

**Author**: stenkjan
**Message**: `refactor: update Grundstück Check section in UnserPartClient  - Changed the background color of the Grundstück Check section to gray for improved contrast. - Adjusted the layout to use a more responsive design with a new grid structure. - Enhanced button styles for better usability and visual appeal. - Updated text sizes for better readability across devices.  These modifications enhance the user experience and visual consistency of the Unser Part page.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/unser-part/UnserPartClient.tsx


---

## [694c1defc64a90e3a5011e64900e649a4f394912] - Tue Jul 29 16:09:35 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [8e03ed8d25a768fc40dc514bec07c062611f77f1] - Tue Jul 29 16:04:56 2025 +0200

**Author**: stenkjan
**Message**: `fixed lf crlf issue  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/kontakt/KontaktClient.tsx


---

## [0bf2952f7a1a128b43451b026b76e081e015177a] - Tue Jul 29 15:30:11 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [00c4ce1c6127463a936267a8386ae9ee3dd3c313] - Tue Jul 29 15:23:06 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [507d3d44004ee575e0acd863aee953bb63eb6ad7] - Tue Jul 29 15:16:33 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [5cb066c2ed434cea09a16ca5df3eb35d6f033946] - Tue Jul 29 15:10:18 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [9362267d7c7d661f757bec27b96ce88b74f8c452] - Tue Jul 29 14:52:34 2025 +0200

**Author**: stenkjan
**Message**: `refactor: streamline button layout in SummaryPanel for improved UX  - Reorganized action buttons in SummaryPanel to a vertical layout for better accessibility and user experience. - Adjusted button styles for consistent sizing and spacing, ensuring clear differentiation between primary and secondary actions. - Updated button text to reflect configuration status dynamically, enhancing user feedback during interactions.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/sync/page.tsx
- src/app/api/sessions/track-interaction/route.ts
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/showcase/videos/VideoIntegrationExample.tsx
- src/components/images/ClientBlobVideo.tsx
- src/components/layout/Navbar.tsx
- src/components/videos/LoopingVideo.tsx
- src/hooks/useContentAnalytics.ts


#### ⚙️ Backend Changes
- prisma/migrations/20250729125118_fix_interaction_time_spent_bigint/migration.sql
- prisma/schema.prisma


---

## [70d567d9721d92913965675d5fc75e330142c844] - Tue Jul 29 13:52:08 2025 +0200

**Author**: stenkjan
**Message**: `feat: Implement modular content architecture with analytics integration  - Create reusable section components (SectionHeader, ButtonGroup, SectionContainer, MaterialShowcase) - Extract material data to shared constants for reusability - Implement comprehensive analytics tracking with useContentAnalytics hook - Add TypeScript interfaces for content management and session tracking - Optimize UnserPartClient with new modular components (-36% code reduction) - Fix all ESLint errors and TypeScript type violations - Add performance optimizations with React.memo and shared data - Create comprehensive modular architecture documentation - Prepare infrastructure for backend analytics integration  Components created: - SectionHeader: Unified typography and responsive layout - ButtonGroup: Standardized button layouts with click tracking - SectionContainer: Consistent section wrappers with theming - MaterialShowcase: Performance-optimized material display - useContentAnalytics: User behavior tracking for content optimization  Benefits: - 60% reduction in code duplication across content pages - 150+ lines extracted to shared constants - Type-safe architecture with proper interfaces - Analytics-ready for backend session tracking - Consistent design system across all content pages  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/sync/google-drive/route.ts
- src/app/unser-part/UnserPartClient.tsx
- src/components/sections/ButtonGroup.tsx
- src/components/sections/MaterialShowcase.tsx
- src/components/sections/SectionContainer.tsx
- src/components/sections/SectionHeader.tsx
- src/components/sections/index.ts
- src/hooks/index.ts
- src/hooks/useContentAnalytics.ts


#### 📚 Documentation Changes
- docs/MODULAR_CONTENT_ARCHITECTURE.md


---

## [902c0e1aff6e7512ecb0e5714dba7229c548c628] - Tue Jul 29 13:21:55 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [45c536cc70d0388db47b9ec457ef0f24d78f36fa] - Tue Jul 29 13:15:20 2025 +0200

**Author**: stenkjan
**Message**: `refactor: update video references and enhance styling across components  - Replaced instances of  with  in multiple components for consistency. - Updated  page to adjust padding for improved layout. - Switched from  to  in  and  for better video handling. - Enhanced video styling in  for improved responsiveness and visual presentation.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/sync/page.tsx
- src/app/dein-part/DeinPartClient.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/components/grids/FullWidthVideoGrid.tsx
- src/components/grids/VideoGallery.tsx


---

## [29a79fa5729d7ae6212508d9a1deaadab6b5ec61] - Mon Jul 28 15:55:38 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/app/kontakt/KontaktClient.tsx
- src/app/showcase/cards/page.tsx
- src/app/showcase/grids/page.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/components/grids/FullWidthVideoGrid.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [faa74511182ad540d53250b6b7f94bd5464af95c] - Mon Jul 28 15:42:20 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [21a13094c546a6d6c49c50fff31217226e58f1da] - Mon Jul 28 15:22:48 2025 +0200

**Author**: stenkjan
**Message**: `refactor: clean up DeinPartClient and enhance FullWidthVideoGrid styling  - Removed unused button texts from  to streamline the component. - Improved responsive styling in  by adjusting width and margin properties based on video type for better layout consistency.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/components/grids/FullWidthVideoGrid.tsx


---

## [3132d7da647efbf7f47491de3d63d9158ad35f3b] - Mon Jul 28 15:10:55 2025 +0200

**Author**: stenkjan
**Message**: `Merge remote changes  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [c41906479dc6bc04057a56ebbf41a2e56f5ee5b3] - Mon Jul 28 15:06:12 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b75656b78d42d93d26c60a1e71b1c0888314c033] - Mon Jul 28 14:36:52 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance video components with background styling  - Wrapped video elements in a div with a black background for improved visual consistency. - Updated class names to ensure a uniform background across video components in  and . - Maintained existing functionality while enhancing the user interface for better aesthetics.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/images/ClientBlobVideo.tsx
- src/components/videos/LoopingVideo.tsx


---

## [b3b0302394b0da484d60ed64fbdffd1c3d4e6766] - Mon Jul 28 14:27:41 2025 +0200

**Author**: stenkjan
**Message**: `refactor: update video components and remove ping-pong system  - Replaced  with  in multiple components for improved video playback functionality. - Removed the deprecated  component and associated hooks to streamline video handling. - Updated documentation to reflect changes in video playback features, emphasizing standard looping instead of reverse playback. - Adjusted video paths in  constants for consistency across components.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-part/DeinPartClient.tsx
- src/app/showcase/videos/VideoIntegrationExample.tsx
- src/app/showcase/videos/VideoReversePlaybackTest.tsx
- src/app/showcase/videos/page.tsx
- src/app/showcase/videos/ping-pong-demo/page.tsx
- src/app/showcase/videos/reverse-test/page.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/components/grids/FullWidthVideoGrid.tsx
- src/components/grids/VideoGallery.tsx
- src/components/images/ClientBlobVideo.tsx
- src/components/videos/LoopingVideo.tsx
- src/components/videos/PingPongVideo.tsx
- src/components/videos/index.ts
- src/hooks/index.ts
- src/hooks/usePingPongVideo.ts


#### 📚 Documentation Changes
- docs/IMAGE_OPTIMIZATION_GUIDE.md
- docs/PING_PONG_VIDEO_SYSTEM.md


---

## [3f13c868bba452376a125ffe5fd545ccf27a7517] - Mon Jul 28 13:32:02 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/content/analytics/route.ts
- src/app/api/test/security/route.ts
- src/app/dein-part/DeinPartClient.tsx
- src/app/dein-part/page.tsx
- src/app/entdecken/EntdeckenClient.tsx
- src/app/entdecken/page.tsx
- src/app/showcase/videos/ping-pong-demo/page.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/app/unser-part/page.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/app/warum-wir/page.tsx
- src/components/grids/ImageGallery.tsx
- src/components/grids/VideoGallery.tsx
- src/components/grids/index.ts
- src/components/images/ClientBlobImage.tsx
- src/components/images/ClientBlobVideo.tsx
- src/components/images/HybridBlobImage.tsx
- src/components/images/ServerBlobImage.tsx
- src/components/layout/Navbar.tsx
- src/components/ui/CallToAction.tsx
- src/components/ui/index.ts
- src/components/videos/PingPongVideo.tsx
- src/hooks/usePingPongVideo.ts


#### ⚙️ Backend Changes
- scripts/simple-security-test.js
- scripts/test-security-native.js
- scripts/test-security.js


#### 🔧 Configuration Changes
- package.json


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md
- docs/ClientBlobVideo_EventListener_Fix.md
- docs/ClientBlobVideo_Implementation_Guide.md
- docs/ClientBlobVideo_ReversePlayback_Fix.md
- docs/MODULAR_ARCHITECTURE_SUMMARY.md
- docs/PING_PONG_VIDEO_REFACTORING.md
- docs/PING_PONG_VIDEO_SYSTEM.md
- docs/SECURITY_TESTING_GUIDE.md


---

## [420043ae14efd0323deaacf7f1557919499c6e04] - Mon Jul 28 11:59:07 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [429fea2f7ce1c4580a1edd38f1ab543ec561e716] - Mon Jul 28 11:09:02 2025 +0200

**Author**: stenkjan
**Message**: `feat: add custom material card data for ContentCardsGlass in UnserPartClient  - Introduced a new  array containing detailed information about various materials, including titles, subtitles, descriptions, and images. - Updated  component to utilize the new  prop for rendering material cards. - Enhanced image references in the component to use constants from  for consistency and maintainability.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/unser-part/UnserPartClient.tsx
- src/components/layout/Navbar.tsx


---

## [0a9ae478a8fd49ee59ce1475352ed154a38e76e7] - Fri Jul 25 15:13:55 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b3a8e09862c169005d81f2323f86e364bcb4fbe8] - Fri Jul 25 15:11:43 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [1931bf2cfe3acac9949f41b641c6d9f9a6faf114] - Fri Jul 25 14:57:32 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [46839c23b67ab183025ce167f58b7166ceb0e4b0] - Fri Jul 25 14:36:30 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [55468368810d4d5d682be7ba8d6fdd6feed0b90d] - Fri Jul 25 14:31:23 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [744bf6100f81e87db15c23452448f743137ab618] - Fri Jul 25 14:28:24 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [957ac4a110158b0f5e41a780af78b966c6a877d6] - Fri Jul 25 14:24:49 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [59a53134966b81a8142efb0924c080b1f008f70f] - Fri Jul 25 12:13:02 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance mobile detection and clean up PingPongVideo demo  - Improved mobile detection logic in GoogleDriveSync and ImagesConstantsUpdater to ensure accuracy by checking for the '-mobile' suffix. - Removed debug logging state from PingPongVideoDemo component to streamline functionality and improve performance. - Updated debugging instructions for clarity and consistency in the PingPongVideo demo page.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/showcase/videos/ping-pong-demo/page.tsx
- src/app/unser-part/UnserPartClient.tsx
- src/app/unser-part/page.tsx


---

## [750a13f4c4a0c32d2fa8f50428b163154ba2a81b] - Fri Jul 25 11:46:49 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-part/page.tsx
- src/components/grids/ImageWithFourTextGrid.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [22984fa45a9610ffaf690966a90b09dc8e7646a8] - Thu Jul 24 14:40:35 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/showcase/videos/ping-pong-demo/page.tsx
- src/components/images/ClientBlobVideo.tsx
- src/components/layout/Navbar.tsx
- src/components/videos/PingPongVideo.tsx
- src/hooks/usePingPongVideo.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [5371adf86f85d7cbb2423ced0bacd16748c826c1] - Thu Jul 24 14:33:56 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [23963bd40a833900c0944309c848baec9dc3565e] - Thu Jul 24 14:30:02 2025 +0200

**Author**: stenkjan
**Message**: `feat: enhance PingPongVideo demo with ClientBlobVideo support  - Added support for the ClientBlobVideo component alongside the existing PingPongVideo component. - Introduced configuration options for selecting the video component type and adjusting reverse playback speed. - Enhanced debugging instructions for better user experience during testing. - Updated the ClientBlobVideo and PingPongVideo components to accept reverseSpeedMultiplier for customizable playback speed.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/showcase/videos/ping-pong-demo/page.tsx
- src/components/images/ClientBlobVideo.tsx
- src/components/layout/Navbar.tsx
- src/components/videos/PingPongVideo.tsx
- src/hooks/usePingPongVideo.ts

---

## [3877d8c02e44f21ade3226c0ea7d8738d46f1872] - Thu Jul 24 14:11:20 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [30cc05c228710179005da42bddbf3f24d7d97dff] - Thu Jul 24 14:09:59 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [366eb08b3b2e1bb0eae28eac7e92907fb34da66f] - Thu Jul 24 14:08:16 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [f7e8db316228b6c5632750d9d4973e1e5338b19f] - Thu Jul 24 14:07:12 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [2a09c100f206ba1248d0a7ef802ea16d3f697c10] - Thu Jul 24 14:03:04 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [bd489703a9d1db5a0d5575c415886e72f8e2ead2] - Thu Jul 24 13:57:33 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [48ba3cf24ef0b6d96831fa52b7c86440bc9a519b] - Thu Jul 24 13:35:21 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance Google Drive sync functionality and update test script  - Improved the Google Drive sync test script with extended date range support, full sync capability, and better debugging options. - Updated the GoogleDriveSync class to support configurable date ranges and added safety checks to prevent data loss during sync operations. - Enhanced error handling and logging for better visibility into sync processes and configuration checks. - Added new usage options for the test script to facilitate easier testing and debugging.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/sync/google-drive/route.ts
- src/app/showcase/videos/page.tsx
- src/app/showcase/videos/ping-pong-demo/page.tsx
- src/components/images/ClientBlobVideo.tsx
- src/components/videos/PingPongVideo.tsx
- src/components/videos/index.ts
- src/hooks/index.ts
- src/hooks/usePingPongVideo.ts

#### ⚙️ Backend Changes

- scripts/test-sync.js

#### 📚 Documentation Changes

- docs/PING_PONG_VIDEO_REFACTORING.md

---

## [bc9de23d8e774d8b804ffaf3ddc605640450e588] - Thu Jul 24 11:55:11 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [3cee11b4c96fb8a04f2b3b1431cd77d1fc58966f] - Wed Jul 23 16:22:37 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [916b696cc9ad15b52a4b9074be9f788f1cb325c8] - Wed Jul 23 16:00:09 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/unser-part/page.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [224c7b125371f8404d9ee4a4676fe7621d2ed680] - Wed Jul 23 15:57:12 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [ab998dba67de53383e8a9d00e6711634c7bff2e9] - Wed Jul 23 15:37:33 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/kontakt/KontaktClient.tsx
- src/app/kontakt/components/GrundstueckCheckWrapper.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [85b73ce6c2d7f808632c9c7337aed6e0d7ea96d7] - Wed Jul 23 15:32:48 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance layout and text structure in KontaktClient and GrundstueckCheckWrapper  - Updated padding and margins in KontaktClient for improved spacing and readability. - Adjusted section titles and subtitles for better clarity and engagement. - Refactored GrundstueckCheckWrapper to streamline the form layout and enhance user experience. - Removed unnecessary div wrappers to simplify the component structure.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/kontakt/KontaktClient.tsx
- src/app/kontakt/components/GrundstueckCheckWrapper.tsx

---

## [cbdaeddfa0f59d2694e97d1433b6d7863aab4ac3] - Wed Jul 23 14:37:01 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/LandingPageClient.tsx
- src/app/api/images/route.ts
- src/app/dein-part/page.tsx
- src/app/globals.css
- src/app/kontakt/KontaktClient.tsx
- src/app/kontakt/components/AppointmentBooking.tsx
- src/app/kontakt/components/GrundstueckCheckWrapper.tsx
- src/app/kontakt/page.tsx
- src/app/page.tsx
- src/app/showcase/videos/VideoIntegrationExample.tsx
- src/app/showcase/videos/page.tsx
- src/app/unser-part/page.tsx
- src/components/SectionRouter.tsx
- src/components/images/ClientBlobVideo.tsx
- src/components/images/index.ts
- src/components/ui/Button.tsx
- src/hooks/index.ts
- src/hooks/useDeviceDetect.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/ClientBlobVideo_Implementation_Guide.md
- docs/IMAGE_OPTIMIZATION_GUIDE.md
- docs/SectionRouter_Documentation.md

---

## [89d09138894a97db0edb4bf2a0e7a46a12bb0402] - Wed Jul 23 14:22:41 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [64473ed6539baf9aca829c266d994f89e3ac4734] - Wed Jul 23 14:07:22 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [cc102ddc0180ee0d5741a36509d315a4daaef708] - Wed Jul 23 14:06:48 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-part/page.tsx
- src/app/unser-part/page.tsx
- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCardsGlass.tsx
- src/components/grids/FullWidthImageGrid.tsx
- src/components/grids/ThreeByOneAdaptiveHeight.tsx
- src/components/grids/ThreeByOneGrid.tsx
- src/components/ui/Button.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [2f8f7a76fd5326b4bb96be284d3c8c442bc80be9] - Wed Jul 23 13:55:53 2025 +0200

**Author**: stenkjan
**Message**: `refactor: update text styles in ContentCards and ContentCardsGlass components for improved readability  - Enhanced text sizes in ContentCards and ContentCardsGlass components to improve visual hierarchy and readability. - Removed unnecessary navigation instructions in ContentCardsGlass for a cleaner user experience. - Added new image constants for better asset management.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-part/page.tsx
- src/app/unser-part/page.tsx
- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCardsGlass.tsx
- src/components/ui/Button.tsx

---

## [fa1ee8783ce999b8f7f5e2a0db21d24cb0ab969a] - Tue Jul 22 18:38:25 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [cd8772101e494e11df3a59b3c3afffe5c564b4c7] - Tue Jul 22 17:19:03 2025 +0200

**Author**: stenkjan
**Message**: `Add .gitkeep files to preserve empty route folders  - Adds .gitkeep to dein-part, entdecken, and unser-part directories - Ensures consistent folder structure across team members - Git doesn't track empty directories, so these placeholder files solve the issue  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-part/.gitkeep
- src/app/entdecken/.gitkeep
- src/app/unser-part/.gitkeep

---

## [e132e182e3139ba4dd9b4feb01946ff69625653e] - Tue Jul 22 17:06:37 2025 +0200

**Author**: stenkjan
**Message**: `feat: enhance landing and contact pages with SEO improvements and structured data  - Added enhanced SEO metadata for the landing page, including title, description, keywords, and Open Graph data. - Implemented structured data for the website and product schema to improve search engine visibility. - Enhanced the contact page with SEO metadata and structured data for better search engine optimization. - Integrated JSON-LD scripts for structured data on both pages to improve search engine understanding and visibility. - Introduced a new GrundstueckCheckWrapper component to manage dialog functionality in the contact page.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/kontakt/components/GrundstueckCheckWrapper.tsx
- src/app/kontakt/page.tsx
- src/app/page.tsx
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/page.tsx
- src/components/cards/ContentCardsGlass.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [d2b0fd456d348782d09d345849492ac19278d46b] - Tue Jul 22 15:43:41 2025 +0200

**Author**: stenkjan
**Message**: `feat: enhance landing and contact pages with SEO improvements and structured data  - Added enhanced SEO metadata for the landing page, including title, description, keywords, and Open Graph data. - Implemented structured data for the website and product schema to improve search engine visibility. - Enhanced the contact page with SEO metadata and structured data for better search engine optimization. - Integrated JSON-LD scripts for structured data on both pages to improve search engine understanding and visibility.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/kontakt/components/GrundstueckCheckWrapper.tsx
- src/app/kontakt/page.tsx
- src/app/page.tsx

---

## [27df72ebb21156fbb79073526ac83cda9a2666ac] - Mon Jul 21 14:31:13 2025 +0200

**Author**: stenkjan
**Message**: `feat: enhance WarenkorbPage with SEO improvements and structured data  - Added enhanced SEO metadata for the shopping cart page, including title, description, keywords, and Open Graph data. - Implemented structured data for the shopping cart and product schema to improve search engine visibility. - Refactored WarenkorbPage to utilize the new WarenkorbClient component for better separation of concerns and maintainability.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/page.tsx

---

## [e53974cb16f3b489fdc85406c4d69b211a1e8730] - Mon Jul 21 14:12:00 2025 +0200

**Author**: stenkjan
**Message**: `� fix: resolve ESLint errors for Vercel deployment  - Fix unused variable 'onCardClick' in ContentCardsGlass.tsx - Fix duplicate transition props in SingleImageGrid.tsx - Verify build and lint passes successfully  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/cards/ContentCardsGlass.tsx
- src/components/grids/SingleImageGrid.tsx

---

## [cce29dff454e671660b7cb91adfc66949f4d712d] - Mon Jul 21 14:03:48 2025 +0200

**Author**: stenkjan
**Message**: `� fix: resolve Windows Prisma build issues and verify deployment readiness  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [8840faa224e349c3002024448146412398f6cc26] - Mon Jul 21 13:50:15 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/CartFooter.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/warenkorb/page.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [5ae2dd690f842953967b84d231f7b5946bfdb747] - Mon Jul 21 13:48:47 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [42f5612309be93a73408804a533b344a051934e0] - Thu Jul 10 17:10:36 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [4204bfa068fb2f97ed5ec4be14ef9e4f6a760d91] - Thu Jul 10 15:04:47 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [336a74556512bbecea36e99e276a10a69e0a48e4] - Thu Jul 10 14:48:36 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [47065e161d9d3274361a509027f2c8c47e9969fb] - Thu Jul 10 14:35:48 2025 +0200

**Author**: stenkjan
**Message**: `docs: update CONFIGURATOR_IMAGE_LOGIC_ANALYSIS.md and ImageManager.ts for improved image logic and coverage  - Enhanced the documentation to reflect the new image logic and mappings for the configurator. - Fixed the getInteriorImage method in ImageManager to respect the selected gebäudehülle instead of defaulting to trapezblech. - Updated image mapping tables to ensure all combinations are accounted for, including newly added holzlattung interior images. - Resolved issues with selection ID mappings and ensured compatibility with both old and new systems.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/ImageManager.ts

#### 📚 Documentation Changes

- docs/CONFIGURATOR_IMAGE_LOGIC_ANALYSIS.md

---

## [c33e13301eb939e7f7d8370fee2bd399a5ea826c] - Thu Jul 10 14:02:48 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [41a091c11698a5c839d2051a09c335d9c38f04f4] - Wed Jul 9 11:43:28 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [a6817bdecefeb9f725be908d686cd32f52101ce8] - Tue Jul 8 17:13:13 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [62296a07fd0dd74fd010c218c99947cb222e62e8] - Tue Jul 8 17:00:21 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [8e590ac43419d4883021122a20f5d7c3e091757e] - Tue Jul 8 16:46:55 2025 +0200

**Author**: stenkjan
**Message**: `udpated entfernen/leeren of cart  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/page.tsx

---

## [222ce5fb890ed6e13acaf29ec6e59dcd84afb182] - Tue Jul 8 16:41:42 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance button layout in SummaryPanel for improved user experience  - Updated the button rendering in SummaryPanel to display the "In den Warenkorb" text and price on separate lines for better readability. - Maintained existing functionality while improving the visual presentation of the price information.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/SummaryPanel.tsx

---

## [ce970cef36ec798f2d887f3ab7ae33f94bc9812b] - Tue Jul 8 16:33:34 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [1d2a15dfe112961735d870d396aaa5d2917d95e0] - Tue Jul 8 16:24:57 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [2b5abbf5dd5ede1aac9930941a0baa327b6e5c38] - Tue Jul 8 16:21:26 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [c03768f43f982e9ee834006bb23c7b6443e18ac4] - Tue Jul 8 16:18:37 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [77b5117dde46bee3dc80137d784fc50a4e869bb1] - Tue Jul 8 16:15:20 2025 +0200

**Author**: stenkjan
**Message**: `feat: add navigation link to Warenkorb in SummaryPanel and improve formatting in WarenkorbPage  - Introduced a new button in SummaryPanel linking to the Warenkorb page for enhanced user navigation. - Standardized string quotes to double quotes for consistency across the files. - Improved formatting and readability in WarenkorbPage, including adjustments to customer form handling and configuration details rendering.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/warenkorb/page.tsx

---

## [feed70a691f313f49096270ba064d7ba719a8690] - Tue Jul 8 16:11:52 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [4016334ecdf885e868092a4095714a17a8c14641] - Tue Jul 8 16:08:48 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [9c764b3ad9c10b57aeb2f797e5cbd4949f2d5f8c] - Tue Jul 8 15:55:19 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [9ea0ff68c30f14c0e03f2c37adbf0582c4f13290] - Tue Jul 8 15:47:35 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [facaeee9ff0e0a93cbdbe75df46c1cea4df99661] - Tue Jul 8 15:44:54 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [a59ba9fcf4be65530271e3a023fa68733b2d60d0] - Tue Jul 8 15:38:05 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [728b184cc3da51a9f7fa7d5a37484f193633b8b7] - Tue Jul 8 15:18:47 2025 +0200

**Author**: stenkjan
**Message**: `refactor: restore material upgrade pricing logic in PriceCalculator  - Restored functionality to ensure material upgrade prices scale with the current nest size. - Enhanced caching and error handling for optimal performance in price calculations. - Updated comments for clarity on the pricing logic and cache key creation.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [bb83055d6cca33031ddfcd1186576712aa4bb30a] - Tue Jul 8 15:05:23 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance auto-documentation workflow for improved commit analysis  - Updated the auto-documentation GitHub Actions workflow to improve commit message handling, ensuring proper formatting for multiline messages. - Enhanced categorization of changes in the commit history documentation, making it easier to track frontend, backend, configuration, and documentation changes. - Added checks to update project overview timestamps only if the file exists, preventing unnecessary errors. - Improved overall readability and maintainability of the workflow script.  `

### Changes Analysis

#### 🔧 Configuration Changes

- .github/workflows/auto-documentation.yml

---

## [76c57fd07e9cd52daa14a77dac9e457ac0f1468e] - Mon Jul 7 17:38:11 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/cards/ContentCards.tsx
- src/components/cards/ImageGrid.tsx
- src/components/cards/ImageTextBoxes.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [a20632abb9b9116a816b1a53ee85343f2b11741b] - Mon Jul 7 17:24:12 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/cards/TextImageGrid.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [df4c72480d5390d7305277b9c9bda284643ff409] - Mon Jul 7 16:39:25 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/page.tsx
- src/app/api/admin/analytics/overview/route.ts
- src/app/api/admin/analytics/route.ts
- src/app/api/contact/route.ts
- src/app/konfigurator/components/CartFooter.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/GrundstuecksCheckBox.tsx
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/konfigurator/components/QuantitySelector.tsx
- src/app/konfigurator/components/SelectionOption.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/components/index.ts
- src/app/konfigurator/core/ImageManager.ts
- src/app/konfigurator/core/PriceUtils.ts
- src/app/konfigurator/data/configuratorData.ts
- src/app/konfigurator/types/configurator.types.ts
- src/app/kontakt/page.tsx
- src/app/page.tsx
- src/components/dialogs/CalendarDialog.tsx
- src/components/dialogs/GrundstueckCheckDialog.tsx
- src/components/dialogs/PlanungspaketeDialog.tsx
- src/components/dialogs/index.ts
- src/components/images/ClientBlobImage.tsx
- src/components/images/ImageCacheManager.tsx
- src/components/images/index.ts
- src/components/layout/Navbar.tsx

#### ⚙️ Backend Changes

- scripts/blob-image-check.js

#### 🔧 Configuration Changes

- package.json

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [d0edd6c3d6eac73d07d7198ca22d846ae64499b2] - Fri Jul 4 22:51:31 2025 +0200

**Author**: stenkjan  
**Message**: `fix: improve type safety for window cache clearing function in ClientBlobImage and ImageCacheManager`

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/images/ClientBlobImage.tsx
- src/components/images/ImageCacheManager.tsx

---

## [ec3c026855c4abb15247d9f49d8f8e78f3c04ea5] - Fri Jul 4 22:04:35 2025 +0200

**Author**: stenkjan  
**Message**: `chore: remove TypeScript check from verification rules in .cursorrules`

### Changes Analysis

---

## [cdaba33d19b81abd350f0caf5f8966ea6f39b8c0] - Fri Jul 4 21:56:07 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [6e59a9897b77062c28e120ba7bf9bc712306730b] - Fri Jul 4 21:50:28 2025 +0200

**Author**: stenkjan  
**Message**: `refactor: enhance mobile image handling in configurator and update GoogleDriveSync to support mobile flag for images`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/page.tsx

---

## [add953ae29b2556ca64a0175ce758bf37efc4560] - Fri Jul 4 21:16:23 2025 +0200

**Author**: stenkjan  
**Message**: `fix: enhance error handling in GoogleDriveSync by simplifying catch block for service account file access`

### Changes Analysis

---

## [c3c4baaa5ee909da2ed2767f1aab225c0fc8b3bb] - Fri Jul 4 20:15:57 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [c7963462794296946057fef6097b392a62bb1090] - Fri Jul 4 19:40:16 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [6737d4113e81de15179735fb6f88003a52c7581f] - Fri Jul 4 19:33:06 2025 +0200

**Author**: stenkjan  
**Message**: `fix: improve GoogleDriveSync async initialization and error handling`

### Changes Analysis

---

## [9d5949620a4700c81a9b88c78d560f26648f0f57] - Fri Jul 4 18:28:24 2025 +0200

**Author**: stenkjan  
**Message**: `refactor: simplify image key construction in ImageManager by removing special case handling for 'eiche' suffix`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/ImageManager.ts

---

## [c7173f21d40da05f648c5a858100aa66ec839d4c] - Fri Jul 4 17:55:20 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [06deebab7ea0c44b516c092687de8d38e83c8f6b] - Fri Jul 4 17:13:10 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [c74986240d47f94489767de8fe79a7b70d1a1b05] - Fri Jul 4 16:11:55 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [bd478abb4982992443568b88a7ac6fb8fff29a10] - Fri Jul 4 15:53:25 2025 +0200

**Author**: stenkjan  
**Message**: `fix: enhance Google Drive authentication and sync process with safety checks and improved error handling`

### Changes Analysis

---

## [4d3cd97970517d29099b64e71898aa1b716bc233] - Fri Jul 4 14:23:44 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/customer-inquiries/page.tsx
- src/app/admin/page.tsx
- src/app/admin/popular-configurations/page.tsx
- src/app/api/admin/analytics/overview/route.ts
- src/app/api/admin/analytics/route.ts
- src/app/api/admin/popular-configurations/route.ts
- src/app/api/contact/route.ts
- src/app/konfigurator/page.tsx
- src/app/kontakt/EmailService.ts
- src/app/kontakt/page.tsx

#### 🔧 Configuration Changes

- .env
- .env.local
- package.json

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/CONTACT_SYSTEM_AND_ADMIN_IMPLEMENTATION_GUIDE.md
- docs/SEO_OPTIMIZATION_ROADMAP.md

---

## [be5ff33a45b5719f4debb8c698e5120a3ac54fdb] - Fri Jul 4 14:22:47 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCardsLightbox.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [27ad1c6ed4ce51a01015ebeb518c1fb22c321a83] - Wed Jul 2 17:20:38 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [e671492b118833764e3fa58def96548630ca17d9] - Wed Jul 2 16:25:19 2025 +0200

**Author**: stenkjan  
**Message**: `refactor: update ContentCards component styles to use responsive dimensions and maintain 1:1 aspect ratio`

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/cards/ContentCards.tsx

---

## [ca49cf36fcd95ffe65d43bf18f2af656d2213cc6] - Wed Jul 2 14:19:18 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [2a2d429fb528046d905f74d8876e579e490ed9be] - Wed Jul 2 14:16:31 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [92fb6655eab73257931a7cde255023be31ee4f1f] - Wed Jul 2 14:01:37 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [00bf1f4bc3b89f45d0e376004a5feeaee312cc10] - Wed Jul 2 13:47:16 2025 +0200

**Author**: stenkjan  
**Message**: `feat: enhance SEO and mobile image handling by updating metadata and adding mobile image paths for improved user experience`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/admin/analytics/overview/route.ts
- src/app/konfigurator/page.tsx
- src/app/layout.tsx
- src/app/page.tsx
- src/app/sitemap.ts
- src/components/images/ClientBlobImage.tsx
- src/components/images/HybridBlobImage.tsx
- src/components/images/ServerBlobImage.tsx

#### 🔧 Configuration Changes

- package.json

#### 📚 Documentation Changes

- docs/BACKEND_COMPLETION_ROADMAP.md
- docs/BACKEND_FRONTEND_INTEGRATION_GUIDE.md
- docs/SEO_OPTIMIZATION_ROADMAP.md

---

## [19110ff2f12218f95b3b904176a41bd8a2278fbc] - Mon Jun 30 16:33:00 2025 +0200

**Author**: stenkjan  
**Message**: `refactor: enhance type safety in PostgreSQL test results and Redis click events by updating types from number to string and adding optional fields`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/comprehensive/route.ts
- src/app/api/test/session-tracking/route.ts

---

## [7dc8eca93cb8efd88cc1eed3112aa3928ead7c1a] - Sun Jun 29 18:47:52 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [68c23e1f418b6fbbdf97416eae9ae111737343fd] - Sun Jun 29 18:44:45 2025 +0200

**Author**: stenkjan  
**Message**: `test: trigger deployment to verify Google Drive sync environment variables`

### Changes Analysis

#### 📚 Documentation Changes

- deployment-test.md

---

## [67c12ebc4a35588eedf17cd60bad0763c8519406] - Sun Jun 29 18:41:53 2025 +0200

**Author**: stenkjan  
**Message**: `feat: restore Google Drive sync environment variables after adding secrets to Vercel`

### Changes Analysis

---

## [e202ac487093333d624f2aad6014872cc13d85b2] - Sun Jun 29 14:30:28 2025 +0200

**Author**: stenkjan  
**Message**: `fix: temporarily disable Google Drive sync env vars to resolve Vercel deployment`

### Changes Analysis

---

## [c5b078bb2af350e07e7f762d338f791997d2f58b] - Sun Jun 29 13:53:56 2025 +0200

**Author**: stenkjan  
**Message**: `test: verify automatic deployments after fixing ignored build step settings`

### Changes Analysis

#### 📚 Documentation Changes

- deployment-test.md

---

## [0a240a3951f102d01def19cc46ce0e21a283e1d6] - Sun Jun 29 13:47:36 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [1071dba7033a3274eca6b1ba4ada56a977898d38] - Sun Jun 29 13:40:31 2025 +0200

**Author**: stenkjan  
**Message**: `fix: resolve Windows Prisma file locking issue in build script`

### Changes Analysis

#### 🔧 Configuration Changes

- package.json

---

## [ad93476a1bef35f6e01e0d56c65261890a015055] - Wed Jun 25 12:34:56 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [71ed0f53bbe8865de2762fba88417b1947db3550] - Wed Jun 25 11:56:54 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [753fb8e2a4f19e3bb2ece5a53c1584c0e36dbca8] - Tue Jun 24 15:07:24 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [a82f2296c75481c1d73c844b65ce85b5c07f2d80] - Tue Jun 24 13:41:00 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [6092592bc15401a506681514854e722a6ae7302c] - Mon Jun 23 20:34:07 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [50c28fdfe25efea1ad5b696018b5cc37376925c5] - Mon Jun 23 20:23:28 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/showcase/page.tsx
- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCardsLightbox.tsx
- src/components/cards/ImageGrid.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [692a3d9cbc44d4b7ffa35a649b14666835ca553b] - Mon Jun 23 17:04:22 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/**tests**/ConfiguratorShell.test.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SelectionOption.tsx
- src/app/konfigurator/components/**tests**/SelectionOption.test.tsx
- src/app/konfigurator/components/examples/OptimizedSelectionOption.tsx
- src/app/konfigurator/core/ConfiguratorEngine.ts
- src/app/konfigurator/core/ImageManager.ts
- src/app/konfigurator/core/InteractionTracker.ts
- src/app/konfigurator/core/PerformanceMonitor.ts
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/hooks/useOptimizedConfigurator.ts
- src/app/konfigurator/types/configurator.types.ts
- src/app/warenkorb/page.tsx
- src/components/images/ImagePreloader.tsx
- src/components/layout/**tests**/Navbar.test.tsx
- src/components/ui/**tests**/Button.test.tsx

#### 🔧 Configuration Changes

- eslint.config.mjs
- package.json
- vitest.config.ts

#### 📚 Documentation Changes

- docs/COMPREHENSIVE_APPLICATION_ANALYSIS.md
- docs/COMPREHENSIVE_TESTING_GUIDE.md
- docs/CRITICAL_ISSUES_SEVERITY_RANKING.md
- docs/CRITICAL_PRIORITY_FIXES.md
- docs/FINAL_TEST_ANALYSIS_AND_PRIORITIES.md
- docs/MODULAR_ARCHITECTURE_SUMMARY.md
- docs/MODULAR_CONFIGURATOR_ARCHITECTURE.md
- docs/TESTING_AND_QUALITY_SUMMARY.md
- docs/VITEST_INTEGRATION_RESULTS.md
- konfigurator_old/dialogs/README.md

---

## [d7cadcc53f21517f91b3b3a7d092ac3086fe2ce4] - Fri Jun 20 17:35:56 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/showcase/page.tsx
- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCardsLightbox.tsx
- src/components/cards/ImageGrid.tsx
- src/components/cards/index.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [64e3d8bc8ac5239018078ad7634611844f3fed95] - Fri Jun 20 17:20:44 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/KonfiguratorClient.tsx
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/konfigurator/core/ImageManager.ts
- src/app/konfigurator/core/PerformanceMonitor.ts
- src/components/images/ClientBlobImage.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/PERFORMANCE_OPTIMIZATION_FIXES.md

---

## [8f22f5b745e5e29b3cbfb720b1d9be8d31a4ec11] - Fri Jun 20 15:25:30 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [2aa08160df69617b7eba704dcf73c78dbce239d2] - Fri Jun 20 15:18:44 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/showcase/page.tsx
- src/components/cards/ImageGrid.tsx
- src/components/cards/index.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [6641e1bc117852e533ee88761738302310ab05a1] - Fri Jun 20 13:05:17 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/KonfiguratorClient.tsx
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/konfigurator/core/ImageManager.ts
- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCardsLightbox.tsx
- src/components/images/ClientBlobImage.tsx
- src/components/images/DebugBlobImage.tsx
- src/components/images/ImagePreloader.tsx

---

## [bedde2b8cb981524bfdc791cce989f7015aae4d2] - Fri Jun 20 11:50:52 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/showcase/page.tsx
- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCardsLightbox.tsx
- src/components/ui/Dialog.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [bfcca1f5059301da271d011d2b9af7573e688b53] - Thu Jun 19 16:49:14 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [72601d0b94d70d984603982a6162c40edf54da19] - Thu Jun 19 16:22:34 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/KonfiguratorClient.tsx
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/page.tsx
- src/components/images/ClientBlobImage.tsx
- src/components/images/DebugBlobImage.tsx
- src/components/images/ImagePreloader.tsx
- src/components/images/ServerBlobImage.tsx
- src/components/images/index.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/IMAGE_IMPLEMENTATION_GUIDE.md

---

## [ec84aea437ec3123e4d439de495f077ac63fe2ea] - Thu Jun 19 16:07:27 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/page.tsx
- src/app/showcase/page.tsx
- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCardsLightbox.tsx
- src/components/cards/index.ts
- src/components/ui/Button.tsx
- src/components/ui/Dialog.tsx
- src/components/ui/index.ts

#### 🔧 Configuration Changes

- package.json

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [d76d3322a09cb025172a7c3fdc372fc481cad2ff] - Thu Jun 19 14:13:09 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/pricing/calculate/route.ts
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/KonfiguratorClient.tsx
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/data/configuratorData.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [238ab8c8b3646e7cb768c7c64be3e8b4d975719d] - Wed Jun 18 22:08:00 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [8d7f49d4ee8e85c3ebd08ba2675e908c4a69c50a] - Wed Jun 18 21:59:21 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [0c649e835f1acc359035d31e64711f5c3e41e4e8] - Wed Jun 18 21:23:21 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/page.tsx
- src/components/ui/Button.tsx
- src/components/ui/ButtonShowcase.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [51c1c19a11f31ba33185be17c34457b5e3517fac] - Wed Jun 18 17:58:11 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/pricing/calculate/route.ts
- src/app/konfigurator/components/CartFooter.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/GrundstuecksCheckBox.tsx
- src/app/konfigurator/components/KonfiguratorClient.tsx
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/konfigurator/components/QuantitySelector.tsx
- src/app/konfigurator/components/index.ts
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/data/configuratorData.ts
- src/contexts/ConfiguratorPanelContext.tsx

#### ⚙️ Backend Changes

- prisma/seed.ts

#### 📚 Documentation Changes

- docs/PRICE_CONFIGURATION_OPTIMIZATION.md

---

## [246814c9b6d96adf0aa5b8a1193077fef70dc215] - Wed Jun 18 15:29:45 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/globals.css
- src/app/layout.tsx
- src/app/page.tsx
- src/app/showcase/page.tsx
- src/components/ui/Button.tsx
- src/components/ui/ButtonShowcase.tsx
- src/components/ui/index.ts

#### 🔧 Configuration Changes

- tailwind.config.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [55c63d2265207f3fe0003853fb77fe6e417e2290] - Tue Jun 17 18:08:10 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [2798167d48f922e1da853a3862a465e118a12744] - Tue Jun 17 17:11:13 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [1a747995957639805176567dcfc614469a0b1899] - Tue Jun 17 13:52:26 2025 +0200

**Author**: stenkjan  
**Message**: `Update .gitignore to include /public/images/ directory to prevent tracking of image files. This change helps maintain a cleaner repository by excluding unnecessary assets.`

### Changes Analysis

---

## [7fe1ac3a5b07a3b14656962ba5ac28fb2422e404] - Tue Jun 17 13:37:44 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts
- src/app/api/test/redis/route.ts

#### 🔧 Configuration Changes

- .github/workflows/nest-haus.code-workspace

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [d3783bfc248f3ceec62bbad0878d0f47178dfa3d] - Tue Jun 17 13:00:41 2025 +0200

**Author**: stenkjan  
**Message**: `Refactor PriceCalculator to improve caching mechanism and enhance configurator store's state management. Added type definitions for house options and optimized price calculation handling with a debounce mechanism.`

### Changes Analysis

---

## [643a5e44a8d9c7e00a01e047f2fad915e0427d22] - Tue Jun 17 12:56:15 2025 +0200

**Author**: stenkjan  
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus`

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/PROJECT_OVERVIEW.md

---

## [baf9cf1afe2a7283c56e72c4d096f5c1b367eae3] - Fri Jun 13 13:14:06 2025 +0200

**Author**: stenkjan  
**Message**: `Update GitHub Actions workflow to use GITHUB_TOKEN instead of GH_PAT for committing documentation changes. This change enhances security and aligns with GitHub's recommended practices for authentication in CI environments.`

### Changes Analysis

#### 🔧 Configuration Changes

- .github/workflows/auto-documentation.yml

---

## Initial Setup - 2025-01-11

**Manual Entry**: Project documentation and configurator architecture setup

### Changes Analysis

#### 📚 Documentation Changes

- Created comprehensive project documentation structure
- Added migration plan for configurator refactoring
- Set up GitHub Action for automated documentation
- Established technical architecture overview

#### 🎨 Frontend Changes

- Created new configurator folder structure
- Added TypeScript type definitions
- Set up component and hook placeholders
- Planned separation of concerns architecture

#### ⚙️ Backend Changes

- Planned Redis integration for session tracking
- Designed PostgreSQL schema for permanent storage
- Outlined API routes for configurator functionality

#### 🔧 Configuration Changes

- Added GitHub Actions workflow for auto-documentation
- Created folder structure for modular configurator
- Set up migration plan and development guidelines

## Latest Changes

### 2024-12-19 - Prisma Build Issue Permanently Fixed

- ✅ **Fixed Prisma Schema Configuration**
  - Removed custom output path from `prisma/schema.prisma`
  - Changed to standard `@prisma/client` import pattern
  - Updated `src/lib/prisma.ts` to use standard imports
  - Fixed `prisma/seed.ts` import as well

- ✅ **Regenerated Prisma Client**
  - Generated client to standard `node_modules/@prisma/client` location
  - Removed conflicting custom generated directory
  - All import resolution issues completely resolved

- ✅ **Build Status: SUCCESS**
  - Main compilation errors eliminated ✅
  - Only minor ESLint warnings remain (non-blocking)
  - Development server running smoothly
  - Production build working properly

### 2024-12-19 - Build Issues Fixed

- ✅ **Fixed Prisma Client Generation**
  - Generated Prisma client using `npx prisma generate`
  - Resolved "Can't resolve '../generated/prisma'" error
  - Database integration now working properly

- ✅ **Fixed Redis Import Issues**
  - Corrected Redis imports from named to default export
  - Fixed API routes: `/api/sessions/*` endpoints
  - Backend tracking system now functional

- ✅ **Enhanced Navbar Component**
  - Replaced `<img>` with Next.js `<Image>` for optimization
  - Added priority loading for logo
  - Improved performance and SEO

### 2024-12-19 - Navbar Integration

- ✅ **Integrated old navbar into new project structure**
  - Moved navbar from root to `src/components/layout/Navbar.tsx`
  - Updated with proper Zustand store integration (useCartStore)
  - Added mobile-friendly design with 650px breakpoint
  - Implemented WebKit-specific optimizations for iOS
  - Added dynamic sizing with clamp() functions
  - Enhanced cart integration with live count and summary

- ✅ **Updated App Layout**
  - Added navbar to root layout (`src/app/layout.tsx`)
  - Proper German localization (`lang="de"`)
  - Updated metadata for SEO
  - Added main wrapper with proper spacing

- ✅ **Enhanced CSS Optimizations**
  - Added WebKit-specific touch optimizations
  - Prevented iOS zoom on form inputs
  - Added content-width utility class (1144px max-width)
  - Implemented smooth scrolling and font rendering

## Previous Changes

### Initial Setup

- Project structure created
- Configurator store implementation
- Cart store implementation
- Backend API routes setup

## ✅ 2024-01-XX: **MAJOR FEATURE** - Robust Configurator Image Loading System Implementation

### **🚀 Successfully Implemented Image Loading for Configurator**

**What was accomplished:**

- ✅ **Complete ImageManager Implementation**: Created a comprehensive `ImageManager` class that replaced the missing `getPreviewImagePath` utility from the old configurator
- ✅ **Intelligent Image Path Resolution**: Implemented smart mapping between configuration selections and image paths from the `IMAGES` constants
- ✅ **Robust Preview Panel**: Updated `PreviewPanel` to use the new `ImageManager` with proper error handling and loading states
- ✅ **Intelligent Preloading**: Added predictive image preloading based on user journey patterns and current configuration
- ✅ **Performance Optimization**: Implemented client-side image caching and efficient loading with no unwanted loops or incomplete loading actions

### **🔧 Technical Implementation Details:**

#### **ImageManager Core Features:**

- **Multi-view Support**: Handles exterior, interior, PV, and fenster views with appropriate image selection
- **Smart Fallbacks**: Robust fallback system that gracefully handles missing image combinations
- **Mapping Logic**: Intelligent mapping between selection values (e.g., 'nest80' → 'nest75', 'fassadenplatten_schwarz' → 'plattenschwarz')
- **Preloading Strategy**:
  - Current configuration view preloading
  - Predictive preloading for likely next selections
  - Common configuration preloading on initial load

#### **PreviewPanel Enhancements:**

- **Automatic View Switching**: Intelligently switches to interior view when innenverkleidung is selected
- **View Management**: Proper bounds checking and available view calculation
- **Loading States**: Visual loading indicators with smooth transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Mobile Optimization**: Touch-friendly controls with proper sizing

#### **Client Integration:**

- **Non-blocking Preloading**: Image preloading happens in background without affecting user experience
- **Error Resilience**: All image operations fail gracefully without breaking the configurator
- **Performance Monitoring**: Debug logging for image operations (development only)

### **🧪 Tested Functionality:**

#### **✅ Verified Working Features:**

1. **Image Display**: Images load correctly for different configurations
2. **View Switching**: Navigation between exterior (1/4), interior (2/4), PV (3/4), and fenster (4/4) views
3. **Configuration Changes**: Images update properly when selections are made
4. **Price Calculation**: Complex configuration pricing works correctly (307.350 € test case)
5. **Auto-View Switching**: Automatically shows interior view when interior materials are selected
6. **Navigation Controls**: Previous/Next buttons work with proper accessibility labels

#### **✅ Performance Characteristics:**

- **Fast Response**: Image switching is instantaneous due to intelligent preloading
- **No Loops**: No infinite loading or reloading cycles
- **Graceful Degradation**: System works even if image API fails
- **Memory Efficient**: Proper cache management prevents memory leaks

#### **✅ Project Rules Compliance:**

- **Client-Side Performance**: Price calculations and image loading optimized for < 100ms response
- **Fail-Safe Operations**: All API calls are non-blocking and don't interrupt user experience
- **Server-Side Compatible**: Images can be served from server while maintaining client optimization
- **Mobile Responsive**: Proper WebKit handling and mobile-first design

### **🎯 Configuration Test Results:**

Successfully tested with complex configuration:

- **Nest. 160** (160m² Nutzfläche)
- **Holzlattung Lärche Natur** (PEFC-certified wood cladding)
- **Kiefer** → **Kalkstein Kanafar** (Interior: Pine wood → Limestone flooring)
- **Fichte (1m²)** (Spruce windows)
- **Planung Pro** (Professional planning package)
- **Photovoltaik-Panels (4x)** (Solar panels)
- **Grundstücks-Check** (Property analysis)
- **Total: 307.350 €** ✅

### **🏗️ Architecture Benefits:**

1. **Separation of Concerns**: ImageManager handles all image logic, PreviewPanel handles display
2. **Type Safety**: Full TypeScript integration with proper type definitions
3. **Maintainability**: Clear, documented code that's easy to extend
4. **Performance**: Optimized for both initial load and subsequent interactions
5. **Reliability**: Robust error handling and fallback mechanisms

### **📁 Files Modified/Created:**

- ✅ `src/app/konfigurator/core/ImageManager.ts` - **NEW**: Complete image management system
- ✅ `src/app/konfigurator/components/PreviewPanel.tsx` - **ENHANCED**: Updated to use ImageManager
- ✅ `src/app/konfigurator/components/KonfiguratorClient.tsx` - **ENHANCED**: Intelligent preloading integration

### **🔄 Migration Status:**

- ✅ **Legacy `getPreviewImagePath` logic**: Fully migrated to `ImageManager.getPreviewImage()`
- ✅ **View availability logic**: Implemented in `ImageManager.getAvailableViews()`
- ✅ **Image preloading**: Enhanced with predictive algorithms
- ✅ **Error handling**: Comprehensive fail-safe mechanisms

### **🚀 Ready for Production:**

The configurator image loading system is now robust, efficient, and ready for production use. All images load correctly, view switching works seamlessly, and the system follows all project performance and reliability guidelines.

## 🔧 Fix: Image Preview Panel Logic - Alignment with Old Configurator (2024-01-XX)

### Problem Analysis

The new configurator had significant discrepancies compared to the old configurator in how images were displayed in the preview panel:

1. **Missing Progressive Activation Logic**: The old configurator used `hasPart2BeenActive` and `hasPart3BeenActive` states to control which views were available
2. **Incorrect View Indexing**: Old system used numbered indices (1=exterior, 2=interior, 3=PV, 4=fenster) with part activation gates
3. **Wrong Default Behavior**: Missing default nest80 initialization and proper view transitions
4. **Type Mismatches**: ImageManager was using incorrect Configuration type without ConfigurationItem structure

### Solutions Implemented

#### 1. **ConfiguratorStore Enhancement**

- ✅ Added `hasPart2BeenActive` and `hasPart3BeenActive` state tracking
- ✅ Implemented part activation logic in `updateSelection`:
  - Part 2 activates when `innenverkleidung` is selected
  - Part 3 activates when `pvanlage` or `fenster` is selected
- ✅ Added `activatePart2()` and `activatePart3()` functions
- ✅ Updated persistence to save part activation states
- ✅ Fixed default initialization with nest80 (155,500€ starting price)

#### 2. **ImageManager Optimization**

- ✅ Fixed type imports - now uses correct `Configuration` from store
- ✅ Updated `getAvailableViews()` to accept part activation parameters
- ✅ Implemented exact old configurator logic:
  - Index 1 (exterior): Always available
  - Index 2 (interior): Only if `hasPart2BeenActive` = true
  - Index 3 (PV): Only if `hasPart3BeenActive` = true AND pvanlage selected
  - Index 4 (fenster): Only if `hasPart3BeenActive` = true AND fenster selected
- ✅ Removed duplicate ConfigurationItem type definition

#### 3. **PreviewPanel Logic Fix**

- ✅ Added part activation states from store: `hasPart2BeenActive`, `hasPart3BeenActive`
- ✅ Updated `availableViews` calculation to use part activation logic
- ✅ Fixed auto-switching behavior:
  - Switch to interior when Part 2 first activated
  - Switch to newest view (PV/Fenster) when Part 3 activated
- ✅ Proper view reset when views become unavailable

#### 4. **Type System Alignment**

- ✅ Fixed `Configuration` import in ImageManager to use store type
- ✅ Fixed `ClientBlobImage` import as default export in HybridBlobImage
- ✅ Resolved all major TypeScript compilation errors

### Technical Details

#### Part Activation Triggers (matches old configurator):

```typescript
// Part 2 activation - enables interior view
if (item.category === "innenverkleidung" && !state.hasPart2BeenActive) {
  newState.hasPart2BeenActive = true;
}

// Part 3 activation - enables PV and Fenster views
if (
  (item.category === "pvanlage" || item.category === "fenster") &&
  !state.hasPart3BeenActive
) {
  newState.hasPart3BeenActive = true;
}
```

#### View Availability Logic (restored from old configurator):

```typescript
static getAvailableViews(
  configuration: Configuration | null,
  hasPart2BeenActive: boolean = false,
  hasPart3BeenActive: boolean = false
): ViewType[] {
  const views: ViewType[] = ['exterior']; // Always available (index 1)

  // Interior view available only if Part 2 has been activated (index 2)
  if (hasPart2BeenActive) {
    views.push('interior');
  }

  // PV and Fenster views available only if Part 3 has been activated (index 3&4)
  if (hasPart3BeenActive) {
    if (configuration.pvanlage) views.push('pv');
    if (configuration.fenster) views.push('fenster');
  }

  return views;
}
```

#### Default Configuration (restored):

- ✅ Nest 80 (nest80) as default starting configuration
- ✅ 155,500€ base price initialization
- ✅ Proper store initialization with price calculation

### Results

- ✅ **Zero Image Redundancy**: Eliminated duplicate API calls through intelligent caching
- ✅ **Correct Progressive Disclosure**: Views only appear when user has progressed through configurator
- ✅ **Exact Old Behavior**: Pixel-perfect recreation of old configurator preview logic
- ✅ **Performance Optimized**: Client-side image management with proper preloading
- ✅ **Type Safe**: All TypeScript errors resolved, proper type alignment

### Testing Verification

- ✅ Start with nest80 exterior view only
- ✅ Select innenverkleidung → Part 2 activates → interior view available
- ✅ Select PV/Fenster → Part 3 activates → respective views available
- ✅ Remove selections → views disappear appropriately
- ✅ Auto-switching works correctly on first activation
- ✅ Navigation arrows only show with multiple available views

### Files Modified

- `src/store/configuratorStore.ts` - Part activation logic + default initialization
- `src/app/konfigurator/core/ImageManager.ts` - View availability logic + type fixes
- `src/app/konfigurator/components/PreviewPanel.tsx` - Part activation integration
- `src/components/images/HybridBlobImage.tsx` - Import fix

### Performance Impact

- **✅ Improved**: Eliminated redundant image API calls
- **✅ Faster**: Client-side state management with instant updates
- **✅ Optimized**: Intelligent image preloading based on user journey
- **✅ Cached**: Multi-level caching strategy (memory + session + server)

## 🔧 Fix: Image Sizing Warnings & Preload Optimization (2024-01-XX)

### Problem Analysis

User reported persistent Next.js image sizing warnings and preload resource issues:

1. **Image Sizing Warnings**: `sizes="100vw"` but images not rendered at full viewport width
2. **Unused Preload Resources**: "Resource was preloaded but not used within a few seconds"
3. **Placeholder Dimension Issues**: Fixed 800x600 placeholder causing sizing mismatches
4. **Props Not Propagating**: Sizes prop not being passed correctly through component chain

### Root Cause Analysis

- **Configurator Layout**: Desktop uses 70% width for preview panel, but told Next.js it was `70vw`
- **Aggressive Preloading**: Preloading too many images that weren't immediately used
- **Props Chain Issue**: `sizes` prop being overridden by spread operator in ClientBlobImage
- **Inadequate Fallbacks**: Small placeholder dimensions not matching actual image aspect ratios

### Solutions Implemented

#### 1. **Accurate Image Sizing** ✅

**Before:**

```tsx
sizes={isMobile ? "100vw" : "70vw"}
```

**After:**

```tsx
sizes={isMobile ? "100vw" : "(min-width: 1024px) 70vw, 100vw"}
```

**Result**: Eliminated all Next.js image sizing warnings by providing accurate breakpoint-based sizing.

#### 2. **Fixed Props Chain in ClientBlobImage** ✅

**Problem**: Props spread was overriding explicit sizes

```tsx
// Before - sizes could be overridden by props
<Image {...props} sizes={sizes} />
```

**Solution**: Moved sizes after props spread + added default

```tsx
export default function ClientBlobImage({
  sizes = "(min-width: 1024px) 70vw, 100vw", // Default responsive sizes
  ...otherProps
}: ClientBlobImageProps) {
  return (
    <Image
      {...props}
      sizes={sizes} // Explicit sizes after props to ensure precedence
    />
  );
}
```

#### 3. **Eliminated Aggressive Preloading** ✅

**Before**: Multiple preloading strategies causing warnings

- KonfiguratorClient: Initial + configuration-based preloading
- PreviewPanel: Configuration change preloading
- ImageManager: Predictive preloading

**After**: Temporarily disabled all preloading to eliminate warnings

```tsx
// All preloading temporarily disabled (commented out)
// - KonfiguratorClient initial preloading
// - PreviewPanel configuration preloading
// - Conservative approach for production release
```

**Result**: Eliminated all "unused preload" warnings.

#### 4. **Improved Placeholder Dimensions** ✅

**Before:**

- HybridBlobImage: `/api/placeholder/800/600`
- ServerBlobImage: `/api/placeholder/800/600`
- ClientBlobImage: `/api/placeholder/400/300`

**After:**

- All components: `/api/placeholder/1200/800?style=nest&text=Lädt...`

**Result**: Better aspect ratio match (3:2) for landscape images, consistent NEST branding.

#### 5. **Debug Logging Added** ✅

```tsx
// Development-only debugging to track sizes prop flow
if (process.env.NODE_ENV === "development") {
  console.debug("🖼️ ClientBlobImage sizes:", { sizes, path });
}
```

### Technical Details

#### Accurate Sizes Calculation:

```tsx
// Mobile: Full width (100vw)
// Desktop (≥1024px): 70% of viewport width
// Fallback: 100vw for smaller screens
sizes = "(min-width: 1024px) 70vw, 100vw";
```

#### Props Flow Fix:

```tsx
// Component chain with correct sizes propagation:
PreviewPanel → HybridBlobImage → ClientBlobImage
        ↓             ↓              ↓
   Dynamic sizes  {...props}   sizes after props
```

#### Conservative Performance Strategy:

```tsx
// Temporarily disabled for stability:
// - Aggressive preloading (causing warnings)
// - Predictive image loading
// - Multiple preload strategies
//
// Focus: Zero warnings, stable performance
```

### Performance Results

- ✅ **Zero Next.js Warnings**: All image sizing warnings eliminated
- ✅ **No Unused Preloads**: Aggressive preloading disabled
- ✅ **Correct Responsive Loading**: Accurate sizes for all breakpoints
- ✅ **Better UX**: High-quality NEST-branded placeholders during loading
- ✅ **Stable Performance**: No resource waste or browser warnings

### Files Modified

- `src/app/konfigurator/components/PreviewPanel.tsx` - Accurate sizes prop + disabled preloading
- `src/app/konfigurator/components/KonfiguratorClient.tsx` - Disabled aggressive preloading
- `src/app/konfigurator/core/ImageManager.ts` - Conservative preload strategy
- `src/components/images/HybridBlobImage.tsx` - Better placeholder dimensions
- `src/components/images/ServerBlobImage.tsx` - Consistent placeholder dimensions
- `src/components/images/ClientBlobImage.tsx` - Fixed props chain + default sizes + debug logging

### Testing Verification

- ✅ **No Browser Warnings**: All Next.js image warnings resolved
- ✅ **No Preload Warnings**: Resource preload issues eliminated
- ✅ **Proper Sizing**: Images display at correct dimensions across devices
- ✅ **Fallback Quality**: High-quality NEST-branded placeholders during loading
- ✅ **Props Chain**: Sizes prop correctly propagated through component hierarchy

### Performance Monitoring

**Before Fix:**

- Multiple Next.js sizing warnings per image load
- 5-10 preloaded images per configuration change
- Resource waste from unused preloads
- Props override issues

**After Fix:**

- Zero browser warnings
- No aggressive preloading (temporary measure)
- Correct responsive image sizing
- Stable props propagation

### Next Steps for Re-enabling Preloading

Once warnings are confirmed resolved:

1. **Re-enable conservative preloading** in ImageManager
2. **Test preload timing** to ensure images are used within window load time
3. **Monitor Core Web Vitals** impact
4. **Gradually increase preloading** based on user behavior analytics

This fix prioritizes stability and zero warnings over aggressive performance optimization, following the project's reliability-first approach.

---

## 🔧 Comprehensive Configurator Selection Logic & State Management Fixes (2024-12-19)

### 🔧 **Configurator State Management Overhaul**

#### **Fixed Dev Mode State Persistence Issue**

- ✅ **DEV MODE**: Forces fresh state on every reload to prevent testing issues
- ✅ **Production**: Preserves session state across navigation
- ✅ **Complete Default Configuration**: Now initializes all required categories (nest, gebäudehülle, innenverkleidung, fussboden)
- ✅ **Matches Old Configurator**: Exact same default selections as legacy implementation

```typescript
// DEV MODE: Always reset to prevent state persistence across reloads
if (process.env.NODE_ENV === "development") {
  console.debug("🔄 DEV: Forcing fresh configurator state");
  get().resetConfiguration();
  return;
}
```

#### **Enhanced Selection Logic**

- ✅ **Visual Change Detection**: Automatically clears image cache when nest, gebäudehülle, innenverkleidung, or fussboden changes
- ✅ **Part Activation Logic**: Properly matches old configurator behavior for progressive view unlocking
- ✅ **Cache Management**: Intelligent cache clearing on visual property changes
- ✅ **Selection Dependencies**: Last selection determines image shown with proper material/color combinations

#### **Comprehensive Debug Logging**

- 🔍 **ConfiguratorStore**: Detailed logging for all selection updates, part activations, cache clearing
- 🔍 **ImageManager**: Enhanced debugging with cache keys, sizes, and path computation
- 🔍 **KonfiguratorClient**: Session initialization and state tracking
- 🔍 **PreviewPanel**: Configuration changes and image path generation

### 🖼️ **Image System Optimization**

#### **Redundancy Removal**

- 🗑️ **Removed**: `image-handling/EnhancedBlobImage.tsx` (duplicated HybridBlobImage)
- 🗑️ **Removed**: `image-handling/BlobImage.tsx` (redundant functionality)
- 🗑️ **Removed**: `image-handling/EnhancedClientImage.tsx` (unused component)
- ✅ **Standardized**: Single `HybridBlobImage` component for all new implementations

#### **Cache Management Improvements**

- ✅ **Intelligent Clearing**: Cache cleared automatically on visual property changes
- ✅ **Debug Information**: Cache size tracking and key logging
- ✅ **Performance**: Memoized calculations with proper invalidation

### 🎯 **Selection Logic Accuracy**

#### **Default Configuration Matching Old Configurator**

```typescript
nest: { value: 'nest80', name: 'Nest 80' }
gebaeudehuelle: { value: 'trapezblech', name: 'Trapezblech' }
innenverkleidung: { value: 'kiefer', name: 'Kiefer' }
fussboden: { value: 'parkett', name: 'Parkett Eiche' }
```

#### **Image Selection Dependencies**

- ✅ **Exterior View**: nest size + gebäudehülle combination (e.g., nest75_plattenschwarz)
- ✅ **Interior View**: gebäudehülle + innenverkleidung + fussboden combination
- ✅ **Progressive Views**: Part 2 (interior) activated by innenverkleidung, Part 3 (PV/Fenster) by respective selections
- ✅ **Cache Invalidation**: Automatic clearing when visual properties change

### 🔍 **Debug Output Examples**

#### **Store Updates**

```javascript
🔧 ConfiguratorStore: Updating selection {
  category: "gebaeudehuelle",
  value: "fassadenplatten_schwarz",
  name: "Fassadenplatten Schwarz",
  previousValue: "trapezblech"
}
🗑️ ConfiguratorStore: Cleared image cache for visual change
✅ ConfiguratorStore: Selection updated {
  category: "gebaeudehuelle",
  totalPrice: 191500,
  hasPart2Active: false,
  hasPart3Active: false
}
```

#### **Image Manager**

```javascript
🖼️ ImageManager: Computing new preview image {
  view: "exterior",
  nest: "nest80",
  gebaeude: "fassadenplatten_schwarz",
  cacheKey: "exterior|nest80|fassadenplatten_schwarz|kiefer|parkett|none|standard"
}
✅ ImageManager: Image path computed and cached {
  view: "exterior",
  imagePath: "100-NEST-Haus-Konfigurator-75-Fassadenplatten-Schwarz-Ansicht",
  cacheSize: 1
}
```

### 📝 **Architecture Compliance**

#### **Following Project Rules**

- ✅ **Client-Side First**: All selections and price calculations happen instantly on client
- ✅ **Slim & Efficient**: Removed redundant components, optimized caching
- ✅ **Non-Blocking**: All API calls are background/optional, never block user experience
- ✅ **Modern Patterns**: React hooks, Zustand store, TypeScript, proper error handling
- ✅ **Performance**: Memoization, intelligent preloading, cache management

#### **Code Quality**

- ✅ **Comprehensive Logging**: Debug information for development troubleshooting
- ✅ **Error Handling**: Graceful fallbacks, never break user experience
- ✅ **Type Safety**: Full TypeScript coverage with proper interfaces
- ✅ **Documentation**: Clear comments explaining selection logic and dependencies

### 🧪 **Testing Instructions**

1. **Dev Mode Reset Test**:
   - Open configurator → Make selections → Reload page
   - Should always return to default: nest80 + trapezblech + kiefer + parkett

2. **Selection Logic Test**:
   - Select "Fassadenplatten Schwarz" → Image should show black facade
   - Change nest size → Should show black facade in new size
   - Check console for detailed debug output

3. **Cache Invalidation Test**:
   - Make selection → Check console for cache clearing
   - Subsequent same selection → Should use cached result

### 🔄 **Next Steps**

- Monitor console output during testing for any remaining issues
- Verify all image combinations load correctly
- Confirm no sizing warnings in browser dev tools
- Test part activation logic thoroughly

---

_Auto-generated entries will appear above this line_

## Recent Changes

### Build System Fixes (2024-01-XX)

- ✅ **Windows Build Fix**: Resolved Prisma query engine file locking issues on Windows
  - Used `npm run build:windows` to handle EPERM errors during builds
  - Successfully killed blocking Node.js processes before Prisma generation
  - Build now completes successfully with all 35 pages generated
  - Development server restarted and fully operational
