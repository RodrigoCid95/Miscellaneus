@Namespace('config')
export class ConfigController {
  @Model('ConfigModel') private configModel: Models<'ConfigModel'>

  @On('get')
  public get(): Promise<Miscellaneous.Config> {
    return this.configModel.loadConfig()
  }

  @On('set')
  public set(config: Miscellaneous.Config): Promise<void> {
    return this.configModel.updateConfig(config)
  }
}