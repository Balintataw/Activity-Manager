import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Icon, Header } from "semantic-ui-react";

interface IProps {
  setFiles: (files: IFileProps[]) => void;
}
interface IFileProps extends File {
  preview: any;
}

const DropZoneStyles = {
  border: "dashed 3px",
  borderColor: "#eee",
  borderRadius: "8px",
  paddingTop: "30px",
  textAlign: "center" as "center",
  height: "200px"
};

const DropzoneActiveStyles = {
  borderColor: "green"
};

const PhotoDropzone: React.FC<IProps> = ({ setFiles }) => {
  const onDrop = useCallback(
    acceptedFiles => {
      setFiles(
        acceptedFiles.map((file: File) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    },
    [setFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={
        isDragActive
          ? { ...DropZoneStyles, ...DropzoneActiveStyles }
          : DropZoneStyles
      }
    >
      <input {...getInputProps()} />
      <Icon name="upload" size="huge" />
      <Header content="Drop image here" />
    </div>
  );
};

export default PhotoDropzone;
