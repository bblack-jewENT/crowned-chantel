
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { getPageantAdvice } from '../services/gemini';
import { ChatMessage } from '../types';

// Helper functions for PCM Audio Encoding/Decoding
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

type PermissionStatus = 'Testing...' | 'Access Granted' | 'Access Denied' | 'Idle';

const Assistant: React.FC = () => {
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Welcome, darling! I'm your Crown Guide. How can I help you perfect your walk or prepare for your next big pageant interview?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Live Session State
  const [isLive, setIsLive] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [userTranscript, setUserTranscript] = useState('');
  const [micLevel, setMicLevel] = useState(0);
  
  // Tester Status States
  const [micStatus, setMicStatus] = useState<PermissionStatus>('Idle');
  const [camStatus, setCamStatus] = useState<PermissionStatus>('Idle');

  // Live Session Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const testVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const testAudioCanvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const testAudioContextRef = useRef<AudioContext | null>(null);
  const streamsRef = useRef<{ mic: MediaStream; camera: MediaStream } | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const frameIntervalRef = useRef<number | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    const advice = await getPageantAdvice(userMsg);
    setMessages(prev => [...prev, { role: 'assistant', content: advice }]);
    setIsLoading(false);
  };

  const stopTesting = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamsRef.current?.mic.getTracks().forEach(t => t.stop());
    streamsRef.current?.camera.getTracks().forEach(t => t.stop());
    if (testAudioContextRef.current) testAudioContextRef.current.close();
    setIsTesting(false);
    setMicLevel(0);
    setMicStatus('Idle');
    setCamStatus('Idle');
  };

  const startTesting = async () => {
    try {
      setIsTesting(true);
      setMicStatus('Testing...');
      setCamStatus('Testing...');

      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(e => {
        setMicStatus('Access Denied');
        throw e;
      });
      setMicStatus('Access Granted');

      const camStream = await navigator.mediaDevices.getUserMedia({ video: true }).catch(e => {
        setCamStatus('Access Denied');
        throw e;
      });
      setCamStatus('Access Granted');

      streamsRef.current = { mic: micStream, camera: camStream };

      // Audio Testing Logic with Loopback
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      testAudioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(micStream);
      
      // Loopback: so the user can hear themselves
      const loopbackGain = audioCtx.createGain();
      loopbackGain.gain.value = 0.5; // Moderate volume to avoid feedback
      source.connect(loopbackGain);
      loopbackGain.connect(audioCtx.destination);

      const analyzer = audioCtx.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);
      analyzerRef.current = analyzer;

      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const drawWaveform = () => {
        if (!testAudioCanvasRef.current) return;
        const canvas = testAudioCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        analyzer.getByteFrequencyData(dataArray);

        // Calculate average for simple level bar
        let values = 0;
        for (let i = 0; i < bufferLength; i++) {
          values += dataArray[i];
        }
        setMicLevel(values / bufferLength);

        // Draw spectrum/waveform
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2;
          ctx.fillStyle = `rgb(191, 149, 63)`; // Gold theme
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }

        rafRef.current = requestAnimationFrame(drawWaveform);
      };
      drawWaveform();

      // Video Testing Logic
      if (testVideoRef.current) {
        testVideoRef.current.srcObject = camStream;
      }
    } catch (err) {
      console.error("Test failed:", err);
      // Statuses are handled in the catch blocks above for specific devices
    }
  };

  const stopLiveSession = () => {
    if (frameIntervalRef.current) window.clearInterval(frameIntervalRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (sessionRef.current) sessionRef.current.close();
    
    streamsRef.current?.mic.getTracks().forEach(t => t.stop());
    streamsRef.current?.camera.getTracks().forEach(t => t.stop());
    
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();

    if (audioContextRef.current) {
      audioContextRef.current.input.close();
      audioContextRef.current.output.close();
    }
    
    if (testAudioContextRef.current) testAudioContextRef.current.close();

    setIsLive(false);
    setIsConnecting(false);
    setIsTesting(false);
    setLiveTranscript('');
    setUserTranscript('');
    setMicLevel(0);
    setMicStatus('Idle');
    setCamStatus('Idle');
  };

  const proceedToLive = async () => {
    if (!streamsRef.current) return;
    
    try {
      setIsConnecting(true);
      // Clean up tester audio context loopback before going live
      if (testAudioContextRef.current) {
        testAudioContextRef.current.close();
      }
      
      const micStream = streamsRef.current.mic;
      const camStream = streamsRef.current.camera;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = { input: inputCtx, output: outputCtx };

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsLive(true);
            setIsConnecting(false);
            setIsTesting(false);
            
            if (videoRef.current) {
              videoRef.current.srcObject = camStream;
            }

            // 1. Stream Microphone
            const source = inputCtx.createMediaStreamSource(micStream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);

            // 2. Stream Camera Frames
            frameIntervalRef.current = window.setInterval(() => {
              if (videoRef.current && canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                  canvasRef.current.width = videoRef.current.videoWidth || 640;
                  canvasRef.current.height = videoRef.current.videoHeight || 480;
                  ctx.drawImage(videoRef.current, 0, 0);
                  canvasRef.current.toBlob((blob) => {
                    if (blob) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64 = (reader.result as string).split(',')[1];
                        sessionPromise.then(s => s.sendRealtimeInput({
                          media: { data: base64, mimeType: 'image/jpeg' }
                        }));
                      };
                      reader.readAsDataURL(blob);
                    }
                  }, 'image/jpeg', 0.5);
                }
              }
            }, 1000);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputCtx) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            if (message.serverContent?.outputTranscription) {
              setLiveTranscript(prev => prev + message.serverContent!.outputTranscription!.text);
            }
            if (message.serverContent?.inputTranscription) {
              setUserTranscript(prev => prev + message.serverContent!.inputTranscription!.text);
            }
            if (message.serverContent?.turnComplete) {
              setLiveTranscript('');
              setUserTranscript('');
            }
          },
          onerror: (e) => {
            console.error("Live Error:", e);
            stopLiveSession();
          },
          onclose: () => {
            stopLiveSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: "You are Chantel, the world-class pageant queen. You are currently in a LIVE video coaching session with a student. Be incredibly elegant, use pageant terminology, and be encouraging. You see them through their camera. React naturally.",
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error("Live session proceed error:", err);
      setIsConnecting(false);
      alert("Failed to connect. Please refresh and try again.");
    }
  };

  const bothAccessGranted = micStatus === 'Access Granted' && camStatus === 'Access Granted';

  return (
    <section id="assistant" className="py-24 px-4 md:px-8 bg-black relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-amber-400 text-sm tracking-[0.4em] uppercase mb-4">Mentorship</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6">The Crown Guide</h3>
          <p className="text-gray-400 max-w-xl mx-auto">Elevate your presence with professional AI-powered guidance.</p>
        </div>

        {!isLive && !isTesting ? (
          <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px] relative">
            <div className="p-6 bg-black/50 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full gold-bg flex items-center justify-center text-black">
                  <i className="fas fa-magic"></i>
                </div>
                <div>
                  <h4 className="font-bold gold-gradient uppercase tracking-widest text-sm">AI Pageant Coach</h4>
                  <span className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Online & Ready
                  </span>
                </div>
              </div>
              <button 
                onClick={startTesting}
                className="group relative flex items-center gap-2 px-6 py-2 rounded-full border border-amber-400/30 text-amber-400 hover:bg-amber-400 hover:text-black transition-all font-bold text-xs uppercase tracking-widest"
              >
                <span>Start Video Coaching</span>
                <i className="fas fa-video"></i>
              </button>
            </div>

            <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-6 scrollbar-hide">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    m.role === 'user' 
                      ? 'bg-amber-400 text-black rounded-tr-none' 
                      : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{m.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-black/50 border-t border-white/5">
              <div className="flex gap-4">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about pageant walk, poses, or interviews..."
                  className="flex-grow bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="w-12 h-12 gold-bg text-black rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        ) : isTesting ? (
          <div className="bg-[#111] border border-amber-400/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8 h-[600px] animate-fadeIn text-center overflow-y-auto">
            <h4 className="text-2xl font-serif font-bold text-white mb-2">Backstage Preparation</h4>
            <p className="text-gray-400 text-sm mb-8">Refining your camera, voice, and presence. You can now hear yourself.</p>
            
            <div className="flex flex-col md:flex-row gap-12 items-start justify-center w-full">
              {/* Video Test */}
              <div className="space-y-4">
                <div className="relative w-64 h-80 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl mx-auto">
                  <video ref={testVideoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-75 scale-x-[-1]" />
                  <div className={`absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border border-white/10 ${
                    camStatus === 'Access Granted' ? 'text-green-400' : camStatus === 'Access Denied' ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {camStatus === 'Access Granted' ? 'Camera Live' : camStatus}
                  </div>
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">Visual Feedback</div>
              </div>

              {/* Audio Test */}
              <div className="flex flex-col items-center gap-8 w-full md:w-auto">
                <div className="w-full md:w-64 space-y-6">
                  <div className="text-center">
                    <span className={`text-[10px] uppercase tracking-[0.2em] mb-2 block ${
                      micStatus === 'Access Granted' ? 'text-green-400' : micStatus === 'Access Denied' ? 'text-red-400' : 'text-amber-400'
                    }`}>
                      Mic Status: {micStatus}
                    </span>
                    
                    {/* Level Bar */}
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-200 transition-all duration-75 rounded-full"
                        style={{ width: `${Math.min(100, micLevel * 2)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Audio Visualizer Canvas */}
                  <div className="relative w-full h-32 bg-black/40 rounded-xl border border-white/5 overflow-hidden">
                    <canvas 
                      ref={testAudioCanvasRef} 
                      width={256} 
                      height={128} 
                      className="w-full h-full"
                    />
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                       {micStatus === 'Idle' && <span className="text-[10px] text-gray-600 uppercase tracking-widest">Waiting for Audio...</span>}
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-gray-500">Self-monitoring active. Wear headphones to avoid feedback.</p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={stopTesting}
                    className="px-8 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-all text-xs uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={proceedToLive}
                    disabled={isConnecting || !bothAccessGranted}
                    className={`px-8 py-3 rounded-full font-bold transition-all text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg ${
                      bothAccessGranted 
                        ? 'gold-bg text-black hover:scale-105 shadow-gold/20' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isConnecting ? <i className="fas fa-spinner fa-spin"></i> : 'Ready for Session'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative bg-black rounded-3xl overflow-hidden border border-amber-400/20 shadow-2xl h-[600px] animate-fadeIn">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover grayscale brightness-75 scale-x-[-1]"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute inset-0 flex flex-col justify-between p-8 bg-gradient-to-b from-black/60 via-transparent to-black/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-600 animate-pulse flex items-center justify-center">
                    <i className="fas fa-circle text-[8px]"></i>
                  </div>
                  <div>
                    <h4 className="text-white font-serif text-xl">Live with Chantel</h4>
                    <span className="text-xs text-amber-400 tracking-widest uppercase">Video Coaching Session</span>
                  </div>
                </div>
                <button 
                  onClick={stopLiveSession}
                  className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all shadow-xl shadow-red-600/20"
                >
                  <i className="fas fa-phone-slash text-xl"></i>
                </button>
              </div>

              <div className="space-y-6 text-center">
                {userTranscript && (
                  <div className="mx-auto max-w-xl bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                    <p className="text-gray-300 text-sm italic">You: {userTranscript}</p>
                  </div>
                )}
                
                <div className="min-h-[60px] flex items-center justify-center">
                  {liveTranscript ? (
                    <p className="text-2xl md:text-3xl font-serif gold-gradient px-4 text-shadow-lg">
                      "{liveTranscript}"
                    </p>
                  ) : (
                    <div className="flex items-end gap-1 h-8">
                      {[1,2,3,4,5,4,3,2,1].map((h, i) => (
                        <div 
                          key={i} 
                          className="w-1 bg-amber-400 rounded-full animate-wave" 
                          style={{height: `${h * 15}%`, animationDelay: `${i * 0.1}s`}}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(2); }
        }
        .animate-wave { animation: wave 1s ease-in-out infinite; }
        .text-shadow-lg { text-shadow: 0 4px 12px rgba(0,0,0,0.8); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Assistant;
