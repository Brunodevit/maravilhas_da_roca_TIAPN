<script setup lang="ts">
import { computed, onMounted } from "vue";
import Footer from "../components/footer.vue";
import { useShopStore } from "../stores/shop";
import { addToCart } from "../services/cartService";

const shop = useShopStore();

const carregando = computed(
  () =>
    shop.isLoadingProducts,
);

const favoritos =
  computed(() => {
    return shop.favorites
      .map((fav) => {
        const produto =
          shop.products.find(
            (p) =>
              Number(
                p.id,
              ) ===
              Number(
                fav.ProCodigo,
              ),
          );

        if (!produto)
          return null;

        return {
          ...fav,

          id:
            produto.id,

          name:
            produto.name,

          description:
            produto.description,

          image:
            produto.image,

          price:
            produto.price ??
            (produto as any)
              .ProPreco ??
            (produto as any)
              .preco,

          estoque:
            (produto as any)
              .ProEstoque ??
            (produto as any)
              .stock ??
            (produto as any)
              .estoque,
        };
      })
      .filter(
        Boolean,
      );
  });

const removerFavorito =
  async (
    produtoId:
      | number
      | string,
  ) => {
    try {
      await shop.toggleFavorite(
        Number(
          produtoId,
        ),
      );
    } catch (e) {
      console.error(
        e,
      );
    }
  };

const adicionarAoCarrinho =
  async (
    produto: any,
  ) => {
    const estoque =
      produto.estoque;

    if (
      estoque !==
        undefined &&
      estoque <= 0
    ) {
      alert(
        `Desculpe! O produto "${produto.name}" está temporariamente esgotado. 🌾`,
      );

      return;
    }

    try {
      await addToCart(
        Number(
          produto.id,
        ),
        1,
      );

      shop.addCart(
        1,
      );
    } catch (
      error
    ) {
      console.error(
        "Erro ao adicionar ao carrinho:",
        error,
      );

      shop.addCart(
        -1,
      );
    }
  };

const formatarPreco =
  (
    valor:
      | number
      | string
      | undefined,
  ) =>
    Number(
      valor ??
        0,
    )
      .toFixed(
        2,
      )
      .replace(
        ".",
        ",",
      );

onMounted(
  async () => {
    if (
      !shop
        .products
        .length
    ) {
      await shop.loadProducts();
    }

    await shop.loadFavorites();
  },
);
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-[#FAF6EE] via-[#FDFBF7] to-[#F3EAD9] text-[#4A3728]"
  >
    <section
      class="max-w-6xl mx-auto px-4 pt-16 pb-10 text-center"
    >
      <h1
        class="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-[#362212]"
      >
        Meus Favoritos
      </h1>

      <p
        class="text-[#7A5C43] mt-6 text-base sm:text-xl font-light"
      >
        Seus produtos mais queridos da roça reunidos em um só lugar.
      </p>
    </section>

    <main
      class="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 pb-20"
    >
      <!-- loading -->
      <div
        v-if="
          carregando
        "
        class="flex justify-center items-center py-40"
      >
        <div
          class="w-16 h-16 border-4 border-[#EED9C4]/30 border-t-[#A0522D] rounded-full animate-spin"
        />
      </div>

      <!-- vazio -->
      <div
        v-else-if="
          favoritos.length ===
          0
        "
        class="flex justify-center items-center min-h-[45vh]"
      >
        <div
          class="text-center bg-white/50 rounded-[2rem] border border-dashed border-[#EED9C4] px-10 py-14"
        >
          <div
            class="text-5xl"
          >
            🧺
          </div>

          <h2
            class="mt-5 text-3xl font-serif font-black text-[#362212]"
          >
            Nenhum favorito ainda
          </h2>

          <p
            class="mt-3 text-[#7A5C43]"
          >
            Explore o catálogo e salve seus produtos preferidos.
          </p>
        </div>
      </div>

      <!-- cards -->
      <div
        v-else
        class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-8"
      >
        <div
          v-for="
            item in favoritos
          "
          :key="
            item.id
          "
          class="relative group bg-white rounded-2xl sm:rounded-[2.2rem] border border-[#EED9C4]/20 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div
            class="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2 z-20"
          >
            <!-- favorito -->
            <button
              @click="
                removerFavorito(
                  item.id,
                )
              "
              class="w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/95 border border-[#EED9C4]"
            >
              ❤️
            </button>

            <!-- carrinho igual catálogo -->
            <button
              @click="
                adicionarAoCarrinho(
                  item,
                )
              "
              :class="{
                'opacity-40 cursor-not-allowed':
                  item.estoque !==
                    undefined &&
                  item.estoque <=
                    0,
              }"
              class="w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/95 border border-[#EED9C4] hover:border-[#A0522D] transition shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#422A17]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-6-9v9"
                />
              </svg>
            </button>
          </div>

          <div
            class="aspect-[4/3] bg-[#FAF6EE] overflow-hidden"
          >
            <img
              :src="
                item.image &&
                (
                  item.image.startsWith(
                    'http://',
                  ) ||
                  item.image.startsWith(
                    'https://',
                  )
                )
                  ? item.image
                  : `http://localhost:3000/uploads/${item.image || 'default.png'}`
              "
              :alt="
                item.name
              "
              class="w-full h-full object-cover"
            />
          </div>

          <div
            class="p-3 sm:p-5"
          >
            <h2
              class="font-serif font-black text-[#362212] text-xs sm:text-lg truncate"
            >
              {{
                item.name
              }}
            </h2>

            <p
              class="text-[11px] sm:text-sm text-[#7A5C43] mt-1 line-clamp-2 h-7 sm:h-10"
            >
              {{
                item.description
              }}
            </p>

            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 sm:mt-4"
            >
              <span
                class="text-xs sm:text-lg font-black"
              >
                R$
                {{
                  formatarPreco(
                    item.price,
                  )
                }}
              </span>

              <router-link
                :to="{
                  name:
                    'descricao-produto',
                  params: {
                    id:
                      item.id,
                  },
                }"
                class="text-[10px] sm:text-xs font-semibold py-1 sm:py-2 px-2 sm:px-4 rounded-full text-[#422A17] hover:text-[#A0522D] hover:bg-[#EED9C4]/40 transition"
              >
                Ver detalhes →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>