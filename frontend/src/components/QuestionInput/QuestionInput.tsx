import { useState, useEffect, useRef } from "react";
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
    const [recognizedText, setRecognizedText] = useState<string>('');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
    const startSpeechRecognition = () => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
  
          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              const audioBlob = new Blob([e.data], { type: 'audio/wav' });
              sendAudioToServer(audioBlob);
            }
          };
  
          mediaRecorder.onstop = () => {
            stream.getTracks().forEach(track => track.stop());
          };
  
          mediaRecorderRef.current = mediaRecorder;
          mediaRecorder.start();
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error);
        });
    };
  
    const stopSpeechRecognition = () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  
    const sendAudioToServer = async (audioBlob: Blob) => {
      const formData = new FormData();
      formData.append('audio', audioBlob);
  
      try {
        const response = await fetch('/api/speech-recognition', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
  
        const responseData = await response.json();
        setRecognizedText(responseData.result);
      } catch (error) {
        console.error('Error sending audio to server:', error);
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

                <button onClick={startSpeechRecognition} disabled={disabled}>
                    Start Speech Recognition
                </button>

                <button onClick={stopSpeechRecognition} disabled={disabled}>
                    Stop Speech Recognition
                </button>

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
