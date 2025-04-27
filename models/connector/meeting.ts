import Attendees from "./attendees"

export default interface Meeting {
    id: 1421,
    startTime: string,
    endTime: string,
    summary: string,
    description: string,
    status: string,
    sourceEventId: string,
    attendees: Attendees[]
    recurrence: string,
    recurrentUpdateType: string
}