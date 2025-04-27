import Typography from '@mui/material/Typography';
import FormControl from "@mui/material/FormControl";
import { Button } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import Cofee from "/assets/icons/coffee.svg"
import Lunch from "/assets/icons/lunch.svg"
import Snack from "/assets/icons/snack.svg"
import IncDecCounter from '../../../components/incDecCounter';

const ServiceModal = (props: any) => {

    const handleCounter = () => {

    }
    
    return (
        <div>
            {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                Select Services
            </Typography> */}
            <Grid sx={{margin: "20px 20px 0px 0px"}} container spacing={2} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
                <Grid xs={1}><Cofee/></Grid>
                <Grid xs={5}><Typography>Select Services</Typography></Grid>
                <Grid xs={6}><IncDecCounter value={0} onDecreaseClick={() => handleCounter()} 
                    onIncreaseClick={() => handleCounter()}></IncDecCounter></Grid>
                <Grid xs={1}><Snack /></Grid>
                <Grid xs={5}><Typography>Snacks</Typography></Grid>
                <Grid xs={6}><IncDecCounter value={0} onDecreaseClick={() => handleCounter()} 
                    onIncreaseClick={() => handleCounter()}></IncDecCounter></Grid>
                <Grid xs={1}><Lunch /></Grid>
                <Grid xs={5}><Typography>Lunch</Typography></Grid>
                <Grid xs={6}><IncDecCounter value={0} onDecreaseClick={() => handleCounter()} 
                    onIncreaseClick={() => handleCounter()}></IncDecCounter></Grid>
            </Grid>
            <FormControl  sx={{ margin: "20px 0px 0px 0px" }} className="flex justify-center " size="small">
                <Button variant="contained"  onClick={props.onClose}  >Add Services</Button>
            </FormControl>

        </div >
    );
};
export default ServiceModal;