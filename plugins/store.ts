export default defineNuxtPlugin(async () => {
  const app = useAppStore();
  await app.initialize();
});
