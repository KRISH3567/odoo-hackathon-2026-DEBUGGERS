import React, { useState, useEffect, useRef } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  ArrowRight,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function VoiceAssistantModal({ isOpen, onClose }) {
  const { executeVoiceCommand } = useInventory();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastResult, setLastResult] = useState(null);
  const [textInput, setTextInput] = useState('');

  const recognitionRef = useRef(null);
  const handleProcessRef = useRef(null);

  const handleProcessCommand = (commandText) => {
    if (!commandText || !commandText.trim()) return;
    const res = executeVoiceCommand(commandText.trim());
    setLastResult(res);
  };
  useEffect(() => {
    handleProcessRef.current = handleProcessCommand;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);

          if (event.results[0].isFinal && handleProcessRef.current) {
            handleProcessRef.current(currentTranscript);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setLastResult(null);
      try {
        recognitionRef.current.start();
      } catch {
        // Recognition already started
      }
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setTranscript(textInput);
    handleProcessCommand(textInput);
    setTextInput('');
  };

  const samplePrompts = [
    'Receive 50 steel rods',
    'Deliver 10 bearings to Bharat Infra',
    'Move 15 steel rods to production floor',
    'Count 45 steel rods in store',
    'Check stock of ESP32'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-container/30 text-primary-light border border-primary/20 shadow-purple-glow">
              <Sparkles className="w-5 h-5 text-primary-light" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline text-lg font-bold text-on-surface">SenseVoice Floor Terminal</h3>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  Hands-Free
                </span>
              </div>
              <p className="text-xs text-secondary font-mono">Natural Language Voice Actions • Double-Entry Auto-Execution</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Audio Waveform / Mic Orb */}
        <div className="relative py-6 bg-surface-container-low rounded-2xl border border-surface-container flex flex-col items-center justify-center gap-3 overflow-hidden shadow-inner">
          {/* Pulsing ambient rings when listening */}
          {isListening && (
            <>
              <div className="absolute w-36 h-36 rounded-full bg-primary/20 animate-ping pointer-events-none"></div>
              <div className="absolute w-28 h-28 rounded-full bg-primary/30 animate-pulse pointer-events-none"></div>
            </>
          )}

          <button
            onClick={toggleListening}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
              isListening
                ? 'bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.6)] scale-110'
                : 'bg-primary text-white hover:bg-primary-hover shadow-purple-glow active:scale-95'
            }`}
            title={isListening ? 'Click to stop listening' : 'Click to start voice command'}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 animate-pulse" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>

          <div className="flex flex-col items-center gap-1 z-10">
            <span className="text-xs font-bold text-on-surface">
              {isListening ? 'Listening to your command...' : 'Tap Mic or Type Below'}
            </span>
            <span className="text-[11px] text-secondary font-mono">
              {isListening ? 'Speak naturally (e.g. "Receive 50 steel rods")' : 'Supports Inbound, Deliveries, Transfers & Stock Checks'}
            </span>
          </div>

          {/* Real-time speech transcript feedback */}
          {transcript && (
            <div className="w-[90%] p-3 rounded-xl bg-surface-container text-center font-mono text-xs text-on-surface border border-surface-container mt-1">
              "{transcript}"
            </div>
          )}
        </div>

        {/* Real-Time Parsed Result Card */}
        {lastResult && (
          <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
            lastResult.success
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            <div className="flex items-center gap-2">
              {lastResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span className="text-xs font-bold font-sans">
                {lastResult.success ? 'Voice Command Executed Successfully' : 'Voice Command Unrecognized'}
              </span>
            </div>
            <p className="text-xs text-on-surface font-medium leading-relaxed pl-6">
              {lastResult.message}
            </p>
            {lastResult.parsed && lastResult.parsed.product && (
              <div className="flex items-center gap-2 text-[10px] font-mono text-secondary pl-6 pt-1">
                <span>SKU: {lastResult.parsed.product.sku}</span>
                <span>•</span>
                <span>Action: {lastResult.parsed.intent.toUpperCase()}</span>
                {lastResult.parsed.quantity && (
                  <>
                    <span>•</span>
                    <span>Qty: {lastResult.parsed.quantity} {lastResult.parsed.product.uom}</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Text Input Fallback (Works everywhere, even without microphone) */}
        <form onSubmit={handleTextSubmit} className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Or type warehouse command (e.g. 'Receive 50 steel rods')..."
            className="flex-1 h-10 px-3 bg-surface-container-low text-xs rounded-xl border border-surface-container font-mono text-on-surface outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-4 h-10 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-purple-glow flex items-center gap-1.5"
          >
            <span>Run</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* 1-Click Fast Prompt Suggestions */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-[10px] font-mono uppercase text-secondary font-bold flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-secondary" />
            Try Saying / Clicking:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setTranscript(prompt);
                  handleProcessCommand(prompt);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-left text-[11px] text-on-surface transition-colors flex items-center justify-between border border-surface-container group"
              >
                <span className="truncate">"{prompt}"</span>
                <ArrowRight className="w-3 h-3 text-secondary group-hover:text-primary transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
