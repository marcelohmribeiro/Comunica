import { generateHtmlFromScreen } from "@/hooks/_useVLibrasContent";

/**
 * @returns {string} HTML formatado
 */
export const getHomeContent = () => {
  return generateHtmlFromScreen("Página Inicial - Comunica", [
    "Bem-vindo ao Comunica! Este é o seu aplicativo para fazer denúncias e reportar problemas na sua comunidade.",
    {
      title: "📍 O que você pode fazer aqui:",
      content: [
        "Ver denúncias recentes da sua região",
        "Acompanhar o status das denúncias",
        "Visualizar denúncias no mapa",
        'Criar novas denúncias através do botão "Denunciar"',
      ],
    },
    {
      title: "📊 Denúncias Recentes",
      content:
        "Aqui você encontra as denúncias mais recentes da sua comunidade. Deslize horizontalmente para ver todas as denúncias disponíveis.",
    },
    {
      title: "🗺️ Como usar o mapa",
      content:
        "O mapa mostra a localização exata de cada denúncia. Clique em um marcador para ver mais detalhes sobre aquele problema específico.",
    },
  ]);
};

export const getNewReportContent = () => {
  return generateHtmlFromScreen("Nova Denúncia - Comunica", [
    "Nesta tela você pode criar uma nova denúncia de problemas na sua comunidade. Siga o passo a passo abaixo para registrar sua denúncia corretamente.",
    {
      title: "📝 Como criar uma denúncia (Passo a Passo)",
      content: [
        "<strong>1. Escolha a categoria:</strong> Selecione a categoria do problema: buraco na rua, iluminação pública, acúmulo de lixo, poluição, vandalismo, ou outro",
        "<strong>2. Tire uma foto:</strong> Clique no botão da câmera para tirar uma foto do problema",
        "<strong>3. Localização automática:</strong> A localização será capturada automaticamente quando você tirar a foto",
        "<strong>4. Escreva a descrição:</strong> Adicione uma descrição detalhada do problema (máximo 150 caracteres)",
        '<strong>5. Envie:</strong> Clique no botão "Enviar Denúncia" para finalizar',
      ],
    },
    {
      title: "📸 Sobre a Foto",
      content:
        "A foto é <strong>obrigatória</strong> e ajuda as autoridades a entenderem melhor o problema. Tire uma foto clara e bem iluminada do problema que você está reportando.",
    },
    {
      title: "📍 Sobre a Localização",
      content:
        "Sua localização é capturada automaticamente quando você tira a foto. Isso ajuda a identificar exatamente onde está o problema e facilita o trabalho das equipes responsáveis.",
    },
    {
      title: "✅ Dicas para uma boa denúncia",
      content: [
        "Seja específico e claro na descrição",
        "Tire uma foto clara e bem iluminada",
        "Verifique se a categoria está correta",
        "Preencha todos os campos obrigatórios",
        "Descreva detalhes importantes como tamanho do problema, há quanto tempo existe, etc",
      ],
    },
    "Após enviar, você poderá acompanhar o status da sua denúncia na página inicial.",
  ]);
};

export const getProfileContent = (userName, userEmail, isVerified) => {
  const sections = [
    "Esta é a sua página de perfil, onde você pode gerenciar suas informações pessoais e configurações da conta.",
    {
      title: "👤 Suas Informações",
      content: [
        `<strong>Nome:</strong> ${userName || "Não informado"}`,
        `<strong>Email:</strong> ${userEmail || "Não disponível"}`,
        `<strong>Status:</strong> ${
          isVerified ? "Email verificado ✓" : "Email não verificado"
        }`,
      ],
    },
    {
      title: "✏️ Editar Perfil",
      content:
        'Você pode atualizar seu nome e telefone clicando no botão "Editar perfil". Mantenha suas informações atualizadas para facilitar o contato caso necessário.',
    },
  ];

  if (!isVerified) {
    sections.push({
      title: "📧 Verificação de Email",
      content:
        '<strong>Atenção:</strong> Seu email ainda não foi verificado. Clique em "Enviar verificação de email" para receber um link de confirmação no seu email. A verificação é importante para garantir a segurança da sua conta.',
    });
  }

  sections.push({
    title: "🚪 Sair da Conta",
    content:
      'Para sair da sua conta, clique no botão vermelho "Sair" abaixo. Você precisará fazer login novamente para acessar o aplicativo.',
  });

  return generateHtmlFromScreen("Seu Perfil - Comunica", sections);
};
