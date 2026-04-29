import { useEffect, useRef, useState } from "react";

import "./ImageUpload.css";
import Button from "./Button";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [isValid, setIsValid] = useState(false);
  const [previewFile, setPreviewFile] = useState();

  const filePickedRef = useRef();

  const imagePickerHandler = () => {
    filePickedRef.current.click();
  };

  const imageChangeHandler = (event) => {
    let uploadedFile;
    let inputFileIsValid = isValid;

    if (event.target.files && event.target.files.length === 1) {
      uploadedFile = event.target.files[0];
      setFile(uploadedFile);
      setIsValid(true);
      inputFileIsValid = true;
    } else {
      setIsValid(false);
      inputFileIsValid = false;
    }

    props.onInput(props.id, uploadedFile, inputFileIsValid);
  };

  useEffect(() => {
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = () => setPreviewFile(fileReader.result);
    fileReader.readAsDataURL(file);
  }, [file]);

  return (
    <div className="form-control">
      <input
        id={props.id}
        type="file"
        style={{ display: "none" }}
        accept=".jpg, .png, .jpeg"
        ref={filePickedRef}
        onChange={imageChangeHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewFile ? (
            <img src={previewFile} alt="Preview" />
          ) : (
            <p>Please upload an image.</p>
          )}
        </div>
        <Button type="button" onClick={imagePickerHandler}>
          Upload Image
        </Button>
      </div>

      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
