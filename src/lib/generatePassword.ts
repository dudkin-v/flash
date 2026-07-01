export interface PasswordConfig {
    length: number;
    uppercase: boolean;
    lowercase: boolean;
    digits: boolean;
    symbols: boolean;
}

export const DEFAULT_PASSWORD_CONFIG: PasswordConfig = {
    length: 8,
    uppercase: true,
    lowercase: true,
    digits: true,
    symbols: true,
};

const CHARS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    digits: '0123456789',
    symbols: '!@#$&',
};

export function generatePassword(config: PasswordConfig): string {
    const pools = (Object.keys(CHARS) as Array<keyof typeof CHARS>).filter((k) => config[k]);

    if (pools.length === 0) return '';

    const alphabet = pools.map((k) => CHARS[k]).join('');

    const required = pools.map((k) => {
        const pool = CHARS[k];
        return pool[Math.floor(Math.random() * pool.length)];
    });

    const rest = Array.from({ length: Math.max(0, config.length - required.length) }, () =>
        alphabet[Math.floor(Math.random() * alphabet.length)]
    );

    const chars = [...required, ...rest];

    for (let i = chars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    return chars.join('');
}
