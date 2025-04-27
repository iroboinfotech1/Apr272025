import Modal from "../../lib/modalPopup/components/Modal";
import ModalBody from "../../lib/modalPopup/components/ModalBody";
import ModalHeader from "../../lib/modalPopup/components/ModalHeader";
import ModalFooter from "../../lib/modalPopup/components/ModalFooter";


export default function TestModal(props:any) {
  return (
    <Modal>
      <ModalHeader>
        <div className="flex justify-center b-4">
          <h3 className="heading3">Add organization</h3>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="py-4">
          <label htmlFor="orgSpace">
            <input
              type="text"
              className="form-control"
              id="orgSpace"
              placeholder="Organization Name"
            />
          </label>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex">
          <button onClick={props.close} className="btn btn-primary">
            Submit
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
