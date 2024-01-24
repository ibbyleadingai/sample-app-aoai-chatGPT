import { useState, useEffect } from "react";
import { Stack, TextField } from "@fluentui/react";
import { SendRegular } from "@fluentui/react-icons";
import Send from "../../assets/Send.svg";
import Suggestions from "../../assets/Suggestions.svg"
import styles from "./QuestionInput.module.css";
import promptArr from "./promptData"
import { handleImprovePromptApi } from "../../api";

interface Props {
    onSend: (question: string, id?: string) => void;
    disabled: boolean;
    placeholder?: string;
    clearOnSend?: boolean;
    conversationId?: string;
}

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend, conversationId }: Props) => {
    const [question, setQuestion] = useState<string>("");
    const [isLoadingImproved, setIsLoadingImproved] = useState<boolean>(false)

    const handleImprovePrompt = async () => {
        try {
          setIsLoadingImproved(true);
          const improvedPrompt = await handleImprovePromptApi(question);
          setQuestion(improvedPrompt);
        } finally {
          setIsLoadingImproved(false);
        }
      };

      const startRecognition = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
    
          let chunks: Blob[] = [];
    
          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              chunks.push(e.data);
            }
          };
    
          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: "audio/wav" });
            const formData = new FormData();
            formData.append("audio", audioBlob);
    
            const response = await fetch("http://localhost:5000/api/recognizeSpeech", {
              method: "POST",
              body: formData,
            });
    
            const result = await response.json();
            setQuestion(result.text);
    
            // Call OpenAI chat completion API with the recognized text
            const openaiResponse = await fetch("http://localhost:5000/api/chatCompletion", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ speechText: result.text }),
            });
    
            const openaiResult = await openaiResponse.json();
            console.log(openaiResult);
          };
    
          mediaRecorder.start();
          setTimeout(() => {
            mediaRecorder.stop();
          }, 5000); // Record for 5 seconds (you can adjust as needed)
        } catch (error) {
          console.error("Error during recording:", error);
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
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            sendQuestion();
        }
    };

    const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setQuestion(newValue || "");
    };

    const sendQuestionDisabled = disabled || !question.trim();

    const onPromptClick = (prompt: string) => {
        setQuestion(prompt);
      };

    return (
        <Stack horizontal className={styles.questionInputContainer}>
            <TextField
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

                <button
                    title="Improve my prompt"
                    className={styles.improvePromptButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleImprovePrompt()
                    }}
                    disabled={isLoadingImproved}
                >{isLoadingImproved ? "Loading prompt..." : "Improve my prompt"}
                </button>

                <button onClick={startRecognition}>Start Recognition</button>

                { sendQuestionDisabled ? 
                    <SendRegular className={styles.questionInputSendButtonDisabled}/>
                    :
                    <img title="Send prompt" src={Send} className={styles.questionInputSendButton}/>
                }
            </div>
            <div className={styles.questionInputBottomBorder} />
        </Stack>
    );
};
