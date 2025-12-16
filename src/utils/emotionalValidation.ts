import { QuizData } from '../types/quiz';

// ========================================
// VALIDAÇÃO EMOCIONAL BASEADA NAS RESPOSTAS
// VERSÃO OTIMIZADA 2.0 COMPLETA
// ========================================

export function getEmotionalValidation(quizData: QuizData): string {
  // Este texto será integrado diretamente no getCopy do contentByGender.ts
  // Mantido para compatibilidade com outros componentes
  return '';
}

export function getSituationInsight(quizData: QuizData): string {
  const pronoun = quizData.gender === 'HOMBRE' ? 'ella' : 'él';
  
  const insights: Record<string, string> = {
    'CONTACTO CERO': `El contacto cero puede ser estratégico, pero también puede estar creando distancia. Necesitas saber CUÁNDO romperlo.`,
    'ME IGNORA': `Si ${pronoun} te ignora, hay una razón psicológica específica. No es personal, es un mecanismo de defensa que podemos revertir.`,
    'BLOQUEADO': `Estar bloqueado parece definitivo, pero es una reacción emocional extrema que indica que aún hay sentimientos fuertes.`,
    'SÓLO TEMAS NECESARIOS': `La comunicación mínima es una señal de que ${pronoun} está construyendo barreras emocionales, pero aún mantiene un canal abierto.`,
    'HABLAMOS A VECES': `La comunicación ocasional es una oportunidad de oro. Estás en la fase perfecta para aplicar el protocolo.`,
    'SOMOS AMIGOS': `La "amistad" después de una ruptura es un campo minado emocional. Puede ser tu mayor ventaja o tu peor enemiga.`,
    'ENCUENTROS ÍNTIMOS': `Los encuentros íntimos indican que la atracción física sigue viva, pero falta la conexión emocional profunda.`
  };
  
  return insights[quizData.currentSituation || ''] || '';
}

export function getTimeSeparationInsight(quizData: QuizData): string {
  const pronoun = quizData.gender === 'HOMBRE' ? 'ella' : 'él';
  
  const timeSeparationInsights: Record<string, string> = {
    'MENOS DE 1 SEMANA': `Tu separación es reciente. Eso significa que aún hay una ventana de oportunidad donde ${pronoun} piensa en ti constantemente. La nostalgia aún no se ha instalado.`,
    'ENTRE 1 A 2 SEMANAS': `El tiempo que ha pasado es crucial. ${pronoun} aún tiene recuerdos frescos, pero los patrones están empezando a cambiar. Necesitas actuar AHORA.`,
    'ENTRE 2 A 4 SEMANAS': `Estás en una fase crítica. Los sentimientos iniciales de shock están desapareciendo, pero la atracción aún está presente. Este es el momento perfecto.`,
    'ENTRE 1 A 3 MESES': `Ha pasado tiempo, pero eso no significa que sea imposible. Hay patrones psicológicos que funcionan incluso después de meses. La nostalgia está en su punto máximo.`,
    'MÁS DE 6 MESES': `Ha pasado mucho tiempo, pero eso puede ser una ventaja. ${pronoun} ya procesó la ruptura inicial y puede estar más abierto a reconectar. El tiempo ha sanado las heridas superficiales.`
  };
  
  return timeSeparationInsights[quizData.timeSeparation || ''] || '';
}

export function getWhoEndedInsight(quizData: QuizData): string {
  const pronoun = quizData.gender === 'HOMBRE' ? 'ella' : 'él';
  
  const whoEndedInsights: Record<string, string> = {
    'ÉL/ELLA TERMINÓ': `El hecho de que ${pronoun} haya terminado es en realidad una ventaja, porque significa que ${pronoun} tuvo que tomar una decisión difícil y eso deja una huella emocional profunda. Hay arrepentimiento.`,
    'YO TERMINÉ': `El hecho de que tú hayas terminado cambia la dinámica completamente. ${pronoun} puede estar esperando que tú des el primer paso. Esto te pone en una posición de poder.`,
    'FUE MUTUO': `Una ruptura mutua significa que ambos reconocen los problemas, pero también significa que hay espacio para reconciliación. La puerta está abierta de ambos lados.`
  };
  
  return whoEndedInsights[quizData.whoEnded || ''] || '';
}

export function getCommitmentLevelInsight(quizData: QuizData): string {
  const commitmentInsights: Record<string, string> = {
    'MUY BAJO': `Tu nivel de compromiso es bajo, lo que significa que necesitas una razón FUERTE para actuar. El protocolo te dará esa razón.`,
    'BAJO': `Tu nivel de compromiso es bajo pero presente. Esto significa que aún hay sentimientos, solo necesitan ser reactivados.`,
    'MEDIO': `Tu nivel de compromiso es medio, lo que es perfecto. Tienes suficiente motivación para actuar, pero también perspectiva.`,
    'ALTO': `Tu nivel de compromiso es alto. Esto significa que estás dispuesto a hacer lo necesario. El protocolo canalizará esa energía de forma efectiva.`,
    'MUY ALTO': `Tu nivel de compromiso es muy alto. Eres el tipo de persona que no se rinde. El protocolo te mostrará CÓMO actuar de forma inteligente, no solo duro.`
  };
  
  return commitmentInsights[quizData.commitmentLevel || ''] || '';
}

export function getFullEmotionalValidation(quizData: QuizData): string {
  const timeSepInsight = getTimeSeparationInsight(quizData);
  const whoEndedInsight = getWhoEndedInsight(quizData);
  const commitmentInsight = getCommitmentLevelInsight(quizData);
  const situationInsight = getSituationInsight(quizData);
  
  return `${timeSepInsight}

${whoEndedInsight}

${situationInsight}

${commitmentInsight}`;
}