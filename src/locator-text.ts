export function exactText(label: string): RegExp {
    const escaped = label.replace(/[.*+?^$()|[\]{}\\]/g, '\\$&');

    return new RegExp('^\\s*' + escaped + '\\s*$');
}
