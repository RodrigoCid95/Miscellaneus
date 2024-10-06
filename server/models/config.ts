import { type Database } from "sqlite3"

export class ConfigModel {
  @Library('db') private db: Database

  public async loadConfig(): Promise<Miscellaneous.Config> {
    const result = await new Promise<Miscellaneous.ConfigResult[]>(resolve => this.db.all<Miscellaneous.ConfigResult>('SELECT * FROM config', (_, row) => resolve(row)))
    const config: any = {}
    for (const row of result) {
      config[row.key] = row.value
    }
    return {
      name: config.name,
      ipPrinter: config.ip_printer
    }
  }
  public async updateConfig(config: Miscellaneous.Config) {
    await new Promise<void>(resolve => this.db.run('UPDATE config SET value = ? WHERE key = ?', [config.name, 'name'], resolve))
    await new Promise<void>(resolve => this.db.run('UPDATE config SET value = ? WHERE key = ?', [config.ipPrinter, 'ip_printer'], resolve))
  }
}