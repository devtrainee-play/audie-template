# Começando

> **Nota**: Certifique-se de ter concluído as instruções do [React Native - Configuração do Ambiente](https://reactnative.dev/docs/environment-setup) até a etapa "Criando uma nova aplicação" antes de continuar.

## Instalação

```bash
# usando npm
npm install

# OU usando Yarn
yarn install
```

## Passo 1: Inicie o Metro Server

Primeiro, você precisará iniciar o **Metro**, o _bundler_ JavaScript que acompanha o React Native.

Para iniciar o Metro, execute o seguinte comando a partir do diretório _root_ do seu projeto React Native:

```bash
# usando npm
npm run start

# OU usando Yarn
yarn start
```

## Passo 2: Inicie sua Aplicação

Deixe o Metro Bundler rodando em um terminal _separado_. Abra um _novo_ terminal a partir do diretório _root_ do seu projeto React Native. Execute o seguinte comando para iniciar seu app no _Android_ ou no _iOS_:

### Para Android

```bash
# usando npm
npm run android

# OU usando Yarn
yarn android
```

### Para iOS

```bash
# usando npm
npm run ios

# OU usando Yarn
yarn ios
```

Se tudo estiver configurado _corretamente_, você verá seu novo aplicativo rodando no seu _Emulador Android_ ou _Simulador iOS_ em breve, desde que tenha configurado o emulador/simulador corretamente.

Esta é uma maneira de rodar seu aplicativo — você também pode rodá-lo diretamente dentro do Android Studio ou do Xcode, respectivamente.

# Solução de Problemas

Se você não conseguir fazer isso funcionar, consulte a página de [Solução de Problemas](https://reactnative.dev/docs/troubleshooting).

### Problemas Comuns no Build iOS

A maioria dos problemas encontrados durante o processo de build no iOS está relacionada às permissões de acesso à pasta `ios` ou à pasta geral do projeto. Para resolver, você pode ajustar manualmente as permissões ou rodar os comandos em modo **sudo**. Caso prefira, execute o seguinte comando para liberar as permissões:

```bash
chmod 777 "PASTA/ARQUIVO"
```

Para mais informações sobre como ajustar permissões manualmente, consulte o artigo oficial da Apple:  
[Altere as permissões para arquivos, pastas ou discos no Mac](https://support.apple.com/pt-br/guide/mac-help/mchlp1203/mac#:~:text=Para%20aplicar%20permiss%C3%B5es%20a%20todos,e%20escolha%20Arquivo%20%3E%20Obter%20Informa%C3%A7%C3%B5es.&text=ao%20lado%20de%20Compartilhamento%20e%20Permiss%C3%B5es.)

### Problemas Relacionados a Ícones ou Assets

Se os ícones ou o formato dos assets não estiverem no padrão aceito pela Apple, você pode utilizar ferramentas como o **Makeappicon** para gerar os assets no formato correto.

- **Erro**: _Watchkit AppIcon - The app icon set named "AppIcon" did not have any applicable content_  
  **Solução**: Utilize o site [Makeappicon](https://makeappicon.com/) para criar os assets compatíveis.

Mais detalhes:  
[Stack Overflow - Watchkit AppIcon Issue](https://stackoverflow.com/questions/29335509/watchkit-appicon-the-app-icon-set-named-appicon-did-not-have-any-applicable)

### Erros de Sandbox

Se você encontrar erros relacionados à **Sandbox**, como o abaixo:

- **Erro**: _Sandbox: rsync.samba (13105) deny(1) file-write-create, Flutter failed to write to a file_  
  **Solução**: Habilite as permissões para os arquivos descritos na mensagem de erro ou siga a solução descrita no link abaixo:

[Stack Overflow - Sandbox Error Solution](https://stackoverflow.com/questions/76590131/error-while-build-ios-app-in-xcode-sandbox-rsync-samba-13105-deny1-file-w)

### Outros Erros Relacionados ao Xcode

- **Erro**: _No such file or directory error_  
  **Solução**: Certifique-se de que os arquivos mencionados na mensagem de erro estão presentes e habilite as permissões, ou siga as instruções detalhadas no link abaixo:

[Stack Overflow - No Such File or Directory Error](https://stackoverflow.com/questions/10167442/whats-the-xcode-no-such-file-or-directory-error)

### Problemas com `Pod Install` ou `Pod Update`

Se você encontrar erros relacionados ao **Pod Install** ou **Pod Update**, siga as etapas descritas no link abaixo para atualizar os arquivos do projeto `ios`:

[Stack Overflow - Swift Unable to Open File](https://stackoverflow.com/questions/53117077/swift-unable-to-open-file-in-target-xcode-10)

Essas soluções cobrem os principais problemas encontrados durante o desenvolvimento no iOS. Certifique-se de seguir os links de referência para detalhes adicionais.

Aqui está um exemplo de como você pode criar uma seção explicativa em sua documentação ou código para destacar a importância de preencher corretamente as variáveis de ambiente no arquivo `.env`:

### **Configuração de Variáveis de Ambiente**

Certifique-se de preencher o arquivo `.env` corretamente antes de iniciar o projeto. As variáveis abaixo são fundamentais para o funcionamento da aplicação. Aqui está o detalhamento de cada uma delas:

#### **1. AUDIE_API_URL**

- **Descrição**: URL base da API do sistema AUDIE.
- **Importância**: Todas as requisições relacionadas ao sistema AUDIE utilizam essa URL como ponto de partida. Alterar esse valor pode desconectar a aplicação do servidor correto.
- **Exemplo**:
  ```env
  AUDIE_API_URL=https://audieappapi.playlistsolutions.com/
  ```

#### **2. AUDIE_API_KEY**

- **Descrição**: Chave de autenticação para acessar a API do AUDIE.
- **Importância**: Sem essa chave, as requisições à API do AUDIE serão recusadas.
- **Exemplo**:
  ```env
  AUDIE_API_KEY=sua-chave-aqui
  ```

#### **3. VAGALUME_API_KEY**

- **Descrição**: Chave de API para acessar o serviço de letras de música e metadados do Vagalume.
- **Importância**: Necessária para buscar letras, informações e outros dados musicais.
- **Exemplo**:
  ```env
  VAGALUME_API_KEY=sua-chave-aqui
  ```

#### **3.1 Gerando a VAGALUME_API_KEY**

- **Passo a Passo**:
  1. Acesse o site oficial do [Vagalume API](https://api.vagalume.com.br/).
  2. Acesse a documentação e acessa a aba de **credenciais de autorização** no informativo abaixo clique em **Cadastrar-se** ou faça login caso já tenha uma conta.
  3. Após o login, acesse **Meus Dados** no painel do usuário.
  4. Selecione a opção **API**.
  5. Crie uma nova aplicação fornecendo as informações necessárias (nome, descrição, etc.).
  6. Após salvar, sua chave de API estará disponível no painel. Copie a chave gerada.
  7. Adicione a chave ao arquivo `.env`:
     ```env
     VAGALUME_API_KEY=sua-chave-aqui
     ```

#### **4. DISCOGS_KEY e DISCOGS_SECRET**

- **Descrição**: Chave e segredo para autenticação no Discogs, uma base de dados de músicas e artistas.
- **Importância**: Permite que a aplicação obtenha informações detalhadas sobre álbuns, artistas e faixas.
- **Exemplo**:

  ```env
  DISCOGS_KEY=sua-chave-aqui
  DISCOGS_SECRET=seu-segredo-aqui
  ```

#### **4.1 Gerando DISCOGS_KEY e DISCOGS_SECRET**

- **Passo a Passo**:
  1. Acesse o site oficial do [Discogs Developers](https://www.discogs.com/developers).
  2. Faça login com sua conta Discogs ou crie uma nova conta, se necessário - **Create an App**.
  3. Após o login, clique em **Perfil** > **Configurações** na seção de **Desenvolvedor**.
  4. Selecione criar uma aplicação preencha o formulário com as informações solicitadas (nome da aplicação, URL, descrição, etc.).
  5. Ao criar a aplicação, você verá as chaves geradas: **Consumer Key** e **Consumer Secret**.
  6. Copie essas informações e adicione-as ao arquivo `.env`:
     ```env
     DISCOGS_KEY=sua-chave-aqui
     DISCOGS_SECRET=seu-segredo-aqui
     ```

### **Passos para Configuração**

- Solicite as chaves de acesso apropriadas com o administrador ou nos respectivos serviços das APIs.
- Preencha o arquivo `.env` com os valores corretos.
- Reinicie o servidor de desenvolvimento para que as alterações sejam aplicadas:
  ```bash
  npm run reset
  ```

### **Importante!**

- **Segurança**: Nunca compartilhe o arquivo `.env` ou exponha suas chaves em repositórios públicos.
- **Ambientes Diferentes**: Certifique-se de utilizar chaves e URLs específicas para cada ambiente (`dev`, `staging`, `prod`) para evitar configurações erradas.

Seguindo essas instruções, sua aplicação estará pronta para consumir os serviços necessários! 🚀

## **Para desenvolvimento**

### **.env**

É importante ressaltar que o arquivo _.env_ está nomeado como _.env.example_ e que além de configurar os parâmetros dentro do arquivo é importante renomear ele para _.env_

### **babel.config.js**

Para que o projeto seja executado para desenvolvimento primeiramente é preciso configurar o arquivo _babel.config.js_ para que os plugins fiquem de forma certa.

Os plugins devem estar dentro de **plugins:[ ]**.
Se o plugin so tiver o nome como configuração basta apenas adiciona-lo dentro de **plugins:[ ]** com um virgula no final.
Caso ele tenha configurações adicionais primeiramente você precisa abrir e fechar colchetes **[ ],** e dentro dele realizar a seguinte configuração _nome-do-plugin ,_ abre e feche chaves **{ }** e dentro das chaves coloque as configurações _config1:val1,_ _config2:val2_.

Segue um exemplo abaixo:

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    'nativewind/babel',
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ],
  ],
};
```

### Configuração de Universal Links (Deep Linking)

Universal Links (para iOS) e Android App Links (para Android) permitem que links web padrão abram conteúdo específico dentro do seu aplicativo mobile, em vez de apenas o site, proporcionando uma experiência de usuário mais fluida e segura.

#### Android (Android App Links)

Para configurar Android App Links, você precisa estabelecer uma associação verificada entre seu domínio web e seu aplicativo Android.

##### Configuração do Servidor Web

Você precisa ter um domínio próprio em um servidor web (`ex: seu-dominio.com`). Dentro desse domínio, crie um diretório chamado `.well-known` na raiz do seu servidor.

Dentro do diretório .well-known, coloque um arquivo chamado assetlinks.json. Este arquivo deve ser publicamente acessível via HTTPS no caminho exato: https://seu-dominio.com/.well-known/assetlinks.json.

O conteúdo do assetlinks.json deve seguir esta estrutura JSON:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.seunome.seuapp",
      "sha256_cert_fingerprints": [
        "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:00",
        "11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00"
      ]
    }
  }
]
```

- **package_name**: Altere "com.seunome.seuapp" para o ID do pacote real do seu aplicativo Android. Você o encontra no arquivo build.gradle (geralmente app/build.gradle), na seção android { defaultConfig { ... } }, como applicationId. Se o app estiver na Google Play Store, também pode ser encontrado lá.

- **sha256_cert_fingerprints**: Substitua os exemplos pelas impressões digitais SHA256 dos certificados que assinam seu aplicativo. É fundamental incluir a SHA256 do certificado de depuração (debug) e, crucialmente, a do certificado de lançamento (release/produção).

  - **Para Depuração**: No Android Studio, vá em Gradle -> [seu_projeto] -> Tasks -> android -> signingReport.

  - **Para Lançamento**: Use `keytool -list -v -keystore /caminho/para/seu/arquivo.jks` no terminal. Se você usa o App Signing by Google Play, pegue a SHA256 na seção Configuração > Integridade do app no Google Play Console.

- **Validação**: Após hospedar o arquivo, use a ferramenta [Digital Asset Links API Tester](https://developers.google.com/digital-asset-links/tools/generator) do Google para verificar se o `assetlinks.json` está acessível e formatado corretamente.

##### Configuração no AndroidManifest.xml

No arquivo `android/app/src/main/AndroidManifest.xml` do seu projeto React Native, adicione um intent-filter dentro da <activity> que deve lidar com os deep links (geralmente sua MainActivity):

```xml
<activity
    android:name=".MainActivity"
    android:exported="true"> <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>

    <intent-filter android:autoVerify="true"> <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
          <data android:scheme="https"
                android:host="seu-dominio.com"
                android:pathPrefix="/app" />
          <data android:scheme="https"
              android:host="seu-dominio.com"
              android:pathPrefix="/welcome" />
      </intent-filter>

</activity>
```

- `android:exported="true"`: Essencial para que sua Activity possa ser iniciada por links externos.

- `android:autoVerify="true"`: Diz ao Android para verificar a associação com o `assetlinks.json` no seu servidor.

- `android.intent.category.BROWSABLE`: Permite que o deep link seja invocado a partir de um navegador web.

- `android:host`: O domínio exato (sem https:// ou /).

- `android:pathPrefix`: O primeiro segmento do caminho da URL que seu app deve interceptar. O React Navigation fará o roteamento interno a partir daí.

#### iOS (Universal Links)

Para iOS, o processo equivalente é chamado de Universal Links e também exige uma associação segura entre o domínio e o aplicativo.

##### 1. Configuração do Servidor Web (Arquivo AASA)

Crie um arquivo chamado `apple-app-site-association` (sem extensão `.json`) e coloque-o no diretório `/.well-known/` do seu servidor. O caminho final deve ser: `https://seu-dominio.com/.well-known/apple-app-site-association`.

O conteúdo do arquivo deve ser um JSON com a seguinte estrutura:

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "ABCDE12345.com.seunome.seuapp",
        "paths": ["/welcome", "/app/*", "/ep/*"]
      }
    ]
  }
}
```

- **`appID`**: É a junção do seu **Team ID** + **Bundle ID**. Você encontra ambos na aba `Signing & Capabilities` do seu target no Xcode.
- **`paths`**: Uma lista dos caminhos que devem abrir seu app. Use `*` como coringa.

##### Requisitos do Servidor

- O arquivo deve ser servido via **HTTPS**.
- Não pode haver redirecionamentos para o arquivo.
- **`Content-Type`**: O cabeçalho da resposta **deve ser `application/json`**. Caso o `Content-Type` venha diferente procure como mudar no seu servidor.
- **Validação**: Use validadores online como o [AASA Validator da Branch.io](https://branch.io/resources/aasa-validator/) para verificar se seu servidor está configurado corretamente.

##### 2. Configuração no Xcode

1. Abra seu projeto (`.xcworkspace`) no Xcode.
2. Selecione o seu **Target** principal.
3. Vá para a aba **`Signing & Capabilities`**.
4. Clique em **`+ Capability`** e adicione **`Associated Domains`**.
5. Na nova seção, adicione seu domínio com o prefixo `applinks:`. Exemplo: `applinks:seu-dominio.com` (sem `https://`).

   - ✅ **Formato Correto:** `applinks:seu-dominio.com`
   - ❌ **Formato Incorreto:** `applinks:https://seu-dominio.com`

Se você precisar dar suporte a subdomínios, como `www`, adicione uma nova entrada para cada um. Exemplo:

- `applinks:seu-dominio.com`
- `applinks:www.seu-dominio.com`

##### 3. Configuração no Código Nativo (`AppDelegate`)

Para que o React Native receba o evento do clique no link, você precisa adicionar um código nativo no seu `AppDelegate`. Escolha a versão correspondente à linguagem do seu projeto (Objective-C ou Swift).

##### Opção A: Se seu projeto usa Objective-C (`AppDelegate.m`)

Adicione o seguinte código ao seu arquivo `ios/[NomeDoProjeto]/AppDelegate.m`:

```objectivec
// No início do arquivo
#import <React/RCTLinkingManager.h>

// Dentro da implementação @implementation AppDelegate

// Para Universal Links
- (BOOL)application:(UIApplication *)application
continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}

// Para links de apps de terceiros e custom schemes
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}
```

---

##### Opção B: Se seu projeto usa Swift (`AppDelegate.swift`)

Se o seu projeto utiliza Swift, o arquivo a ser modificado será o `AppDelegate.swift`. O código é equivalente e tem a mesma função de encaminhar os eventos de link para o React Native.

```swift
// No início do arquivo, garanta que o React está importado
import React

// Dentro da classe AppDelegate

// Para Universal Links
override func application(
  _ application: UIApplication,
  continue userActivity: NSUserActivity,
  restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    return RCTLinkingManager.application(
      application,
      continue: userActivity,
      restorationHandler: restorationHandler
    )
}

// Para links de apps de terceiros e custom schemes
override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
  return RCTLinkingManager.application(app, open: url, options: options)
}
```

##### Configuração no React Native (com React Navigation)

No seu código React Native, geralmente no arquivo **App.tsx** ou no seu componente de navegação principal (onde seu `NavigationContainer` está), configure o linking para mapear as URLs para as telas do seu app.
O linking deve seguir o padrão de roteamento do seu projeto sendo que,se por exemplo tenha uma stack dentro de outra você deve navegar primeiro para a stack principal depois para a segunda stack e logo em seguida para o componente desejado.

```js
const linking = {
  prefixes: ['https://seu-dominio.com', 'http://seu-domininio.com'], // Seus domínios
  config: {
    screens: {
      WelcomeScreen: 'welcome', // Ex: https://seu-domininio.com/welcome
      MainTabs: {
        path: 'app', // Segmento da URL para o navegador de abas
        screens: {
          HomeTab: {
            path: 'home', // Ex: https://seu-domininio.com/app/home
            screens: {
              // Telas dentro da HomeTab (se tiver Stack aninhada)
            },
          },
        },
      },
      // ... outras rotas
    },
  },
};
```

Apos configura seu liking basta adiciona-lo em seu NavigationContainer

```jsx
<NavigationContainer linking={linking}>
  <MainStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
  <MainStack.Screen name="MainTabs" component={MainTabNavigator} />
</NavigationContainer>
```

Após realizar essas configurações aconselho a esperar alguns minutos e também a deletar o aplicativo e rodar novamente com um --clean-cache

Se tudo estiver configurado corretamente os links clicados referente ao seu aplicativo irão abrir ele ao invés do navegador caso ele esteja instalado

### Gerenciamento de Episódios Offline

Esta seção documenta como o aplicativo gerencia o download, o armazenamento e a exclusão de episódios de podcast para audição offline, utilizando a biblioteca react-native-fs.

Estratégia de Armazenamento

Para o armazenamento dos episódios, utilizamos o diretório RNFS.DocumentDirectoryPath. Esta é uma pasta privada (dentro da "sandbox") que cada aplicativo possui. A escolha por este diretório oferece duas grandes vantagens:

- Sem Permissões Adicionais: Não é necessário solicitar permissões de escrita/leitura ao usuário nem configurar arquivos nativos (AndroidManifest.xml ou Info.plist).

- Ciclo de Vida Gerenciado: Quando o usuário desinstala o aplicativo, o sistema operacional apaga automaticamente este diretório e todo o seu conteúdo, garantindo que nenhum lixo digital seja deixado no dispositivo.

#### Configuração de Download

```js
import RNFS from 'react-native-fs';

const audioUrl =
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

const fileName = 'audio_offline_1.mp3';

const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

export const downloadAudio = async () => {
  try {
    const fileExists = await RNFS.exists(localFilePath);
    if (fileExists) {
      console.log('O arquivo de áudio já existe localmente:', localFilePath);
      return localFilePath;
    }
    const options = {
      fromUrl: audioUrl,
      toFile: localFilePath,
      background: true,
    };

    const downloadResult = await RNFS.downloadFile(options).promise;

    if (downloadResult.statusCode === 200) {
      console.log('Download concluído com sucesso! Salvo em:', localFilePath);
      return localFilePath;
    } else {
      console.error(
        'Falha no download. Status Code:',
        downloadResult.statusCode,
      );
      return null;
    }
  } catch (error) {
    console.error('Erro ao baixar o arquivo:', error);
    return null;
  }
};
```

> O codigo acima é um exemplo de uma função para realizar o download usando a biblioteca `react-native-fs`.

**Pontos Importantes sobre as Opções de Download:**

- **fromUrl**: A URL de origem do arquivo a ser baixado.

- **toFile**: O caminho completo de destino no dispositivo onde o arquivo será salvo.

- **background**: (Booleano) Se true, permite que o download continue mesmo que o aplicativo vá para segundo plano.

- **Outros**: Existe a possibilidade de se passar funções para o options para por exemplo verificar a porcentagem do download. Caso coloque um metodo para lidar com o carregamento, coloque `progressDivider` para limitar o número de callBacks, para não travar o dispositivo.

#### Exclusão de Mídia

Para deletar um episódio baixado, removemos sua pasta dedicada. A função `RNFS.unlink(caminho)` é usada para isso, pois ela pode deletar tanto arquivos individuais quanto pastas inteiras com todo o seu conteúdo.
Uma boa pratica é utilizar o `.exists()` para verificar se o caminho ou arquivo existe antes de deleta-lo.

```js
import RNFS from 'react-native-fs';

const fileName = 'audio_offline_1.mp3';

const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

const deletarFaixaCompleta = async localFilePath => {
  try {
    const existe = await RNFS.exists(localFilePath);
    if (!existe) {
      console.log('Pasta da faixa não encontrada, nada a fazer.');
      return;
    }

    await RNFS.unlink(localFilePath);
    console.log(
      'PASTA DA FAIXA E TODO O SEU CONTEÚDO FORAM DELETADOS:',
      localFilePath,
    );
  } catch (error) {
    console.error('Erro ao deletar a pasta da faixa:', error);
  }
};
```

### Atualizando o Nível da API do Android

Para garantir a compatibilidade com as versões mais recentes do Android e cumprir os requisitos do [Google Play](https://support.google.com/googleplay/android-developer/answer/11926878), é necessário atualizar periodicamente o nível da API do aplicativo.

Este guia descreve o processo de atualização da API 34 (Android 14) para a API 35 (Android 15), mas os princípios se aplicam a futuras atualizações.

**Passo 1:** Modificar build.gradle

O primeiro passo é informar ao Android que seu projeto será compilado e testado com a nova versão do SDK.

1.  Abra o arquivo android/build.gradle.

2.  Modifique os valores de compileSdkVersion e targetSdkVersion para 35.

```groovy
// Exemplo no arquivo android/build.gradle

buildscript {
    ext {
        // ... outras configurações
        compileSdkVersion = 35 // Mude de 34 para 35
        targetSdkVersion = 35  // Mude de 34 para 35
        // ...
    }
    // ...
}
```

**Passo 2:** Adaptar-se às Mudanças de Comportamento

Cada nova versão do Android introduz mudanças que podem afetar seu aplicativo. No Android 15, a mudança mais impactante é a interface Edge-to-Edge (Borda a Borda) ativada por padrão.

Isso significa que o aplicativo ocupará a tela inteira, desenhando seu conteúdo por trás das barras de status (topo) e de navegação (embaixo). É crucial adaptar a UI para evitar que componentes fiquem sobrepostos ou inacessíveis.

**Passo 3:** Limpar Cache e Testar

Após realizar as modificações no código, é fundamental limpar o cache do Metro Bundler para garantir que as novas configurações nativas sejam carregadas corretamente.
**1.** Rode um dos seguintes comandos no seu terminal:

```bash
npm run reset
```

**2.** Compile e rode o aplicativo no emulador ou dispositivo com Android 15.

**3.** Verifique todas as telas, especialmente headers, footers e botões flutuantes, para garantir que não estão sendo sobrepostos pela barra de status ou de navegação.

#### Ações Necessárias (Específico para React Native):

Ajustar a UI com `react-native-safe-area-context`, use a essa biblioteca para lidar com as sobreposições, trocando a tag _SafeAreaView_ do `react-native` para o _SafeAreaView_ dessa biblioteca, pois ele fornece um padding automático para lidar como a sobreposição.

- Para mais detalhes sobre as mudanças e requisitos, consulte a documentação oficial:
  [Migrar para Android 15](https://developer.android.com/about/versions/15/migration?hl=pt-br)