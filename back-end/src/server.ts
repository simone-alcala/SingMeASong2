import app from "./app.js";

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV || 'PROD';
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} - mode ${MODE}`);
});
