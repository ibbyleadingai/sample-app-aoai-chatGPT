import { useState } from "react";
import { Stack, TextField } from "@fluentui/react";
import { SendRegular } from "@fluentui/react-icons";
import Send from "../../assets/Send.svg";
import Suggestions from "../../assets/Suggestions.svg"
import styles from "./QuestionInput.module.css";
import promptArr from "./promptData"

interface Props {
    onSend: (question: string, id?: string) => void;
    disabled: boolean;
    placeholder?: string;
    clearOnSend?: boolean;
    conversationId?: string;
}

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend, conversationId }: Props) => {
    const [question, setQuestion] = useState<string>("");
    const [isSuggestionShown, setIsSuggestionShown] = useState<boolean>(false)
    const [improvedPrompt, setImprovedPrompt] = useState("");

    const getPrompt = (count:number) => {
        const promptElements = [];
        const shuffledPrompts = [...promptArr].sort(() => Math.random() - 0.5);

        for (let i = 0; i < count; i++){
            promptElements.push(<li className={styles.prompts} onClick={() => onPromptClick(shuffledPrompts[i])}>{shuffledPrompts[i]}</li>) //onclick?
        }
        return promptElements
    }

    const handleImprovePrompt = async () => {
        try {
          // Make a POST request to the Flask API using fetch
          const response = await fetch("/improve-prompt", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_input: question }),
          });
    
          // Check if the request was successful (status code 200)
          if (response.ok) {
            const data = await response.json();
            // Update the state with the improved prompt
            setImprovedPrompt(data.improved_prompt);
          } else {
            // Handle error cases
            console.error("Error improving prompt:", response.status, response.statusText);
          }
        } catch (error) {
          console.error("Error improving prompt:", error);
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
        setIsSuggestionShown(false);
    };

    const sendQuestionDisabled = disabled || !question.trim();

    const onPromptClick = (prompt: string) => {
        setQuestion(prompt);
        setIsSuggestionShown(false);
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

            <div className={`${styles.displaySuggestions} ${isSuggestionShown ? styles.show : ""}`}>
                <ul className={styles.listPrompt}>{getPrompt(3)}</ul>
            </div>

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
                >Improve my prompt
                </button>
                
                <img title="Display prompt suggestions" src={Suggestions} 
                className={styles.questionInputSendButton} 
                onClick={(e) => {
                    e.stopPropagation();//this onclick won't trigger the parent divs onclick
                    setIsSuggestionShown(prevState => !prevState)}
                }/>

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
