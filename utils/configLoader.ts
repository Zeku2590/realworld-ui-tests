import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

export type UserConfig = {
  username: string;
  email: string;
  password: string;
};

export type TestConfig = {
  domain: string;
  backendApi: string;
  users: {
    userA: UserConfig;
    userB: UserConfig;
  };
};

let cachedConfig: TestConfig | null = null;

export function loadConfig(): TestConfig {
  if (cachedConfig) return cachedConfig;

  const configPath = path.resolve(process.cwd(),'config', 'config.yaml');
  console.log('Loading config from:',configPath);
  const file = fs.readFileSync(configPath, 'utf8');
  const parsed = yaml.parse(file) as TestConfig;

  cachedConfig = parsed;
  return parsed;
}
