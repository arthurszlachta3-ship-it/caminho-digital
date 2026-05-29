import { DiagnosticResult } from './diagnostic-engine'

declare global {
  interface Window {
    html2pdf: any
  }
}

async function loadHTML2PDF(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Se já está carregado, resolve imediatamente
    if (window.html2pdf) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
    script.async = true
    script.onload = () => {
      // Aguarda um pouco para garantir que o objeto está disponível
      setTimeout(() => resolve(), 100)
    }
    script.onerror = () => reject(new Error('Falha ao carregar html2pdf'))
    document.head.appendChild(script)
  })
}

export async function generateDiagnosticPDF(result: DiagnosticResult): Promise<void> {
  try {
    // Carregar html2pdf se necessário
    if (typeof window !== 'undefined' && !window.html2pdf) {
      await loadHTML2PDF()
    }

    // Verificar se html2pdf está disponível
    if (!window?.html2pdf) {
      throw new Error('Biblioteca html2pdf não foi carregada. Tente novamente.')
    }

    // Obter a função html2pdf (pode estar em window.html2pdf ou window.html2pdf.html2pdf)
    const html2pdfLib = window.html2pdf?.html2pdf || window.html2pdf

    if (typeof html2pdfLib !== 'function') {
      throw new Error('html2pdf não é uma função válida')
    }

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
      <h3 style="color: #1e40af; margin: 40px 0 20px 0; font-size: 22px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Análise Detalhada por Canal</h3>
      ${Object.entries(result.channels)
        .map(
          ([_key, channel]) => {
            const channelName =
              channel.channel === 'tiktok'
                ? 'TikTok'
                : channel.channel === 'youtube'
                  ? 'YouTube'
                  : channel.channel === 'website'
                    ? 'Website'
                    : 'Instagram'
            return `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; page-break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #1e40af; font-size: 18px;">${channelName}</h4>
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

          <!-- Score Bar -->
          <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #666; font-size: 14px;">Score</span>
              <span style="font-weight: bold; color: #1e40af; font-size: 16px;">${channel.score}/100</span>
            </div>
            <div style="background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, #3b82f6, #06b6d4); height: 100%; width: ${channel.score}%;"></div>
            </div>
          </div>

          <!-- Quick Win -->
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 12px; border-radius: 4px; margin-bottom: 15px;">
            <p style="margin: 0; color: #0c4a6e; font-weight: bold; font-size: 12px;">⚡ QUICK WIN</p>
            <p style="margin: 5px 0 0 0; color: #075985; font-size: 13px;">${channel.quickWin}</p>
          </div>

          <!-- Problemas Identificados -->
          ${
            channel.problems.length > 0
              ? `
          <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 3px solid #ef4444;">
            <p style="margin: 0 0 10px 0; color: #7f1d1d; font-weight: bold; font-size: 13px;">PROBLEMAS IDENTIFICADOS (${channel.problems.length})</p>
            <div style="font-size: 12px;">
              ${channel.problems
                .map((problem: any) => {
                  const impactEmoji = problem.impact === 'high' ? '🔴' : problem.impact === 'medium' ? '🟡' : '🟢'
                  return `
              <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #d1d5db;">
                <p style="margin: 0 0 3px 0; color: #1f2937; font-weight: bold;">
                  ${impactEmoji} ${problem.title}
                </p>
                <p style="margin: 0 0 3px 0; color: #6b7280; font-size: 11px;">${problem.description}</p>
                <p style="margin: 0; color: #2563eb; font-size: 11px; font-style: italic;">Solução: ${problem.solution}</p>
              </div>
            `
                })
                .join('')}
            </div>
          </div>
            `
              : ''
          }
        </div>
      `
          }
        )
        .join('')}

      <!-- Plano de Ação Completo -->
      <h3 style="color: #1e40af; margin: 40px 0 20px 0; font-size: 22px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Plano de Ação (${result.topPriorities.length} Ações)</h3>
      <div style="font-size: 13px;">
        ${result.topPriorities
          .map((priority: any, idx: number) => {
            const difficultyEmoji = priority.difficulty === 'easy' ? '🟢' : priority.difficulty === 'medium' ? '🟡' : '🔴'
            return `
        <div style="background: white; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 15px; border-radius: 6px; page-break-inside: avoid;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <span style="background: #dbeafe; color: #0c4a6e; padding: 4px 10px; border-radius: 4px; font-weight: bold; min-width: 30px; text-align: center;">
              ${idx + 1}
            </span>
            <span style="color: #1e40af; font-weight: bold; flex: 1;">${priority.action}</span>
          </div>
          <div style="margin-left: 40px; color: #666;">
            <div style="display: flex; gap: 15px; font-size: 12px; margin-top: 8px; flex-wrap: wrap;">
              <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">
                ${difficultyEmoji} ${priority.difficulty === 'easy' ? 'Fácil' : priority.difficulty === 'medium' ? 'Médio' : 'Difícil'}
              </span>
              <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">
                ⏱️ ${priority.timeToImplement}
              </span>
              <span style="background: #ecfdf5; padding: 4px 8px; border-radius: 4px; color: #065f46; font-weight: bold;">
                📊 ${priority.potentialROI}
              </span>
              ${priority.channel ? `<span style="background: #dbeafe; padding: 4px 8px; border-radius: 4px; color: #0c4a6e; font-weight: bold;">📱 ${priority.channel}</span>` : ''}
            </div>
          </div>
        </div>
      `
          })
          .join('')}
      </div>

      <!-- Recomendação -->
      <div style="background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%); border-left: 4px solid #3b82f6; padding: 25px; border-radius: 8px; margin: 40px 0; font-style: italic;">
        <p style="margin: 0; color: #075985; font-size: 16px; line-height: 1.6;">"${result.recommendation}"</p>
      </div>

      <!-- Contexto do Negócio -->
      ${
        result.businessTypeContext
          ? `
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #f3fcf1 100%); border-left: 4px solid #10b981; padding: 25px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0; color: #065f46; font-weight: bold; font-size: 14px;">💡 CONTEXTO PARA SUA ESTRATÉGIA</p>
        <p style="margin: 0; color: #047857; font-size: 14px; line-height: 1.6;">${result.businessTypeContext}</p>
      </div>
        `
          : ''
      }

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
    html2pdfLib().set(options).from(element).save()
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    alert(`Erro ao gerar PDF: ${error instanceof Error ? error.message : 'Tente novamente'}`)
  }
}
