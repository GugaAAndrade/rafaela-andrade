# Rafaela Arquitetura

Site profissional para arquiteta com portfolio, paginas individuais de projetos, feedbacks, contato e painel administrativo.

## Rodar localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sem `.env.local`, o admin local aceita `admin123`. Em producao, defina `ADMIN_PASSWORD`, `ADMIN_SECRET`, as credenciais do Cloudinary e `DATABASE_URL`.

## Como os dados funcionam

Com `DATABASE_URL` configurado, projetos, feedbacks e contatos passam a ser salvos no Neon Postgres.

Sem `DATABASE_URL`, o projeto cai no fallback local em `data/site-data.json`.

Na primeira execucao com banco vazio, o app importa automaticamente os dados atuais do JSON local para o Neon.

## Fotos dos projetos

As fotos sobem pelo admin e sao enviadas para o Cloudinary.

Fluxo:

1. Entre em `/admin`.
2. Crie ou edite um projeto.
3. Use `Upload de imagens` para selecionar uma ou varias fotos.
4. A primeira imagem enviada vira a capa caso `Imagem principal` ainda esteja vazia.
5. As URLs retornadas pelo Cloudinary entram automaticamente na galeria do projeto.

Os campos de URL continuam disponiveis como fallback manual.

## Hospedagem gratuita indicada

- **Vercel** para hospedar o site.
- **GitHub** para versionar o conteudo e acionar deploy automatico.
- **Cloudinary Free** para armazenar e servir as imagens dos projetos.
- **Neon** para persistir projetos, feedbacks e contatos do admin.

## Fluxo recomendado

1. Rode `npm run dev`.
2. Acesse `/admin`.
3. Cadastre ou edite projetos e feedbacks.
4. Para imagens, faca upload no admin. Se precisar, cole URLs manualmente como fallback.
5. Commit e push.
6. A Vercel faz o deploy automaticamente.
