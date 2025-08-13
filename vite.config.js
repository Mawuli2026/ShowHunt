import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        login: resolve(__dirname, "src/login.html"),
        register: resolve(__dirname, "src/register.html"),
        product: resolve(__dirname, "src/product/index.html"),
        productDetail: resolve(__dirname, "src/product/details.html"),
        cart: resolve(__dirname, "src/cart.html"),
        checkout: resolve(__dirname, "src/checkout.html"),
      },
    },
  },
});
