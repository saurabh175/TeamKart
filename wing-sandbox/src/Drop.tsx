import { useRef, useState } from "react";
import { Text, Group, Button, createStyles, rem } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconCloudUpload, IconX, IconDownload, IconCheck } from "@tabler/icons-react";
import axios from "axios";


const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    marginBottom: rem(20),
  },
  header: {
    marginBottom: rem(10),
    textAlign: "center", // Center the text
  },
  paragraph: {
    textAlign: "center", // Center the text
  },
  dropzone: {
    borderWidth: rem(1),
    paddingBottom: rem(50),
  },
  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },
  control: {
    position: "absolute",
    width: rem(250),
    left: `calc(50% - ${rem(125)})`,
    bottom: rem(-20),
  },
  loadingIcon: {
    animation: `spin 1s infinite linear`,
  },
}));

export function Drop() {
  const { classes, theme } = useStyles();
  const openRef = useRef<() => void>(null);
  const [fileContent, setFileContent] = useState<string | undefined>(undefined);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    try {
      const formData = new FormData();
      formData.append("file", file);

      setUploadStatus("loading"); // Update the upload status to "loading"

      const response = await axios.post(
        "http://localhost:9000/upload",
        formData
      );
      console.log(response.data);

      setUploadStatus("success"); // Update the upload status to "success"
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Dropzone
                openRef={openRef}
        onDrop={(file) => {
          handleDrop(file);
        }}
        className={classes.dropzone}
        radius="md"
        accept={[MIME_TYPES.pdf, MIME_TYPES.csv]}
        maxSize={30 * 1024 ** 2}
      >
        <div style={{ pointerEvents: "none" }}>
          <Group position="center">
            <Dropzone.Accept>
              <IconDownload
                size={rem(50)}
                color={theme.colors[theme.primaryColor][6]}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={rem(50)} color={theme.colors.red[6]} stroke={1.5} />
            </Dropzone.Reject>
            {uploadStatus === "loading" ? ( // Display loading icon when upload is in progress
              <IconCloudUpload
                size={rem(50)}
                color={
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[0]
                    : theme.black
                }
                stroke={1.5}
                className={classes.loadingIcon}
              />
            ) : (
              <Dropzone.Idle>
                <IconCloudUpload
                  size={rem(50)}
                  color={
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[0]
                      : theme.black
                  }
                  stroke={1.5}
                />
              </Dropzone.Idle>
            )}
            {uploadStatus === "success" && ( // Display checkmark icon when upload is successful
              <IconCheck
                size={rem(50)}
                color={theme.colors.green[6]}
                stroke={1.5}
              />
            )}
          </Group>
          <Text ta="center" fw={700} fz="lg" mt="xl">
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            
            <Dropzone.Reject>Files more than 100 mb</Dropzone.Reject>
            <Dropzone.Idle>Upload data files</Dropzone.Idle>
            
          </Text>
          
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            Drop files here to upload. (csv, pdf, html, etc)
            
          </Text>
        </div>
      </Dropzone>
            <Button
        className={classes.control}
        size="md"
        radius="xl"
        onClick={() => openRef.current?.()}
      >
        Select files 
      </Button>
    </div>
  );
}

export default Drop;
