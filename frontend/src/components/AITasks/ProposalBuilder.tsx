import React, { useState } from "react";
import { Stack, TextField } from "@fluentui/react";
import { SendRegular } from "@fluentui/react-icons";
// import Send from "../../assets/Send.svg";
// import styles from "./QuestionInput.module.css";


const ProposalBuilderInput = ({ onSend, disabled, clearOnSend, conversationId }) => {
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
  
    const onEnterPress = (ev) => {
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        sendProposal();
      }
    };
  
    const onProposalTextChange = (_, newValue) => {
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