'use client'

import { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

import { Gemini } from '@/API/gemini';
import { varela_round } from '@/app/fonts/fonts';

import eva from '../../assets/eva.png';
import background from '../../assets/background_chat.png';

import MicNoneIcon from '@mui/icons-material/MicNone';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

import Image from 'next/image';
import FormattedText from '@/components/mensageComponents';

import VoiceSearch from '@/components/VoiceSearch';

type params = {
  key: string | undefined
}

export default function Chat({key}:params) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [waiting, setWaiting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false)
  const [currentBotMessage, setCurrentBotMessage] = useState('');
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({
        top: chatWindowRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [userInput]);

  function simulateTypingEffect(message: string) {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= message.length) {
        const partialMessage = message.slice(0, index);
        setCurrentBotMessage(partialMessage);
        index++;
      } else {
        clearInterval(typingInterval); // Para a animação
        setLoading(false); // Habilita o envio de mensagem após a animação
      }
    }, 10);
  }

  function adjustTextareaHeight() {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto'; // Reseta a altura para recalcular
      const maxHeight = parseInt(window.getComputedStyle(textarea).lineHeight) * 5; // 5 linhas
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
    }
  }

  const handleVoiceConfirm = (text: string) => {
    setIsListening(false);
    setUserInput(text);
    Enviar(text); 
  };
  
  async function Enviar(input?: string) {
    const message = input ?? userInput;
    console.log("user: ", message);
  
    if (!message.trim() || loading) return;
  
    setLoading(true);
  
    const userMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);
  
    setWaiting(true);
    setUserInput(''); 
  
    const context = messages.map((msg) => `${msg.content}`).join('\n') + `\nuser: ${message}`;
    const result = await Gemini({ prompt: context, key });
  
    const botMessage = { role: 'bot', content: result };
    setMessages((prev) => [...prev, botMessage]);
  
    setCurrentBotMessage('');
    simulateTypingEffect(result);
  
    setWaiting(false);
  }
  
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && userInput !== '' && !loading) {
      event.preventDefault();
      Enviar();
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.container_top}>
        <Image className={styles.image_eva} src={eva} alt="eva" />
        <h1 className={`${styles.name_eva} ${varela_round.className}`}>Eva</h1>
      </div>

      <div className={styles.container_chat}>
        <Image alt="background" className={styles.image_background} src={background} />
       
        <VoiceSearch 
           onSearch={(query: any) => console.log('Busca:', query)}
          open={isListening} 
          onConfirm={handleVoiceConfirm}
          handleClose={()=>setIsListening(false)}          
        />

				<div className={styles.container_body}>
          <div ref={chatWindowRef} className={`${styles.chatWindow} ${varela_round.className}`}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.chatBubble} ${styles[msg.role]}`}>
                {msg.role === 'bot' ? (
                  index === messages.length - 1 ? (
                    <FormattedText text={currentBotMessage} />
                  ) : (
                    <FormattedText text={msg.content} />
                  )
                ) : (
                  msg.content
                )}
              </div>
            ))}

            {waiting && (
              <div className={`${styles.chatBubble} ${styles.bot}`}>
                <div className={styles.typingIndicator}>
                  <div className={styles.circle}></div>
                  <div className={styles.circle}></div>
                  <div className={styles.circle}></div>
                </div>
              </div>
            )}
          </div>

          
          <div className={styles.inputContainer}>
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className={`${styles.inputField} ${varela_round.className}`}
              disabled={loading}
              rows={1}
              style={{
                resize: 'none',
                overflow: 'hidden',
                lineHeight: '1.5em',
              }}
            />

            <div className={styles.container_buttons}>
              <button onClick={()=>setIsListening(true)} className={styles.micButton}>
                <MicNoneIcon style={{color: 'white'}}/>
              </button>

              <button onClick={()=>Enviar()} className={styles.sendButton} disabled={loading}>
                <SendOutlinedIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
