import { useState } from "react";
import FolderIcon from "../../../../assets/icons/playertreeviewfoldericon.svg";
import DownArrow from "../../../../assets/icons/playerdownarrowtree.svg";
import { ITree } from "../../../../models/spacemgmt/tree";

type TreeModel = {
  name: string;
  type: string;
  sectionType: string;
  items?: ITree[];
  id: number;
  fetchChildren: (parentId: number, sectionType: string) => void;
};

export const Directory = (props: TreeModel) => {
  const { name, type, items } = props;
  const [isExpanded, toggleExpanded] = useState(false);
  const fileClicked = () => {
    alert("File Clicked");
  };
  const handleExpand = (flag: boolean, id: number, sectionType: string) => {
    toggleExpanded(flag);
    props.fetchChildren(id, sectionType);
  };

  if (props.type === "folder") {
    return (
      <div className="pl-3 pt-3">
        <button
          className="flex items-center text-sm gap-1.5"
          onClick={() => handleExpand(!isExpanded, props.id, props.sectionType)}
        >
          <DownArrow
            style={isExpanded ? { rotate: "0deg" } : { rotate: "270deg" }}
          ></DownArrow>
          <FolderIcon></FolderIcon>
          <h2 className="text-gray-500">{props.name}</h2>
        </button>
        {props?.items &&
          props?.items.length > 0 &&
          props?.items?.map((item: ITree) => (
            <Directory
              fetchChildren={() =>
                props.fetchChildren(item.id, item.sectionType)
              }
              key={item.name}
              {...item}
            />
          ))}
      </div>
    );
  }
  return (
    <button
      onClick={fileClicked}
      className="text-gray-500 block text-sm pl-7 pt-4"
    >
      {props.name}
    </button>
  );
};
