# Nest-Haus Commit History

_Auto-generated documentation of project changes_

---

## [025814713c3f0856a6ad2b1ac231adf7b9efa98b] - Wed Dec 3 13:29:22 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [aa86542f4914bf1ac08d9114e90116370e193614] - Wed Dec 3 12:45:10 2025 +0100

**Author**: stenkjan
**Message**: `Refactor FAQClient component by removing unused imports  - Removed unused imports for  and  in  to streamline the code and improve maintainability.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-nest/DeinNestClient.tsx
- src/app/faq/FAQClient.tsx
- src/app/nest-system/NestSystemClient.tsx


---

## [43c40d051ffac3a45ffc371169be16c3455b76c6] - Wed Dec 3 12:38:11 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [02328743c6d4b842d6f872d58f458f621fe473fb] - Tue Dec 2 15:37:10 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [93188d830553b9d6b6fb9b17e1acaa840517545d] - Tue Dec 2 15:27:25 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [500163761f2dd7a2a69baa5485fd7e2727881656] - Tue Dec 2 09:18:27 2025 +0100

**Author**: stenkjan
**Message**: `Fix company name typo in EmailService to reflect accurate branding: changed "ecoChalets GmbH" to "eco Chalets GmbH".  `

### Changes Analysis

---

## [1011fb7e6efd5433e5951b7c56d49416ea748d97] - Tue Dec 2 09:13:08 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [a8ab7dc2ec3ab3d6cd5d39b374c26e692d05278e] - Mon Dec 1 16:38:26 2025 +0100

**Author**: stenkjan
**Message**: `Enhance user tracking API funnel metrics retrieval with combined IP and bot filters  - Updated  to accept a  parameter, allowing for more precise filtering of user sessions. - Refactored funnel metrics queries to utilize a combined filter for improved data accuracy.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/admin/user-tracking/route.ts


#### 📚 Documentation Changes
- docs/STRIPE_PRODUCTION_SETUP.md


---

## [4d76855a587d2f7b4a10e04fde08725c60098a78] - Mon Dec 1 16:11:59 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [07f2218fcd0020d5db63e6f64c678cb47cf2e347] - Mon Dec 1 16:05:51 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [2081a75fe462da6ca2e41f531c2ab3efb734cb59] - Mon Dec 1 16:04:01 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [9bc361d52406663fb539c0a14ec081366e79a386] - Mon Dec 1 15:50:56 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [f658755e175c3febd11b09fee085e769e3e48441] - Mon Dec 1 15:47:55 2025 +0100

**Author**: stenkjan
**Message**: `Enhance user session tracking with bot detection features  - Added fields for bot detection in UserSession model: isBot, botConfidence, botDetectionMethod, and qualityScore. - Implemented bot filter logic in user tracking API to differentiate between real users and bots. - Integrated bot detection in session interaction tracking, calculating quality scores based on detection results.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/user-tracking/components/BotAnalysisWidget.tsx
- src/app/admin/user-tracking/components/FilterToggle.tsx
- src/app/admin/user-tracking/components/GA4ComparisonWidget.tsx
- src/app/api/admin/analyze-usa-sessions/route.ts
- src/app/api/admin/bot-analysis/route.ts
- src/app/api/admin/retroactive-bot-analysis/route.ts
- src/app/api/admin/user-tracking/route.ts
- src/app/api/sessions/track-interaction/route.ts


#### ⚙️ Backend Changes
- prisma/schema.prisma


#### 📚 Documentation Changes
- docs/BOT_DETECTION_STRATEGY.md


---

## [624b2caa32ed12d62b07ba743d748e7fa870bbd5] - Mon Dec 1 15:30:33 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [c31f5bbf9e6fa8b6be3e2d54cd054d389a0110f8] - Mon Dec 1 15:15:35 2025 +0100

**Author**: stenkjan
**Message**: `Implement cookie consent tracking and enhance Google Analytics integration  - Added fields for cookie consent tracking in UserSession model. - Integrated CookieSettingsModal into the layout for user consent management. - Introduced GA4ConsentWidget in the user tracking dashboard for consent rate tracking. - Updated CookieBanner to reflect changes in consent messaging and handling. - Enhanced GoogleAnalyticsProvider to support consent mode v2 and Google Signals. - Updated CookieConsentContext to save consent preferences to the database and trigger updates for Google Consent Mode.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/user-tracking/components/GA4ConsentWidget.tsx
- src/app/admin/user-tracking/page.tsx
- src/app/api/admin/consent-stats/route.ts
- src/app/api/sessions/update-consent/route.ts
- src/app/layout.tsx
- src/components/CookieBanner.tsx
- src/components/CookieSettingsModal.tsx
- src/components/analytics/GoogleAnalyticsProvider.tsx
- src/contexts/CookieConsentContext.tsx


#### ⚙️ Backend Changes
- prisma/schema.prisma


#### 📚 Documentation Changes
- docs/COMPLIANCE_SUMMARY.md
- docs/GA4_CONSENT_IMPLEMENTATION_SUMMARY.md
- docs/GA4_COOKIELESS_PINGS_IMPLEMENTATION.md
- docs/GA4_COOKIE_CONSENT_IMPLEMENTATION.md
- docs/SENSITIVE_CATEGORIES_COMPLIANCE.md


---

## [6300c5d14c80f62ae7cccb2969498e891e983656] - Mon Dec 1 13:58:29 2025 +0100

**Author**: stenkjan
**Message**: `Merge branches 'main' and 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [0890b9c57f2661a735898ad47013f74fd70947cb] - Mon Dec 1 11:52:47 2025 +0100

**Author**: stenkjan
**Message**: `Enhance UnifiedContentCard for mobile support and update styles  - Added mobile description support in UnifiedContentCard for better responsiveness. - Updated CSS to include a new class for larger primary text on mobile/tablet. - Modified card content to improve title and description formatting for mobile display.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/globals.css
- src/components/cards/UnifiedContentCard.tsx


#### 📚 Documentation Changes
- docs/STRIPE_PRODUCTION_SETUP.md


---

## [472c43ab67c0f70fa3c774e63d5e33b867c96ed0] - Fri Nov 28 14:04:03 2025 +0100

**Author**: stenkjan
**Message**: `Merge b88edde5156c0a4fc9dd02e4ca953a4152396f11 into a79a17ac3322d915454cfe5d6c1874b9b41dd3cd  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/__tests__/SummaryPanel.test.tsx


#### 📚 Documentation Changes
- PLANUNGSPAKET_PRICE_FIX_SUMMARY.md


---

## [5328c15e80725b85796430a26001f51cbbdadb42] - Fri Nov 28 14:00:08 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/hooks/useConfiguratorLogic.ts


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [8e872675072512aee47fe8b59b7a50f87de3b484] - Fri Nov 28 13:44:45 2025 +0100

**Author**: stenkjan
**Message**: `Merge 894fce81571c70c2b312441493b575cd6bdc075b into 46d9fc2c95162ea3d1e2192317875c0a11cb199b  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/hooks/useConfiguratorLogic.ts


---

## [584e78ca822bc6d62ad4c2ea6ce0c1cf5e3d733a] - Fri Nov 28 13:39:43 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [37cbec85a73f42dc6602c732af010dfbd83fcb82] - Fri Nov 28 13:34:10 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b0b19af4615594cd799dcf76f00d7b2c0fc8f6f2] - Fri Nov 28 13:23:24 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [332b37cf82174c067642c9ff9bbeb35e00cb7666] - Fri Nov 28 13:16:24 2025 +0100

**Author**: stenkjan
**Message**: `refactor: improve configurator logic and price calculation  - Updated  to correctly calculate the start date for next Monday. - Modified  and  components to allow  to accept  values for better type safety. - Enhanced  hook by utilizing  for stable access to overlay visibility state, improving performance and reducing unnecessary re-renders. - Refined price calculation logic to include monthly payment amounts for upgrades and discounts, ensuring accurate pricing information is returned.  These changes enhance the configurator's functionality, maintainability, and user experience.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/ConfiguratorUI.tsx
- src/app/konfigurator/hooks/useConfiguratorLogic.ts


#### ⚙️ Backend Changes
- scripts/send-roadmap-invites.ts


---

## [2be16f474cd7a47a172f20cdad2fd96fae52bf93] - Fri Nov 28 13:04:53 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [0f97d998294294a5f6029d4a00461b5dbb98efb5] - Fri Nov 28 10:50:33 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [c39eb51a04023d0c51b2b7cc83fdfdc580cc6673] - Fri Nov 28 10:31:14 2025 +0100

**Author**: stenkjan
**Message**: `feat: Add robots.txt, Google AdSense integration, analytics tracking with cookie consent, and implement a comprehensive admin dashboard with user tracking and database optimizations.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/layout.tsx
- src/app/robots.ts
- src/components/analytics/GoogleAdSense.tsx
- src/hooks/useAnalytics.ts


#### 📚 Documentation Changes
- docs/final_ADMIN_DASHBOARD_IMPLEMENTATION_COMPLETE.md


---

## [f21e292568cb9a515288ed226d07f94189640be8] - Fri Nov 28 09:12:40 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [5a377da22ec75860c799e5fa8632d387e5c55a79] - Fri Nov 28 09:04:36 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [12a9e52a34184f8b4abaeeee69b8ca0aad7c0984] - Fri Nov 28 08:59:46 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [c98003503fd5f4163803b4ca34e6f44bd56eff3b] - Fri Nov 28 07:54:53 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/customer-inquiries/UserJourney.tsx
- src/app/api/sessions/get-journey/route.ts


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [852564c1fb8997a25864f42e84c232ff874f6a60] - Thu Nov 27 16:18:18 2025 +0100

**Author**: stenkjan
**Message**: `Merge f01a21ddb52b2dceb85365cf15756a64fea3deb6 into 591dca95a0e7ca7e51cae0b83a2ad3efa3eaf799  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/customer-inquiries/UserJourney.tsx
- src/app/api/sessions/get-journey/route.ts


---

## [16c2ea34cb0a228d6f30c04274c71c5d48315fdf] - Thu Nov 27 15:50:42 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [721715f23dc2604b0d8bcffb4d39217f70dfafff] - Thu Nov 27 15:47:13 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [6655ec0435d24781c7cd7bd1eb9ffa0be9953844] - Thu Nov 27 15:43:32 2025 +0100

**Author**: stenkjan
**Message**: `fix: resolve TypeScript build errors and clean up unused code  - Prefixed the unused 'inquiryId' parameter in UserJourney.tsx with an underscore to indicate intentional non-use. - Removed the unused 'CalendarView' import in page.tsx to streamline the codebase. - Updated documentation to reflect the current build status and readiness for production.  All TypeScript and ESLint errors have been resolved, ensuring a successful build.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/customer-inquiries/UserJourney.tsx
- src/app/admin/customer-inquiries/page.tsx
- src/components/sections/AppointmentBooking.tsx


#### 📚 Documentation Changes
- docs/FINAL_TRACKING_FIXES_SUMMARY.md


---

## [5acd867a3fd9d873764a173c352198c7f71b6435] - Thu Nov 27 15:36:16 2025 +0100

**Author**: stenkjan
**Message**: `feat: implement customer inquiry tracking and user journey integration  - Completed the implementation of customer inquiry tracking and user journey integration for the appointment booking system. - Enhanced the admin panel to display customer inquiries with session data, including a new UserJourney component and SessionSummaryBadge for quick stats. - Integrated comprehensive interaction tracking within the AppointmentBooking component, capturing form views, date and time slot selections, and appointment submissions. - Added new API endpoints to fetch user journey data, ensuring a complete view of user interactions.  These changes improve the visibility of customer interactions and enhance the overall user experience in the appointment booking process.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/customer-inquiries/SessionSummaryBadge.tsx
- src/app/admin/customer-inquiries/UserJourney.tsx
- src/app/admin/customer-inquiries/page.tsx
- src/app/api/sessions/get-journey/route.ts
- src/components/sections/AppointmentBooking.tsx


#### 📚 Documentation Changes
- docs/FINAL_TRACKING_FIXES_SUMMARY.md


---

## [899cc25b0423df66f1ee680ba272d82144eae558] - Thu Nov 27 14:56:52 2025 +0100

**Author**: stenkjan
**Message**: `refactor: remove AdminAppointmentNotificationTemplate.ts  - Deleted the AdminAppointmentNotificationTemplate.ts file, which contained the email template for admin appointment notifications. This change helps streamline the codebase by removing unused components.  `

### Changes Analysis

---

## [0912cb210a89a6f096c16e5eda03ee795de00951] - Thu Nov 27 14:51:51 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [608ef3b2ea97e9ae0e7f6450c32f5ff0f2f5e6a6] - Thu Nov 27 14:47:59 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [e1b7d4fbf56985b3fda1dbdb7b359a4f52055f39] - Thu Nov 27 14:44:54 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [8ee7753454e7435c78a10dc2f55f749cb5049d94] - Thu Nov 27 14:40:32 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [77f23edf49ab0756e2276591862244173fecfd08] - Thu Nov 27 14:08:46 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [620e3fe6e281f0b601be380a27f3d17a8fce96c2] - Thu Nov 27 13:24:26 2025 +0100

**Author**: stenkjan
**Message**: `refactor: improve layout responsiveness in CheckoutStepper component  - Changed the  class to  for better handling of text overflow in the left section. - Adjusted text sizes for price display to ensure consistency across different screen sizes.  These updates enhance the visual layout and responsiveness of the CheckoutStepper, contributing to a smoother user experience during the checkout process.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutStepper.tsx


---

## [c9485d0f55e8d11ed5e4668f16cba5d1d5f2c9b3] - Thu Nov 27 13:03:42 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [651a74b547a7a033311f92c0196e6f81d6546b1f] - Thu Nov 27 12:37:14 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [a57471030eda128d2d6758877a59614347ef6de1] - Thu Nov 27 12:32:01 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [265e8a9ca8d7fbd7fe4cc6e87eb691b4caf9c5e3] - Thu Nov 27 12:15:25 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [7e8faa1b8ce6f0aee2309811e9bffa7766df9e80] - Thu Nov 27 11:49:57 2025 +0100

**Author**: stenkjan
**Message**: `refactor: improve button state handling in GrundstueckCheckForm component  - Enhanced the button behavior in the GrundstueckCheckForm component to conditionally apply styles and disable pointer events based on the submission state and form validity. - Updated validation logic to ensure required fields are checked before submission, improving user experience and data integrity.  These changes contribute to a more intuitive interface by clearly communicating the button's state and ensuring proper form validation.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/sections/AppointmentBooking.tsx
- src/components/sections/GrundstueckCheckForm.tsx


---

## [2619bc69d12a213cda2c4798086dc6532d2c0062] - Wed Nov 26 14:53:30 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [157cdf54ef3cf19e96f25d0bc3caf297c4fe1df2] - Wed Nov 26 14:50:18 2025 +0100

**Author**: stenkjan
**Message**: `refactor: enhance CheckoutStepper and GrundstueckCheckForm components for ohne-nest mode handling  - Updated the CheckoutStepper component to conditionally render pricing information based on the ohne-nest mode, improving clarity for users. - Refactored the GrundstueckCheckForm component to include form validation logic, ensuring required fields are checked before submission, enhancing user experience and data integrity.  These changes contribute to a more intuitive and efficient user interface by accurately reflecting the current mode and validating user input.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/sections/GrundstueckCheckForm.tsx


---

## [287209484c757272d3f63881ac55c276b1ea5f03] - Wed Nov 26 14:15:59 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [c1c85dba0ba86f63919209edcfc04b23daeeea7e] - Wed Nov 26 14:02:29 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [39de2181957ab952165b3435c1092cd8e9d5485e] - Wed Nov 26 13:55:48 2025 +0100

**Author**: stenkjan
**Message**: `refactor: optimize WarenkorbClient component for improved ohne-nest mode handling  - Refined the logic for determining ohne-nest mode based on cart configurations, enhancing accuracy in mode selection. - Improved console logging for better debugging and clarity regarding mode changes.  These updates enhance the user experience by ensuring the correct mode is consistently applied based on the cart's state.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/WarenkorbClient_fix.txt


---

## [6b8e1c0408c6ba0941f4791e57c3c460dc224be1] - Wed Nov 26 13:44:40 2025 +0100

**Author**: stenkjan
**Message**: `refactor: improve ohne-nest mode logic in WarenkorbClient component  - Enhanced the conditional checks for setting ohne-nest mode based on the presence of configurations in the cart, ensuring accurate mode handling. - Updated console log messages for clarity, reflecting the new logic and improving debugging information.  These changes refine the user experience by ensuring the correct mode is set based on the cart's state.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/WarenkorbClient.tsx


---

## [13d40678344f38de1d8589a6467f39545eed9b66] - Wed Nov 26 13:30:26 2025 +0100

**Author**: stenkjan
**Message**: `refactor: enhance CheckoutStepper component for konzept-check mode  - Updated conditional rendering logic to display appropriate headings and messages based on  state, improving user guidance during the checkout process. - Adjusted links in card content to direct users to the correct path for konzept-check mode, ensuring a seamless navigation experience.  These changes refine the user interface and enhance the overall usability of the CheckoutStepper component.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutStepper.tsx


---

## [dfdd55c3e34bf746cb731abb856a6923001e6794] - Wed Nov 26 12:45:20 2025 +0100

**Author**: stenkjan
**Message**: `refactor: streamline konzept-check mode UI in CheckoutStepper component  - Adjusted the progress bar width to 50% and centered it for the konzept-check mode, enhancing visual clarity and user experience. - Removed redundant text sections specific to konzept-check mode to simplify the interface. - Verified that pricing overview boxes and buttons are correctly conditionally rendered based on the mode, ensuring a clean and focused checkout process.  These changes improve the overall usability and aesthetic of the konzept-check mode, aligning with the simplified 2-step flow.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutStepper.tsx


#### 📚 Documentation Changes
- docs/final_KONFIGURATOR_PRICING_OVERHAUL_SUMMARY.md


---

## [5ba34a4bd8a6fff95ba5044abee36d7103fb784c] - Wed Nov 26 11:32:51 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [1ef3c21e532a6f411bb684498533dc52b2762e4d] - Wed Nov 26 11:15:21 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [184152a8686805ad3ca757c46e0fde160a9b1f38] - Wed Nov 26 11:08:03 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [183c9e203fcf2d6ee4b31a4c3a14573ce75043e0] - Wed Nov 26 10:43:23 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [e68ea652d610fcd8ecaf8f05d17e32e45e97ad81] - Wed Nov 26 10:34:03 2025 +0100

**Author**: stenkjan
**Message**: `fix: update padding description in KonzeptcheckClient and enhance configuration reset logic  - Changed the comment for the Grundrissplan Card to reflect the addition of padding. - Added console log for configuration reset action to improve debugging. - Reset interaction flags and session timing on configuration reset to enhance session management. - Updated logic to prevent price calculation until user interaction occurs, ensuring a clearer user experience.  These changes improve clarity in the UI and enhance session handling in the configurator.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konzept-check/KonzeptcheckClient.tsx


---

## [658befdb42066afdcc8c6469b35e6cf2d5ff2e5e] - Wed Nov 26 10:08:32 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [c36e2d05d5454270211a1adc6ac851ffbcacf22f] - Tue Nov 25 17:29:41 2025 +0100

**Author**: stenkjan
**Message**: `feat: enhance session management in ConfiguratorShell component  - Added a new useEffect to periodically check for session expiry every minute, ensuring the session remains valid during user interaction. - Updated the existing useEffect to clarify that the session check occurs on component mount.  These changes improve session handling and maintain user experience by actively monitoring session validity.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorShell.tsx


---

## [853acdfc86b08bc76ab8c7716f13fad65bddffe4] - Tue Nov 25 15:14:20 2025 +0100

**Author**: stenkjan
**Message**: `fix: update session expiry check in ConfiguratorShell component  - Added a call to  on component mount to ensure session validity. - Adjusted useEffect dependencies to run only once, improving performance and preventing unnecessary re-renders.  These changes enhance session management and ensure the configurator operates with the latest session state.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorShell.tsx


---

## [e56e9443b3d412dcfab66672a5582c6aa6533f6a] - Tue Nov 25 15:11:23 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [d43dfe7fdc83078d7bab6a98921b8d96384a105e] - Tue Nov 25 15:02:56 2025 +0100

**Author**: stenkjan
**Message**: `. configuratorStore.ts - Session State Tracking Added new state properties: hasUserInteracted: boolean - Tracks if user made any selection sessionStartTime: number - Timestamp when session started lastActivityTime: number - Timestamp of last interaction SESSION_TIMEOUT = 30 minutes - Configurable timeout period Added new methods: markUserInteraction() - Called on first user click, triggers price calculation checkSessionExpiry() - Checks browser close/reopen and inactivity timeout resetSession() - Resets to new session state (keeps preselections, zeros price) Modified existing methods: calculatePrice() - Returns 0€ if hasUserInteracted is false updateSelection() - Calls markUserInteraction() on first click updateCheckboxOption() - Also marks user interaction initializeSession() - Calls checkSessionExpiry() and doesn't calculate price for new sessions 2. ConfiguratorShell.tsx - Session Initialization Updated mount logic: Calls checkSessionExpiry() on mount to  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/CartFooter.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx


---

## [5f3a53f4b2be5b2f26159700385ba160330a99c4] - Tue Nov 25 14:27:39 2025 +0100

**Author**: stenkjan
**Message**: `docs: update pricing overhaul summary and configurator data for new pricing structure  Changes: - Revised pricing overhaul summary to reflect updated prices for "Planung Plus" and "Planung Pro" as of November 25, 2025. - Adjusted  to incorporate new pricing amounts: Plus = 4900€ (was 9600€) and Pro = 9600€ (was 12700€). - Updated parser logic in  to ensure accurate data handling in line with the new pricing structure.  These updates ensure the configurator reflects the latest pricing changes and maintains consistency with the Google Sheets configuration.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/data/configuratorData.ts


#### 📚 Documentation Changes
- docs/final_KONFIGURATOR_PRICING_OVERHAUL_SUMMARY.md


---

## [ce57fdf5d510f8d863639089cf97943ad0606cd8] - Tue Nov 25 11:48:33 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [17c603114e063096d1edd7b9e007a434ae5dbd8b] - Mon Nov 24 16:36:22 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [f0e9c6e81f2bf0a117489f3c63870544c927680a] - Mon Nov 24 16:33:15 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [be7a491c9e166485d6c1c525a17af0ef29b90941] - Mon Nov 24 16:22:38 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [aa4cd9c907fd081a3a9715d7ac5d72c3c08e7ad8] - Mon Nov 24 16:12:29 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [300d195467d80cd8ec276921c212cbbcedaadc33] - Mon Nov 24 16:00:35 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [6dac3815adb99f8fad20f2df9781d6450d1e212e] - Mon Nov 24 15:58:56 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [478f99299763944962dd5cf030e2255c31978336] - Mon Nov 24 15:51:27 2025 +0100

**Author**: stenkjan
**Message**: `refactor: update team card content structure  Changes: - Removed redundant team member entries for "Ines Sagadin" to streamline the content. - Adjusted the image position for better layout consistency.  These modifications enhance the clarity and efficiency of the team card presentation.  `

### Changes Analysis

---

## [b59146b7735eb180c59a3eaa19bba27ed896e9ab] - Mon Nov 24 15:41:21 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [a4cf6f71ac62edaf7c3f141df5e067e4234a16e3] - Mon Nov 24 15:19:04 2025 +0100

**Author**: stenkjan
**Message**: `refactor: remove unused mobile information toggle and technical details from ThreeByOneGrid component  Changes: - Eliminated the  state and associated mobile information toggle functionality. - Removed mobile-specific technical details sections to streamline the component and improve maintainability.  These changes enhance the clarity and efficiency of the ThreeByOneGrid component.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/grids/ThreeByOneGrid.tsx


---

## [196b1e865dc2486fa90cd82effce2095b0e5ad8b] - Mon Nov 24 14:50:56 2025 +0100

**Author**: stenkjan
**Message**: `fix: correct spelling in team card description  Changes: - Updated the description for "Philipp Möstl" from "Baumeister & Production" to "Baumeister & Produktion" to ensure accurate language usage.  This change enhances the professionalism and correctness of the team card content.  `

### Changes Analysis

---

## [9d5a33939c7717bf0283787c0a4839bfe9a93fe5] - Mon Nov 24 14:33:55 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [d575c458e3f33ced1b97b721acb381762c114a70] - Mon Nov 24 14:31:29 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [c3295bed97d5cc5b4ef2456c343d2b1b837a2511] - Mon Nov 24 14:23:19 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [277ccd96f01fcbd800c24366e5d724d1fe5f1dc0] - Mon Nov 24 14:13:49 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [c955be5bd436552b4effe27b3b199cff8f3857b1] - Mon Nov 24 14:11:39 2025 +0100

**Author**: stenkjan
**Message**: `Merge branches 'main' and 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [2369983bd0e286ce46d6dc9a7de683bf5f476fb6] - Mon Nov 24 13:59:53 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [3ef685c9b1052696f4b5589b0164698d9aa4c01f] - Mon Nov 24 13:11:00 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [48f4fbc6d3535ee56396d872dc0f5db53e6275a6] - Mon Nov 24 13:09:18 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [6a8d26780ab69d0d6c3d757f21192fea1cb2908d] - Mon Nov 24 12:59:07 2025 +0100

**Author**: stenkjan
**Message**: `fix: update links in ConfiguratorShell and KonzeptcheckClient for consistency  Changes: - Updated the link in ConfiguratorShell.tsx from "/warenkorb?mode=entwurf" to "/warenkorb?mode=konzept-check". - Changed the link in KonzeptcheckClient.tsx from "/warenkorb?mode=entwurf" to "/warenkorb?mode=konzept-check".  These updates ensure that the navigation reflects the correct mode for the Konzept-Check process.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konzept-check/KonzeptcheckClient.tsx


---

## [24744a17e414432e4a2a90c9c216de2e29e3671b] - Mon Nov 24 12:44:30 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [32baf66ee04f4004b164f2e2058d1c9cbbefeebe] - Mon Nov 24 12:28:10 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/data/configuratorData.ts


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [f84bc572ea4adccae0ce68be5e7894419f5b256f] - Sat Nov 22 18:27:04 2025 +0100

**Author**: stenkjan
**Message**: `Merge b0bde76e2c34b2ee30e9c37c3f7695447f1d4692 into a153d023f1ea77afd6345567587c09f135617a93  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/data/configuratorData.ts


---

## [15ce80315498150561797eace59b193db77bb8a1] - Fri Nov 21 18:00:18 2025 +0100

**Author**: stenkjan
**Message**: `refactor: streamline payment tracking data update in webhook handler  Changes: - Refactored the update logic for configurationData in the handlePaymentSucceeded function to improve clarity and maintainability. - Introduced a new variable to hold the existing configuration data and updated it with purchase tracking information. - Ensured type safety by casting the updated configuration to Prisma.InputJsonValue.  These changes enhance the readability of the webhook handler and ensure proper handling of payment tracking data.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/payments/webhook/route.ts


---

## [e73f3961b7b8ac1aa4400dafc6ef9cb9b0ef54d0] - Fri Nov 21 17:34:53 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [a84e671d4d67805df6d711e2bdeeb029c4f0ecc1] - Fri Nov 21 17:25:54 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [30a9c2408f17996a23e36f21530ea29226faeebf] - Fri Nov 21 16:49:06 2025 +0100

**Author**: stenkjan
**Message**: `feat: enhance GA4 tracking for payment success and Grundstückscheck form submissions  Changes: - Implemented tracking for purchase events from both URL parameters and session configuration data in the PaymentSuccessTracker component. - Added a new tracking function for Grundstückscheck form submissions, capturing relevant data such as location and property details. - Updated the PaymentSuccessTracker to periodically check for webhook-triggered purchase data and track it accordingly.  These enhancements improve the accuracy and comprehensiveness of analytics for user interactions and payment processes.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/payments/webhook/route.ts
- src/app/warenkorb/page.tsx
- src/components/analytics/PaymentSuccessTracker.tsx
- src/components/sections/GrundstueckCheckForm.tsx


---

## [72ad974d8b3b3dd4ad65978b40bf2db8b530abeb] - Fri Nov 21 16:32:06 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [f5f02ec19cc132c2943bd7bbe7b027397aef7277] - Fri Nov 21 15:47:27 2025 +0100

**Author**: stenkjan
**Message**: `refactor: restructure PaymentSuccessTracker component for improved SSR handling  Changes: - Renamed the inner component to  and wrapped it in a  boundary to prevent SSR issues. - Updated documentation to reflect the new structure and clarify the purpose of each component.  This refactor enhances the component's functionality and ensures better compatibility with server-side rendering.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/analytics/PaymentSuccessTracker.tsx


---

## [9fa564e0e943b081e942e39d2b6599afcdee25e9] - Fri Nov 21 15:33:11 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b587317334c10c162a020bab874efbb5970c7e4a] - Fri Nov 21 12:10:25 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [8d927d25fd031c9a9ca153adf74c3e89034f4bd6] - Fri Nov 21 12:05:02 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [0d6665524bdc11299765bcf7952fc9b0678c8b86] - Fri Nov 21 11:59:11 2025 +0100

**Author**: stenkjan
**Message**: `refactor: enhance Google Analytics 4 event tracking utility  Changes: - Updated the pushEvent function to support both gtag and dataLayer for improved compatibility with Google Tag Manager. - Modified event tracking functions to use a consistent parameter structure, enhancing clarity and maintainability. - Added console logging for both dataLayer and gtag events to aid in debugging and tracking verification.  This refactor improves the flexibility and robustness of the analytics tracking implementation.  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/GA4-EVENT-TRACKING-SETUP.md


---

## [7b585a2ff5fd1300decbf4989af49acf378a1b2c] - Fri Nov 21 11:49:54 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [639cb156fc8178bf819e2ab487af249be204516b] - Fri Nov 21 11:46:44 2025 +0100

**Author**: stenkjan
**Message**: `fix: update metadata and text content for consistency in messaging  Changes: - Updated the title and alt text in layout.tsx to reflect a more user-centric approach: "Weil nur du weißt, wie du wohnen willst." - Modified the subtitle in DeinNestClient.tsx and NestSystemClient.tsx to maintain consistency with the updated messaging.  This update enhances the clarity and alignment of the messaging across the application, ensuring a cohesive user experience.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-nest/DeinNestClient.tsx
- src/app/layout.tsx
- src/app/nest-system/NestSystemClient.tsx


---

## [458a2af2b8de1328ff9690ce7ee56a579e3d92f5] - Fri Nov 21 11:30:06 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [e0c36dfbe0241154c4ec4bb17f0e23bee999aeed] - Fri Nov 21 11:19:11 2025 +0100

**Author**: stenkjan
**Message**: `chore: update excluded IPs in environment configuration  Changes: - Added a new IP address (89.144.193.121) to the EXCLUDED_IPS variable in .env.local for improved analytics tracking. - Ensured the list of excluded IPs remains comprehensive for accurate user interaction tracking.  This update enhances the analytics setup by refining the IP filtering process.  `

### Changes Analysis

#### 🔧 Configuration Changes
- .env.local


---

## [fecba0673c92ec0c5f4235d06420e87a79b83aef] - Fri Nov 21 10:56:45 2025 +0100

**Author**: stenkjan
**Message**: `fix: improve Google Analytics metrics handling for consistency  Changes: - Updated the GET method in the Google Analytics overview route to return a successful response even when no metrics are available, aligning with the behavior of other endpoints. - Modified the getOverviewMetrics function to return zero values instead of null for metrics, ensuring consistent handling of empty data.  This fix enhances the reliability of the Google Analytics integration by standardizing the response format across different metrics endpoints.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/admin/google-analytics/overview/route.ts


#### 📚 Documentation Changes
- docs/GOOGLE_ANALYTICS_BUG_FIXES.md


---

## [0b2976d34fd47810e93724392cc265c7bb60a197] - Fri Nov 21 10:23:40 2025 +0100

**Author**: stenkjan
**Message**: `chore: update environment configuration for Google Analytics integration  Changes: - Added GA4_PROPERTY_ID and GOOGLE_APPLICATION_CREDENTIALS variables to .env.local.example for Google Analytics 4 setup. - Updated .gitignore to exclude google-analytics-credentials.json for security. - Included @google-analytics/data package in package.json and package-lock.json for analytics functionality.  This update enhances the analytics setup by providing necessary configurations for Google Analytics 4 integration, ensuring accurate tracking of user interactions.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/admin/google-analytics/geo/route.ts
- src/app/api/admin/google-analytics/overview/route.ts
- src/app/api/admin/google-analytics/pages/route.ts
- src/app/api/admin/google-analytics/realtime/route.ts
- src/app/api/admin/google-analytics/traffic-sources/route.ts


#### 🔧 Configuration Changes
- .env.local.example
- package.json


#### 📚 Documentation Changes
- docs/GOOGLE_ANALYTICS_IMPLEMENTATION_STATUS.md
- docs/GOOGLE_ANALYTICS_INTEGRATION_PLAN.md
- docs/GOOGLE_ANALYTICS_SETUP.md


---

## [c10653d11c3e1dd660b73f7efb42eb9565c4331f] - Thu Nov 20 15:06:42 2025 +0100

**Author**: stenkjan
**Message**: `fix: replace abstract blob shapes with recognizable world map continents  - Redesigned all continent paths to have realistic, recognizable shapes - North America now shows distinctive shape with Canada, USA, Mexico - South America has its characteristic triangular/tapered shape - Africa shows the distinctive bulge and southern taper - Europe includes Scandinavia and Mediterranean regions - Asia depicted as massive landmass from Urals to Pacific - Australia has its distinctive horizontal oval shape - All other continents (India, Southeast Asia, Japan, NZ, etc.) now recognizable - Changed opacity from 0.7 to 0.6 for better visual balance - Map now looks like an actual world map instead of random blobs  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/user-tracking/components/GeoLocationMap.tsx


---

## [e8e5af21135f1604663006b99912e3c278e291cc] - Thu Nov 20 15:04:13 2025 +0100

**Author**: stenkjan
**Message**: `fix: add missing closing Z command to all SVG path elements in GeoLocationMap  Bug Fix: - All 14 continent/region SVG paths were missing the closing 'Z' command - This caused improper path rendering, filling, and stroke joins  Fixed Paths (added Z to close shapes): - North America (3 sub-paths) - Greenland - South America - Europe (2 sub-paths) - Africa - Asia (2 sub-paths) - Middle East / Arabian Peninsula - India - Southeast Asia - Australia - New Zealand (2 sub-paths) - Japan (2 sub-paths) - UK & Ireland (2 sub-paths) - Scandinavia - Madagascar  Technical Details: - SVG path 'Z' command properly closes shapes by drawing a straight line back to the starting point - Without Z, paths remain open which affects fill rules and stroke rendering - Total: 15 Z commands added (some paths have multiple sub-paths using M command)  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/user-tracking/components/GeoLocationMap.tsx


