export default interface AuditDetails {
    auditType: string;
    entityName: string;
    entityKey: string;
    message: string;
    auditTime: Date;
    userId: string;
    status: string;
}