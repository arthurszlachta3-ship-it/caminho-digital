const Anthropic = require('@anthropic-ai/sdk').default;

(async () => {
  const key = process.env.ANTHROPIC_API_KEY;
  
  if (!key) {
    console.log('❌ ANTHROPIC_API_KEY não está configurada');
    process.exit(1);
  }
  
  console.log(`Testando com chave: ${key.slice(0, 20)}...`);
  
  try {
    const client = new Anthropic({ apiKey: key });
    const msg = await client.messages.create({
      model: 'claude-opus',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'test' }]
    });
    
    console.log('✅ SUCESSO! API do Anthropic está funcionando');
    console.log(`   Resposta: ${msg.content[0].text}`);
    process.exit(0);
  } catch(e) {
    console.log('❌ ERRO na API do Anthropic:');
    console.log(`   ${e.message.split('\n')[0]}`);
    process.exit(1);
  }
})();
