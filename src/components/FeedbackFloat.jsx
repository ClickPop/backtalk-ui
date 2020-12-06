import React from 'react';
import { MessageSquare } from 'react-feather';

const FeedbackFloat = () => {
  return (
    <a
      href="https://backtalk.io/survey/ReG94d4J?source=backtalk"
      target="_blank"
      className="feedbackFloat"
      rel="noopener noreferrer"
    >
      Feedback <MessageSquare size={16} />
    </a>
  );
};

export { FeedbackFloat };
