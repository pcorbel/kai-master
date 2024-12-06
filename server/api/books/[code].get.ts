export default defineEventHandler(async (event) => {
  // Extract the book code
  const code = event.context.params?.code;

  // Check if the book code is provided
  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: "Book code is required",
    });
  }

  // Fetch the book data from the Project Aon website
  return await $fetch(
    `https://www.projectaon.org/en/xhtml/lw/${code}/${code}.zip`
  );
});