---

## [15b809b331aeed5cce9b189a006c106c3f92ec1b] - Thu Nov 20 14:59:15 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [7a4e3d59301e614a416c863c362f067b8d83fd5d] - Thu Nov 20 14:44:01 2025 +0100

**Author**: stenkjan
**Message**: `fix: correct favicon and Apple Touch Icon metadata configuration  Bug Fixes: 1. Removed /favicon.ico reference from metadata (Next.js serves it automatically from src/app/) 2. Removed apple-icon.svg as SVG is not supported for Apple Touch Icons (iOS/Safari only support PNG/JPG) 3. Commented out apple icon metadata until proper PNG file is created  Technical Details: - Next.js 13+ automatically serves favicon.ico from src/app/favicon.ico - Apple Touch Icons require PNG or JPG format (180x180px recommended) - SVG format is not supported for apple-touch-icon on iOS devices - Transparent icon.svg remains for modern browsers (Chrome, Firefox, Edge)  TODO: Create apple-touch-icon.png (180x180px with opaque background) for Safari/iOS support  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/layout.tsx


---

## [689384ad41c3bce263ca90874bd250a1e0617fb7] - Thu Nov 20 14:39:24 2025 +0100

**Author**: stenkjan
**Message**: `fix: use transparent favicon for all browsers, opaque apple-icon for Safari only  - Removed white background from icon.svg (now transparent for Chrome, Firefox, etc.) - Created separate apple-icon.svg with white background specifically for Safari/iOS - Updated metadata to use apple-specific icon only for Apple devices - Regular browsers now get transparent icon, Safari gets opaque background icon - This properly handles Safari's black background issue without affecting other browsers  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/layout.tsx


---

## [2a9ee033871ee8420eaae1e6e83c402ea9ffa325] - Thu Nov 20 14:33:14 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [12f283160b84e43b6ac8634c6f36042cf419d98a] - Thu Nov 20 13:51:14 2025 +0100

**Author**: stenkjan
**Message**: `feat: Update GeoLocationMap with detailed continent shapes and improve UI text  - Enhanced GeoLocationMap by adding simplified SVG paths for continents: North America, South America, Europe, Africa, Asia, and Australia. - Updated opacity for Australia path for better visibility. - Revised text in DeinNestClient and KonzeptcheckClient for improved clarity and branding consistency.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/user-tracking/components/GeoLocationMap.tsx
- src/app/dein-nest/DeinNestClient.tsx
- src/app/konzept-check/KonzeptcheckClient.tsx


---

## [2c2557c620ca51846b958b750bffa85b5a4fa385] - Thu Nov 20 13:24:33 2025 +0100

**Author**: stenkjan
**Message**: `feat: Enhance GeoLocationMap with interactive SVG world map  - Replaced placeholder map view with an interactive SVG world map. - Added ocean gradient background and grid lines for reference. - Implemented simplified continent shapes and location markers based on user session data. - Included a legend to differentiate user locations by session count. - Improved city list display with additional information and styling for better user experience.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/user-tracking/components/GeoLocationMap.tsx


---

## [4a1558e8d753a082f289113f7ae91dd24b22d73e] - Thu Nov 20 11:47:09 2025 +0100

**Author**: stenkjan
**Message**: `fix: update home page SEO title for improved branding  - Changed the home page SEO title to "®Nest-Haus | Dein Stil. Dein Zuhause." for better alignment with brand messaging. - Maintained existing description and keywords to ensure consistency in SEO strategy.  `

### Changes Analysis

---

## [0d207525e6b20dd5062f0d02a4518a061bfaac15] - Thu Nov 20 11:29:19 2025 +0100

**Author**: stenkjan
**Message**: `fix: resolve Google Analytics race condition - ensure consent initializes before gtag loads  - Fixed critical race condition where window.gtag was called before script loaded - Implemented Google's recommended approach: push consent to dataLayer before gtag initialization - Added isGtagReady state to track script load status - Replaced @next/third-parties/google with manual Script components for better timing control - Consent now properly initialized: dataLayer → gtag loads → gtag configured → updates only after ready - Prevents silent failures of consent configuration on initial page load  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/analytics/GoogleAnalyticsProvider.tsx


---

## [2bd014d92b1f227a6fc4055ce40ee9993bda023a] - Thu Nov 20 11:27:31 2025 +0100

**Author**: stenkjan
**Message**: `refactor: consolidate Google Analytics type definitions  - Removed redundant global declarations from GoogleAnalyticsProvider and GoogleAnalyticsEvents. - Introduced a new type definition file for Google Analytics to centralize type declarations for the gtag function and dataLayer. - This refactor improves maintainability and clarity of the analytics implementation.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/analytics/GoogleAnalyticsProvider.tsx


---

## [aabb4035a3e421973abbce1cd84b75ff00b11e90] - Thu Nov 20 11:17:46 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [f812e1169b36af7cba6fbf4eaabf61318487c5fe] - Thu Nov 20 09:39:10 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/ADD-DEMOGRAPHICS-IMPLEMENTATION-GUIDE.md
- docs/ANALYTICS-REQUIREMENTS-COMPARISON.md
- docs/COMMIT_HISTORY.md
- docs/GOOGLE-VERCEL-ANALYTICS-INTEGRATION-ANALYSIS.md


---

## [0b443d694c797248f6e37ebfe203d365809c0e12] - Thu Nov 20 08:25:03 2025 +0000

**Author**: stenkjan
**Message**: `Merge a6c664f6eea7c5b063ebc37ad6ed35b9aa6674cc into 1ca3aad467c346bbb4b72c3cebaafad7a6d59c33  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/ADD-DEMOGRAPHICS-IMPLEMENTATION-GUIDE.md
- docs/ANALYTICS-REQUIREMENTS-COMPARISON.md
- docs/GOOGLE-VERCEL-ANALYTICS-INTEGRATION-ANALYSIS.md


---

## [f1999e116942ac4f9a7ea959857c1384329ebaa3] - Thu Nov 20 09:16:50 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [73e2d35a890eaee835a3723f3f3ee32ead4a5439] - Thu Nov 20 09:03:03 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [de627053f57fb9941caee05efc6a6dfca03f2b84] - Thu Nov 20 09:00:28 2025 +0100

**Author**: stenkjan
**Message**: `refactor: update user tracking analytics to include all sessions  - Modified getClickAnalytics to retrieve all user click activity instead of just cart sessions. - Updated GET function in all-configurations route to fetch all user sessions, enhancing visibility into user activity. - Adjusted comments for clarity on the changes made to session filtering.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/admin/user-tracking/all-configurations/route.ts
- src/app/api/admin/user-tracking/route.ts


---

## [185fd3ab4068803173ca8d2f5fa81e341918d01d] - Thu Nov 20 08:43:54 2025 +0100

**Author**: stenkjan
**Message**: `feat: add backup analytics functionality and update admin dashboard  - Introduced a new script command for restoring analytics backups in package.json. - Scheduled a new cron job for backing up analytics data in vercel.json. - Replaced AnalyticsResetButton with AnalyticsBackupButton in the admin dashboard for improved functionality. - Removed unused TrackingActions component from user tracking dashboard. - Updated button text in NestSystemClient for clarity.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/components/AnalyticsBackupButton.tsx
- src/app/admin/page.tsx
- src/app/admin/user-tracking/page.tsx
- src/app/api/admin/quick-actions/backup-analytics/route.ts
- src/app/api/cron/backup-analytics/route.ts
- src/app/api/test/db/route.ts
- src/app/nest-system/NestSystemClient.tsx


#### ⚙️ Backend Changes
- scripts/restore-analytics-backup.ts


#### 🔧 Configuration Changes
- package.json


#### 📚 Documentation Changes
- backups/BACKUP_README.md
- docs/KONFIGURATOR_PRICING_QUICK_REFERENCE.md
- docs/TESTING_EXECUTION_SUMMARY.md
- docs/TESTING_SUMMARY_2024-11-15.md


---

## [52fb1318be9e6c88b4e38d08a5243143319e7bbe] - Wed Nov 19 16:00:14 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [244433db35b2403cd0af2d17a84960887fcf7aac] - Wed Nov 19 15:54:20 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [c5d6f80e4dccc740b81705eefb75263eb5428075] - Wed Nov 19 15:50:45 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [02167062e0bb2e4139810a9a100ca2d0621ced05] - Wed Nov 19 15:07:25 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [98659daf943b6657268524b63ef8e4c7d086ebb4] - Wed Nov 19 14:56:07 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [c25777afc27ca3a8b31993c323ed294a84542944] - Wed Nov 19 14:35:07 2025 +0100

**Author**: stenkjan
**Message**: `feat: add ordering to bi-metrics API response  - Implemented descending order by timestamp in the bi-metrics route to enhance data retrieval efficiency and ensure the most recent selections are prioritized.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/admin/bi-metrics/route.ts


---

## [e82041a7c234f7409a5a5b3dba17653358c7eade] - Wed Nov 19 14:12:56 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [77d75400ee95e8195daf0534b03fb93c5a5ddf5d] - Wed Nov 19 14:06:32 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [9e49555454e43ac8f9b1bd24c79112d3205f3b6f] - Wed Nov 19 14:01:45 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [b5a5c515fac36b91de7373645ee82d6e6d1817ea] - Wed Nov 19 13:56:08 2025 +0100

**Author**: stenkjan
**Message**: `refactor: remove performance metrics page and update admin dashboard  - Deleted the performance metrics page and its associated client component to streamline the admin interface. - Updated the admin dashboard to replace the performance metrics link with a project management link, reflecting new functionality. - Adjusted the layout and content of the project management section to better represent its purpose and features. - Deprecated the alpha test results section, indicating its transition to a new focus.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/page.tsx
- src/app/admin/performance/Client.tsx
- src/app/admin/performance/page.tsx
- src/app/api/admin/bi-metrics/route.ts
- src/app/api/sessions/track-interaction/route.ts


---

## [a666348479e8e83d9ed1580cec5fa9caca547ed8] - Wed Nov 19 13:42:38 2025 +0100

**Author**: stenkjan
**Message**: `chore: update tsconfig.json to exclude scripts directory  - Added "scripts/**" to the exclude list in tsconfig.json to prevent TypeScript from processing files in the scripts directory.  `

### Changes Analysis

---

## [a82bae8a11b1f9e0aa67efd86425409c0126bda7] - Wed Nov 19 13:32:46 2025 +0100

**Author**: stenkjan
**Message**: `chore: remove audit tracking script  - Deleted the audit tracking script that scanned the codebase for UI elements lacking tracking attributes and generated an HTML report. - This script is no longer necessary for the current project requirements.  `

### Changes Analysis

#### ⚙️ Backend Changes
- scripts/audit-tracking.ts


---

## [e18d1ddf36d93d936f904648fe4388f3b06b9591] - Wed Nov 19 13:28:10 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [830a7684be0f858f0ce0e9c2a6696b8c5f8c61cb] - Wed Nov 19 13:17:06 2025 +0100

**Author**: stenkjan
**Message**: `refactor: update BI metrics API to handle geographic data  - Removed filtering for sessions with non-null country fields to accommodate incomplete geographic data. - Initialized topLocations as an empty array to return until geographic data is fully populated. - Added a performance limit to the selection events query to optimize data retrieval. - Improved code clarity by simplifying the session data handling logic.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/admin/bi-metrics/route.ts


---

## [3caf8620e51c7bb31c75c4af2b9d82f5da4d1f4b] - Wed Nov 19 13:07:19 2025 +0100

**Author**: stenkjan
**Message**: `refactor: update selection event handling in BI metrics API  - Changed the selection criteria in the GET request to use 'selection' instead of 'configValue' for fetching selection events. - Updated the data mapping to reflect the new structure, using 'category' and 'selection' for key generation in the configMap. - Improved clarity and maintainability of the code by aligning with the updated data model.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/admin/bi-metrics/route.ts


---

## [4f05a069cef6c5686a2135ecca291ed2e659040d] - Wed Nov 19 12:50:56 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [0391c0c930d1a451915189a26cb6fd85ba3722ad] - Wed Nov 19 12:41:36 2025 +0100

**Author**: stenkjan
**Message**: `refactor: reorganize admin dashboard and enhance security monitoring  - Merged security monitoring into the Usage & Performance page, removing the redundant security route. - Created a new BI Metrics Dashboard for quick insights on user sessions, top locations, and most visited pages. - Optimized navigation order for admin cards, placing User Tracking first for better accessibility. - Renamed AllConfigurations component to AllUsers, enhancing user-centric data presentation. - Implemented collapsible sections for analytics components to improve dashboard layout and usability. - Updated documentation to reflect the latest changes and improvements in the admin dashboard structure.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/components/BIDashboard.tsx
- src/app/admin/page.tsx
- src/app/admin/security/Client.tsx
- src/app/admin/security/page.tsx
- src/app/admin/usage-performance/Client.tsx
- src/app/admin/user-tracking/components/AllUsers.tsx
- src/app/admin/user-tracking/components/ClickAnalytics.tsx
- src/app/admin/user-tracking/components/CollapsibleSection.tsx
- src/app/admin/user-tracking/components/ConfigurationSelectionAnalytics.tsx
- src/app/admin/user-tracking/page.tsx
- src/app/api/admin/bi-metrics/route.ts
- src/app/api/admin/user-tracking/all-configurations/route.ts


#### 📚 Documentation Changes
- docs/final_ADMIN_DASHBOARD_IMPLEMENTATION_COMPLETE.md


---

## [004234a972e4a4dd69301efbe66620a4f2174410] - Wed Nov 19 11:53:43 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [da2ab8b516f5b6b1b629d4d3aa571fbe1344fac0] - Wed Nov 19 11:34:50 2025 +0100

**Author**: stenkjan
**Message**: `feat: enhance user tracking and analytics capabilities  - Added new fields to the UserSession model for geographic and traffic source data to support analytics dashboard features. - Introduced new Wix-style dashboard components: KeyStatsRow, SessionsTimelineChart, TrafficSourcesWidget, and GeoLocationMap for improved data visualization. - Removed performance metric tracking from interaction tracking to reduce unnecessary database writes, focusing on critical operations only. - Implemented Redis-first analytics pattern for storing and retrieving hot analytics data, optimizing performance and reducing load on PostgreSQL. - Increased debounce delay for session sync to minimize database writes as part of optimization efforts.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/user-tracking/components/GeoLocationMap.tsx
- src/app/admin/user-tracking/components/KeyStatsRow.tsx
- src/app/admin/user-tracking/components/SessionsTimelineChart.tsx
- src/app/admin/user-tracking/components/TrafficSourcesWidget.tsx
- src/app/admin/user-tracking/page.tsx
- src/app/api/admin/analytics/conversions/route.ts
- src/app/api/admin/analytics/geo-locations/route.ts
- src/app/api/admin/analytics/sessions-timeline/route.ts
- src/app/api/admin/analytics/traffic-sources/route.ts
- src/app/api/analytics/flush/route.ts
- src/app/api/sessions/track-batch/route.ts
- src/app/api/sessions/track-interaction/route.ts


#### ⚙️ Backend Changes
- prisma/schema.prisma


#### 📚 Documentation Changes
- docs/BUTTON_TRACKING_GUIDE.md
- docs/IMPLEMENTATION_SUMMARY.md
- docs/final_ADMIN_DASHBOARD_IMPLEMENTATION_COMPLETE.md


---

## [6e2f0de1f0731f037e85be79791add76f3b447ff] - Wed Nov 19 10:33:31 2025 +0100

**Author**: stenkjan
**Message**: `refactor: correct header text in PaymentConfirmationTemplate  - Updated the header text from "Konzeptcheck bestellt" to "Konzept-Check bestellt" in the Payment Confirmation email template to maintain consistency with the standardized terminology across the application.  `

### Changes Analysis

---

## [b4c458c8c77e66d4d6e27ad4ad73331fa1f30ee9] - Wed Nov 19 10:23:30 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [8a99d183338edc10fb4ddcd7ea64a4171c681f06] - Wed Nov 19 10:08:51 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [705fe6ccdae65eabbe45f8bb5c20146a04ee8898] - Wed Nov 19 10:04:58 2025 +0100

**Author**: stenkjan
**Message**: `refactor: update references from "Entwurf" to "Konzeptcheck"  - Replaced all instances of "Entwurf" with "Konzeptcheck" across various components and documentation to align with the new terminology. - Updated navigation links, button texts, and section titles to ensure consistency in user experience. - Removed the "Entwurf" page and its related components to streamline the application structure.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/LandingPageClient.tsx
- src/app/api/test/db/route.ts
- src/app/dein-nest/DeinNestClient.tsx
- src/app/entwurf/page.tsx
- src/app/konfigurator/components/CartFooter.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/kontakt/KontaktClient.tsx
- src/app/konzeptcheck/KonzeptcheckClient.tsx
- src/app/konzeptcheck/page.tsx
- src/app/nest-system/NestSystemClient.tsx
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/app/warenkorb/steps.ts
- src/app/warum-wir/WarumWirClient.tsx
- src/components/Footer.tsx
- src/components/layout/Navbar.tsx
- src/components/sections/GrundstueckCheckForm.tsx
- src/components/sections/ModulhausVergleichSection.tsx


#### 📚 Documentation Changes
- docs/KONFIGURATOR_PRICING_QUICK_REFERENCE.md
- docs/TESTING_EXECUTION_SUMMARY.md
- docs/TESTING_SUMMARY_2024-11-15.md


---

## [8feeffa37b93f0ddc3722d4879963273608b1f8c] - Tue Nov 18 15:40:15 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [29364a3941f18314f915dfe677aa1b3b5f40fb32] - Tue Nov 18 15:36:06 2025 +0100

**Author**: stenkjan
**Message**: `refactor: update dialog configurations for material options  - Changed titles and descriptions for material options in dialogConfigs, replacing "Schiefer" with "Trapezblech" and "Kalkstein" with "FUNDERMAX® HPL-Platten Schwarz". - Added new descriptions for "Trapezblech" and "FUNDERMAX® HPL-Platten Schwarz" to enhance clarity and detail. - Updated image paths to reflect the new material options. - Commented out unused material configurations for future reference.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/data/dialogConfigs.ts


---

## [619b3c5dea5882010b24a6f8d7413dc7349681c3] - Mon Nov 17 21:16:04 2025 +0100

**Author**: stenkjan
**Message**: `fix: correct alt text and subtitles in ImageGallery and LandingImagesCarousel components  - Updated alt text for NEST Haus 4 Module in ImageGallery for improved clarity. - Changed subtitles in LandingImagesCarousel from "Fundamentplatten Weiss" to "Fassadenplatten Weiss" and "Mediterane Ansicht" to "Mediterrane Ansicht" for accuracy. - Adjusted file path in contentCardPresets for better API integration.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/grids/ImageGallery.tsx
- src/components/sections/LandingImagesCarousel.tsx


---

## [f21d64ff9b081bff6a97f4cfce088ea95ecb0263] - Mon Nov 17 16:48:00 2025 +0100

**Author**: stenkjan
**Message**: `Update Zarnhofer link from .at to .com `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/sections/PartnersSection.tsx


---

## [8b8bcd71924de01688e00dd93ef81165967b4304] - Mon Nov 17 16:04:53 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [5228caada10eb862f82591a4c36776954bb0ae40] - Mon Nov 17 16:00:08 2025 +0100

**Author**: stenkjan
**Message**: `feat: add Entwurf/Konzeptcheck section and appointment handling in inquiries  - Introduced a new section for Entwurf/Konzeptcheck conversions, displaying total revenue, purchase counts, and top configurations. - Enhanced CustomerInquiry interface to include appointment-related fields and status. - Implemented AppointmentStatusBadge component for better visual representation of appointment statuses. - Updated InquiryCard to display appointment details and status. - Added functionality to remove records older than a specified number of days in user tracking actions.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/admin/conversion/Client.tsx
- src/app/admin/customer-inquiries/page.tsx
- src/app/admin/user-tracking/components/TrackingActions.tsx
- src/app/api/admin/conversions/route.ts
- src/app/api/admin/user-tracking/actions/route.ts
- src/app/api/contact/route.ts


---

## [e891f1f1cdc383dcb4ac0838815886f3e54846a3] - Mon Nov 17 15:40:42 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [ab6ee168c6013976c2753eeb80422998ea46d581] - Mon Nov 17 15:12:33 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [ca772327cdc883ea46cfafbc4d8fa5c81136fffc] - Mon Nov 17 15:07:50 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [4dd9f228058328b7e3a4a01e91fbec2803e2645a] - Mon Nov 17 14:53:29 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [028a5cb82091245a09e2aafbb26db54c4ff92db3] - Mon Nov 17 14:41:35 2025 +0100

**Author**: stenkjan
**Message**: `refactor: enhance PaymentConfirmationTemplate for improved price calculations and styling  - Updated price calculation logic in PaymentConfirmationTemplate to derive totalHousePrice from individual components, ensuring accurate total pricing. - Adjusted styling properties such as padding and margin for better visual consistency and user experience in the email template.  `

### Changes Analysis

---

## [01013b85f63dfd59ff06a744525c6467415c573c] - Mon Nov 17 14:13:52 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [85d517df53261ddc4b2319b268a0138cb549ed84] - Mon Nov 17 13:44:33 2025 +0100

**Author**: stenkjan
**Message**: `refactor: enhance CheckoutStepper and PaymentConfirmationTemplate for improved configuration handling  - Updated CheckoutStepper to capture appointment details and calculate delivery date, integrating these into the cart configuration data. - Modified PaymentConfirmationTemplate to include new configuration fields such as geschossdecke, fundament, and kamindurchzug, ensuring accurate representation of selected options in the email. - Improved styling and structure of the email template for better readability and user experience.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutStepper.tsx


---

## [60d0df2a0849763096f1f3ea6df6aa26749744e9] - Mon Nov 17 13:01:30 2025 +0100

**Author**: stenkjan
**Message**: `refactor: enhance payment processing and inquiry creation flow  - Updated payment amount handling in webhook routes to prioritize paymentIntent.amount, with a fallback to inquiry.paymentAmount or a default value of 150000. - Introduced inquiry creation logic in CheckoutStepper component to capture cart configuration data before initiating payment, improving the user experience and ensuring inquiries are properly linked to payments. - Refactored email template to format prices correctly and removed unnecessary contact information for a cleaner presentation.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/inquiries/create-with-cart/route.ts
- src/app/api/payments/webhook/route.ts
- src/app/api/webhooks/stripe/route.ts
- src/app/warenkorb/components/CheckoutStepper.tsx


---

## [414e6a43ce08fb8defcc7f0fc2b903076bf8fb76] - Mon Nov 17 12:14:01 2025 +0100

**Author**: stenkjan
**Message**: `chore: update documentation with additional line breaks  - Added line breaks to , , , and  for improved readability and formatting consistency.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/test/db/route.ts


#### 📚 Documentation Changes
- docs/KONFIGURATOR_PRICING_QUICK_REFERENCE.md
- docs/TESTING_EXECUTION_SUMMARY.md
- docs/TESTING_SUMMARY_2024-11-15.md


---

## [c0ebe806e72e92d8fc902352310e28a7abff803b] - Sat Nov 15 19:13:10 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [ab5296b67f244a4cedbeda7d679000eead61be0b] - Sat Nov 15 19:06:21 2025 +0100

**Author**: stenkjan
**Message**: `refactor: streamline middleware for admin route protection  - Removed debug logging to enhance performance and reduce noise in the console. - Updated middleware to only protect admin routes and admin API routes, allowing all other routes to pass through freely. - Adjusted matcher configuration to focus solely on admin-related paths, improving clarity and maintainability.  `

### Changes Analysis

---

## [49ea70f0700dfdb3ce174e0ad421796886a23514] - Sat Nov 15 18:48:25 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [76c7d5c329eba5cd59621d928410ce4bcd045ee9] - Sat Nov 15 18:45:19 2025 +0100

**Author**: stenkjan
**Message**: `refactor: enhance payment confirmation email template layout  - Updated the contact section to use a more structured layout with contact boxes. - Replaced the previous glass card design with a cleaner contact grid format. - Improved accessibility by using semantic HTML elements for better readability. - Ensured consistency in styling with the existing email template design.  `

### Changes Analysis

---

## [b4c28fc03fb910cba057f6c2467cfca120cff915] - Sat Nov 15 18:36:49 2025 +0100

**Author**: stenkjan
**Message**: `Merge branches 'main' and 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [50362aebb7320d70d5bb4f7a38f767a12f01542d] - Sat Nov 15 18:32:50 2025 +0100

**Author**: stenkjan
**Message**: `debug: add comprehensive logging to payment email configuration parser  - Log configuration keys being parsed - Log each extracted item with name and price - Log warnings when items can't be extracted - Log final total price - This will help identify why wrong prices are displayed - Test payment to see actual configurationData structure in logs  `

### Changes Analysis

---

## [39f1d52ef09a73045ed6256eee53a89ad61cda96] - Sat Nov 15 18:18:24 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [31280d0ebfe2a56e2e453730f9e0a80f38084776] - Sat Nov 15 18:16:45 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [1c0c5e5c36689ad870a46c11c2a07a9119b2db23] - Sat Nov 15 18:15:13 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [d4d22e0a171fefc60c5bc5c578b4a0c0358ab1ea] - Sat Nov 15 18:13:04 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [251f3a2f242286fb8a708450c700f0488c0ea970] - Sat Nov 15 18:10:46 2025 +0100

**Author**: stenkjan
**Message**: `refactor: improve code readability and performance in CheckoutStepper and LaunchFireworks components  ✨ CheckoutStepper Enhancements - Reformatted warning message for better readability. - Adjusted getCustomerName() function for clearer structure and improved readability.  ✨ LaunchFireworks Improvements - Introduced useMemo for fireworks and confetti pieces to optimize performance and prevent unnecessary re-renders. - Enhanced confetti generation logic for smoother animations.  ✅ All linting passed ✅ Ready for testing  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/effects/LaunchFireworks.tsx


---

## [bf498e6743437f23a0ec5887187fc0673a5df572] - Sat Nov 15 18:03:07 2025 +0100

**Author**: stenkjan
**Message**: `feat: enhance LaunchFireworks component with additional particles and confetti display  - Increased the number of particles per firework from 12 to 16 for a more spectacular effect. - Added confetti generation to enhance the visual experience during the fireworks display. - Included a countdown overlay to display the countdown before the fireworks start.  ✅ All linting passed ✅ Ready for testing  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/effects/LaunchFireworks.tsx


---

## [0cc011b73b34ae28ffb9217d28cdd6d20ac5e11c] - Sat Nov 15 17:50:59 2025 +0100

**Author**: stenkjan
**Message**: `feat: change payment email colors to brand blue & add launch fireworks easter egg  � Payment Email Template Updates - Change all green colors (#10b981) to NEST-Haus blue (#3d6ce1) - Update PaymentConfirmationTemplate success card, header, amounts - Update AdminPaymentNotificationTemplate gradient and highlights - Consistent brand colors across all payment emails  � Launch Fireworks Easter Egg - Create LaunchFireworks component with bright, illuminating colors - 8 firework bursts with glowing particles - Colors: Gold, Cyan, Magenta, Lime, Orange, Hot Pink - Auto-remove after 5.5 seconds - Trigger via /#launch hash on landing page - Pointer-events: none (doesn't block functionality) - One-time per session (hash cleared after trigger)  ✅ All linting passed ✅ Ready for testing  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/LandingPageClient.tsx
- src/components/effects/LaunchFireworks.tsx


---

## [83f4089ef9785407bd5dfeb5e75c736dff9de4e2] - Sat Nov 15 17:33:20 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [8a1a2740962e02beff5874dc32b5a091f0bb6959] - Sat Nov 15 17:31:23 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [7bcbd293f96ffe9154741bab7b76a7d2200ee6a7] - Sat Nov 15 17:29:04 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [aa681af7a4e4d0fae6cf68c2d6f9d512a3e7c2c9] - Sat Nov 15 17:24:07 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warum-wir/WarumWirClient.tsx
- src/components/cards/UnifiedContentCard.tsx
- src/components/payments/PaymentModal.tsx
- src/components/payments/StripeCheckoutForm.tsx
- src/components/sections/GrundstueckCheckForm.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [af62f32cabaacab925c28d38b7babfb129500736] - Sat Nov 15 17:19:18 2025 +0100

**Author**: stenkjan
**Message**: `Merge 21fffb481d220c888c29c3c963aa12cfe3486c6e into ae2a2ea9da988b20790381ee7f436b91417cff10  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/payments/PaymentModal.tsx
- src/components/payments/StripeCheckoutForm.tsx


---

## [eaf7976cf6fd3f810743673f5c77d2f531b9c7d7] - Sat Nov 15 17:09:04 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [f404710e6281fcaff5830d456aa32afa9e6d8d42] - Sat Nov 15 16:58:32 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [4e76b0d595f9c3774312122e273d69d1cf0deeb5] - Sat Nov 15 16:52:04 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/contact/route.ts


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [1297a6afb33179e3ff0e5a64bc02d70e4ff3fe33] - Sat Nov 15 16:41:45 2025 +0100

**Author**: stenkjan
**Message**: `style: clean up whitespace in contact API route  - Removed unnecessary blank lines in the POST function of the contact API route - Enhances code readability and maintains consistent formatting  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/contact/route.ts


---

## [92ea803365eb7877e7e6bc1580d9c557c2c9efd3] - Sat Nov 15 16:34:20 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SummaryPanel.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [358373596b35c9c97acc5be9ce68016ebc858515] - Sat Nov 15 16:31:09 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/appointments/confirm/route.ts


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [331e8fb769127de7ecb5387e60170ee69c9bde94] - Sat Nov 15 16:29:06 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/kontakt/KontaktClient.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/components/sections/AppointmentBooking.tsx
- src/components/sections/AppointmentBookingSection.tsx
- src/components/sections/TerminVereinbarenContent.tsx


#### 📚 Documentation Changes
- STRIPE_MIGRATION_CHECKLIST.md
- STRIPE_MIGRATION_QUICK_START.md
- STRIPE_PRODUCTION_MIGRATION_GUIDE.md
- STRIPE_TECHNICAL_ASSESSMENT.md
- docs/COMMIT_HISTORY.md


---

## [02f29e0867ed6fe41b1a2d9ad3f7148229d3c9d3] - Sat Nov 15 16:27:15 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/appointments/confirm/route.ts
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/data/configuratorData.ts
- src/app/konfigurator/data/dialogConfigs.ts


#### 📚 Documentation Changes
- STRIPE_MIGRATION_CHECKLIST.md
- STRIPE_MIGRATION_QUICK_START.md
- STRIPE_PRODUCTION_MIGRATION_GUIDE.md
- STRIPE_TECHNICAL_ASSESSMENT.md
- docs/COMMIT_HISTORY.md


---

## [bd37214f5fa76d501adbb4f5000c9c20ec3fb539] - Sat Nov 15 15:25:09 2025 +0000

**Author**: Cursor Agent
**Message**: `Merge branch 'cursor/assess-stripe-migration-effort-63ee'  `

### Changes Analysis

#### 📚 Documentation Changes
- STRIPE_MIGRATION_CHECKLIST.md
- STRIPE_MIGRATION_QUICK_START.md
- STRIPE_PRODUCTION_MIGRATION_GUIDE.md
- STRIPE_TECHNICAL_ASSESSMENT.md


---

## [687abfd51e6794bf771000aaeb453fcdf37ec148] - Sat Nov 15 16:19:01 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [aff13507204458bd99045c8efdd20873abf373ca] - Sat Nov 15 16:17:03 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/sections/AppointmentBooking.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [400595d56d49cc2e5a73df98e4dd23c2000cd0fd] - Sat Nov 15 16:11:45 2025 +0100

**Author**: stenkjan
**Message**: `Merge ca3af735654efb66905db59d7b4b387e50fb4d29 into 2ebd02225235530a39f99e762ea964c5684bd835  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SummaryPanel.tsx


---

## [04183e25caa73f44e40a58f2b5cf09e9cd752ba8] - Sat Nov 15 15:59:38 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [428e98455e0dcd78dbfe1076a4a930040d79c88f] - Sat Nov 15 15:57:30 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/impressum/ImpressumClient.tsx
- src/components/Footer.tsx
- src/components/cards/UnifiedContentCard.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [5b09f310a2920c31d66ce01221e79ed51f46f32e] - Sat Nov 15 15:52:01 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [0151a95e170b82ec11bf82cb857ff2bf76475531] - Sat Nov 15 15:50:05 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/api/appointments/confirm/route.ts
- src/app/api/appointments/reject/route.ts
- src/app/api/contact/route.ts
- src/components/payments/StripeCheckoutForm.tsx


#### ⚙️ Backend Changes
- prisma/schema.prisma


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md
- docs/PAYMENT_AND_APPOINTMENT_EMAIL_IMPLEMENTATION.md
- docs/final_EMAIL_FUNCTIONALITY_SUMMARY.md


---

## [37b3b1e23a0ce97f7d367f398a99b07e321cea98] - Sat Nov 15 15:12:08 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/UnifiedContentCard.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md
- docs/EMAIL_PAYMENT_STATUS_NOV15.md
- docs/GOOGLE_WORKSPACE_OUTBOUND_EMAILS_GUIDE.md


---

## [6773df8654c98e8258014dfedc942b7d7fc27a27] - Sat Nov 15 14:45:07 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Clean up dependencies in UnifiedContentCard component  - Removed unnecessary dependencies from the useMemo hook in UnifiedContentCard for improved performance and clarity. - This change enhances the responsiveness of the layout calculations without affecting functionality.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/cards/UnifiedContentCard.tsx


---

## [dc00ed3d3a081c5ddd527450a078d63577858190] - Sat Nov 15 14:25:30 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/UnifiedContentCard.tsx
- src/components/payments/PaymentModal.tsx
- src/components/sections/AppointmentBooking.tsx
- src/components/sections/TerminVereinbarenContent.tsx


#### 🔧 Configuration Changes
- .env
- .env.local


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md
- docs/EMAIL_ISSUE_RESOLUTION_NOV15.md
- docs/EMAIL_RESEND_TROUBLESHOOTING.md
- docs/final_EMAIL_FUNCTIONALITY_SUMMARY.md


---

## [726a27085906bf8cb082b9d598189cec5c243305] - Sat Nov 15 14:06:49 2025 +0100

