<script setup lang="ts">
import { onMounted } from "vue";
import Cabecalho from "../components/cabecalho.vue";
import Footer from "../components/footer.vue";

// Otimização de Imagens: Adicionado parâmetros de largura (w=600) e qualidade (q=75) para performance
const categorias = [
  {
    nome: "Farinhas Artesanais",
    sub: "Moídas em pedra, puras e sem conservantes",
    img: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=600&q=75",
  },
  {
    nome: "Café de Altitude",
    sub: "Grãos selecionados por especialistas da roça",
    img: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=600&q=75",
  },
  {
    nome: "Rapadura Pura",
    sub: "O doce tradicional na sua forma mais nobre",
    
    img: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=600&q=75",
  },
  {
    nome: "Grãos Selecionados",
    sub: "Colheita manual e secagem natural ao sol",
    img: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=600&q=75",
  },
];

const diferenciais = [
  {
    numero: "100%",
    titulo: "Pureza Rastreável",
    desc: "Saber exatamente quem plantou.",
  },
  {
    numero: "+40",
    titulo: "Famílias Unidas",
    desc: "Fomento direto ao pequeno produtor.",
  },
  {
    numero: "0%",
    titulo: "Aditivos Químicos",
    desc: "Apenas o tempo e o sol da terra.",
  },
];

onMounted(() => {
  const els = document.querySelectorAll(".reveal");

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("active");
        } else {
          e.target.classList.remove("active");
        }
      });
    },
    {
      threshold: 0.05, // Reduzido levemente para disparar antes e evitar travamentos ao rolar rápido
      rootMargin: "-20px 0px",
    },
  );

  els.forEach((el) => obs.observe(el));
});
</script>

