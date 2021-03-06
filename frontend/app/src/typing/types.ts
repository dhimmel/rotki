import { Currency } from '@/model/currency';
import { SupportedDefiProtocols } from '@/services/defi/types';
import { SupportedModules } from '@/services/session/types';
import { AssetBalances } from '@/store/balances/types';
import { SyncConflictPayload } from '@/store/session/types';

export interface GeneralSettings {
  readonly floatingPrecision: number;
  readonly anonymizedLogs: boolean;
  readonly anonymousUsageAnalytics: boolean;
  readonly historicDataStart: string;
  readonly ethRpcEndpoint: string;
  readonly balanceSaveFrequency: number;
  readonly dateDisplayFormat: string;
  readonly thousandSeparator: string;
  readonly decimalSeparator: string;
  readonly currencyLocation: 'after' | 'before';
  readonly selectedCurrency: Currency;
  readonly krakenAccountType: string;
  readonly activeModules: SupportedModules[];
}

export interface AccountingSettings {
  readonly includeCrypto2Crypto: boolean;
  readonly includeGasCosts: boolean;
  readonly taxFreeAfterPeriod: number | null;
}

export type AccountingSettingsUpdate = {
  +readonly [P in keyof AccountingSettings]+?: AccountingSettings[P];
};

export interface Credentials {
  readonly username: string;
  readonly password: string;
  readonly syncApproval?: SyncApproval;
  readonly apiKey?: string;
  readonly apiSecret?: string;
  readonly submitUsageAnalytics?: boolean;
}

export type UsdToFiatExchangeRates = { [key: string]: number };

export interface ExchangeInfo {
  readonly name: string;
  readonly balances: AssetBalances;
}

export type ExchangeData = { [exchange: string]: AssetBalances };

export interface TaxReportEvent {
  readonly start: number;
  readonly end: number;
}

export interface FiatExchangeRates {
  [currency: string]: string;
}

export interface AccountSession {
  [account: string]: 'loggedin' | 'loggedout';
}

export interface TaskResult<T> {
  outcome: T | null;
  status: 'completed' | 'not-found' | 'pending';
}

export const ETH = 'ETH';
export const BTC = 'BTC';

export const SupportedBlockchains = [ETH, BTC] as const;

export type Blockchain = typeof SupportedBlockchains[number];

export class SyncConflictError extends Error {
  readonly payload: SyncConflictPayload;

  constructor(message: string, payload: SyncConflictPayload) {
    super(message);
    this.payload = payload;
  }
}

export type SyncApproval = 'yes' | 'no' | 'unknown';

export interface UnlockPayload {
  readonly username: string;
  readonly password: string;
  readonly create: boolean;
  readonly syncApproval: SyncApproval;
  readonly apiKey?: string;
  readonly apiSecret?: string;
  readonly submitUsageAnalytics?: boolean;
}

export type SettingsUpdate = {
  +readonly [P in keyof SettingsPayload]+?: SettingsPayload[P];
};

interface SettingsPayload {
  balance_save_frequency: number;
  main_currency: string;
  anonymized_logs: boolean;
  submit_usage_analytics: boolean;
  historical_data_start: string;
  eth_rpc_endpoint: string;
  ui_floating_precision: number;
  date_display_format: string;
  thousand_separator: string;
  decimal_separator: string;
  currency_location: GeneralSettings['currencyLocation'];
  include_gas_costs: boolean;
  include_crypto2crypto: boolean;
  taxfree_after_period: number;
  kraken_account_type: string;
  premium_should_sync: boolean;
  active_modules: SupportedModules[];
  frontend_settings: string;
}

export type ExternalServiceName = 'etherscan' | 'cryptocompare';

export interface ExternalServiceKey {
  readonly name: ExternalServiceName;
  readonly api_key: string;
}

export interface Tag {
  readonly name: string;
  readonly description: string;
  readonly background_color: string;
  readonly foreground_color: string;
}

export interface Tags {
  [tag: string]: Tag;
}

export interface AccountData {
  readonly address: string;
  readonly label: string;
  readonly tags: string[];
}

export type AccountDataMap = { [address: string]: AccountData };

export interface Account {
  readonly chain: Blockchain;
  readonly address: string;
}

export interface DefiAccount extends Account {
  readonly protocols: SupportedDefiProtocols[];
}

export interface GeneralAccount extends AccountData, Account {}
