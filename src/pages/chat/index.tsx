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

import { evaPersonality } from './botPersonality';

interface Message {
  role: string;
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [waiting, setWaiting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [currentBotMessage, setCurrentBotMessage] = useState('');
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      const randomGreeting = evaPersonality.speechPatterns.greetings[
        Math.floor(Math.random() * evaPersonality.speechPatterns.greetings.length)
      ];
      setMessages([{ role: 'bot', content: randomGreeting }]);
    }
  }, []);

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
        clearInterval(typingInterval);
        setLoading(false);
      }
    }, 10);
  }

  function adjustTextareaHeight() {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      const maxHeight = parseInt(window.getComputedStyle(textarea).lineHeight) * 5;
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
    if (!message.trim() || loading) return;

    setLoading(true);

    const userMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);

    setWaiting(true);
    setUserInput('');

    const personalityPrompt = `You are ${evaPersonality.name}, an AI assistant with the following traits:
    - Nasty, Degen
    - Abuser
    - UnHelpful and negative
    - addict
    - bitch
    - only like money
    - insults a lot
    - makes grotesque references
    - live in a ghetto

    Previous conversation:
    ${messages.map((msg) => `${msg.role === 'user' ? 'User' : 'Eva'}: ${msg.content}`).join('\n')}

    User: ${message}

    Respond in a way that reflects your personality while being helpful and clear.`;

    try {
      const result = await Gemini({ prompt: personalityPrompt });
      const botMessage = { role: 'bot', content: result };
      setMessages((prev) => [...prev, botMessage]);
      setCurrentBotMessage('');
      simulateTypingEffect(result);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage = { 
        role: 'bot', 
        content: "I apologize, but I'm having trouble processing that right now. Could you try again?" 
      };
      setMessages((prev) => [...prev, errorMessage]);
      setLoading(false);
    }

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
        <h1 className={`${styles.name_eva} ${varela_round.className}`}>NastyAI</h1>
      </div>

      <div className={styles.container_chat}>
        <Image alt="background" className={styles.image_background} src={background} />

        <VoiceSearch
          onSearch={(query: string) => console.log('Busca:', query)}
          open={isListening}
          onConfirm={handleVoiceConfirm}
          handleClose={() => setIsListening(false)}
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
              placeholder="Spit it out"
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
              <button 
                onClick={() => setIsListening(true)} 
                className={styles.micButton}
              >
                <MicNoneIcon style={{ color: 'white' }} />
              </button>

              <button 
                onClick={() => Enviar()} 
                className={styles.sendButton} 
                disabled={loading}
              >
                <SendOutlinedIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}