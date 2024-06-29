enum Environments {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
  TEST = 'TEST',
}

export type EnvironmentVariableType = { [key: string]: string | undefined };

export type ConfigurationType = ReturnType<typeof getConfig>;

/*Функция возвращает объект с тремя вложенными объектами:
  ---apiSettings: Содержит настройки для API-сервера, такие как PORT
   (порт, на котором будет работать сервер) и LOCAL_HOST 
   (локальный адрес хоста).
----databaseSettings: Содержит настройки для подключения к базе
 данных, такие как MONGO_CONNECTION_URI
  (строка подключения к MongoDB).
------environmentSettings: Содержит флаги, определяющие,
 находится ли приложение в режиме разработки (currentEnv) 
 или тестирования (isTesting).*/
const getConfig = (environmentVariables: EnvironmentVariableType) => {
  return {
    apiSettings: {
      PORT: Number.parseInt(environmentVariables.PORT || '3000'),
    },
    authSettings: {
      ACCESSTOKEN_SECRET:
        environmentVariables.ACCESSTOKEN_SECRET || 'AccessConfig',
      RefreshTOKEN_SECRET:
        environmentVariables.environmentVariables || 'RefreshConfig',
    },

    databaseSettings: {
      MONGO_CONNECTION_URI: environmentVariables.MONGO_URL || ' ',
      MONGO_CONNECTION_URI_FOR_TESTS:
        environmentVariables.MONGO_CONNECTION_URI_FOR_TESTS || ' ',
    },

    environmentSettings: {
      isDevelopment: environmentVariables.ENV === Environments.DEVELOPMENT,
      isTesting: environmentVariables.ENV === Environments.TEST,
      isProduction: environmentVariables.ENV === Environments.PRODUCTION,
      isStaging: environmentVariables.ENV === Environments.STAGING,
    },
  };
};

export default () => {
  /*environmentVariables--здесь будут все 
  переменные из файла .env*/
  const environmentVariables = process.env;

  /*ENV- это переменная у меня в файле .env и это флаг- который даст понять 
  в какой среде выполняется приложение */
  //console.log('process.env.ENV =', environmentVariables.ENV);

  return getConfig(environmentVariables);
};

////////////////////////////////////////////////////////////////////////////

/*export default registerAs('config', () => ({
  apiSettings: {
    PORT: parseInt(process.env.PORT || '3000', 10),
    LOCAL_HOST: process.env.LOCAL_HOST || 'http://localhost:3007',
  },
  databaseSettings: {
    MONGO_CONNECTION_URI:
      process.env.MONGO_CONNECTION_URI ||
      'mongodb+srv://pavvelpotapov:PV2PsPiYpmxxdhn9@cluster0.8s1u6fi.mongodb.net/projectNest13',
  },
  security: {
    ACCESSTOKEN_SECRET: process.env.ACCESSTOKEN_SECRET || '12secret',
  },
  environmentSettings: {
    currentEnv: process.env.ENV || 'DEVELOPMENT',
    isProduction: process.env.ENV === 'PRODUCTION',
    isStaging: process.env.ENV === 'STAGING',
    isTesting: process.env.ENV === 'TEST',
    isDevelopment:
      process.env.ENV !== 'PRODUCTION' &&
      process.env.ENV !== 'STAGING' &&
      process.env.ENV !== 'TEST',
  },
}));*/

/*
enum Environments {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
  TEST = 'TEST',
}

export type EnvironmentVariable = { [key: string]: string | undefined };

export type ConfigurationType = ReturnType<typeof getConfig>;

const getConfig = (
  environmentVariables: EnvironmentVariable,
  currentEnvironment: Environments,
) => {
  return {
    apiSettings: {
      PORT: Number.parseInt(environmentVariables.PORT || '3000'),
      LOCAL_HOST: environmentVariables.LOCAL_HOST || 'http://localhost:3007',
      PUBLIC_FRIEND_FRONT_URL: environmentVariables.PUBLIC_FRIEND_FRONT_URL,
    },

    databaseSettings: {
      MONGO_CONNECTION_URI: '123123123',
      MONGO_CONNECTION_URI_FOR_TESTS:
        environmentVariables.MONGO_CONNECTION_URI_FOR_TESTS,
    },

    environmentSettings: {
      currentEnv: currentEnvironment,
      isProduction: currentEnvironment === Environments.PRODUCTION,
      isStaging: currentEnvironment === Environments.STAGING,
      isTesting: currentEnvironment === Environments.TEST,
      isDevelopment: currentEnvironment === Environments.DEVELOPMENT,
    },
  };
};

export default () => {
  const environmentVariables = process.env;

  console.log('process.env.ENV =', environmentVariables.ENV);
  const currentEnvironment: Environments =
    environmentVariables.ENV as Environments;

  return getConfig(environmentVariables, currentEnvironment);
};
*/
