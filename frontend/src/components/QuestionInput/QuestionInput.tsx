import { useState, useEffect, useContext } from "react";
import { FontIcon, Stack, TextField } from "@fluentui/react";
import { SendRegular, Whiteboard20Filled } from "@fluentui/react-icons";
import { useBoolean } from '@fluentui/react-hooks';
import Send from "../../assets/Send.svg";
import Suggestions from "../../assets/Suggestions.svg"
import styles from "./QuestionInput.module.css";
import { handleImprovePromptApi } from "../../api";
import React from "react";
import { ChatMessage } from '../../api'
import { AppStateContext } from '../../state/AppProvider'

interface Props {
  onSend: (question: ChatMessage['content'], id?: string) => void
  disabled: boolean
  placeholder?: string
  clearOnSend?: boolean
  conversationId?: string
  resetKey: number;
}

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend, conversationId, resetKey}: Props) => {
    const appStateContext = useContext(AppStateContext)
    const ui = appStateContext?.state.frontendSettings?.ui;
    const [question, setQuestion] = useState<string>("")
    const [link, setLink] = useState<string>("")
    const [isLoadingImproved, setIsLoadingImproved] = useState<boolean>(false)
    const [isScraped, setIsScraped] = useState<boolean>(false)
    const [textFromDocument, setTextFromDocument] = useState<boolean>(false);
    const selectedFile = appStateContext?.state.selectedFile;  // Access the selectedFile from the global state
    const [isLoadingDocument, setIsLoadingDocument] = useState<boolean>(false);
    const [buttonText, setButtonText] = useState('Improve prompt');
    const [multiline, { toggle: toggleMultiline }] = useBoolean(false);

    const updateButtonText = () => {
        if (window.innerWidth <= 480) {
            setButtonText('Improve');
        } else {
            setButtonText('Improve prompt');
        }
    }

    useEffect(() => {
        // Initial call to set the button text on component mount
        updateButtonText();
        // Event listener for window resize
        window.addEventListener('resize', updateButtonText);
        // Cleanup the event listener on component unmount
        return () => {
          window.removeEventListener('resize', updateButtonText);
        };
      }, []); // Empty dependency array ensures the effect runs only once on mount

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            handleUpload(file);  // Call handleUpload directly with the file
            appStateContext?.dispatch({ type: 'SET_SELECTED_FILE', payload: file.name });  // Dispatch the file name to the global state
        } else {
            appStateContext?.dispatch({ type: 'RESET_SELECTED_FILE' });  // Reset the selected file in the global state if no file is chosen
        }
    };
    
    const handleUpload = async (file: File | null) => {
      if (file) {
          setIsLoadingDocument(true);
          const formData = new FormData();
          formData.append('file', file);
          try {
              const response = await fetch('/upload-pdf', {
                  method: 'POST',
                  body: formData,
              });
  
              // Attempt to parse the response as JSON
              let data;
              try {
                  data = await response.json();
              } catch (parseError) {
                  // If parsing fails, handle the error
                  console.error('Error parsing response:', parseError);
                  throw new Error('Failed to parse server response');
              }
  
              if (!response.ok || data.error) {
                  throw new Error(data.error || `Server responded with status ${response.status}`);
              }
  
              setTextFromDocument(true);
              setQuestion(data.text);
          } catch (error) {
              console.error('Error uploading file:', error);
  
              // Check if the error is a custom error message
              const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred.';
              alert(errorMessage);
          } finally {
              setIsLoadingDocument(false);
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
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const OYD_ENABLED = appStateContext?.state.frontendSettings?.oyd_enabled || false;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      await convertToBase64(file);
    }
  };

  const convertToBase64 = async (file: Blob) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setBase64Image(reader.result as string);
    };

    reader.onerror = (error) => {
      console.error('Error: ', error);
    };
  };

  const sendQuestion = () => {
    if (disabled || !question.trim()) {
      return
    }

    const questionTest: ChatMessage["content"] = base64Image ? [{ type: "text", text: question }, { type: "image_url", image_url: { url: base64Image } }] : question.toString();

    if (conversationId && questionTest !== undefined) {
      onSend(questionTest, conversationId)
      setBase64Image(null)
    } else {
      onSend(questionTest)
      setBase64Image(null)
    }

    if (clearOnSend) {
      setQuestion('')
    }
  }

  const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
    if (ev.key === 'Enter' && !ev.shiftKey && !(ev.nativeEvent?.isComposing === true)) {
      ev.preventDefault()
      sendQuestion()
    }
  }

    const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const newText = newValue || ""; // Safeguard against undefined values
        setQuestion(newText); // Update the question state with the new value
    
        // Check if we need to switch between single and multiline based on the text length
        const newMultiline = newText.length > 120;
        if (newMultiline !== multiline) {
            toggleMultiline(); // Toggle multiline if there's a change in the condition
        }
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

      useEffect(() => {
        if (question && textFromDocument) {
            sendQuestion();
            setTextFromDocument(false); // Reset the flag after sending
        }
    }, [question, textFromDocument]);
    


    return (
        <Stack horizontal className={styles.questionInputContainer} style={{border: `2px solid ${ui?.text_input_border_color}`}}>
            <TextField
                styles={{
                    fieldGroup: {
                      background: 'transparent',
                      // Other styles you want to apply to the fieldGroup
                    },
                    field: {
                      minHeight: '32px', // Or any other value that fits a single line of text
                      maxHeight: '85px', // Maximum height before scrolling
                        overflowY: 'auto', // Enable vertical scrolling
                        overflowX: 'hidden', // Hide horizontal scroll
                      // Other styles you want to apply to the field
                    }
                  }}
                className={styles.questionInputTextArea}
                placeholder={placeholder}
                multiline={multiline}
                resizable={false}
                borderless
                value={question}
                onChange={onQuestionChange}
                onKeyDown={onEnterPress}
                autoAdjustHeight
                aria-required="true"
            />
      {!OYD_ENABLED && (
        <div className={styles.fileInputContainer}>
          <input
            type="file"
            id="fileInput"
            onChange={(event) => handleImageUpload(event)}
            accept="image/*"
            className={styles.fileInput}
          />
          <label htmlFor="fileInput" className={styles.fileLabel} aria-label='Upload Image'>
            <FontIcon
              className={styles.fileIcon}
              iconName={'PhotoCollection'}
              aria-label='Upload Image'
            />
          </label>
        </div>)}
      {base64Image && <img className={styles.uploadedImage} src={base64Image} alt="Uploaded Preview" />}
          <div className={styles.questionInputButtonContainer}>
          <button
                    title="Improve prompt"
                    className={styles.improvePromptButton}
                    style={{ color: ui?.improve_button_text_color, backgroundColor: ui?.improve_button_color}}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleImprovePrompt()
                    }}
                    aria-label="Improve your prompt button"
                    disabled={isLoadingImproved}
                >{isLoadingImproved ? "Loading prompt..." : buttonText}
              </button>

            <div className={styles.questionInputSendButtonContainer} 
                role="button" 
                tabIndex={0}
                aria-label="Ask question button"
                aria-disabled={sendQuestionDisabled}
                onClick={sendQuestion}
                onKeyDown={e => e.key === "Enter" || e.key === " " ? sendQuestion() : null}
            >
                { sendQuestionDisabled ? 
                    <SendRegular className={styles.questionInputSendButtonDisabled}/>
                    :
                    <img title="Send prompt" src={Send} className={styles.questionInputSendButton}/>
                }
            </div>
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
            <button className={styles.linkBtn} onClick={scrapeLink} aria-label="Web scrape a website button">Web Scrape</button>
            </div>}
            {ui?.show_upload_button && <div className={styles.documentUploadContainer}>
                <div className={styles.innerdocumentUploadContainer}>
                    <label htmlFor="upload-btn" className={styles.customUploadButton}>
                        {isLoadingDocument ? "Loading document..." : "Choose PDF File"}
                    </label>
                    <input
                    id="upload-btn"
                    className={styles.hiddenUploadInput}
                    aria-label="Upload a PDF button"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    key={resetKey}  // Use the key to force a re-render
                    />
                    {selectedFile && <div style={{ 
                        color: ui?.chat_text_color, 
                        fontSize: '14px',
                        // Add more styles as needed
                    }}>{selectedFile}</div>}
                </div>
            </div>}
            <p style={{color: ui?.chat_text_color}} className={styles.additionalText}>
              {ui?.disclaimer_text} 
              {ui?.disclaimer_text && <a href={ui?.disclaimer_text_link} target="_blank">here</a>}
            </p>
        </Stack>
    );
};
