/**
 * Extraction des use-cases d'un cradle awilix
 * @param cradle
 */
function getCradleService ({
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
  getCradleService
}
