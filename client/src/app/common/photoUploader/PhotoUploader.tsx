import React, { Fragment, useState, useEffect } from "react";
import { Header, Grid, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import PhotoDropzone from "./PhotoDropzone";
import PhotoCropper from "./PhotoCropper";

interface IFileProps extends File {
  preview: any;
}
interface IProps {
  loading: boolean;
  uploadPhoto: (file: Blob) => void;
}

const PhotoUploader: React.FC<IProps> = ({ loading, uploadPhoto }) => {
  const [files, setFiles] = useState<IFileProps[]>([]);
  const [image, setImage] = useState<Blob | null>(null);

  useEffect(() => () => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
  });

  return (
    <Fragment>
      <Grid>
        <Grid.Column width={4}>
          <Header color="teal" sub content="Step 1 - Add Photo" />
          <PhotoDropzone setFiles={setFiles} />
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 2 - Resize image" />
          {files.length > 0 && (
            <PhotoCropper imagePreview={files[0].preview} setImage={setImage} />
          )}
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 3 - Preview & Upload" />
          {files.length > 0 && (
            <>
              <div
                className="img-preview"
                style={{ minHeight: "200px", overflow: "hidden" }}
              />
              <Button.Group widths={2}>
                <Button
                  positive
                  icon="check"
                  loading={loading}
                  onClick={() => uploadPhoto(image!)}
                />
                <Button
                  icon="close"
                  disabled={loading}
                  onClick={() => setFiles([])}
                />
              </Button.Group>
            </>
          )}
        </Grid.Column>
      </Grid>
    </Fragment>
  );
};

export default observer(PhotoUploader);
