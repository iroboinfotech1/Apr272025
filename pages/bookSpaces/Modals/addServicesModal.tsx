import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import { Button } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Router from "next/router";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { selectedMeetingServiceState } from "../../_app";
import { IMeetingService } from "../types/bookSpace";
import { useEffect } from "react";
import {
  getBookedServicesByMeetingId,
  updateBookedService,
} from "../../../services/bookSpace.service";
import BookServiceCounter from "../../../components/BookServiceCounter";
import { services } from "../../../src/constants/spaceManagement/config";

const AddServicesModal = (props: any) => {
  const [selectedMeetingService, setSelectedMeetingService] = useRecoilState(
    selectedMeetingServiceState
  );
  let routeUrl = "";
  console.log(props);
  if (props.modalFrom === "bookService")
    routeUrl = "/bookSpaces/bookService/confirmMeeting";
  const onAddServiceClick = () => {
    routeUrl == "" ? props.onClose() : saveAndClose();
  };

  const saveAndClose = async () => {
    await updateBookedService(selectedMeetingService);
    Router.push(routeUrl);
  };

  useEffect(() => {
    (async () => {
      // Need Implementation
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (props.selectedMeetingId) {
        const bookedServices = await getBookedServicesByMeetingId(
          props.selectedMeetingId
        );
        bookedServices?.map(service =>{
          service.meetingId = props.selectedMeetingId;
        });
      }
    })();
  }, [props.selectedMeetingId, setSelectedMeetingService]);

  const services = [
    {
      serviceName: "Cofee",
      serviceId: 1,
      serviceIcon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAADC0lEQVRIicWUTWhcVRiGn/fMJMEkd1JLQ9G6UlEk+EPHmZtiE0wyJeAParGIC6W7QgRxpaILIxZMUepWBBdSBCn+ICVSdG4i0bTNTAddCcZW3GilbWR67yTY+bmfC23STKNJOgvf3ffxfu9zzuGcA03qz1dy2SA8k55ZvOlKLxuEX/tB+PKV2p+69JAfhD8OzES9zfPNcs2NmPg7wQ3JauPgikl54KA/vXQLQKLmTgNbqtV4fNOAQi61AEwiMium+hEgIavvBDgx6p3HOC4p0zy/LsDPV+4B9gmbBcBMsRKvG1yuJRNFAH+qnEY8bmh2U4C+o9aO4i9AZxMd1RcB/CB83oxnZNpfGuw6lz72WyfmJjF+qC9Fr64HSF5ddPeGO4m1wxHvnd3dG/2zhEfMmCzkvI8A2ru8TGy23ZwbLT1689KmdmAN/QTEhtuz3IyZF6R3f1O+EaCadPOAyeI9bECrAIVcakFiwrCx5fxG2wTQUau5JwBKg13ngMOIMa5XD3x7wbumNtN/ef43KRtErzmsr9WgGDMnDp8a7plbBfCDsAxcQPZLKwAzDQhmDfsMU6mQS51cAYhDc8OpN1sB+EH4K7DVQIIO4NPKgvf0NS+5NdnbjR7PM2M/8Fj3tspLScAsRutMbiAbISjdrxrwQX8QPmxmTzpkkdD2VrLTp60N0WtSuMwTfwDdTsY8srtbASTLi3cBSYwzANl8eAfGUxLTzv7+6wf9fOX6d6HGPgCZDvhB9KXE90DZ1fSKcySPGNRNtu7PuJbS0+E20JjBWVycEFZBvMHl2r0nRr3zAGSDcMIPwlpmqjKyqfRxc34+/NgPosVMvnzrWhYH0Om8caDoLP7Ez0dDG8nuO2rt/kD0LmIvFh8o5rb8vJZv+XruOn5pa9yuzzF2Ae/UHYdKQ6mLaw31fxU9aLK3EPchPTc37L33bwtRZqoy4rDbAIhpQ/YCcDvwJ2jGiIuCi2bqFLYDaQS4E0DifUMFAJlZw7ljxaHu31cB/Hx4EtG/kWNZR7HMnj2V6/nw6uZfL0E9Lu4ZQTQAAAAASUVORK5CYII=",
    },
    {
      serviceName: "Snacks",
      serviceId: 2,
      serviceIcon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAATCAMAAAC9bj0JAAABgFBMVEUAAAAA//8AgP9Av/8zzP9Jtv9Av/85xv8zs+ZAv+ozv/I9wvM6ufM3vPQ1v/QzwvU7uvU5vfYzu+42ufA1vPA6vfA0vvI5v/I4u/M1vvM3vPQ5u+84vfA4vvE2vPI5vfI3u/I2vPI1vfM5vvM3vPM4vPQ4vfE3vvE2vfM4vvM3vPM4vfI3vvI4vfI4vfI4vfM3vvM3vPM3vPE3vfE4vPI4vfI3vfI3vvI2vPI4vfM3vvM3vPM2vfM3vPE3vfE2vfI4vvI3vfM2vfM4vfM3vPI4vvI3vPI3vfI4vvI3vPI3vfI2vvM3vfE3vvE2vfE4vfI3vfI4vfI2vfI4vfI3vfI3vfI3vPM3vfM3vfM4vfE2vfI3vfI3vfI3vfI3vPI3vfI4vfI3vPI3vfM2vfE4vfI3vfI3vfI3vfI3vvE3vfI3vfI3vPI3vfI3vfI3vfI2vfI3vfI3vfI3vfI3vfI3vfI3vfI3vfI3vfI3vfI3vfI3vfI3vfI3vfI3vfI3vfL///8CndzUAAAAfnRSTlMAAQIEBQcICQoMFBUWFxgZGhseISIjJygpKy4xMjc5Ojw9Pj9BRElKVVZYYGJkZWlqa29wcnd4eXp8fX5/goOIiY+Sk5mcnZ+goaOkp6ipqquusrO1tri5urzAwcLGx8jKy83O09TV2uLj5Obn6Onq6+7v8PHy8/T29/r7/P06JlfPAAAAAWJLR0R/SL9x5QAAAV9JREFUGBkFwYtCSwEAANBzZzVKZaUHUYsxSWpFhahY2hDyaqyZ1CppI5HK7v125wCty4f18vr+/pdy/XC5BYCOan3qXn5x6uFhODdVr3YA4uO13V4gdbA93LdbG49Dc6mRT7ZOBpyeONPzJnqeLDTWEhhtDJCOUoz862I4GjLQGEW+Av0I+qE+Q6WAag6aZiulbADFFXJbpKPMxTtng/fHS6/CBd2z57InXTJR2urXYOTo/FB0nYmw7dqvdGLviWBj1c4ccbfDU/REV2MxXn5kfsfqRoBUlGEybEdi77Fg44N0lEHw7njpdbgA2ZMumShNNaez2N10v/JpLLhcbFNcIVdFoeLS5gXgylan+gyVPEYbg2K4O4KYm9GQwcYtJNbCQhKlp+h9Gz1LFsJSM8SztW89QOpg+0bfbm0sDujYqk8/KCxOP/obzk//2GwHoHX5T628/vP35/L3oxct4D+etEsVYg86tgAAAABJRU5ErkJggg==",
    },
    {
      serviceName: "Lunch",
      serviceId: 3,
      serviceIcon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAABIFBMVEUAAAAA//8AgP9Vqv9Av/9Av/85xv8zs+Yuueg7xOs5uPE2vPI9wvM6ufMzwvU7uvU4v+81vPA5v/E2vvQ5u+84vfA1vPE3vPM2vfM4vPQ4vfE3vvE2vvE2vfI4vPM3vPE3vfE2vPI4vfI3vvM3vPM2vfE4vfE4vPI4vfI3vPM2vfM3vPI3vPI4vfI3vfM4vfM3vvE3vfI4vvI4vfM3vfM3vvE3vPI3vfI3vPI2vfI3vPI3vfI3vfI3vvE3vfI3vvI3vfI3vvI3vfI2vfI3vPI3vfI3vfM4vfI3vfI3vfI3vfI3vfI3vfI3vfI3vvI3vfI3vPI3vfI3vfI3vfI3vfI3vfM3vfI3vfI2vfI3vfI3vfI3vfI3vfI3vfI3vfL////VoEusAAAAXnRSTlMAAQIDBAgJCgsNEhMVFhkaICIkLzEyNUFCRElKS1FXXF1jZGZrbG1yd35/hoqOj5OUn6Clpqisr7CytLW2u76/wsPExcfIzNPU1tfZ2t3e3+bp7vLz9fb3+Pn6+/3+IVGpaAAAAAFiS0dEX3PRUS0AAADiSURBVBgZjcFXVsJQFEDRQwRjQRB77CIoigQLNjRgL2AhYIkS7/yH4YsruvL4cm+UhaNW191OoNuUr3unIRU0Qx+NDBi1bm41NI4yKVsoJflTQxl8ac31MXDzNmuF0gRWfHl9/BSbHhP2xcP1usH/ZKtORDXLj7z0yBFotlNEpNpNlIzsoanIGLAmS2iWJQ+c+iNokv4JFD3PCRymIXngBDyvyLmELguFuoTO4OrdRNkX5TjGrw2ZR0lMW9aMiTK8GAOmpIymLKOA4T7FiYg/uwaKLbdOxJ2UCJi7HYno7PTDN1SjPDX2SNiMAAAAAElFTkSuQmCC",
    },
  ];

  const handleCounterUpdate = (serviceId, serviceCount) => {
    let _meetingService = [...selectedMeetingService];
    if (
      _meetingService &&
      _meetingService.some(
        (service: IMeetingService) => service.serviceId === serviceId
      )
    ) {
      _meetingService = _meetingService.map((service: IMeetingService) => {
        let _service = { ...service };
        if (_service.serviceId === serviceId) {
          _service.serviceCount = serviceCount;
          _service.action = serviceCount > 0 ? "update" : "delete";
        }
        return _service;
      });
    } else {
      if (_meetingService) {
        _meetingService = [
          ..._meetingService,
          { serviceId, serviceCount, action: "added" },
        ];
      } else _meetingService = [{ serviceId, serviceCount, action: "added" }];
    }
    setSelectedMeetingService(_meetingService);
  };

  return (
    <div>
      {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                Select Services
            </Typography> */}
      <Grid
        sx={{ margin: "20px 20px 0px 0px" }}
        container
        spacing={2}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        {services.map((service: any) => {
          return (
            <>
              <Grid xs={1}>
                <Image
                  src={service.serviceIcon}
                  alt={""}
                  className="float-left md:float-none sm:float-none lg:float-none"
                  width="100"
                  height="60"
                />
              </Grid>
              <Grid xs={5}>
                <Typography>{service.serviceName}</Typography>
              </Grid>
              <Grid xs={6}>
                <BookServiceCounter
                  handleCounterUpdate={handleCounterUpdate}
                  service={service.serviceId}
                  selectedCounterValue={
                    selectedMeetingService.find(
                      (selectedService: IMeetingService) =>
                        selectedService.serviceId === service.serviceId
                    )?.serviceCount
                  }
                ></BookServiceCounter>
              </Grid>
            </>
          );
        })}
      </Grid>
      <FormControl
        sx={{ margin: "20px 0px 0px 0px" }}
        className="flex justify-center "
        size="small"
      >
        <Button variant="contained" onClick={onAddServiceClick}>
          Add Services
        </Button>
      </FormControl>
    </div>
  );
};
export default AddServicesModal;
