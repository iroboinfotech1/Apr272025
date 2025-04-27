import { Button } from "@mui/material";

type Props = {
  message: string;
  onSave: () => void;
  close?: any;
};

const SaveAlert = ({ message, onSave, close }: Props) => {
  return (
    <div className="bg-white p-5">
      <div className="row">
        <div className="col-12">
          <div className="fw-bold">{message}</div>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-6 text-center">
          <Button variant="contained" onClick={() => { close && close(); }}>
            <div>Ok</div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SaveAlert;