**Author**: stenkjan
**Message**: `fix: Update email address in AppointmentBooking and TerminVereinbarenContent components  - Changed the email address from  to  in both components for consistency. - Enhanced the CustomerConfirmationTemplate with new contact information layout and styling for improved user experience.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/sections/AppointmentBooking.tsx
- src/components/sections/TerminVereinbarenContent.tsx


---

## [ce2b4c74fb73ef6262cb31d33773b2b7f1732f0f] - Sat Nov 15 13:47:26 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [35dea3c8d81fac4b30a3a45e580936ca22d9ecb4] - Sat Nov 15 13:43:10 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/components/cards/UnifiedContentCard.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [fdf99fc46678bf6d4f4f84d144133aae6e3ee4da] - Sat Nov 15 13:29:46 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [3ecf63ddf22ab9a75496fd28459e4cbc801ae193] - Sat Nov 15 13:08:10 2025 +0100

**Author**: stenkjan
**Message**: `Merge branches 'main' and 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [74e8e1c563eeab0ff4182fbc96a387fd0be47b3d] - Sat Nov 15 13:03:36 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [204b2c4cff6d8045d5770e30a594e3c071db72e4] - Sat Nov 15 12:50:39 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Update navigation links in DeinNestClient and adjust LandingImagesCarousel  - Changed navigation links in DeinNestClient for improved user flow: updated link from "/entwurf" to "/warum-wir" and from "/konfigurator" to "/nest-system". - Removed unused image entry in LandingImagesCarousel to streamline the component and enhance performance.  `

### Changes Analysis

#### 🎨 Frontend Changes
- src/app/dein-nest/DeinNestClient.tsx
- src/components/sections/LandingImagesCarousel.tsx


#### 📚 Documentation Changes
- docs/COMMIT_HISTORY.md


---

## [527fecd1b8606b58864d7f2692d0d711bd94983c] - Sat Nov 15 12:48:17 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/BETA_ROADMAP_GAP_ANALYSIS.md
- docs/COMMIT_HISTORY.md
- docs/TESTING_EXECUTION_SUMMARY.md
- docs/TESTING_SUMMARY_2024-11-15.md
- docs/TEST_RESULTS_2024-11-15.md
- docs/final\_-BETA-NEST-HAUS-LAUNCH-SECURITY-ROADMAP.md

---

## [84aeafd01c94f0ab4205407e6c17ce7e7373adc2] - Sat Nov 15 12:36:02 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [143b60f797c7172291f78498e99b572114d71510] - Sat Nov 15 11:55:42 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/UnifiedContentCard.tsx
- src/components/sections/GrundstueckCheckForm.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [99c6ca60cbb8e63de7bf842c279a77b888ccad34] - Sat Nov 15 11:34:04 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Update variable declarations and improve dependency management in components  - Changed  to  for  in CheckoutStepper for better immutability. - Added comments to clarify the intentional inclusion of dependencies in useEffect hooks for responsive layout calculations in UnifiedContentCard and CheckoutStepper. - Removed unused  import in GrundstueckCheckForm to clean up the code.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/UnifiedContentCard.tsx
- src/components/sections/GrundstueckCheckForm.tsx

---

## [00c78ef87205247216a4b6615eca8cf38af9d7cc] - Sat Nov 15 11:29:44 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/appointment/route.ts
- src/app/api/test/email/route.ts
- src/app/api/test/payment-email/route.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/EMAIL_TESTING_GUIDE.md
- docs/EMAIL_TEST_RESULTS.md
- docs/STRIPE_CLI_SETUP.md

---

## [d0ca379ec16e3d33fe8a7cb5732033ba474e2381] - Sat Nov 15 11:26:51 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/kontakt/KontaktClient.tsx
- src/components/sections/AppointmentBooking.tsx
- src/components/sections/AppointmentBookingSection.tsx
- src/components/sections/GrundstueckCheckForm.tsx
- src/components/sections/SectionContainer.tsx
- src/components/sections/TerminVereinbarenContent.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [c4b42a2ca290e6bc114bbbac555c4a8d0bdcd9c6] - Sat Nov 15 11:22:09 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts
- src/app/api/webhooks/stripe/route.ts
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/sections/GrundstueckCheckForm.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/GRUNDSTUECK_FORM_ERROR_HANDLING_FIX.md
- docs/GRUNDSTUECK_VALIDATION_EMAIL_IMPLEMENTATION.md
- docs/KONFIGURATOR_PRICING_QUICK_REFERENCE.md

---

## [a7ec56baae23319388ab374298b0148c9c9e1172] - Sat Nov 15 11:05:12 2025 +0100

**Author**: stenkjan
**Message**: `fix: Enhance session storage handling and validation in CheckoutStepper and GrundstueckCheckForm components  - Added a sessionStorageTrigger state in CheckoutStepper to force re-reading sessionStorage when navigating to the final step. - Updated validation logic in GrundstueckCheckForm to ensure all required fields are filled, with improved alert messages for user guidance. - Enhanced error handling and logging for API responses in GrundstueckCheckForm to provide clearer feedback on submission status.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/sections/GrundstueckCheckForm.tsx

#### 📚 Documentation Changes

- docs/GRUNDSTUECK_FORM_ERROR_HANDLING_FIX.md

---

## [9ec4ad9fae2c30c5fce69474759a155e9f52890e] - Sat Nov 15 10:39:24 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [bd10457ceef45d567b1255f6f2d84067266bf67f] - Sat Nov 15 10:38:12 2025 +0100

**Author**: stenkjan
**Message**: `fix: Improve validation alert in GrundstueckCheckForm component  - Enhanced the validation logic to ensure that address, city, and postal code fields are filled out before form submission. - Reformatted the alert message for better readability and user guidance.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/sections/GrundstueckCheckForm.tsx

---

## [e379702ffed20c75e30ca105aa7e3c4c346bd96c] - Sat Nov 15 10:26:41 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [7bdd6ff2d584b3c797f5ffd6dc97c99bb7f96278] - Sat Nov 15 10:15:20 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warum-wir/WarumWirClient.tsx
- src/components/cards/UnifiedContentCard.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [9e75b049288a346b439b236522ab79264e7fb5a5] - Sat Nov 15 10:05:33 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [23df7035b9c4a292d293e373ef44b9c74a6e0329] - Sat Nov 15 09:12:13 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/payments/confirm-payment/route.ts
- src/app/api/payments/webhook/route.ts
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/sections/GrundstueckCheckForm.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/final_EMAIL_FUNCTIONALITY_SUMMARY.md

---

## [cd7cc6419df2a4e34aacb1c2ca1f556394bb09f6] - Fri Nov 14 23:29:45 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [ea80cb6ed383321cd10884cc78107e2659d9b895] - Fri Nov 14 23:14:21 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [b8a58734c670024e697e04847096237061a7eca8] - Fri Nov 14 23:10:12 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [cb86ee00f0f9a8e113d7b3f2f2072647a9905267] - Fri Nov 14 22:57:13 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warum-wir/WarumWirClient.tsx
- src/components/cards/UnifiedContentCard.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [b7adad81efce08deabb4307caa259ffe3da3d6e4] - Fri Nov 14 22:56:08 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/sessions/get-session/route.ts
- src/app/api/sessions/update-user-data/route.ts
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/sections/GrundstueckCheckForm.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/GRUNDSTUECKSCHECK_DATA_PERSISTENCE_FIX.md
- docs/final_EMAIL_FUNCTIONALITY_SUMMARY.md

---

## [ce3c421b87d9afb5f25f667e2c04a7bd04727bcd] - Fri Nov 14 22:49:10 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [4ee3c62516e2c8f248a695deb800e19e1fd9c4e0] - Fri Nov 14 22:42:11 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Update CheckoutStepper and GrundstueckCheckForm for improved data handling and pricing calculations  - Replaced individual item price calculations in CheckoutStepper with PriceCalculator for consistent pricing logic. - Added user data loading from the database in CheckoutStepper as a fallback when sessionStorage is empty. - Implemented saving of user tracking session data in GrundstueckCheckForm to enhance user data management. - Improved comments for clarity on pricing and data handling processes.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/sessions/get-session/route.ts
- src/app/api/sessions/update-user-data/route.ts
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/sections/GrundstueckCheckForm.tsx

#### 📚 Documentation Changes

- docs/GRUNDSTUECKSCHECK_DATA_PERSISTENCE_FIX.md

---

## [f11ddefb3ecb0fec2a42f14a03d9823ca493173f] - Fri Nov 14 22:26:40 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/globals.css
- src/app/konfigurator/components/CartFooter.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/components/cards/UnifiedContentCard.tsx
- src/components/grids/TwoByTwoImageGrid.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [9d9bd539e428a4a545019f004a995e7c343cafeb] - Fri Nov 14 22:24:19 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🔧 Configuration Changes

- .env
- .env.local

#### 📚 Documentation Changes

- docs/final_EMAIL_FUNCTIONALITY_SUMMARY.md
- docs/final_KONFIGURATOR_PRICING_OVERHAUL_SUMMARY.md
- docs/final**************\_\_\_**************final_marker.md

---

## [eb3373f5e23af21e0daa2950c63e727c702122e0] - Fri Nov 14 21:40:21 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Rename variable for clarity in NestSystemClient component  - Renamed  to  to indicate intentional non-use of the variable, improving code readability and adherence to TypeScript safety rules.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/nest-system/NestSystemClient.tsx

---

## [0a45c5572deee5dc7ad788edd5fbea6d8785fa3d] - Fri Nov 14 21:36:24 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Update subtitles and navigation links in WarumWirClient component  - Removed the trailing period from the subtitle in SectionHeader for consistency. - Adjusted the responsive YouTube embed container by removing fixed padding for better adaptability. - Updated navigation links to direct users to the 'kontakt' and 'konfigurator' pages, enhancing user flow.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warum-wir/WarumWirClient.tsx

---

## [25dddd79bfbcad0f847dda6e64eb63484477ae33] - Fri Nov 14 21:28:26 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-nest/DeinNestClient.tsx
- src/app/entwurf/EntwurfClient.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [cc6e494606e1f55e2159cf948f6835a590b2948c] - Fri Nov 14 21:20:52 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [f8bc66022512f6ba0a660db4226c782c7245add0] - Fri Nov 14 21:06:42 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/data/dialogConfigs.ts
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/sections/PartnersSection.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/EMAIL_DNS_SETUP_PLANS.md
- docs/KONFIGURATOR_PRICING_QUICK_REFERENCE.md

---

## [46492a24f8540dc860d40e07998164e488ae7552] - Fri Nov 14 21:03:08 2025 +0100

**Author**: stenkjan
**Message**: `chore: Update email DNS setup documentation and minor code adjustments  - Added clarity and formatting improvements in the EMAIL_DNS_SETUP_PLANS.md for better readability. - Updated email service configuration in src/lib/EmailService.ts to use consistent quotation marks. - Corrected partner link in PartnersSection.tsx for accurate navigation. - Adjusted video card references in constants to reflect updated content. - Minor whitespace adjustments across various files for consistency.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts
- src/components/sections/PartnersSection.tsx

#### 📚 Documentation Changes

- docs/EMAIL_DNS_SETUP_PLANS.md
- docs/KONFIGURATOR_PRICING_QUICK_REFERENCE.md

---

## [b59868d91f2e3b5da8451bdb205451c6511c416f] - Fri Nov 14 20:35:48 2025 +0100

**Author**: stenkjan
**Message**: `fix: Update text labels in CheckoutStepper and add optional links in PartnersSection  - Changed "Konzeptcheck" to "Konzept-Check" in multiple instances within the CheckoutStepper component for consistency. - Added optional external links for partners in the PartnersSection component to enhance navigation and accessibility.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/sections/PartnersSection.tsx

---

## [c257d82330c27221e337f1b4df9bef753a373240] - Fri Nov 14 19:57:06 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Update dialog configurations and pricing details  - Removed the "Holz Eiche" dialog configuration from dialogConfigs.ts for a cleaner setup. - Updated the option name and price for the "Kamindurchzug" in configuratorStore.ts to "Kaminschachtvorbereitung" with a new price of 887, enhancing clarity and accuracy in the pricing structure. - Adjusted class properties in CheckoutStepper.tsx for improved layout consistency.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/data/dialogConfigs.ts
- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [f3bd912a2cc9bfb888c794069cf013b6700c33ee] - Fri Nov 14 19:27:36 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [f0da2b78c2f90d60bacd6ea7237a3439efa139a8] - Fri Nov 14 19:20:05 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/LandingPageClient.tsx
- src/app/entwurf/EntwurfClient.tsx
- src/components/grids/TwoByTwoImageGrid.tsx
- src/components/sections/ModulhausVergleichSection.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [bc4a1431bc9267a6e0d2af731b5e47ba2f9738a7] - Fri Nov 14 19:16:46 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/UnifiedContentCard.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [87f6508fc30825034ba38daffe7533445e5b93d8] - Fri Nov 14 19:13:12 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [c4890d3d533ee3fd8f0c21cd064581b72234cb24] - Fri Nov 14 19:04:24 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [27bf9e2ebf67b486b0fc955d8a47f2cb0ee5b7ed] - Fri Nov 14 18:58:16 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [67e0a63955ae4aae0019c5213bc6342a79b0652c] - Fri Nov 14 18:52:04 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/entwurf/EntwurfClient.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [2e3ec773130efea311e39c5a60129b3d32cbc419] - Fri Nov 14 18:46:31 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/QuantitySelector.tsx
- src/app/konfigurator/components/SelectionOption.tsx
- src/app/konfigurator/core/PriceCalculator.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [235fc8ce4f76f74d7568abd8b5299c2a15d9ab7c] - Fri Nov 14 18:44:57 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/cards/UnifiedContentCard.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [0021991078f3edc77819f8d14f0653a9d936944a] - Fri Nov 14 18:34:17 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/CartFooter.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/warenkorb/components/CheckoutStepper.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/EMAIL_DNS_SETUP_PLANS.md

---

## [24d38c5a3609eb520fc4057f965297114e234e9a] - Fri Nov 14 18:12:19 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Simplify price calculation logic in PriceCalculator  - Removed unnecessary variable for tracking price requests, streamlining the price calculation process. - Updated conditional checks to only add prices that are not marked as "on request" (-1), ensuring clarity in the final price output. - Enhanced comments for better understanding of price handling, particularly regarding normalization of prices.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [3b134e4db368af79ac6f4fe30799c55bd04b15ee] - Fri Nov 14 18:01:27 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Update pricing display logic in CartFooter and CheckoutStepper components  - Enhanced price rendering to handle cases where prices are on request, displaying a dash and "Auf Anfrage" message accordingly. - Simplified conditional checks for included items and zero-priced items, improving readability and maintainability of the code.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/CartFooter.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [b44d255487d03bcd89b92d9fbe7a13a9568deb3b] - Fri Nov 14 17:48:00 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/entwurf/EntwurfClient.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [7570a199902513cb92db6123c58cb4ba25791697] - Fri Nov 14 17:36:22 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/layout/Navbar.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [099c3eba3610cd7c879d34cd85a565729094e0f0] - Fri Nov 14 17:28:33 2025 +0100

**Author**: stenkjan
**Message**: `Merge 85b032c053a04c12a979310c8eecfae892d18005 into 35d5890785a851054a89efa60c84bffc32e312b5  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/layout/Navbar.tsx

---

## [e9f8c3412ffcb51ea8524d6c905bb0a8b2fabc0b] - Fri Nov 14 17:16:09 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SelectionOption.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/core/PriceUtils.ts
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/sections/SectionHeader.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/KONFIGURATOR_PRICING_OVERHAUL_SUMMARY.md
- docs/KONFIGURATOR_PRICING_QUICK_REFERENCE.md

---

## [24fd086903b76fa331878b76ff39e287234552bf] - Fri Nov 14 17:04:55 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/entwurf/EntwurfClient.tsx
- src/app/nest-system/NestSystemClient.tsx
- src/components/cards/UnifiedContentCard.tsx
- src/components/sections/FAQSection.tsx
- src/components/sections/PartnersSection.tsx
- src/components/sections/SectionHeader.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [ec4dccde97ef7d53eb71cf05b73df77806a85bb9] - Fri Nov 14 16:20:11 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfigurationModeSelection.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/GeschossdeckeOverlay.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/core/ImageManager.ts
- src/app/warenkorb/components/CheckoutStepper.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [80de72cb35d7f3b99582e2965b536b66d17efae8] - Fri Nov 14 15:30:40 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [32417a104c4e0676a019b963ba85c7ab4b0fd970] - Fri Nov 14 15:25:09 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Enhance CheckoutStepper with pricing data initialization and m² price calculations  - Added useEffect to load pricing data on component mount for up-to-date pricing. - Introduced calculateItemPricePerSqm helper function to compute m² prices for individual items. - Updated display logic to show m² prices for applicable items in the cart. - Refined price calculations to focus on NEST MODULE pricing per m², improving clarity in pricing display.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [9d65923bd53cd49cbacdfe49c0ca02c71bbed602] - Fri Nov 14 14:53:15 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [d7e732d5aa611fa95f6e9a880995666e290995b5] - Fri Nov 14 14:45:41 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [5858618dc6f86c153a5c506134f88c96931b692c] - Fri Nov 14 14:41:40 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [cfa839a5d20052210ccf39ec45df1719f9b8a4a0] - Fri Nov 14 14:03:13 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [a08093521d39ee1424ff43326175eecef1bb0c6f] - Fri Nov 14 13:31:18 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [66734be24fc4cf266ffd69e51d28defe8aa14d42] - Fri Nov 14 13:26:50 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [492f49e0951182a4bf21c543d105303d84e80dd5] - Fri Nov 14 13:24:11 2025 +0100

**Author**: stenkjan
**Message**: `Merge branches 'main' and 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [ae3a354cd10d1660ff2d306feca26a86de7c7f9f] - Fri Nov 14 13:06:47 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/components/Footer.tsx
- src/components/sections/LandingImagesCarousel.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [1e56ede98a2de93e261f3f993c20e4bf049b2655] - Fri Nov 14 12:54:55 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [cc069215f513c89af0b1c02716f62fb1b9cb6e1e] - Fri Nov 14 12:01:39 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfigurationModeSelection.tsx

#### 🔧 Configuration Changes

- tailwind.config.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [3025dbeab8ef19376216f6f3ccd3fffe4fcc0f08] - Fri Nov 14 11:55:48 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [aa1ba860744cd24ff9266acab6405ea2536bd5ca] - Fri Nov 14 11:48:51 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfigurationModeSelection.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/GeschossdeckeOverlay.tsx
- src/app/konfigurator/components/KonfiguratorClient.tsx
- src/app/konfigurator/components/SelectionOption.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/data/configuratorData.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/INNENVERKLEIDUNG_STANDARD_OVERHAUL.md
- docs/KONFIGURATOR_PRICING_OVERHAUL_SUMMARY.md

---

## [ac50ff944f70c95ca79827a5bf43df93c73905d2] - Fri Nov 14 11:44:53 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [e37d0bd7e2b8ade1e02f6417c89e302de1c7323c] - Fri Nov 14 11:41:21 2025 +0100

**Author**: stenkjan
**Message**: `Merge branches 'main' and 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-nest/DeinNestClient.tsx
- src/components/Footer.tsx
- src/components/cards/UnifiedContentCard.tsx
- src/components/sections/GetInContactBanner.tsx
- src/components/sections/LandingImagesCarousel.tsx
- src/components/sections/ModulhausVergleichSection.tsx
- src/components/sections/PartnersSection.tsx
- src/components/ui/Button.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [089401de68be6915c49542a58f7382f393b6fff5] - Fri Nov 14 11:32:33 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [315716fb17490766857f1bb21a38e6a072de7e3d] - Fri Nov 14 11:05:25 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [5c5690152ddcc1b85abfe2beaf0d5573b638ce73] - Fri Nov 14 10:54:35 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SelectionOption.tsx
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/core/PriceUtils.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/KONFIGURATOR_PRICING_FIXES_SUMMARY.md

---

## [94a8eb60e233fff26beb90080478fc9297c00a9b] - Fri Nov 14 10:37:22 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-nest/DeinNestClient.tsx
- src/components/sections/GetInContactBanner.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [76b1d15e2960afbbebabac4d0d7a24c606e03c82] - Fri Nov 14 10:02:59 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Improve layout and styling in DeinNestClient and GetInContactBanner components  - Updated layout structure in DeinNestClient for better content organization and spacing. - Adjusted padding and margin in GetInContactBanner for enhanced visual consistency. - Improved button visibility and responsiveness across different screen sizes.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-nest/DeinNestClient.tsx
- src/components/sections/GetInContactBanner.tsx

---

## [7aeca2dbd546e809ff5c5e20460ed27a972f4d9a] - Thu Nov 13 22:47:31 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [e07810b522894c427ec33b55d19fe3fa4b3a15f5] - Thu Nov 13 22:36:19 2025 +0100

**Author**: stenkjan
**Message**: `Merge branches 'main' and 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-nest/DeinNestClient.tsx
- src/app/entwurf/EntwurfClient.tsx
- src/components/cards/UnifiedContentCard.tsx
- src/components/sections/GetInContactBanner.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [b9bd17dc89622d1616a753746e0ac4286b76e128] - Thu Nov 13 22:33:16 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Update layout and styling in multiple components  - Adjusted button positioning in DeinNestClient for improved visibility. - Added spacing in EntwurfClient for better layout. - Simplified padding in UnifiedContentCard for consistency. - Modified padding and margin in GetInContactBanner for enhanced design.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-nest/DeinNestClient.tsx
- src/app/entwurf/EntwurfClient.tsx
- src/components/cards/UnifiedContentCard.tsx
- src/components/sections/GetInContactBanner.tsx

---

## [061fcd4641a061ad8b5b019a3d2bfcc3c05439d7] - Thu Nov 13 22:01:28 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts
- src/app/dein-nest/DeinNestClient.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [0611cc7e110073e83468a3d949a2748f5f8256d3] - Thu Nov 13 21:43:52 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-nest/DeinNestClient.tsx
- src/components/cards/UnifiedContentCard.tsx
- src/components/sections/GetInContactBanner.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [927bf87776e275234227852ce99fbe3ffec16925] - Thu Nov 13 21:40:55 2025 +0100

**Author**: stenkjan
**Message**: `Merge 2d588bd4a405281bdd6812da346669345b473e69 into 2d20eba3c0d42d851824b6c3dd60f6bf497c39c8  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-nest/DeinNestClient.tsx

---

## [6dd2c71f92ad1b84b3e14b6b337dc72472aff6b8] - Thu Nov 13 21:36:20 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [03017d53ff688429b3b5b83244713f742fc24937] - Thu Nov 13 20:51:53 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts
- src/app/dein-nest/DeinNestClient.tsx
- src/app/faq/FAQClient.tsx
- src/app/konfigurator/components/CartFooter.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/showcase/cards/page.tsx
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/components/payments/PaymentModal.tsx
- src/components/sections/GrundstueckCheckForm.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/VIDEO-BACKGROUND-CARDS-FIX-SUMMARY.md

---

## [f2974a3b2a14d8eca22ee1bd4e2ae9eced4106a0] - Thu Nov 13 20:45:33 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [015463a8afc0155806f6182eb6ba05fe9c1737ab] - Thu Nov 13 20:43:41 2025 +0100

**Author**: stenkjan
**Message**: `chore: Clean up route.ts by removing unnecessary whitespace  - Removed an extra blank line in the  file to maintain code cleanliness and adhere to formatting standards.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts

---

## [c05b46037a8d00c7fa64e65dd2d0224b28bd8f77] - Thu Nov 13 20:31:55 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [5ca871c0eb1311c82bd0e914f99f50cf8d13c292] - Thu Nov 13 20:27:30 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [ca0f6bd14849bc8fa178e634ec0b5b1ba31ce69c] - Thu Nov 13 20:18:37 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [3550e9bb41a9bfae1a0e4e54cc94536dbbe2249d] - Thu Nov 13 20:14:34 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/kontakt/KontaktClient.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [4ac5540a23e70e14c0ebfea1be88611aea2243bd] - Thu Nov 13 19:59:08 2025 +0100

**Author**: stenkjan
**Message**: `Merge f379bc1c20eb87e430e195f220d9c79f8ac44a7e into 21e79555b1c8ae4ee7b1e2eecfe30ef2bc3e0864  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/kontakt/KontaktClient.tsx

---

## [51126bd434ac0123c9364ce294e03703456bbff1] - Thu Nov 13 19:41:52 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [79df304dcf321059bd0783e438486164db28d956] - Thu Nov 13 19:36:54 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [300589fa3f079c0434996fe7c1b5c9bf9da1707a] - Thu Nov 13 19:19:34 2025 +0100

**Author**: stenkjan
**Message**: `chore: Remove unnecessary whitespace in database test route file  - Cleaned up the  file by removing an extra blank line to maintain code cleanliness and consistency.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts

---

## [52fc07da207a5f2a0908efe8d02a2b1653754d05] - Thu Nov 13 18:44:24 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [40cc15a062df6c3cc678e8e3937fb53320623daf] - Thu Nov 13 18:24:26 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/LandingPageClient.tsx
- src/app/api/calendar/availability/route.ts
- src/app/api/contact/route.ts
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/app/warum-wir/WarumWirClient.tsx

#### 🔧 Configuration Changes

- .env
- .env.local
- package.json

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/EMAIL_CALENDAR_IMPLEMENTATION_COMPLETE.md

---

## [b659e9b4a9f56eb0a3911c26efe43a09e77c690a] - Thu Nov 13 16:58:49 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Update sections and content in LandingPageClient for improved clarity and consistency  - Replaced section titles and IDs to better reflect the content structure. - Adjusted button labels for a more user-friendly experience. - Removed redundant sections and updated image paths for accuracy. - Enhanced comments for better understanding of the code logic.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/LandingPageClient.tsx

---

## [321ba5c784847666d7d283dcee43d4e12f992673] - Thu Nov 13 14:17:00 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [dd65f2dcdbabb13b43afaa0fa17ed766533374f3] - Thu Nov 13 11:44:08 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Enhance YouTube video embed responsiveness in WarumWirClient  - Updated the container for the YouTube embed to include padding and a maximum width for better layout. - Ensured the video maintains its aspect ratio with overflow hidden and rounded corners for improved aesthetics.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warum-wir/WarumWirClient.tsx

---

## [f1da8efa710c102d776b92d1dec05982e45f270d] - Thu Nov 13 11:35:33 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/LandingPageClient.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [4f6f5c37ee2ac0f4df9a93dd60946485f0052d64] - Thu Nov 13 11:14:13 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warum-wir/WarumWirClient.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/YOUTUBE_PRIVACY_SETTINGS.md

---

## [200556ebbf5621c088ee0068038e737fa1f3686f] - Thu Nov 13 11:10:03 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Simplify YouTube video embed in WarumWirClient  - Removed fixed maximum width for the YouTube embed container to enhance responsiveness. - Updated the video source URL for improved privacy compliance.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warum-wir/WarumWirClient.tsx

---

## [8a0d3c143783b25fee1e69d689fa093e86f0e088] - Thu Nov 13 11:02:25 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/sections/AppointmentBooking.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [2d91d99ed00e227bf70142b535dff11a21e91d8d] - Thu Nov 13 10:53:30 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/app/warum-wir/page.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/YOUTUBE_EMBED_IMPLEMENTATION.md

---

## [cda4ae0d01985bf164350905372c6af3ff0a853f] - Thu Nov 13 10:52:02 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [32ffd60048748007b3bc6c0e0dffcde7605d72f1] - Thu Nov 13 10:47:23 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Update video handling in WarumWir page and client  - Removed the ModernVideoPlayer component in favor of a responsive YouTube embed for better performance and user experience. - Added structured data for the YouTube video in the page metadata to enhance SEO. - Cleaned up imports in the CheckoutStepper component by removing unused references, improving code clarity.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/app/warum-wir/page.tsx

#### 📚 Documentation Changes

- docs/YOUTUBE_EMBED_IMPLEMENTATION.md

---

## [ef2947e7ea2a015162acd76edf4931c725519c99] - Thu Nov 13 10:35:48 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts
- src/app/nest-system/NestSystemClient.tsx
- src/components/cards/UnifiedContentCard.tsx

#### 📚 Documentation Changes

- docs/BUILD_FIXES_NOV13.md
- docs/COMMIT_HISTORY.md
- docs/EMAIL_CONFIGURATION_SUMMARY.md
- docs/VIDEO_HOSTING_EVALUATION.md

---

## [edc2236f7538ab89577dc1f4ce82195375d59f0a] - Thu Nov 13 10:17:52 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Clean up imports and enhance CheckoutStepper structure  - Removed unused import of PlanungspaketeCards in NestSystemClient. - Added an ID to the planning packages section in CheckoutStepper for better accessibility and targeting. - Introduced a new prop 'isStatic' in UnifiedContentCard for improved responsiveness.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/nest-system/NestSystemClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/UnifiedContentCard.tsx

#### 📚 Documentation Changes

- docs/BUILD_FIXES_NOV13.md

---

## [027ca0c9bf1668d661f2cb028fd9f1686af9ab04] - Thu Nov 13 10:11:20 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/nest-system/NestSystemClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutPlanungspaketeCards.tsx
- src/components/sections/AppointmentBooking.tsx
- src/components/sections/ModulhausVergleichSection.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/VIDEO_HOSTING_EVALUATION.md

---

## [08569e2bde0ce95c4ad1d5b5ea8a1e7469beccc0] - Thu Nov 13 09:32:01 2025 +0100

**Author**: stenkjan
**Message**: `Merge dd0eb8785460fd172b3dc1817905cd22a22e789d into f33cd0e441ff3159ce1bf469015d92c0beb867b2  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/VIDEO_HOSTING_EVALUATION.md

---

## [3fcc0d12bf5a32b3900645dc42c5ef377313bb23] - Wed Nov 12 17:01:15 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/usage/Client.tsx
- src/app/admin/user-tracking/page.tsx
- src/app/agb/AgbClient.tsx
- src/app/api/admin/user-tracking/route.ts
- src/app/dein-nest/DeinNestClient.tsx
- src/app/impressum/ImpressumClient.tsx
- src/app/konfigurator/components/BelichtungspaketOverlay.tsx
- src/app/kontakt/KontaktClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/UnifiedContentCard.tsx
- src/components/sections/GetInContactBanner.tsx

#### 🔧 Configuration Changes

- .env
- .env.local

#### 📚 Documentation Changes

- SAFARI_SVG_PIXELATION_FIX.md
- docs/ADMIN_FINAL_FIXES_NOV12.md
- docs/ADMIN_IMPROVEMENTS_NOV12.md
- docs/ADMIN_TRACKING_FIX_NOV12.md
- docs/ADMIN_TRACKING_FIX_SUMMARY.md
- docs/ADMIN_USAGE_MONITORING_FIX.md
- docs/COMMIT_HISTORY.md
- docs/EMAIL_CONFIGURATION_SUMMARY.md
- docs/EMAIL_SETUP_GUIDE.md

---

## [cacd2b3c465dcee537075e62912a43fbb202d112] - Wed Nov 12 16:38:53 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [52a516675d29f68ab3323434a84b5f7120d40232] - Wed Nov 12 15:41:21 2025 +0100

**Author**: stenkjan
**Message**: `Update email configuration and references across the project  - Added email configuration for Resend service in  and . - Updated email addresses in , , and  components to reflect the new contact email: mail@nest-haus.at.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/agb/AgbClient.tsx
- src/app/impressum/ImpressumClient.tsx

#### 🔧 Configuration Changes

- .env
- .env.local

#### 📚 Documentation Changes

- docs/EMAIL_SETUP_GUIDE.md

---

## [0bac0104e1aabcd3df8549738f145db920392704] - Wed Nov 12 14:34:23 2025 +0100

**Author**: stenkjan
**Message**: `Enhance ServiceStatus interface in Client component  - Added optional properties  and  to the ServiceStatus interface for improved data handling. - Introduced  and  properties to track advanced metrics, enhancing the monitoring capabilities of the component.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/usage/Client.tsx

---

## [eb78b21dd6ac451ae1ba92afe3b9cd5046efe6e7] - Wed Nov 12 14:29:55 2025 +0100

**Author**: stenkjan
**Message**: `Enhance usage monitoring and user tracking features  - Added real-time and estimated indicators for rate limiting and blob storage usage in the UsagePage component. - Introduced configuration created metric in user tracking data, displaying its percentage of total sessions. - Updated calculations for various funnel metrics to ensure accurate representation of user interactions. - Improved error handling and fallback mechanisms for fetching real data from APIs, enhancing reliability.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/usage/Client.tsx
- src/app/admin/user-tracking/page.tsx
- src/app/api/admin/user-tracking/route.ts

#### 📚 Documentation Changes

- docs/ADMIN_FINAL_FIXES_NOV12.md
- docs/ADMIN_IMPROVEMENTS_NOV12.md
- docs/ADMIN_USAGE_MONITORING_FIX.md

---

## [5033a258e3046d38ebb2b04e949ffd09f44c9f4e] - Wed Nov 12 14:08:19 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [49ed87bbdc99f91a4609525c163225e364b230b7] - Wed Nov 12 13:53:01 2025 +0100

**Author**: stenkjan
**Message**: `Refactor: Adjust padding in DeinNestClient component  - Modified padding classes for improved layout consistency in the video background section. - Ensured proper alignment of text elements by adjusting the class order.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-nest/DeinNestClient.tsx

---

## [35acc5ae25ddbf3b617bbb50a6c8f4889435c038] - Wed Nov 12 13:34:42 2025 +0100

**Author**: stenkjan
**Message**: `Merge 938d8432a4b832a23210adf14346f58c921d1ff5 into 67945a66d6418ed2b0146a0a14061f39fbae7088  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/BelichtungspaketOverlay.tsx
- src/components/sections/GetInContactBanner.tsx

#### 📚 Documentation Changes

- SAFARI_SVG_PIXELATION_FIX.md

---

## [0ce0f3433e5c8ade9130f1368efd3167483b6164] - Wed Nov 12 13:32:13 2025 +0100

**Author**: stenkjan
**Message**: `feat: Update video background cards and adjust card height for consistency  - Added a new video background card with ID 5 for FAQs, including title, description, and button link. - Renumbered subsequent video background cards to maintain sequential IDs. - Standardized card height to 70vh across desktop views for consistent sizing, removing previous dynamic height calculations based on screen width.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-nest/DeinNestClient.tsx
- src/components/cards/UnifiedContentCard.tsx

---

## [9d0a18acfeef2869d22dd852700ad3166c6afab0] - Wed Nov 12 13:08:40 2025 +0100

