# AutoConX inspection booking

A React Native app for booking a mobile vehicle inspection. Home shows a 2022 Nissan Patrol. Book Inspection collects an inspection type, address, date, and notes. A successful confirm opens a confirmation screen with a reference such as `ACX-29384`.

This is an assessment project. There is no real backend, account, or payment. The same JavaScript runs on Android and iOS.

## Stack

- React Native CLI `0.87.1` (Community CLI, not Expo)
- React `19.2.3`
- TypeScript `6` with `strict` enabled
- React Navigation native stack
- Zustand for confirmed bookings and notifications
- React Hook Form and Zod for the booking form
- AsyncStorage for the unfinished draft and for the saved bookings
- `@react-native-community/datetimepicker`
- `@react-native-community/geolocation` for foreground location only

The form stays in React Hook Form. Zustand holds the list of confirmed visits and the notification inbox, because Home, Bookings, and the bell badge all read them. Zod 4 needs `@babel/plugin-transform-export-namespace-from` in `babel.config.js` so Metro can bundle it.

## What the customer sees

1. A white splash with the logo. The rest of the app mounts after it finishes.
2. Home, with the vehicle card, Book Inspection, and the latest saved visit when one exists.
3. Book Inspection. Confirm booking stays at the bottom of the screen.
4. Confirmation for the booking that just succeeded. View Booking opens the notes and status on that screen.
5. A top bar with the logo, menu, notifications, and profile. A bottom bar with Home, Bookings, and Profile. The menu holds Terms and conditions, Privacy policy, Help, and About.

Profile is a guest screen. The assessment does not ask for login.

Android uses the system date dialog. iOS uses a spinner and a Done button. iOS also shifts the form when the keyboard opens.

## Install

Requires Node.js 22.11 or newer, a JDK 17 install, and the Android SDK. iOS also needs Xcode and CocoaPods.

```bash
npm install
```

Android builds on this machine need:

```bash
export JAVA_HOME=/usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
```

Adjust that path if OpenJDK lives somewhere else. `java -XshowSettings:properties -version` prints `java.home`.

## Run Android

Start an emulator or connect a device, then:

```bash
npm start
npm run android
```

A release APK, with the JavaScript bundled inside it, is built with:

```bash
cd android && ./gradlew :app:assembleRelease
```

The output is `android/app/build/outputs/apk/release/app-release.apk`. A copy from the last build is `AutoConX-release.apk` in the project root. That APK is signed with the debug keystore so it can be installed for review. It is not a Play Store signing key.

The debug app was run on a connected Redmi 6 Pro. The launcher icon is the AutoConX logo.

## Run iOS

From the project root, install CocoaPods once, then run the app. Open `ios/AutoConX.xcworkspace` in Xcode if you build from Xcode. The `.xcodeproj` file alone does not include the pods.

```bash
bundle install
bundle exec pod install --project-directory=ios
npm run ios
```

`pod install` has been run in this workspace. After a fresh clone, run it again because `ios/Pods` is not committed. The iOS app icon uses the same logo. This workspace has not launched the iOS simulator.

## Project structure

```text
src/
  app/            navigation and the home shell
  components/     bars, buttons, inputs, splash, loading and error states
  features/
    vehicle/      home vehicle card and mock vehicle data
    inspection/   inspection types
    booking/      form, validation, draft, submission, confirmation
    bookings/     saved visits
    notifications/
    profile/
    legal/        terms, privacy, help, about
  state/          Zustand store
  platform/       foreground location
  theme/          colours, spacing, type
  services/       shared service error
  utils/          dates and mock latency
```

Screens call feature services. Services own the mock responses. The booking schema owns validation. Navigation passes the confirmed booking as route params and does not submit again.

## Mock API

`GET /vehicles`, `GET /inspection-types`, and `POST /bookings` are function names for the assessment contract. They are not HTTP calls.

- Vehicle: 2022 Nissan Patrol, plate Dubai A 12345, id `vehicle_1`
- Inspection types: `PRE_PURCHASE`, `PRE_SALE`, and `ROUTINE`
- Dates are `YYYY-MM-DD` in local calendar time
- A successful booking returns a reference, starting at `ACX-29384`

Each call waits briefly so loading states are visible. Tests set that wait to zero. The attempt counter and the idempotency map live in process memory and reset when the JavaScript process reloads. A reference that is already saved on the phone is skipped, so a reload does not mint `ACX-29384` again and drop the new visit.

## Predictable failure

Every third new booking attempt fails. The first and second succeed, the third fails, and a retry of that same attempt can succeed. The message sits above Confirm booking. A failure stays on the form, keeps the values, and keeps the draft. It does not open Confirmation.

## Duplicate submits

The confirm button is disabled while a request is running. The submit handler ignores a second call if one is already in flight. The mock service also rejects a second call that starts before the first finishes.

Each attempt has a client idempotency key. A retry of a failed attempt reuses that key. If the same key already succeeded, the service returns the original booking instead of creating another one.

This protects one app process only. A production API should enforce the idempotency key on the server. This mock cannot promise exactly-once booking across devices or restarts.

A successful confirm replaces the form with a new confirmation screen for that booking. Opening a visit from Bookings pushes that visit’s confirmation. That keeps a second booking from showing the first booking’s details.

## Drafts and saved visits

The unfinished form is saved about 400ms after a change, under `@autoconx/booking-draft`. It is restored when Book Inspection opens, unless the user has already typed something newer. A broken saved value is discarded. The draft is cleared only after the mock service confirms the booking.

Confirmed bookings and notifications are stored with Zustand under `@autoconx/app-state`. They survive an app restart. The confirmation screen shows the booking passed in navigation params, not the draft.

## Location

The app asks for foreground permission only. Android requests fine location at runtime. iOS asks for when-in-use permission, and `Info.plist` contains `NSLocationWhenInUseUsageDescription`. There is no background permission and no reverse-geocoding service, so a successful fix fills the address with coordinates such as `25.08012, 55.14098`. The field stays editable. If permission is denied or the fix fails, the message tells the user to type an address, and the form can still be submitted. A denial is remembered for the session so the prompt is not repeated.

## Checks

- `npm run typecheck`
- `npm run lint`
- `npm test`: 23 tests

Covered by tests: date rules, required fields, request construction, mock success, the third-attempt failure, idempotent retry, skipping a saved reference, the in-flight lock, draft save/restore, malformed drafts, vehicle loading and retry, booking validation messages, storing a second booking, and the confirmation record including a change of reference.

The booking flow was exercised on a connected Redmi 6 Pro. An iOS simulator launch, a denied-location pass, and a killed-and-reopened draft were not part of that device check.

## Limitations

- Coordinates are not turned into a street address.
- Duplicate protection and the failure counter reset when the app process restarts.
- The project folder name contains a space, which can break some native builds.
- A fresh clone still needs `pod install` before the iOS app will build.

## With more time

- Run the flow on an iOS simulator, including a denied location prompt and a killed-and-reopened draft.
- Add a server idempotency key when a real bookings API exists.
- Replace coordinate text with a street address from a geocoder that does not require a private API key in the app.

## AI disclosure

Cursor was used for planning, implementation, debugging, and this README. The submitted code was reviewed against the assessment, and the type check, lint, and unit tests above were run on that code.
