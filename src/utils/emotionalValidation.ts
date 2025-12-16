import { QuizData } from '../types/quiz';

// ========================================
// VALIDAÇÃO EMOCIONAL BASEADA NAS RESPOSTAS
// VERSÃO OTIMIZADA 2.0
// ========================================

export function getEmotionalValidation(quizData: QuizData): string {
  // Este texto será integrado diretamente no getCopy do contentByGender.ts
  // Mantido para compatibilidade
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