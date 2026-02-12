Fluxo padrão (recomendado)

Faça suas alterações (node/credentials/README etc.)

Rode os checks locais:

npm run lint
npm run build


Commit das mudanças:

git add -A
git commit -m "feat: adiciona operação X"   # ou "fix: corrige Y"
git push


Publicar a nova versão:

npm run release


Quando ele perguntar o incremento:

patch (0.1.1 → 0.1.2): correções pequenas

minor (0.1.1 → 0.2.0): nova funcionalidade sem quebrar

major (0.x → 1.0.0): mudança que quebra / marco importante

O release vai:

atualizar a versão

gerar/atualizar changelog

criar tag no git

publicar no npm

criar release no GitHub (automático se tiver GITHUB_TOKEN, senão “web-based”)





