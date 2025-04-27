export default interface ApiResponse {
    data: any;
    status: boolean;
    message: string | null;
    statusCode:number;
}