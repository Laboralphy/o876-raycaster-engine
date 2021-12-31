/**
 * Extraction des use-cases d'un cradle awilix
 * @param CreateCharacter
 * @param DeleteCharacter
 * @param GetCharacterList
 * @param SetClientCurrentCharacter
 * @param JoinChannel
 * @param LeaveChannel
 * @param RegisterChatUser
 * @param SendPublicMessage
 * @param SendPrivateMessage
 * @param AuthenticateClient
 * @param ConnectClient
 * @param DisconnectClient
 * @param FindUserClients
 * @param GetClient
 * @param ExecuteCommand
 * @param ParseMessage
 * @param AddUserRole
 * @param ChangeUserPassword
 * @param CreateUser
 * @param EnterMud
 * @param FindUser
 * @param GetUser
 * @param GetUserBanishment
 * @param RemoveUserBanishment
 * @param RemoveUserRole
 * @param SetUserBanishment
 * @returns {{SetUserBanishment, RegisterChatUser, AuthenticateClient, ChangeUserPassword, JoinChannel, SetClientCurrentCharacter, CreateCharacter, GetUserBanishment, RemoveUserBanishment, FindUser, LeaveChannel, GetUser, GetCharacterList, ParseMessage, DisconnectClient, SendPublicMessage, CreateUser, DeleteCharacter, EnterMud, ConnectClient, AddUserRole, ExecuteCommand, FindUserClients, GetClient, SendPrivateMessage, RemoveUserRole}}
 */
function getCradleUseCases ({
  // Use cases
  // use cases : Character
  CreateCharacter,
  DeleteCharacter,
  GetCharacterList,
  SetClientCurrentCharacter,
  // use cases : Chat
  JoinChannel,
  LeaveChannel,
  RegisterChatUser,
  SendPublicMessage,
  SendPrivateMessage,
  // use cases : Client
  AuthenticateClient,
  ConnectClient,
  DisconnectClient,
  FindUserClients,
  GetClient,
  // use cases : Tech
  ExecuteCommand,
  ParseMessage,
  // use cases : User
  AddUserRole,
  ChangeUserPassword,
  CreateUser,
  EnterMud,
  FindUser,
  GetUser,
  GetUserBanishment,
  RemoveUserBanishment,
  RemoveUserRole,
  SetUserBanishment
}) {
  return {
    // Use cases
    // use cases : Character
    CreateCharacter,
    DeleteCharacter,
    GetCharacterList,
    SetClientCurrentCharacter,
    // use cases : Chat
    JoinChannel,
    LeaveChannel,
    RegisterChatUser,
    SendPublicMessage,
    SendPrivateMessage,
    // use cases : Client
    AuthenticateClient,
    ConnectClient,
    DisconnectClient,
    FindUserClients,
    GetClient,
    // use cases : Tech
    ExecuteCommand,
    ParseMessage,
    // use cases : User
    AddUserRole,
    ChangeUserPassword,
    CreateUser,
    EnterMud,
    FindUser,
    GetUser,
    GetUserBanishment,
    RemoveUserBanishment,
    RemoveUserRole,
    SetUserBanishment
  }
}

/**
 * Extraction des services d'un cradle awilix
 * @param CommandRunnerService
 * @param TxatService
 * @param MudService
 * @param DateService
 * @returns {{CommandRunnerService, TxatService, MudService, DateService}}
 */
function getCradleServices ({
  // Services
  CommandRunnerService,
  TxatService,
  MudService,
  DateService
}) {
  return {
    // Services
    CommandRunnerService,
    TxatService,
    MudService,
    DateService
  }
}

module.exports = {
  getCradleUseCases,
  getCradleServices
}