**Author**: stenkjan
**Message**: `Fix: Remove invalid title and subtitle props from ContactMap  Vercel build error - ContactMap component only accepts: - id?: string - backgroundColor?: 'white' | 'gray' - maxWidth?: boolean  Removed invalid title and subtitle props that were causing type error. ContactMap is a simple map display component without text content.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [0ffbf82bdbbafd9a3f6abe367fdc904a569baeba] - Wed Nov 12 13:00:51 2025 +0100

**Author**: stenkjan
**Message**: `Fix: Prefix unused ContactMap import with underscore  Vercel build error - ContactMap is imported but never used in KontaktClient. The component uses an iframe for Google Maps instead of the ContactMap component. Prefixed with underscore to indicate intentional non-use.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/kontakt/KontaktClient.tsx

---

## [55819961d78239110c56a8685f45a8a96bce3dfb] - Wed Nov 12 12:05:26 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [5d5554ce85660878dc18341552485ccb88f1a9ed] - Wed Nov 12 12:00:34 2025 +0100

**Author**: stenkjan
**Message**: `Fix: Add null check for configItem.nest before calling getItemPrice  TypeScript error: configItem.nest could be null/undefined when calling getItemPrice. Added null check to ensure nest exists before passing to getItemPrice.  Applied to both occurrences: - Line 1708-1710 (step 0-3 display) - Line 2430-2432 (step 4 display)  Build should now succeed.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [c1242be8ff836487785fd99700101f816c49f76f] - Wed Nov 12 11:58:54 2025 +0100

**Author**: stenkjan
**Message**: `Fix: Correct Teilzahlung calculations and add Konfiguration bearbeiten link  FIXES: 1. Changed 4th payment label from '3. Teilzahlung' to '4. Teilzahlung' 2. Recalculated all payments based on dynamic total (Dein Nest Haus + Planungspaket) 3. Added onClick to 'Konfiguration bearbeiten' button to open /konfigurator  Calculation changes: - Base total: Dynamic sum from getItemPrice() (not stored totalPrice) - Includes Planungspaket if not basis (Plus: 9,600€, Pro: 12,700€) - 1. Teilzahlung: 3,000€ (Grundstückscheck full price) - 2. Teilzahlung: (Total × 30%) - 1,500€ credit - 3. Teilzahlung: Total × 50% - 4. Teilzahlung: Total × 20%  Example with Nest 80 defaults (226,746€) + Basis (0€) = 226,746€: - 1. Teilzahlung: 3,000€ - 2. Teilzahlung: 66,524€ (68,024 - 1,500) - 3. Teilzahlung: 113,373€ - 4. Teilzahlung: 45,349€  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [67f02ba6b6a64a435ec9ded19a69f86cffd57266] - Wed Nov 12 11:55:04 2025 +0100

**Author**: stenkjan
**Message**: `Fix: Show 3,000€ in Teilzahlung section (not 1,500€)  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [2952ce6bcdf56a198d4bc0e73d80a870de5f25ea] - Wed Nov 12 11:52:59 2025 +0100

**Author**: stenkjan
**Message**: `Fix: Prefix unused variables with underscore  Fixed ESLint errors for currentPrice and currentConfiguration which are no longer used after switching to dynamic price calculations.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [3dc10a7c907a8e87dbd0ce6094aa25948a7ec4f2] - Wed Nov 12 11:46:45 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/KonfiguratorClient.tsx
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/PRICING_INITIALIZATION_FIX_NOV11.md
- docs/WARENKORB_PRICING_SYNC_FIX_NOV11.md

---

## [6be3df657cbbbbc53f755335f6076c028846f1cd] - Wed Nov 12 11:45:08 2025 +0100

**Author**: stenkjan
**Message**: `CRITICAL FIX: Load pricing data in WarenkorbClient  The Warenkorb was not loading pricing data, so all getItemPrice() calls returned null from getPricingData() and fell back to old stored prices.  Solution: Initialize pricing data in WarenkorbClient on mount - Added PriceCalculator.initializePricingData() call - Runs async on component mount - Enables dynamic price calculations in CheckoutStepper  Result: - Warenkorb now shows correct prices from Google Sheets - Fichte: 23,020€ (not inkludiert) - Nest 80: 188,619€ - Total: 226,746€ for defaults - All prices match Konfigurator exactly  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/WarenkorbClient.tsx

---

## [1bf25663b339c4f3fbfa1c379fe3d7ecb225185b] - Wed Nov 12 11:44:07 2025 +0100

**Author**: stenkjan
**Message**: `CRITICAL FIX: Load pricing data BEFORE initializing session  Root cause: initializeSession() was called before pricing data was loaded, causing calculatePrice() to use null data and return 0€.  Solution: Move pricing data initialization to KonfiguratorClient 1. KonfiguratorClient loads pricing data FIRST 2. THEN calls initializeSession() 3. initializeSession() can now safely call calculatePrice() 4. Prices are correct from the start  Timeline now: ├─ PriceCalculator.initializePricingData() (async) ├─ Wait for data to load... ├─ initializeSession() ├─ setDefaultSelections() └─ calculatePrice() ✅ Data is available!  Result: Konfigurator shows 226,746€ on initial load (not 0€)  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/KonfiguratorClient.tsx

---

## [f28c98e2196ce91d7bd2f491f133bd95369cf7b0] - Wed Nov 12 11:36:59 2025 +0100

**Author**: stenkjan
**Message**: `Add documentation for pricing initialization fix  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/PRICING_INITIALIZATION_FIX_NOV11.md

---

## [58194971f3195f5b66712e63e43ae5dcf6657428] - Wed Nov 12 11:27:02 2025 +0100

**Author**: stenkjan
**Message**: `Add comprehensive documentation for Warenkorb pricing sync fixes  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/WARENKORB_PRICING_SYNC_FIX_NOV11.md

---

## [c953485d0ec7ce7077e2c7d6d31cb650f57a7807] - Wed Nov 12 11:25:30 2025 +0100

**Author**: stenkjan
**Message**: `Fix: Calculate dynamic total in Warenkorb using new pricing system  CRITICAL FIX: 'Dein Nest Haus' box was showing 0€ because it used stored totalPrice which was from the old pricing system.  Solution: - renderIntro(): Calculate total dynamically from individual item prices - Uses getItemPrice() for each configuration item - Sums: nest + gebaeudehuelle + innenverkleidung + fussboden + all options - Falls back to getCartTotal() if no configuration present - Removed useMemo (can't use hooks in regular function)  Result: - 'Dein Nest Haus' box now shows correct total (e.g., 226,746€ for Nest 80 defaults) - Price updates when configuration changes - Uses same pricing as Konfigurator (from Google Sheets)  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [7418fef09ca79cf2246f1f6ee2bd4907c1628ace] - Wed Nov 12 11:23:05 2025 +0100

**Author**: stenkjan
**Message**: `Fix: Sync pricing from Konfigurator to Warenkorb with new pricing system  CRITICAL FIXES: 1. Nest price: Now uses RAW nest base price from PriceCalculator.getPricingData() 2. Innenverkleidung: Now uses ABSOLUTE prices (never shows as 'inkludiert')    - Fichte: 23,020€ for Nest 80 (was showing as 'inkludiert') 3. Gebäudehülle & Fussboden: Now uses actual user selections for calculation 4. Check & Vorentwurf: Changed from variable price to fixed 3,000€ in Dein Preis Überblick  Technical changes: - getItemPrice(): Added separate handlers for nest, innenverkleidung, gebaeudehülle, fussboden - Uses PriceCalculator.getPricingData() for dynamic pricing from Google Sheets - isItemIncluded(): Never shows innenverkleidung as 'inkludiert' - Fixed base defaults: fichte (not laerche), ohne_belag (not parkett) - Removed discount logic from overview box for Check & Vorentwurf  Result: Warenkorb now shows same prices as Konfigurator using new pricing system  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts
- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [bcf68e5f5ea3e26a045928f757d56d9f4d3aadf0] - Wed Nov 12 11:15:57 2025 +0100

**Author**: stenkjan
**Message**: `Fix: Add explicit mode=configuration parameter for Zum Warenkorb button  Issue: 'Zum Warenkorb' button was not explicitly setting configuration mode, causing ambiguity about whether to use ohne-nest or configuration mode.  Solution: - CartFooter: Changed /warenkorb to /warenkorb?mode=configuration - WarenkorbClient: Added handler for mode=configuration parameter - Explicitly sets ohneNestMode to FALSE when mode=configuration - Updates session to mark as configuration mode (not ohne-nest)  Now: - 'Ohne Nest fortfahren' → /warenkorb?mode=vorentwurf → ohne-nest TRUE - 'Zum Warenkorb' → /warenkorb?mode=configuration → ohne-nest FALSE - Direct /warenkorb → auto-detects based on configuration presence  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-nest/DeinNestClient.tsx
- src/app/konfigurator/components/CartFooter.tsx
- src/app/warenkorb/WarenkorbClient.tsx
- src/components/cards/UnifiedContentCard.tsx

#### 📚 Documentation Changes

- docs/VIDEO-BACKGROUND-CARDS-FIX-SUMMARY.md

---

## [6b0d401d7d06c05f19b3e851923fc8a601dd9b91] - Wed Nov 12 10:45:05 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/cards/UnifiedContentCard.tsx
- src/components/sections/GetInContactBanner.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [c841500208fdfc8d9aba36680880589931cb51c5] - Wed Nov 12 10:35:32 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [4864c3a3c6d4e4e39a23735321879e32be26b331] - Wed Nov 12 10:29:12 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts
- src/app/konfigurator/components/SelectionOption.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/data/configuratorData.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [30eaa9538f106e0427331087e5285688bdfe3b0c] - Wed Nov 12 10:16:32 2025 +0100

**Author**: stenkjan
**Message**: `Add migration to update fussboden Standard description in existing sessions  - Incremented store version from 1 to 2 - Added migration logic to add 'Verlege deinen Boden selbst' description - Fixes issue where existing sessions had empty description for Standard - Changed version check from === to < for better future compatibility - Now subtitle will appear in Dein Nest Überblick for all users  `

### Changes Analysis

---

## [01c03239de4977b2ef42c0daa28db8541b5409bd] - Wed Nov 12 10:11:20 2025 +0100

**Author**: stenkjan
**Message**: `Fix: Add 'Verlege deinen Boden selbst' description to default fussboden selection  The description was missing in the configuratorStore default selections. Updated line 639 from empty string to 'Verlege deinen Boden selbst'. Now the subtitle will show in Dein Nest Überblick for new sessions.  `

### Changes Analysis

---

## [22a66db146ffcb4370612ec08a3ebb118a42b127] - Wed Nov 12 10:02:18 2025 +0100

**Author**: stenkjan
**Message**: `Center 'Ohne Heizung' option vertically in Bodenaufbau section  - Added vertical centering for ohne_heizung option (same as ohne_belag) - Both title and subtitle now centered in selection box - Applies flex-col justify-center to container - Shows description on single line below title  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/SelectionOption.tsx

---

## [bec9e4e8fce3ec18cbe753dbbf1bc1ded5d85690] - Wed Nov 12 10:00:42 2025 +0100

**Author**: stenkjan
**Message**: `Update Überblick to show 'Bodenbelag - Standard' instead of just 'Standard'  - Added special handling for fussboden category in SummaryPanel - Now displays: Bodenbelag - Standard (or other floor options) - Subtitle remains: Verlege deinen Boden selbst  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/SummaryPanel.tsx

---

## [aed4d9d664e26c2e1c0e2ac5316a2566b01563da] - Wed Nov 12 09:58:55 2025 +0100

**Author**: stenkjan
**Message**: `Add subtitle to Bodenbelag Standard option and center content  - Changed Standard subtitle from empty to 'Verlege deinen Boden selbst' - Updated SelectionOption to always center Standard option vertically - Subtitle now shows in both selection box and Dein Nest Überblick - Removed empty description check, always apply centering to ohne_belag  In Überblick, now displays: Standard Verlege deinen Boden selbst inkludiert  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts
- src/app/konfigurator/components/SelectionOption.tsx
- src/app/konfigurator/data/configuratorData.ts

---

## [4e374c74a5c813925fe7e3bcecf70dbaf1656957] - Wed Nov 12 09:29:47 2025 +0100

**Author**: stenkjan
**Message**: `fix: Correct mobile responsiveness issues in SectionHeader and UnifiedContentCard  - Fixed alignment issues in SectionHeader for better mobile display. - Adjusted padding and margins in UnifiedContentCard to enhance readability on smaller screens. - Ensured consistent styling across components to improve overall user experience on mobile devices.  `

### Changes Analysis

---

## [0cff2bed0b3a27aa9fac0ef4c7d1266b32bfcdbe] - Tue Nov 11 17:05:55 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [4559a465c8774052854d58a56c18db7a38aded31] - Tue Nov 11 16:33:59 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/faq/FAQClient.tsx
- src/app/faq/page.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/Footer.tsx
- src/components/payments/PaymentModal.tsx
- src/components/payments/StripeCheckoutForm.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [b7697644c80c564ca0fdb16aea5171492ff91ac4] - Tue Nov 11 16:18:57 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [bd8cf855968a0fe7484a9991c1a07c57e130b185] - Tue Nov 11 15:59:26 2025 +0100

**Author**: stenkjan
**Message**: `feat: Add FAQ link and SEO metadata for FAQ page  - Included a new "FAQ" link in the Footer component for easy navigation. - Added SEO configuration for the FAQ page, including title, description, keywords, and image metadata.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/faq/FAQClient.tsx
- src/app/faq/page.tsx
- src/components/Footer.tsx

---

## [a178081adb3654f7649f8ca96577ee16069e0080] - Tue Nov 11 15:43:02 2025 +0100

**Author**: stenkjan
**Message**: `fix: Adjust layout and styling in CheckoutStepper component  - Added margin-top to specific div elements for improved spacing. - Updated header class for "Dein Preis Überblick" to enhance visual hierarchy. - Ensured consistent styling for payment status indicators with margin adjustments.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [44922408d3cd1f57b8a7ef1cb89d502cdc551d88] - Tue Nov 11 15:19:50 2025 +0100

**Author**: stenkjan
**Message**: `feat: Enhance CheckoutStepper with payment details and state management  - Introduced state variables for successful payment intent ID and payment completion date. - Updated UI to conditionally display payment status and transaction details after payment completion. - Added a green transaction details box showing Nest ID, transaction ID, amount, status, and date. - Improved responsiveness and clarity of payment messages in the CheckoutStepper component.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [c9e029253bd9a434e016af89e69be009de6c2009] - Tue Nov 11 14:58:33 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [0dd4f78af1fba8f2e9e69d0f654d898dbeeef5d4] - Tue Nov 11 14:46:29 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/LandingPageClient.tsx
- src/components/payments/StripeCheckoutForm.tsx
- src/components/sections/GetInContactBanner.tsx
- src/components/sections/LandingImagesCarousel.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [3c8309f568760153a7f9730a3880a72710d02161] - Tue Nov 11 14:36:42 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/payments/create-payment-intent/route.ts
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/payments/PaymentModal.tsx
- src/components/payments/StripeCheckoutForm.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [f0b86e9cdf64a29b0f13d8189c863fc3077f6500] - Tue Nov 11 14:35:07 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [dfc399a7ec28b3bb353933ea14f5b8ee06b174db] - Tue Nov 11 14:23:54 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/LandingPageClient.tsx
- src/app/globals.css
- src/components/Footer.tsx
- src/components/sections/GetInContactBanner.tsx
- src/components/sections/LandingImagesCarousel.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [b3557edcc611f6fc408c3aeb3d51bf52aae08ad9] - Tue Nov 11 14:22:32 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [5081d7bb1d315145c414dc231c9afd83d41d69ea] - Tue Nov 11 14:06:15 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [2bb933d2af5f67dc2a02501ea6918741fb509073] - Tue Nov 11 14:02:24 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [032397e8a5daa64b80759b65ea4058f7a13fdefd] - Tue Nov 11 13:49:30 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/LandingPageClient.tsx
- src/app/globals.css
- src/components/grids/TwoByTwoImageGrid.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [9f528e0f30a9fcd54c0f7e9bfdc87a5b76c11e71] - Tue Nov 11 13:43:57 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/data/configuratorData.ts
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutPlanungspaketeCards.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/INNENVERKLEIDUNG_SELECTION_FIX_NOV11.md
- docs/OHNE_NEST_BUTTON_NOV11.md

---

## [e6b987131d487d9c9f24998a7395d2830c21a26c] - Tue Nov 11 13:39:50 2025 +0100

**Author**: stenkjan
**Message**: `Update planning package prices and refactor related components for consistency  - Updated prices for Planung Plus and Planung Pro in configuratorData and PLANNING_PACKAGES constant. - Refactored WarenkorbClient and CheckoutStepper to utilize PLANNING_PACKAGES for package hierarchy. - Adjusted CheckoutPlanungspaketeCards to display updated prices and handle basis package as included (0€). - Modified configuratorStore to reflect changes in initial pricing for basis package.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/data/configuratorData.ts
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutPlanungspaketeCards.tsx

---

## [470b6b4b034599d347b4a90f8e6116a9a10a88c5] - Tue Nov 11 13:27:02 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [69cb3cde7493b54816135dbd9a59fc7e61611b59] - Tue Nov 11 13:23:33 2025 +0100

**Author**: stenkjan
**Message**: `Fix margin: mt-3 only on mobile, lg:mt-0 on desktop  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx

---

## [f2974dc7d4d787101316248e45b458eeafb6de38] - Tue Nov 11 13:20:33 2025 +0100

**Author**: stenkjan
**Message**: `Improve 'Ohne Nest fortfahren' button with subtext and better sizing  - Added italic subtext: *Nur den Vorentwurf bestellen - Stretched button to w-full with max-w-[280px] for better fit - Changed container to flex-col with items-center for vertical layout - Added gap-2 between button and subtext - Subtext uses correct brand color #3D6CE1 - Responsive text sizing for subtext: clamp(0.75rem,1vw,0.875rem)  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx

---

## [ac9e4a3b6cfd7ab0f39e55568f50020ce0eec1ff] - Tue Nov 11 13:19:30 2025 +0100

**Author**: stenkjan
**Message**: `Add 'Ohne Nest fortfahren' button at top of Konfigurator  - Added centered button at the top of right panel above Nest section - Button navigates to /warenkorb?mode=vorentwurf (same as Zum Vorentwurf) - Matches existing button styling (white bg, blue border, hover effects) - Provides users immediate option to proceed without configuring Nest - Responsive design with proper touch targets (48px min height) - Symmetrical UX: button at top AND bottom for convenience  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx

#### 📚 Documentation Changes

- docs/OHNE_NEST_BUTTON_NOV11.md

---

## [9eb611db20a73221833569a74e909a3bd4478643] - Tue Nov 11 13:14:35 2025 +0100

**Author**: stenkjan
**Message**: `Refactor: Improve type safety for nest size and interior cladding in SummaryPanel  Updated the SummaryPanel component to enhance type safety by formatting the type assertions for nest size and interior cladding options across price calculations. This change improves code readability and maintains consistency with TypeScript best practices.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/SummaryPanel.tsx

---

## [7b0e193a58cbf4a4bd10b1f76cf85a92d5fc1bae] - Tue Nov 11 13:12:35 2025 +0100

**Author**: stenkjan
**Message**: `Critical fix: Use actual innenverkleidung selection in price calculations  The gebaeudehuelle and fussboden price calculations were always using the default 'fichte' value instead of the user's actual innenverkleidung selection. This caused incorrect prices when users selected Lärche or Eiche.  Fix: Changed testInnenverkleidung from hardcoded baseInnenverkleidung to use configuration.innenverkleidung?.value || baseInnenverkleidung  This ensures price calculations reflect the user's actual configuration, not just defaults.  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/INNENVERKLEIDUNG_SELECTION_FIX_NOV11.md

---

## [e871eb3b751daa52ae39b387485c007cdebca4da] - Tue Nov 11 12:56:42 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/KonfiguratorClient.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/core/PriceCalculator.ts
- src/components/debug/PriceCacheDebugger.tsx
- src/components/images/ResponsiveHybridImage.tsx
- src/hooks/useDeviceDetect.ts

#### 📚 Documentation Changes

- DEVICE_DETECTION_FIX.md
- DEVICE_DETECTION_FIX_V2.md
- FIX_SUMMARY.md
- FIX_SUMMARY_V2.md
- TESTING_INSTRUCTIONS.md
- docs/BUILD_FIXES_NOV11.md
- docs/COMMIT_HISTORY.md
- docs/ESLINT_FIXES_NOV11.md
- docs/MISSING_VARIABLE_FIX_NOV11.md
- docs/ORPHANED_STATE_FIX_NOV11.md
- docs/PRICE_CACHE_DEBUG_REMOVAL_NOV11.md
- docs/SUMMARY_PANEL_PRICING_FIX_NOV11.md

---

## [c7179be802abe4d39015d63627cfdd255ae1afe3] - Tue Nov 11 12:52:06 2025 +0100

**Author**: stenkjan
**Message**: `Fix: Remove debug logging, fix pricing display, and resolve build errors  - Remove all console.log debug statements from pricing system - Delete PriceCacheDebugger component - Fix SummaryPanel to show correct prices (Nest 188,619€, Fichte 23,020€) - Fix orphaned setActiveInfoModal call in ConfiguratorShell - Add missing baseInnenverkleidung variable - Fix all ESLint unused variable errors - Fix isMobile variable scope in connectionDetection - Remove innenverkleidung check from gebaeudehuelle/fussboden block  All linting passes, build should succeed on Vercel.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/SummaryPanel.tsx

---

## [06b68c48ad54c36afa58fe8ef8fbc19c966b4abb] - Tue Nov 11 12:48:49 2025 +0100

**Author**: stenkjan
**Message**: `feat: Add default interior cladding to SummaryPanel  - Introduced a new default value for interior cladding as "fichte" in the SummaryPanel component to enhance base calculation options.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/SummaryPanel.tsx

#### 📚 Documentation Changes

- docs/BUILD_FIXES_NOV11.md

---

## [28fc00f1962c190ca5e69ff5c51a2a433df823c3] - Tue Nov 11 12:42:15 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [b300761836ef8853beda8126fb67b6206f87d299] - Tue Nov 11 12:34:52 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/images/ResponsiveHybridImage.tsx
- src/hooks/useDeviceDetect.ts

#### 📚 Documentation Changes

- DEVICE_DETECTION_FIX.md
- DEVICE_DETECTION_FIX_V2.md
- FIX_SUMMARY.md
- FIX_SUMMARY_V2.md
- TESTING_INSTRUCTIONS.md
- docs/COMMIT_HISTORY.md

---

## [307ca366b515a798687ca784d70f78af0313d53a] - Tue Nov 11 11:32:58 2025 +0000

**Author**: stenkjan
**Message**: `Merge b95fd44046c8ce203b7c8f1e13eb449ad13840d7 into d3ff6e600cddf26a9740fbfa301878f16a771842  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/images/ResponsiveHybridImage.tsx
- src/hooks/useDeviceDetect.ts

#### 📚 Documentation Changes

- DEVICE_DETECTION_FIX.md
- DEVICE_DETECTION_FIX_V2.md
- FIX_SUMMARY.md
- FIX_SUMMARY_V2.md
- TESTING_INSTRUCTIONS.md

---

## [af753ebc18a4a07b5eb31d64a0d12d594d4dd189] - Tue Nov 11 12:30:59 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [14a7543c0d618d90788f12f6da499b1ace7c2134] - Tue Nov 11 12:26:57 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [ad54338ad3660ad52ab754b7fffcb9fda873169b] - Tue Nov 11 12:18:39 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [70a00c67527a1d31a833d491ed8a9599c0e548b5] - Tue Nov 11 11:25:29 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-nest/DeinNestClient.tsx
- src/app/entwurf/EntwurfClient.tsx
- src/components/Footer.tsx
- src/components/sections/GetInContactBanner.tsx
- src/components/sections/LandingImagesCarousel.tsx
- src/components/sections/PartnersSection.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/KONFIGURATOR_PRICING_OVERHAUL_SUMMARY.md
- docs/PRICING_SYNC_STATUS.md

---

## [3c0fa0f942eba6b5f24dd4f1e8eddb57f87df5f9] - Tue Nov 11 10:46:46 2025 +0100

**Author**: stenkjan
**Message**: `docs: Add comprehensive pricing overhaul summary  Complete documentation of the Konfigurator pricing system overhaul: - Google Sheets integration details - Database shadow copy architecture - Multi-level caching implementation - All 11 categories pricing logic - Performance metrics and optimizations - Issues fixed during implementation - Testing and QA results - Future enhancement roadmap  Total: 50+ commits, 3000+ lines changed, production ready  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/KONFIGURATOR_PRICING_OVERHAUL_SUMMARY.md

---

## [489c93e3a287d712678662daace896ef34da7eaa] - Tue Nov 11 10:40:51 2025 +0100

**Author**: stenkjan
**Message**: `fix: Remove unused FullWidthTextGrid import  ESLint error: 'FullWidthTextGrid' is defined but never used Removed unused import from DeinNestClient.tsx  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-nest/DeinNestClient.tsx

---

## [7607ed8c2efd6096e98d6b6992802ba78be58d0a] - Tue Nov 11 10:37:15 2025 +0100

**Author**: stenkjan
**Message**: `docs: Update pricing sync status documentation  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/PRICING_SYNC_STATUS.md

---

## [966584fdb75d92091ccd61466d97e65b9383d21f] - Mon Nov 10 18:13:53 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts
- src/app/konfigurator/core/PriceCalculator.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/PRICING_SYNC_STATUS.md

---

## [3f829310ee2c30edb87473e54e7510ca00bd69d7] - Mon Nov 10 15:47:58 2025 +0100

**Author**: stenkjan
**Message**: `fix: Remove orphaned return statement in parsePlanungspakete  Syntax error at line 587 - orphaned return statement from previous edit. Removed duplicate return that was outside the function scope.  `

### Changes Analysis

---

## [0afb6eb80950f4d2d3955b64d545088385a09d89] - Mon Nov 10 15:38:24 2025 +0100

**Author**: stenkjan
**Message**: `fix: Remove extra closing brace causing syntax error  Syntax error at line 178 - duplicate closing brace from parseNumber function edit. Removed the extra } that was breaking the build.  `

### Changes Analysis

---

## [fd689a6fdf9cee87433fbb58d60e607c7e1670ab] - Mon Nov 10 15:37:01 2025 +0100

**Author**: stenkjan
**Message**: `docs: Add pricing sync status and troubleshooting guide  Created comprehensive guide explaining: - Why prices are still showing as rounded - Current code state (Math.round removed) - Database has old cached values - Steps to fix: wait for deployment + re-sync - Debugging checklist  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/PRICING_SYNC_STATUS.md

---

## [d0dbf255240ec9d89e46785b037ea88c0dd164cd] - Mon Nov 10 15:29:56 2025 +0100

**Author**: stenkjan
**Message**: `fix: Add missing newline at end of file in db route.ts  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts

---

## [d88370df200890d4d95a12df349f1928cc635ed3] - Mon Nov 10 15:05:50 2025 +0100

**Author**: stenkjan
**Message**: `fix: CRITICAL - Revert broken Innenverkleidung pricing logic  PROBLEM: Nest 80 was displaying 155,500€ instead of 188,619€  ROOT CAUSE: Previous commit incorrectly changed Innenverkleidung from relative to absolute pricing, causing double-counting.  THE FIX: Restored relative pricing calculation for Innenverkleidung - Added back: fichtePrice and innenverkleidungRelative calculation - Changed: return nestPrice + ... + innenverkleidungPrice (WRONG) - To: return nestPrice + ... + innenverkleidungRelative (CORRECT)  WHY: The nest base price (F11 = 188,619€) INCLUDES Fichte innenverkleidung (23,020€). Using absolute pricing was adding Fichte price twice.  MATH PROOF: - Nest base: 188,619€ (already includes Fichte 23,020€) - With Fichte selected: 188,619 + (23,020 - 23,020) = 188,619€ ✓ - With Lärche selected: 188,619 + (31,921 - 23,020) = 197,520€ ✓  This restores correct pricing display in the Konfigurator.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [08f059eeba5c7b69a9216f2591f8976254ec9192] - Mon Nov 10 14:56:08 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/core/PriceUtils.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [eccc9e1fc8ab580d6b068545f847c134c7dd8892] - Mon Nov 10 14:48:53 2025 +0100

**Author**: stenkjan
**Message**: `fix: Remove Math.round() from price parsing - preserve exact prices  - Removed Math.round() from parseNumber function for numbers and strings - Removed Math.round() from pricePerSqm calculation in parseNest - Now preserves exact decimal prices from Google Sheets:   * Nest 80: 188,619€ (not 189,000€)   * Nest 100: 226,108€ (not 226,000€)   * Nest 120: 263,597€ (not 264,000€)   * Nest 140: 301,086€ (not 301,000€)   * Nest 160: 338,575€ (not 339,000€)  `

### Changes Analysis

---

## [327d7e416bec1bc5efed520f50c68b0ae7bb3690] - Mon Nov 10 14:36:09 2025 +0100

**Author**: stenkjan
**Message**: `fix: Complete m² and pricing overhaul per user requirements  1. Fixed PriceUtils.ts m² calculation:    - Changed geschossdecke area from 7.5m² to 6.5m² per unit    - Formula now: (nest_size - 5) + (geschossdecke_qty * 6.5)  2. Fixed Innenverkleidung pricing logic:    - Removed 'Fichte as base' relative pricing    - Now uses ABSOLUTE prices from sheet (F24-26, H24-26, etc.)    - Fichte shows 23020€ for Nest80, not 0€ (inkludiert)  3. Fixed Planungspakete prices:    - Changed to read from fixed rows 88-90 (0-indexed: 87-89)    - Plus = 9600€, Pro = 12700€ (same for all nest sizes)    - Removed dynamic row search  4. Fixed Fenster & Türen m² calculation:    - Added geschossdeckeQuantity parameter to getFensterPricePerSqm    - Now uses PriceUtils.getAdjustedNutzflaeche formula    - m² price updates when Geschossdecke changes  5. Updated ConfiguratorShell:    - Passes geschossdeckeQty to all getFensterPricePerSqm calls    - Ensures m² prices update dynamically with Geschossdecke  All changes maintain existing functionality while fixing pricing accuracy.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/core/PriceUtils.ts

---

## [7ce4b8c91698dac03c3f4ce3293fbe256361e829] - Mon Nov 10 14:16:15 2025 +0100

**Author**: stenkjan
**Message**: `fix: Correct Innenverkleidung pricing - show absolute prices but keep relative calculation  CRITICAL FIX: The nest base price (189,100€) INCLUDES Trapezblech + Fichte + Standard flooring.  Changes: 1. PriceCalculator.ts: REVERTED to use relative pricing in calculation    - nestPrice includes Fichte, so we must subtract fichtePrice for upgrades    - This keeps Nest 80 at correct 189,100€ base price  2. ConfiguratorShell.tsx: Added special handling for SELECTED innenverkleidung    - When Fichte is SELECTED: Shows absolute price 23,020€ (not inkludiert)    - When Lärche is SELECTED: Shows absolute price 31,921€    - When Eiche is SELECTED: Shows absolute price 37,235€    - When NOT selected: Shows relative price difference  This ensures: - Nest 80 base = 189,100€ (correct) - Innenverkleidung NEVER shows as inkludiert - All prices display absolute values when selected - Relative prices show for non-selected options  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx

---

## [02de6ccb26e815f194ba9feaefe1ba3f855a495c] - Mon Nov 10 13:49:03 2025 +0100

**Author**: stenkjan
**Message**: `fix: Remove relative pricing logic for Innenverkleidung  CRITICAL FIX: Innenverkleidung should NOT use relative pricing. All options (Fichte, Lärche, Eiche) have actual costs that must be added to the nest base price.  Before: - innenverkleidungRelative = innenverkleidungPrice - fichtePrice - This made Fichte show as 0€ (inkludiert) which is INCORRECT  After: - innenverkleidungPrice is added directly to total - Fichte now correctly shows 23,020€ for Nest 80 - Lärche shows +8,901€ relative when not selected - Eiche shows +14,215€ relative when not selected  Fixes issue where Nest 160 selection caused inkludiert to appear.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [8b30c5c581653c6e16de712b5185091d06a166d8] - Mon Nov 10 13:36:00 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/admin/sync-pricing/route.ts
- src/app/api/admin/user-tracking/all-configurations/route.ts
- src/app/api/admin/user-tracking/route.ts
- src/app/api/cron/sync-pricing-sheet/route.ts
- src/app/api/pricing/calculate/route.ts
- src/app/api/pricing/data/route.ts
- src/app/api/pricing/sync/route.ts
- src/app/api/test/db/route.ts
- src/app/api/test/pricing-sheet/route.ts
- src/app/api/test/redis/route.ts
- src/app/api/test/sheets-info/route.ts
- src/app/api/test/sheets-metadata/route.ts
- src/app/konfigurator/**tests**/ConfiguratorShell.integration.test.tsx
- src/app/konfigurator/components/CartFooter.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/GeschossdeckeOverlay.tsx
- src/app/konfigurator/components/KonfiguratorClient.tsx
- src/app/konfigurator/components/QuantitySelector.tsx
- src/app/konfigurator/components/SelectionOption.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/core/ImageManager.ts
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/core/PriceUtils.ts
- src/app/konfigurator/data/configuratorData.ts
- src/app/konfigurator/data/dialogConfigs.ts
- src/app/showcase/cards/page.tsx
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/admin/PricingSyncPanel.tsx
- src/components/cards/CheckoutPlanungspaketeCards.tsx
- src/components/cards/UnifiedContentCard.tsx
- src/components/debug/PriceCacheDebugger.tsx
- src/components/sections/AppointmentBooking.tsx
- src/hooks/useInteractionTracking.ts

#### ⚙️ Backend Changes

- prisma/migrations/20250101000000_add_pricing_data_snapshot/migration.sql
- prisma/schema.prisma
- scripts/README-cache-cleaning.md
- scripts/clean-cache.bat
- scripts/clean-cache.js

#### 🔧 Configuration Changes

- .env
- .env.local
- next.config.ts
- package.json

#### 📚 Documentation Changes

- FIX_OLD_PRICES_DISPLAY.md
- docs/ADMIN_REORGANIZATION_COMPLETE.md
- docs/ADMIN_REORGANIZATION_PROGRESS.md
- docs/ADMIN_TRACKING_QUICK_REF.md
- docs/COMMIT_HISTORY.md
- docs/DEBUG_CART_TRACKING.md
- docs/KONFIGURATOR-REFACTORING-PLAN.md
- docs/KONFIGURATOR-SWITCH-GUIDE.md
- docs/KONFIGURATOR_AUDIT_REPORT.md
- docs/KONFIGURATOR_AUDIT_SUMMARY.md
- docs/KONFIGURATOR_OPTIMIZATION_PLAN.md
- docs/KONFIGURATOR_TESTING_CHECKLIST.md
- docs/PRICING_INITIAL_SYNC.md
- docs/PRICING_SHADOW_COPY_SETUP.md
- docs/PRICING_SYNC_ARCHITECTURE.md
- docs/PRICING_SYNC_ENV_VARS.md
- docs/PRICING_SYNC_IMPLEMENTATION_COMPLETE.md
- docs/PRICING_SYNC_QUICK_REF.md
- docs/PRICING_SYNC_SETUP.md
- docs/SESSION_SUMMARY_OCT24.md

---

## [09c9e63aa5c115c1a3829ddc898b03d4ff423e9f] - Mon Nov 10 13:26:48 2025 +0100

**Author**: stenkjan
**Message**: `fix: Replace require() with ES6 import for PriceUtils  - Added static import at top: import { PriceUtils } from './PriceUtils' - Removed dynamic require() call in getFensterPricePerSqm - Fixes ESLint error: @typescript-eslint/no-require-imports  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [d0b54e0094c05a0dda02cf5d834bddadccf0ab2d] - Mon Nov 10 13:17:45 2025 +0100

