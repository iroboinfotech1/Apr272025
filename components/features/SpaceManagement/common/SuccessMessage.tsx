import { Button } from "@mui/material"
import PopupHeader from "../../../common/PopupHeader"

interface MessageProps {
    headerText: String,
    bodyText: String,
    headerIcon: any,
    buttonText: any,
    close: any,
    buttonCallback: any
}
export default function SuccessMessage(props: MessageProps) {

    return (
        <div className="card text-center">
            <div className="card-body p-7">
                <div className="text-center pb-2.5">
                    <PopupHeader title="" subHeading="" align="center" close={props.close} ></PopupHeader>
                </div>
                <div className="grid justify-center">
                    <props.headerIcon />
                </div>
                <p className="font-bold">
                    {props.headerText}
                </p>
                <div>
                    {props.bodyText}
                </div>
                <div className="col-12 text-center mt-4">
                    <Button variant="contained" type="submit" onClick={(e) => { props.buttonCallback() }}>{props.buttonText}</Button>
                </div>

            </div>
        </div>
    )
}