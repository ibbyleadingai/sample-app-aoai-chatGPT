import { useState, useEffect, useContext } from "react";
import { Stack, TextField } from "@fluentui/react";
import { SendRegular } from "@fluentui/react-icons";
import Send from "../../assets/Send.svg";
import styles from "./QuestionInput.module.css";
import { handleImprovePromptApi } from "../../api";
import { AppStateContext } from "../../state/AppProvider";

interface Props {
    onSend: (question: string, id?: string) => void;
    disabled: boolean;
    placeholder?: string;
    clearOnSend?: boolean;
    conversationId?: string;
}

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend, conversationId }: Props) => {
    const appStateContext = useContext(AppStateContext)
    const ui = appStateContext?.state.frontendSettings?.ui;
    const [question, setQuestion] = useState<string>("")
    const [link, setLink] = useState<string>('')
    const [isLoadingImproved, setIsLoadingImproved] = useState<boolean>(false)
    const [isScraped, setIsScraped] = useState<boolean>(false)
    const [selectedFile, setSelectedFile] = useState<string | undefined>("");
    const [isLoadingDocument, setIsLoadingDocument] = useState<boolean>(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        handleUpload(file);  // Call handleUpload directly with the file
        setSelectedFile(file?.name)
    };
    
    const handleUpload = async (file: File | null) => {
        if (file) {  // Use the file parameter that is passed to the function
            // console.log("selected file", file);
            setIsLoadingDocument(true)
            const formData = new FormData();
            formData.append('file', file);  // Use the file parameter
    
            // for (let [key, value] of formData.entries()) {
            //     console.log(`${key}: ${value}`);
            // }
            try {
                const response = await fetch('/upload-pdf', {
                    method: 'POST',
                    body: formData,  
                });
                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }
                const data = await response.json();
                setQuestion(data.text);  
                setIsLoadingDocument(false)
            } catch (error) {
                console.error('Error uploading file:', error);
                setIsLoadingDocument(false)
                alert("Error uploading file. Please ensure the file type is a PDF.")
            }
        } else {
            console.error('No file selected');
        }
    };

    const handleImprovePrompt = async () => {
        try {
          setIsLoadingImproved(true);
          const improvedPrompt = await handleImprovePromptApi(question);
          setQuestion(improvedPrompt);
        } finally {
          setIsLoadingImproved(false);
        }
    };

    const sendQuestion = () => {
        if (disabled || !question.trim()) {
            return;
        }

        if(conversationId){
            onSend(question, conversationId);
        }else{
            onSend(question);
        }

        if (clearOnSend) {
            setQuestion("");
        }
    };

    const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
        if (ev.key === "Enter" && !ev.shiftKey && !(ev.nativeEvent?.isComposing === true)) {
            ev.preventDefault();
            sendQuestion();
        }
    };

    const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setQuestion(newValue || "");
    };

    const sendQuestionDisabled = disabled || !question.trim();

    const scrapeLink = async () => {
        // Send link to server for scraping
        try {
          const response = await fetch('/scrape', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ link }),
          })
    
          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error)
          }
    
          const data = await response.json()
          setQuestion(data.text)
          setIsScraped(true)
          setLink("")

        //   sendQuestion()
        } catch (error: any) {
            let errorMessage

            if (error.message && error.message.includes("Name or service not known")) {
                errorMessage = "The provided link is invalid. Please check the link and try again.";
            } else{
                errorMessage = error.message
            }

            alert(errorMessage);
        }
      };

      useEffect(() => {
        if (isScraped){
            setIsScraped(false)
            sendQuestion()
        }
      }, [question, isScraped])

    return (
        <Stack horizontal className={styles.questionInputContainer}>
            <TextField
                styles={{
                    fieldGroup: {
                      background: 'transparent',
                      // Other styles you want to apply to the fieldGroup
                    },
                    field: {
                      height: '10px', // Set height to auto if it's multiline and you want it to shrink
                      minHeight: '32px', // Or any other value that fits a single line of text
                      // Other styles you want to apply to the field
                    }
                  }}
                className={styles.questionInputTextArea}
                placeholder={placeholder}
                multiline
                resizable={false}
                borderless
                value={question}
                onChange={onQuestionChange}
                onKeyDown={onEnterPress}
            />
            <div className={styles.questionInputSendButtonContainer} 
                role="button" 
                tabIndex={0}
                aria-label="Ask question button"
                onClick={sendQuestion}
                onKeyDown={e => e.key === "Enter" || e.key === " " ? sendQuestion() : null}
            >
                { sendQuestionDisabled ? 
                    <SendRegular className={styles.questionInputSendButtonDisabled}/>
                    :
                    <img src={Send} className={styles.questionInputSendButton}/>
                }
                <button
                    title="Improve prompt"
                    className={styles.improvePromptButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleImprovePrompt()
                    }}
                    disabled={isLoadingImproved}
                >{isLoadingImproved ? "Loading prompt..." : "Improve prompt"}
                </button>
            </div>
            {/* <div className={styles.questionInputBottomBorder} /> */}
            {ui?.show_web_scrape && <div className={styles.webScrapeContainer}>
            <input
                type="text"
                className={styles.linkInput}
                placeholder="Enter a valid link..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
            />
            <button className={styles.linkBtn} onClick={scrapeLink}>Web Scrape</button>
            </div>}
            {ui?.show_upload_button && <div className={styles.documentUploadContainer}>
                <div className={styles.innerdocumentUploadContainer}>
                    <label htmlFor="upload-btn" className={styles.customUploadButton}>
                        {isLoadingDocument ? "Loading document..." : "Choose PDF File"}
                    </label>
                    <input
                    id="upload-btn"
                    className={styles.hiddenUploadInput}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    />
                    {selectedFile && <div style={{ 
                        color: '#fff', 
                        fontSize: '14px',
                        // Add more styles as needed
                    }}>{selectedFile}</div>}
                </div>
            </div>}
        </Stack>
    );
};
