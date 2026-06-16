# Rafaela Arquitetura

Site profissional para arquiteta com portfolio, paginas individuais de projetos, feedbacks, contato e painel administrativo.

## Rodar localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sem `.env.local`, o admin local aceita `admin123`. Em producao, defina `ADMIN_PASSWORD` e `ADMIN_SECRET`.

## Como os dados funcionam sem Supabase

O conteudo fica em `data/site-data.json`.

O admin em `/admin` salva projetos, feedbacks e contatos nesse arquivo quando o site esta rodando localmente. Depois disso, basta commitar as alteracoes e a Vercel publica o conteudo atualizado.

Na Vercel, sem banco externo, alteracoes feitas pelo admin online nao ficam salvas de forma permanente. Isso e uma limitacao normal de hospedagem serverless gratuita.

## Fotos dos projetos

Opcoes gratuitas sem Supabase:

- Colocar as fotos em `public/uploads` ou outra pasta dentro de `public` e usar caminhos como `/uploads/foto.jpg`.
- Usar URLs externas das fotos, por exemplo Cloudinary Free, Google Drive publico direto, GitHub raw ou outro lugar onde voce ja tenha os projetos.

Para fotos profissionais, prefira imagens otimizadas em JPG/WebP e nomes sem acentos ou espacos.

## Hospedagem gratuita indicada

- **Vercel** para hospedar o site.
- **GitHub** para versionar o conteudo e acionar deploy automatico.
- **Cloudinary Free** apenas se voce nao quiser guardar fotos no repositorio.

## Fluxo recomendado

1. Rode `npm run dev`.
2. Acesse `/admin`.
3. Cadastre ou edite projetos e feedbacks.
4. Para imagens, faca upload local ou cole a URL onde a foto ja esta hospedada.
5. Commit e push.
6. A Vercel faz o deploy automaticamente.
