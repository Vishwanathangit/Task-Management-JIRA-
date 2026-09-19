import app from './app';
import { env } from './config/env';

app.listen(env.PORT, (): void => {
  console.log(`Server running on port ${env.PORT}`);
});
