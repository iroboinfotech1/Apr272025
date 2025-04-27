import styles from "./floorviewer.module.css";
import styled from "@emotion/styled";
import { AreaSelector, IArea } from '@bmunozg/react-image-area';
import {
  IBookParking,
  IBookSpaceFloorViewer,
  IParkingSlot,
} from "../types/bookSpace";

const BookSpaceFloorViewer = (props: IBookSpaceFloorViewer) => {

  const getArea = (coordinate : any) =>  {
    let coordinates : any = [];
    if(coordinate != undefined){          
      coordinates = coordinate.split(",").map((item: any) => {
        let cor = item.split("|");
        return { x: cor[0], y: cor[1], width: cor[2], height: cor[3], unit: "%" }
      });
    }
    return coordinates;
  }

  const DotButton = styled.div<{
    isAvailable: boolean;
    left: string;
    top: string;
  }>`
    background: ${(c) => (c.isAvailable ? "green" : "red")};
    border-radius: 50%;
    height: 15px;
    position: absolute;
    width: 15px;
    top: ${(t) => t.top};
    left: ${(l) => l.left};
    &:hover {
      background: red;
    }
  `;

  return (
    <div
      className={styles.con}
      style={{
        height: "370px",
        width: "569%",
        backgroundImage: `url(${props.imageSrc})`,
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
      }}
    >
    <AreaSelector
          unit='percentage'
          areas={getArea(props.coordinates)}
          onChange={() => props.onImageClick()}
          wrapperStyle={{
              border: '2px solid black'
          }}
          globalAreaStyle={{
              border: '3px dashed red',
              backgroundColor: 'lightgreen',
              opacity: '0.5',
              cursor: 'pointer'
          }}
      >
      <img src={props.imageSrc} alt='my image' style={{ width: '100%',cursor: 'pointer' }} onClick={() => props.onImageClick()} />
      </AreaSelector>
      {props?.floorSlots?.map((item: IParkingSlot, index: number) => {
        const isSlotAvailable =
          item.isAvailable &&
          !props.selectedSlots.some(
            (slot: IBookParking) =>
              slot.slotId === Number(item.id.split("-")[1])
          );
        return (
          <DotButton
            onClick={() => isSlotAvailable && props.onSlotClick(item.id)}
            isAvailable={isSlotAvailable}
            key={index}
            left={item.left}
            top={item.top}
          ></DotButton>
        );
      })}
    </div>
  );
};
export default BookSpaceFloorViewer;
