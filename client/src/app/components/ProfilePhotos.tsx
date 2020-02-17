import React, { useContext, useState } from "react";
import { Tab, Header, Card, Image, Button, Grid } from "semantic-ui-react";
import { RootStoreContext } from "../stores/rootStore";
import PhotoUploader from "../common/photoUploader/PhotoUploader";
import { observer } from "mobx-react-lite";

const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    isCurrentUser,
    uploadPhoto,
    uploadingPhoto,
    setMainPhoto,
    loading,
    deletePhoto
  } = rootStore.profileStore;
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState<string | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<string | undefined>(
    undefined
  );

  const handleUploadImage = (photo: Blob) => {
    uploadPhoto(photo).then(() => setAddPhotoMode(false));
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={addPhotoMode ? "Cancel" : "Add"}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploader
              uploadPhoto={handleUploadImage}
              loading={uploadingPhoto}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile!.photos.map(photo => (
                <Card key={photo.id}>
                  <Image src={photo.url} />
                  {isCurrentUser && (
                    <Button.Group fluid widths={2}>
                      <Button
                        name={photo.id}
                        basic
                        positive
                        content="Main"
                        onClick={async e => {
                          setTarget(e.currentTarget.name);
                          await setMainPhoto(photo);
                          setTarget(undefined);
                        }}
                        loading={loading && target === photo.id}
                        disabled={photo.isMain}
                      />
                      <Button
                        name={photo.id}
                        basic
                        negative
                        icon="trash"
                        onClick={async e => {
                          setDeleteTarget(e.currentTarget.name);
                          await deletePhoto(photo);
                          setDeleteTarget(undefined);
                        }}
                        disabled={photo.isMain}
                        loading={loading && deleteTarget === photo.id}
                      />
                    </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
