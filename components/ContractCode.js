import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vsDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ContractCode = ({ code }) => {
  return (
    <SyntaxHighlighter language="solidity" style={vsDark}>
      {code}
    </SyntaxHighlighter>
  );
};

export default ContractCode;
