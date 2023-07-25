import { AppConfig } from "./app.config";

export function configurationFactory(
  config: AppConfig,
  configDeps: (() => Function)[]
): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise((resolve, reject) => {
      config.load().then(data => {
        // Return resolved Promise when dependant functions are resolved
        return Promise.all(configDeps.map(dep => dep())); // configDeps received from the outside world
      }).then(() => {
        // Once configuration dependencies are resolved, then resolve factory
        resolve(true);
      }).catch((error) => {
        reject(error);
      });
    });
  };
}