<template>
  <link
    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
    rel="stylesheet"
  />

  <div
    class="min-h-screen bg-[#FAF6F0] text-[#1E1A16] font-sans antialiased overflow-x-hidden selection:bg-[#C49A55]/20"
  >

    <section
      class="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <div class="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1600&q=75"
          class="w-full h-full object-cover filter brightness-[0.78] contrast-[1.02]"
          alt="Amanhecer majestoso na roça"
        />
      </div>

      <div class="relative z-40 max-w-5xl mx-auto text-center px-6">
        <div class="reveal">
          <div
            class="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
          >
            <span class="w-2 h-2 rounded-full bg-[#C49A55]"></span>
            <span
              class="text-[10px] tracking-[0.3em] uppercase text-white font-semibold"
              >Lotes Limitados Direto do Produtor</span
            >
          </div>

          <h1
            class="font-serif mt-10 text-6xl sm:text-8xl lg:text-9xl font-bold text-white whitespace-pre-line leading-[1.05] tracking-tight drop-shadow-md"
          >
            A nobreza do<br />
            <span class="italic text-[#EBD3A9] font-normal font-serif"
              >campo vivo</span
            >
          </h1>

          <p
            class="mt-8 text-white max-w-2xl mx-auto text-lg sm:text-2xl font-light leading-relaxed drop-shadow-sm"
          >
            Alimentos raros, criados sem pressa, colhidos com respeito e
            entregues com a sua integridade intocada.
          </p>

          <div
            class="mt-14 flex flex-col sm:flex-row gap-6 justify-center items-center relative z-30"
          >
            <RouterLink
              to="/catalogo"
              class="group relative px-12 py-5 bg-[#C49A55] text-white rounded-full font-medium tracking-wider overflow-hidden shadow-2xl shadow-[#C49A55]/30 hover:shadow-[#C49A55]/50 transition-all duration-500 transform hover:-translate-y-1 block"
            >
              <span
                class="relative z-10 flex items-center gap-3 text-sm uppercase tracking-widest font-bold"
              >
                Acessar Catálogo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
              <div
                class="absolute inset-0 bg-black/10 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-400 ease-out"
              ></div>
            </RouterLink>

            <button
              class="group relative px-12 py-5 bg-[#C49A55] text-white rounded-full font-medium tracking-wider overflow-hidden shadow-2xl shadow-[#C49A55]/30 hover:shadow-[#C49A55]/50 transition-all duration-500 transform hover:-translate-y-1 block cursor-pointer"
            >
              <span
                class="relative z-10 flex items-center gap-3 text-sm uppercase tracking-widest font-bold"
              >
                Ver Origem
                <span
                  class="w-12 h-[1px] bg-white/40 group-hover:w-20 group-hover:bg-white transition-all duration-500 ease-out"
                ></span>
              </span>
              <div
                class="absolute inset-0 bg-black/10 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-400 ease-out"
              ></div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="relative z-30 -mt-20 max-w-6xl mx-auto px-6">
      <div
        class="bg-[#FDFCFB] rounded-[40px] p-10 sm:p-14 border border-[#ECE6DC] shadow-2xl shadow-black/[0.02] grid md:grid-cols-3 gap-12 md:divide-x md:divide-[#ECE6DC]"
      >
        <div
          v-for="(item, idx) in diferenciais"
          :key="idx"
          class="reveal text-center md:text-left md:first:pl-0 md:pl-10 space-y-3"
          :style="{ transitionDelay: idx * 80 + 'ms' }"
        >
          <div class="flex items-center justify-between">
            <span class="font-serif text-5xl font-bold text-[#C49A55] block">{{
              item.numero
            }}</span>
            <span class="text-xs font-mono text-black/20 font-bold"
              >// 0{{ idx + 1 }}</span
            >
          </div>
          <h4 class="text-md font-bold tracking-wide text-[#1E1A16]">
            {{ item.titulo }}
          </h4>
          <p class="text-sm text-black/50 font-light leading-relaxed">
            {{ item.desc }}
          </p>
        </div>
      </div>
    </section>

    <section class="py-40 relative">
      <div class="max-w-7xl mx-auto px-6">
        <div
          class="reveal flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-8"
        >
          <div class="space-y-4">
            <span
              class="text-xs font-bold tracking-[0.3em] uppercase text-[#C49A55] block"
              >Coleções de Origem</span
            >
            <h2
              class="font-serif text-5xl sm:text-7xl font-bold tracking-tight leading-none"
            >
              O melhor de cada safra
            </h2>
          </div>
          <div class="lg:max-w-md w-full border-l-2 border-[#C49A55]/30 pl-6">
            <p class="text-black/60 text-base font-light leading-relaxed">
              Trabalhamos exclusivamente com micro-lotes safrados. Quando um
              produto se esgota, ele só retorna na próxima estação biológica.
            </p>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(c, i) in categorias"
            :key="c.nome"
            class="reveal group relative overflow-hidden rounded-[40px] h-[540px] cursor-pointer shadow-lg"
            :style="{ transitionDelay: i * 80 + 'ms' }"
          >
            <img
              :src="c.img"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition transform duration-700 ease-out"
              alt="Categoria"
              loading="lazy"
            />

            <div
              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
            ></div>

            <span
              class="absolute top-8 right-8 font-serif text-white/40 text-lg group-hover:text-[#EBD3A9] transition-colors duration-300"
            >
              {{ c.numero }}
            </span>

            <div
              class="absolute bottom-6 left-6 right-6 p-6 rounded-[28px] bg-black/40 border border-white/10 group-hover:border-white/20 group-hover:bg-black/60 transition-all duration-300 shadow-2xl"
            >
              <span
                class="text-[9px] uppercase tracking-[0.25em] text-[#EBD3A9] font-bold block mb-1"
                >Cultura Familiar</span
              >
              <h3
                class="font-serif text-white text-2xl font-bold tracking-wide"
              >
                {{ c.nome }}
              </h3>

              <p
                class="text-white/80 text-xs mt-2 font-light leading-relaxed opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out"
              >
                {{ c.sub }}
              </p>

              <div
                class="mt-4 w-10 h-[2px] bg-[#C49A55] group-hover:w-full transition-all duration-300"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="py-40 bg-[#F5EFE4] border-y border-[#EDE4D5] relative overflow-hidden"
    >
      <div
        class="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center"
      >
        <div class="lg:col-span-5 space-y-10 reveal">
          <span
            class="text-xs font-bold tracking-[0.3em] uppercase text-[#C49A55] block"
            >Filosofia Ancestral</span
          >
          <h2
            class="font-serif text-5xl sm:text-6xl font-bold leading-[1.08] tracking-tight"
          >
            No compasso e ritmo sagrado da terra.
          </h2>
          <p class="text-black/75 text-lg font-light leading-relaxed">
            Rejeitamos a aceleração do mercado. Nossos produtores parceiros
            respeitam o ciclo das águas, os descansos do solo e colhem cada item
            na sua maturidade máxima.
          </p>

          <div
            class="p-8 rounded-[32px] bg-[#FAF6F0] border border-[#EDE4D5] shadow-lg space-y-4"
          >
            <p class="italic text-[#4A423A] font-serif text-xl leading-relaxed">
              "A terra não responde a cronômetros industriais. Quem tem
              paciência colhe preciosidades."
            </p>
            <div class="flex items-center gap-4 pt-2">
              <div class="w-8 h-[1px] bg-[#C49A55]"></div>
              <span
                class="text-xs uppercase tracking-widest font-bold text-black/60"
                >— Bené, Mestre Cafeeiro</span
              >
            </div>
          </div>
        </div>

        <div class="lg:col-span-7 grid grid-cols-12 gap-6 relative reveal">
          <div
            class="absolute -inset-4 border-2 border-dashed border-[#C49A55]/20 rounded-[48px] pointer-events-none transform rotate-1"
          ></div>

          <div class="col-span-7 relative">
            <img
              class="rounded-[40px] h-[450px] w-full object-cover shadow-2xl border-4 border-white/50 transform hover:-rotate-1 transition duration-500"
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=700&q=75"
              alt="Plantação real"
            />
            <div
              class="absolute -bottom-6 -left-6 bg-[#C49A55] text-white font-serif p-5 rounded-3xl shadow-xl text-center hidden sm:block"
            >
              <span class="block text-2xl font-bold">100%</span>
              <span class="text-[9px] uppercase tracking-wider">Natural</span>
            </div>
          </div>

          <div class="col-span-5 mt-20">
            <img
              class="rounded-[40px] h-[380px] w-full object-cover shadow-2xl border-4 border-white/50 transform hover:rotate-1 transition duration-500"
              src="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=500&q=75"
              alt="Colheita autêntica"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="py-40 relative">
      <div class="max-w-7xl mx-auto px-6">
        <div
          class="reveal relative overflow-hidden rounded-[64px] min-h-[580px] flex items-center justify-center text-center p-8 shadow-3xl"
        >
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=75"
            class="absolute inset-0 w-full h-full object-cover filter brightness-[0.65]"
            alt="Fundo"
          />

          <div class="absolute inset-0 bg-black/10"></div>

          <div class="relative max-w-3xl px-4 z-10 space-y-6">
            <span
              class="text-xs uppercase tracking-[0.5em] text-[#EBD3A9] font-bold block"
              >Assinatura de Lotes</span
            >

            <h3
              class="font-serif text-5xl sm:text-7xl font-bold text-white leading-[1.1] tracking-tight"
            >
              A alta cultura da roça,<br />direto para sua mesa
            </h3>

            <p
              class="text-white/80 text-base sm:text-xl font-light max-w-xl mx-auto leading-relaxed"
            >
              Sabores autênticos, safras limitadas e produtos de origem
              totalmente nobre.
            </p>

            <div class="pt-6">
              <RouterLink
                to="/catalogo"
                class="inline-flex px-14 py-5 bg-white text-[#1E1A16] hover:bg-[#C49A55] hover:text-white rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Garantir Minha Cesta
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer class="border-t border-[#EDE4D5]" />
  </div>
</template>

<style scoped>
.font-sans {
  font-family: "Plus Jakarta Sans", sans-serif;
}
.font-serif {
  font-family: "Playfair Display", serif;
}

/* Otimizado: Removido o will-change abusivo daqui para evitar gargalo de hardware de vídeo */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 1s cubic-bezier(0.215, 0.61, 0.355, 1),
    transform 1s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
</style>