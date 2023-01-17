import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { EOL } from 'os';
import { writeFile } from 'fs/promises';

let smClientConfig;
if (process.env.SM_ACCESS_FILE) {
  smClientConfig = {
    keyFilename: process.env.SM_ACCESS_FILE,
  };
}

// Instantiates a client
const client = new SecretManagerServiceClient(smClientConfig);
const requiredEnvVariables = {
  JWT_SECRET: 'jwt-secret',
  JWT_EXPIRATION: 'jwt-expiration',
  MIKRO_ORM_DB_NAME: 'core-db-name',
  MIKRO_ORM_HOST: 'core-db-host',
  MIKRO_ORM_PORT: 'core-db-port',
  INSTANCE_UNIX_SOCKET: 'instance-unix-socket',
  MIKRO_ORM_USER: 'core-db-user',
  MIKRO_ORM_PASSWORD: 'core-db-pass',
  CORS_ORIGIN: 'corsOrigin',
  PATIENT_CLIENT_DOMAIN: 'url-patient-app',
};

run();

async function run() {
  const promises = Object.keys(requiredEnvVariables).map((key: string) =>
    client.accessSecretVersion({
      name: `projects/490552384022/secrets/${requiredEnvVariables[key]}/versions/1`,
    }),
  );
  const results = await Promise.all(promises);
  const envData = results.map(([version]) => version.payload.data.toString());

  const env = Object.keys(requiredEnvVariables).map((key, i) => `${key}=${envData[i]}`);
  await writeEnvToFile(env);
}

async function writeEnvToFile(envData: any) {
  console.log(envData.join(EOL));
  await writeFile('.env', envData.join(EOL));
}
