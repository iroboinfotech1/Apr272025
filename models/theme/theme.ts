export default interface Theme {
    id: number
    themename: string
    themethumbnail: string
    themetype: string
    themeData: ThemeData
    themedata: string
    logo: string 
    background: string
}
export interface ThemeData {
    allowBooking: boolean
    confirmBooking: boolean
    qrcodeauth: boolean
    changeEndTime: boolean
    endBooking: boolean
    showOrganizer: boolean
    hideSubject: boolean
    showAppointmentsForDays:number
	findRoom: boolean
    enableFaultReporting: boolean
    accessSettings: boolean
	enableLEDStatus: boolean
    scrollSubject: boolean
    signageOnAvailability: boolean
    subjectFont: string
    subjectFontSize: string
    organizerFont: string
    organizerFontSize: string
    upcomingMeetingSubjectFont: string
    upcomingMeetingSubjectFontSize: string
    upcomingMeetingOrganizerFont: string
    upcomingMeetingOrganizerFontSize: string
    watermarkPlaylist:string
    signagePlaylist:string
    languages: any
    showAppointmentForDays: number
    startSignageMinute:number
    stopSignageMinute:number
    confirmbtnbefore:number
    confirmbtnafter:number
    availableStatusColor: string
    occupiedStatusColor: string
}
