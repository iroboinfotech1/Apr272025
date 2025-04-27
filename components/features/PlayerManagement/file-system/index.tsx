import { Directory } from "../directory-tree";
import styles from "./fileSystem.module.css";

import IconOne from "../../../../assets/icons/playerdoticon-complete.svg";
import IconTwo from "../../../../assets/icons/playersmallrect-complete.svg";
import IconThree from "../../../../assets/icons/PlayerupArrow.svg";

import FolderIcon from "../../../../assets/icons/folder.svg";
import { useEffect, useState } from "react";
import building from "../../../../models/spacemgmt/building";
import SpaceService from "../../../../services/space.service";
import { ITree } from "../../../../models/spacemgmt/tree";
import Organization from "../../../../models/spacemgmt/organization";
import {
  getBuildingByOrgId,
  getFloorByBuildingId,
  getSpaceByFloorId,
} from "../../../../services/bookSpace.service";
import {
  IBuilding,
  IFloor,
  ISpace,
} from "../../../../pages/bookSpaces/types/bookSpace";

export const FileSystem = () => {
  const doSomething = () => {
    alert("Implement Functionality");
  };

  const [treeDatas, setTreeDatas] = useState<ITree[]>([]);
  const [expandedSection, setExpandedSection] = useState<string>("");
  const [selectedSectionFolders, setSelectedSectionFolders] = useState<ITree[]>(
    []
  );
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  useEffect(() => {
    SpaceService.getOrgList().then((res) => {
      const organizations: Organization[] = res.data;
      setOrganizations(organizations);
      const tree: ITree[] = organizations.map((organization: Organization) => {
        return {
          name: organization.orgName,
          type: "folder",
          id: organization.orgId,
          sectionType: "organization",
        } as ITree;
      });
      setTreeDatas(tree);
      setSelectedSectionFolders(tree);
    });
  }, []);

  const fetchChildren = async (parentId: number, sectionType: string) => {
    setExpandedSection(sectionType);
    let expandedTreeDatas: ITree[] = [];
    if (sectionType === "organization") {
      expandedTreeDatas = await requestAndPrepareBuildingTreeDetails(parentId);
    }
    if (sectionType === "building") {
      expandedTreeDatas = await requestAndPrepareFloorTreeDetails(parentId);
    }
    if (sectionType === "floor") {
      expandedTreeDatas = await requestAndPrepareSpaceTreeDetails(parentId);
    }
    if (expandedTreeDatas.length > 0) {
      setSelectedSectionFolders(expandedTreeDatas);
      const treeDetails = mapTreeDetails(
        treeDatas,
        sectionType,
        parentId,
        expandedTreeDatas
      );
      setTreeDatas(treeDetails);
    }
  };

  const mapTreeDetails = (
    treeDatas: ITree[],
    sectionType: string,
    parentId: number,
    expandedTreeDatas: ITree[]
  ) => {
    return treeDatas.map((data: ITree) => {
      if (data.id === parentId && data.sectionType === sectionType) {
        data.items = expandedTreeDatas;
      } else if (data.items && data.sectionType !== sectionType) {
        mapTreeDetails(data.items, sectionType, parentId, expandedTreeDatas);
      }
      return data;
    });
  };

  const requestAndPrepareBuildingTreeDetails = async (
    organizationId: number
  ) => {
    const buildingsByOrganization = await getBuildingByOrgId(
      organizationId.toString()
    );
    if (buildingsByOrganization && buildingsByOrganization.length > 0) {
      return buildingsByOrganization.map((building: IBuilding) => {
        return {
          id: building.buildingId,
          name: building.buildingName,
          sectionType: "building",
          type: "folder",
        } as ITree;
      });
    }
    return [];
  };

  const requestAndPrepareFloorTreeDetails = async (buildingId: number) => {
    const floorsByBuildingId = await getFloorByBuildingId(
      buildingId.toString()
    );
    if (floorsByBuildingId && floorsByBuildingId.length > 0) {
      return floorsByBuildingId.map((floor: IFloor) => {
        return {
          id: floor.floorId,
          name: floor.floorName,
          sectionType: "floor",
          type: "folder",
        } as ITree;
      });
    }
    return [];
  };

  const requestAndPrepareSpaceTreeDetails = async (floorId: number) => {
    const spacesByFloorId = await getSpaceByFloorId(floorId);
    if (spacesByFloorId && spacesByFloorId.length > 0) {
      return spacesByFloorId.map((spaces: ISpace) => {
        return {
          id: spaces.spaceId,
          name: spaces.spaceAliasName,
          sectionType: "space",
          type: "file",
        } as ITree;
      });
    }
    return [];
  };

  return (
    <div className={styles.fileSystemLayout}>
      <div className={styles.fileSystemLeftPan}>
        {treeDatas.map((building: ITree, index: number) => (
          <Directory
            name={building.name}
            key={`building${index}`}
            type={building.type}
            id={building.id}
            fetchChildren={fetchChildren}
            sectionType={building.sectionType}
            items={building.items}
          />
        ))}
      </div>
      <div className={styles.fileSystemRightPan}>
        <div className={styles.fileSystemViewOperationHeader}>
          <div className={styles.fileSystemViewOperation}>
            <div className="flex gap-1">
              <span>Sort by:</span>
              <span>Name</span>
            </div>
            <div className="flex items-center gap-2">
              <button className={styles.customIconButton} onClick={doSomething}>
                <IconThree></IconThree>
              </button>
              <span>|</span>
              <div className="flex gap-2">
                <button
                  className={styles.customIconButton}
                  onClick={doSomething}
                >
                  <IconTwo></IconTwo>
                </button>
                <button
                  className={styles.customIconButton}
                  onClick={doSomething}
                >
                  <IconTwo></IconTwo>
                </button>
              </div>
            </div>
          </div>
          <button className={styles.customIconButton} onClick={doSomething}>
            <IconOne></IconOne>
          </button>
        </div>

        <div className={styles.fileSystemViewRenderTilesView}>
          {selectedSectionFolders.map((item: ITree) => {
            return (
              <button
                key={item.id}
                className={styles.customIconButton}
                onClick={() => fetchChildren(item.id, item.sectionType)}
              >
                <FolderIcon></FolderIcon>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
