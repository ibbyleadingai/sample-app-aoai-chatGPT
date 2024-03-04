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
    const [buttonText, setButtonText] = useState('Improve Prompt');

    const updateButtonText = () => {
        if (window.innerWidth <= 350) {
            setButtonText('Improve');
        } else {
            setButtonText('Improve Prompt');
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

                { sendQuestionDisabled ? 
                    <SendRegular className={styles.questionInputSendButtonDisabled}/>
                    :
                    <img title="Send prompt" src={Send} className={styles.questionInputSendButton}/>
                }

                <button
                    title="Improve prompt"
                    className={styles.improvePromptButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleImprovePrompt()
                    }}
                    disabled={isLoadingImproved}
                >{isLoadingImproved ? "Loading prompt..." : buttonText}
                </button>
            </div>
            <div className={styles.questionInputBottomBorder} />
        </Stack>
    );
};
