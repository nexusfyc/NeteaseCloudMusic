export function timeTransfer(time) {
    let minutes = Math.floor(time / 60);
    let second = time % 60;
    minutes = String(minutes).padStart(2, '0');
    second = String(second).padStart(2, '0');
    return `${minutes}:${second}`
}