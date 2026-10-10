export type LegalPage = 'terms' | 'privacy' | 'help' | 'about';

type LegalSection = {
  heading: string;
  body: string;
};

type LegalDocument = {
  title: string;
  sections: LegalSection[];
};

export const LEGAL_DOCUMENTS: Record<LegalPage, LegalDocument> = {
  terms: {
    title: 'Terms and conditions',
    sections: [
      {
        heading: 'What this app does',
        body: 'AutoConX lets you request a mobile vehicle inspection for a vehicle already on this phone. Sending a request does not take a payment.',
      },
      {
        heading: 'Your booking',
        body: 'Check the inspection type, address, and date before you confirm. If the request does not go through, the form keeps what you entered so you can try again.',
      },
      {
        heading: 'This build',
        body: 'Bookings in this build are stored on the device. They are not sent to a live workshop system.',
      },
    ],
  },
  privacy: {
    title: 'Privacy policy',
    sections: [
      {
        heading: 'What stays on the phone',
        body: 'The vehicle, the draft booking, confirmed bookings, and notifications stay in local storage on this device.',
      },
      {
        heading: 'Location',
        body: 'The app asks for your location only when you tap Use current location. If you allow it, the form is filled with coordinates. Those coordinates are not a street address, and you can type an address instead.',
      },
      {
        heading: 'No account',
        body: 'This app does not ask you to sign in, and it does not collect a password.',
      },
    ],
  },
  help: {
    title: 'Help',
    sections: [
      {
        heading: 'Book a visit',
        body: 'Open My vehicles, choose Book Inspection, then pick the inspection type, the place to visit, and a date. Notes are optional.',
      },
      {
        heading: 'Location or address',
        body: 'You can type the address yourself. If location is denied, the typed address is still accepted.',
      },
      {
        heading: 'After you confirm',
        body: 'A reference appears on the confirmation. The same booking is listed under Bookings, and a notification is added for it.',
      },
    ],
  },
  about: {
    title: 'About',
    sections: [
      {
        heading: 'AutoConX',
        body: 'AutoConX arranges a specialist visit to inspect a vehicle where it is parked.',
      },
      {
        heading: 'On this phone',
        body: 'Home shows your vehicles. Bookings shows visits you have confirmed. The menu holds these policies and help.',
      },
    ],
  },
};

export function isLegalPage(value: string): value is LegalPage {
  return value === 'terms' || value === 'privacy' || value === 'help' || value === 'about';
}
