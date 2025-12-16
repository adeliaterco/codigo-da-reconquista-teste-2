import { useState, useEffect, useRef } from 'react';
import { tracking } from '../utils/tracking';
import { storage } from '../utils/storage';
import { playKeySound, getHotmartUrl } from '../utils/animations';
import { QuizAnswer } from '../types/quiz';
import { ga4Tracking } from '../utils/ga4Tracking';

import { 
  getTitle, 
  getLoadingMessage, 
  getCopy, 
  getVentana72Copy,
  getVideoIntroText,
  getVideoOutroText,
  getOfferTitle,
  getFeatures,
  getFeaturesExtraText,
  getCTA,
  getOfferSubtitle,
  getPreCTAText,
  getObjetionHandling,
  getFinalCTAText,
  getFaseText,
  getRevealOfferButtonText,
  getRevealOfferTitle,
  getRevealOfferSubtitle,
  getSocialProofText,
  getSocialProofDescription,
  getOfferUnlockedTitle
} from '../utils/contentByGender';
import { getSituationInsight } from '../utils/emotionalValidation';

interface ResultProps {
  onNavigate: (page: string) => void;
}

export default function Result({ onNavigate }: ResultProps) {
  const [revelation1, setRevelation1] = useState(false);
  const [revelation2, setRevelation2] = useState(false);
  const [showOfferButton, setShowOfferButton] = useState(false);
  const [revelation3, setRevelation3] = useState(false);
  const [revelation4, setRevelation4] = useState(false);
  const [timeLeft, setTimeLeft] = useState(47 * 60);
  const [spotsLeft, setSpotsLeft] = useState(storage.getSpotsLeft());
  
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  
  // ✨ NOVO: Estado para prova social dinâmica
  const [dynamicSocialProofData, setDynamicSocialProofData] = useState({
    startedToday: 847,
    contactedEx: 312,
    metEx: 89
  });
  
  // ✨ NOVO: Estado para controlar confete
  const [showConfetti, setShowConfetti] = useState(false);
  
  const quizData = storage.getQuizData();
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const offerSectionRef = useRef<HTMLDivElement>(null);

  const gender = quizData.gender || 'HOMBRE';

  const loadingSteps = [
    { icon: '📊', text: 'Procesando tus respuestas...', duration: 0 },
    { icon: '🔍', text: 'Analizando los patrones que hicieron que se alejara...', duration: 2000 },
    { icon: '🧠', text: 'Descubriendo la VENTANA DE OPORTUNIDAD...', duration: 4000 },
    { icon: '📋', text: 'Generando tu protocolo de 72 horas...', duration: 6000 }
  ];

  // ========================================
  // ✅ SISTEMA DE PRESERVAÇÃO E ANEXAÇÃO DE UTMs
  // ========================================
  
  const getUTMs = (): Record<string, string> => {
    try {
      const storedUTMs = localStorage.getItem('quiz_utms');
      if (storedUTMs) {
        return JSON.parse(storedUTMs);
      }
    } catch (error) {
      console.error('❌ Erro ao recuperar UTMs:', error);
    }
    return {};
  };

  const ensureUTMs = () => {
    try {
      const utms = getUTMs();
      if (Object.keys(utms).length > 0) {
        console.log('✅ UTMs preservadas no Resultado:', utms);
        
        if (window.location.search === '') {
          const utmString = Object.entries(utms)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');
          window.history.replaceState({}, '', `${window.location.pathname}?${utmString}`);
          console.log('✅ UTMs anexadas à URL do Resultado');
        }
      } else {
        console.log('ℹ️ Nenhuma UTM armazenada encontrada');
      }
    } catch (error) {
      console.error('❌ Erro ao preservar UTMs:', error);
    }
  };

  const appendUTMsToHotmartURL = (): string => {
    try {
      const baseURL = getHotmartUrl();
      const utms = getUTMs();
      
      if (Object.keys(utms).length === 0) {
        console.log('ℹ️ Nenhuma UTM para anexar ao link do Hotmart');
        return baseURL;
      }

      const url = new URL(baseURL);
      Object.entries(utms).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });

      const finalURL = url.toString();
      console.log('🔗 URL do Hotmart com UTMs:', finalURL);
      return finalURL;
    } catch (error) {
      console.error('❌ Erro ao anexar UTMs ao Hotmart:', error);
      return getHotmartUrl();
    }
  };

  useEffect(() => {
    ensureUTMs();

    tracking.pageView('resultado');
    ga4Tracking.resultPageView();

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    loadingSteps.forEach((step, index) => {
      setTimeout(() => {
        setLoadingStep(index);
        if (index > 0) playKeySound(); // ✨ SOM a cada step
      }, step.duration);
    });

    const timer1 = setTimeout(() => {
      setRevelation1(true);
      tracking.revelationViewed('validacion_emocional');
      ga4Tracking.revelationViewed('Validación Emocional', 1);
    }, 6500);

    const timer2 = setTimeout(() => {
      setRevelation2(true);
      tracking.revelationViewed('ventana_72h');
      ga4Tracking.revelationViewed('Ventana 72 Horas', 2);
    }, 12500);

    const timer3 = setTimeout(() => {
      setShowOfferButton(true);
      tracking.revelationViewed('vsl');
      tracking.vslEvent('started');
      ga4Tracking.videoStarted();
    }, 15500);

    const countdownInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spotsInterval = setInterval(() => {
      setSpotsLeft(prev => {
        if (prev > 15) {
          const newSpots = prev - 1;
          storage.setSpotsLeft(newSpots);
          ga4Tracking.spotsUpdated(newSpots);
          return newSpots;
        }
        return prev;
      });
    }, 45000);

    // ✨ NOVO: Atualização dinâmica da prova social
    const socialProofInterval = setInterval(() => {
      setDynamicSocialProofData(prev => ({
        startedToday: prev.startedToday + Math.floor(Math.random() * 3),
        contactedEx: prev.contactedEx + Math.floor(Math.random() * 2),
        metEx: prev.metEx + (Math.random() > 0.7 ? 1 : 0)
      }));
    }, 45000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(countdownInterval);
      clearInterval(spotsInterval);
      clearInterval(socialProofInterval);
    };
  }, []);

  useEffect(() => {
    if (!revelation2 || !videoContainerRef.current) return;

    const timer = setTimeout(() => {
      if (videoContainerRef.current) {
        videoContainerRef.current.innerHTML = `
          <div style="position: relative; width: 100%; padding-bottom: 56.25%; background: #000; border-radius: 8px; overflow: hidden;">
            <vturb-smartplayer 
              id="vid-6938c3eeb96ec714286a4c2b" 
              style="display: block; margin: 0 auto; width: 100%; height: 100%; position: absolute; top: 0; left: 0;"
            ></vturb-smartplayer>
          </div>
        `;

        const existingScript = document.querySelector('script[src="https://scripts.converteai.net/ea3c2dc1-1976-40a2-b0fb-c5055f82bfaf/players/6938c3eeb96ec714286a4c2b/v4/player.js"]');
        
        if (!existingScript) {
          const s = document.createElement("script");
          s.src = "https://scripts.converteai.net/ea3c2dc1-1976-40a2-b0fb-c5055f82bfaf/players/6938c3eeb96ec714286a4c2b/v4/player.js";
          s.async = true;
          
          s.onload = () => {
            console.log("✅ Script VTurb carregado com sucesso!");
          };
          
          s.onerror = () => {
            console.error("❌ Erro ao carregar script VTurb");
            if (videoContainerRef.current) {
              videoContainerRef.current.innerHTML = `
                <div style="background: #333; color: white; padding: 20px; text-align: center; border-radius: 8px;">
                  <p>Error al cargar video. Intenta recargar la página.</p>
                  <button onclick="location.reload()" style="background: #ffc107; color: black; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    Recargar
                  </button>
                </div>
              `;
            }
          };
          
          document.head.appendChild(s);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [revelation2]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCTAClick = () => {
    tracking.ctaClicked('result_buy');
    ga4Tracking.ctaBuyClicked('result_buy_main');
    
    const hotmartURLWithUTMs = appendUTMsToHotmartURL();
    window.open(hotmartURLWithUTMs, '_blank');
  };

  const handleRevealOffer = () => {
    playKeySound();
    setRevelation3(true);
    tracking.revelationViewed('protocolo_especifico');
    tracking.ctaClicked('reveal_offer_button');
    ga4Tracking.revelationViewed('Protocolo Específico', 3);
    ga4Tracking.offerRevealed();
    
    setTimeout(() => {
      if (offerSectionRef.current) {
        offerSectionRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 300);

    setTimeout(() => {
      setRevelation4(true);
      setShowConfetti(true); // ✨ ATIVA CONFETE
      ga4Tracking.offerViewed();
      
      // Remove confete após 3 segundos
      setTimeout(() => setShowConfetti(false), 3000);
    }, 3000);
  };

  return (
    <div className="result-container">
      {/* ✨ CONFETE ANIMATION */}
      {showConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
          overflow: 'hidden'
        }}>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '-10px',
                left: `${Math.random() * 100}%`,
                width: '10px',
                height: '10px',
                background: ['#ffc107', '#ff5722', '#4caf50', '#2196f3'][Math.floor(Math.random() * 4)],
                animation: `confettiFall ${2 + Math.random() * 2}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="result-header">
        <h1 className="result-title">Tu Plan Personalizado Está Listo</h1>
        <div className="urgency-bar">
          <span className="urgency-icon">⚠</span>
          <span className="urgency-text">Tiempo para acceder: {formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="revelations-container">
        
        {/* ========================================
            FASE 1: LOADING INTELIGENTE
            ======================================== */}
        {!revelation1 && (
          <div className="revelation fade-in" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            padding: 'clamp(20px, 5vw, 40px)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(202, 138, 4, 0.05) 100%)',
              border: '2px solid rgb(234, 179, 8)',
              borderRadius: '16px',
              padding: 'clamp(32px, 7vw, 48px) clamp(24px, 6vw, 40px)',
              maxWidth: '600px',
              width: '100%',
              boxShadow: '0 12px 48px rgba(234, 179, 8, 0.3)'
            }}>
              
              <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 6vw, 32px)' }}>
                <div style={{
                  fontSize: 'clamp(3rem, 10vw, 4rem)',
                  marginBottom: 'clamp(12px, 3vw, 16px)',
                  animation: 'spin 2s linear infinite'
                }}>
                  🧠
                </div>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 6vw, 2rem)',
                  fontWeight: '900',
                  color: 'white',
                  marginBottom: 'clamp(8px, 2vw, 12px)',
                  lineHeight: '1.3'
                }}>
                  ANALIZANDO TU CASO
                </h2>
                <p style={{
                  fontSize: 'clamp(0.9rem, 3.5vw, 1.125rem)',
                  color: 'rgb(253, 224, 71)',
                  fontWeight: '600'
                }}>
                  {loadingSteps[loadingStep].text}
                </p>
              </div>

              <div style={{
                marginBottom: 'clamp(24px, 6vw, 32px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(12px, 3vw, 16px)'
              }}>
                {loadingSteps.map((step, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'clamp(12px, 3vw, 16px)',
                      padding: 'clamp(12px, 3vw, 16px)',
                      background: index <= loadingStep 
                        ? 'rgba(234, 179, 8, 0.2)' 
                        : 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      border: index === loadingStep 
                        ? '2px solid rgb(234, 179, 8)' 
                        : '2px solid transparent',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{
                      fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                      minWidth: 'clamp(32px, 8vw, 40px)',
                      textAlign: 'center'
                    }}>
                      {index < loadingStep ? '✅' : index === loadingStep ? step.icon : '⏳'}
                    </div>
                    <div style={{
                      flex: 1,
                      fontSize: 'clamp(0.875rem, 3.5vw, 1.125rem)',
                      color: index <= loadingStep ? 'white' : 'rgba(255, 255, 255, 0.5)',
                      fontWeight: index === loadingStep ? 'bold' : 'normal',
                      lineHeight: '1.4'
                    }}>
                      {step.text}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginBottom: 'clamp(16px, 4vw, 20px)'
              }}>
                <div style={{
                  width: '100%',
                  height: 'clamp(12px, 3vw, 16px)',
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  border: '2px solid rgba(234, 179, 8, 0.3)'
                }}>
                  <div style={{
                    width: `${loadingProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, rgb(234, 179, 8) 0%, rgb(250, 204, 21) 100%)',
                    transition: 'width 0.3s ease',
                    boxShadow: '0 0 10px rgba(234, 179, 8, 0.5)'
                  }}></div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
                color: 'rgb(253, 224, 71)',
                fontWeight: 'bold'
              }}>
                <span>{loadingProgress}%</span>
                <span>⏱️ {Math.ceil((100 - loadingProgress) / 10)} segundos...</span>
              </div>

              <div style={{
                marginTop: 'clamp(24px, 6vw, 32px)',
                padding: 'clamp(16px, 4vw, 20px)',
                background: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
                  color: 'rgb(74, 222, 128)',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  ✨ No cierres ni actualices esta página
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ========================================
            FASE 2: REVELACIÓN 1 - VALIDACIÓN EMOCIONAL
            ======================================== */}
        {revelation1 && (
          <div className="revelation fade-in">
            <div className="revelation-header">
              <div className="revelation-icon pulse">💔</div>
              <h2>{getTitle(gender)}</h2>
            </div>
            
            <p className="revelation-text" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
              {getCopy(quizData)}
            </p>
          </div>
        )}

        {/* ========================================
            FASE 3: REVELACIÓN 2 - ESPERANZA (VENTANA 72H)
            ======================================== */}
        {revelation2 && (
          <div className="revelation fade-in">
            <div style={{
              background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
              border: '2px solid rgb(239, 68, 68)',
              borderRadius: '16px',
              padding: 'clamp(24px, 6vw, 48px) clamp(16px, 5vw, 32px)',
              marginTop: 'clamp(24px, 6vw, 32px)',
              boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)'
            }}>
              
              <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 6vw, 40px)' }}>
                <div style={{
                  fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
                  marginBottom: 'clamp(12px, 3vw, 16px)',
                  animation: 'pulse 2s infinite'
                }}>⚡</div>
                <h2 style={{ 
                  fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', 
                  fontWeight: '900',
                  color: 'white',
                  marginBottom: 'clamp(12px, 3vw, 16px)',
                  lineHeight: '1.3',
                  padding: '0 8px'
                }}>
                  LA VERDAD QUE NADIE TE CONTÓ
                </h2>
                <p style={{
                  color: 'rgb(252, 165, 165)',
                  fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                  fontWeight: '600',
                  padding: '0 8px',
                  lineHeight: '1.4'
                }}>
                  El secreto que los neurocientíficos descubrieron
                </p>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '12px',
                padding: 'clamp(20px, 5vw, 28px)',
                marginBottom: 'clamp(24px, 5vw, 32px)',
                backdropFilter: 'blur(10px)'
              }}>
                <p style={{ 
                  color: 'white', 
                  fontSize: 'clamp(1rem, 4vw, 1.375rem)', 
                  lineHeight: '1.7',
                  textAlign: 'center',
                  margin: 0
                }}>
                  Después de una ruptura, el cerebro de tu ex pasa por <strong style={{ color: 'rgb(250, 204, 21)' }}>3 fases químicas</strong> en 72 horas.
                  <br /><br />
                  <span style={{ whiteSpace: 'pre-line' }}>{getVentana72Copy(gender)}</span>
                </p>
              </div>

              <div style={{
                display: 'grid',
                gap: 'clamp(16px, 4vw, 20px)',
                marginBottom: 'clamp(24px, 5vw, 32px)'
              }}>
                {[1, 2, 3].map((fase) => (
                  <div key={fase} className="fade-in" style={{
                    background: 'rgba(234, 179, 8, 0.15)',
                    border: '2px solid rgb(234, 179, 8)',
                    borderRadius: '12px',
                    padding: 'clamp(16px, 4vw, 24px)',
                    transition: 'transform 0.2s',
                    animationDelay: `${fase * 0.2}s`
                  }}>
                    <div style={{ 
                      color: 'rgb(250, 204, 21)', 
                      fontWeight: '900',
                      fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                      marginBottom: 'clamp(8px, 2vw, 12px)',
                      lineHeight: '1.3'
                    }}>
                      FASE {fase} ({fase === 1 ? '0-24h' : fase === 2 ? '24-48h' : '48-72h'})
                    </div>
                    <div style={{ 
                      color: 'white',
                      fontSize: 'clamp(0.9rem, 3.5vw, 1.125rem)',
                      lineHeight: '1.6'
                    }}>
                      {getFaseText(gender, fase)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: 'clamp(28px, 6vw, 40px)',
                marginBottom: 'clamp(28px, 6vw, 40px)',
                textAlign: 'center'
              }}>
                <img 
                  src="https://comprarplanseguro.shop/wp-content/uploads/2025/10/imagem3-nova.webp"
                  alt="Ventana de 72 Horas - Proceso Cerebral"
                  loading="lazy"
                  style={{
                    width: '100%',
                    maxWidth: '600px',
                    height: 'auto',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                    border: '2px solid rgba(234, 179, 8, 0.3)',
                    display: 'block',
                    margin: '0 auto'
                  }}
                  onError={(e) => {
                    console.error('❌ Erro ao carregar imagem');
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '2px solid rgb(248, 113, 113)',
                borderRadius: '12px',
                padding: 'clamp(20px, 5vw, 28px)',
                textAlign: 'center'
              }}>
                <p style={{ 
                  color: 'white', 
                  fontSize: 'clamp(1.125rem, 4.5vw, 1.5rem)', 
                  fontWeight: '900',
                  margin: 0,
                  lineHeight: '1.5',
                  marginBottom: 'clamp(12px, 3vw, 16px)'
                }}>
                  ¿Sabes qué hacer en cada fase?
                </p>
                <p style={{
                  color: 'rgb(252, 165, 165)',
                  fontSize: 'clamp(0.9rem, 3.5vw, 1.125rem)',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  {getVideoIntroText(gender)}
                </p>
              </div>

            </div>

            {/* VSL CONTAINER */}
            <div className="vsl-container" style={{ marginTop: 'clamp(24px, 6vw, 32px)' }}>
              <div 
                ref={videoContainerRef}
                style={{ 
                  width: '100%', 
                  minHeight: '300px',
                  background: '#000',
                  borderRadius: '8px'
                }}
              >
              </div>
            </div>

            {/* TEXTO APÓS VÍDEO */}
            <div style={{
              marginTop: 'clamp(24px, 6vw, 32px)',
              padding: 'clamp(20px, 5vw, 28px)',
              background: 'rgba(234, 179, 8, 0.1)',
              border: '2px solid rgba(234, 179, 8, 0.3)',
              borderRadius: '12px'
            }}>
              <p style={{
                color: 'white',
                fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                lineHeight: '1.7',
                whiteSpace: 'pre-line',
                margin: 0
              }}>
                {getVideoOutroText(gender)}
              </p>
            </div>
          </div>
        )}

        {/* ========================================
            BOTÃO REVELAR OFERTA
            ======================================== */}
        {showOfferButton && !revelation3 && (
          <div className="revelation fade-in" style={{
            textAlign: 'center',
            padding: 'clamp(32px, 8vw, 64px) clamp(16px, 4vw, 24px)',
            marginTop: 'clamp(24px, 6vw, 32px)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(202, 138, 4, 0.1) 100%)',
              border: '3px solid rgb(234, 179, 8)',
              borderRadius: '16px',
              padding: 'clamp(32px, 7vw, 48px) clamp(20px, 5vw, 32px)',
              boxShadow: '0 12px 48px rgba(234, 179, 8, 0.4)',
              animation: 'pulse 2s infinite'
            }}>
              <div style={{
                fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
                marginBottom: 'clamp(16px, 4vw, 24px)'
              }}>🎁</div>
              
              <h2 style={{
                fontSize: 'clamp(1.5rem, 6vw, 2.25rem)',
                fontWeight: '900',
                color: 'white',
                marginBottom: 'clamp(16px, 4vw, 24px)',
                lineHeight: '1.3'
              }}>
                {getRevealOfferTitle()}
              </h2>
              
              <p style={{
                fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                color: 'rgb(253, 224, 71)',
                marginBottom: 'clamp(24px, 6vw, 32px)',
                lineHeight: '1.5',
                fontWeight: '600'
              }}>
                {getRevealOfferSubtitle()}
              </p>

              <button
                onClick={handleRevealOffer}
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  background: 'rgb(234, 179, 8)',
                  color: 'black',
                  fontWeight: '900',
                  padding: 'clamp(20px, 5vw, 28px) clamp(24px, 6vw, 32px)',
                  borderRadius: '16px',
                  fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
                  border: '4px solid white',
                  cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(234, 179, 8, 0.5)',
                  transition: 'all 0.3s ease',
                  minHeight: 'clamp(64px, 16vw, 80px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  lineHeight: '1.3',
                  animation: 'scaleUp 1.5s ease-in-out infinite'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 48px rgba(234, 179, 8, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(234, 179, 8, 0.5)';
                }}
              >
                {getRevealOfferButtonText()}
              </button>

              <p style={{
                fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
                color: 'rgb(252, 165, 165)',
                marginTop: 'clamp(16px, 4vw, 20px)',
                fontWeight: '600',
                lineHeight: '1.5'
              }}>
                ⏰ Precio especial válido solo por {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        )}

        {/* ========================================
            FASE 4: REVELACIÓN 3 - PROTOCOLO ESPECÍFICO
            ======================================== */}
        {revelation3 && (
          <div 
            ref={offerSectionRef}
            className="revelation fade-in offer-revelation" 
            style={{
              position: 'relative',
              padding: 'clamp(20px, 5vw, 32px)',
              scrollMarginTop: '80px'
            }}
          >
            
            <div style={{
              background: 'rgb(234, 179, 8)',
              color: 'black',
              fontWeight: 'bold',
              fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
              padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)',
              borderRadius: '9999px',
              display: 'inline-block',
              marginBottom: 'clamp(16px, 4vw, 20px)',
              textAlign: 'center',
              width: 'auto',
              maxWidth: '100%'
            }}>
              OFERTA EXCLUSIVA
            </div>

            <div className="revelation-header" style={{ marginTop: 0 }}>
              <div className="revelation-icon">🎯</div>
              <h2 style={{ 
                fontSize: 'clamp(1.5rem, 6vw, 2rem)',
                lineHeight: '1.3',
                marginBottom: 'clamp(20px, 5vw, 24px)',
                padding: '0 8px'
              }}>
                {getOfferTitle(gender)}
              </h2>
            </div>

            <div style={{
              background: 'rgba(234, 179, 8, 0.1)',
              border: '2px solid rgba(234, 179, 8, 0.3)',
              borderRadius: '12px',
              padding: 'clamp(16px, 4vw, 20px)',
              marginBottom: 'clamp(24px, 5vw, 32px)'
            }}>
              <p style={{
                fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
                color: 'rgb(253, 224, 71)',
                marginBottom: 'clamp(12px, 3vw, 16px)',
                fontWeight: 'bold'
              }}>
                Basado en tu situación específica:
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
                color: 'white',
                lineHeight: '1.8'
              }}>
                <li>✓ Tiempo de separación: <strong>{quizData.timeSeparation}</strong></li>
                <li>✓ Quién terminó: <strong>{quizData.whoEnded}</strong></li>
                <li>✓ Situación actual: <strong>{quizData.currentSituation}</strong></li>
                <li>✓ Tu nivel de compromiso: <strong>{quizData.commitmentLevel}</strong></li>
              </ul>
            </div>

            {/* ✨ 4 ITENS DO PROTOCOLO COM ANIMAÇÃO DE CADEADO */}
            <div className="offer-features" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(16px, 4vw, 20px)',
              marginBottom: 'clamp(24px, 5vw, 32px)'
            }}>
              {getFeatures(gender).map((feature, index) => (
                <div 
                  key={index} 
                  className="feature fade-in" 
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'clamp(12px, 3vw, 16px)',
                    padding: 'clamp(16px, 4vw, 20px)',
                    background: 'rgba(234, 179, 8, 0.1)',
                    border: '2px solid rgba(234, 179, 8, 0.3)',
                    borderRadius: '12px',
                    animationDelay: `${index * 0.3}s`
                  }}
                >
                  <div style={{
                    fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                    minWidth: 'clamp(32px, 8vw, 40px)',
                    animation: 'unlockAnimation 0.6s ease-out forwards',
                    animationDelay: `${index * 0.3}s`
                  }}>
                    🔓
                  </div>
                  <div style={{
                    flex: 1,
                    fontSize: 'clamp(0.9rem, 3.5vw, 1.125rem)',
                    color: 'white',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line'
                  }}>
                    {feature}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              textAlign: 'center',
              padding: 'clamp(20px, 5vw, 28px)',
              background: 'rgba(74, 222, 128, 0.1)',
              border: '2px solid rgba(74, 222, 128, 0.3)',
              borderRadius: '12px',
              marginBottom: 'clamp(24px, 5vw, 32px)'
            }}>
              <p style={{
                color: 'rgb(74, 222, 128)',
                fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                lineHeight: '1.7',
                whiteSpace: 'pre-line',
                margin: 0,
                fontWeight: '600'
              }}>
                {getFeaturesExtraText(gender)}
              </p>
            </div>

            {/* ✨ PROVA SOCIAL DINÂMICA */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)',
              border: '2px solid rgba(74, 222, 128, 0.3)',
              borderRadius: '16px',
              padding: 'clamp(24px, 6vw, 32px)',
              marginBottom: 'clamp(24px, 5vw, 32px)'
            }}>
              <h3 style={{
                fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
                fontWeight: '900',
                color: 'white',
                textAlign: 'center',
                marginBottom: 'clamp(20px, 5vw, 28px)',
                lineHeight: '1.3'
              }}>
                {getSocialProofText()}
              </h3>

              <div style={{
                display: 'grid',
                gap: 'clamp(12px, 3vw, 16px)',
                marginBottom: 'clamp(20px, 5vw, 24px)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(12px, 3vw, 16px)',
                  padding: 'clamp(12px, 3vw, 16px)',
                  background: 'rgba(74, 222, 128, 0.1)',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>🟢</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 'clamp(1.5rem, 6vw, 2rem)',
                      fontWeight: '900',
                      color: 'rgb(74, 222, 128)',
                      animation: 'countUp 1s ease-out'
                    }}>
                      {dynamicSocialProofData.startedToday}
                    </div>
                    <div style={{
                      fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
                      color: 'white'
                    }}>
                      personas iniciaron hoy
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(12px, 3vw, 16px)',
                  padding: 'clamp(12px, 3vw, 16px)',
                  background: 'rgba(234, 179, 8, 0.1)',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>🟡</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 'clamp(1.5rem, 6vw, 2rem)',
                      fontWeight: '900',
                      color: 'rgb(250, 204, 21)',
                      animation: 'countUp 1s ease-out'
                    }}>
                      {dynamicSocialProofData.contactedEx}
                    </div>
                    <div style={{
                      fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
                      color: 'white'
                    }}>
                      tuvieron contacto con el ex en 24h
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(12px, 3vw, 16px)',
                  padding: 'clamp(12px, 3vw, 16px)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>🔴</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 'clamp(1.5rem, 6vw, 2rem)',
                      fontWeight: '900',
                      color: 'rgb(248, 113, 113)',
                      animation: 'countUp 1s ease-out'
                    }}>
                      {dynamicSocialProofData.metEx}
                    </div>
                    <div style={{
                      fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
                      color: 'white'
                    }}>
                      marcaron encuentro en 72h
                    </div>
                  </div>
                </div>
              </div>

              <p style={{
                color: 'white',
                fontSize: 'clamp(1rem, 4vw, 1.125rem)',
                lineHeight: '1.7',
                textAlign: 'center',
                whiteSpace: 'pre-line',
                margin: 0
              }}>
                {getSocialProofDescription()}
              </p>
            </div>

          </div>
        )}

        {/* ========================================
            FASE 5: REVELACIÓN 4 - OFERTA FINAL + OBJEÇÃO HANDLING
            ======================================== */}
        {revelation4 && (
          <div className="revelation fade-in" style={{
            padding: 'clamp(20px, 5vw, 32px)'
          }}>
            
            <div style={{
              textAlign: 'center',
              marginBottom: 'clamp(24px, 6vw, 32px)'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.75rem, 7vw, 2.5rem)',
                fontWeight: '900',
                color: 'rgb(234, 179, 8)',
                marginBottom: 'clamp(16px, 4vw, 20px)',
                lineHeight: '1.3'
              }}>
                {getOfferUnlockedTitle()}
              </h2>
              <p style={{
                fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                color: 'white',
                lineHeight: '1.5'
              }}>
                {getOfferSubtitle(gender)}
              </p>
            </div>

            <div style={{
              background: 'rgba(234, 179, 8, 0.1)',
              border: '2px solid rgba(234, 179, 8, 0.3)',
              borderRadius: '12px',
              padding: 'clamp(20px, 5vw, 28px)',
              marginBottom: 'clamp(24px, 5vw, 32px)',
              textAlign: 'center'
            }}>
              <p style={{
                color: 'white',
                fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                lineHeight: '1.7',
                whiteSpace: 'pre-line',
                margin: 0
              }}>
                {getPreCTAText(gender)}
              </p>
            </div>

            {/* ✨ OBJEÇÃO HANDLING */}
            <div style={{
              marginBottom: 'clamp(32px, 7vw, 48px)'
            }}>
              {getObjetionHandling().map((obj, index) => (
                <div 
                  key={index}
                  className="fade-in"
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '2px solid rgba(234, 179, 8, 0.3)',
                    borderRadius: '12px',
                    padding: 'clamp(20px, 5vw, 24px)',
                    marginBottom: 'clamp(16px, 4vw, 20px)',
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <h3 style={{
                    fontSize: 'clamp(1.125rem, 4.5vw, 1.5rem)',
                    fontWeight: '900',
                    color: 'rgb(234, 179, 8)',
                    marginBottom: 'clamp(12px, 3vw, 16px)',
                    lineHeight: '1.3'
                  }}>
                    {obj.question}
                  </h3>
                  <p style={{
                    color: 'white',
                    fontSize: 'clamp(0.9rem, 3.5vw, 1.125rem)',
                    lineHeight: '1.7',
                    whiteSpace: 'pre-line',
                    margin: 0
                  }}>
                    {obj.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* URGÊNCIA */}
            <div className="urgency-indicators" style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 'clamp(12px, 3vw, 16px)',
              marginBottom: 'clamp(24px, 5vw, 32px)'
            }}>
              <div className="indicator" style={{
                textAlign: 'center',
                padding: 'clamp(12px, 3vw, 16px)',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '2px solid rgb(239, 68, 68)',
                borderRadius: '8px'
              }}>
                <span className="indicator-label" style={{
                  display: 'block',
                  fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                  marginBottom: '8px',
                  color: 'rgb(252, 165, 165)'
                }}>⏰ Precio especial válido por:</span>
                <span className="indicator-value countdown" style={{
                  fontSize: 'clamp(1.75rem, 7vw, 2.5rem)',
                  fontWeight: '900',
                  color: 'rgb(248, 113, 113)'
                }}>{formatTime(timeLeft)}</span>
              </div>
              <div className="indicator" style={{
                textAlign: 'center',
                padding: 'clamp(12px, 3vw, 16px)',
                background: 'rgba(234, 179, 8, 0.2)',
                border: '2px solid rgb(234, 179, 8)',
                borderRadius: '8px'
              }}>
                <span className="indicator-label" style={{
                  display: 'block',
                  fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                  marginBottom: '8px',
                  color: 'rgb(253, 224, 71)'
                }}>📍 Spots disponibles hoy:</span>
                <span className="indicator-value spots" style={{
                  fontSize: 'clamp(1.75rem, 7vw, 2.5rem)',
                  fontWeight: '900',
                  color: 'rgb(250, 204, 21)'
                }}>{spotsLeft}</span>
              </div>
            </div>

            {/* CTA PRINCIPAL */}
            <button 
              className="cta-buy" 
              onClick={handleCTAClick}
              style={{
                width: '100%',
                background: 'rgb(234, 179, 8)',
                color: 'black',
                fontWeight: '900',
                padding: 'clamp(20px, 5vw, 28px)',
                borderRadius: '16px',
                fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
                border: '4px solid white',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: 'clamp(20px, 5vw, 28px)',
                minHeight: 'clamp(64px, 16vw, 80px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: '1.3',
                boxShadow: '0 8px 32px rgba(234, 179, 8, 0.5)',
                animation: 'scaleUp 1.5s ease-in-out infinite'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 48px rgba(234, 179, 8, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(234, 179, 8, 0.5)';
              }}
            >
              {getCTA(gender)}
            </button>

            <p className="social-proof-count" style={{
              textAlign: 'center',
              color: 'rgb(74, 222, 128)',
              fontSize: 'clamp(0.875rem, 3.5vw, 1.125rem)',
              marginBottom: 'clamp(16px, 4vw, 20px)',
              lineHeight: '1.5',
              fontWeight: '600'
            }}>
              ✓ +12.847 reconquistas exitosas
            </p>

            {/* COPY FINAL */}
            <div style={{
              background: 'rgba(234, 179, 8, 0.1)',
              border: '2px solid rgba(234, 179, 8, 0.3)',
              borderRadius: '12px',
              padding: 'clamp(20px, 5vw, 28px)',
              textAlign: 'center'
            }}>
              <p style={{
                color: 'white',
                fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                lineHeight: '1.7',
                whiteSpace: 'pre-line',
                margin: 0
              }}>
                {getFinalCTAText(gender)}
              </p>
            </div>

          </div>
        )}
      </div>

      {/* ========================================
          CTA STICKY (RODAPÉ FIXO)
          ======================================== */}
      {revelation4 && (
        <div className="sticky-cta" style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          padding: 'clamp(12px, 3vw, 16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(8px, 2vw, 12px)',
          zIndex: 1000,
          borderTop: '2px solid rgb(234, 179, 8)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="sticky-urgency" style={{
            textAlign: 'center',
            fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
            color: 'rgb(253, 224, 71)',
            fontWeight: 'bold'
          }}>
            ⏰ {formatTime(timeLeft)} • {spotsLeft} spots restantes
          </div>
          <button 
            className="cta-buy-sticky" 
            onClick={() => {
              ga4Tracking.ctaBuyClicked('result_buy_sticky');
              handleCTAClick();
            }}
            style={{
              width: '100%',
              background: 'rgb(234, 179, 8)',
              color: 'black',
              fontWeight: '900',
              padding: 'clamp(14px, 3.5vw, 18px)',
              borderRadius: '12px',
              fontSize: 'clamp(1rem, 4vw, 1.25rem)',
              border: '3px solid white',
              cursor: 'pointer',
              minHeight: 'clamp(52px, 13vw, 60px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(234, 179, 8, 0.5)',
              animation: 'pulse 2s infinite'
            }}
          >
            {getCTA(gender)}
          </button>
        </div>
      )}

      {/* ========================================
          KEYFRAMES CSS
          ======================================== */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 12px 48px rgba(234, 179, 8, 0.4);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 12px 64px rgba(234, 179, 8, 0.6);
          }
        }

        @keyframes scaleUp {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes unlockAnimation {
          0% {
            content: '🔒';
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(20deg) scale(1.2);
          }
          100% {
            content: '🔓';
            transform: rotate(0deg) scale(1);
          }
        }

        @keyframes countUp {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }

        .pulse {
          animation: pulse 2s infinite;
        }

        .revelation-icon {
          font-size: clamp(2.5rem, 8vw, 3.5rem);
          margin-bottom: clamp(12px, 3vw, 16px);
        }
      `}</style>
    </div>
  );
}