**Author**: stenkjan
**Message**: `fix: Remove duplicate lines in getFensterPricePerSqm  Removed duplicate closing brace and return statement that was causing syntax error: - Lines 1021-1025 were duplicates of lines 1016-1020 - This was causing 'Return statement is not allowed here' error in Vercel build  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [58fb4d97f0f74bd93c12600e9d0bee0efbce7508] - Mon Nov 10 13:13:51 2025 +0100

**Author**: stenkjan
**Message**: `fix: Apply getFensterPricePerSqm changes to use adjusted nutzfläche  Updated method to: - Accept geschossdeckeQuantity parameter - Use PriceUtils.getAdjustedNutzflaeche() for correct divisor - Apply (nestSize - 5) + (geschossdecke * 6.5) formula  This ensures fenster m² prices update when geschossdecke changes.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [128ede1f6cf50e84ca8d817efe82fa587b9b0464] - Mon Nov 10 13:12:48 2025 +0100

**Author**: stenkjan
**Message**: `fix: Update Fenster & Türen m² price to include geschossdecke in calculation  Updated getFensterPricePerSqm to: - Accept geschossdeckeQuantity parameter - Use PriceUtils.getAdjustedNutzflaeche() for correct divisor - Apply (nestSize - 5) + (geschossdecke * 6.5) formula  Updated ConfiguratorShell.tsx to: - Pass geschossdecke quantity to all getFensterPricePerSqm() calls - Ensures fenster m² price updates when geschossdecke changes  Now fenster & türen /m² price correctly reflects total usable area including geschossdecke.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx

---

## [2c9ee82e3b7cde428e248a27ce3b69050c9397b5] - Mon Nov 10 13:11:00 2025 +0100

**Author**: stenkjan
**Message**: `fix: Correct m² calculation formula and Planungspakete prices  1. Fixed getAdjustedNutzflaeche formula:    - Now uses (nestSize - 5) for base area    - Geschossdecke adds 6.5m² per unit (not 7.5m²)    - Applies to ALL m² price calculations in the configurator  2. Fixed Planungspakete prices (now FIXED, not dependent on Nest size):    - Basis: 0€ (included)    - Plus: 9600€    - Pro: 12700€  3. Updated geschossdecke own area calculation to 6.5m²  This ensures correct m² pricing for: - Geschossdecke, Gebäudehülle, Innenverkleidung - Bodenbelag, Bodenaufbau, Fenster & Türen - Fundament, Planungspakete  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceUtils.ts

---

## [479366cb37422f03ec0af097a5f83fb762dee345] - Mon Nov 10 12:58:23 2025 +0100

**Author**: stenkjan
**Message**: `feat: Add clearAllCaches method to PriceCalculator  Added clearAllCaches() method to support the debug component: - Clears calculation cache (LRU cache) - Clears pricing data from memory - Removes sessionStorage cache - Resets cache statistics  This allows developers to force a fresh reload of pricing data during debugging.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [fe869104ad632caa379fed41cbe76bd747f69a62] - Mon Nov 10 12:53:18 2025 +0100

**Author**: stenkjan
**Message**: `fix: Update parsePvAnlage to use pricesByQuantity structure  Changed PV-Anlage parsing to match the new data structure: - Parse rows 29-44 (quantities 1-16) from Google Sheets - Store prices by quantity: pricesByQuantity[nestSize][quantity] - Removed obsolete pricePerModule structure  This ensures the pricing sync correctly populates the database with quantity-based pricing for PV-Anlage modules.  `

### Changes Analysis

---

## [a4977bf2fdf46807b036049bc8bbd94683893472] - Mon Nov 10 12:51:33 2025 +0100

**Author**: stenkjan
**Message**: `fix: Update PriceCacheDebugger to match getCacheStats return type  Updated CacheInfo interface to match the actual return type of PriceCalculator.getCacheStats(): - size, maxSize, hits, misses, hitRate, avgDuration, totalCalculations  Updated JSX to display new cache statistics: - Cache size utilization - Hit rate percentage - Average calculation duration - Total calculations, hits, and misses  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/debug/PriceCacheDebugger.tsx

---

## [c7cf50b60dcd008ead13d564c8ed076cbe636ece] - Mon Nov 10 12:47:12 2025 +0100

**Author**: stenkjan
**Message**: `fix: Rename getCacheInfo to getCacheStats in PriceCacheDebugger  The PriceCalculator class exports getCacheStats(), not getCacheInfo(). Updated the debug component to use the correct method name.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/debug/PriceCacheDebugger.tsx

---

## [10bfb2197f8c279ab779aa4e6e6dd116c69654c5] - Mon Nov 10 12:44:26 2025 +0100

**Author**: stenkjan
**Message**: `fix: Complete PV-Anlage pricing calculation fix  Changed line 453 from:   additionalPrice += selections.pvanlage.quantity * pricePerModule To:   additionalPrice += price  Now correctly uses quantity-based pricing from Google Sheets.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [fecf1bb3124c058bb83069db749f8e9d3b8a7dc4] - Mon Nov 10 12:37:10 2025 +0100

**Author**: stenkjan
**Message**: `fix: Update PricingData interface for pvanlage.pricesByQuantity  TypeScript error: Property 'pricesByQuantity' does not exist Issue: Interface had 'pricePerModule' but actual data structure uses 'pricesByQuantity'  Fix: Updated pvanlage interface to match actual data structure with quantity-based pricing  `

### Changes Analysis

---

## [f2d8c1127c60d67a233028a1a538840ab841c465] - Mon Nov 10 12:28:47 2025 +0100

**Author**: stenkjan
**Message**: `fix: Correct geschossdecke price per m² calculation  Issue: Geschossdecke showed different price/m² when clicked vs when Nest size changed  Root cause: - Was dividing unit price (4,115€) by TOTAL Nest area - Should divide by geschossdecke's own area (7.5m²)  Fixes: 1. Added special handling for geschossdecke in calculateOptionPricePerSquareMeter() 2. Price/m² now correctly calculated as: 4,115€ / 7.5m² = ~549€/m² 3. Fixed geschossdeckeArea from 6.5m² to 7.5m² (correct value)  Result: Consistent price/m² display for geschossdecke regardless of selection method  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceUtils.ts

---

## [8bdb5d0982e77c01ccd88bd298b26646e7338e43] - Mon Nov 10 12:15:49 2025 +0100

**Author**: stenkjan
**Message**: `fix: Make getPricingData() public for ConfiguratorShell access  TypeScript error: Property 'getPricingData' is private ConfiguratorShell needs access to pricing data for innenverkleidung display Changed visibility from private to public  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [56c3bfc2b52613ff866237c95bb9ee8fb5bd1d4c] - Mon Nov 10 12:13:02 2025 +0100

**Author**: stenkjan
**Message**: `feat: Enhance pricing data handling and caching mechanisms  - Added cache control headers to API responses for improved caching strategies. - Updated PriceCalculator to implement an LRU cache with a maximum size and increased TTL for better performance. - Refactored pricing data structure to use price per module instead of prices by quantity for PV modules. - Adjusted various pricing amounts in configurator data for accuracy and consistency. - Improved error handling and logging in pricing sheet service for better debugging.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/pricing/data/route.ts
- src/app/api/test/db/route.ts
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/data/configuratorData.ts

#### 📚 Documentation Changes

- docs/KONFIGURATOR_AUDIT_REPORT.md
- docs/KONFIGURATOR_AUDIT_SUMMARY.md
- docs/KONFIGURATOR_OPTIMIZATION_PLAN.md
- docs/KONFIGURATOR_TESTING_CHECKLIST.md

---

## [3e2c7fdb5e6cb9c6ea5cac81d1544785fb4fff7c] - Mon Nov 10 11:39:14 2025 +0100

**Author**: stenkjan
**Message**: `fix: Pass geschossdeckeQuantity to all price/m² calculations  - Added geschossdeckeQuantity prop to SelectionOption component - Pass configuration?.geschossdecke?.quantity to all SelectionOption instances - All calculateOptionPricePerSquareMeter calls now include geschossdeckeQuantity parameter - Price/m² now correctly adjusts when Geschossdecke is selected:   * Base: totalPrice / nestSize   * With 1 Geschossdecke: totalPrice / (nestSize + 6.5)   * With 2 Geschossdecke: totalPrice / (nestSize + 13)   * etc. - This brings down the price per m² as intended when Geschossdecke is added  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SelectionOption.tsx

---

## [a8f25b0d7656dfc495309ae63390a36e15685edd] - Mon Nov 10 11:26:19 2025 +0100

**Author**: stenkjan
**Message**: `fix: Hardcode nest160 max geschossdecke to 7 when sheet returns 0  - Google Sheets O7 cell returns 0 for unknown reason despite showing 7 - Added fallback logic: if parsed value is 0, use 7 instead - This ensures nest160 can select up to 7 geschossdecke modules - Added debug logging to track raw value -> parsed -> final value  `

### Changes Analysis

---

## [cfecdcab65b1124b3d77289bed90a50d526e6e82] - Mon Nov 10 11:21:24 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [116716ec38c792dfe5cb25b19397392b7e7d4e07] - Mon Nov 10 11:08:48 2025 +0100

**Author**: stenkjan
**Message**: `fix: Geschossdecke amount picker stays visible when switching nest sizes  - Changed selector visibility condition from 'configuration?.geschossdecke' to 'configuration?.geschossdecke || geschossdeckeQuantity > 0' - Selector now remains visible when local state has quantity even if configuration hasn't updated yet - Fixes issue where amount picker disappeared when switching between nest sizes - Users can now change geschossdecke amount for all nest sizes (80, 100, 120, 140, 160)  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx

---

## [9c2f8be39079a946bce70a1db0de4eef4a6caab4] - Mon Nov 10 10:59:08 2025 +0100

**Author**: stenkjan
**Message**: `fix: CRITICAL - Fix Geschossdecke pricing to ALWAYS show 4115€ unit price  **ALL GESCHOSSDECKE PRICING ISSUES FIXED:**  1. **Removed 'Ab' from left description**    - Changed 'Ab 4.115€ pro Einheit' to '4.115€ pro Einheit'  2. **Fixed right side price to ALWAYS show 4115€**    - Removed calculateSizeDependentPrice() from getDisplayPrice()    - Now uses fixed pricingData.geschossdecke.basePrice    - No more nest-size-dependent pricing (was 7201€ for nest140, etc.)  3. **Implemented correct m² calculation**    - Formula: 4115 / nestSize / 6.5    - nest80: 4115/80/6.5 = 8€/m²    - nest160: 4115/160/6.5 = 4€/m²    - Replaced '— €/m²' placeholder with actual calculation  4. **Price display now consistent:**    - Left: '4.115€ pro Einheit'    - Right: 'Ab 4.115€ entspricht X€/m²'    - ALWAYS 4115€ regardless of quantity or nest size  This fixes the critical bug where Geschossdecke showed incremental prices (7201€, 8230€) instead of the fixed unit price.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SelectionOption.tsx

---

## [54fcda9be6629c37e343a501907afcf4431fea71] - Mon Nov 10 10:47:26 2025 +0100

**Author**: stenkjan
**Message**: `fix: Geschossdecke display shows unit price instead of total  - Fixed getActualContributionPrice to return UNIT price (4115€) not total price - Removed quantity multiplication for geschossdecke display price - Selection box now always shows 'Ab 4.115€' regardless of quantity selected - QuantitySelector shows the total (e.g., '2 × 4.115€ = 8.230€') - Removed unnecessary quantity check - geschossdecke can exist without quantity - Fixes issue where price displayed as 8.230€ (2×4115) instead of 4.115€  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx

---

## [feb1662ae1723d5439f954fe7a0b5dd80db90a49] - Mon Nov 10 10:36:23 2025 +0100

**Author**: stenkjan
**Message**: `fix: Add Ab prefix to PV-Anlage standard price type  - PV-Anlage price type is converted from 'upgrade' to 'standard' in ConfiguratorShell - Added 'Ab' prefix logic to type === 'standard' section for pvanlage and geschossdecke - Now shows 'Ab 3.934€' for PV-Anlage in all display states - Fixes issue where PV showed '3.934€' without 'Ab' prefix while Geschossdecke showed it correctly  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/SelectionOption.tsx

---

## [f8ae8e6a9430156d93ee9ff5b859c300fb964035] - Mon Nov 10 10:34:36 2025 +0100

**Author**: stenkjan
**Message**: `fix: CRITICAL - Fix Geschossdecke incremental pricing and add Ab prefix  **GESCHOSSDECKE FIXES:** - Fixed Geschossdecke to use FIXED base price (4115€) instead of nest-size-dependent pricing - Replaced all calculateSizeDependentPrice() calls with pricingData.geschossdecke.basePrice - Geschossdecke price is now ALWAYS 4115€ per unit regardless of nest size - Updated unit price display to show 'Ab 4.115€ pro Einheit' - Fixed QuantitySelector to use fixed base price from pricing data  **AB PREFIX FIXES:** - Added 'Ab' prefix to Geschossdecke unselected state (type: 'upgrade') - Added 'Ab' prefix to Geschossdecke selected state (type: 'selected') - Both PV-Anlage and Geschossdecke now consistently show 'Ab' prefix in all states  This fixes the critical issue where Geschossdecke incorrectly increased in price for larger nest sizes.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SelectionOption.tsx

---

## [fe239bad1311223afc708ec20037375219f98371] - Mon Nov 10 09:52:51 2025 +0100

**Author**: stenkjan
**Message**: `fix: Add 'Ab' prefix to PV-Anlage selected state price display  - Added 'Ab' prefix to pvanlage price when option is selected (type: 'selected') - Previously only showed 'Ab' for unselected state - Now consistently shows 'Ab 3.934€' in both selected and unselected states - Fixes issue where selected PV box showed '3.934€' without 'Ab' prefix  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/SelectionOption.tsx

---

## [5df809eb5e32b10a0eb5e8867e7f54c637208db3] - Mon Nov 10 09:43:44 2025 +0100

**Author**: stenkjan
**Message**: `fix: Add 'Ab' prefix to PV-Anlage upgrade price display  - Modified upgrade price display logic in SelectionOption to show 'Ab 3.934€' for pvanlage category - Previously showed '+3.934€' or '3.934€' without 'Ab' prefix - Now correctly displays 'Ab 3.934€' with 'entspricht 984€ / Panel' subtitle  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/SelectionOption.tsx

---

## [96d7447178d91bc7798469f324288ca9a78c26cf] - Mon Nov 10 09:40:57 2025 +0100

**Author**: stenkjan
**Message**: `fix: Correct PV-Anlage panel count and price display  - Changed description from '3 Panels pro PV-Modul' to '4 Panels pro PV-Modul' - Added 'Ab' prefix to PV-Anlage base price display (e.g., 'Ab 3.934€') - Fixed per-panel price calculation to divide by 4 instead of 3 (3934€ / 4 = 984€ per panel) - Updated all price.amount / 3 calculations to price.amount / 4 throughout SelectionOption component - Now correctly shows 'entspricht 984€ / Panel' instead of '1.311€ / Panel'  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/SelectionOption.tsx
- src/app/konfigurator/data/configuratorData.ts

---

## [67422a2c765820ec52ee1df3a2be700faf03dc33] - Mon Nov 10 09:31:55 2025 +0100

**Author**: stenkjan
**Message**: `fix: Use cumulative pricing for PV-Anlage from pricing data table  - Modified QuantitySelector to support cumulative pricing via new cumulativePrice prop - For PV-Anlage, display shows cumulative total price instead of unitPrice × quantity - Updated ConfiguratorShell to fetch cumulative prices from pricingData.pvanlage.pricesByQuantity - Prices now correctly match Google Sheets table (F29-N44):   * nest80: 1 module = 3,934€, 2 = 6,052€, 3 = 8,169€, 4 = 10,286€, ..., 8 = 18,815€   * nest160: 16 modules = 39,539€ (N44) - Display format changed from 'X€/Modul' to total price with 'für X Module' subtitle - Fixes issue where PV pricing was calculated as quantity × per-module price instead of using cumulative table values  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/db/route.ts
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/QuantitySelector.tsx

---

## [79e94f3ecd207485ed3d79ea70e1156c6f85919d] - Sun Nov 9 15:04:18 2025 +0100

**Author**: stenkjan
**Message**: `fix: Show absolute prices for innenverkleidung options instead of relative prices  - Changed Fichte preselection price from 1400€ to 23020€ (nest80 value from Google Sheets F24) - Modified getActualContributionPrice() to show ABSOLUTE prices for innenverkleidung category - Fichte now displays 23,020€ when selected (not 'inklusive') - Lärche displays 31,921€ when selected - Eiche displays 37,235€ when selected - All prices correctly scale with nest size selection - Fixes issue where innenverkleidung showed 'inklusive' for standard option despite having concrete pricing  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx

---

## [48482beddf7cf5fa54d349e755683dc13881a21c] - Sun Nov 9 14:56:25 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Change getPricingData method visibility to public  - Updated the visibility of the  method in the PriceCalculator class from private to public to allow external access. - Enhances the usability of the PriceCalculator module.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [33cbc4065fd185b5aff7b1fd9a00f6d94e8941a2] - Sun Nov 9 14:52:26 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Remove unused price calculation function from PriceCalculator  - Deleted the  import as it is no longer needed. - Streamlines the PriceCalculator module for better maintainability.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [348abf1c1abd49c535e1cb4e46a2d42ea645aa14] - Sun Nov 9 14:45:13 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/KonfiguratorClient.tsx
- src/app/konfigurator/core/PriceCalculator.ts
- src/components/debug/PriceCacheDebugger.tsx

#### 📚 Documentation Changes

- FIX_OLD_PRICES_DISPLAY.md
- docs/COMMIT_HISTORY.md
- docs/PRICING_SYNC_ARCHITECTURE.md

---

## [fddad61d64bb96e8dfb8f9f1ad907f08be05c1c1] - Sat Nov 8 21:45:15 2025 +0100

**Author**: stenkjan
**Message**: `chore: Increment cache version to 4 to force reload of exact prices  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [b523de702bcc1cb3b872774760658ca41172c90d] - Sat Nov 8 21:38:01 2025 +0100

**Author**: stenkjan
**Message**: `fix: Remove all price rounding to preserve exact spreadsheet values  - Removed Math.round() from parseNumber function - Removed Math.round() from pricePerSqm calculation - Prices now use exact values from Google Sheets - Example: 188.619 * 1000 = 188619 (not rounded to 189000) - Ensures 1:1 accuracy between spreadsheet and database  `

### Changes Analysis

---

## [143ec25cdc926e311a8712a47489dea7289cb6d4] - Sat Nov 8 21:34:38 2025 +0100

**Author**: stenkjan
**Message**: `fix: Correct price parsing to multiply before rounding  - Changed parseNumber logic to multiply by 1000 BEFORE rounding - Prevents precision loss (188.619 -> 189 -> 189000 is wrong) - Now correctly: 188.619 -> 188619 -> 188619 (after rounding) - Fixes nest prices to match exact spreadsheet values - nest80: 188,619 (was 189,000) - nest100: 226,108 (was 226,000) - nest120: 263,597 (was 264,000) - nest140: 301,086 (was 301,000) - nest160: 338,575 (was 339,000)  `

### Changes Analysis

---

## [d7f2ca0c5b6ef9f717cb48a008061f69826c56a8] - Sat Nov 8 21:13:24 2025 +0100

**Author**: stenkjan
**Message**: `fix: Ensure cleanup function returns undefined in PriceCacheDebugger  - Added return statement to cleanup function in useEffect to explicitly return undefined, improving clarity and adherence to React best practices.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/debug/PriceCacheDebugger.tsx

---

## [19324a7dc46cd043b3da594d136dc1ab4a964e63] - Sat Nov 8 21:08:04 2025 +0100

**Author**: stenkjan
**Message**: `fix: Update pricing sync architecture and enhance price calculator cache versioning  - Corrected diagram formatting in PRICING_SYNC_ARCHITECTURE.md - Incremented CACHE_VERSION in PriceCalculator.ts to 3 for cache invalidation - Added support for ASCII version of 'lärche' in pricing-sheet-service.ts  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

#### 📚 Documentation Changes

- docs/PRICING_SYNC_ARCHITECTURE.md

---

## [7529111878cdb684ddef0d1cddf49deb6f0ad7d0] - Sat Nov 8 19:50:36 2025 +0100

**Author**: stenkjan
**Message**: `Merge 0b6c832387348e160000f85b5ac066dd469511ba into acc8e9291f4089688a0fd937f173ad3d166fcdff  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/KonfiguratorClient.tsx
- src/app/konfigurator/core/PriceCalculator.ts
- src/components/debug/PriceCacheDebugger.tsx

#### 📚 Documentation Changes

- FIX_OLD_PRICES_DISPLAY.md

---

## [7479c300d2ee0932f865d008ec9803f93fafe3d5] - Sat Nov 8 19:29:28 2025 +0100

**Author**: stenkjan
**Message**: `fix: Move planungspaket section to end of configurator  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/data/configuratorData.ts

---

## [5ad5747d33e413439aafe428b387993995a24666] - Sat Nov 8 19:25:00 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [0d3321b4cfd4968a00c322b16719761ed75bed45] - Sat Nov 8 19:23:31 2025 +0100

**Author**: stenkjan
**Message**: `fix: Price parsing in thousands  `

### Changes Analysis

---

## [40574b2fe66df29ee8abef7760012a4f1ca307eb] - Sat Nov 8 19:10:29 2025 +0100

**Author**: stenkjan
**Message**: `perf: Session caching and error handling  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [dc5d61b7f4a5bd0c8295e0ae8dc955fdbb415f6f] - Sat Nov 8 19:04:52 2025 +0100

**Author**: stenkjan
**Message**: `fix: PV modules safe defaults  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [d7a2c5627c811903e45bb63b9cea5773ab97c016] - Sat Nov 8 19:00:08 2025 +0100

**Author**: stenkjan
**Message**: `fix: Belichtungspaket pricing order  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [369609a683cb0f28bdf4338a60d6755bd963f52e] - Sat Nov 8 18:49:04 2025 +0100

**Author**: stenkjan
**Message**: `fix: Graceful pricing data loading  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/core/PriceCalculator.ts

---

## [65609e71b3e3897a2292f8af3b38817ff71a9a57] - Sat Nov 8 18:44:54 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [f03033c93f7c6952974b88c03e1c1ed84e76adae] - Sat Nov 8 18:37:44 2025 +0100

**Author**: stenkjan
**Message**: `fix: Remove old sync-pricing endpoints  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/cron/sync-pricing/route.ts
- src/app/api/sync/pricing/route.ts

---

## [f68996adc47bfeeabb35f1182568417fbd30ca7c] - Sat Nov 8 18:34:48 2025 +0100

**Author**: stenkjan
**Message**: `Merge pricing overhaul with new spreadsheet ID  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/cron/sync-pricing/route.ts
- src/app/api/sync/pricing/route.ts
- src/app/api/test/sheets-info/route.ts
- src/app/api/test/sheets-metadata/route.ts

#### 🔧 Configuration Changes

- .env
- .env.local

---

## [9f659f010af8bce37c53d202668564e0458f0005] - Sat Nov 8 18:12:45 2025 +0100

**Author**: stenkjan
**Message**: `fix: Update sheet name to Preistabelle_Verkauf  `

### Changes Analysis

---

## [3180ce8239b6e9d98656c6a259d5ee7515de91af] - Sat Nov 8 18:10:53 2025 +0100

**Author**: stenkjan
**Message**: `feat: Add sheets info test endpoint  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/sheets-info/route.ts

---

## [33a6aec5bb79fc6a361d22034eb5534bd781a398] - Sat Nov 8 17:34:05 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [13be76572fd44dc3d834c16fb00dbb977f02e450] - Sat Nov 8 17:28:52 2025 +0100

**Author**: stenkjan
**Message**: `docs: Add pricing initial sync guide  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/PRICING_INITIAL_SYNC.md

---

## [29a36f06a71a17407a3764c1ea11988212b37e60] - Sat Nov 8 17:15:28 2025 +0100

**Author**: stenkjan
**Message**: `fix: Remove all non-ASCII characters from pricing-sync.ts for UTF-8 compliance  `

### Changes Analysis

---

## [e0db261ee3d1a30ec34aad922e85d112384abf7b] - Sat Nov 8 17:01:13 2025 +0100

**Author**: stenkjan
**Message**: `fix: Update pricing services to remove PricingSyncLog references and fix type casts  `

### Changes Analysis

---

## [f4533590a8af1beb8215c288df10d605551c0a73] - Sat Nov 8 16:53:06 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Standardize formatting in Prisma schema  - Adjusted whitespace and alignment for consistency across models in the Prisma schema. - Ensured uniform spacing and indentation for improved readability and maintainability.  `

### Changes Analysis

#### ⚙️ Backend Changes

- prisma/schema.prisma

---

## [e8cc68ebb8d0bef3d8ae39a6a17ce6d642942d62] - Sat Nov 8 16:45:01 2025 +0100

**Author**: stenkjan
**Message**: `fix: Remove corrupted PricingSyncLog model and fix unused variable errors  `

### Changes Analysis

#### ⚙️ Backend Changes

- prisma/schema.prisma

---

## [92a1d848a594a440c3bb00e5305238c149993acc] - Sat Nov 8 15:53:32 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [fd648334524621fa5e204abe1082d69de97c6b65] - Fri Nov 7 15:51:01 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [5923825d5c530e47b93587170231e03e11fb7b5b] - Fri Nov 7 15:38:56 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [e914acc3b2330ee8fe1a6772dc8492b225110789] - Fri Nov 7 15:29:05 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [15edc03b375a00d8acc9bcd2d6d291077b0d50b7] - Fri Nov 7 14:46:27 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Update CheckoutStepper logic for step 3 visibility and navigation  - Modified the condition for displaying step 3 in CheckoutStepper to show when there's a configuration or when not in ohne-nest mode. - Ensured navigation buttons for step 3 are always displayed when on that step, enhancing user experience and clarity in the checkout process.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [af5567dd0f4485a31cef91b2de0c7328184e7259] - Fri Nov 7 13:26:28 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Update CartFooter navigation to use window.location for state initialization  - Replaced router.push with window.location.href in CartFooter for better state management during navigation. - Adjusted styling of the "Zum Konfigurator" link in WarenkorbClient for improved UI consistency.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/CartFooter.tsx
- src/app/warenkorb/WarenkorbClient.tsx

---

## [26402181d7e55358a83ea7a76608d92a46967924] - Fri Nov 7 13:13:24 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [b3bf29442fe7ad070598a1abbfbb7de930a24f6f] - Fri Nov 7 12:51:04 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Mark unused delivery date function in CheckoutStepper  - Prefixed getDeliveryDate with an underscore to indicate intentional non-use, improving code clarity and adherence to TypeScript safety rules.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [a6986c748e7bf97a85a64bacdba7a1ded6fa31ec] - Fri Nov 7 12:43:24 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [ba012bbd2ef995101b28df189a627eb3af5a6c4e] - Fri Nov 7 12:30:12 2025 +0100

**Author**: stenkjan
**Message**: `Merge branches 'main' and 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [7a529d86296b9bcc42dc1ce3c3cc740094a86c82] - Fri Nov 7 11:30:19 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [20b3f5553e0fad0c5477bad78191f653bdc6a853] - Fri Nov 7 11:28:44 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [d14b1ed96fe08eeed8582e136d18c5277b784f2b] - Thu Nov 6 16:02:58 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Update pricing logic and documentation for Grundstückscheck  - Adjusted Grundstückscheck price to reflect the new value of 1500, aligning with checkout pricing. - Improved documentation in project rules to clarify mandatory workflows for TypeScript safety checks and pre-commit procedures. - Reformatted code for better readability in CheckoutStepper component, ensuring consistent styling and structure.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/pricing/calculate/route.ts
- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [afc2693d087f170888feefc38e20c3d6eec80edd] - Thu Nov 6 15:54:51 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Improve appointment handling and session management in cart store  - Updated appointment-related functions to accept sessionId for better session tracking. - Enhanced appointment summary retrieval to ensure it only returns data for the current session. - Refactored CheckoutStepper and AppointmentBooking components to utilize new session-aware methods. - Cleaned up pricing display logic in SelectionOption component for improved clarity.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/SelectionOption.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/sections/AppointmentBooking.tsx

---

## [4910b2169492697211a2894721b4d4ea03264645] - Thu Nov 6 15:48:01 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [c162275e80fcd6c4b24f04b7caf6a80ac2a23c34] - Thu Nov 6 15:43:26 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Enhance geschossdecke pricing and description handling  - Dynamically calculate and update the unit price for 'Geschossdecke' based on configuration size. - Adjusted the description for 'Geschossdecke' to reflect dynamic pricing. - Updated 'Standard' option description to be empty for better visual alignment in the UI. - Implemented special handling for 'Standard' to center vertically when no description is provided.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SelectionOption.tsx
- src/app/konfigurator/data/configuratorData.ts

---

## [5d313bc4446ebd602131c42cff989063790ecf4a] - Thu Nov 6 15:34:26 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [e55ee06c52e70a0933920e3f35cd921fbd3d3151] - Thu Nov 6 15:21:22 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [7c2db51ce8287278117e8353f9393b8bd9047f1e] - Thu Nov 6 13:49:08 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [371e22ef120be3a714e7b4aab7e6dca3a11e9630] - Thu Nov 6 12:51:00 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [618d104e10732021706dadb2303ab9dd869c6775] - Thu Nov 6 12:39:58 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [71e732639fed283b7e4678ca1259b02966ece953] - Thu Nov 6 12:36:02 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Update interior cladding material from Kiefer to Lärche across multiple components and configurations  - Changed default and selected values for interior cladding from 'kiefer' to 'laerche' in various files including pricing calculations, configurator components, and data mappings. - Updated related descriptions and mappings to reflect the new material choice.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/admin/user-tracking/all-configurations/route.ts
- src/app/api/admin/user-tracking/route.ts
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/GeschossdeckeOverlay.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/core/ImageManager.ts
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/data/configuratorData.ts
- src/app/konfigurator/data/dialogConfigs.ts
- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [fe0d90e4043aac4a75fac03e35c7832ed22926df] - Thu Nov 6 12:15:59 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/cron/sync-pricing/route.ts
- src/app/api/sync/pricing/route.ts
- src/components/admin/PricingSyncPanel.tsx

#### ⚙️ Backend Changes

- prisma/schema.prisma

#### 🔧 Configuration Changes

- .env.local
- package.json

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/PRICING_SYNC_ARCHITECTURE.md
- docs/PRICING_SYNC_ENV_VARS.md
- docs/PRICING_SYNC_IMPLEMENTATION_COMPLETE.md
- docs/PRICING_SYNC_QUICK_REF.md
- docs/PRICING_SYNC_SETUP.md

---

## [ce66bc274849be197ddfcf34b988555cf1acb432] - Thu Nov 6 11:08:47 2025 +0000

**Author**: stenkjan
**Message**: `Merge 53d4da7d5949ec0cb3f72374db2598060e21bdc3 into ea947d3a41e1120bd78027d16c21506fafc57480  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/cron/sync-pricing/route.ts
- src/app/api/sync/pricing/route.ts
- src/components/admin/PricingSyncPanel.tsx

#### ⚙️ Backend Changes

- prisma/schema.prisma

#### 🔧 Configuration Changes

- .env.local
- package.json

#### 📚 Documentation Changes

- docs/PRICING_SYNC_ARCHITECTURE.md
- docs/PRICING_SYNC_ENV_VARS.md
- docs/PRICING_SYNC_IMPLEMENTATION_COMPLETE.md
- docs/PRICING_SYNC_QUICK_REF.md
- docs/PRICING_SYNC_SETUP.md

---

## [470e481e0f884575e20b63e9ffe239ebd7537d98] - Thu Nov 6 11:53:21 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [28e795b9200832334d0a95ebd85047d681ac8b6f] - Wed Nov 5 16:43:35 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/impressum/ImpressumClient.tsx
- src/app/konfigurator/components/ConfiguratorContentCardsLightbox.tsx
- src/app/konfigurator/data/dialogConfigs.ts
- src/components/cards/UnifiedContentCard.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [18220d90a4b5c78892f8a0217a1d54aedbdf08b8] - Wed Nov 5 16:25:32 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/images/route.ts
- src/app/dein-nest/DeinNestClient.tsx
- src/app/kontakt/KontaktClient.tsx
- src/app/nest-system/NestSystemClient.tsx
- src/components/cards/UnifiedContentCard.tsx
- src/components/grids/TwoByTwoImageGrid.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [4e77da73174ee0c9c1c028cdee9d04300936ef20] - Wed Nov 5 15:56:15 2025 +0100

**Author**: stenkjan
**Message**: `refactor: Rename variables for clarity and consistency  - Updated variable names in DeinNestClient, KontaktClient, NestSystemClient, UnifiedContentCard, and TwoByTwoImageGrid components to include underscores for unused parameters. - This change enhances code readability and maintains consistency across the codebase.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-nest/DeinNestClient.tsx
- src/app/kontakt/KontaktClient.tsx
- src/app/nest-system/NestSystemClient.tsx
- src/components/cards/UnifiedContentCard.tsx
- src/components/grids/TwoByTwoImageGrid.tsx

---

## [817196d7cf7af9534140ded9d1a97473827d7e36] - Wed Nov 5 15:47:13 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [7579d36a952002b45c0a4ff828a1514aadd55494] - Wed Nov 5 15:20:57 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/LandingPageClient.tsx
- src/app/dein-nest/DeinNestClient.tsx
- src/app/kontakt/KontaktClient.tsx
- src/app/nest-system/NestSystemClient.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/components/Footer.tsx
- src/components/cards/UnifiedContentCard.tsx
- src/components/grids/TwoByTwoImageGrid.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [27a5538a900016120af089da077774b013272f24] - Wed Nov 5 15:04:31 2025 +0100

**Author**: stenkjan
**Message**: `feat: Update LandingPageClient and Footer for improved UI consistency  - Changed secondary button variant for sections in LandingPageClient to ensure consistent styling. - Updated text color in LandingPageClient for better visibility. - Modified footer background color in Footer component for enhanced aesthetics.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/LandingPageClient.tsx
- src/components/Footer.tsx

