import app from './app';
import { initCronJobs } from './services/cron.service';

const PORT = process.env.PORT || 5000;

// Initialize background tasks
initCronJobs();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
