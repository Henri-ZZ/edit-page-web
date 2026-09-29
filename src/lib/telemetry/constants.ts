export const SCHEMA_VERSION = 1 as const;
export const MAX_BODY_BYTES = 16 * 1024;
export const MAX_USAGE_DAYS = 7;
export const MAX_COUNTER_PER_KEY_PER_BATCH = 1_000_000;
export const MAX_TOTAL_COUNTERS_PER_BATCH = 7_000_000;
export const MAX_EVENT_AGE_DAYS = 7;
export const MAX_FUTURE_DATE_DAYS = 1;
export const MAX_SENT_AT_AGE_DAYS = 30;
export const MAX_ACCEPTED_BATCHES_PER_INSTALLATION_PER_DAY = 48;
export const MAX_STORED_COUNTER = Number.MAX_SAFE_INTEGER;

export const TELEMETRY_EVENTS = [
  'dashboard.open',
  'edit.start',
  'text.edit',
  'format.bold',
  'format.italic',
  'format.underline',
  'format.strikethrough',
  'format.font_size',
  'format.text_color',
  'format.background_color',
  'image.replace',
  'element.remove',
  'history.undo',
  'history.redo',
  'screenshot.viewport',
  'screenshot.fullpage',
  'screenshot.copy',
  'screenshot.download',
  'monetization.free_limit_reached',
  'monetization.upgrade_shown',
  'monetization.learn_premium_clicked',
  'monetization.activation_started',
  'monetization.activation_succeeded',
  'monetization.activation_failed',
  'monetization.checkin_succeeded',
  'support.review_clicked',
  'support.feedback_clicked',
] as const;

export const ACTIVATION_FAILURE_REASONS = [
  'invalid_key',
  'expired_key',
  'revoked_key',
  'device_limit',
  'network_error',
  'server_error',
  'timeout',
  'unknown',
] as const;

export const ORDINARY_COUNTER_KEYS = TELEMETRY_EVENTS.filter(
  (event) => event !== 'monetization.activation_failed',
);

export const ACTIVATION_FAILURE_COUNTER_KEYS = ACTIVATION_FAILURE_REASONS.map(
  (reason) => `monetization.activation_failed.${reason}` as const,
);

export const ALLOWED_COUNTER_KEYS = new Set<string>([
  ...ORDINARY_COUNTER_KEYS,
  ...ACTIVATION_FAILURE_COUNTER_KEYS,
]);

export const BROWSERS = ['chrome', 'edge', 'brave', 'opera', 'vivaldi', 'other_chromium'] as const;
export const OPERATING_SYSTEMS = ['windows', 'mac', 'linux', 'chromeos', 'android', 'other'] as const;
export const MAX_DISTRIBUTION_LENGTH = 32;
export const LICENSE_TYPES = ['free', 'premium'] as const;