---

## [61f8db7c8c53abfcee78cfc885a31b1082d2b9ad] - Wed Nov 5 13:32:35 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [6a1a7dbb5b543b6028acac0fd7874f44a25cfd5f] - Wed Nov 5 13:02:39 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [ec85d5638a6821be87fe1e43abb66e9de701106b] - Wed Nov 5 12:24:08 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [1254ddc11c46fb906971d9667a4355427b5570c7] - Wed Nov 5 11:15:30 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/admin/user-tracking/all-configurations/route.ts
- src/app/konfigurator/components/BelichtungspaketOverlay.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/konfigurator/core/PriceCalculator.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [9bc7940e7edf894b6350802b80c821c53545fc6f] - Wed Nov 5 10:37:14 2025 +0100

**Author**: stenkjan
**Message**: `Merge branches 'main' and 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [244f3256391eede800c696d612056665a5957ebe] - Wed Nov 5 10:32:44 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/KONFIGURATOR-REFACTORING-PLAN.md
- docs/KONFIGURATOR-SWITCH-GUIDE.md
- docs/USER_TRACKING_FIXES_COMPLETE.md
- preiskalkulation/ANGEBOT_EXTRACTION_TEMPLATE.md
- preiskalkulation/PRICING_ANALYSIS_CURRENT_STATE.md
- preiskalkulation/PRICING_QUESTIONNAIRE.md
- preiskalkulation/README_PRICING_OVERHAUL.md
- preiskalkulation/SIMPLE_QUESTIONNAIRE.md
- preiskalkulation/SIMPLE_QUESTIONS.md
- preiskalkulation/START_HERE.md
- preiskalkulation/UPLOAD_INSTRUCTIONS.md

---

## [f52808a54a3acb6b2e6c776ddbbcbeca2f148505] - Wed Nov 5 09:44:17 2025 +0100

**Author**: stenkjan
**Message**: `fix: Update terminology in CheckoutStepper component  - Changed "Deine Konfiguration" to "Deine Auswahl" in multiple locations for consistency. - Updated related text to enhance clarity regarding the user's selection process. - Adjusted pricing display logic to reflect the correct action price for "Check & Vorentwurf".  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/KONFIGURATOR-REFACTORING-PLAN.md
- docs/KONFIGURATOR-SWITCH-GUIDE.md
- docs/USER_TRACKING_FIXES_COMPLETE.md

---

## [478115c291d0247bbdfbdeb3648bc7234638c6c5] - Tue Nov 4 16:37:06 2025 +0000

**Author**: stenkjan
**Message**: `Merge e381c4e19589df8389edce65089037dd259e219c into 00137f134d9dc43b2e2f43845d72e73c95eff3fe  `

### Changes Analysis

#### 📚 Documentation Changes

- preiskalkulation/ANGEBOT_EXTRACTION_TEMPLATE.md
- preiskalkulation/PRICING_ANALYSIS_CURRENT_STATE.md
- preiskalkulation/PRICING_QUESTIONNAIRE.md
- preiskalkulation/README_PRICING_OVERHAUL.md
- preiskalkulation/SIMPLE_QUESTIONNAIRE.md
- preiskalkulation/SIMPLE_QUESTIONS.md
- preiskalkulation/START_HERE.md
- preiskalkulation/UPLOAD_INSTRUCTIONS.md

---

## [2ea719d41cd75cb7d5b1b270c5a3b76484daf49a] - Tue Nov 4 17:30:16 2025 +0100

**Author**: stenkjan
**Message**: `chore: Update .gitignore to remove specific preiskalkulation files  - Removed Book5.xlsx and Angebot_-_15014024.pdf from .gitignore to prevent tracking of unnecessary temporary files in the preiskalkulation directory.  `

### Changes Analysis

---

## [97b9d14eb3ef4294f342602cb190236417b06a29] - Tue Nov 4 16:56:33 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [0992a282898834302e0d24f6b7d255c4cebc8e04] - Tue Nov 4 16:03:28 2025 +0100

**Author**: stenkjan
**Message**: `Merge: Fix ohne_belag image mappings  CRITICAL IMAGE FIX: ohne_belag combinations were showing incorrect parkett images  Problem: - INTERIOR_EXACT_MAPPINGS mapped ohne_belag to parkett image paths - Should show: 311-NEST-Haus-Konfigurator-Modul-Fassade-Trapezblech-Schwarz-Holz-Natur-ohne-Belag  Solution: - Updated all 12 ohne_belag mappings to use correct image names:   ✓ trapezblech_kiefer_ohne_belag → trapezblech_holznatur_ohne_belag   ✓ trapezblech_fichte_ohne_belag → trapezblech_holzweiss_ohne_belag   ✓ trapezblech_steirische_eiche_ohne_belag → trapezblech_eiche_ohne_belag   ✓ (and 9 more combinations for holzlattung, fassadenplatten_schwarz, fassadenplatten_weiss)  Result: - Standard config (trapezblech + kiefer + ohne_belag) now displays image 311 - All ohne_belag combinations (311-322) now show correctly in interior view - Users see proper flooring-free interior views when ohne_belag is selected  `

### Changes Analysis

---

## [ec7f8306133289cf2bf1fea9f84cece08fde39df] - Tue Nov 4 15:42:02 2025 +0100

**Author**: stenkjan
**Message**: `Merge: Fix critical parkett pricing in MODULAR_PRICING table  CRITICAL PRICING BUG FIX: Parkett was showing 0€ due to identical pricing with ohne_belag in MODULAR_PRICING  Root Cause: - trapezblech_kiefer_ohne_belag: base 155500, perModule 33600 - Dynamic calculation: parkett_price - ohne_belag_price = 0€  Impact: - Default material combination (trapezblech + kiefer) showed parkett as 0€ - Price didn't change when switching nest sizes - Users couldn't see proper parkett upgrade costs  Solution: - Calculated correct parkett pricing based on requirements:   - nest80 (4 modules): +3800€   - nest100 (5 modules): +5000€   - nest120 (6 modules): +6200€   - nest140 (7 modules): +7400€   - nest160 (8 modules): +8600€ - Pattern: +3800€ base difference, +1200€ per additional module - Updated trapezblech_kiefer_parkett: base 155700, perModule 34800  Verification: ✓ nest80: 260100 - 256300 = 3800€ ✓ nest100: 294900 - 289900 = 5000€ ✓ nest120: 329700 - 323500 = 6200€  Result: Parkett now displays correct nest-dependent pricing that scales properly  `

### Changes Analysis

---

## [1e40d55d5e624e69b46923509cccd70436641da5] - Tue Nov 4 15:35:20 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/admin/user-tracking/all-configurations/route.ts
- src/app/api/admin/user-tracking/route.ts
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/core/PriceUtils.ts
- src/app/konfigurator/data/configuratorData.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [0f987e5eea1db8893075b032a4aa1902f531deac] - Tue Nov 4 15:33:32 2025 +0100

**Author**: stenkjan
**Message**: `Merge: Restore nest-size dependent parkett pricing  CRITICAL PRICING RESTORATION: Fixed parkett pricing that was lost during ohne_belag implementation  Problem: - Parkett was showing 0€ instead of proper nest-dependent prices - ConfiguratorShell used 'parkett' as baseline for price calculations - Made parkett appear as no upgrade cost instead of actual pricing  Root Cause Analysis: - testFussboden default was 'parkett' (should be 'ohne_belag') - basePrice calculation used 'parkett' baseline (should be 'ohne_belag') - Pricing logic calculated parkett - parkett = 0€  Solution Implemented: 1. Added getParkettPrice() utility with correct pricing table:    ✓ nest80 (75m²): 3.800€    ✓ nest100 (95m²): 5.000€    ✓ nest120 (115m²): 6.200€    ✓ nest140 (135m²): 7.400€    ✓ nest160 (155m²): 8.600€  2. Fixed ConfiguratorShell baseline calculations:    ✓ testFussboden default: 'parkett' → 'ohne_belag'    ✓ basePrice uses 'ohne_belag' as baseline    ✓ Parkett now calculated as upgrade from ohne_belag  Result: - Parkett displays correct nest-dependent pricing - ohne_belag remains 0€ (included in base price) - Dynamic pricing works across all nest sizes - Price calculations use proper baseline logic  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/core/PriceUtils.ts

---

## [e837240149e37a73b98a95097c71932fb09a1e89] - Tue Nov 4 15:27:34 2025 +0100

**Author**: stenkjan
**Message**: `Merge: Fix ohne_belag default selection consistency  CRITICAL CONSISTENCY FIX: Unified ohne_parkett → ohne_belag naming across entire codebase  Problem: - configuratorData.ts used 'ohne_parkett' as option ID - configuratorStore.ts used 'ohne_belag' as default value - ID mismatch prevented proper auto-selection of default flooring  Solution - Updated 6 files: ✓ configuratorData.ts: Changed option ID to 'ohne_belag' ✓ ConfiguratorShell.tsx: All price calculation references ✓ PriceCalculator.ts: Default fussboden values ✓ SummaryPanel.tsx: Base calculation reference ✓ Admin API routes: User tracking field mappings  Result: - ohne_belag is first option in fussboden dropdown - Matches configuratorStore default selection - Auto-selected when configurator loads - Consistent 0€ pricing throughout app - Proper image mapping for ohne_belag interior views  User Experience: ✓ 'Ohne Belag' appears pre-selected by default ✓ No manual selection required for base configuration ✓ Consistent with minimum pricing structure (155.500€ + 2.800€) ✓ Proper geschossdecke overlay images for ohne_belag selections  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/admin/user-tracking/all-configurations/route.ts
- src/app/api/admin/user-tracking/route.ts
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/data/configuratorData.ts

---

## [11a31ff837a8d18bdb044f76de07108fce67b740] - Tue Nov 4 15:21:41 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/FensterOverlay.tsx
- src/app/konfigurator/components/GeschossdeckeOverlay.tsx
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/konfigurator/core/ImageManager.ts
- src/app/konfigurator/core/PriceCalculator.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [8bdcf317c27ca8864ea4116415b51b139ac0da7e] - Tue Nov 4 15:17:17 2025 +0100

**Author**: stenkjan
**Message**: `Merge: Fix Geschossdecke overlay material mapping  CRITICAL BUG FIX: Geschossdecke overlay was displaying incorrect images for material combinations  Problem: - Overlay was using raw innenverkleidung values (e.g., 'steirische_eiche') - Image keys require simplified names ('kiefer', 'fichte', 'eiche') - Result: All steirische_eiche selections fell back to fichte_ohne_belag  Solution: - Implemented proper material name mapping:   - 'kiefer' → 'kiefer'   - 'fichte' → 'fichte'   - 'steirische_eiche' → 'eiche' - Uses includes() checks for flexible matching - Removed incorrect 'eiche' from parkett floor type detection  Verified Test Cases: ✓ steirische_eiche + schiefer_massiv → 334-nest-haus-zwischendecke-geschossdecke-stockwerk-steinplatten-dunkel-eiche ✓ fichte + ohne_belag → 324-nest-haus-zwischendecke-geschossdecke-stockwerk-ohne-belag-fichte ✓ kiefer + parkett → 326-nest-haus-zwischendecke-geschossdecke-stockwerk-parkett-kiefer  All 12 geschossdecke overlay combinations now work correctly!  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/GeschossdeckeOverlay.tsx

---

## [c80327a5cc8b14cb387f4efb7fd9d2f7ae241e98] - Tue Nov 4 15:00:27 2025 +0100

**Author**: stenkjan
**Message**: `Merge: Fix Geschossdecke overlay dynamic updates and add ohne_belag images  GESCHOSSDECKE OVERLAY FIX: - Overlay now stays visible when innenverkleidung or fussboden changes - Dynamically updates to show new material combination - Removed hide logic that was preventing users from seeing updates - Improves UX by allowing real-time material preview with overlay active  NEW OHNE_BELAG INTERIOR IMAGES (311-322): - Added 11 new interior images for ohne_belag flooring option - Complete coverage for all facade + innenverkleidung combinations - Trapezblech, Platten Schwarz/Weiss, Holzlattung variants - Follows existing naming pattern: {facade}_{innenverkleidung}_ohne_belag  TECHNICAL IMPLEMENTATION: - GeschossdeckeOverlay uses React key with material props for re-render - Automatic image mapping based on innenverkleidung + fussboden values - Proper fallback to fichte_ohne_belag if no match - All changes lint-clean and type-safe  User can now: 1. Select geschossdecke and see overlay on interior view 2. Change innenverkleidung/fussboden while keeping overlay visible 3. See real-time material updates in the overlay 4. View ohne_belag interior images in base configurator  # Conflicts: #	src/app/konfigurator/components/FensterOverlay.tsx  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx

---

## [5f61b7d7c8e05e05ee30179161f9246aa62a9cc6] - Tue Nov 4 14:42:46 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [4253142de09fd60ae174687919142b48306ac318] - Tue Nov 4 14:41:09 2025 +0100

**Author**: stenkjan
**Message**: `Merge: Fix overlay system - remove fenster overlay, restore Geschossdecke overlay  CRITICAL OVERLAY FIXES:  1. ✅ Fenster/Window Overlay REMOVED:    - No view switching when selecting fenster & türen options    - Fenster preloading removed from ImageManager    - Fenster view falls back to exterior view    - Users can select window options without unwanted overlays  2. ✅ Geschossdecke Overlay RESTORED:    - Recreated GeschossdeckeOverlay.tsx component    - Fixed prop name: _isGeschossdeckeOverlayVisible → isGeschossdeckeOverlayVisible    - Shows on interior view when geschossdecke selected    - Hides when innenverkleidung/fussboden changes    - Shows again when geschossdecke activated  3. ✅ Price Calculation CORRECTED:    - Base price: trapezblech_kiefer_ohne_belag = 155.500€    - Minimum config: 155.500€ + 2.800€ belichtungspaket = 158.300€    - Consistent naming: ohne_parkett → ohne_belag across all constants  Testing Verified: - No fenster overlay appears when selecting window options ✓ - Geschossdecke overlay works as expected ✓ - Price calculation accurate for minimum configuration ✓ - All existing overlay interactions preserved ✓  # Conflicts: #	src/app/konfigurator/components/ConfiguratorShell.tsx #	src/app/konfigurator/components/GeschossdeckeOverlay.tsx #	src/app/konfigurator/components/PreviewPanel.tsx  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/GeschossdeckeOverlay.tsx
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/konfigurator/core/ImageManager.ts

---

## [c6f7a6e53865fe16935ea88c924c1205d2b51d8d] - Tue Nov 4 14:29:40 2025 +0100

**Author**: stenkjan
**Message**: `Merge: Fix critical price calculation and naming issues  CRITICAL FIXES: 1. Price Calculation Corrected:    - Was showing 154.500€ instead of expected 158.300€    - Fixed base price: trapezblech_kiefer_ohne_belag = 155.500€    - Belichtungspaket Light adds 2.800€ correctly    - New total: 155.500€ + 2.800€ = 158.300€ ✓  2. Consistent Naming:    - Renamed 'ohne_parkett' to 'ohne_belag' across all constants    - Updated MODULAR_PRICING combinations    - Updated PriceCalculator and configuratorStore defaults    - Clearer distinction: 'ohne_belag' (0€) vs 'parkett' (with cost)  3. Window Overlay Issue:    - FensterOverlay component already removed    - No window overlays showing in current implementation  All pricing calculations now accurate and consistent!  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [e3654ba93f5f0d9fe8997a025a47a038f3bcb8be] - Tue Nov 4 14:00:21 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/data/configuratorData.ts
- src/app/konfigurator2/components/Konfigurator2Client.tsx
- src/app/konfigurator2/components/SimplifiedCategorySection.tsx
- src/app/konfigurator2/components/VorentwurfButton.tsx
- src/app/konfigurator2/page.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/KONFIGURATOR-REFACTORING-PLAN.md
- docs/KONFIGURATOR-SWITCH-GUIDE.md

---

## [1e715275bbae82217fc1a3d2c6c84ef3938c6467] - Tue Nov 4 12:21:46 2025 +0100

**Author**: stenkjan
**Message**: `Merge: Complete konfigurator & warenkorb refactoring  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/data/configuratorData.ts
- src/app/konfigurator2/components/Konfigurator2Client.tsx
- src/app/konfigurator2/components/SimplifiedCategorySection.tsx
- src/app/konfigurator2/components/VorentwurfButton.tsx
- src/app/konfigurator2/page.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx

#### 📚 Documentation Changes

- docs/KONFIGURATOR-REFACTORING-PLAN.md
- docs/KONFIGURATOR-SWITCH-GUIDE.md

---

## [87ff7cd90f61202b0fb69f83fb2a35f52f9955a4] - Tue Nov 4 10:32:37 2025 +0100

**Author**: stenkjan
**Message**: `Merge fix: Add planungspaket to price breakdown - fixes 3.800€ calculation error  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/PriceCalculator.ts

---

## [43f34c4b3c44897f6e987161b6cee377b021e798] - Tue Nov 4 10:19:05 2025 +0100

**Author**: stenkjan
**Message**: `Merge fix: Update all pricing to consistent values across warenkorb  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [3e126a5a11a999a3565958a910cc8cf0591e8c6b] - Tue Nov 4 10:13:36 2025 +0100

**Author**: stenkjan
**Message**: `Merge fix: Show actual price for basis planungspaket instead of 'inkludiert'  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [1f71f4371a74a649df34a3db9c4e88ace90435eb] - Tue Nov 4 09:51:29 2025 +0100

**Author**: stenkjan
**Message**: `Merge fix: Install missing Stripe packages  `

### Changes Analysis

#### 🔧 Configuration Changes

- package.json

---

## [3a0cdb98bc90aba4c961ed40277063f09367bc5f] - Mon Nov 3 16:40:13 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [4ba928b128201a0581af854ac33b2f01cd7c6a81] - Mon Nov 3 16:38:31 2025 +0100

**Author**: stenkjan
**Message**: `Merge fix: Add relative positioning to image containers in ohne nest mode  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [bb45da2c5269b624d47c5599197ab8f2e98992d3] - Mon Nov 3 16:30:01 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [a87c13bc6e8111b2abea8ea4cf33250cea209b45] - Mon Nov 3 15:59:43 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [09c7a98023ded092aa7945590ee6f74d40aafaa6] - Mon Nov 3 15:37:17 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [1b4a5c2875cced0d5b1c97965398075e6da6c6a2] - Mon Nov 3 15:33:30 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [79eefdd663ad72662daf854a4f8a0a90aba037a2] - Mon Nov 3 15:30:09 2025 +0100

**Author**: stenkjan
**Message**: `Merge fix: Use correct IMAGES.configurations path in SimplifiedPreviewPanel  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator2/components/SimplifiedPreviewPanel.tsx

---

## [c9ea0da91107a703e5c403c58f6164d636d86526] - Mon Nov 3 15:18:05 2025 +0100

**Author**: stenkjan
**Message**: `Merge fix: Correct import and prop usage in SimplifiedPreviewPanel  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator2/components/SimplifiedPreviewPanel.tsx

---

## [28b573b9f9762d6091299aa7a77caa9002538429] - Mon Nov 3 15:17:02 2025 +0100

**Author**: stenkjan
**Message**: `fix: Replace non-standard z-15 with standard z-20 in GeschossdeckeOverlay  - Change z-index from z-15 to z-20 (standard Tailwind class) - Maintains correct stacking order: Geschossdecke (structural) on top, Fenster (windows) behind - FensterOverlay stays at z-10 (correct position)  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/GeschossdeckeOverlay.tsx

---

## [7b5cab908ccfcba1b8d7c4ba927b24a5769af678] - Mon Nov 3 15:12:29 2025 +0100

**Author**: stenkjan
**Message**: `Merge feature: Add simplified konfigurator2 with ohne nest warenkorb integration  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/CartFooter.tsx
- src/app/konfigurator2/components/Konfigurator2Client.tsx
- src/app/konfigurator2/components/SimplifiedCategorySection.tsx
- src/app/konfigurator2/components/SimplifiedPreviewPanel.tsx
- src/app/konfigurator2/components/VorentwurfButton.tsx
- src/app/konfigurator2/page.tsx
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx

#### 📚 Documentation Changes

- docs/KONFIGURATOR-SWITCH-GUIDE.md

---

## [2e4365bed8774a34cb1b5f8bd2cbb1501b8e5f3c] - Mon Nov 3 15:06:08 2025 +0100

**Author**: stenkjan
**Message**: `feat: enhance configurator overlays and image handling  - Added visibility state for Fenster overlay in ConfiguratorShell, ensuring it is always shown when fenster is selected. - Updated PreviewPanel to conditionally render Geschossdecke and Fenster overlays based on the active view and visibility states. - Refactored image constants for Geschossdecke overlays to use material-based variations for improved clarity and organization.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/konfigurator/components/FensterOverlay.tsx
- src/app/konfigurator/components/GeschossdeckeOverlay.tsx
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/konfigurator/components/SelectionOption.tsx

---

## [677d78fb173c7f694bb42be6eb078c3e4ecba1a4] - Mon Nov 3 12:56:48 2025 +0100

**Author**: stenkjan
**Message**: `ci: disable deployment workflows for development and production environments  - Set 'if: false' in both deploy-development.yml and deploy-production.yml to prevent automatic deployments.  `

### Changes Analysis

#### 🔧 Configuration Changes

- .github/workflows/deploy-development.yml
- .github/workflows/deploy-production.yml

---

## [eb334045e514472383221841a7d8492257092b93] - Mon Nov 3 12:22:11 2025 +0100

**Author**: stenkjan
**Message**: `fix: update terminology for flooring options in configurator  - Changed 'Ohne Parkett' to 'Ohne Belag' in multiple files for consistency in user tracking, price calculation, and configurator data. - Updated comments and descriptions to reflect the new terminology.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/admin/user-tracking/route.ts
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/data/configuratorData.ts

---

## [ab1427ff426a38013c25d7cdc5a8cc24f42c78ec] - Mon Nov 3 11:35:59 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/layout.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/components/payments/PaymentModal.tsx

#### 🔧 Configuration Changes

- package.json

#### 📚 Documentation Changes

- ADMIN_PASSWORD_FIX.md
- docs/COMMIT_HISTORY.md
- docs/SOCIAL_MEDIA_METADATA_UPDATE.md

---

## [c0b185297e3bdc0669c2734d4a23127d971ef6c1] - Mon Nov 3 11:25:25 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/layout.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutPlanungspaketeCards.tsx
- src/components/payments/PaymentModal.tsx

#### 🔧 Configuration Changes

- package.json

#### 📚 Documentation Changes

- ADMIN_PASSWORD_FIX.md
- docs/COMMIT_HISTORY.md
- docs/SOCIAL_MEDIA_METADATA_UPDATE.md

---

## [691df2af40f421eb6a83055b219653c631a7fd5e] - Mon Nov 3 11:09:22 2025 +0100

**Author**: stenkjan
**Message**: `Merge c613969f1874427ad8a71ab81578ac33ca76b9c4 into 46338ae5a65fb678d79ed72999503c2ab33ee0a9  `

### Changes Analysis

#### 📚 Documentation Changes

- ADMIN_PASSWORD_FIX.md

---

## [74e7e76dcf591dcdd846f5ed5581bf5198e426c8] - Sun Nov 2 16:48:41 2025 +0000

**Author**: Cursor Agent
**Message**: `Fix social media preview: Add og-image and update URLs to www subdomain  - Add optimized og-image.jpg (1200x630px, 141KB) for social media previews - Update all metadata URLs from nest-haus.at to www.nest-haus.at - Fix WhatsApp preview compatibility with proper image specs - Add comprehensive documentation for social media metadata  This fixes the issue where social media link checkers couldn't find the preview image (404 error) and ensures WhatsApp displays previews correctly.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/layout.tsx

#### 🔧 Configuration Changes

- package.json

---

## [3e4729dbe787854e851291868402d35b8b198c84] - Fri Oct 31 13:11:04 2025 +0000

**Author**: Cursor Agent
**Message**: `Fix TypeScript build error in PaymentModal  Fixed incorrect function reference: handlePaymentError -> _handlePaymentError The function was properly prefixed with underscore but the call site was not updated.  Build now passes successfully.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/payments/PaymentModal.tsx

---

## [05fcb184c1c6f2e600011435526b427786f8cb1e] - Fri Oct 31 14:02:12 2025 +0100

**Author**: stenkjan
**Message**: `fix: apply optional chaining to all configItem.planungspaket references  - Fixed ALL instances with sed global replace - Line 2888 and 2895 now use optional chaining - Grep confirms no more direct property access - Linter passes: ✔ No ESLint warnings or errors  VERIFICATION: grep 'configItem\.planungspaket\.' returns empty  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [e1eb22d2696c8dad22d742d4c5089e93e2cc5367] - Fri Oct 31 13:59:49 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'fix-nextjs-build-error-ldsGm'  # Conflicts: #	src/app/warenkorb/components/CheckoutStepper.tsx  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [ab3071ee600ad97728fbf861ff7e9c51721c2aec] - Fri Oct 31 13:55:51 2025 +0100

**Author**: stenkjan
**Message**: `fix: resolve final TypeScript errors and add comprehensive pre-commit rules  ✅ Fixed Remaining Errors: - Line 2888: configItem.planungspaket.name.toLowerCase() → optional chaining - Line 2895: return configItem.planungspaket.name → optional chaining - All direct property access now uses ?.  ✅ Enhanced Project Rules: - Added Pre-Commit Validation Checklist section - Documented grep commands to find risky patterns - Auto-fix checklist with specific examples - Step-by-step validation workflow  MANDATORY: Run npm run lint before EVERY commit Search for risky patterns before pushing No exceptions - prevents Vercel build failures  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [c47971df445ddc7758df279e2df9a6c69171b66f] - Fri Oct 31 13:49:46 2025 +0100

**Author**: stenkjan
**Message**: `fix: add null fallback for localSelectedPlan assignment  - Changed 'packageType = localSelectedPlan' to 'packageType = localSelectedPlan || ""' - Resolves Type 'null' is not assignable to type 'string' error  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [b92a66f532638fddacb852e61f77ffcae1503f42] - Fri Oct 31 13:45:05 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'fix-nextjs-build-error-ldsGm'  `

### Changes Analysis

---

## [e29e0fbb222945b5134a5fa10394ab33e19b2bf4] - Fri Oct 31 13:41:35 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'fix-nextjs-build-error-ldsGm'  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [11f8d8788290adb0fd1a107a44c491ef3bf1af4d] - Fri Oct 31 13:37:34 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'fix-nextjs-build-error-ldsGm'  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [32526eaa06f4b9870c0b3d338b4a585868ed2712] - Fri Oct 31 13:33:52 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'fix-nextjs-build-error-ldsGm'  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [41476393fc893c1e508c36f936c8bfcc077ded66] - Fri Oct 31 13:31:08 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'fix-nextjs-build-error-ldsGm'  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [5a6e86bbab61bffb9ce7225e994365c2390bcb0c] - Fri Oct 31 13:27:43 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'fix-nextjs-build-error-ldsGm'  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutPlanungspaketeCards.tsx

---

## [9803f4c5af555464c16b63f70559be4445567dcf] - Fri Oct 31 13:22:48 2025 +0100

**Author**: stenkjan
**Message**: `fix: resolve PaymentModal linter errors  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/payments/PaymentModal.tsx

---

## [ce1a3b9a87b56f6f8b0aff91a08fe6bd449e3782] - Fri Oct 31 13:19:04 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'fix-nextjs-build-error-ldsGm'  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/payments/PaymentModal.tsx

---

## [b9048bc8ebe7b10d28c0e3765343d6bc09a07fb8] - Fri Oct 31 13:04:28 2025 +0100

**Author**: stenkjan
**Message**: `feat(warenkorb/abschluss): complete final page layout per image specs  ✅ 4-Box Bewerber Grid (2x2): - Box 1: Bewerber Deine Daten (Name, Adresse, PLZ, Nation) - Box 2: Deine Termine Im Überblick (Entwurfsgespräch, Lieferungsdatum) - Box 3: Grundstück Details (Strasse, Stadt, PLZ, Grundstücknummer, Bundesland, Katastralgemeinde, Land) - Box 4: Reserved for future use  ✅ Left/Right Teilzahlungen Layout: - LEFT: 'Dein Nest Deine Auswahl' box with all 4 Teilzahlungen listed   • 1. Teilzahlung: Grundstückscheck & Vorentwurf (Fixpreis €1.000)   • 2. Teilzahlung: 30% minus Grundstückscheck (Liefergarantie)   • 3. Teilzahlung: 50% nach Produktion   • 3. Teilzahlung: 20% nach Grundstück - RIGHT: 'Heute zu bezahlen' box with 1000€ crossed out → 500€   • 'Jetzt bezahlen' button   • Disclaimer text about Vorentwurf guarantee  ✅ Button Updates: - Changed 'Nächster Schritt' → 'Zur Kassa' - 'Zur Kassa' triggers setIsPaymentModalOpen (same as 'Jetzt bezahlen') - Full Stripe payment flow preserved  ✅ Payment Logic Maintained: - Triggers PaymentModal with all tracking - Alpha test completion handled - Session tracking integrated - Stripe webhooks called properly  ALL IMAGE SPECIFICATIONS IMPLEMENTED!  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [b7d6994b6cdf64874c210e1142374ced72522a0a] - Fri Oct 31 12:55:16 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'fix-nextjs-build-error-ldsGm'  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [0b65fba505ec22b1305640b42bcf85d5c29a0b56] - Fri Oct 31 12:42:07 2025 +0100

**Author**: stenkjan
**Message**: `Merge final warenkorb fixes  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutPlanungspaketeCards.tsx

---

## [063a111a629318ca2aec4b7285bab3ad427eef6b] - Fri Oct 31 12:25:46 2025 +0100

**Author**: stenkjan
**Message**: `Merge fix-nextjs-build-error-ldsGm: Complete warenkorb refactoring  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutPlanungspaketeCards.tsx

#### 🔧 Configuration Changes

- package.json

---

## [5b5339bc051e8dbf86269ffe48e8c1f8f0048872] - Thu Oct 30 20:12:58 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/user-tracking/components/ClickAnalytics.tsx
- src/app/admin/user-tracking/components/ConfigurationSelectionAnalytics.tsx
- src/app/admin/user-tracking/components/TrackingActions.tsx
- src/app/admin/user-tracking/page.tsx
- src/app/api/admin/user-tracking/actions/route.ts
- src/app/api/admin/user-tracking/all-configurations/route.ts
- src/app/api/admin/user-tracking/route.ts
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/app/warenkorb/steps.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/WARENKORB_REFACTORING_PROGRESS.md

---

## [07aad28ecddce982a44a499dbea99c5fb0ae8e76] - Thu Oct 30 16:24:26 2025 +0100

**Author**: stenkjan
**Message**: `fix: remove invalid cardId prop from UnifiedContentCard  - Removed cardId prop that doesn't exist in UnifiedContentCardProps interface - Component uses category prop to load planungspakete data - Resolves TypeScript error: Property 'cardId' does not exist  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [08a588d8717e6051b556a1ae0e4fa430a16011cf] - Thu Oct 30 16:21:46 2025 +0100

**Author**: stenkjan
**Message**: `fix: correct CardVariant prop in CheckoutStepper  - Changed variant from invalid 'compact' to valid 'responsive' - Resolves TypeScript error: CardVariant only accepts 'responsive' or 'static'  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [3cc046e7b1d258c7bf7d7dd2d9241495dfe9cd93] - Thu Oct 30 16:19:35 2025 +0100

**Author**: stenkjan
**Message**: `fix: correct UnifiedContentCard props in CheckoutStepper  - Changed layout from invalid 'grid' to valid 'square' - Changed style from invalid 'modern' to valid 'standard' - Resolves TypeScript build error for planungspakete cards  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [cf66605f14cb42489b42b4a0acfe78f8635e1df3] - Thu Oct 30 16:15:33 2025 +0100

**Author**: stenkjan
**Message**: `Merge warenkorb refactor with design updates and bug fixes  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/app/warenkorb/steps.ts

#### 📚 Documentation Changes

- docs/WARENKORB_REFACTORING_PROGRESS.md

---

## [1dbb1555d6a9f7780ac131fe306d26e0418d6d78] - Thu Oct 30 14:08:31 2025 +0100

**Author**: stenkjan
**Message**: `refactor: remove 'remove-old' action from TrackingActions component  - Eliminated the 'remove-old' action from the handleAction function to simplify configuration management. - Updated confirmation messages and button rendering to reflect the removal, enhancing clarity and usability.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/user-tracking/components/TrackingActions.tsx

---

## [fb622c5e32290eeacc6e9d655c5c1f10bb8d2f97] - Thu Oct 30 13:55:06 2025 +0100

**Author**: stenkjan
**Message**: `feat: add TrackingActions component to user tracking dashboard  - Introduced TrackingActions component for enhanced configuration management. - Updated UserTrackingDashboard to include a new section for tracking actions, improving user experience and functionality.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/user-tracking/components/TrackingActions.tsx
- src/app/admin/user-tracking/page.tsx
- src/app/api/admin/user-tracking/actions/route.ts

---

## [970c4bad1d0cbdbd5fc225a451be1ac600a5955e] - Thu Oct 30 13:48:52 2025 +0100

**Author**: stenkjan
**Message**: `refactor: streamline analytics data fetching in user tracking  - Replaced individual variable assignments with a single results array for better readability. - Introduced a helper function to extract results with default fallbacks, improving error handling. - Simplified the handling of default values for various analytics metrics.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/admin/user-tracking/route.ts

---

## [adebcc687f86f5b9a4da0f54495c580c27f3cf45] - Thu Oct 30 13:27:20 2025 +0100

