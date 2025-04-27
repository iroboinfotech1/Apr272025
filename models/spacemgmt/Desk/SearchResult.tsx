
export interface Result {
    id: string;
    DeskName: string;
    Description: string;
    StartDate: string;
    EndDate: string;
    DeskID:string;
    location:string
}
export default interface SearchResult {
    Result: Result[]
}