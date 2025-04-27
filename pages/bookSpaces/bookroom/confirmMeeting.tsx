import Layout from "../../../components/Layout";
import Typography from "@mui/material/Typography";

import CheckMark from "/assets/icons/checkmark.svg";
import { useRecoilState } from "recoil";
import { bookMeetingState } from "../../_app";

const ConfirmMeeting = () => {
  const [bookMeetingInfo, setBookMeetingInfo] =
    useRecoilState(bookMeetingState);

  return (
    <Layout>
      <div className="grid justify-center  row w-full text-sm mt-4 px-64 lg:px-2 md:px-2 sm:px-1">
        <div className="text-center">
          <div className="grid justify-center">
            <CheckMark></CheckMark>
          </div>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Congratulations!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            You have successfully booked the
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Einstein - Meeting Room
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            With Reference <b>ID {bookMeetingInfo.referenceNumber}</b>
          </Typography>
        </div>
      </div>
    </Layout>
  );
};

export default ConfirmMeeting;
