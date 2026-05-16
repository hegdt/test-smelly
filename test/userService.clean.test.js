const { UserService } = require('../src/userService');

describe('UserService - Suíte de Testes Limpa', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test('deve criar um usuário ativo com os dados informados', () => {
    const nome = 'Fulano de Tal';
    const email = 'fulano@teste.com';
    const idade = 25;

    const usuarioCriado = userService.createUser(nome, email, idade);

    expect(usuarioCriado).toEqual(expect.objectContaining({
      id: expect.any(String),
      nome,
      email,
      idade,
      isAdmin: false,
      status: 'ativo',
      createdAt: expect.any(Date),
    }));
  });

  test('deve buscar um usuário existente pelo id', () => {
    const usuarioCriado = userService.createUser('Maria', 'maria@teste.com', 29);

    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    expect(usuarioBuscado).toEqual(expect.objectContaining({
      id: usuarioCriado.id,
      nome: 'Maria',
      email: 'maria@teste.com',
      status: 'ativo',
    }));
  });

  test('deve retornar null ao buscar um usuário inexistente', () => {
    const idInexistente = 'usuario-inexistente';

    const usuarioBuscado = userService.getUserById(idInexistente);

    expect(usuarioBuscado).toBeNull();
  });

  test('deve desativar um usuário comum', () => {
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('não deve desativar um usuário administrador', () => {
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    const resultado = userService.deactivateUser(usuarioAdmin.id);
    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

    expect(resultado).toBe(false);
    expect(usuarioAtualizado.status).toBe('ativo');
  });

  test('deve gerar relatório para usuários cadastrados', () => {
    userService.createUser('Alice', 'alice@email.com', 28);
    userService.createUser('Bob', 'bob@email.com', 32);

    const relatorio = userService.generateUserReport();

    expect(relatorio).toEqual(expect.stringContaining('Relatório de Usuários'));
    expect(relatorio).toEqual(expect.stringContaining('Alice'));
    expect(relatorio).toEqual(expect.stringContaining('Bob'));
    expect(relatorio).toEqual(expect.stringContaining('ativo'));
  });

  test('deve informar quando o relatório não possui usuários cadastrados', () => {
    const relatorio = userService.generateUserReport();

    expect(relatorio).toEqual(expect.stringContaining('Nenhum usuário cadastrado.'));
  });

  test('deve lançar erro ao criar usuário menor de idade', () => {
    const criarUsuarioMenorDeIdade = () => {
      userService.createUser('Menor', 'menor@email.com', 17);
    };

    expect(criarUsuarioMenorDeIdade).toThrow('O usuário deve ser maior de idade.');
  });
});
