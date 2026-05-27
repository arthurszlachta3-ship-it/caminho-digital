'use client'

import Link from 'next/link'
import { ArrowRight, Zap, Brain, BarChart3, MessageSquare, Sparkles, Check, Star, TrendingUp, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* NAVBAR */}
        <nav className="fixed top-0 w-full z-40 backdrop-blur-md bg-black/80 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:shadow-blue-500/80 transition">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent hidden sm:inline">Caminho Digital</span>
            </Link>

            <div className="flex gap-4">
              <Link
                href="/diagnostico"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition duration-200 text-sm sm:text-base"
              >
                Diagnóstico Gratuito
              </Link>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
          <div className="max-w-6xl mx-auto w-full">
            {/* Badge */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center gap-2 backdrop-blur-sm hover:bg-blue-500/20 hover:border-blue-500/50 transition duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-300">Potencializado por IA</span>
              </motion.div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-center leading-tight mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="text-white">Sua presença digital</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 bg-clip-text text-transparent">amplificada por IA</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-lg sm:text-xl text-gray-300 text-center max-w-3xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Caminho Digital analisa sua presença digital em tempo real. 10 agentes de IA especializados monitoram cada canal, identificam problemas e entregam recomendações estratégicas no seu painel.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Link
                href="/diagnostico"
                className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg overflow-hidden"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur-xl bg-gradient-to-r from-blue-600 to-blue-500 -z-10 group-hover:blur-2xl"></div>

                {/* Main button shadow */}
                <div className="absolute inset-0 rounded-xl shadow-2xl shadow-blue-500/50 opacity-0 group-hover:opacity-100 transition duration-300"></div>

                <span className="relative z-10 flex items-center justify-center gap-2">
                  Fazer Diagnóstico Gratuito
                  <motion.div whileHover={{ x: 3 }}>
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </span>
              </Link>

              <Link
                href="/planos"
                className="group px-8 py-4 rounded-xl border border-blue-500/50 text-white font-bold text-lg backdrop-blur-sm hover:bg-blue-500/10 hover:border-blue-400/80 transition duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-blue-500/5 group-hover:to-blue-500/10 transition duration-300"></div>
                <span className="relative">Ver Planos</span>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className="flex items-center gap-2 hover:text-blue-300 transition">
                <Check className="w-4 h-4 text-blue-400" />
                <span>Diagnóstico gratuito</span>
              </div>
              <div className="flex items-center gap-2 hover:text-blue-300 transition">
                <Check className="w-4 h-4 text-blue-400" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2 hover:text-blue-300 transition">
                <Check className="w-4 h-4 text-blue-400" />
                <span>Resultados em tempo real</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* DASHBOARD PREVIEW SECTION */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-4xl sm:text-5xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Seu Dashboard Premium
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Visualize todos os insights de IA em um painel intuitivo, moderno e potente
              </p>
            </motion.div>

            {/* Dashboard Mockup */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Enhanced Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-cyan-500/30 to-blue-600/30 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition duration-500 -z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-50 transition duration-500 -z-10"></div>

              {/* Main mockup card with glassmorphism */}
              <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-2xl rounded-3xl border border-slate-700/40 p-8 overflow-hidden shadow-2xl">
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

                {/* Top bar with glassmorphism */}
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-700/30 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg shadow-blue-500/50"></div>
                    <div className="h-3 w-40 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                    <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                  </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid md:grid-cols-3 gap-6 relative z-10">
                  {/* Score Card */}
                  <motion.div
                    className="md:col-span-1 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 backdrop-blur-md rounded-2xl p-6 border border-blue-500/40 hover:border-blue-500/70 transition group/card"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <p className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">Score Geral</p>
                    <motion.div
                      className="text-5xl font-black text-white mb-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                    >
                      87
                    </motion.div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: '87%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">Excelente desempenho</p>
                  </motion.div>

                  {/* Channel Cards */}
                  {[
                    { name: 'Instagram', score: 92, emoji: '📱' },
                    { name: 'TikTok', score: 78, emoji: '🎬' }
                  ].map((channel, i) => (
                    <motion.div
                      key={i}
                      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/40 hover:border-blue-500/60 transition group/card hover:bg-slate-800/70"
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-lg mb-2">{channel.emoji}</p>
                          <p className="font-semibold text-white">{channel.name}</p>
                        </div>
                        <motion.span
                          className="text-2xl font-bold text-blue-400"
                          initial={{ opacity: 0, x: 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          {channel.score}
                        </motion.span>
                      </div>
                      <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${channel.score}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        ></motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom insights with glassmorphism */}
                <div className="grid md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-700/30 relative z-10">
                  {[
                    { value: '↑ 23%', label: 'Crescimento previsto', color: 'text-emerald-400' },
                    { value: '→ 5', label: 'Ações prioritárias', color: 'text-blue-400' },
                    { value: '24/7', label: 'Monitoramento IA', color: 'text-cyan-400' }
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      className="text-center p-4 rounded-lg bg-slate-800/30 border border-slate-700/20 hover:bg-slate-800/50 hover:border-blue-500/30 transition"
                      whileHover={{ scale: 1.05 }}
                    >
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-gray-400 mt-2">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-blue-950/5">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-4xl sm:text-5xl font-black text-center mb-20 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              Como funciona
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { num: '01', title: 'Preencha o formulário', desc: 'Compartilhe suas redes sociais e dados da sua empresa em 2 minutos' },
                { num: '02', title: 'IA analisa tudo', desc: '10 agentes especializados avaliam sua presença em Instagram, TikTok, YouTube, Website' },
                { num: '03', title: 'Receba seu score', desc: 'Diagnóstico detalhado com score, problemas identificados e ações rápidas' }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition duration-300"></div>
                  <div className="relative p-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-md group-hover:border-blue-500/60 group-hover:bg-blue-500/10 transition duration-300">
                    <motion.div
                      className="text-5xl font-black text-blue-500/40 mb-4"
                      whileHover={{ scale: 1.1 }}
                    >
                      {step.num}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                    <p className="text-gray-400">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI AGENTS SECTION */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent pointer-events-none"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-4xl sm:text-5xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                10 Agentes de IA Especializados
              </h2>
              <p className="text-center text-gray-400 max-w-2xl mx-auto text-lg">
                Cada agente é especializado em um canal e trabalha 24/7 analisando, monitorando e gerando insights estratégicos sobre sua presença digital.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { icon: '📱', name: 'Instagram', desc: 'Análise de feed' },
                { icon: '🎬', name: 'TikTok', desc: 'Tendências virais' },
                { icon: '📺', name: 'YouTube', desc: 'Performance de vídeos' },
                { icon: '🌐', name: 'Website', desc: 'SEO e conversão' },
                { icon: '🧠', name: 'Master AI', desc: 'Orquestração' }
              ].map((agent, i) => (
                <motion.div
                  key={i}
                  className="group p-6 rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent hover:border-blue-500/60 hover:bg-blue-500/15 transition duration-300 cursor-pointer relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{ y: -4 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/5 transition duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-3">{agent.icon}</div>
                    <h3 className="font-bold text-white mb-1">{agent.name}</h3>
                    <p className="text-xs text-gray-400">{agent.desc}</p>
                    <motion.div
                      className="mt-3 h-1 w-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition duration-300"
                      whileHover={{ width: '100%' }}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-950/5 to-black relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.h2
              className="text-4xl sm:text-5xl font-black text-center mb-16 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              O que você ganha
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {[
                { icon: <BarChart3 className="w-8 h-8" />, title: 'Score em Tempo Real', desc: 'Veja seu score de presença digital atualizado sempre que os agentes analisam seus canais', color: 'from-blue-600 to-blue-500' },
                { icon: <Zap className="w-8 h-8" />, title: 'Ações Rápidas', desc: 'Recomendações práticas que você implementa em minutos para melhorar seu desempenho', color: 'from-cyan-600 to-blue-500' },
                { icon: <Brain className="w-8 h-8" />, title: 'Inteligência de IA', desc: 'Agentes especializados analisam seus canais com a tecnologia mais avançada', color: 'from-blue-600 to-cyan-500' },
                { icon: <MessageSquare className="w-8 h-8" />, title: 'Painel Completo', desc: 'Dashboard intuitivo mostra tudo que você precisa saber sobre sua presença online', color: 'from-cyan-600 to-blue-500' }
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  className="flex gap-6 p-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/15 hover:border-blue-500/60 transition duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <motion.div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-2xl transition duration-300`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {benefit.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-white">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-1/2 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"
              animate={{ y: [0, 30, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            ></motion.div>
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"
              animate={{ y: [0, -30, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            ></motion.div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-5xl sm:text-6xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
                Pronto para amplificar sua presença?
              </h2>
              <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                Faça um diagnóstico gratuito em 2 minutos. Sem compromisso. Nenhum cartão de crédito necessário.
              </p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Link
                  href="/diagnostico"
                  className="group relative px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg overflow-hidden"
                >
                  {/* Multi-layer glow */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-blue-600 to-blue-500 -z-10 group-hover:blur-xl"></div>
                  <div className="absolute inset-0 rounded-xl shadow-2xl shadow-blue-500/50 opacity-0 group-hover:opacity-100 transition duration-300"></div>

                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Começar Diagnóstico Gratuito
                    <motion.div whileHover={{ x: 4 }}>
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              className="flex flex-wrap justify-center gap-6 mt-16 pt-12 border-t border-blue-500/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {[
                { icon: <Star className="w-5 h-5" />, label: 'Diagnóstico Gratuito' },
                { icon: <TrendingUp className="w-5 h-5" />, label: 'Resultados Reais' },
                { icon: <Shield className="w-5 h-5" />, label: 'Sem Cartão Necessário' }
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-300 transition"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-blue-400">{badge.icon}</div>
                  <span className="text-sm font-medium">{badge.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-blue-500/10 bg-gradient-to-b from-black to-blue-950/10 relative">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12 mb-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50 group-hover:shadow-blue-500/80 transition">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold mb-2 text-white">Caminho Digital</h3>
              <p className="text-gray-500 text-sm">Sua presença digital amplificada por IA</p>
            </motion.div>

            {[
              { title: 'Produto', links: [
                { label: 'Diagnóstico', href: '/diagnostico' },
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Planos', href: '/planos' }
              ]},
              { title: 'Empresa', links: [
                { label: 'Sobre nós', href: '#' },
                { label: 'Blog', href: '#' },
                { label: 'Contato', href: '#' }
              ]},
              { title: 'Legal', links: [
                { label: 'Privacidade', href: '#' },
                { label: 'Termos', href: '#' },
                { label: 'Cookies', href: '#' }
              ]}
            ].map((column, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-bold mb-4 text-white">{column.title}</h4>
                <ul className="space-y-3 text-gray-400 text-sm">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <Link href={link.href} className="hover:text-blue-400 transition duration-200">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="border-t border-blue-500/10 pt-8 text-center text-gray-500 text-sm relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <p>&copy; 2026 Caminho Digital. Todos os direitos reservados. | Potencializado por IA</p>
          </motion.div>
        </footer>
      </div>
    </div>
  )
}
