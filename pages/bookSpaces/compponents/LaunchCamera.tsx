import React, { useState, useEffect, useRef } from 'react';
import Modal from "../../../components/lib/modalPopup/components/Modal";
import ModalBody from "../../../components/lib/modalPopup/components/ModalBody";
import ModalHeader from "../../../components/lib/modalPopup/components/ModalHeader";
import ModalFooter from "../../../components/lib/modalPopup/components/ModalFooter";

interface PhotoUploadComponentProps {
    onCapture: (capturedImage: string) => void;
    onCancel: () => void;
}

const LaunchCamera: React.FC<PhotoUploadComponentProps> = ({ onCapture,onCancel }) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                setStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((error) => console.error('Error accessing camera:', error));
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const handleCapture = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const capturedImage = canvas.toDataURL('image/png');
                onCapture(capturedImage);
            }
        }
    };

    const handleCancel = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
            onCancel();
        }
    };

    return (

        <div>
            <h2 className="heading4 font-bold">{`Upload Visitor Photo`}</h2>
            <div className="flex flex-col items-center justify-center">
                <video
                    ref={videoRef}
                    autoPlay
                    className="object-cover"
                />
                <div className="mt-4">
                    <button
                        onClick={handleCapture}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                        Capture
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LaunchCamera;
