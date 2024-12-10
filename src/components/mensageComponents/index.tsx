import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; 
import { coldarkCold as theme } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styles from './styles.module.css';
import { varela_round } from '@/app/fonts/fonts';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

type Params = {
  text: string;
};

export default function FormattedText({ text }: Params) {
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div>
      <ReactMarkdown
        children={text}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({node, ...props}) => <h1 className={styles.title1} {...props} />,
          h2: ({node, ...props}) => <h2 className={styles.title2} {...props} />,
          h3: ({node, ...props}) => <h3 className={styles.title3} {...props} />,
          h4: ({node, ...props}) => <h4 className={styles.title4} {...props} />,
          h5: ({node, ...props}) => <h5 className={styles.title5} {...props} />,
          h6: ({node, ...props}) => <h6 className={styles.title6} {...props} />,
          table: ({node, ...props}) => ( <div className={styles.tableContainer}> <table className={styles.table} {...props} /> </div>),
          th: ({node, ...props}) => <th className={styles.th} {...props} />,
          td: ({node, ...props}) => <td className={styles.td} {...props} />,
          ul: ({node, ...props}) => <ul className={styles.ul} {...props} />,
          li: ({node, ...props}) => <li className={styles.li} {...props} />,
          sup: ({node, ...props}) => <sup className={styles.sup} {...props} />,
          sub: ({node, ...props}) => <sub className={styles.sub} {...props} />,
          code({ node, inline, className, children, ...props }) { 
            const match = /language-(\w+)/.exec(className || ''); 
              return !inline && match ? ( 
               <div className={styles.container_code}>
                 <div className={styles.container_header}>
                  <p className={`${styles.language} ${varela_round.className}`}>{match[1]}</p>

                  <button onClick={() => handleCopy(String(children).replace(/\n$/, ''))}>
                    <ContentCopyIcon style={{color:"white"}} />
                  </button>
                 </div>
                
                 <SyntaxHighlighter 
                    children={String(children).replace(/\n$/, '')} 
                    style={theme} 
                    language={match[1]} 
                    PreTag="div" 
                    className={styles.codeBlock} 
                    {...props} 
                  /> 
               </div>
                ) :  ( 
                  <code className={styles.codeLine} {...props}> {children} </code> 
              );
            }
        }}
      />
    </div>
  );
}