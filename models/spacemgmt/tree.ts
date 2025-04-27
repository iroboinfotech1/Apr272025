export interface ITree {
  name: string;
  id: number;
  type: string;
  items?: ITree[];
  sectionType: string;
}
