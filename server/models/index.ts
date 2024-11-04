export * from './barCodes'
export * from './config'
export * from './history'
export * from './products'
export * from './providers'
export * from './sales'
export * from './users'

export class CertificateModel {
  @Library('certificate') public certificate: string
}