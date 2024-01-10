import React, { useState } from "react";
import { Stack, TextField } from "@fluentui/react";
import { SendRegular } from "@fluentui/react-icons";
import Send from "../../assets/Send.svg";
import styles from "./QuestionInput.module.css";

interface Props {
  onSend: (question: string, id?: string) => void;
  disabled: boolean;
  placeholder?: string;
  clearOnSend?: boolean;
  conversationId?: string;
}

const ProposalBuilderInput = ({ onSend, disabled, placeholder, clearOnSend, conversationId }: Props) => {
    const [proposalText, setProposalText] = useState("");
  
    const sendProposal = () => {
      if (disabled || !proposalText.trim()) {
        return;
      }
  
      if (conversationId) {
        onSend(proposalText, conversationId);
      } else {
        onSend(proposalText);
      }
  
      if (clearOnSend) {
        setProposalText("");
      }
    };
  
    const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        sendProposal();
      }
    };
  
    const onProposalTextChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setProposalText(newValue || "");
    };
  
    const sendProposalDisabled = disabled || !proposalText.trim();
  
    return (
      <Stack horizontal className={styles.questionInputContainer}>
        <TextField
          className={styles.questionInputTextArea}
          placeholder="Enter proposal details"
          multiline
          resizable={false}
          borderless
          value={proposalText}
          onChange={onProposalTextChange}
          onKeyDown={onEnterPress}
        />
  
        <div
          className={styles.questionInputSendButtonContainer}
          role="button"
          tabIndex={0}
          aria-label="Send proposal button"
          onClick={sendProposal}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? sendProposal() : null)}
        >
          {sendProposalDisabled ? (
            <SendRegular className={styles.questionInputSendButtonDisabled} />
          ) : (
            <img title="Send proposal" src={Send} className={styles.questionInputSendButton} />
          )}
        </div>
        <div className={styles.questionInputBottomBorder} />
      </Stack>
    );
  };
  
  export default ProposalBuilderInput;