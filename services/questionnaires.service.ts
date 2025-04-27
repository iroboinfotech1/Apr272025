import http from "./http-common";
import ApiResponse from "../models/ApiResponse";


const GetQuestionnairesMasterList = () => {
    return http.get<ApiResponse>("api/SMSService/Questionnaires/GetQuestionnairesMasterList")
        .then(res => res.data);
}

const GetQuestionnairesMasterById = (qId: number) => {
    return http.get<ApiResponse>("api/SMSService/Questionnaires/GetQuestionnairesMasterById?qId=" + qId)
        .then(res => res.data);
}

const DeleteQuestionnaire = (qId: number) => {
    return http.delete<ApiResponse>("api/SMSService/Questionnaires/" + qId)
        .then(res => res.data);
}

const AddQuestionnaire = (request: any) => {
    return http.post<ApiResponse>("api/SMSService/Questionnaires/AddQuestionnaire/", request)
        .then(res => res.data);
}

const CreateQuestionnaire = (request: string,qName: string, qDefault: boolean) => {
    var req = {
        "QName": qName,
        "QDefault": qDefault,
		"QJson": request,
	};
    return http.post<ApiResponse>("api/SMSService/Questionnaires/CreateQuestionnaire/", req)
        .then(res => res.data);
}

const GetQuestionnaireById = (qId: number) => {
    return http.get<ApiResponse>("api/SMSService/Questionnaires/GetQuestionnaireById?id=" + qId)
        .then(res => res.data);
}

const SaveQuestionnaireAnswers = (visitDate: string, request: string,capturedImage: string | null) => {
    var req = {
        "visitDate": visitDate,
		"VpJson": request,
        "VisitorPhoto": capturedImage
	};
    return http.post<ApiResponse>("api/SMSService/Questionnaires/SaveQuestionnaireAnswers/", req)
        .then(res => res.data);
}

const GetVisitorDetailsByDate = (startDate: string, endDate: string) => {
    return http.get<ApiResponse>("api/SMSService/Questionnaires/GetVisitorDetailsByDate?startDate=" + startDate + "&endDate=" + endDate)
        .then(res => res.data);
}

const QuestionnairesService = {
    GetQuestionnairesMasterList,
    GetQuestionnairesMasterById,
    AddQuestionnaire,
    DeleteQuestionnaire,
    CreateQuestionnaire,
    GetQuestionnaireById,
    SaveQuestionnaireAnswers,
    GetVisitorDetailsByDate,
}

export default QuestionnairesService