import { DiagnosticResult } from './diagnostic-engine'

export async function generateDiagnosticPDF(result: DiagnosticResult) {
  // Dinamicamente carregar html2pdf quando necessário
  const html2pdf = (await import('html2pdf.js')).default

  // Criar elemento HTML com os dados do diagnóstico
  const element = document.createElement('div')
  element.innerHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #3b82f6; padding-bottom: 30px;">
        <h1 style="color: #1e40af; margin: 0 0 10px 0; font-size: 32px;">Diagnóstico de Presença Digital</h1>
        <p style="color: #666; margin: 5px 0; font-size: 16px;"><strong>${result.businessName}</strong></p>
        <p style="color: #999; margin: 5px 0; font-size: 14px;">${new Date(result.timestamp).toLocaleDateString('pt-BR')}</p>
      </div>

      <!-- Score Principal -->
      <div style="text-align: center; margin: 40px 0; background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%); padding: 40px; border-radius: 12px;">
        <p style="color: #0284c7; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">SCORE GERAL</p>
        <h2 style="margin: 0; font-size: 64px; color: #1e40af; font-weight: bold;">${result.overallScore}</h2>
        <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">de 100</p>
        <p style="color: #0284c7; font-size: 18px; margin: 15px 0 0 0; font-weight: bold;">
          ${
            result.overallScore >= 80
              ? 'Presença Forte'
              : result.overallScore >= 60
                ? 'Presença Sólida'
                : result.overallScore >= 40
                  ? 'Presença em Desenvolvimento'
                  : 'Presença com Oportunidades'
          }
        </p>
      </div>

      <!-- Análise por Canal -->
      <h3 style="color: #1e40af; margin: 40px 0 20px 0; font-size: 22px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Análise por Canal</h3>
      ${Object.entries(result.channels)
        .map(
          ([key, channel]) => `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #1e40af; font-size: 18px;">
              ${
                channel.channel === 'tiktok'
                  ? 'TikTok'
                  : channel.channel === 'youtube'
                    ? 'YouTube'
                    : channel.channel === 'website'
                      ? 'Website'
                      : 'Instagram'
              }
            </h4>
            <div style="background: ${
              channel.grade === 'A'
                ? '#d1fae5'
                : channel.grade === 'B'
                  ? '#dbeafe'
                  : channel.grade === 'C'
                    ? '#fef3c7'
                    : channel.grade === 'D'
                      ? '#fed7aa'
                      : '#fee2e2'
            }; color: ${
              channel.grade === 'A'
                ? '#065f46'
                : channel.grade === 'B'
                  ? '#0c4a6e'
                  : channel.grade === 'C'
                    ? '#78350f'
                    : channel.grade === 'D'
                      ? '#92400e'
                      : '#7f1d1d'
            }; padding: 8px 16px; border-radius: 6px; font-weight: bold; font-size: 20px;">
              ${channel.grade}
            </div>
          </div>
          <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #666; font-size: 14px;">Score</span>
              <span style="font-weight: bold; color: #1e40af; font-size: 16px;">${channel.score}/100</span>
            </div>
            <div style="background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, #3b82f6, #06b6d4); height: 100%; width: ${channel.score}%;"></div>
            </div>
          </div>
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 12px; border-radius: 4px;">
            <p style="margin: 0; color: #0c4a6e; font-weight: bold; font-size: 12px;">⚡ OPORTUNIDADE</p>
            <p style="margin: 5px 0 0 0; color: #075985; font-size: 14px;">${channel.quickWin}</p>
          </div>
        </div>
      `
        )
        .join('')}

      <!-- Plano de Ação -->
      <h3 style="color: #1e40af; margin: 40px 0 20px 0; font-size: 22px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Primeiros Passos</h3>
      <ol style="padding-left: 20px;">
        ${result.topPriorities
          .slice(0, 2)
          .map(
            (priority, idx) => `
          <li style="margin-bottom: 12px; color: #333; line-height: 1.6;">
            <strong style="color: #1e40af;">${priority}</strong>
          </li>
        `
          )
          .join('')}
      </ol>
      <p style="color: #999; font-size: 13px; font-style: italic; margin-top: 15px;">
        + ${Math.max(0, result.topPriorities.length - 2)} ações adicionais disponíveis no plano premium
      </p>

      <!-- Recomendação -->
      <div style="background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%); border-left: 4px solid #3b82f6; padding: 25px; border-radius: 8px; margin: 40px 0; font-style: italic;">
        <p style="margin: 0; color: #075985; font-size: 16px; line-height: 1.6;">"${result.recommendation}"</p>
      </div>

      <!-- Footer -->
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 40px; text-align: center; border-top: 2px solid #e2e8f0;">
        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
          <strong>Próximo Passo:</strong> Acesse o plano completo com análise detalhada
        </p>
        <p style="margin: 0; color: #999; font-size: 12px;">
          Caminho Digital — A gente cuida da sua internet pra você aparecer mais e conseguir mais clientes.
        </p>
      </div>
    </div>
  `

  // Configurações do PDF
  const options = {
    margin: [10, 10, 10, 10],
    filename: `diagnostico_${result.businessName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  }

  // Gerar e fazer download do PDF
  html2pdf().set(options).from(element).save()
}
