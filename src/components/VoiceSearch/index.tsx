import React, { useState, useEffect } from 'react';
import { Modal } from '@mui/material';
import styles from './styles.module.css';
import { varela_round } from '@/app/fonts/fonts';
import MicNoneIcon from '@mui/icons-material/MicNone';

type Params = { 
  onSearch: (transcript: string) => void,
  onConfirm: (text: string) => void,
  open: boolean,
  handleClose: () => void
};

const VoiceSearch = ({ onSearch, onConfirm, open, handleClose }: Params) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.interimResults = false;
        recognition.continuous = false;

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setText(transcript);
          if (onSearch) onSearch(transcript);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          setError(event.error);
          setIsListening(false);
        };

        setRecognition(recognition);
      } else {
        setError('Seu navegador não suporta reconhecimento de voz.');
      }
    }
  }, [onSearch]);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      setText('');
      setError(null);
      recognition.start();
    }
  };

  return (
    <Modal
      className={`${styles.modal} ${varela_round.className}`}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styles.container_body}>
        <h1>{isListening ? 'Ouvindo...' : 'Clique e Fale'}</h1>
        <div className={styles.container_anim_mic}>
          <button
            onClick={startListening}
            disabled={isListening}
            className={isListening ? styles.button_animation : styles.button}
          >
            <MicNoneIcon
              className={isListening ? styles.mic_animation : undefined}
              fontSize="large"
            />
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          {error ? (
            <p style={{color:'rgba(0, 0, 0, 0.6)'}}>Nada reconhecido</p>
          ) : (
            <p>{text}</p>
          )}

          {text && (
            <button className={styles.confirm} onClick={() => onConfirm(text)}>
              <p>Confirmar</p>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default VoiceSearch;
