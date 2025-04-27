import React, { useState } from "react";
//import Modal from "../../../../lib/modalPopup/components/Modal";
import ModalHeader from "../../../../components/lib/modalPopup/components/ModalHeader";
import ModalBody from "../../../../components/lib/modalPopup/components/ModalBody";
import ModalFooter from "../../../../components/lib/modalPopup/components/ModalFooter";
import Modal from "../../../../components/lib/modalPopup/components/Modal";

interface ColorPaletteProps {
  onColorSelect: (color: string) => void; // Callback to pass the selected color to the parent
}


// Color data: Names and corresponding hex values
const colorPalette1 = [
  { name: "Red", hex: "#FF0000" },
  { name: "Green", hex: "#008000" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Purple", hex: "#800080" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Gray", hex: "#808080" },
];

const ColorPalette: React.FC<ColorPaletteProps> = ({ onColorSelect }) => {
  const [selectedColor, setSelectedColor] = useState<string>("");

  const handleColorClick = (hex: string) => {
    setSelectedColor(hex);
    onColorSelect(hex); // Pass the selected color to the parent
  };
  return (
    <Modal>
      <ModalHeader></ModalHeader>
      <ModalBody>
      <div style={{ padding: "20px" }}>
      {/* <h2>Choose a Color</h2> */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {colorPalette1.map((color) => (
          <div
            key={color.hex}
            onClick={() => handleColorClick(color.hex)}
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: color.hex,
              border: selectedColor === color.hex ? "3px solid black" : "1px solid #ccc",
              cursor: "pointer",
            }}
            title={color.name}
          />
        ))}
      </div>
      {selectedColor && (
        <div style={{ marginTop: "20px", fontSize: "16px" }}>
          <strong>Selected Color Hex:</strong> {selectedColor}
        </div>
      )}
    </div>
    </ModalBody>
    <ModalFooter>
    </ModalFooter> 
    </Modal>
  );
};

export default ColorPalette;
