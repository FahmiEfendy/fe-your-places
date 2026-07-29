import { useEffect, useRef, useState } from "react";

import "./ImageUpload.css";
import Button from "./Button";

const DEFAULT_ACCEPTED_TYPES = ["image/jpeg", "image/png"];
const DEFAULT_MAX_SIZE_MB = 5;

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [isValid, setIsValid] = useState(false);
  const [previewFile, setPreviewFile] = useState();
  const [fileError, setFileError] = useState("");

  const filePickedRef = useRef();

  const acceptedTypes = props.acceptedTypes || DEFAULT_ACCEPTED_TYPES;
  const maxSizeMB = props.maxSizeMB || DEFAULT_MAX_SIZE_MB;

  const imagePickerHandler = () => {
    filePickedRef.current.click();
  };

  const imageChangeHandler = (event) => {
    let uploadedFile;
    let inputFileIsValid = isValid;

    if (event.target.files && event.target.files.length === 1) {
      uploadedFile = event.target.files[0];

      if (!acceptedTypes.includes(uploadedFile.type)) {
        setFileError(`Only ${acceptedTypes.map((t) => t.split("/")[1]).join(", ")} files are allowed.`);
        setFile(undefined);
        setIsValid(false);
        props.onInput(props.id, undefined, false);
        event.target.value = "";
        return;
      }

      if (uploadedFile.size > maxSizeMB * 1024 * 1024) {
        setFileError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
        setFile(undefined);
        setIsValid(false);
        props.onInput(props.id, undefined, false);
        event.target.value = "";
        return;
      }

      setFileError("");
      setFile(uploadedFile);
      setIsValid(true);
      inputFileIsValid = true;
    } else {
      setFileError("");
      setIsValid(false);
      inputFileIsValid = false;
    }

    props.onInput(props.id, uploadedFile, inputFileIsValid);
  };

  useEffect(() => {
    if (!file) {
      if (props.initialValue && typeof props.initialValue === "string") {
        setPreviewFile(props.initialValue);
        setIsValid(true);
      }
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => setPreviewFile(fileReader.result);
    fileReader.readAsDataURL(file);
  }, [file, props.initialValue]);

  return (
    <div className="form-control">
      <input
        id={props.id}
        type="file"
        style={{ display: "none" }}
        accept={acceptedTypes.map((t) => `.${t.split("/")[1]}`).join(", ")}
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

      {!isValid && <p>{fileError || props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
