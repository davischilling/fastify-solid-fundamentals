# App

GymPass style app.

## RFs (Requisitos Funcionais)

- [X] Deve ser possível se cadastrar na aplicação.
- [X] Deve ser possível se autenticar na aplicação.
- [X] Deve ser possível obter o perfil de um usuário logado.
- [ ] Deve ser possível obter o número de check-ins realizados pelo usuário logado.
- [ ] Deve ser possível obter o histórico de check-ins realizados pelo usuário logado.
- [ ] Deve ser possível buscar as academias mais próximas do usuário logado.
- [ ] Deve ser possível buscar uma academias pelo nome.
- [ ] Deve ser possível o usuário realizar um check-in em uma academia.
- [ ] Deve ser possível validar o check-in de um usuário em uma academia.
- [ ] Deve ser possível cadastrar uma academia.

## RNs (Requisitos de Negócio)

- [X] O usuário não deve poder se cadastrar com um e-mail já utilizado.
- [ ] O usuário não pode fazer mais de 2 check-ins no mesmo dia.
- [ ] O usuário não pode fazer check-in se não estiver perto (100m) da academia.
- [X] O check-in só pode ser criado para usuários e academias cadastrados.
- [ ] O check-in só pode ser validado até 20 minutos após criado.
- [ ] O check-in só pode ser validado por administradores.
- [ ] A academia só pode ser cadastrada por administradores.

## RNFs (Requisitos Não Funcionais)

- [X] A senha do usuário precisa estar criptografada.
- [X] Os dados da aplicação precisam estar armazenados em um banco de dados PostgreSQL.
- [ ] Todas listas de dados precisam ser paginadas com 20 itens por página.
- [ ] O usuário deve ser identificado por um token JWT (JSON Web Token).