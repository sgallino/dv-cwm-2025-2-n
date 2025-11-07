const TYPES_MAP = {
    'image/jpeg': 'jpg',
    'image/pjpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/avif': 'avif',
}

export function inferExtensionFromMIME(type) {
    return TYPES_MAP[type] ?? null;
}