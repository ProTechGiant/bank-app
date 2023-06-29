/**
 * this function is intended to delay a transition (e.g. screen navigation, modal open/ close) until after
 * a previous transition has been completed.
 *
 * we need to delay subsequent transitions or else the previous transition will block the next one if it hasnt
 * been completed yet causing the app to freeze.
 */

export default function delayTransition(fn: () => void) {
  setTimeout(fn, 500);
}
