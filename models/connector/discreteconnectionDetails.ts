interface DiscreteCalendar {
    sourceCalendarId: string;
    timeZone: string;
    title: string;
    description: string;
    allowedAccess: string;
  }
  
  // Define the main ConnectionDetails interface
  export default interface DiscreteConnectionDetails {
    name: string;            // Connector name
    source: string;          // Source type (e.g., "Discrete")
    accessMode: string;      // Access mode (can be any string based on your needs)
    orgId: string;           // Organization ID
    calendar: DiscreteCalendar[];   // Array of Calendar objects
  }
  