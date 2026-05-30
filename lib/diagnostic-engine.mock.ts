/**
 * ⚠️ DEPRECATED: Mock Diagnostic Engine
 *
 * Este arquivo está DESABILITADO.
 * Dados mock INVENTAM informações e violam integridade de dados.
 * Use /api/audit para coleta de dados REAIS apenas.
 *
 * @deprecated Não use em produção
 */

import { DiagnosticInput, DiagnosticResult } from './diagnostic-engine'

class MockDiagnosticEngine {
  async analyze(_input: DiagnosticInput): Promise<DiagnosticResult> {
    throw new Error(
      '❌ MockDiagnosticEngine is DISABLED. ' +
      'Use real data collection via /api/audit instead.'
    )
  }
}

export const mockDiagnosticEngine = new MockDiagnosticEngine()