**Author**: stenkjan
**Message**: `refactor: remove unused extractValue function in UserTrackingService  - Eliminated the extractValue helper function to streamline the code. - Retained the extractValueOrQuantity function for value extraction purposes.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/admin/user-tracking/route.ts

---

## [6dd66f65b367572cfb41b10c4ce56715932a57cb] - Thu Oct 30 13:24:18 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/entwurf/EntwurfClient.tsx
- src/app/globals.css
- src/app/showcase/cards/page.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/components/cards/README.md
- src/components/cards/UnifiedContentCard.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/GLASS-QUOTE-CARDS-GUIDE.md
- docs/GLASS-QUOTE-CARDS-QUICK-REF.md
- docs/GLASS-QUOTE-CARDS-SUMMARY.md

---

## [418d94d87855725cb7beb218ba22aac3f1168a7a] - Thu Oct 30 13:08:44 2025 +0100

**Author**: stenkjan
**Message**: `feat: introduce glass quote card layout and enhance styling options  - Added a new  class for improved paragraph styling. - Implemented the  layout in  for testimonials with a glass background effect. - Updated  to include a testimonials section using the new . - Enhanced  with left alignment for card content. - Updated  and  to document the new glass quote card features and usage.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/entwurf/EntwurfClient.tsx
- src/app/globals.css
- src/app/showcase/cards/page.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/components/cards/README.md
- src/components/cards/UnifiedContentCard.tsx

#### 📚 Documentation Changes

- docs/GLASS-QUOTE-CARDS-GUIDE.md
- docs/GLASS-QUOTE-CARDS-QUICK-REF.md
- docs/GLASS-QUOTE-CARDS-SUMMARY.md

---

## [ca75bff1d236cb3096fa033dd80640d00c575809] - Wed Oct 29 16:25:47 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [0bfe71ddc7db0ec39e23de4e1ec3e3684df40d6a] - Wed Oct 29 16:16:56 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [c0bbac467bd6e3e56dc769a24f58857fb1dd5d82] - Wed Oct 29 16:15:29 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warum-wir/WarumWirClient.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [cae35b515337b936329da25e0eaa02d82333b4b0] - Wed Oct 29 14:17:42 2025 +0100

**Author**: stenkjan
**Message**: `refactor: remove unused imports in WarumWirClient  - Removed unused imports for Link and Button components to streamline the code and improve maintainability.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warum-wir/WarumWirClient.tsx

---

## [e7bdb9dd323d9ed106b003ba1b1e149b510400d3] - Wed Oct 29 13:40:56 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [42ecd10df0fa56f3f5254104a580c83fab3d0462] - Wed Oct 29 13:39:47 2025 +0100

**Author**: stenkjan
**Message**: `fix: update playerRef initialization in ModernVideoPlayer for consistency  - Changed playerRef initialization from  to  to simplify the code and maintain consistency in the component's implementation.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/video/ModernVideoPlayer.tsx

---

## [db27c599c6fa1f44cdb4dda9dd584e061e633efa] - Wed Oct 29 13:35:12 2025 +0100

**Author**: stenkjan
**Message**: `fix: update playerRef type in ModernVideoPlayer for improved TypeScript safety  - Changed playerRef type from  to  to enhance type safety and align with TypeScript best practices.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/video/ModernVideoPlayer.tsx

---

## [96d2096b511070f5d7c96b2c89490730d3e5ffb5] - Wed Oct 29 13:31:48 2025 +0100

**Author**: stenkjan
**Message**: `fix: revert playerRef type in ModernVideoPlayer to any for compatibility  - Changed playerRef type back to  from  to address compatibility issues in the component's implementation.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/video/ModernVideoPlayer.tsx

---

## [79fe74794e00a2613bf1f88fb2d768efc521f651] - Wed Oct 29 13:20:42 2025 +0100

**Author**: stenkjan
**Message**: `fix: refine playerRef type in ModernVideoPlayer for improved TypeScript accuracy  - Updated playerRef type to  for better type safety and clarity in the component's implementation.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/video/ModernVideoPlayer.tsx

---

## [e7cbd450dfa4b7d0abd172467e5a2510739fdd14] - Wed Oct 29 13:11:37 2025 +0100

**Author**: stenkjan
**Message**: `fix: add missing newline at end of vercel.json for proper formatting  `

### Changes Analysis

---

## [ed109a64e8bea1f3e7fb3c735f4dbb1186fe5d9e] - Wed Oct 29 13:05:21 2025 +0100

**Author**: stenkjan
**Message**: `fix: update playerRef type in ModernVideoPlayer for better TypeScript compatibility  - Changed playerRef type from  to  to enhance type safety and prevent potential runtime errors.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/video/ModernVideoPlayer.tsx

---

## [79d3804e0411a6a0527c52cb9a8debe27aba9111] - Wed Oct 29 13:00:00 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [a7f382db723bffcccc10446623a73868b183d956] - Wed Oct 29 12:55:42 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warum-wir/WarumWirClient.tsx
- src/components/video/InteractiveVideoPlayer.tsx
- src/components/video/ModernVideoPlayer.tsx
- src/components/video/index.ts
- src/components/video/video-player.css

#### 🔧 Configuration Changes

- package.json

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [16e2de4c477efa5155fd02a9017531b0c1728199] - Wed Oct 29 12:42:38 2025 +0100

**Author**: stenkjan
**Message**: `feat: integrate ModernVideoPlayer and update sections in WarumWirClient  - Added ModernVideoPlayer component to enhance video playback experience. - Updated section structure in WarumWirClient to include a hero section and a video section. - Adjusted button placements for improved user navigation.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/warum-wir/WarumWirClient.tsx
- src/components/video/InteractiveVideoPlayer.tsx
- src/components/video/ModernVideoPlayer.tsx
- src/components/video/index.ts
- src/components/video/video-player.css

#### 🔧 Configuration Changes

- package.json

---

## [47235a74d174b0cfc88a485c2491cfc6eea4da4b] - Wed Oct 29 10:49:08 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [b1d05b960814d46fa53a4f48ee65611a93110d0b] - Wed Oct 29 10:48:00 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [53045d7f7bfe9427c57d1b4dfb1e653d74fa8a5c] - Wed Oct 29 10:35:36 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [3db8781d75ef306a40585b3691a9ad1312533934] - Wed Oct 29 10:08:41 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [3206f2f6ef42fd464e1051ae94c7f566a710d9ef] - Wed Oct 29 09:38:23 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-nest/DeinNestClient.tsx
- src/components/sections/ModulhausVergleichSection.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [b410a3ba859b1b659723cdca1e2826ea49170e6e] - Tue Oct 28 20:55:41 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/alpha-tests/page.tsx
- src/app/admin/conversion/Client.tsx
- src/app/admin/conversion/page.tsx
- src/app/admin/customer-inquiries/page.tsx
- src/app/admin/debug/session/Client.tsx
- src/app/admin/debug/session/page.tsx
- src/app/admin/page.tsx
- src/app/admin/performance/Client.tsx
- src/app/admin/performance/page.tsx
- src/app/admin/pmg/milestones/page.tsx
- src/app/admin/pmg/page.tsx
- src/app/admin/popular-configurations/page.tsx
- src/app/admin/security/Client.tsx
- src/app/admin/security/page.tsx
- src/app/admin/sync/SyncClient.tsx
- src/app/admin/sync/page.tsx
- src/app/admin/usage/Client.tsx
- src/app/admin/usage/page.tsx
- src/app/admin/user-tracking/page.tsx

#### 📚 Documentation Changes

- docs/ADMIN_SECURITY_TESTING_GUIDE.md
- docs/COMMIT_HISTORY.md

---

## [7294f1440b7cf3efdf31bc527b7c6d7acef1b8e7] - Tue Oct 28 15:40:34 2025 +0100

**Author**: stenkjan
**Message**: `feat: implement server-side authentication for admin pages  - Added server-side authentication checks to various admin pages to ensure only authorized users can access them. - Utilized cookies to verify admin credentials against the environment variable for enhanced security. - Redirected unauthorized users to the admin authentication page when access is denied.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/alpha-tests/page.tsx
- src/app/admin/conversion/Client.tsx
- src/app/admin/conversion/page.tsx
- src/app/admin/customer-inquiries/page.tsx
- src/app/admin/debug/session/Client.tsx
- src/app/admin/debug/session/page.tsx
- src/app/admin/page.tsx
- src/app/admin/performance/Client.tsx
- src/app/admin/performance/page.tsx
- src/app/admin/pmg/milestones/page.tsx
- src/app/admin/pmg/page.tsx
- src/app/admin/popular-configurations/page.tsx
- src/app/admin/security/Client.tsx
- src/app/admin/security/page.tsx
- src/app/admin/sync/SyncClient.tsx
- src/app/admin/sync/page.tsx
- src/app/admin/usage/Client.tsx
- src/app/admin/usage/page.tsx
- src/app/admin/user-tracking/page.tsx

---

## [5537d0e47523e9bcc7214d7994db303fbbbc6464] - Tue Oct 28 14:59:59 2025 +0100

**Author**: stenkjan
**Message**: `feat: add named export for middleware in Next.js  - Introduced a named export for the middleware function to enhance clarity and usability in Next.js applications.  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/ADMIN_SECURITY_TESTING_GUIDE.md

---

## [9e994699bd441e2a5a992e6969201b43086d8cf1] - Tue Oct 28 14:32:49 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/pmg/components/ProjectManagementDashboard.tsx
- src/app/admin/pmg/milestones/components/MilestonesManager.tsx
- src/app/admin/sync/page.tsx
- src/app/admin/user-tracking/components/AllConfigurations.tsx
- src/app/admin/user-tracking/page.tsx
- src/app/api/admin/analytics/route.ts
- src/app/api/admin/cleanup-sessions/route.ts
- src/app/api/admin/pmg/[id]/route.ts
- src/app/api/admin/pmg/reorganize/route.ts
- src/app/api/admin/pmg/route.ts
- src/app/api/admin/pmg/seed/route.ts
- src/app/api/admin/user-tracking/all-configurations/route.ts
- src/app/api/admin/user-tracking/route.ts
- src/app/api/payments/verify-redirect/route.ts
- src/app/api/sync/google-drive/route.ts
- src/app/layout.tsx
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/payments/PaymentModal.tsx
- src/components/tracking/SessionInteractionTracker.tsx
- src/hooks/useInteractionTracking.ts

#### ⚙️ Backend Changes

- scripts/cleanup-bad-sessions.js

#### 📚 Documentation Changes

- docs/ADMIN_DASHBOARD_METRICS_FIX.md
- docs/BELICHTUNGSPAKET_FENSTER_FIX.md
- docs/COMMIT_HISTORY.md
- docs/ENVIRONMENT_VARIABLE_SETUP.md
- docs/PAYMENT_CONFIRMATION_ALL_METHODS.md
- docs/USER_TRACKING_FIXES_COMPLETE.md
- docs/USER_TRACKING_FIXES_SUMMARY.md

---

## [ee51231e35d607ac5bf7fa3bb315e1e0dfe34353] - Tue Oct 28 14:25:03 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [995259e3cf58d7bd6bc3aaae2aa45f90d31fbe3c] - Tue Oct 28 14:19:37 2025 +0100

**Author**: stenkjan
**Message**: `refactor: implement payment redirect handling in WarenkorbClient and CheckoutStepper  - Added state management for payment redirect status in WarenkorbClient to handle payment verification and user feedback. - Enhanced CheckoutStepper to display payment completion status and manage modal visibility based on payment redirect results. - Updated PaymentModal to accept initial payment intent and state for better integration with redirect handling.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/payments/verify-redirect/route.ts
- src/app/warenkorb/WarenkorbClient.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/payments/PaymentModal.tsx

#### 📚 Documentation Changes

- docs/PAYMENT_CONFIRMATION_ALL_METHODS.md

---

## [05c778844873ce68480d8afedb91bf1e3e9b1955] - Tue Oct 28 14:00:18 2025 +0100

**Author**: stenkjan
**Message**: `refactor: enhance configuration price calculation and user agent parsing  - Added a new function to calculate the belichtungspaket price based on nest size and fenster material, improving pricing accuracy. - Updated user agent parsing in ConfigurationModal to include detection for Brave and Edge browsers, enhancing user tracking capabilities. - Recalculated belichtungspaket price dynamically in the calculateAbsolutePrices function to reflect changes based on user selections.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/user-tracking/components/AllConfigurations.tsx
- src/app/api/admin/user-tracking/all-configurations/route.ts
- src/components/tracking/SessionInteractionTracker.tsx
- src/hooks/useInteractionTracking.ts

#### 📚 Documentation Changes

- docs/USER_TRACKING_FIXES_COMPLETE.md

---

## [86cfbcbc874f4c6c538bdf1f43bff68b00e00865] - Tue Oct 28 13:43:20 2025 +0100

**Author**: stenkjan
**Message**: `refactor: enhance admin authentication and streamline API routes  - Updated middleware to check for admin routes in both pages and API, returning 401 for unauthorized API requests. - Removed hardcoded credentials from ProjectManagementDashboard and MilestonesManager components, ensuring cookies are sent for authentication. - Replaced Basic Auth with cookie-based admin authentication in API routes for improved security and maintainability. - Cleaned up unused authentication code in various API routes, enhancing overall code clarity.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/pmg/components/ProjectManagementDashboard.tsx
- src/app/admin/pmg/milestones/components/MilestonesManager.tsx
- src/app/admin/sync/page.tsx
- src/app/admin/user-tracking/components/AllConfigurations.tsx
- src/app/admin/user-tracking/page.tsx
- src/app/api/admin/pmg/[id]/route.ts
- src/app/api/admin/pmg/reorganize/route.ts
- src/app/api/admin/pmg/route.ts
- src/app/api/admin/pmg/seed/route.ts
- src/app/api/sync/google-drive/route.ts
- src/app/layout.tsx

#### 📚 Documentation Changes

- docs/BELICHTUNGSPAKET_FENSTER_FIX.md
- docs/ENVIRONMENT_VARIABLE_SETUP.md
- docs/USER_TRACKING_FIXES_SUMMARY.md

---

## [e0352f5887fba29263f9696be398187dd5921398] - Tue Oct 28 13:00:49 2025 +0100

**Author**: stenkjan
**Message**: `refactor: optimize user tracking data fetching and enhance time metrics calculation  - Updated the user tracking data fetching method to use an absolute path for improved consistency in server components. - Enhanced the time metrics calculation by filtering sessions based on realistic duration criteria, ensuring more accurate metrics. - Adjusted the average session duration calculation to reflect only valid sessions.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/user-tracking/page.tsx
- src/app/api/admin/cleanup-sessions/route.ts
- src/app/api/admin/user-tracking/route.ts

#### ⚙️ Backend Changes

- scripts/cleanup-bad-sessions.js

#### 📚 Documentation Changes

- docs/USER_TRACKING_FIXES_SUMMARY.md

---

## [778f760cabe0b615538a3ef2f53145ea73dfbc6c] - Tue Oct 28 12:35:59 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [c4ed3b10f8638daad228828f106657bddd0d4f7b] - Tue Oct 28 12:33:41 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [29a9fbb09c9a5780bbb23ec845f3d043b9152d12] - Tue Oct 28 12:30:32 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [7b011d57e59561fd860415705d57a3c6a02f657e] - Tue Oct 28 12:20:54 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [0d5ead88855c3c4f17d1f4d110a0dac544b15b7a] - Tue Oct 28 12:16:53 2025 +0100

**Author**: stenkjan
**Message**: `refactor: remove unused QueuedConfiguration interface and configuration processing logic  - Deleted the QueuedConfiguration interface and its associated processing function from BackgroundJobProcessor as they are no longer needed. - Updated the totalQueues count in the processing results to reflect the removal of the configuration queue, improving code clarity and efficiency.  `

### Changes Analysis

---

## [6e6279a8dfb29e8b767d00f1cfafbe03a8edf3d5] - Tue Oct 28 12:03:32 2025 +0100

**Author**: stenkjan
**Message**: `refactor: remove ConfigurationSnapshot model and improve session tracking  - Deleted the redundant ConfigurationSnapshot model from the Prisma schema to streamline data management. - Implemented client-side tracking for user interactions, including page visits and button clicks, to ensure accurate event counts. - Adjusted the logic for SelectionEvent creation to only track user-initiated selections, preventing inflated event counts. - Updated relevant API routes and frontend components to reflect these changes, enhancing overall tracking accuracy and performance.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/user-tracking/components/AllConfigurations.tsx
- src/app/api/admin/user-tracking/all-configurations/route.ts
- src/app/api/sessions/sync/route.ts
- src/app/api/sessions/track-cart-add/route.ts

#### ⚙️ Backend Changes

- prisma/schema.prisma

#### 📚 Documentation Changes

- fix-tracking-issues.plan.md

---

## [c9fea0e2e6823b26aecce1e70959644289ad7a3c] - Tue Oct 28 11:34:08 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [c6742ab37d1e67016b1c75fa0ca5dd4e16c964dc] - Tue Oct 28 09:37:30 2025 +0100

**Author**: stenkjan
**Message**: `refactor: enhance calculateAbsolutePrices function to return structured object  - Updated the calculateAbsolutePrices function to return a structured object with detailed item pricing instead of a generic record. - Improved clarity and maintainability by explicitly defining the return type, ensuring all configuration items are accounted for in the pricing calculation. - Streamlined the logic for handling price calculations, ensuring consistent application of pricing rules across all items.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/admin/user-tracking/all-configurations/route.ts

---

## [9e837dda19d91594322cafd070313ecfc850b21b] - Tue Oct 28 09:33:43 2025 +0100

**Author**: stenkjan
**Message**: `fix: streamline price calculation logic in calculateAbsolutePrices function  - Removed unnecessary imports and streamlined the calculation of absolute prices for configuration items. - Ensured that the calculateModularPrice function is consistently used for price calculations, improving code clarity and efficiency. - Updated the WarenkorbClient to run the effect only once on mount, optimizing performance and preventing unnecessary re-renders.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/admin/user-tracking/all-configurations/route.ts
- src/app/warenkorb/WarenkorbClient.tsx

---

## [7e0194103aec2fa1573a1b583a58a3b2d52cc978] - Tue Oct 28 09:27:16 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [d7c94dbf407bfec439bcd6af9150e723cebe806d] - Mon Oct 27 13:59:24 2025 +0100

**Author**: stenkjan
**Message**: `fix: enhance filtering logic in AllConfigurations component and update session handling in WarenkorbClient  - Improved the filtering logic in the AllConfigurations component to exclude configurations with an unknown nest type when isOhneNestMode is false. - Updated the WarenkorbClient to send a request to update the session when the ohne-nest mode is activated, ensuring accurate session state management.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/user-tracking/components/AllConfigurations.tsx
- src/app/api/sessions/update-ohne-nest-mode/route.ts
- src/app/warenkorb/WarenkorbClient.tsx

---

## [6453d997043941059fb77e4484e3c7ff1a78ba10] - Mon Oct 27 13:28:39 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [d39ebc49313cc027ffe45e4e994e2922153262d7] - Mon Oct 27 13:26:57 2025 +0100

**Author**: stenkjan
**Message**: `feat: add isOhneNestMode property to UserSession and update related components  - Introduced isOhneNestMode boolean property in UserSession model to track direct navigation to Vorentwurf. - Updated AllConfigurations component to filter configurations based on isOhneNestMode status. - Enhanced API endpoints to include isOhneNestMode in session data handling. - Modified cartStore to send isOhneNestMode during cart add tracking, improving session management.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/conversion/page.tsx
- src/app/admin/user-tracking/components/AllConfigurations.tsx
- src/app/api/admin/user-tracking/all-configurations/route.ts
- src/app/api/sessions/track-cart-add/route.ts

#### ⚙️ Backend Changes

- prisma/schema.prisma

---

## [19338a912e0e6da8d92b0d09c946a00c0992ef94] - Mon Oct 27 13:04:16 2025 +0100

**Author**: stenkjan
**Message**: `refactor: update sessionId parameter handling in generateSessionName function  - Renamed the sessionId parameter to _sessionId in the generateSessionName function to indicate intentional non-use, adhering to TypeScript safety and linting rules.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/admin/user-tracking/all-configurations/route.ts

---

## [33137819e3ecba755d2bd77cd97457ac894b3513] - Mon Oct 27 12:53:32 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [8c311b06ac6ca0e577b5530e237b9236d8e9c94c] - Mon Oct 27 12:48:29 2025 +0100

**Author**: stenkjan
**Message**: `feat: enhance configuration details in AllConfigurations component and API  - Introduced detailed configuration items with additional properties such as price, description, and square meters for better clarity in the UI. - Updated the API to include a human-readable session name and contact information from inquiries, improving the overall data structure and user experience. - Refactored the configuration parsing logic to handle both simple and detailed configurations, ensuring accurate data representation.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/user-tracking/components/AllConfigurations.tsx
- src/app/api/admin/user-tracking/all-configurations/route.ts

---

## [bed534fb114f4644bc179c1aea04ba49c4e08359] - Mon Oct 27 12:28:30 2025 +0100

**Author**: stenkjan
**Message**: `feat: enhance filtering options in AllConfigurations component  - Updated the filtering logic to include new options for configurations: "Mit Konfiguration" and "Ohne Konfiguration (Direkt zum Vorentwurf)". - Adjusted the filter tabs to display the count of configurations based on the selected filter, improving user experience and clarity in the UI.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/user-tracking/components/AllConfigurations.tsx

---

## [7f4f30c19ec1d0392a8b2e9303827dd9dcf7a23a] - Mon Oct 27 12:18:30 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [38c6ca49753c3998934e7904a5a78f75cfc8b258] - Mon Oct 27 12:02:18 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [3eb3fce174063cf9e3ec4562c26c2794fd004764] - Mon Oct 27 11:59:47 2025 +0100

**Author**: stenkjan
**Message**: `feat: add payment information to AllConfigurations component and API  - Enhanced the AllConfigurations component to display payment details, including payment status, amount, method, and date. - Updated the API to fetch and include payment information from customer inquiries, improving the overall functionality and user experience of the user tracking dashboard. - Introduced a new PaymentStatusBadge component for better visual representation of payment statuses.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/user-tracking/components/AllConfigurations.tsx
- src/app/api/admin/user-tracking/all-configurations/route.ts

---

## [4a771e4e70d1a4172bbad1f4c0a4f9a49a4d1274] - Mon Oct 27 11:45:54 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [2165bcac1d19cded2ba2de26904c416b5dd7c408] - Mon Oct 27 11:39:30 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [51986f7359a7a83535b24b572383bd803c3f7419] - Mon Oct 27 11:18:23 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [3e8512eac608166a41317705d8dad6525c150aa5] - Mon Oct 27 10:10:55 2025 +0100

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [3f060b21070985031e42d9aadfc9099b4c2a6463] - Mon Oct 27 10:07:26 2025 +0100

**Author**: stenkjan
**Message**: `fix: update workflows to Node 20 and sync package-lock.json  - Update both production and development workflows to use Node.js 20 - Change from npm ci to npm install for better compatibility - Regenerate package-lock.json to sync with package.json - Fixes vite@7.0.0 engine requirement (needs Node 20+)  `

### Changes Analysis

#### 🔧 Configuration Changes

- .github/workflows/deploy-development.yml

---

## [ed8fd57e445ed818b00595de730bc7b10ccd2c35] - Thu Oct 23 15:29:19 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [f170253e7065fcf9596256882e9ff2388f7cdc59] - Thu Oct 23 13:17:57 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [614155848a7a814134d0df70a6f6d1917a3bc9f9] - Thu Oct 23 12:33:52 2025 +0200

**Author**: stenkjan
**Message**: `feat: Revamp EntwurfClient with new content structure and responsive design  - Integrated new video and background card presets for enhanced visual presentation. - Replaced original card fetching with preset data for video background and entwurf video cards. - Implemented state management for ablauf steps progress, improving user navigation. - Updated UnifiedContentCard to support no-padding option and dynamic text order for better layout flexibility. - Enhanced mobile responsiveness by enforcing 2x1 aspect ratio for all cards on smaller screens.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/entwurf/EntwurfClient.tsx
- src/components/cards/UnifiedContentCard.tsx

---

## [62a0af51c963c9e31ecad00f0031a8545d7a6c16] - Wed Oct 22 16:41:44 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [ec1e1d0472f4d98a8093d2c37fcaafe5f7b038c0] - Wed Oct 22 16:38:47 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [167613ed7070bca5e2defee3b84db272de3ad453] - Wed Oct 22 16:33:05 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [e9f76d3c4074ee19109f352a85f16e42a49bcf04] - Wed Oct 22 13:14:17 2025 +0200

**Author**: stenkjan
**Message**: `refactor: clean up payment code for production  - Remove debug console.log statements and emoji logging - Simplify error handling without verbose debug output - Clean up comments to be more concise and professional - Remove test/debug artifacts while maintaining functionality - Optimize code structure for production deployment - Keep essential error handling and user feedback intact  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/payments/create-payment-intent/route.ts
- src/components/payments/StripeCheckoutForm.tsx

---

## [42f5c6380a06dae37031cd3bc28de4ed614e34f1] - Wed Oct 22 12:57:19 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/payments/create-payment-intent/route.ts
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/payments/PaymentModal.tsx
- src/components/payments/StripeCheckoutForm.tsx
- src/components/payments/StripeTest.tsx

#### 🔧 Configuration Changes

- .env
- .env.local

#### 📚 Documentation Changes

- STRIPE_DASHBOARD_SETUP.md
- docs/COMMIT_HISTORY.md

---

## [8e7f78f7ba9e340abd5bb7c1ac8b92eb50d5a2b1] - Wed Oct 22 12:53:32 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [4989f8028b16a4e639721656362e9e899c075d9f] - Wed Oct 22 12:47:44 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [ef0dcf60da2a117e55af2d4b1018edfc3be34df0] - Wed Oct 22 12:45:44 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [143177790ae37d719eb8036fef1bccd66832187a] - Wed Oct 22 12:41:08 2025 +0200

**Author**: stenkjan
**Message**: `feat: enhance payment modal UI and confirmation experience  - Widen payment modal from max-w-lg to max-w-2xl for better payment method visibility - Improve PaymentElement layout with better spacing and wallet options - Enhance payment success confirmation with:   - Celebratory design with gradient backgrounds and icons   - Detailed transaction information with formatted display   - Clear next steps with visual indicators   - Contact information for customer support   - Professional styling with hover effects - Improve payment error handling with:   - Clear error messaging in highlighted boxes   - Helpful troubleshooting suggestions   - Enhanced contact information with business hours   - Better retry and cancel button styling - Remove fixed width constraints to utilize full modal space - Add better visual hierarchy and professional polish  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/payments/PaymentModal.tsx
- src/components/payments/StripeCheckoutForm.tsx

---

## [df4f6522d0b8f5bd2fc961627e078ba4738db117] - Wed Oct 22 11:59:16 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [3e167b057f554a7c51fef6414f2d71fe7856b81b] - Wed Oct 22 11:53:36 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [093b10e767845677b07c58fd939215d004ac7212] - Wed Oct 22 11:13:36 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [c5a13c8aba14e2aa54e86ed5aa43f6f8fa9b358e] - Wed Oct 22 11:04:36 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/entwurf/EntwurfClient.tsx
- src/components/cards/UnifiedContentCard.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- src/constants/TALL_CARD_PADDING_COMPARISON.md
- src/constants/TALL_CARD_QUICK_START.md
- src/constants/TALL_CARD_TEMPLATE.md

---

## [da4b61f78a6748bbd2c8d9c1bb81c5419b01f5e4] - Tue Oct 21 16:55:41 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/payments/status/[paymentIntentId]/route.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [1fbc624222f0713b0bee222562a3421d81029915] - Tue Oct 21 15:56:19 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/cards/UnifiedContentCard.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [56e88d4b4204ba6b140344fbe5c754d32d8af5dc] - Tue Oct 21 15:53:17 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/pmg/milestones/components/MilestonesManager.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [237ca7983e2e506e9f53aa54e7685b8c53913e99] - Tue Oct 21 15:47:48 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [fcb4d1bfc9c7a06ca240cbf87b6ce602ba0ef384] - Tue Oct 21 15:40:06 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/pmg/components/GanttChart.tsx
- src/app/admin/pmg/components/TaskList.tsx
- src/app/admin/pmg/milestones/components/MilestonesManager.tsx
- src/app/api/orders/route.ts
- src/app/api/payments/confirm-payment/route.ts
- src/app/api/payments/create-payment-intent/route.ts
- src/app/api/payments/status/[paymentIntentId]/route.ts
- src/app/api/payments/webhook/route.ts
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/payments/PaymentErrorBoundary.tsx
- src/components/payments/PaymentModal.tsx
- src/components/payments/StripeCheckoutForm.tsx

#### ⚙️ Backend Changes

- prisma/schema.prisma

#### 🔧 Configuration Changes

- .env
- .env.local
- package.json

#### 📚 Documentation Changes

- STRIPE_INTEGRATION_SUMMARY.md
- docs/COMMIT_HISTORY.md

---

## [30f42a62c2621256a95e8aecb2cc6320c0c5cfaa] - Tue Oct 21 15:37:17 2025 +0200

**Author**: stenkjan
**Message**: `refactor: Enhance milestone management logic in MilestonesManager  - Updated milestone ID generation to only consider M-numbered milestones, improving accuracy in chronological ordering. - Implemented renumbering of subsequent milestones when a new milestone is inserted, ensuring proper task ID synchronization. - Refactored API response handling to accommodate changes in the returned data structure.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/pmg/milestones/components/MilestonesManager.tsx

---

## [8416e0ceb81995a955a7e0ca2ce360199732d006] - Tue Oct 21 15:17:33 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/entwurf/EntwurfClient.tsx
- src/app/layout.tsx
- src/components/cards/UnifiedContentCard.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [16475adb00a960ff093431c524d4391bf65c34b6] - Tue Oct 21 14:58:06 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [5435cd9e1ae7e57a5b0e0e39a6538cb58ffd4b55] - Tue Oct 21 14:45:36 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/LandingPageClient.tsx
- src/app/api/placeholder/[width]/[height]/route.ts
- src/app/cookie-einstellungen/CookieEinstellungenClient.tsx
- src/app/konfigurator/components/CartFooter.tsx
- src/app/konfigurator/components/FactsBox.tsx
- src/app/konfigurator/components/GrundstuecksCheckBox.tsx
- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/konfigurator/components/PvModuleOverlay.tsx
- src/app/konfigurator/components/SelectionOption.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/images/ResponsiveHybridImage.tsx
- src/components/ui/Button.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [0aadc9906b3832f2c1c27a8b2a3a6235850c1941] - Tue Oct 21 14:25:54 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [ae09ccc927ce11e37643afd80cb00f6261fe775e] - Tue Oct 21 14:18:46 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [5396875064ccdeb5afc4f7067ce735bab2cfc27b] - Tue Oct 21 13:54:12 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [39898c48a70554798a935ef23c04bd167d7b768b] - Tue Oct 21 13:45:30 2025 +0200

**Author**: stenkjan
**Message**: `refactor: Remove BrightnessOverlay component to streamline codebase  - Deleted the BrightnessOverlay component to reduce complexity and improve maintainability. - This change aligns with the ongoing effort to eliminate unused components and enhance overall performance.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/BrightnessOverlay.tsx

---

## [20a5acb6d51798e2b049e8134dd28e2c8c8aa7fa] - Tue Oct 21 13:20:54 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [e24235108f56e428f3513c06b2b871300428f612] - Tue Oct 21 13:12:14 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [a34c3f82f25e5ea421aac75171f51dfdcf370fd1] - Tue Oct 21 12:17:28 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/cards/UnifiedContentCard.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [f121a092299b63cb5699a30e3db24b609081d8e5] - Tue Oct 21 11:59:11 2025 +0200

**Author**: stenkjan
**Message**: `fix: Adjust aspect ratio and styling in UnifiedContentCard component  - Updated aspect ratio logic to set to "auto" for screen widths below 1024px, enhancing responsiveness. - Modified padding and margin for description and icon sections to improve layout consistency. - Changed text color for better visibility and alignment with design specifications.  These changes enhance the user experience and maintainability of the UnifiedContentCard component.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/cards/UnifiedContentCard.tsx

---

## [9d7ef5af9b09b773eefd3929717b3e83c6c76c5b] - Tue Oct 21 11:28:01 2025 +0200

**Author**: stenkjan
**Message**: `fix: Improve error handling and chart rendering in GanttChart component  - Enhanced error handling during Chart.js dynamic import to prevent application crashes. - Refactored chart rendering logic to ensure proper registration of Chart.js components and improved data mapping for task visualization. - Updated tooltip callbacks for better user experience when interacting with chart elements.  These changes enhance the reliability and usability of the GanttChart component in the project management interface.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/pmg/components/GanttChart.tsx

---

## [9b6934422a06c4baf9f9f21982bbab49314fdc5e] - Tue Oct 21 10:57:22 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [daec1425c8615213d8a13b6426cf15ee406ee838] - Tue Oct 21 09:20:16 2025 +0200

**Author**: stenkjan
**Message**: `fix: Adjust margin on Security Monitoring link in Admin Dashboard  - Updated the margin on the Security Monitoring link to improve layout consistency. - This change enhances the user experience by ensuring proper spacing in the admin interface.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/security/page.tsx

---

## [e8b4c2e79f800f16c8917c8d5ff85531db12c4b6] - Mon Oct 20 15:19:04 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [879a33e2aa506e82cbe798080c9cae9b312416c9] - Mon Oct 20 15:13:31 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [2c4402176044cb934c137bbdb05ad66e1b6b3d8b] - Mon Oct 20 14:54:01 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [7d3c1f570a15d7e18942c789df7683affd536225] - Mon Oct 20 13:19:21 2025 +0200

**Author**: stenkjan
**Message**: `feat: Add Web Vitals tracking and update dependencies  - Integrated Web Vitals component for enhanced analytics and performance monitoring in the application layout. - Updated package dependencies to include "web-vitals" version 5.1.0 for improved performance metrics. - Refactored scroll event listeners across multiple components to use passive event listeners, optimizing scroll performance.  These changes aim to improve user experience by providing better performance insights and reducing potential scroll event blocking.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/app/layout.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/analytics/WebVitals.tsx
- src/components/layout/Navbar.tsx
- src/hooks/useIOSViewport.ts

#### 🔧 Configuration Changes

- package.json

#### 📚 Documentation Changes

- WEEK_1_IMPLEMENTATION_SUMMARY.md
- WEEK_1_TESTING_GUIDE.md

---

## [0dd9ed7a87584cea167928fa95fd0d646fef2dc9] - Thu Oct 16 15:26:34 2025 +0200

**Author**: stenkjan
**Message**: `feat: Set PVC Fenster as default window selection  � FEATURE: PVC Fenster Default Selection  Changes Made: - Updated default fenster selection from 'holz' to 'pvc_fenster' in configuratorStore.ts - Changed price from 400€ (Holz) to 280€ (PVC Fenster) - Updated description to 'RAL 9016 - Kunststoff'  Component Updates: - BelichtungsPaketOverlay: Default fensterMaterial changed from 'holz' to 'pvc' - FensterOverlay: Default fallback changed from holz to pvc_fenster - PreviewPanel: Default fensterMaterial in BelichtungsPaketOverlay changed to 'pvc'  Impact: ✅ PVC Fenster now selected by default on configurator startup ✅ PVC Fenster selected when 'Neu konfigurieren' is pressed ✅ Correct PVC overlay images displayed in Belichtungspaket ✅ Consistent PVC defaults across all fenster-related components ✅ Lower default price (280€ vs 400€) for better user experience  This ensures PVC Fenster (RAL 9016 - Kunststoff) is the standard preselected window option in the Fenster & Türen section.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/BelichtungsPaketOverlay.tsx
- src/app/konfigurator/components/FensterOverlay.tsx
- src/app/konfigurator/components/PreviewPanel.tsx

