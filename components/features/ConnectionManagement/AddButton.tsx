import GoogleLoginButton from "../GoogleLogin/LoginButton";
import Button from "../../common/Button";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ModalService from "../../lib/modalPopup/services/ModalService";
import Connector from "../ConnectionManagement/Connector";

const addModel = (modelResponse: any) => {
  if (
    modelResponse != null &&
    modelResponse.connectorResponse != null &&
    modelResponse.connectorResponse.length
  ) {
    ModalService.open(Connector, modelResponse);
  }
};

const ButtonSelector: any = {
  None: Button,
  "10": GoogleLoginButton,
  "20": Button,
  "30": Button,
  "40": Button,
  "50": Button,
  "60": Button,
  "70": Button,
};
const clientId =
  "531686912380-bt5qnls2h1vi4omu0c4ti2fmhdi0f1ib.apps.googleusercontent.com";

export default function AddButton(
  { onClose, calenderValue, modelResponse }: any,
  props: any
) {
  const SelectedButton: any =
    ButtonSelector[calenderValue ? calenderValue : "70"];
  return modelResponse != null &&
    modelResponse.connectorResponse != null &&
    modelResponse.connectorResponse.length > 0 ? (
    <button
      className="btn btn-primary w-full"
      onClick={() => addModel(modelResponse)}
    >
      Add Connector
    </button>
  ) : (
      <button
      className="btn btn-primary w-full"
      onClick={() => addModel(modelResponse)}
      >
      Add Connector
    </button>
    // <GoogleOAuthProvider clientId={clientId}>
    //   <SelectedButton {...props} style="w-full">
    //     Add
    //   </SelectedButton>
    // </GoogleOAuthProvider>
  );
}
