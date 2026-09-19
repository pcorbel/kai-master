/** Every page except the library needs the selected book's content. */
export default defineNuxtRouteMiddleware((to) => {
  if (to.path === "/") return;
  const app = useAppStore();
  if (!app.hasContent) return navigateTo("/");
});
