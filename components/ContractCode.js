import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const ContractCode = ({ code }) => {
  return (
    <SyntaxHighlighter language="solidity">
      {code}
    </SyntaxHighlighter>
  );
};

export default ContractCode;
