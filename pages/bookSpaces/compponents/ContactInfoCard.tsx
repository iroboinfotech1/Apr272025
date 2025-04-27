import Card from "@mui/material/Card";
import Image from "next/image";
import Typography from "@mui/material/Typography";

type ContactInfoCardProps = {
    image: string;
    name: string;
    email: string;
}

const ContactInfoCard = (props: ContactInfoCardProps) => {
    return (
        <Card className="rounded-md flex gap-4 p-4 items-center">
            <Image
                src={props.image}
                alt=""
                className="rounded-md outline outline-1 ring-blue-500"
                width="80"
                height="80"
            />
            <div>
                <Typography className="mb-0" variant="h6">{props.name}</Typography>
                <Typography variant="body2" >{props.email}</Typography>
            </div>
        </Card>
    )
}

export default ContactInfoCard;