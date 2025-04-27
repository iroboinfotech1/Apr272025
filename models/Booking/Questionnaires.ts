export interface Questionnaires {
    qId: number;
    qText: string;
    qType: string;
    qTypeValue: string;
    qSoftDelete: boolean;
    isSelected: boolean;
    qTypeValueEntry:string
}

export interface QuestionnairePortal {
    qId: number;
    qJson: string
}

export interface VisitorPortal {
    vId: number;
    visitDate: Date; 
    vpJson: string; 
}