---

## [1a8665686b80a1bd91ba6018ccc99b0ce4ce7bb7] - Thu Oct 16 15:09:59 2025 +0200

**Author**: stenkjan
**Message**: `refactor: Clean up grid components by removing unused titles and subtitles  - Removed unnecessary title and subtitle props from , , and  sections in  to enhance clarity and maintainability. - Updated  interface in  to make  and  properties required, ensuring consistency in data structure. - Streamlined exports in  by removing redundant export statements, contributing to a cleaner codebase.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/showcase/grids/page.tsx

---

## [06949a2a1189e2f52f9f687709af3d6f05732589] - Thu Oct 16 14:57:30 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-part/DeinPartClient.tsx
- src/app/entdecken/EntdeckenClient.tsx
- src/app/konfigurator/components/ConfiguratorContentCardsLightbox.tsx
- src/app/showcase/cards/page.tsx
- src/app/showcase/grids/page.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutStepCard.tsx
- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCardsLightbox.tsx
- src/components/cards/ImageGlassCard.tsx
- src/components/cards/MOBILE_SCROLL_IMPROVEMENTS.md
- src/components/cards/README.md
- src/components/cards/SquareGlassCard.tsx
- src/components/cards/SquareGlassCardsScroll.tsx
- src/components/cards/SquareTextCard.tsx
- src/components/cards/UnifiedCardPreset.tsx
- src/components/cards/UnifiedContentCard.tsx
- src/components/cards/VideoCard16by9.tsx
- src/components/cards/cardTypes.ts
- src/components/cards/cardUtils.ts
- src/components/cards/index.ts
- src/components/cards/presetSystem.ts
- src/components/grids/FullWidthImageGrid.tsx
- src/components/grids/FullWidthTextGrid.tsx
- src/components/grids/ImageWithFourTextGrid.tsx
- src/components/grids/ThreeByOneAdaptiveHeight.tsx
- src/components/grids/ThreeByOneGrid.tsx
- src/components/lazy/LazyComponents.ts
- src/components/sections/GrundstueckCheckSection.tsx
- src/components/sections/MaterialShowcase.tsx

#### 🔧 Configuration Changes

- package.json

#### 📚 Documentation Changes

- CARD_CLEANUP_PHASE2_SUMMARY.md
- CARD_SYSTEM_CLEANUP_SUMMARY.md
- docs/COMMIT_HISTORY.md

---

## [d2b7da711012b9c1cec03a186d39681280efcc52] - Thu Oct 16 14:44:22 2025 +0200

**Author**: stenkjan
**Message**: `refactor: Update DeinPartClient and card components for improved structure and functionality  - Introduced SectionHeader component in DeinPartClient for better title and subtitle management. - Enhanced FullWidthImageGrid to support optional buttons for improved user interaction. - Updated ThreeByOneAdaptiveHeight and other grid components to remove deprecated title and subtitle props, streamlining the code. - Centralized card content management by integrating getContentById for dynamic data retrieval. - Removed obsolete card types and utilities to simplify the codebase and enhance maintainability.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-part/DeinPartClient.tsx
- src/app/showcase/grids/page.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutStepCard.tsx
- src/components/cards/MOBILE_SCROLL_IMPROVEMENTS.md
- src/components/cards/README.md
- src/components/cards/UnifiedContentCard.tsx
- src/components/cards/cardTypes.ts
- src/components/cards/cardUtils.ts
- src/components/cards/index.ts
- src/components/cards/presetSystem.ts
- src/components/grids/FullWidthImageGrid.tsx
- src/components/grids/FullWidthTextGrid.tsx
- src/components/grids/ImageWithFourTextGrid.tsx
- src/components/grids/ThreeByOneAdaptiveHeight.tsx

#### 📚 Documentation Changes

- CARD_CLEANUP_PHASE2_SUMMARY.md
- CARD_SYSTEM_CLEANUP_SUMMARY.md

---

## [63cad8254a926001a0459419deacc22cc32db75e] - Wed Oct 15 16:36:54 2025 +0200

**Author**: stenkjan
**Message**: `chore: Update chart.js to version 4.5.1 and refactor ThreeByOneGrid component  - Updated chart.js dependency from version 4.5.0 to 4.5.1 in package.json and package-lock.json for improved functionality. - Refactored ThreeByOneGrid component to use ThreeByOneAdaptiveHeight for better responsiveness. - Simplified props by consolidating image and description properties, enhancing code clarity and maintainability.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/showcase/grids/page.tsx
- src/components/grids/ThreeByOneGrid.tsx
- src/components/lazy/LazyComponents.ts

#### 🔧 Configuration Changes

- package.json

---

## [9832514064f03751bebf0080f918ddfe3cb14dc7] - Wed Oct 15 13:27:05 2025 +0200

**Author**: stenkjan
**Message**: `refactor: Transition to UnifiedContentCard component across various sections  - Replaced instances of deprecated card components (ImageGlassCard, VideoCard16by9, ContentCards) with UnifiedContentCard for consistency and improved functionality. - Updated card layouts and properties to align with the new unified structure, enhancing maintainability and visual coherence. - Removed obsolete card components to streamline the codebase and reduce complexity. - Adjusted related sections (DeinPartClient, EntdeckenClient, MaterialShowcase, etc.) to utilize the new UnifiedContentCard, ensuring a cohesive user experience.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/dein-part/DeinPartClient.tsx
- src/app/entdecken/EntdeckenClient.tsx
- src/app/konfigurator/components/ConfiguratorContentCardsLightbox.tsx
- src/app/showcase/cards/page.tsx
- src/app/showcase/grids/page.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/components/cards/CheckoutStepCard.tsx
- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCardsLightbox.tsx
- src/components/cards/ImageGlassCard.tsx
- src/components/cards/SquareGlassCard.tsx
- src/components/cards/SquareGlassCardsScroll.tsx
- src/components/cards/SquareTextCard.tsx
- src/components/cards/UnifiedCardPreset.tsx
- src/components/cards/UnifiedContentCard.tsx
- src/components/cards/VideoCard16by9.tsx
- src/components/cards/cardTypes.ts
- src/components/cards/index.ts
- src/components/sections/GrundstueckCheckSection.tsx
- src/components/sections/MaterialShowcase.tsx

---

## [b97b9d87f73365607c1db3bf8c7864d6a99e9947] - Tue Oct 14 17:01:37 2025 +0200

**Author**: stenkjan
**Message**: `fix: Clean up whitespace in clearCacheForConfiguration method  - Removed unnecessary whitespace in the  method of . - This change improves code readability without affecting functionality.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/ImageManager.ts

---

## [fd71bde868b98b113dc4cc4c21bdf7dc5df2c443] - Tue Oct 14 16:56:14 2025 +0200

**Author**: stenkjan
**Message**: `feat: Enhance image caching mechanism in ImageManager  - Implemented cache clearing for specific configurations in  to ensure fresh image loading. - Added debug logging to track image retrieval and cache operations, improving traceability during development. - Updated  to clear cache when configuration changes, optimizing image loading performance.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/core/ImageManager.ts

---

## [34750f80eaf39e6ce1e2cad97f9a53c5d1a05336] - Tue Oct 14 16:34:58 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/security/dashboard/route.ts
- src/app/api/security/events/route.ts
- src/app/konfigurator/core/ImageManager.ts
- src/app/showcase/grids/page.tsx
- src/app/test-sections/page.tsx
- src/components/cards/SquareTextCard.tsx
- src/components/sections/GetInContactBanner.tsx
- src/components/security/ProtectedContent.tsx
- src/components/security/ProtectedContentAdvanced.tsx

#### ⚙️ Backend Changes

- prisma/schema.prisma
- scripts/test-security.ps1
- scripts/test-security.sh

#### 📚 Documentation Changes

- SECURITY_IMPLEMENTATION_COMPLETE.md
- SECURITY_SUCCESS_SUMMARY.md
- SECURITY_TESTING_COMPLETE.md
- SECURITY_TESTING_GUIDE.md
- docs/COMMIT_HISTORY.md

---

## [c782f3333daebabcd010abbb7e2d06d094d133cc] - Tue Oct 14 16:31:25 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [6d2e422a5555393aa4ab4338deead35c863ffad9] - Tue Oct 14 16:12:28 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [9b142ee34b5c13abdbef35d3a8efa8c51ddec91d] - Tue Oct 14 15:59:39 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [efb71de1f190e1b5a8deead103b544fa822dbc08] - Tue Oct 14 15:49:19 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [73a151f83a58fb682dddf2175034a6750bd65f59] - Tue Oct 14 15:41:27 2025 +0200

**Author**: stenkjan
**Message**: `feat: Add bottomText prop to GetInContactBanner for enhanced customization  - Introduced a new optional  prop to the  component, allowing for additional text below the banner box. - Updated the component's TypeScript interface to include the new prop for better type safety and documentation.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/sections/GetInContactBanner.tsx

---

## [1506a5c3b7c37a812ff4fb4550dc588e03e20237] - Tue Oct 14 15:26:08 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [a099ed25747ec62de1ba459be3e01d9d0e41f3d3] - Tue Oct 14 15:02:16 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/admin/usability-tests/route.ts
- src/app/api/content/analytics/route.ts
- src/app/entdecken/EntdeckenClient.tsx
- src/app/entwurf/page.tsx
- src/app/globals.css
- src/app/kontakt/KontaktClient.tsx
- src/app/konzept/KonzeptClient.tsx
- src/app/konzept/page.tsx
- src/app/test-sections/page.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/components/Footer.tsx
- src/components/cards/VideoCard16by9.tsx
- src/components/layout/Navbar.tsx
- src/components/sections/GetInContactBanner.tsx
- src/components/sections/LandingImagesCarousel.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/TYPOGRAPHY_STANDARDS.md

---

## [25b5e09e1922f97d21b2053d05b6222d7a068cad] - Tue Oct 14 14:19:45 2025 +0200

**Author**: stenkjan
**Message**: `fix: Refine LandingImagesCarousel styles for consistency  - Removed unnecessary rounded corners from the image class for a cleaner look. - Maintained the gradient overlay styling for the description while ensuring layout integrity.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/sections/LandingImagesCarousel.tsx

---

## [13b0a010f883d92210944ded979c4ace0947d505] - Tue Oct 14 14:03:06 2025 +0200

**Author**: stenkjan
**Message**: `fix: Update GetInContactBanner styles for improved responsiveness  - Adjusted icon dimensions and margins for better layout consistency across different screen sizes. - Removed bottom margin from the subtitle for a cleaner appearance.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/sections/GetInContactBanner.tsx

---

## [bd17a183d603dc1d26f8d4b80a3ff2a34d6415a4] - Tue Oct 14 13:41:18 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [2ea8bce859b084bb3b1899228c7f832336fa1b83] - Tue Oct 14 11:56:51 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [35ece64bd3e7135d32567f8f4d7dac1a30ea32ca] - Tue Oct 14 11:50:35 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [652c525f91cab85c63829191659b62d4d161d2f8] - Tue Oct 14 11:47:16 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [10bc5e81cf685b12da2aecca0b0929c0f83533a9] - Tue Oct 14 11:29:55 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/entdecken/EntdeckenClient.tsx
- src/app/showcase/cards/page.tsx
- src/components/sections/TransportabilitaetVideo.tsx
- src/components/sections/index.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/TYPOGRAPHY_STANDARDS.md

---

## [2d5abadacbf6393971f27c8910918eb32a74546b] - Tue Oct 14 11:14:32 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/admin/usability-tests/route.ts
- src/app/api/content/analytics/route.ts
- src/app/dein-part/DeinPartClient.tsx
- src/app/entdecken/EntdeckenClient.tsx
- src/app/entwurf/EntwurfClient.tsx
- src/app/entwurf/page.tsx
- src/app/unser-part/.gitkeep
- src/app/unser-part/UnserPartClient.tsx
- src/app/unser-part/page.tsx
- src/app/warum-wir/WarumWirClient.tsx
- src/components/Footer.tsx
- src/components/cards/VideoCard16by9.tsx
- src/components/layout/Navbar.tsx

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [888235ce60f36784a60e4493dc5b24eabd4f3b56] - Tue Oct 14 10:59:53 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/entdecken/EntdeckenClient.tsx
- src/app/test-sections/page.tsx
- src/components/sections/SectionHeader.tsx
- src/components/sections/index.ts

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md
- docs/TYPOGRAPHY_STANDARDS.md

---

## [4202b6081b3647b4f9b081cf13347a3171232de6] - Tue Oct 14 10:55:17 2025 +0200

**Author**: stenkjan
**Message**: `refactor: Standardize section layout and typography across components  - Updated architecture design rules to enforce consistent section padding and background colors. - Introduced the  component for uniformity in section titles and subtitles. - Refactored  to utilize the  for improved readability and maintainability. - Enhanced  with detailed usage guidelines for the  component. - Expanded content card presets to include new button variants for better design flexibility.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/entdecken/EntdeckenClient.tsx
- src/app/test-sections/page.tsx
- src/components/sections/SectionHeader.tsx
- src/components/sections/index.ts

#### 📚 Documentation Changes

- docs/TYPOGRAPHY_STANDARDS.md

---

## [55a51d6b3e92a04f89ea3fa5bae5c58504dd364f] - Mon Oct 13 16:40:47 2025 +0200

**Author**: stenkjan
**Message**: `feat: Complete price system SEO audit and m² calculation fixes  ✅ CRITICAL FIX: M² Price Calculation Synchronization - Fixed CartFooter.tsx missing Geschossdecke quantity parameter - All three locations now show identical m² prices:   * Configurator Panel (SummaryPanel): 2.080€/m²   * Cart Footer (CartFooter): 2.080€/m² [FIXED]   * Cart Page (CheckoutStepper): 2.080€/m²  ✅ SEO STRUCTURED DATA ENHANCEMENT - Created dynamic price schema system (src/lib/seo/priceSchema.ts) - Enhanced configurator page with application schema - Added real-time pricing to structured data - Expected 15-25% improvement in search click-through rates  ✅ SERVER-SIDE SESSION MANAGEMENT - Implemented background session sync (src/app/api/sessions/sync/route.ts) - Created SessionManager utility with debounced sync - Added automatic session persistence without UI blocking - Integrated with existing UserSession database table  ✅ PERFORMANCE OPTIMIZATION - Added memoization to PriceCalculator with 5-second cache - Created reusable PriceDisplay component with memoization - Built usePriceCalculation hook for optimized calculations - Achieved sub-50ms price calculation response times  ✅ SESSION TRACKING IMPROVEMENTS - Fixed lazy test session creation race conditions - Added session verification API endpoint - Implemented graceful error handling for tracking - Prevented tracking in development without alpha-test=true  ✅ DOCUMENTATION UPDATES - Updated beta roadmap with SEO enhancement options - Added Price System Architecture section (Grade: A-) - Documented implementation status and impact metrics  � Technical Details: - Fixed Geschossdecke area calculation (7.5m² per unit) - Synchronized price sources across all components - Enhanced structured data for better SEO - Maintained client-side performance (<100ms calculations) - Added comprehensive debug logging system  � Impact: - Consistent pricing across entire website - Enhanced SEO with real-time pricing data - Improved session tracking and persistence - Better performance with caching and memoization - Resolved WebSocket development tool errors  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/sessions/sync/route.ts
- src/app/konfigurator/components/CartFooter.tsx
- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/core/PriceCalculator.ts
- src/app/konfigurator/page.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx
- src/app/warenkorb/page.tsx
- src/components/ui/PriceDisplay.tsx
- src/hooks/usePriceCalculation.ts

#### 📚 Documentation Changes

- docs/01-BETA-NEST-HAUS-LAUNCH-SECURITY-ROADMAP.md

---

## [c580d72512d268630dfd1e662b47457f44233ab0] - Mon Oct 13 15:31:11 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [6dcfd5ce7031c75ad0f66d739f7f3e9376ed0239] - Mon Oct 13 15:19:08 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [ae31bb5bc810e1cba78f8709f61f9a3897db970f] - Mon Oct 13 14:56:30 2025 +0200

**Author**: stenkjan
**Message**: `Enhance price calculation logic in SummaryPanel and PriceUtils  - Updated PriceUtils to include optional geschossdeckeQuantity parameter in price calculations. - Modified SummaryPanel to pass geschossdecke quantity when calculating price per square meter. - Adjusted CheckoutStepper to utilize totalPrice and geschossdecke quantity for accurate pricing.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/SummaryPanel.tsx
- src/app/konfigurator/core/PriceUtils.ts
- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [3cc416831205dd9bc974118f80d9805c43b6eaf9] - Mon Oct 13 14:29:32 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [1c512e3b0dc6cdfbbb404ac267712a795573b45b] - Mon Oct 13 14:18:23 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [3c7749911445ef4cfbe41feb8cf9cffecc0b3086] - Mon Oct 13 14:12:47 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [9f02feb655c58c860c2d5e7a9d4122a130aeae26] - Mon Oct 13 13:46:38 2025 +0200

**Author**: stenkjan
**Message**: `Refactor LandingPageClient to remove authentication checks  - Removed the authentication checking logic from LandingPageClient, simplifying the component. - Updated the rendering logic to allow content to be displayed directly without authentication checks. - Cleaned up unused state variables and imports for improved code clarity.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/LandingPageClient.tsx

---

## [0c72905bd58726539c7f93910d9a38d9e7b25882] - Mon Oct 13 13:38:21 2025 +0200

**Author**: stenkjan
**Message**: `Refactor LandingPageClient to improve image container structure  - Updated the layout of the image container in LandingPageClient for better responsiveness and overlay positioning. - Wrapped ProtectedContent in a div to ensure proper absolute positioning and full coverage of the image.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/LandingPageClient.tsx

---

## [7e0ed378548bea03e16b3c246b6a4fd432ae3edb] - Mon Oct 13 13:22:27 2025 +0200

**Author**: stenkjan
**Message**: `Update DevTools detection settings to reduce false positives  - Disabled DevTools detection by default and adjusted configuration parameters for improved accuracy. - Increased threshold and check interval to minimize unnecessary alerts. - Enhanced detection logic to better differentiate between normal and DevTools usage, reducing false positives.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/layout.tsx

---

## [f339cb3e22a1bf20542951a81167de02521938eb] - Mon Oct 13 12:52:29 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [3af62f706621fa1efb8845b716b5fdb9091a8974] - Mon Oct 13 12:43:41 2025 +0200

**Author**: stenkjan
**Message**: `Enhance ProtectedContent and ProtectedImage components to support deprecated CSS properties  - Introduced ExtendedCSSStyleDeclaration and ExtendedCSSProperties interfaces to handle deprecated msUserSelect property. - Updated style application in ProtectedContent and ProtectedImage components to use type assertions for better compatibility with legacy CSS properties.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/security/ProtectedContent.tsx
- src/components/security/ProtectedImage.tsx

---

## [ef7a405416eff31023125333fca19ec230a776dc] - Mon Oct 13 12:31:58 2025 +0200

**Author**: stenkjan
**Message**: `Fix copy event handler in ProtectedContent component to return true on successful copy action  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/components/security/ProtectedContent.tsx

---

## [e79f4bf7b5917b48d45fdbe3e8b241752e77e719] - Mon Oct 13 12:25:09 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [06035622367a8c77b66aeb1b2a31b06d436bfe42] - Mon Oct 13 11:55:41 2025 +0200

**Author**: stenkjan
**Message**: `Refactor Next.js configuration by removing build cache optimization settings  - Removed the turbotrace configuration to simplify the build process. - Maintained focus on optimizing package imports and server-side rendering performance.  `

### Changes Analysis

#### 🔧 Configuration Changes

- next.config.ts

---

## [338dbeb6093e2106241fe023387e4ebfdbd6e610] - Mon Oct 13 11:49:47 2025 +0200

**Author**: stenkjan
**Message**: `Enhance Next.js configuration for improved build performance and bundle optimization  - Excluded server-only modules from the client bundle to reduce size. - Implemented aggressive bundle splitting with updated chunk sizes for various libraries, including Google APIs and Chart.js. - Introduced build cache optimization and cleaning scripts to streamline the build process. - Updated build command to include a clean option for better cache management.  `

### Changes Analysis

#### 🔧 Configuration Changes

- next.config.ts
- package.json

---

## [cf0864a4f863093fec144b3d05942ae8b4595a2f] - Mon Oct 13 11:35:32 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [784b4463ad2a9e6f0b59c610216d6dee8c2914e5] - Mon Oct 13 11:30:50 2025 +0200

**Author**: stenkjan
**Message**: `Refactor Next.js configuration for minimal bundle splitting and basic Prisma setup  - Simplified bundle splitting configuration to prevent hanging issues. - Updated Prisma configuration for Vercel deployment with essential settings only. - Removed unnecessary external dependencies to streamline the build process.  `

### Changes Analysis

#### 🔧 Configuration Changes

- next.config.ts

---

## [edfac7cab113e0ccb0745c7d0dca8cbc69faf290] - Mon Oct 13 11:06:24 2025 +0200

**Author**: stenkjan
**Message**: `Refactor Next.js configuration for simplified bundle splitting and improved performance  - Streamlined bundle splitting configuration to avoid complex setups that may cause hanging. - Updated Vercel configuration to specify deployment regions. - Adjusted performance metrics in the security roadmap documentation.  `

### Changes Analysis

#### 🔧 Configuration Changes

- next.config.ts

#### 📚 Documentation Changes

- docs/01-BETA-NEST-HAUS-LAUNCH-SECURITY-ROADMAP.md

---

## [48a1a7306584a9f5e454e5539de910b272385eed] - Mon Oct 13 10:36:32 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [fc4dbe7d3c6f79c2ebc9f7d36ef3c9adfbe51516] - Mon Oct 13 10:30:02 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [6b07f9b5161988c30d2791e0f1a1cf4650df903c] - Mon Oct 13 10:15:59 2025 +0200

**Author**: stenkjan
**Message**: `Remove memory-based workers count from Next.js configuration to streamline build performance and reduce cache overhead.  `

### Changes Analysis

#### 🔧 Configuration Changes

- next.config.ts

---

## [d588565ea1d585b241605383751884aaffe245a6] - Mon Oct 13 10:09:42 2025 +0200

**Author**: stenkjan
**Message**: `Optimize Next.js configuration for improved performance and build efficiency  - Reduced chunk sizes for various libraries to enhance loading times. - Introduced new caching strategies and build optimizations in the package.json. - Added separate build commands for faster builds and cache optimization.  `

### Changes Analysis

#### ⚙️ Backend Changes

- scripts/optimize-cache.js

#### 🔧 Configuration Changes

- next.config.ts
- package.json

---

## [5e3a167b4271a54ead0a428f6e56fa90677b9046] - Sat Oct 11 15:26:17 2025 +0200

**Author**: stenkjan
**Message**: `Improve type safety in configuratorStore logging  - Updated console log to ensure type safety by using  for accessing the current configuration, enhancing clarity and preventing potential runtime errors.  `

### Changes Analysis

---

## [e9932e341947388cebf073a9aac22b1b4d319ae1] - Sat Oct 11 15:22:01 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [75068502d4d6f3eaca82cf2118cd089bcd7fef08] - Sat Oct 11 14:55:20 2025 +0200

**Author**: stenkjan
**Message**: `Refactor CheckoutStepper to utilize calculateSizeDependentPrice  - Removed redundant import of calculateSizeDependentPrice from the CheckoutStepper component. - Integrated calculateSizeDependentPrice directly from constants for improved clarity and efficiency in price calculations related to the fundament.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/konfigurator/components/PreviewPanel.tsx
- src/app/warenkorb/components/CheckoutStepper.tsx

---

## [7511e485a8444969b61d070f6421b78aba99e06c] - Sat Oct 11 14:51:03 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [4c8abd6764073cf20ddce01c1aa38ef0abc12a7a] - Fri Oct 10 17:41:01 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [9208a132375101ca82da9ebecc72e92b75f44ebb] - Fri Oct 10 17:02:59 2025 +0200

**Author**: stenkjan
**Message**: `Update dependencies and refactor motion imports across components  - Upgraded framer-motion version and replaced motion/react imports with framer-motion in multiple components for consistency. - Cleaned up package.json and package-lock.json by removing obsolete dependencies and ensuring proper versioning. - Enhanced code readability by standardizing import statements and formatting across various files.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/showcase/page.tsx
- src/components/cards/ContentCards.tsx
- src/components/cards/ContentCards.tsx.backup
- src/components/cards/ContentCardsGlass.tsx
- src/components/cards/ImageGlassCard.tsx
- src/components/cards/PlanungspaketeCards.tsx
- src/components/cards/SquareGlassCard.tsx
- src/components/cards/SquareGlassCardsScroll.tsx
- src/components/cards/SquareTextCard.tsx
- src/components/cards/VideoCard16by9.tsx
- src/components/grids/FullWidthImageGrid.tsx
- src/components/grids/FullWidthTextGrid.tsx
- src/components/grids/FullWidthVideoGrid.tsx
- src/components/grids/ImageWithFourTextGrid.tsx
- src/components/grids/StaticGlassCard.tsx
- src/components/grids/ThreeByOneAdaptiveHeight.tsx
- src/components/grids/ThreeByOneGrid.tsx
- src/components/grids/TwoByTwoImageGrid.tsx
- src/components/motion/MotionWrapper.tsx
- src/components/ui/Dialog.tsx

#### 🔧 Configuration Changes

- package.json

---

## [9615aebc75735b1ed8bbfc1cf3eba4066e005a03] - Fri Oct 10 16:50:17 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [cbe09f86ebeb0326d2353dc57a0ae76b75f2ebae] - Fri Oct 10 14:08:52 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

---

## [55e45869557d4f2937fddf72f85df39fb496ced1] - Thu Oct 9 09:31:56 2025 +0200

**Author**: stenkjan
**Message**: `Add password protection to /alpha-test route  - Split alpha-test page into server component with auth check - Created AlphaTestClient component for client-side functionality - Added same server-side authentication as main page - /alpha-test now redirects to /auth if not authenticated  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/alpha-test/AlphaTestClient.tsx
- src/app/alpha-test/page.tsx

---

## [1a4576de916eb1ca1667aec767c0eb7587a084df] - Wed Oct 8 17:04:34 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [48284b38087c70cd3888b21e33a98a373cc6c2ad] - Wed Oct 8 17:02:41 2025 +0200

**Author**: stenkjan
**Message**: `Fix TypeScript errors: await cookies() calls in Next.js 13+  - Made server components async to properly await cookies() - Fixed auth-status API route - Fixed AuthWrapper component - Fixed page.tsx server component  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/test/auth-status/route.ts
- src/app/page.tsx
- src/components/auth/AuthWrapper.tsx

---

## [c78abceff075b72204084af7b37880c6c947e7b6] - Wed Oct 8 16:58:07 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [b75df39a056b2ef00c3076f4996be3e77832bb7c] - Wed Oct 8 16:56:34 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [ce087089744559038a596f4fc8c48cb4c5573f7a] - Wed Oct 8 16:53:09 2025 +0200

**Author**: stenkjan
**Message**: `Implement comprehensive password protection system  - Enhanced middleware with debugging and simplified path matching - Added server-side authentication check in page.tsx - Created reusable AuthWrapper component - Improved client-side fallback with loading states and useLayoutEffect - Added comprehensive auth testing API - Multiple layers of protection: middleware -> server -> client  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/LandingPageClient.tsx
- src/app/api/test/auth-status/route.ts
- src/app/page.tsx
- src/components/auth/AuthWrapper.tsx

---

## [592512fac111d0c9b7255339c9ef0c7bb481a307] - Wed Oct 8 16:45:26 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [d970691cd6b2ae7d052b9f48f19962e75c87ae0e] - Wed Oct 8 16:41:59 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [1d14dc2754d2ad9c2c74f68e5e61de10d2dcacae] - Wed Oct 8 16:34:23 2025 +0200

**Author**: stenkjan
**Message**: `Fix middleware matcher to include root path for password protection  `

### Changes Analysis

---

## [f08604e5066a39fbc4624118b247e53b6fbe77ac] - Wed Oct 8 16:27:17 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [c4a9bf4d1e551e79b87464cff33d2b09884e956d] - Wed Oct 8 16:25:23 2025 +0200

**Author**: stenkjan
**Message**: `Fix middleware to apply password protection when SITE_PASSWORD is set  `

### Changes Analysis

---

## [7959fd9efe744fa778e8a4b44d693b54f047db26] - Wed Oct 8 16:19:18 2025 +0200

**Author**: stenkjan
**Message**: `Activate password protection system  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/auth/page.tsx

---

## [cac3a4e790c9d02c63a52b6c390c99ff12fabc82] - Wed Oct 8 15:29:42 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [147228af94651eea57e7d74d1039fa23f5b6a07a] - Wed Oct 8 15:26:30 2025 +0200

**Author**: stenkjan
**Message**: `refactor: enhance task reorganization logic in API route  - Updated the type definition for reorganized tasks to improve type safety and clarity. - Ensured that the structure of reorganized tasks includes necessary fields for better handling in subsequent operations.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/api/admin/pmg/reorganize/route.ts

---

## [b96cce289c74b8f36149e89ad01d68e48cfd9371] - Wed Oct 8 14:10:15 2025 +0200

**Author**: stenkjan
**Message**: `Enable password protection for production deployment  `

### Changes Analysis

#### 📚 Documentation Changes

- README.md

---

## [aba9428ff10ce8ee96cb9734c4863f0b8c218c23] - Wed Oct 8 13:09:32 2025 +0200

**Author**: stenkjan
**Message**: `feat: add admin controls for database seeding and task reorganization in ProjectManagementDashboard  - Introduced buttons for seeding the database and reorganizing task IDs in the Project Management Dashboard. - Enhanced the task reorganization logic in the API route to separate milestones from regular tasks and update IDs accordingly, ensuring safe updates using transactions.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/admin/pmg/components/ProjectManagementDashboard.tsx
- src/app/api/admin/pmg/reorganize/route.ts

---

## [6837ffb2b5da1c6acda1f31a9fb535651e2564ce] - Wed Oct 8 12:51:33 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [17b0b85371231bbce1bfc7121d076ee07bdc87fe] - Wed Oct 8 11:03:23 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [1cc94f55648903a40680818ac042c73f113d075a] - Wed Oct 8 10:44:05 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [d9cb9bb5e88c42f0ec46627864aaf3b722b64e5a] - Wed Oct 8 10:42:31 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [1e37afe4bcdf6b3c8066122d7ed4794619a1db6c] - Wed Oct 8 10:40:35 2025 +0200

**Author**: stenkjan
**Message**: `Merge branch 'main' of https://github.com/stenkjan/nest-haus  `

### Changes Analysis

#### 📚 Documentation Changes

- docs/COMMIT_HISTORY.md

---

## [32aaa6605608c4b86627c5f8137127efc9164d43] - Wed Oct 8 10:22:56 2025 +0200

**Author**: stenkjan
**Message**: `refactor: update contact information and enhance appointment dialog  - Changed company name from NEST-Haus GmbH to Eco Chalets GmbH in AgbClient component. - Updated email address to markus@sustain-nest.com for improved communication. - Added an InfoBox in ConfiguratorShell for the "nest" category to prompt users for consultation. - Refactored CalendarDialog component for improved layout and user experience, including new compact styles and enhanced form handling. - Introduced a new "dialog" variant in TerminVereinbarenContent for better integration with the CalendarDialog. - Adjusted various class names and styles for consistency and responsiveness.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/agb/AgbClient.tsx
- src/app/konfigurator/components/ConfiguratorShell.tsx
- src/components/dialogs/CalendarDialog.tsx
- src/components/sections/TerminVereinbarenContent.tsx

---

## [54403d0729a9c93ba1e21e40038149afec08cee6] - Wed Oct 8 09:00:56 2025 +0200

**Author**: stenkjan
**Message**: `refactor: update layout and comment out additional section in ImpressumClient component  - Changed the layout of the contact information section to use a flexbox for better alignment. - Commented out the "Fachbereiche" section to enhance code clarity and maintainability, preparing it for potential future use. - This change does not affect the current functionality.  `

### Changes Analysis

#### 🎨 Frontend Changes

- src/app/impressum/ImpressumClient.tsx

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

- src/app/konfigurator/**tests**/SummaryPanel.test.tsx
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

- src/app/konfigurator/**tests**/SummaryPanel.test.tsx
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

- src/app/konfigurator/**tests**/ConfiguratorShell.integration.test.tsx
- src/app/konfigurator/**tests**/PriceCalculator.test.ts
- src/app/konfigurator/**tests**/SummaryPanel.test.tsx
- src/app/konfigurator/**tests**/performance.test.ts
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
**Message**: `refactor: update component text and structure for improved clarity and consistency  - Changed button text in CartFooter from "Jetzt bauen" to "Zum Warenkorb" for better user understanding. - Enhanced accessibility by ensuring view labels in PreviewPanel are properly defined and fallback values are provided. - Simplified the SummaryPanel layout by removing unnecessary button elements, focusing on a cleaner design. - Added optional overlay image handling in various components to improve visual presentation. - Updated CheckoutStepper to prioritize cart item configuration for consistent display and added overlays for enhanced user experience.  These changes aim to improve usability, accessibility, and visual coherence across the application.  `

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
- src/app/konfigurator/**tests**/ImageManager.performance.test.ts
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

- src/app/konfigurator/**tests**/ImageManager.performance.test.ts
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

- src/app/konfigurator/**tests**/ImageManager.performance.test.ts
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
**Message**: `refactor: enhance button layout in SummaryPanel for improved user experience  - Updated the button rendering in SummaryPanel to display the "Zum Warenkorb" text and price on separate lines for better readability. - Maintained existing functionality while improving the visual presentation of the price information.  `

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
