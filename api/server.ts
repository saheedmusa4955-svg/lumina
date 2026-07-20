import app from './index.ts';

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`[Backend] Express server listening on port ${port}`);
});
