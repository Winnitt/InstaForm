import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

process.on('uncaughtException', err => {
  console.log(`Uncaught Exception: ${err.name} - ${err.message}`);
  process.exit(1); // Exit the process after handling uncaught exception
});

mongoose
  .connect(process.env.DATABASE!)
  .then(() => console.log('DB connection successful!'))
  .catch((err) => {
    console.error('DB connection failed:', err); // Log the complete error object
    console.error('Error details:', err.message); // Log the specific error message
    process.exit(1); // Exit the process to avoid running with no DB connection
  });

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

process.on('unhandledRejection', err => {
  if (err instanceof Error) {
    console.log(`Unhandled Rejection: ${err.name} - ${err.message}`);
  }
  server.close(() => {
    process.exit(1);
  });
});
