import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import SystemManagement from "/assets/icons/systemmanagement.svg";
import Participanticon from "/assets/icons/dashboard card icons/partipanticon.svg";
import AdminApps from "/assets/icons/admin.svg";
import SpaceManagement from "/assets/icons/spacemanagement.svg";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Result } from "../../../models/spacemgmt/Room/SearchResult";
import { Result as DeskResult } from "../../../models/spacemgmt/Desk/SearchResult";
import { IAvailableSpaceDetail, ISpaceResource } from "../types/bookSpace";
import Image from "next/image";
import {
  spaceResourceConfig,
  spaceResourcesDictionary,
} from "../../../src/constants/spaceManagement/config";

interface CardComponentProps {
  isCheckBox?: boolean;
  roomDetails: IAvailableSpaceDetail;
  deskDetails?: DeskResult;
  handleChecked: (selectedRoom: IAvailableSpaceDetail) => void;
}

const CardComponent = ({
  isCheckBox,
  roomDetails,
  deskDetails,
  handleChecked,
}: CardComponentProps) => {
  return (
    <Card className="rounded-md">
      <div className="d-flex">
        <div className="d-flex h-25 float-left p-3.5">
          {isCheckBox && (
            <div className="flex items-center float-left p-0 m-0 h-28">
              <FormControlLabel
                control={<Checkbox />}
                label=""
                onChange={() => handleChecked(roomDetails)}
              />
            </div>
          )}
          <Image
            src={
              roomDetails?.organisationImage
                ? roomDetails?.organisationImage
                : "/assets/images/userprofile.png"
            }
            alt=""
            className="rounded-md outline outline-1 ring-blue-500"
            width="100"
            height="60"
          />
        </div>
        <CardContent>
          <div>
            <Typography
              className="mb-0"
              gutterBottom
              variant="h6"
              component="div"
            >
              {`${roomDetails?.spaceName} - Meeting ${roomDetails?.spaceType}`}
            </Typography>
          </div>
          <div className="d-flex flex-column">
            <Typography variant="body2" className="pl-0">
              {`${roomDetails?.spaceName}`}
            </Typography>

            <div className="flex gap-1">
              <Participanticon />
              <span>
                {
                  roomDetails?.spaceResources?.find(
                    (resource: ISpaceResource) =>
                      resource.resourceId === spaceResourcesDictionary.Chair
                  )?.resourceCount
                }
              </span>
            </div>
          </div>
          <div className="md:hidden">
            <div
              className="pt-2"
              style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
            >
              {spaceResourceConfig
                .filter((spaceResource) => {
                  return roomDetails?.spaceResources?.some(
                    (meetingSpaceResource: ISpaceResource) =>
                      meetingSpaceResource.resourceId ===
                      spaceResource.resourceId
                  );
                })
                .map((spaceResource, index: number) => (
                  <div key={index}>{spaceResource.resourceIcon}</div>
                ))}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default CardComponent;
