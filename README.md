# GameSquare — GitHub Pages

Versão estática do GameSquare, pronta para publicar em um repositório GitHub e hospedar gratuitamente pelo GitHub Pages.

## O que mudou nesta versão

- Removido o servidor Python/Flask: GitHub Pages não executa back-end Python.
- Removido o SQLite: as avaliações são salvas no `localStorage` do navegador.
- Mantidas as três telas: Início, Perfil e Nova review.
- Usuário padrão: `usuariolindo`.
- Paleta azul-claro.
- Capas locais: adicione suas imagens em `assets/covers/`.

**Importante:** `localStorage` é individual por navegador/dispositivo. Uma review feita por um visitante não aparece para outros visitantes. Para reviews compartilhadas entre todos, será necessário conectar uma API e banco de dados hospedados em outro serviço.

## Testar no computador

Você pode abrir `index.html` diretamente no navegador. Para uma experiência mais próxima da hospedagem, use a extensão **Live Server** no VS Code:
1. Abra esta pasta no VS Code.
2. Instale a extensão Live Server.
3. Clique com o botão direito em `index.html`.
4. Selecione **Open with Live Server**.

## Como colocar suas capas

Coloque os arquivos de imagem na pasta `assets/covers/` usando estes nomes:

| Jogo | Nome do arquivo |
|---|---|
| The Legend of Zelda: Breath of the Wild | `zelda.jpg` |
| Elden Ring | `elden-ring.jpg` |
| Minecraft | `minecraft.jpg` |
| Red Dead Redemption 2 | `red-dead-redemption-2.jpg` |
| Hollow Knight | `hollow-knight.jpg` |
| Stardew Valley | `stardew-valley.jpg` |

Aceita JPG, PNG ou WEBP. Se usar outra extensão, abra `assets/app.js` e altere o nome na propriedade `cover` do jogo correspondente. Se não houver imagem, o espaço da capa continua vazio com a indicação "ADICIONE SUA IMAGEM".

## Publicar no GitHub Pages

1. Entre em https://github.com e faça login.
2. Clique em **New repository**.
3. Dê o nome `gamesquare` (ou outro nome que preferir).
4. Marque **Public** e crie o repositório.
5. Dentro do repositório, clique em **Add file > Upload files**.
6. Envie os arquivos e pastas que estão dentro desta pasta (o `index.html` deve ficar na raiz do repositório, não dentro de outra pasta).
7. Clique em **Commit changes**.
8. Abra **Settings > Pages**.
9. Em **Build and deployment**, escolha **Deploy from a branch**.
10. Em **Branch**, selecione `main` e pasta `/ (root)`.
11. Clique em **Save**.
12. Aguarde alguns minutos. A URL será parecida com `https://SEU-USUARIO.github.io/gamesquare/`.

Sempre que alterar os arquivos e fizer um novo commit na branch `main`, o GitHub Pages atualizará o site automaticamente.

## Estrutura do projeto

```text
GameSquare-GitHub/
├── index.html
├── .nojekyll
├── README.md
└── assets/
    ├── app.js
    ├── style.css
    └── covers/
        └── coloque-suas-capas-aqui.txt
```

## Sobre a API e o banco de dados

Esta edição não inclui API Flask nem SQLite porque o GitHub Pages só serve arquivos estáticos. O JavaScript gerencia as avaliações localmente. Para transformar o GameSquare em uma rede social real, com cadastro e reviews visíveis para todos, o próximo passo será hospedar a API Python e o banco em um serviço externo e configurar o front-end para acessá-los.
