import ConnectionStringDetails from "./connectionStringDetails";
import connectionStringOffice365Details from "./connectionDetailsOfz365";
import CalendarDetails from "./calendarDetails";
import AuditDetails from "./auditDetails";
import LogDetails from "./logDetails";

export default interface ConnectionDetails {
  id: number;
  orgId: string;
  name: string;
  source: string;
  accessMode: string;
  modifiedBy: string;
  modified: Date;
  noOfDaysToSyncBefore: number;
  noOfDaysToSyncAfter: number;
  noOfSecondsToSyncCalendar: number;
  connectionString: ConnectionStringDetails;
  connectionStringOffice365:connectionStringOffice365Details
  connectionStringFreeText?: any;
  calendars: CalendarDetails[];
  audits: AuditDetails[];
  logs: LogDetails[];
  status: string;
  delegatedUserId?: string;
}