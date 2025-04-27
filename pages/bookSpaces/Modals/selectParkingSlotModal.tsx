import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import { Button } from "@mui/material";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import roomData from "../data/bookRoomData.json";
import { useEffect, useState } from "react";
import UsermanagementService from "../../../services/usermanagement.service";

function SelectParkingSlotModal(props) {
  const [selectedParticipantId, setSelectedParticipantId] = useState<number>(0);
  const [vehicalNumber, setVehicalNumber] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [userList,setUserList]=useState<any[]>([]);

  async function fetchMyApi() {
    setLoader(true);
    var response = await UsermanagementService.getuserlist();
    console.log("UsermanagementService addUser", response);
    if (response?.data != null) {
      let userListTemp: any[] = [];
      response.data.forEach((userItem: any) => {
        var user: any = { 'userId': userItem.userId, 'userNameEmailId': userItem.userName}
        userListTemp.push(user);
      });
      setUserList(userListTemp);
    }
    setLoader(false);
    console.log("UsermanagementService-getuserlist", response);
  }
  useEffect(() => {
    //if(props.participants?.length <=0 ){
      //fetchMyApi();
    //}  
    }, []);
  
  return (
    <div>
      {props.selectedSlot}
      <div className="text-sm mt-4 px-2 md:px-2">
        {!props.isManageVisitorFlow && (
          <FormGroup>
            <FormControl
              fullWidth
              sx={{ margin: "20px 20px 0px 0px" }}
              size="small"
            >
              <>
                <InputLabel id="locationLabel">Add Participant</InputLabel>
                <Select
                  labelId="locationLabel"
                  label="Add Participant"
                  className="text-sm"
                  onChange={(e: any) =>
                    setSelectedParticipantId(e.target.value)
                  }
                >
                  {props.participants && props.participants.length > 0 && props.participants?.map((name:any) => (
                    <MenuItem
                      key={name}
                      value={name}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </>
            </FormControl>
          </FormGroup>
        )}
        <FormControl
          fullWidth
          sx={{ margin: "20px 20px 0px 0px" }}
          size="small"
        >
          <TextField
            id="attendies"
            label="Vehicle Number"
            variant="outlined"
            onChange={(e: any) => {
              console.log(e.target.value);
              setVehicalNumber(e.target.value);
            }}
          />
        </FormControl>
        <FormControl
          sx={{ margin: "20px 0px 0px 0px" }}
          className="flex justify-center "
          size="small"
        >
          <Button
            variant="contained"
            onClick={() =>
              props.addClick(
                props.selectedSlot,
                '',
                selectedParticipantId,
                vehicalNumber
              )
            }
          >
            Add
          </Button>
        </FormControl>
      </div>
    </div>
  );
}

export default SelectParkingSlotModal;
