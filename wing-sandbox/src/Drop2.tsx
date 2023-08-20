import { useRef, useState } from "react";
import { Text, Group, Button, createStyles, rem } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconCloudUpload, IconX, IconDownload } from "@tabler/icons-react";
import axios from "axios";

const useStyles = createStyles((theme) => ({
   
  header: {
  textAlign: "center",
  marginTop: rem(10),
},
wrapper: {
    position: 'relative',
    marginBottom: rem(30),
    padding: "40px",
    paddingLeft: "25%",
    paddingRight: "25%",
    height: "500px",


  },
  dropzone: {
    borderWidth: rem(1),
    paddingBottom: rem(50),
      textAlign: "center",
display: "absolute", justifyContent: "center", 
  },
  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
  },
  control: {
    position: 'absolute',
    width: rem(250),
    left: `calc(50% - ${rem(125)})`,
    bottom: rem(-20),
  },
}));

export function Drop2() {
  const { classes, theme } = useStyles();
  const openRef = useRef<() => void>(null);
  const [fileContent, setFileContent] = useState<string | undefined>(undefined);
  const handleDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://127.0.0.1:5000/upload",
        formData
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className={classes.wrapper}>
            
      <div className={classes.header}>
                <h1>Insert Business Knowledge</h1>
                
        <p>
          Attach your store's organized product inventory, prices, and
          descriptions as a .csv
        </p>
              
      </div>
            
      <Dropzone
        openRef={openRef}
        onDrop={(file) => {
          handleDrop(file);
        }}
        className={classes.dropzone}
        radius="md"
        accept={[MIME_TYPES.pdf]}
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

export default Drop2;
