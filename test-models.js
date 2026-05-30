const Anthropic = require('@anthropic-ai/sdk').default;

const models = [
  'claude-opus-4-1-20250805',
  'claude-opus-4-20250514',  
  'claude-opus-20250219',
  'claude-3-opus-20250219',
  'claude-3-5-sonnet-20241022',
  'claude-3-sonnet-20240229',
  'claude-opus',
  'claude-sonnet',
  'claude-haiku'
];

(async () => {
  const apiKey = process.env.ANTHROPIC_API_KEY || 'sk-ant-test';
  console.log(`Testing models with API key: ${apiKey.slice(0, 20)}...`);
  
  for (const model of models) {
    try {
      const client = new Anthropic({ apiKey });
      console.log(`\n⏳ Testing: ${model}`);
      
      const msg = await client.messages.create({
        model: model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }]
      });
      
      console.log(`✅ WORKS: ${model}`);
      console.log(`   Response: ${msg.content[0].text}`);
      process.exit(0);
    } catch (error) {
      const errorMsg = error.message.split('\n')[0];
      console.log(`❌ ${model}: ${errorMsg.substring(0, 80)}`);
    }
  }
  
  console.log('\n❌ Nenhum modelo funcionou!');
})();
