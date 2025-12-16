import { QuizData } from '../types/quiz';

// ========================================
// FUNÇÕES DE PERSONALIZAÇÃO POR GÊNERO
// COPY OTIMIZADO - VERSÃO 2.0
// ========================================

export function getTitle(gender: string): string {
  return 'NO ESTÁS SOLO';
}

export function getLoadingMessage(gender: string): string {
  const messages = [
    'Procesando tus respuestas...',
    'Analizando los patrones que hicieron que se alejara...',
    'Descubriendo la VENTANA DE OPORTUNIDAD...',
    'Generando tu protocolo de 72 horas...'
  ];
  
  // Retorna mensagem baseada no progresso (será controlado pelo componente)
  return gender === 'HOMBRE'
    ? 'Generando tu protocolo de 72 horas...'
    : 'Generando tu protocolo de 72 horas...';
}

export function getCopy(quizData: QuizData): string {
  const timeSep = quizData.timeSeparation || 'Reciente';
  const whoEnded = quizData.whoEnded || 'No especificado';
  const situation = quizData.currentSituation || 'No especificado';
  const commitment = quizData.commitmentLevel || 'No especificado';

  return `Tu situación específica:
✓ Tiempo de separación: ${timeSep}
✓ Quién terminó: ${whoEnded}
✓ Situación actual: ${situation}
✓ Tu nivel de compromiso: ${commitment}

Pero aquí está lo más importante:

+12.847 personas ya pasaron EXACTAMENTE 
por lo que estás viviendo ahora.

¿Y sabes qué descubrieron?

Que la ruptura no es el final.
Es solo una pausa.

Una pausa que TÚ puedes revertir.

Porque existe un patrón.
Un protocolo que funciona.

Y estás a punto de descubrir cuál es el tuyo.`;
}

export function getVentana72Copy(gender: string): string {
  return `Pero aquí está el secreto que lo cambia todo:

En CADA FASE, existe una acción específica 
que puedes hacer para reactivar sus sentimientos.

No es manipulación.
No es juego psicológico.

Es simplemente entender cómo funciona su cerebro.
Y usar ese conocimiento a tu favor.`;
}

export function getVideoIntroText(gender: string): string {
  return 'Mira cómo funciona (2 min)';
}

export function getVideoOutroText(gender: string): string {
  return `Ahora viste cómo funciona.

Pero aquí está la verdad:

Saber no es suficiente.

Necesitas un PLAN PASO A PASO.
Un protocolo que puedas seguir 
EXACTAMENTE como fue hecho.

Porque en las próximas 72 horas,
cada acción que tomes va a contar.

Y necesitas saber EXACTAMENTE qué hacer.

Por eso vas a recibir tu protocolo personalizado.`;
}

export function getOfferTitle(gender: string): string {
  return 'TU PROTOCOLO PERSONALIZADO ESTÁ LISTO';
}

export function getFeatures(gender: string): string[] {
  return [
    '📱 FASE 0-24h: El Primer Contacto\n"El mensaje exacto que debes enviar"\n"Cómo romper el silencio sin parecer desesperado"',
    '💬 FASE 24-48h: La Reconexión Emocional\n"Cómo hacer que QUIERA hablar contigo"\n"Los gatillos emocionales que funcionan"',
    '❤️ FASE 48-72h: El Punto de Inflexión\n"Cómo transformar una conversación en un encuentro"\n"Qué decir para que quiera verte"',
    '🔥 DÍAS 4-21: El Protocolo de Consolidación\n"Cómo mantener el momentum"\n"Cómo evitar los errores que hacen que se aleje de nuevo"'
  ];
}

export function getFeaturesExtraText(gender: string): string {
  return `Cada protocolo es específico para TU situación.
Cada uno fue probado con +12.847 personas.
Cada uno funciona.

Y tienes acceso a TODOS ellos.`;
}

export function getCTA(gender: string): string {
  return '🔓 SÍ, QUIERO MI PLAN AHORA (Acceso Inmediato - $12.99)';
}

export function getOfferSubtitle(gender: string): string {
  return 'Acceso Inmediato al Plan de Reconquista Personalizado (30 días de acceso total)';
}

export function getPreCTAText(gender: string): string {
  return `Ya hiciste el trabajo más difícil.

Respondiste las preguntas.
Descubriste por qué se alejó.
Viste el protocolo que funciona.

Ahora es momento de ACTUAR.`;
}

export function getObjetionHandling(): { question: string; answer: string }[] {
  return [
    {
      question: '¿Y si no funciona?',
      answer: `Tienes 30 días de acceso total.
Si en 30 días no tienes progreso,
sabes exactamente qué hacer.

Pero aquí está la verdad:
Si sigues el protocolo, TENDRÁS progreso.
Porque +12.847 personas ya lo tuvieron.`
    },
    {
      question: '¿Es caro?',
      answer: `$12.99 es menos que un café.
Menos que una comida.

¿Pero el valor que vas a recibir?
Invaluable.

Porque vas a recuperarla.`
    },
    {
      question: '¿No tengo tiempo?',
      answer: `Cada protocolo toma 5-10 minutos por día.
¿Puedes sacar 5 minutos de tu día
para reconquistar a la persona que amas?`
    }
  ];
}

export function getFinalCTAText(gender: string): string {
  return `En las próximas 72 horas, vas a:
✓ Hacer el primer contacto correcto
✓ Reactivar sus sentimientos
✓ Transformar contacto en reconquista

Todo paso a paso.
Todo personalizado para tu situación.
Todo a tu ritmo.

Pero necesitas comenzar AHORA.

Porque la Ventana de 72 Horas no espera.

¿Cuál es tu elección?`;
}

export function getCompletionBadge(gender: string): { title: string; subtitle: string } {
  const pronoun = gender === 'HOMBRE' ? 'ella' : 'él';
  
  return {
    title: '¡TU ANÁLISIS ESTÁ LISTO!',
    subtitle: `Descubre exactamente por qué ${pronoun} se fue y el paso a paso científico para que ${pronoun} QUIERA volver`
  };
}

export function getFaseText(gender: string, fase: number): string {
  const pronoun = gender === 'HOMBRE' ? 'Ella' : 'Él';
  
  const fases: Record<number, string> = {
    1: `${pronoun} siente "alivio" inicial → La dopamina cae 67%`,
    2: `${pronoun} "olvida" los buenos momentos → La oxitocina se desconecta`,
    3: `${pronoun} te ve diferente → El córtex prefrontal reescribe memorias`
  };
  
  return fases[fase] || '';
}

export function getRevealOfferButtonText(): string {
  return '🔓 VER MI OFERTA EXCLUSIVA';
}

export function getRevealOfferTitle(): string {
  return 'Tu Oferta Exclusiva Está Lista';
}

export function getRevealOfferSubtitle(): string {
  return 'Acceso inmediato al Plan Completo de 21 Días';
}

export function getSocialProofText(): string {
  return 'VE EL PROGRESO DE QUIENES YA COMENZARON';
}

export function getSocialProofDescription(): string {
  return `Estas son personas COMO TÚ.
Que estaban en la misma situación.
Y que comenzaron hoy.

¿Quieres estar entre ellas?`;
}

export function getOfferUnlockedTitle(): string {
  return 'DESBLOQUEASTE TU OFERTA EXCLUSIVA';
}