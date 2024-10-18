import imageImports from '../../imageImports'; //Where all the logo and other images are

export const getPrompts = (ui: any) => [
    {
      headerText: ui?.prompt1_header_text || '',
      suggestionText: ui?.prompt1_suggestion_text || '',
      message: ui?.prompt1_suggestion_message || 'Hello (prompt 1)',
      imageIcon: imageImports.policyAdvisorIcon
    },
    {
      headerText: ui?.prompt2_header_text || '',
      suggestionText: ui?.prompt2_suggestion_text || '',
      message: ui?.prompt2_suggestion_message || 'What can you do? (prompt 2)',
      imageIcon: imageImports.commsProfessional
    },
    {
      headerText: ui?.prompt3_header_text || '',
      suggestionText: ui?.prompt3_suggestion_text || '',
      message: ui?.prompt3_suggestion_message || 'What is RAG? (Prompt 3)',
      imageIcon: imageImports.schoolImprovementPlanIcon
    },
    {
      headerText: ui?.prompt4_header_text || '',
      suggestionText: ui?.prompt4_suggestion_text || '',
      message: ui?.prompt4_suggestion_message || 'Tell me a joke (prompt 4)',
      imageIcon: imageImports.bidWriterIcon
    },
    {
      headerText: ui?.prompt5_header_text || '',
      suggestionText: ui?.prompt5_suggestion_text || '',
      message: ui?.prompt5_suggestion_message || "What's the weather? (prompt 5)",
      imageIcon: imageImports.sendPlannerIcon
    },
    {
      headerText: ui?.prompt6_header_text || '',
      suggestionText: ui?.prompt6_suggestion_text || '',
      message: ui?.prompt6_suggestion_message || 'Give me a quote (prompt 6)',
      imageIcon: imageImports.reportWriterIcon
    },
    {
      headerText: ui?.prompt7_header_text || '',
      suggestionText: ui?.prompt7_suggestion_text || '',
      message: ui?.prompt7_suggestion_message || 'What is ML (prompt 7)?',
      imageIcon: imageImports.inspectionToolKitIcon
    },
    {
      headerText: ui?.prompt8_header_text || '',
      suggestionText: ui?.prompt8_suggestion_text || '',
      message: ui?.prompt8_suggestion_message || 'What is ML (prompt 8)?',
      imageIcon: imageImports.dataAnalysisIcon
    },
    {
      headerText: ui?.prompt9_header_text || '',
      suggestionText: ui?.prompt9_suggestion_text || '',
      message: ui?.prompt9_suggestion_message || 'What is ML (prompt 9)?',
      imageIcon: imageImports.inspectionToolKitIcon,
      isSpecial: ui?.prompt_button_onclick,
      specialLink: ui?.prompt_button_onclick_link
    },
    {
      headerText: ui?.prompt10_header_text || '',
      suggestionText: ui?.prompt10_suggestion_text || '',
      message: ui?.prompt10_suggestion_message || 'What is ML (prompt 10)?',
      imageIcon: imageImports.policyAdvisorIcon
    },
    {
      headerText: ui?.prompt11_header_text || '',
      suggestionText: ui?.prompt11_suggestion_text || '',
      message: ui?.prompt11_suggestion_message || 'What is ML (prompt 11)?',
      imageIcon: imageImports.schoolImprovementPlanIcon
    },
    {
      headerText: ui?.prompt12_header_text || '',
      suggestionText: ui?.prompt12_suggestion_text || '',
      message: ui?.prompt12_suggestion_message || 'What is ML (prompt 12)?',
      imageIcon: imageImports.bidWriterIcon
    }
  ];